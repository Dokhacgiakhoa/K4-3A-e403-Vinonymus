/**
 * Google Apps Script - Webhook Tiếp nhận Khảo sát Chuyên Sâu 12 Câu Hỏi & Quay Thưởng Tri Ân
 * Dự án: AI Diagnostic Study Planner (Nhóm Vinonymus - Track E)
 * 
 * QUY TẮC MÃ DỰ THƯỞNG:
 * Mã dự thưởng chính là Mã Học Viên (studentId) duy nhất của mỗi người.
 * Tránh trường hợp 1 người điền nhiều lần để cơ cấu số lượng mã số.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Thiết lập dòng tiêu đề (Header) nếu sheet đang trống
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Thời Gian",
        "Mã Học Viên (Mã Dự Thưởng)",
        "Họ và Tên",
        "Email",
        "Nền Tảng",
        "Thông Tin MoMo / STK Nhận Thưởng",
        "Câu 1: Tự Biết Điểm Yếu/Hổng?",
        "Câu 2: Khó Khăn/Nỗi Đau Gặp Phải (Multi-select)",
        "Câu 3: Thời Gian Mất Để Gom Tài Liệu",
        "Câu 4: Cách Xử Lý Khi Kẹt Bài (Multi-select)",
        "Câu 5: Tính Khả Thi Của Giải Pháp AI",
        "Câu 6: Nhu Cầu Lộ Trình Cá Nhân Hóa",
        "Câu 7: Nhu Cầu AI Bù Đắp Kiến Thức Hổng",
        "Câu 8: Tính Năng Muốn Dùng Nhất (Multi-select)",
        "Câu 9: Đánh Giá Ý Tưởng (1-5)",
        "Câu 10: Độ Trực Quan UI",
        "Câu 11: Điểm Cần Cải Thiện UI (Multi-select)",
        "Câu 12: Sẵn Sàng Thử CP4/CP5 (Willing User)",
        "Góp Ý Thêm Cho Nhóm",
        "Discord / Zalo"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0284c7").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Mã dự thưởng chính là Mã Học Viên để đảm bảo tính duy nhất và công bằng
    var studentId = (data.studentId || "").trim();
    var ticketCode = studentId || (data.ticketCode || "Chưa nhập mã");

    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

    var row = [
      timestamp,
      ticketCode,
      data.fullName || "",
      data.email || "",
      data.background || "",
      data.rewardAccount || "",
      data.selfAwarenessOfGaps || "",
      formatMultiSelect(data.primaryPainPoints),
      data.timeWasted || "",
      formatMultiSelect(data.currentWorkarounds),
      data.solutionFeasibility || "",
      data.wantPersonalizedRoadmap || "",
      data.wantAiGapFilling || "",
      formatMultiSelect(data.mostWantedFeatures),
      data.overallRating || "",
      data.usabilityRating || "",
      formatMultiSelect(data.uiImprovements),
      data.willingToTest || "",
      data.generalFeedback || "",
      data.contactHandle || ""
    ];

    sheet.appendRow(row);

    // Gửi Email xác nhận kèm Mã Học Viên (Mã Dự Thưởng) qua Gmail
    if (data.email) {
      sendConfirmationEmail(data, ticketCode);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      ticketCode: ticketCode,
      message: "Khảo sát đã lưu thành công! Mã dự thưởng quay quà của bạn chính là mã học viên: " + ticketCode
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function formatMultiSelect(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value.map(function(item) { return "• " + item; }).join("\n");
  }
  return String(value);
}

function getStarDisplay(rating) {
  var num = parseInt(rating, 10) || 5;
  if (num < 1) num = 1;
  if (num > 5) num = 5;
  var stars = "";
  for (var i = 0; i < num; i++) {
    stars += "★";
  }
  for (var j = num; j < 5; j++) {
    stars += "☆";
  }
  return stars + " (" + num + "/5 sao)";
}

function sendConfirmationEmail(data, ticketCode) {
  var recipientEmail = data.email;
  var recipientName = data.fullName || "Bạn";
  
  // Tiêu đề email hoàn toàn không dùng emoji 4-byte để triệt tiêu lỗi font hình thoi chấm hỏi
  var subject = "[Vinonymus E403] Xác nhận khảo sát & Mã quay thưởng học viên: " + ticketCode;

  var starRatingHtml = getStarDisplay(data.overallRating);

  var htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 24px 10px; background-color: #070d19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);">
        
        <!-- HEADER BANNER -->
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 40%, #1d4ed8 100%); padding: 32px 24px; text-align: center;">
          <div style="display: inline-block; padding: 4px 14px; background: rgba(255, 255, 255, 0.16); border-radius: 999px; font-size: 11px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
            MINI HACKATHON AI &bull; BATCH 04 &bull; TRACK E
          </div>
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.3;">
            Adaptive Learning System
          </h1>
          <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 13px; font-weight: 500;">
            AI Mentor (Chẩn đoán & Lộ trình) &bull; AI Helpdesk 24/7 (Hỗ trợ tức thì)
          </p>
        </div>

        <!-- LUCKY DRAW TICKET CARD -->
        <div style="padding: 24px 20px; background-color: #131f37; border-bottom: 1px solid #1e293b; text-align: center;">
          <div style="background: #090e1a; border: 2px dashed #38bdf8; border-radius: 14px; padding: 22px 18px; max-width: 480px; margin: 0 auto; box-shadow: inset 0 2px 8px rgba(0,0,0,0.4);">
            
            <div style="display: inline-block; padding: 4px 12px; background-color: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 6px; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
              MÃ HỌC VIÊN QUAY THƯỞNG DUY NHẤT
            </div>

            <div style="font-size: 34px; font-weight: 900; color: #fbbf24; letter-spacing: 4px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; padding: 12px 0 8px 0; text-shadow: 0 0 15px rgba(251, 191, 36, 0.4);">
              ` + escapeHtml(ticketCode) + `
            </div>

            <div style="border-top: 1px solid #1e293b; margin-top: 10px; padding-top: 12px; text-align: left; font-size: 12.5px; color: #cbd5e1; line-height: 1.7;">
              <div style="margin-bottom: 5px;">
                <span style="color: #38bdf8; font-weight: 700;">[THỜI GIAN QUAY]</span> 17h20 &bull; Thứ Sáu, ngày 18/09/2026
              </div>
              <div style="margin-bottom: 5px;">
                <span style="color: #fbbf24; font-weight: 700;">[CƠ CẤU 10 GIẢI]</span> 1 Nhất (100k) &bull; 2 Nhì (50k) &bull; 3 Ba (20k) &bull; 4 Tư (10k)
              </div>
              <div style="margin-bottom: 5px;">
                <span style="color: #a78bfa; font-weight: 700;">[TÀI KHOẢN NHẬN]</span> ` + escapeHtml(data.rewardAccount || "Đã lưu trong hệ thống") + `
              </div>
              <div style="font-size: 11px; color: #94a3b8; font-style: italic; margin-top: 8px; border-top: 1px dashed #1e293b; padding-top: 6px;">
                * Quy định: Mỗi học viên sử dụng đúng Mã Học Viên duy nhất để quay thưởng, bảo đảm 100% công bằng và minh bạch.
              </div>
            </div>

          </div>
        </div>

        <!-- MAIN BODY CONTENT -->
        <div style="padding: 28px 24px; background-color: #0f172a;">
          <p style="font-size: 15px; line-height: 1.6; color: #f8fafc; margin-top: 0; margin-bottom: 12px;">
            Xin chào <strong>` + escapeHtml(recipientName) + `</strong> (Mã HV: <strong style="color: #fbbf24;">` + escapeHtml(ticketCode) + `</strong>),
          </p>
          <p style="font-size: 13.5px; line-height: 1.6; color: #94a3b8; margin-top: 0; margin-bottom: 20px;">
            Đội thi <strong>Vinonymus (Phòng E403)</strong> xin chân thành cảm ơn những đánh giá thực tế và khách quan của bạn. Đây là nguồn dữ liệu thực chứng quý báu giúp chúng tôi chứng minh bài toán và hoàn thiện giải pháp hệ sinh thái học tập thích ứng (Adaptive Learning).
          </p>

          <!-- RESPONSE SUMMARY CARD -->
          <div style="background-color: #1e293b; border-radius: 12px; padding: 18px 20px; border-left: 4px solid #0284c7; margin: 20px 0;">
            <div style="font-size: 13px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
              [TÓM TẮT THÔNG TIN ĐÓNG GÓP]
            </div>
            
            <table style="width: 100%; font-size: 13px; color: #cbd5e1; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 9px 0; color: #94a3b8; width: 44%;">Mã học viên:</td>
                <td style="padding: 9px 0; font-weight: 700; color: #fbbf24;">` + escapeHtml(ticketCode) + `</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 9px 0; color: #94a3b8;">Nền tảng của bạn:</td>
                <td style="padding: 9px 0; font-weight: 600; color: #f1f5f9;">` + escapeHtml(data.background || "Chưa chọn") + `</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 9px 0; color: #94a3b8;">Nhận diện lỗ hổng:</td>
                <td style="padding: 9px 0; color: #f1f5f9;">` + escapeHtml(data.selfAwarenessOfGaps || "Chưa chọn") + `</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 9px 0; color: #94a3b8;">Tính khả thi giải pháp:</td>
                <td style="padding: 9px 0; font-weight: 600; color: #34d399;">` + escapeHtml(data.solutionFeasibility || "Chưa chọn") + `</td>
              </tr>
              <tr>
                <td style="padding: 9px 0; color: #94a3b8;">Đánh giá ý tưởng:</td>
                <td style="padding: 9px 0; font-weight: 700; color: #fbbf24;">` + starRatingHtml + `</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #131f37; border: 1px solid #1e293b; border-radius: 10px; padding: 14px 16px; margin-top: 20px;">
            <p style="font-size: 12.5px; line-height: 1.6; color: #cbd5e1; margin: 0;">
              Kết quả quay thưởng sẽ được công bố vào lúc <strong>17h20 ngày 18/09</strong> đối chiếu theo Mã Học Viên của bạn. Tiền thưởng sẽ được gửi trực tiếp đến tài khoản MoMo/STK đã đăng ký. Chúc bạn may mắn!
            </p>
          </div>
        </div>

        <!-- FOOTER -->
        <div style="background-color: #070d19; padding: 22px 20px; text-align: center; border-top: 1px solid #1e293b; font-size: 11.5px; color: #64748b; line-height: 1.6;">
          <p style="margin: 0 0 6px 0;">
            Hệ Thống <strong>Adaptive Learning (AI Mentor & AI Helpdesk)</strong> &bull; Nhóm Vinonymus (Phòng E403)
          </p>
          <p style="margin: 0;">
            Email tự động được gửi từ hệ thống khảo sát thực nghiệm Mini Hackathon AI. Vui lòng lưu email này để đối chiếu kết quả.
          </p>
        </div>

      </div>

    </body>
    </html>
  `;

  GmailApp.sendEmail(recipientEmail, subject, "", {
    htmlBody: htmlBody,
    name: "Adaptive Learning (Vinonymus E403)"
  });
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
