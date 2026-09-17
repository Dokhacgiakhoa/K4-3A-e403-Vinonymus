'use client';

import { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle, 
  TrendingUp, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Quote, 
  Target, 
  Clock, 
  Layers, 
  FlaskConical, 
  Compass, 
  PieChart, 
  BarChart3, 
  Activity, 
  Box, 
  Sliders, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  UserCog, 
  Repeat, 
  Puzzle, 
  Scale, 
  Workflow,
  Server,
  Terminal,
  Cpu,
  Database,
  KeyRound,
  CheckCircle2,
  Cloud,
  Eye,
  ShieldCheck,
  GitBranch,
  Network,
  HardDrive,
  Check,
  DollarSign,
  BellRing,
  PowerOff,
  Radio,
  Zap,
  Key,
  ShieldX,
  Bot,
  Lock,
  FileCode2,
  Bookmark,
  ListOrdered
} from 'lucide-react';

export function AlumniInsightsSection() {
  const [activeTrack, setActiveTrack] = useState<'TRACK1' | 'TRACK2'>('TRACK1');
  const [selectedModule, setSelectedModule] = useState<'USER' | 'OPPORTUNITY' | 'BUILD' | 'ADOPTION'>('USER');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [cloudProviderTab, setCloudProviderTab] = useState<'GCP' | 'AWS'>('GCP');

  // TRACK 1 - MODULE 1: HIỂU NGƯỜI DÙNG (5 FRAMEWORKS)
  const userFrameworks = [
    {
      id: "01",
      title: "TARGET CUSTOMER",
      tag: "DANH TỪ",
      subtitle: "Khách Hàng Mục Tiêu",
      icon: Users,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      accent: "bg-sky-500 text-slate-950",
      mainPoint: "Không chọn nhóm đông nhất. Chọn nhóm có vấn đề đau nhất, cấp thiết và có thể tiếp cận để test ngay.",
      deepExplanation: "Target Customer không chỉ là một nhãn chung chung như “sinh viên” hay “nhân viên văn phòng”. Đó là nhóm người dùng cụ thể đang gặp cùng một vấn đề, trong bối cảnh tương đối giống nhau, và có khả năng tiếp cận để team học từ họ.\n\nỞ giai đoạn đầu, chọn một nhóm hẹp thường tốt hơn chọn một nhóm đông. Ví dụ: “Người làm HR tại công ty 50-200 người đang phải sàng lọc CV thủ công” hữu ích hơn nhiều so với “người làm HR”. Nhóm càng rõ, team càng dễ phỏng vấn, quan sát workflow và kiểm chứng vấn đề.",
      keyQuestion: "Trong 1 tuần, mình có thể quan sát nhóm nào? Nhóm nào đang đau nhất, cần giải quyết sớm nhất và mình có thể tiếp cận để kiểm chứng ngay?"
    },
    {
      id: "02",
      title: "PAIN POINT",
      tag: "DANH TỪ",
      subtitle: "Nỗi Đau Người Dùng",
      icon: AlertTriangle,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      accent: "bg-amber-500 text-slate-950",
      mainPoint: "Một nỗi khó chịu chỉ đáng giải khi nó lặp lại, tốn kém hoặc tạo rủi ro cho user.",
      deepExplanation: "Pain Point là phần gây ma sát trong workflow hiện tại: tốn thời gian, tốn tiền, dễ sai, khó kiểm soát hoặc khiến user bỏ lỡ cơ hội. Không phải mọi sự bất tiện đều là pain point đủ lớn để xây sản phẩm.\n\nMột tín hiệu tốt là user đang tự tìm cách xoay xở (Workaround): copy dữ liệu qua Excel, nhắn người khác kiểm tra, dùng nhiều công cụ chắp vá, hoặc làm thủ công dù biết không hiệu quả. Workaround chính là bằng chứng cho thấy vấn đề có thật.",
      keyQuestion: "Nếu không giải quyết, user đang mất thứ gì đủ đáng giá để họ phải đổi cách làm?"
    },
    {
      id: "03",
      title: "INSIGHT",
      tag: "DANH TỪ",
      subtitle: "Sự Thật Ngầm Hiểu",
      icon: Lightbulb,
      color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
      accent: "bg-teal-500 text-slate-950",
      mainPoint: "Không phải câu user nói. Là lý do phía sau một hành vi lặp lại mà team nhìn ra.",
      deepExplanation: "Insight không phải là một câu quote hay một fact đơn lẻ. Nó là cách team giải thích được vì sao một hành vi đang lặp lại. Ví dụ: “user muốn dashboard đơn giản” chưa phải insight; nhưng “họ chỉ mở dashboard khi phải báo cáo gấp, nên cần thấy câu trả lời trước khi thấy dữ liệu” thì dẫn đến quyết định product rõ ràng hơn.\n\nInsight tốt thường nối được ba thứ: quan sát thật, nguyên nhân phía sau và hàm ý cho sản phẩm.",
      keyQuestion: "Bằng chứng là hành vi hay chỉ là ý kiến? Hành vi nào lặp lại, nguyên nhân nào đứng phía sau và điều đó buộc sản phẩm phải thay đổi ra sao?"
    },
    {
      id: "04",
      title: "JTBD (JOBS TO BE DONE)",
      tag: "DANH TỪ",
      subtitle: "Công Việc Cần Xong",
      icon: Target,
      color: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
      accent: "bg-indigo-500 text-slate-950",
      mainPoint: "User không thuê AI để dùng chatbot. Họ thuê nó để hoàn thành một việc trong bối cảnh cụ thể.",
      deepExplanation: "JTBD là “công việc” user đang thuê một giải pháp để hoàn thành. User không quan tâm bản thân đang dùng AI, spreadsheet hay một nhân sự hỗ trợ; họ quan tâm công việc có được hoàn thành nhanh hơn, tốt hơn hoặc ít rủi ro hơn không.\n\nCấu trúc một JTBD chuẩn:\n[Bối cảnh] ➔ [Việc cần xong] ➔ [Kết quả mong muốn]\nVí dụ: “Khi cần chuẩn bị cuộc họp với khách hàng trong 30 phút, sales muốn nắm nhanh lịch sử trao đổi để không bỏ sót thông tin quan trọng.”",
      keyQuestion: "Khi nào họ buộc phải tìm cách khác? Trong khoảnh khắc nào user cần hoàn thành việc gì, và kết quả nào khiến họ thấy vấn đề đã được giải quyết?"
    },
    {
      id: "05",
      title: "VALUE PROPOSITION",
      tag: "DANH TỪ",
      subtitle: "Tuyên Ngôn Giá Trị",
      icon: TrendingUp,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      accent: "bg-emerald-500 text-slate-950",
      mainPoint: "Tính năng là cách làm. Value proposition là lý do user thấy cách mới đáng để đổi.",
      deepExplanation: "Value Proposition là lời hứa về giá trị: user sẽ nhận được outcome gì khi đổi từ cách cũ sang giải pháp mới. Nó không phải slogan và cũng không phải danh sách tính năng.\n\n“Tự động tóm tắt cuộc họp bằng AI” là tính năng. “Giúp sales chuẩn bị cuộc họp trong 5 phút thay vì đọc lại 30 phút ghi chú” mới là value proposition, vì nó nói rõ giá trị và sự thay đổi user nhận được.\n\nSơ đồ chuyển đổi:\n[Cách cũ: Người ➔ Thao tác ➔ Tốn thời gian] ➔ [Cách mới: Người ➔ AI Hỗ trợ ➔ Tiết kiệm thời gian] ➔ [Tăng trưởng vượt bậc]",
      keyQuestion: "Lợi ích nào đủ rõ để họ đổi thói quen? Vì sao user nên đổi cách làm hiện tại, và lợi ích nào đủ rõ để họ thấy việc đổi là đáng?"
    }
  ];

  // TRACK 1 - MODULE 2: KIỂM CHỨNG CƠ HỘI (5 FRAMEWORKS)
  const opportunityFrameworks = [
    {
      id: "01",
      title: "ASSUMPTION",
      tag: "DANH TỪ",
      subtitle: "Giả Định Cốt Lõi",
      icon: Compass,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      accent: "bg-sky-500 text-slate-950",
      mainPoint: "Điều team tin là đúng nhưng chưa có bằng chứng. Càng quan trọng, càng cần test sớm.",
      deepExplanation: "Assumption là điều team cần tin để ý tưởng hoạt động, nhưng chưa có bằng chứng chắc chắn. Nó có thể liên quan đến nhu cầu của user, khả năng dùng sản phẩm, mô hình kinh doanh, dữ liệu hoặc khả năng vận hành.\n\nKhông phải assumption nào cũng nguy hiểm như nhau. Team cần tìm assumption mà nếu sai thì cả hướng sản phẩm gần như không còn ý nghĩa. Đó là thứ nên test trước, thay vì đầu tư xây những phần ít rủi ro hơn.",
      keyQuestion: "Điều gì có thể làm cả hướng đi sai? Niềm tin nào nếu sai sẽ khiến toàn bộ hướng sản phẩm này không còn đáng làm?"
    },
    {
      id: "02",
      title: "HYPOTHESIS",
      tag: "DANH TỪ",
      subtitle: "Giả Thuyết Kiểm Chứng",
      icon: FlaskConical,
      color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
      accent: "bg-purple-500 text-slate-950",
      mainPoint: "Một dự đoán có thể kiểm chứng: thay đổi X, quan sát Y, rồi quyết định có đi tiếp hay không.",
      deepExplanation: "Hypothesis biến một assumption mơ hồ thành một phát biểu có thể kiểm chứng (Nếu X ➔ Y). Nó nên chỉ ra: thay đổi gì, tác động đến ai, mong đợi hành vi gì và tiêu chí nào để kết luận.\n\nVí dụ: “Nếu hiển thị bản tóm tắt hồ sơ trước bảng dữ liệu, nhân viên xử lý hồ sơ sẽ hoàn thành đánh giá nhanh hơn 20% mà không giảm độ chính xác.” Câu này cho team biết cần build gì, đo gì và học gì.",
      keyQuestion: "Kết quả nào sẽ khiến mình đổi ý? Nếu mình thay đổi điều này, hành vi nào phải thay đổi thì mới chứng minh giả định là đúng?"
    },
    {
      id: "03",
      title: "TAM / SAM / SOM",
      tag: "DANH TỪ",
      subtitle: "Quy Mô Thị Trường Mục Tiêu",
      icon: PieChart,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      accent: "bg-amber-500 text-slate-950",
      mainPoint: "Không bắt đầu từ cả thị trường. Xác định phần nhỏ nhất mình thật sự có thể phục vụ trước.",
      deepExplanation: "TAM là toàn bộ thị trường có thể liên quan đến vấn đề. SAM là phần thị trường mà sản phẩm và mô hình của team có thể phục vụ. SOM là phần nhỏ, cụ thể nhất mà team có thể tiếp cận và giành được trong giai đoạn đầu.\n\nSai lầm phổ biến là nói về TAM rất lớn để làm ý tưởng trông hấp dẫn, nhưng lại không chỉ ra được 20 user đầu tiên là ai. Với một MVP, SOM mới là phần quan trọng nhất: ai sẽ thử trước, vì sao họ cần, và team đến được với họ bằng cách nào.",
      keyQuestion: "Nhóm nào vừa đủ hẹp để bắt đầu? Nhóm user nhỏ nhất nào mình có thể tiếp cận ngay và có lý do rõ để dùng thử?"
    },
    {
      id: "04",
      title: "SUCCESS METRIC",
      tag: "DANH TỪ",
      subtitle: "Chỉ Số Thành Công",
      icon: BarChart3,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      accent: "bg-emerald-500 text-slate-950",
      mainPoint: "Chỉ số phải nói rõ sản phẩm có đạt mục tiêu không, trước khi team lao vào tối ưu.",
      deepExplanation: "Success Metric là chỉ số nói cho team biết sản phẩm có tạo ra outcome mong muốn hay không. Nó phải gắn với bài toán gốc, không chỉ gắn với hoạt động của team.\n\nVí dụ, “số người đăng ký” có thể tốt cho marketing; nhưng nếu bài toán là giảm thời gian xử lý hồ sơ, metric quan trọng có thể là thời gian hoàn thành, tỷ lệ xử lý đúng hoặc số case được giải quyết mỗi ngày.",
      keyQuestion: "Con số nào chứng minh bài toán được giải? Nếu bài toán thực sự được giải, điều gì trong công việc của user sẽ thay đổi rõ ràng nhất?"
    },
    {
      id: "05",
      title: "ACTIONABLE METRIC",
      tag: "DANH TỪ",
      subtitle: "Chỉ Số Dẫn Dắt Hành Động",
      icon: Activity,
      color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
      accent: "bg-teal-500 text-slate-950",
      mainPoint: "Chỉ số tốt phải dẫn đến hành động. Nếu nhìn số xong không biết làm gì, đó chỉ là báo cáo.",
      deepExplanation: "Actionable Metric là chỉ số có thể dẫn đến một quyết định tiếp theo: [Hành vi] ➔ [Quyết định] ➔ [Thử lại]. Khi số tăng hoặc giảm, team biết cần điều tra nguyên nhân nào, thay đổi phần nào hoặc giữ nguyên điều gì.\n\nNgược lại, vanity metric (chỉ số phù phiếm) có thể trông đẹp nhưng không giúp ra quyết định. Ví dụ: “10.000 lượt truy cập” không cho biết user có nhận được giá trị hay không; nhưng “60% user bỏ ở bước kết nối dữ liệu” cho team một điểm cụ thể để cải thiện.",
      keyQuestion: "Thấy số này, team sẽ đổi quyết định nào? Nếu số này tăng hoặc giảm, team sẽ thay đổi quyết định cụ thể nào?"
    }
  ];

  // TRACK 1 - MODULE 3: BIẾN Ý TƯỞNG THÀNH SẢN PHẨM (5 FRAMEWORKS)
  const buildFrameworks = [
    {
      id: "01",
      title: "MVP (MINIMUM VIABLE PRODUCT)",
      tag: "DANH TỪ",
      subtitle: "Sản Phẩm Khả Dụng Tối Thiểu",
      icon: Box,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      accent: "bg-sky-500 text-slate-950",
      mainPoint: "MVP không phải bản rút gọn của mọi thứ. Nó là bài test nhỏ nhất cho giả định quan trọng nhất.",
      deepExplanation: "MVP là sản phẩm nhỏ nhất có thể tạo ra một bài học có ý nghĩa về giả định quan trọng nhất. Nó không phải phiên bản nghèo nàn của sản phẩm tương lai; nó là một thí nghiệm có chủ đích.\n\nCó khi MVP chưa cần automation hoàn toàn. Nếu câu hỏi cần test là “user có thấy bản tóm tắt này hữu ích không?”, team có thể hỗ trợ thủ công phía sau để kiểm tra nhu cầu trước khi đầu tư xây pipeline AI phức tạp.",
      keyQuestion: "Bỏ đi phần nào mà vẫn kiểm chứng được? Phiên bản nhỏ nhất nào vẫn giúp mình học được giả định quan trọng nhất đang đúng hay sai?"
    },
    {
      id: "02",
      title: "MVP BOUNDARY",
      tag: "DANH TỪ",
      subtitle: "Ranh Giới Phạm Vi MVP",
      icon: Sliders,
      color: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
      accent: "bg-indigo-500 text-slate-950",
      mainPoint: "Phạm vi MVP là lời hứa về điều sẽ làm, và kỷ luật nói chưa với những thứ chưa cần.",
      deepExplanation: "MVP Boundary là ranh giới giúp team phân biệt “cần có để test” với “nghe cũng hay nhưng chưa cần”. Đây là công cụ chống scope creep, đặc biệt khi AI Product rất dễ phát sinh thêm tính năng như chat, agent, dashboard, phân quyền, tích hợp và automation.\n\nMột boundary tốt ghi rõ ba nhóm:\n[Làm ngay] ➔ [Để sau] ➔ [Không làm trong lần test này].\nViệc nói “chưa” không có nghĩa là tính năng đó không quan trọng; chỉ có nghĩa nó chưa giúp trả lời câu hỏi quan trọng nhất hiện tại.",
      keyQuestion: "Thứ nào cần có để test, thứ nào chỉ là nice-to-have? Nó có giúp kiểm chứng giả định hiện tại không, hay chỉ khiến sản phẩm trông đầy đủ hơn?"
    },
    {
      id: "03",
      title: "PRD (PRODUCT REQUIREMENTS DOC)",
      tag: "DANH TỪ",
      subtitle: "Tài Liệu Yêu Cầu Sản Phẩm",
      icon: FileText,
      color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
      accent: "bg-teal-500 text-slate-950",
      mainPoint: "PRD giúp team cùng hiểu build gì và vì sao. Nó không phải tài liệu để mô tả hết cách code.",
      deepExplanation: "PRD là tài liệu thống nhất giữa Product, Design, Engineering và các bên liên quan về vấn đề cần giải, user mục tiêu, outcome, phạm vi, rủi ro và cách đo thành công.\n\nPRD tốt không cố dự đoán mọi chi tiết từ đầu. Nó làm rõ đủ để team ra quyết định nhất quán khi gặp tình huống mới. Với AI Product, PRD nên nêu thêm dữ liệu đầu vào, mức độ tin cậy mong đợi, trường hợp model không chắc và cách user kiểm soát kết quả.",
      keyQuestion: "Người đọc có hiểu cùng một vấn đề và outcome không? Cả team đã đang hiểu giống nhau về vấn đề, user, outcome và giới hạn của AI chưa?"
    },
    {
      id: "04",
      title: "USER STORY",
      tag: "DANH TỪ",
      subtitle: "Câu Chuyện Người Dùng",
      icon: UserCheck,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      accent: "bg-amber-500 text-slate-950",
      mainPoint: "User story bắt đầu từ mục tiêu của user, không từ màn hình hay tính năng team muốn làm.",
      deepExplanation: "User Story diễn đạt một nhu cầu từ góc nhìn user, thường theo cấu trúc:\n“Là một [ai], tôi muốn [làm gì], để [đạt kết quả gì].”\nNó giúp team buộc phải nói rõ user nào, mục tiêu nào và giá trị nào đang được theo đuổi.\n\nUser Story không nên biến thành câu mô tả màn hình. “User muốn một nút export PDF” chưa nói lên lý do. Hãy đi sâu hơn: họ cần chia sẻ kết quả cho ai, trong hoàn cảnh nào và điều gì khiến export trở nên quan trọng?",
      keyQuestion: "User cần hoàn thành việc gì trong tình huống nào? User đang cố hoàn thành điều gì trong workflow của họ, chứ không phải team muốn thêm tính năng gì?"
    },
    {
      id: "05",
      title: "FALLBACK UX",
      tag: "DANH TỪ",
      subtitle: "Trải Nghiệm Dự Phòng Khi AI Không Chắc",
      icon: ShieldAlert,
      color: "text-pink-400 border-pink-500/40 bg-pink-500/10",
      accent: "bg-pink-500 text-slate-950",
      mainPoint: "AI có thể sai hoặc không chắc. Luồng dự phòng quyết định user còn tin và biết làm gì tiếp không.",
      deepExplanation: "Fallback UX là trải nghiệm được thiết kế sẵn cho trường hợp AI không thể trả lời, trả lời thiếu dữ liệu, trả lời sai hoặc độ tin cậy không đủ để hành động. Fallback không phải thông báo “đã có lỗi” rồi để user tự lo.\n\nMột fallback tốt giải thích ngắn gọn giới hạn, cho user phương án tiếp theo và giữ quyền kiểm soát ở phía họ:\n[AI không chắc] ➔ [Giải thích ngắn gọn] ➔ [Cho user chọn phương án / Giữ quyền kiểm soát].",
      keyQuestion: "Khi AI không trả lời được, user sẽ đi đâu? User sẽ biết điều gì, có thể làm gì tiếp và ai sẽ nhận trách nhiệm ở bước sau?"
    }
  ];

  // TRACK 1 - MODULE 4: ĐƯA AI VÀO SỬ DỤNG THẬT (5 FRAMEWORKS)
  const adoptionFrameworks = [
    {
      id: "01",
      title: "HUMAN-IN-THE-LOOP",
      tag: "DANH TỪ",
      subtitle: "Con Người Giám Sát & Can Thiệp",
      icon: UserCog,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      accent: "bg-sky-500 text-slate-950",
      mainPoint: "Không phải cứ có người bấm duyệt là an toàn. Cần rõ ai review, review lúc nào và có quyền đổi gì.",
      deepExplanation: "Human-in-the-loop là cách thiết kế để con người review, xác nhận hoặc ra quyết định ở những điểm AI không nên tự động hóa hoàn toàn:\n[AI đề xuất] ➔ [Người review] ➔ [Hành động]\n\nĐiều này đặc biệt cần thiết khi kết quả ảnh hưởng đến tiền, quyền lợi, pháp lý, sức khỏe, danh tiếng hoặc cơ hội của người khác. Đặt con người ở đúng chỗ: nơi rủi ro cao, nơi cần ngữ cảnh model không có, hoặc nơi quyết định phải có người chịu trách nhiệm.",
      keyQuestion: "Bước nào AI không được tự quyết? Quyết định nào AI không được tự đưa ra và ai là người đủ quyền, đủ ngữ cảnh để can thiệp?"
    },
    {
      id: "02",
      title: "RETENTION",
      tag: "DANH TỪ",
      subtitle: "Tỷ Lệ Giữ Chân Người Dùng",
      icon: Repeat,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      accent: "bg-emerald-500 text-slate-950",
      mainPoint: "User quay lại mới cho thấy giá trị còn ở lại sau lần trải nghiệm đầu. Usage một lần chưa nói lên nhiều.",
      deepExplanation: "Retention đo việc user có quay lại hay không sau lần sử dụng đầu tiên. Với AI Product, một lần dùng có thể đến từ tò mò hoặc hiệu ứng demo; retention mới cho thấy sản phẩm có chỗ đứng trong công việc thật.\n\nKhông nên chỉ hỏi “user có thích không?”. Hãy xem họ có chủ động quay lại khi xuất hiện đúng bối cảnh cần giải quyết hay không. Nếu không quay lại, team cần tìm xem họ không còn pain, chưa đủ tin, chưa đủ tiện hay chưa thấy giá trị.",
      keyQuestion: "Điều gì khiến họ có lý do quay lại tuần sau? Điều gì khiến user chủ động quay lại đúng lúc vấn đề cũ xuất hiện lần nữa?"
    },
    {
      id: "03",
      title: "PMF (PRODUCT-MARKET FIT)",
      tag: "DANH TỪ",
      subtitle: "Độ Khớp Sản Phẩm - Thị Trường",
      icon: Puzzle,
      color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
      accent: "bg-teal-500 text-slate-950",
      mainPoint: "Product–market fit không phải một lần launch thành công. Nó là tín hiệu nhu cầu đủ thật để user quay lại và giới thiệu.",
      deepExplanation: "PMF là khi sản phẩm giải một nhu cầu đủ mạnh cho một thị trường đủ rõ:\n[Product] ➔ Khớp hoàn hảo ➔ [Nhu cầu User]\n\nPMF thường thể hiện qua nhiều tín hiệu cùng lúc: user quay lại, giới thiệu, chủ động yêu cầu thêm tính năng, chấp nhận trả tiền hoặc cảm thấy khó chịu/mất mát lớn khi không còn sản phẩm. Với MVP, không cần tuyên bố PMF quá sớm; hãy tập trung tìm nhóm user phản hồi mạnh mẽ nhất.",
      keyQuestion: "Dấu hiệu nào cho thấy đây không chỉ là sự tò mò? Nhóm user nào sẽ thực sự thấy mất mát nếu ngày mai sản phẩm này biến mất?"
    },
    {
      id: "04",
      title: "ROI (RETURN ON INVESTMENT)",
      tag: "DANH TỪ",
      subtitle: "Hiệu Quả Hoàn Vốn Đầu Tư",
      icon: Scale,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      accent: "bg-amber-500 text-slate-950",
      mainPoint: "AI chỉ đáng scale khi giá trị tạo ra lớn hơn chi phí vận hành, kiểm soát rủi ro và thay đổi thói quen.",
      deepExplanation: "ROI so sánh giá trị sản phẩm tạo ra với toàn bộ chi phí để có được giá trị đó:\nCán cân: [Giá trị tạo ra] > [Toàn bộ chi phí]\n\nVới AI Product, chi phí không chỉ là API hay GPU; còn có chi phí gán nhãn dữ liệu, tích hợp hệ thống, đánh giá chất lượng (Evals), human review, an toàn bảo mật, hỗ trợ user và thay đổi quy trình làm việc cũ. Một tính năng tiết kiệm 10 phút nhưng tốn 20 phút review chưa chắc là đầu tư tốt.",
      keyQuestion: "Mình tiết kiệm hoặc tạo thêm giá trị gì? Giá trị tạo ra có lớn hơn toàn bộ chi phí vận hành, kiểm soát rủi ro và thay đổi workflow hay không?"
    },
    {
      id: "05",
      title: "AI ADOPTION",
      tag: "DANH TỪ",
      subtitle: "Đưa AI Vào Vận Hành Thực Tế",
      icon: Workflow,
      color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
      accent: "bg-purple-500 text-slate-950",
      mainPoint: "Demo hay không đồng nghĩa adoption. AI chỉ thật sự được dùng khi có owner, handoff và chỗ đứng trong workflow.",
      deepExplanation: "AI Adoption xảy ra khi AI được đưa vào workflow thực tế và dùng lặp lại:\n[Dùng thử] ➔ [Đưa vào workflow] ➔ [Thành thói quen]\n\nĐể adoption xảy ra, cần có: Product Owner rõ ràng, phân định vai trò, quy trình bàn giao (handoff), tài liệu hướng dẫn, độ tin cậy phù hợp và cơ chế đo lường hiệu quả. Một giải pháp AI hay đến mấy nhưng buộc user rời workflow cũ hoặc không rõ trách nhiệm khi sai thì sẽ bị đào thải.",
      keyQuestion: "Sau buổi demo, ai dùng nó mỗi ngày? Ai dùng nó hằng ngày, ở bước nào trong workflow và ai chịu trách nhiệm giữ nó vận hành liên tục?"
    }
  ];

  // TRACK 2: THỨ TỰ CHUẨN BỊ 6 BƯỚC TUẦN TỰ (LƯU BÀI NÀY)
  const preparationRoadmap = [
    {
      step: "01",
      title: "Local Environment",
      time: "Trước Day 16",
      icon: Terminal,
      color: "text-sky-400 border-sky-500/40",
      desc: "Kiểm tra Python 3.10+, Git, thành thạo tạo/kích hoạt venv và đảm bảo Docker Desktop chạy ổn định."
    },
    {
      step: "02",
      title: "Cloud & Terraform",
      time: "Trước Day 16",
      icon: Cloud,
      color: "text-teal-400 border-teal-500/40",
      desc: "Tạo 1 Cloud account (GCP hoặc AWS), cài đặt Cloud CLI, cấu hình Terraform và bật Billing Alert."
    },
    {
      step: "03",
      title: "AI Accounts & API",
      time: "Trước Day 22",
      icon: Bot,
      color: "text-purple-400 border-purple-500/40",
      desc: "Lấy Hugging Face token, LangSmith account & API key, chuẩn bị 1 LLM provider hoặc Ollama local."
    },
    {
      step: "04",
      title: "Data Pipeline & Lakehouse",
      time: "Trước Day 17 — Day 19",
      icon: Database,
      color: "text-amber-400 border-amber-500/40",
      desc: "Ôn tập luồng xử lý Data Pipeline song song, kiến trúc Lakehouse và Vector Store (Qdrant) trước khi vào lab."
    },
    {
      step: "05",
      title: "MLOps & Observability",
      time: "Trước Day 23",
      icon: Eye,
      color: "text-pink-400 border-pink-500/40",
      desc: "Ôn tập Observability, Prometheus metrics, OpenTelemetry Traces và Continuous Evaluation trước Day 23."
    },
    {
      step: "06",
      title: "Unified Platform Integration",
      time: "Cột Mốc Day 28",
      icon: GitBranch,
      color: "text-emerald-400 border-emerald-500/40",
      desc: "Hợp nhất toàn bộ các thành phần stack đã học thành một Enterprise AI Platform hoàn chỉnh."
    }
  ];

  // TRACK 2: CHECKLIST LOCAL SETUP (DÙNG XUYÊN SUỐT)
  const localChecklist = [
    {
      title: "Python 3.10+ • Git • venv",
      cmd: "python --version && git --version",
      desc: "Kiểm tra phiên bản Python 3.10+ trở lên, Git đã cài đặt và biết cách khởi tạo virtual environment (python -m venv .venv)."
    },
    {
      title: "make • curl",
      cmd: "make --version && curl --version",
      desc: "Công cụ dòng lệnh terminal thiết yếu để chạy tự động Makefile build hệ thống và gọi API test HTTP endpoint."
    },
    {
      title: "Docker Desktop",
      cmd: "docker --version && docker ps",
      desc: "Docker Engine / Docker Desktop hoạt động ổn định, daemon sẵn sàng khởi chạy các container phân tán."
    },
    {
      title: "Tối thiểu 8 GB RAM trống",
      cmd: "RAM Allocated: >= 8 GB for Docker",
      desc: "Cấp phát tối thiểu 8 GB RAM trống cho Docker để chạy ổn định Qdrant, Postgres, Redis và API Gateway."
    }
  ];

  // TRACK 2: DAY 16 CLOUD AI ENVIRONMENT CHECKLIST
  const day16Checklist = [
    {
      title: "1 Cloud Account: GCP hoặc AWS",
      icon: Cloud,
      color: "text-sky-400",
      desc: "Chỉ cần 1 tài khoản Cloud chính (GCP hoặc AWS), tạo 1 Project/Workspace riêng biệt cho Track 2 và bật gói Billing/Trial."
    },
    {
      title: "Cloud CLI Đã Đăng Nhập",
      icon: Terminal,
      color: "text-teal-400",
      desc: "Cài đặt Google Cloud SDK (gcloud init) hoặc AWS CLI (aws configure) và xác thực tài khoản qua Terminal."
    },
    {
      title: "Terraform (Infrastructure as Code)",
      icon: Layers,
      color: "text-purple-400",
      desc: "Cài đặt Terraform CLI trên máy local để tự động hóa khởi tạo máy chủ GPU, mạng VPC và phân quyền đám mây."
    },
    {
      title: "Billing Alert + Hugging Face Token",
      icon: BellRing,
      color: "text-amber-400",
      desc: "Tạo cảnh báo ngân sách (Billing Alert) tránh phát sinh chi phí ngoài ý muốn; tạo HF Read Token và chấp nhận License model."
    }
  ];

  // TRACK 2: DAY 16 GPU MANAGEMENT CHECKLIST
  const day16GpuRules = [
    {
      title: "Xin GPU Quota Sớm",
      icon: Zap,
      color: "text-sky-400",
      desc: "Kiểm tra và xin GPU quota (NVIDIA T4, L4, A10G, A100) ngay sau khi có account Cloud vì thời gian duyệt quota có thể mất vài ngày."
    },
    {
      title: "Quota Chưa Có ➔ CPU Fallback",
      icon: Cpu,
      color: "text-teal-400",
      desc: "Nếu quota GPU chưa được cấp phát, chủ động dùng CPU fallback (chạy model nhỏ quantized GGUF) để không bị kẹt tiến độ học tập."
    },
    {
      title: "Cần Máy Ngoài ➔ Runpod / FPT AI Factory",
      icon: Radio,
      color: "text-indigo-400",
      desc: "Nếu laptop không đủ và Cloud quota chưa sẵn, thuê GPU theo giờ qua Runpod hoặc FPT AI Factory. Chỉ tạo Pod/VM khi code/notebook đã sẵn sàng chạy."
    },
    {
      title: "Chạy Xong ➔ Hủy / Dừng Tài Nguyên Ngay",
      icon: PowerOff,
      color: "text-amber-400",
      desc: "Xong việc thì Stop / Terminate tài nguyên ngay lập tức. Tuyệt đối không để máy ảo GPU chạy qua đêm tránh lãng phí chi phí."
    }
  ];

  // TRACK 2: ORACLE CLOUD USE CASE CHECKLIST
  const oracleCloudRules = [
    {
      title: "Tập SSH • Docker • API",
      icon: Terminal,
      color: "text-sky-400",
      desc: "Thích hợp khi cần 1 máy ảo Linux nhẹ chạy 24/7 để thực hành kết nối SSH từ xa, cài Docker và triển khai test API nhỏ."
    },
    {
      title: "Always Free VM",
      icon: HardDrive,
      color: "text-emerald-400",
      desc: "Tận dụng gói miễn phí trọn đời (Always Free Tier - ví dụ 4 OCPU Ampere ARM / 24GB RAM) nếu datacenter còn dung lượng."
    },
    {
      title: "Tạo & Lưu Trữ SSH Key",
      icon: Key,
      color: "text-purple-400",
      desc: "Tạo và lưu trữ an toàn cặp khóa SSH Key (ssh-keygen) để đăng nhập máy chủ từ xa, không dùng mật khẩu thông thường."
    },
    {
      title: "Lưu Ý: Không Phải GPU",
      icon: ShieldX,
      color: "text-rose-400",
      desc: "Oracle Always Free VM không có GPU. Nếu cần chạy model AI nặng, phải dùng GPU Quota của GCP/AWS hoặc thuê Runpod theo giờ."
    }
  ];

  // TRACK 2: DAY 22 - 28 AI ACCOUNTS & API KEY SECURITY
  const day22To28AiAccounts = [
    {
      title: "Hugging Face Token",
      icon: Bot,
      color: "text-amber-400",
      desc: "Tạo Hugging Face Read Token để pull model embeddings (BGE-M3), tokenizer và open-weights LLMs."
    },
    {
      title: "LangSmith Account + API Key",
      icon: Activity,
      color: "text-sky-400",
      desc: "Tạo tài khoản LangSmith lấy API Key phục vụ giám sát Observability, LLM Traces, Token Tracker và Evals."
    },
    {
      title: "1 LLM Provider hoặc Ollama Local",
      icon: Cpu,
      color: "text-purple-400",
      desc: "Chuẩn bị 1 Provider chính (OpenAI, Gemini, Anthropic) hoặc cài Ollama chạy local (DeepSeek R1, Llama 3.2)."
    },
    {
      title: ".env • Không Commit Secret",
      icon: Lock,
      color: "text-emerald-400",
      desc: "Tạo file .env từ .env.example. Kiểm tra kỹ .gitignore trước khi push. Tuyệt đối không đưa key vào code, git history hay ảnh bài nộp."
    }
  ];

  // TRACK 2: 4 TRỤ CỘT HỌC TẬP (13 LABS NỐI TIẾP NHAU TỪ DAY 16 ĐẾN DAY 28)
  const track2Pillars = [
    {
      num: "01",
      title: "CLOUD AI & DATA PIPELINE",
      icon: Cloud,
      color: "text-sky-400 border-sky-500/40 bg-sky-500/10",
      desc: "Dựng môi trường AI trên Cloud phân tán, xây dựng luồng dữ liệu tự động hóa (Data Pipeline) từ raw ingestion đến ETL xử lý song song.",
      details: ["Cloud GPU Clusters (GCP/AWS)", "Async Batch Processing", "Data Cleansing & Partitioning", "Automated Ingestion Pipeline"]
    },
    {
      num: "02",
      title: "LAKEHOUSE & VECTOR STORE",
      icon: Database,
      color: "text-teal-400 border-teal-500/40 bg-teal-500/10",
      desc: "Kiến trúc dữ liệu hiện đại Lakehouse kết hợp Vector Store (Qdrant) quy mô lớn, đánh chỉ mục đồ thị HNSW và tối ưu hóa Payload Filter.",
      details: ["Lakehouse Storage Architecture", "Qdrant Distributed Vectors", "HNSW Index Tuning", "Multi-modal Embedding Store"]
    },
    {
      num: "03",
      title: "MLOPS & OBSERVABILITY",
      icon: Eye,
      color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
      desc: "Model Serving hiệu năng cao với vLLM PagedAttention, quản lý vòng đời mô hình (MLOps), giám sát thời gian thực với Traces, Metrics và Evals.",
      details: ["vLLM High-throughput Serving", "Prometheus & OpenTelemetry", "Continuous LLM Evaluation", "Drift Detection & Alerting"]
    },
    {
      num: "04",
      title: "SECURITY & INTEGRATION (DAY 28 PLATFORM)",
      icon: ShieldCheck,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      desc: "Bảo mật toàn diện hệ thống AI, kiểm soát API key, phân quyền RBAC và ghép nối toàn bộ 13 labs thành một Enterprise AI Platform hoàn chỉnh vào Day 28.",
      details: ["Zero-trust API Gateway", "Secret & PII Redaction", "RBAC Access Control", "Day 28: Unified Platform"]
    }
  ];

  const currentFrameworkList = 
    selectedModule === 'USER' ? userFrameworks : 
    selectedModule === 'OPPORTUNITY' ? opportunityFrameworks : 
    selectedModule === 'BUILD' ? buildFrameworks :
    adoptionFrameworks;

  return (
    <div className="rounded-3xl bg-[#0f172a]/95 border border-slate-700/80 p-6 sm:p-10 space-y-8 shadow-2xl backdrop-blur-xl font-sans">
      
      {/* MASTER TRACK SWITCHER TABS: TRACK 1 vs TRACK 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTrack('TRACK1');
              setActiveTab(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-2 ${
              activeTrack === 'TRACK1'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25'
                : 'bg-[#0b1329] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Track 1 • AI Product</span>
          </button>

          <button
            onClick={() => {
              setActiveTrack('TRACK2');
              setActiveTab(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-2 ${
              activeTrack === 'TRACK2'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/25'
                : 'bg-[#0b1329] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Track 2 • AI Infrastructure & Data</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-sky-400">
          {activeTrack === 'TRACK1' ? '20 Core Frameworks (4 Modules)' : 'Day 16 — Day 28 (13 Labs Nối Tiếp)'}
        </span>
      </div>

      {/* RENDER TRACK 1 CONTENT */}
      {activeTrack === 'TRACK1' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Section Header & 4 Modules Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b1329] border border-sky-500/40 text-sky-300 text-xs font-semibold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5 text-sky-400" />
                <span>Track 1 • AI Product (Đúc Kết Thực Chiến Khóa 1)</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-wide text-shadow-clean">
                Khung Tư Duy Sản Phẩm AI (AI Product Frameworks)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Đúc kết thực chiến toàn diện từ học viên Khóa 1 chương trình <strong>AI in Action</strong>: Bộ 4 công cụ tư duy chuyển hóa ý tưởng thành sản phẩm AI có giá trị thực tiễn và ứng dụng thực tế.
              </p>
            </div>

            {/* 4 Module Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#070d1e] border border-slate-800 shrink-0">
              <button
                onClick={() => {
                  setSelectedModule('USER');
                  setActiveTab(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-1.5 ${
                  selectedModule === 'USER'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>01. Hiểu Người Dùng</span>
              </button>

              <button
                onClick={() => {
                  setSelectedModule('OPPORTUNITY');
                  setActiveTab(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-1.5 ${
                  selectedModule === 'OPPORTUNITY'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>02. Kiểm Chứng Cơ Hội</span>
              </button>

              <button
                onClick={() => {
                  setSelectedModule('BUILD');
                  setActiveTab(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-1.5 ${
                  selectedModule === 'BUILD'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>03. Biến Ý Tưởng</span>
              </button>

              <button
                onClick={() => {
                  setSelectedModule('ADOPTION');
                  setActiveTab(0);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-1.5 ${
                  selectedModule === 'ADOPTION'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>04. Đưa AI Vào Dùng Thật</span>
              </button>
            </div>
          </div>

          {/* 5 Horizontal Tab Buttons for Current Module */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {currentFrameworkList.map((fw, idx) => {
              const isSelected = activeTab === idx;
              const IconComp = fw.icon;
              return (
                <button
                  key={fw.id}
                  onClick={() => setActiveTab(idx)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between space-y-2 shadow-sm ${
                    isSelected
                  ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-sky-400 text-white shadow-sky-500/20 scale-102'
                  : 'bg-[#0b1329]/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {fw.id}
                    </span>
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">{fw.tag}</div>
                    <div className="text-xs font-bold text-white uppercase tracking-tight truncate">
                      {fw.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Framework Detail Panel */}
          {(() => {
            const cur = currentFrameworkList[activeTab] ?? currentFrameworkList[0];
            if (!cur) return null;
            const IconComponent = cur.icon;
            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1329] border border-slate-800 space-y-6 animate-fadeIn shadow-inner">
                
                {/* Top Bar: Title & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0f172a] border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                          {cur.id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                          {cur.title} — <span className="text-sky-400">{cur.subtitle}</span>
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{cur.tag}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono self-start sm:self-auto">
                    {selectedModule === 'USER' && 'Module 01: Hiểu Người Dùng'}
                    {selectedModule === 'OPPORTUNITY' && 'Module 02: Kiểm Chứng Cơ Hội'}
                    {selectedModule === 'BUILD' && 'Module 03: Biến Ý Tưởng Thành Sản Phẩm'}
                    {selectedModule === 'ADOPTION' && 'Module 04: Đưa AI Vào Sử Dụng Thật'}
                  </div>
                </div>

                {/* Main Key Takeaway Box */}
                <div className={`p-4 rounded-2xl border ${cur.color} space-y-1`}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ý Chính Cốt Lõi:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                    "{cur.mainPoint}"
                  </p>
                </div>

                {/* Deep Explanation */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Phân Tích Chi Tiết & Bối Cảnh Thực Chiến:
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-line bg-[#070d1e] p-4 rounded-2xl border border-slate-800/80">
                    {cur.deepExplanation}
                  </p>
                </div>

                {/* Key Question to Ask */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-[#0b1329] border border-sky-500/40 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider font-mono">
                      Hỏi Khi Làm Bài / Triển Khai Vào Vận Hành Thật:
                    </span>
                    <p className="text-xs text-slate-100 font-medium leading-relaxed italic">
                      "{cur.keyQuestion}"
                    </p>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* RENDER TRACK 2 CONTENT: AI INFRASTRUCTURE & DATA */}
      {activeTrack === 'TRACK2' && (
        <div className="space-y-10 animate-fadeIn font-sans">
          
          {/* Track 2 Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a30] via-[#0f2444] to-[#071326] p-6 sm:p-10 border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold uppercase">
                Track 2 • AI Infrastructure & Data
              </span>
              <span className="px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
                Day 16 — Day 28 (13 Labs Nối Tiếp Nhau)
              </span>
            </div>

            <div className="space-y-3 max-w-3xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-wide text-shadow-clean">
                Track 2 Sẽ Học Gì? <br />
                <span className="text-emerald-400 font-bold">13 Labs Nối Tiếp Ghép Thành Platform Hoàn Chỉnh</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Track 2 sẽ đi từ việc dựng môi trường AI trên cloud, xử lý data pipeline và lakehouse, tới vector store, model serving, MLOps, observability, security và integration.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#0b1329]/80 border border-emerald-500/40 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Các lab sau dùng lại khá nhiều nền tảng của lab trước. Day 28 là lúc ghép toàn bộ thành Enterprise AI Platform hoàn chỉnh.</span>
              </div>
            </div>

            {/* Quick Readiness Principle */}
            <div className="p-4 rounded-2xl bg-[#070d1e]/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-slate-200 font-medium">
                  <strong>Khẩu hiệu chuẩn bị: </strong>
                  "Để vào lab, không dừng ở bước setup." Không chờ cloud account, không lo Docker lỗi, không xin API key phút cuối.
                </div>
              </div>
            </div>

          </div>

          {/* THỨ TỰ CHUẨN BỊ 6 BƯỚC TUẦN TỰ (LƯU BÀI NÀY) */}
          <div className="rounded-3xl bg-[#0b1329] border border-sky-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[11px] font-mono font-bold uppercase">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Thứ Tự Chuẩn Bị • Lưu Bài Này</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mt-2">
                  Roadmap 6 Bước Chuẩn Bị Tuần Tự (Từ Day 16 Đến Day 28)
                </h3>
              </div>
              <span className="text-xs text-sky-400 font-mono">
                Step-by-Step Preparation Roadmap
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Nếu chưa biết bắt đầu từ đâu, hãy thực hiện lần lượt theo thứ tự 6 bước bên dưới để đảm bảo không bị quá tải và sẵn sàng cho từng cột mốc lab thực chiến:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preparationRoadmap.map((r, rIdx) => {
                const IconComp = r.icon;
                return (
                  <div key={rIdx} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-sky-500/60 transition-all duration-300 space-y-3 shadow-md group hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        BƯỚC {r.step}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {r.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0b1329] border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComp className={`w-4 h-4 ${r.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight font-mono">
                        {r.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {r.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DAY 22 — DAY 28: AI ACCOUNTS & API KEY SECURITY */}
          <div className="rounded-3xl bg-gradient-to-br from-[#101e38] via-[#0f2444] to-[#071326] border border-purple-500/40 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-bold uppercase">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Day 22 — Day 28: AI Accounts (Lấy Sớm)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mt-2">
                  Chuẩn Bị Tài Khoản AI & Quy Chuẩn Bảo Mật .env
                </h3>
              </div>
              <span className="text-xs text-purple-300 font-mono">
                Zero-Leakage Security Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {day22To28AiAccounts.map((acc, aIdx) => {
                const IconComp = acc.icon;
                return (
                  <div key={aIdx} className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-2 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                        <IconComp className={`w-4 h-4 ${acc.color}`} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight font-mono">{acc.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{acc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security Rules Box */}
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-purple-500/30 flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-purple-300 uppercase tracking-wider font-mono">
                  Quy Chuẩn Bảo Vệ Khóa Bí Mật (API Key Privacy):
                </span>
                <p className="text-slate-200 leading-relaxed font-normal">
                  API key <strong>chỉ để trong file <code>.env</code></strong>; bắt buộc kiểm tra file <code>.gitignore</code> trước khi commit / push. Tuyệt đối không đưa key vào source code, Git commit history hay ảnh chụp bài nộp/báo cáo.
                </p>
              </div>
            </div>
          </div>

          {/* DAY 16: CLOUD AI ENVIRONMENT (CẦN CÓ TRƯỚC BUỔI HỌC) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0b1b33] via-[#0f2444] to-[#0b1329] border border-sky-500/40 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[11px] font-mono font-bold uppercase">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Day 16: Cloud AI Environment</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mt-2">
                  Cần Có Trước Buổi Học Day 16
                </h3>
              </div>

              {/* GCP vs AWS Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-[#070d1e] rounded-xl border border-slate-700">
                <button
                  onClick={() => setCloudProviderTab('GCP')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition ${
                    cloudProviderTab === 'GCP' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google Cloud (GCP)
                </button>
                <button
                  onClick={() => setCloudProviderTab('AWS')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition ${
                    cloudProviderTab === 'AWS' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Amazon Web Services (AWS)
                </button>
              </div>
            </div>

            {/* 4 Cards Grid for Day 16 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {day16Checklist.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 space-y-2 shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <IconComp className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight font-mono">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Step by Step Guide for Selected Cloud Provider */}
            <div className="p-5 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider font-mono">
                {cloudProviderTab === 'GCP' ? '⚡ 6 Bước Chuẩn Bị Cho Google Cloud Platform (GCP):' : '⚡ 5 Bước Chuẩn Bị Cho Amazon Web Services (AWS):'}
              </h4>
              <ol className="space-y-2 text-xs text-slate-200 font-normal leading-relaxed">
                {cloudProviderTab === 'GCP' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                      <span>Tạo Google Cloud account và tạo một Project riêng biệt cho Track 2.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                      <span>Bật liên kết tài khoản thanh toán (Billing / Free Trial $300).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                      <span>Cài đặt Google Cloud CLI trên máy local, mở terminal chạy lệnh <code>gcloud init</code> và đăng nhập.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                      <span>Tạo Cảnh báo ngân sách (Billing Alert) ở mức an toàn để theo dõi chi phí.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
                      <span>Cài đặt công cụ Terraform CLI (<code>terraform -version</code>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">6</span>
                      <span>Vào Hugging Face tạo Read Token (<code>hf_...</code>); chấp nhận license của model trước nếu cần.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                      <span>Tạo tài khoản AWS Account và kích hoạt IAM User có quyền AdministratorAccess.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                      <span>Bật cảnh báo chi phí (AWS CloudWatch Billing Alert).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                      <span>Cài đặt AWS CLI và chạy <code>aws configure</code> với Access Key & Secret Key.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                      <span>Cài đặt Terraform CLI (<code>terraform -version</code>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
                      <span>Tạo Hugging Face Read Token để sẵn sàng pull model trọng số.</span>
                    </li>
                  </>
                )}
              </ol>
            </div>
          </div>

          {/* DAY 16: GPU MANAGEMENT: CHỈ CẦN KHI LAB YÊU CẦU */}
          <div className="rounded-3xl bg-[#0b1329] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Day 16: GPU Optimization Strategy</span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-2">
                  GPU: Chỉ Cần Khi Lab Yêu Cầu
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-normal">
                "Kiểm soát chi phí thông minh — Tắt máy ngay khi chạy xong lab."
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {day16GpuRules.map((rule, rIdx) => {
                const IconComp = rule.icon;
                return (
                  <div key={rIdx} className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                        <IconComp className={`w-4 h-4 ${rule.color}`} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight font-mono">{rule.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{rule.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DAY 16: ORACLE CLOUD: DÙNG KHI NÀO? (VM LINUX NHẸ) */}
          <div className="rounded-3xl bg-[#0b1329] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold uppercase">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Day 16: Oracle Cloud Free Tier</span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-2">
                  Oracle Cloud: Dùng Khi Nào? (VM Linux Nhẹ)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-normal">
                "Thực hành SSH, Docker & Backend API 24/7 — Lưu ý: Không phải GPU."
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {oracleCloudRules.map((rule, oIdx) => {
                const IconComp = rule.icon;
                return (
                  <div key={oIdx} className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                        <IconComp className={`w-4 h-4 ${rule.color}`} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-tight font-mono">{rule.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{rule.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step 4 Steps for Oracle Cloud */}
            <div className="p-4 rounded-2xl bg-[#070d1e] border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                ⚡ 4 Bước Chuẩn Bị Cho Oracle Cloud:
              </h4>
              <ol className="space-y-1.5 text-xs text-slate-200 font-normal leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                  <span>Tạo tài khoản Oracle Cloud Free Tier account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                  <span>Chọn Home Region cẩn thận (nên chọn Singapore hoặc Tokyo để giảm độ trễ mạng).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                  <span>Tạo Always Free VM (Ampere A1 hoặc AMD Micro) nếu datacenter còn capacity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
                  <span>Tạo và lưu trữ an toàn SSH Key trên máy local để kết nối terminal.</span>
                </li>
              </ol>
            </div>
          </div>

          {/* CHECKLIST CHUẨN BỊ LOCAL TRƯỚC (DÙNG XUYÊN SUỐT) */}
          <div className="rounded-3xl bg-[#0b1329] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold uppercase">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Dùng Xuyên Suốt 13 Labs</span>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-2">
                  Chuẩn Bị Môi Trường Local Trước Khi Bắt Đầu
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-normal">
                "Không cần cài toàn bộ stack ngay từ đầu. Chỉ cần local sạch và Docker chạy ổn."
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localChecklist.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wide">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>

                  <div className="px-3 py-1.5 rounded-lg bg-[#070d1e] border border-slate-800 text-[11px] font-mono text-emerald-300">
                    <code>$ {item.cmd}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 CORE PILLARS OF TRACK 2 (THEO SLIDE GỐC) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Network className="w-5 h-5 text-emerald-400" />
                <span>4 Trụ Cột Kỹ Thuật Xuyên Suốt 13 Labs (Day 16 — Day 28)</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono hidden sm:inline-block">
                Continuous Infrastructure Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {track2Pillars.map((tp, idx) => {
                const IconComponent = tp.icon;
                return (
                  <div 
                    key={idx}
                    className="p-6 rounded-3xl bg-[#0f172a]/90 border border-slate-700/80 hover:border-emerald-400 transition-all duration-300 shadow-xl backdrop-blur-xl space-y-4 group hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#0b1329] border border-slate-700 group-hover:border-emerald-500/50 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-2xl font-bold font-mono text-slate-600 group-hover:text-emerald-400 transition-colors">
                        {tp.num}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                        {tp.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {tp.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                      {tp.details.map((d, dIdx) => (
                        <div 
                          key={dIdx}
                          className="px-2.5 py-1.5 rounded-xl bg-[#0b1329] border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DAY 28 INTEGRATION SPOTLIGHT */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0b1b33] via-[#0f2444] to-[#0b1329] border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Day 28: The Final Integration</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                Hợp Nhất Toàn Bộ 13 Labs Thành Enterprise AI Platform
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-normal max-w-2xl">
                Không phải một bài lab độc lập — Day 28 là cột mốc kiến trúc hợp nhất toàn bộ Cloud AI, Data Pipeline, Lakehouse, Qdrant Vector Store, vLLM Model Serving và Security Gateway thành một nền tảng AI sẵn sàng chạy Production cho doanh nghiệp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070d1e]/90 border border-emerald-500/40 text-center shrink-0 space-y-1 shadow-lg">
              <div className="text-xl font-bold font-mono text-emerald-400">13 LABS</div>
              <div className="text-[10px] text-slate-300 uppercase font-medium">Unified Platform</div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
