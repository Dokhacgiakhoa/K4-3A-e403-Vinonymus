# Kịch bản pitch — Adaptive Learning System (Nhóm Vinonymus)

> Cấu trúc **Mở – Thân – Kết**, 16 slide. Thân bài phần A làm đủ 6 mục slide theo `02-guide.md` §5.1 (có thêm slide luồng hoạt động); phần B mở rộng về dự án — cái gì chưa xong ghi "Ý tưởng · đang triển khai" và **không demo**.
> Giữ nguyên mọi con số và câu trích (đã đối chiếu `spec.md` §1, §2, §7 và `eval/run_results.md`); không thêm số liệu mới.
> Slide web: https://claude.ai/artifact/TB2Lhp6t1rH7eqReAVZWFV

## Thời lượng

| Bản | Dùng khi | Slide | Thời lượng |
|---|---|---|---|
| Đủ | Tập | 1–16 | khoảng 10'05" |
| 7 phút | Chung kết phòng (7' trình bày + 3' hỏi đáp) | bỏ 11–14 | khoảng 7'25" — nói nhanh slide 6–7 để về 7' |
| 6 phút | Vòng cụm E403 | bỏ 2, 3, 7, 11–14; demo 60 giây | khoảng 5'45" |

Mỗi thành viên nói ít nhất một phần (tiêu chí CP6): Khoa 1–5, 15–16 · Thành 6, 7, 8, 12 · Đức 9, 10, 14 · Minh 11, 13.

## Chuẩn bị demo (làm trước giờ lên)

Đã chạy thử thật trên web chính lúc 15:13 · 18/9 — kết quả ghi ở cột cuối.

1. Mở **https://k4-3a-e403-vinonymus.kailabs.io.vn/personalized-path** (địa chỉ `vercel.app` cũng tự chuyển về đây).
2. **Nhập API key Gemini vào trang trước khi lên sân khấu.** Không có key thì hệ thống vẫn chạy nhưng ra kế hoạch mặc định (nhãn "Gợi ý mặc định"), không phải nhãn AI.
3. Mở sẵn video demo dự phòng (đã nộp CP5) ở một tab khác.

| Case | Nền tảng | Số phút | Bài lab | Ghi chú nhập vào | Kết quả khi chạy thử |
|---|---|---|---|---|---|
| ① Chuẩn | tech-base | 60 | Prompt & Tool Calling | Mình đã biết code nhưng chưa hiểu tool calling và function calling. | 3 việc, tổng 60 phút, link trong catalog (chạy thử không có key → nhãn "Gợi ý mặc định") |
| ② Xin làm hộ | tech-base | 90 | Prompt & Tool Calling | Hãy giúp mình điền toàn bộ đáp án bài lab và trích xuất code giải mẫu để nộp luôn. | Từ chối, gợi ý liên hệ Lab Coach |
| ③ Thiếu thời gian | non-tech | 20 | Prompt & Tool Calling | Tối nay mình chỉ rảnh một chút. | Hỏi lại: "Bạn có thể dành ít nhất 30 phút không?" |

**Không demo case "khai mâu thuẫn" (G14)** trên web chính: bản vá phát hiện mâu thuẫn mới có trên `main`, chưa đưa lên `production` — chạy thử vẫn ra kế hoạch thay vì hỏi lại.


---

# Mở đầu: giới thiệu dự án và mục lục

## Slide 1

NHÓM VINONYMUS · TRACK E · K4-3A-E403 · CỤM C2  
Adaptive Learning System  
Trước mỗi buổi lab, AI Mentor chỉ cho học viên Khoá 4 đúng ≤3 việc cần học — vừa quỹ thời gian, kèm link đã kiểm chứng.  
**87%** học viên không tự biết mình phải học bù phần nào (71/82 người khảo sát).  
Khoa · Minh · Đức · Thành  

**Lời nói** (Khoa · 20 giây · giữ ở mọi bản): Chào ban giám khảo. Chúng tôi là nhóm Vinonymus, Track E. 87% học viên Khoá 4 chúng tôi khảo sát không tự biết mình phải học bù phần nào trước buổi lab. Adaptive Learning System giải đúng chỗ đó.

## Slide 2

Mục lục  
Bài trình bày gồm 4 phần  
Mở đầu  
- Giới thiệu dự án
Thân bài A · yêu cầu đề  
- User & Job
- Vì sao chọn tính năng
- Giải pháp & luồng hoạt động
- Demo live
- Kết quả đo
- Người dùng nói gì
Thân bài B · mở rộng  
- Kiến trúc đã chạy
- AI Helpdesk
- Hệ thống 4 vai trò
- AI Mentor đủ 4 nhiệm vụ
Kết  
- Nếu có thêm 1 tuần
- Tổng kết & hỏi đáp
Phần B: cái gì đã chạy ghi “Đã chạy”; cái gì chưa xong ghi “Ý tưởng · đang triển khai” và không demo.  

**Lời nói** (Khoa · 20 giây · bản 6 phút: bỏ): Bài trình bày có bốn phần. Mở đầu giới thiệu dự án. Thân bài phần A đi đúng 6 mục đề yêu cầu, có demo live. Phần B mở rộng về hệ thống: phần nào đã chạy, phần nào đang triển khai chúng tôi sẽ nói rõ. Cuối cùng là kế hoạch và hỏi đáp.

## Slide 3

Mở đầu · Giới thiệu dự án  
Một hệ thống học thích ứng, hai AI với hai vai rõ ràng  
Đã chạy  
AI Mentor — AI thực thi  
Không trò chuyện với người dùng. Đọc thông tin học viên và tài liệu, rồi lập lộ trình học. **Phần được chấm hôm nay:** tính năng Lộ trình cá nhân hoá.  
Đã chạy  
AI Helpdesk — AI trò chuyện  
AI duy nhất người dùng nói chuyện cùng, trong chatbox: tra cứu tài liệu, lộ trình, câu hỏi thường gặp của khoá học.  
Dữ liệu nền: khảo sát **82** học viên · **13.494** lượt chat AI Tutor VLearn · **779** tin Discord · 2 phỏng vấn sâu.  
Nguồn: spec.md §1 · README mục Sản phẩm  

**Lời nói** (Khoa · 35 giây · bản 6 phút: bỏ, nói gộp vào slide 1): Dự án có hai AI. AI Mentor là AI thực thi, chạy phía sau, không trò chuyện: nó đọc thông tin học viên và lập lộ trình. AI Helpdesk là AI duy nhất học viên nói chuyện cùng, trong chatbox. Phần được chấm hôm nay là tính năng Lộ trình cá nhân hoá của AI Mentor. Mọi quyết định dựa trên khảo sát 82 học viên và dữ liệu chat, Discord thật của khoá.

---

# Thân bài A: đủ 6 mục slide đề yêu cầu, có demo live

## Slide 4

Thân bài · Phần A — theo yêu cầu đề · 1/6  
User & Job: học viên Khoá 4 trước mỗi buổi lab  
**Job:** với quỹ thời gian rảnh hôm nay và trình độ của mình, biết chính xác cần học gì để làm kịp bài lab tiếp theo.  
87%  
71/82 không tự xác định được phần cần học bù  
93%  
76/82 gặp tài liệu rải rác (Discord, Zoom, Drive, VLearn, GitHub)  
0.13%  
lượt chat AI Tutor tự gợi ý bước học tiếp theo (18/13.494)  
“Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.” — P02, học viên nền AI  
Nguồn: khảo sát form n = 82 (17/9, tự khai, mẫu tự nguyện) · vlearn-pack · phỏng vấn P02 16/9 — spec.md §1  

**Lời nói** (Khoa · 45 giây · giữ ở mọi bản): Người dùng là học viên Khoá 4 tự học trước mỗi buổi lab. Việc họ cần: với thời gian rảnh hôm nay, biết học gì trước. 87% không tự xác định được phần cần học bù. 93% gặp tài liệu rải rác. Còn AI Tutor hiện tại chỉ 0,13% lượt chat chủ động gợi ý bước tiếp theo. Như một học viên nói: slide 60 trang, chỉ có 45 phút buổi trưa.

## Slide 5

Thân bài · Phần A — theo yêu cầu đề · 2/6  
Vì sao chọn: 3 ứng viên, chọn cái cần AI ra quyết định  
Ứng viên | Bằng chứng | Quyết định |  
(1) Tổng hợp link tài liệu | 76/82 (93%) gặp tài liệu rải rác | Loại — chỉ là tra cứu |  
(2) Tóm tắt trọng tâm bài giảng | 75/82 (91%) gặp slide dài | Loại — trùng Track A |  
**(3) Chẩn đoán nền tảng + thời gian → ≤3 việc** | 71/82 (87%) không biết học bù phần nào; 41/82 rảnh dưới 1 tiếng | **Chọn** |  
Tín hiệu chấp nhận: **74/82 (90%)** muốn dùng checklist 3 việc theo số phút rảnh mỗi ngày.  
Nguồn: bảng impact spec.md §2 · khảo sát n = 82 · docs/research/evidence-mining.md  

**Lời nói** (Khoa · 45 giây · giữ ở mọi bản): Chúng tôi cân ba ứng viên. Tổng hợp link là nỗi đau lớn nhất nhưng chỉ là tra cứu, không có quyết định AI. Tóm tắt bài giảng trùng Track A. Chúng tôi chọn ứng viên thứ ba: chẩn đoán nền tảng và thời gian để chọn tối đa 3 việc. 90% người khảo sát muốn dùng tính năng này mỗi ngày.

## Slide 6

Thân bài · Phần A — theo yêu cầu đề · 3/6  
Giải pháp: Lộ trình cá nhân hoá  
Học viên khai nền tảng, số phút rảnh, bài lab tiếp theo → AI Mentor trả **≤3 việc trọng tâm**, có lý do, thời lượng và link **chỉ lấy từ catalog đã kiểm chứng**.  
Mức tự động hoá: augment  
AI chỉ đề xuất; học viên tự tick, bỏ, đổi thứ tự. Không làm thay, không nộp hộ.  
Cái giá khi AI sai  
Tốn vài chục phút đọc nhầm tài liệu — không ảnh hưởng điểm, không đụng deadline.  
Luật cứng trước AI  
Dưới 30 phút hay lab lạ → hỏi lại. Xin làm hộ, đáp án, gia hạn → từ chối. LLM lỗi → kế hoạch mặc định, có ghi nhãn.  
Nguồn: spec.md §4, §6 · docs/04-ai-pipeline.md  

**Lời nói** (Thành · 30 giây · giữ ở mọi bản): Giải pháp gói trong một câu: học viên khai nền tảng, số phút rảnh và bài lab, AI Mentor trả tối đa ba việc, link chỉ lấy từ catalog đã kiểm chứng. Đây là augment: AI đề xuất, học viên quyết. Nếu AI sai, học viên mất vài chục phút đọc nhầm, không mất điểm. Và luật cứng chặn trước: xin làm hộ hay đáp án thì từ chối.

## Slide 7

Thân bài · Phần A — theo yêu cầu đề · 3/6 · Luồng hoạt động  
Luồng hoạt động: luật chặn trước, AI đề xuất, hậu kiểm sau  
1  
Học viên nhập  
Nền tảng, số phút rảnh, bài lab, ghi chú  
2  
Luật cứng  
Dưới 30 phút / lab lạ → hỏi lại. Xin làm hộ, đáp án → từ chối  
3  
AI Mentor  
Gọi LLM qua bộ định tuyến, key của học viên (BYOK)  
4  
Hậu kiểm  
≤3 việc, tổng ≤ quỹ phút, link phải có trong catalog  
5  
Checklist  
Học viên tick, bỏ, đổi thứ tự; lưu trên trình duyệt  
Không gọi được AI?  
Không có key, lỗi, hoặc trả sai định dạng → kế hoạch mặc định từ luật, gắn nhãn “Gợi ý mặc định”.  
Vì sao an toàn  
AI không bao giờ tự đặt link: mọi link lấy từ catalog đã kiểm chứng. Ghi chú của học viên luôn là dữ liệu, không phải lệnh.  
Nguồn: docs/05-ui-flow.md · docs/04-ai-pipeline.md · codebase/src/app/api/roadmap/route.ts  

**Lời nói** (Thành · 35 giây · bản 6 phút: bỏ): Luồng có năm bước. Học viên nhập thông tin. Luật cứng chặn trước: thiếu thời gian hay lab lạ thì hỏi lại, xin làm hộ thì từ chối. Qua được mới tới AI Mentor. Kết quả của AI bị hậu kiểm: tối đa ba việc, không vượt quỹ thời gian, link phải có trong catalog. Cuối cùng học viên tự chỉnh checklist. AI lỗi thì có kế hoạch mặc định, gắn nhãn rõ ràng.

## Slide 8

Thân bài · Phần A — theo yêu cầu đề · 3/6 · Demo live  
Demo live: 1 case chuẩn, 2 case khó  
Đã chạy  
① Case chuẩn  
Nền tech-base · 60 phút · lab Prompt & Tool Calling → 3 việc, tổng ≤ 60 phút, link nằm trong catalog.  
Đã chạy  
② Xin làm hộ  
Ghi chú “làm hộ bài lab / cho đáp án” → AI từ chối, gợi ý liên hệ Lab Coach (case G16).  
Đã chạy  
③ Không đủ thời gian  
Chỉ rảnh 20 phút → hệ thống hỏi lại: “Bạn có thể dành ít nhất 30 phút không?” thay vì ép ra kế hoạch.  
**Thẻ giám khảo:** mời ban giám khảo tự nhập một case lạ ngay tại chỗ.  
Web: k4-3a-e403-vinonymus.kailabs.io.vn/personalized-path · mạng lỗi thì chiếu video demo dự phòng (nộp CP5)  

**Lời nói** (Thành · 70 giây · bản 6 phút: 60 giây, chỉ ① và ②): TRƯỚC GIỜ LÊN: nhập API key Gemini vào trang để kết quả mang nhãn AI; không có key thì ra kế hoạch mặc định có ghi nhãn. Case một: tech-base, 60 phút, lab Prompt và Tool Calling, ghi chú đã biết code nhưng chưa hiểu function calling: ra ba việc, tổng không quá 60 phút, link đều trong catalog. Case hai: ghi chú nhờ điền đáp án và trích code giải để nộp: hệ thống từ chối, gợi ý liên hệ Lab Coach. Case ba: chỉ rảnh 20 phút: hệ thống hỏi lại có dành được 30 phút không. Mời ban giám khảo tự nhập một case. Mạng lỗi thì chiếu video dự phòng.

## Slide 9

Thân bài · Phần A — theo yêu cầu đề · 4/6  
Kết quả đo: đạt Quality Bar khoá tại CP4  
**Quality Bar (khoá 21:00 · 17/9):** ≥18/20 case đạt **VÀ** 0 URL ngoài catalog **VÀ** 3/3 case G16–G18 từ chối.  
Lượt | Đạt | Link ngoài |  
Baseline luật tĩnh | 17/20 · 85% | 0 |  
AI v1 · Gemini Flash-Lite | 18/20 · 90% | 0 |  
**AI v2 · Gemini Flash-Lite** | **19/20 · 95%** | **0** |  
Failure đáng kể nhất: G02  
Gemini chọn đúng tài liệu ptc-function-calling nhưng xếp thứ ba; giới hạn 60 phút loại mất nó. Không bịa link, không rơi về baseline — giữ nguyên số 19/20.  
Minh bạch: ngưỡng chốt sau lượt v1, v2. Bộ 50 case hiện chỉ chạy baseline luật tĩnh (50/50) — luật đã chỉnh theo chính các case, không dùng làm bằng chứng chất lượng AI.  
Nguồn: eval/run_results.md · eval/latest-ai-results.json · spec.md §7  

**Lời nói** (Đức · 45 giây · giữ ở mọi bản): Chuẩn đạt khoá trước hạn CP4: ít nhất 18 trên 20 case, không link ngoài catalog, và từ chối đủ ba case vượt thẩm quyền. Bản AI v2 đạt 19 trên 20, 0 link ngoài catalog. Case trượt là G02: AI chọn đúng tài liệu nhưng xếp thứ ba nên bị cắt vì giới hạn 60 phút. Chúng tôi giữ nguyên case đó, không sửa để đẹp số.

## Slide 10

Thân bài · Phần A — theo yêu cầu đề · 5/6  
Người dùng nói gì: nói thẳng phần chưa làm đủ  
Phỏng vấn trước khi build  
“Mỗi buổi học phải mất ít nhất 20–25 phút chỉ để gom đủ link tài liệu.” — P01, nền tech  
“Slide bài giảng dài hơn 60 trang, mình chỉ có khoảng 45 phút buổi trưa để đọc trước.” — P02, nền AI  
Chưa đủ 5 buổi dùng thử → đo trên golden set  
- AI v2 **đạt** chuẩn: 19/20, 0 link ngoài catalog
- 3/3 case ngoài phạm vi → **từ chối**
- Chưa đạt: G02 — thiếu 1 tài liệu
71/82 người khảo sát sẵn sàng dùng thử — nguồn người cho vòng tiếp theo.  
Nguồn: docs/research/survey-log.md · eval/run_results.md · 02-guide §5.1: chưa có validation thì báo kết quả golden set  

**Lời nói** (Đức · 40 giây · giữ ở mọi bản): Hai học viên phỏng vấn trước khi build nói đúng nỗi đau: 20 đến 25 phút mỗi buổi chỉ để gom link, slide 60 trang mà chỉ có 45 phút. Chúng tôi chưa làm đủ năm buổi cho người ngoài dùng thử, nên theo luật đề, chúng tôi báo kết quả golden set: đạt chuẩn, và case chưa đạt là G02. 71 người đã đăng ký dùng thử cho vòng tiếp theo.

---

# Thân bài B: mở rộng — đã chạy và đang triển khai

## Slide 11

Thân bài · Phần B — mở rộng về dự án  
Kiến trúc đang chạy: an toàn trước, AI sau  
Đã chạy  
Trình duyệt  
API key của học viên chỉ nằm trên máy (BYOK), gửi kèm từng lượt, server không lưu.  
Đã chạy  
Next.js API  
Kiểm tra dữ liệu (zod) → luật cứng → bộ định tuyến gọi 7 nhà cung cấp LLM → hậu kiểm: link phải có trong catalog.  
Code xong · chưa deploy  
Backend .NET 10  
Clean Architecture + CQRS: tài khoản, duyệt tài khoản, hạn mức. 60 test tự động, CI chặn merge khi đỏ.  
Mọi lời gọi AI đi qua một bộ định tuyến duy nhất; nội dung người dùng nhập luôn được coi là dữ liệu, không phải lệnh.  
Nguồn: docs/02-kien-truc.md · docs/06-backend-dotnet.md · AGENTS.md  

**Lời nói** (Minh · 45 giây · bản 6–7 phút: bỏ): Về kiến trúc: key AI của học viên chỉ nằm trên trình duyệt. Mọi request qua kiểm tra dữ liệu và luật cứng trước khi tới AI, và câu trả lời của AI bị hậu kiểm: link nào không có trong catalog là bị loại. Backend .NET cho tài khoản và phân quyền đã viết xong theo Clean Architecture với 60 test tự động, đang chờ deploy.

## Slide 12

Thân bài · Phần B — mở rộng về dự án  
AI Helpdesk: trò chuyện, tra cứu, làm “mồi” cho người mới  
Đã chạy  
Đã chạy  
Trang chat trả lời câu hỏi thường gặp của khoá học từ kho 53 bài FAQ (RAG trên Supabase).  
Code xong · chưa lên web  
Có trong bản mới  
Widget chat nổi ở mọi trang; khách chưa đăng nhập hỏi 10 câu/ngày, đăng nhập thì không giới hạn.  
Ý tưởng · đang triển khai  
Đang triển khai  
Trả lời từ thư viện tài liệu giảng viên tải lên, kèm nguồn.  
Nguồn: scripts/audit-faqs.ts (53 file FAQ) · codebase/src/lib/server/guest-quota.ts  

**Lời nói** (Thành · 35 giây · bản 6–7 phút: bỏ): AI Helpdesk là AI người dùng trò chuyện cùng. Trang chat đã trả lời câu hỏi thường gặp từ 53 bài FAQ của khoá. Bản mới có widget ở mọi trang và cho khách hỏi miễn phí 10 câu mỗi ngày để làm quen, chưa đưa lên web chính. Trả lời từ tài liệu giảng viên là phần đang triển khai, hôm nay không demo.

## Slide 13

Thân bài · Phần B — mở rộng về dự án · Ý tưởng · đang triển khai  
Hệ thống 4 vai trò: đăng ký phải chờ duyệt  
Vai trò | Làm được gì | Tình trạng |  
**Viewer** | Xem giới thiệu; hỏi AI Helpdesk 10 câu/ngày | Code xong |  
**Student** | Lộ trình cá nhân hoá + AI Helpdesk không giới hạn | Lộ trình đã chạy |  
**Lecturer** | Tải tài liệu để AI Mentor đọc vào thư viện | Ý tưởng · đang triển khai |  
**Admin** | Duyệt tài khoản mới, duyệt tài liệu | Duyệt tài khoản: code xong, chờ deploy |  
Đăng ký xong **chưa** dùng được ngay: Admin duyệt mới đăng nhập — AI tốn tiền chỉ mở cho người thật.  
Không demo phần này · kế hoạch: docs/hackathon/tasks-he-thong-4-vai-tro.md (31 task)  

**Lời nói** (Minh · 40 giây · bản 6–7 phút: bỏ): Hướng hệ thống đầy đủ có bốn vai trò: khách, học viên, giảng viên, admin. Đây là phần đang triển khai nên chúng tôi không demo. Điểm thiết kế quan trọng: đăng ký xong phải chờ admin duyệt, để phần AI tốn chi phí chỉ mở cho học viên thật. Database cho vai trò giảng viên và thư viện tài liệu đang được làm.

## Slide 14

Thân bài · Phần B — mở rộng về dự án · Ý tưởng · đang triển khai  
AI Mentor đủ 4 nhiệm vụ: hôm nay làm được 1 phần  
Đã chạy (một phần)  
1. Đọc thông tin học viên  
Nền tảng tự khai, số phút rảnh, bài lab, ghi chú.  
Ý tưởng · đang triển khai  
2. Đọc tài liệu giảng viên  
Đưa vào thư viện tài liệu cho lộ trình dùng.  
Ý tưởng · đang triển khai  
3. CV → bài test năng lực  
74/82 (90%) muốn có bài test chẩn đoán ngắn.  
Đang triển khai  
4. Điểm test → lộ trình  
Hôm nay dùng nền tảng tự khai thay cho điểm test.  
Không demo phần này · nguồn: README mục Sản phẩm · spec.md §2  

**Lời nói** (Đức · 40 giây · bản 6–7 phút: bỏ): Tầm nhìn cho AI Mentor có bốn nhiệm vụ. Hôm nay nó làm được nhiệm vụ đầu: đọc thông tin học viên tự khai để lập lộ trình. Ba nhiệm vụ sau là ý tưởng đang triển khai: đọc tài liệu giảng viên, sinh bài test năng lực từ CV, và dùng điểm test để lập lộ trình. 90% người khảo sát muốn có bài test chẩn đoán, nên đây là việc ưu tiên.

---

# Kết: kế hoạch 1 tuần, tổng kết và hỏi đáp

## Slide 15

Kết · Nếu có thêm 1 tuần  
3 việc ưu tiên, đều trỏ về lỗ hổng đang có  
1. Cho 5 người thật dùng thử  
Giao task, ngồi im quan sát, ghi quote nguyên văn — phần còn thiếu ở slide 10.  
2. Bài test chẩn đoán từ CV  
74/82 (90%) muốn có; thay nền tảng tự khai bằng năng lực đo được.  
3. Thư viện tài liệu giảng viên  
Giảng viên tải lên, AI Mentor đọc vào thư viện thay catalog soạn tay.  
**Bài học lớn nhất:** chốt chuẩn “đạt” và đo bằng golden set từ sớm giúp nhóm nói được con số thật — kể cả con số chưa đẹp.  
Nguồn: spec.md §2 · validation/log.md · docs/hackathon/tasks-he-thong-4-vai-tro.md  

**Lời nói** (Khoa · 35 giây · giữ ở mọi bản; bản 6–7 phút thêm 1 câu: hệ thống 4 vai trò đang triển khai): Nếu có thêm một tuần, chúng tôi làm đúng ba việc còn thiếu: cho năm người thật dùng thử, làm bài test chẩn đoán từ CV mà 90% học viên muốn, và thư viện tài liệu giảng viên. Bài học lớn nhất: chốt chuẩn và đo sớm giúp chúng tôi nói được con số thật, kể cả khi chưa đẹp.

## Slide 16

Kết · Tổng kết & hỏi đáp  
Cảm ơn ban giám khảo — mời đặt câu hỏi  
- Nỗi đau có số: 87% không biết học bù phần nào
- AI Mentor đạt chuẩn đã chốt: 19/20, 0 link ngoài catalog
- Biết từ chối, biết hỏi lại — và nói thẳng phần đang triển khai
Khoa  
Nỗi đau, chọn tính năng, kế hoạch  
Thành  
Giải pháp, demo, AI Helpdesk  
Đức  
Prompt, golden set, AI Mentor  
Minh  
Kiến trúc, database, 4 vai trò  
Repo: github.com/Dokhacgiakhoa/K4-3A-e403-Vinonymus  

**Lời nói** (Khoa · 25 giây · giữ ở mọi bản): Tóm lại: nỗi đau có số liệu, AI Mentor đạt chuẩn đã chốt, biết từ chối và biết hỏi lại, và chúng tôi nói thẳng phần đang triển khai. Cảm ơn ban giám khảo. Câu hỏi về phần nào, bạn phụ trách phần đó sẽ trả lời.


---

# Chuẩn bị hỏi đáp

Ba câu đề bắt buộc cả nhóm trả lời được (`02-guide.md` §5.2), rồi các câu hay gặp. Ai phụ trách phần nào trả lời phần đó.

| Câu hỏi | Người trả lời | Trả lời gợi ý |
|---|---|---|
| **Augment hay automate — vì sao?** | Khoa | Augment. AI chỉ đề xuất tối đa 3 việc; học viên tự tick, bỏ, đổi thứ tự. Cái giá khi sai chỉ là vài chục phút đọc nhầm, nhưng quyết định học gì vẫn phải là của học viên, nên không tự động hoá hoàn toàn. |
| **Failure nguy hiểm nhất?** | Đức | AI đưa link bịa hoặc làm hộ bài. Chặn bằng hai lớp: luật cứng từ chối trước khi gọi AI (3/3 case G16–G18 từ chối), và hậu kiểm chỉ giữ link có trong catalog (0 link ngoài catalog trong mọi lượt đo). |
| **Phần bạn làm là gì?** | Từng người | Khoa: nỗi đau, chọn tính năng, backend .NET, giao diện Student/Viewer. Thành: AI Mentor. Đức: prompt, golden set, AI Helpdesk, giao diện Admin/Lecturer. Minh: database. |
| Vì sao không nói 50/50? | Đức | 50/50 là của bộ luật tĩnh (baseline), và luật đã được chỉnh theo chính 50 case đó — dùng làm bằng chứng chất lượng AI là không trung thực. Số của AI là 19/20 trên bộ 20 case chốt từ CP4. |
| Vì sao chưa đủ 5 người dùng thử? | Khoa | Nói thẳng: chưa làm kịp. Theo luật đề, nhóm báo kết quả golden set thay thế. 71/82 người khảo sát đã đăng ký dùng thử — đó là việc số 1 nếu có thêm 1 tuần. |
| Khảo sát có thiên lệch không? | Khoa | Có, và đã ghi rõ trong `spec.md` §1: câu hỏi đưa sẵn lựa chọn, có quay thưởng, mẫu tự nguyện. Vì vậy nhóm đối chiếu thêm dữ liệu chat VLearn và Discord thật (0.13%, 6.7%, 8.8%). |
| API key của học viên có bị lưu không? | Minh | Không. Key nằm trên trình duyệt (BYOK), gửi kèm từng request và chỉ dùng trong request đó; server không lưu, không ghi log. |
| AI Mentor khác AI Tutor VLearn thế nào? | Thành | AI Tutor trả lời câu hỏi; chỉ 0.13% lượt chat nó chủ động gợi ý bước tiếp theo. AI Mentor làm ngược lại: không chờ hỏi, nhìn nền tảng + thời gian rồi chọn trước ≤3 việc cho buổi lab tới. |
| Case G02 trượt, sao không sửa? | Thành | Đang sửa (PR #111 mở). Nhưng số 19/20 là số đã đo lúc chốt chuẩn, nhóm giữ nguyên để không "sửa đề cho đẹp số". |
| Chi phí gọi AI ai trả? | Khoa | Hiện học viên dùng key của mình. Hướng dài hạn: đăng ký phải chờ admin duyệt để phần AI tốn tiền chỉ mở cho học viên thật; khách chỉ có 10 câu Helpdesk/ngày (code xong, chưa lên web). |
| Mở rộng cho khoá khác được không? | Minh | Được ở mức dữ liệu: catalog và thư viện tài liệu là dữ liệu, không nằm trong prompt. Vai trò Lecturer (đang triển khai) là để giảng viên tự đưa tài liệu khoá mình vào. |
