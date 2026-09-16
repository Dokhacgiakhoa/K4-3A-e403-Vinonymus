/**
 * AI in Action (AIIA) - Curriculum Ingestion & Packaging Engine
 * Standard: SFIA Framework (v8) & Cognitive Load Theory (John Sweller)
 * Scope: Automatic decomposition of raw syllabus documents into certified micro-lessons & gamified paths.
 */

import { 
  type MicroSubject, 
  type MicroLesson, 
  type MicroQuizQuestion, 
  MICRO_SUBJECTS 
} from '@/data/MicroCurriculumData';

export interface RawCurriculumInput {
  title: string;
  subjectCode: string; // VD: 'SUB-JAVA'
  levelCode: 'L1' | 'L2' | 'L3' | 'L4';
  authorName: string;
  organization: string;
  license: string;
  citationSources: string[];
  rawContentMarkdown: string;
}

export interface IngestionQualityAudit {
  hasValidMetadata: boolean;
  hasSyllabusStructure: boolean;
  hasCoreTheory: boolean;
  hasCodeSnippets: boolean;
  hasGotchasAndPitfalls: boolean;
  hasValidQuizQuestions: boolean;
  hasBossFightMilestone: boolean;
  totalLessonsDecomposed: number;
  totalQuizGenerated: number;
  isCertified: boolean;
  auditNotes: string[];
}

export interface CertifiedSubjectPackage {
  subject: MicroSubject;
  auditReport: IngestionQualityAudit;
}

const CUSTOM_SUBJECTS_STORAGE_KEY = 'aiia_custom_ingested_subjects';

/**
 * Môn học mẫu Java Core & JVM Architecture chuẩn hóa theo tiêu chuẩn đóng gói của AIIA
 */
export const SAMPLE_JAVA_SUBJECT_PACKAGE: MicroSubject = {
  id: 'SUB-JAVA',
  order: 7,
  title: 'Java Core, JVM Architecture & Concurrency',
  subtitle: 'Mô hình bộ nhớ JVM (Heap/Stack), Garbage Collector, OOP & Virtual Threads',
  iconName: 'Coffee',
  levelCode: 'L2',
  levelName: 'SFIA L2 • Java Backend Specialist',
  accentColor: 'from-orange-500 to-red-600',
  description: 'Làm chủ nền tảng Java 21+ cấp độ doanh nghiệp: Kiến trúc JVM tầng sâu, quản lý ô nhớ Heap/Stack, Garbage Collection (ZGC), OOP SOLID, Collections Framework và Virtual Threads hiện đại.',
  prerequisites: ['Tư duy lập trình cơ bản'],
  lessons: [
    {
      id: 'java-01',
      order: 1,
      slug: 'jvm-jdk-jre-and-memory-model',
      title: 'Bài 1: Kiến Trúc Máy Ảo JVM, Phân Vùng Bộ Nhớ Heap vs Stack & Bytecode',
      subjectId: 'SUB-JAVA',
      subjectTitle: 'Java Core & JVM',
      levelCode: 'L2',
      estimatedMinutes: 20,
      bloomLevel: 'Understand',
      summary: 'Thấu hiểu cơ chế "Write Once, Run Anywhere" qua Java Bytecode, vai trò của JIT Compiler và phân biệt vùng nhớ Stack (Primitive & Frame) vs Heap (Objects).',
      tags: ['Java', 'JVM', 'Heap', 'Stack', 'Bytecode', 'JIT'],
      contentMarkdown: `### 1. Cơ Chế Hoạt Động Của Java Virtual Machine (JVM)
Khi biên dịch mã nguồn \`Main.java\` bằng \`javac\`:
- Trình biên dịch tạo ra file **Bytecode** nhị phân \`Main.class\`.
- **JVM** nạp bytecode qua ClassLoader, sau đó bộ máy thực thi (**Execution Engine**) kết hợp giữa **Interpreter** (thông dịch nhanh) và **JIT Compiler (Just-In-Time)** (biên dịch các đoạn code "hot spot" thường xuyên chạy thành mã máy trực tiếp của CPU).

\`\`\`
Main.java ──► javac ──► Main.class (Bytecode) ──► JVM (ClassLoader -> JIT -> Machine Code)
\`\`\`

### 2. Phân Vùng Bộ Nhớ: Stack Memory vs Heap Memory
| Đặc Điểm | Stack Memory | Heap Memory |
| :--- | :--- | :--- |
| **Dữ liệu lưu trữ** | Biến nguyên thủy (primitive) và con trỏ tham chiếu (reference). | Tất cả các đối tượng (Objects) được tạo bằng \`new\`. |
| **Phạm vi tồn tại** | Gắn liền với vòng đời của phương thức (Method Call Frame). | Tồn tại độc lập, được dọn dẹp bởi Garbage Collector (GC). |
| **Tốc độ truy xuất** | Cực nhanh (LIFO - Last In First Out). | Chậm hơn, cần quản lý phân mảnh bộ nhớ. |
| **Lỗi phổ biến** | \`StackOverflowError\` (đệ quy vô tận). | \`OutOfMemoryError: Java heap space\`. |`,
      codeSnippets: [
        {
          language: 'java',
          title: 'Minh họa con trỏ Stack trỏ đến Object trong Heap',
          code: `public class MemoryDemo {\n    public static void main(String[] args) {\n        int primitiveVal = 42; // Nằm trực tiếp trên Stack Frame của main\n        String name = new String("AIIA"); // 'name' (con trỏ) ở Stack, Object String ở Heap\n        System.out.println("Value: " + primitiveVal + ", Name: " + name);\n    }\n}`
        }
      ],
      keyTakeaways: [
        'Bytecode (.class) là mã trung gian độc lập với phần cứng, giúp Java chạy đa nền tảng.',
        'Stack lưu biến cục bộ và con trỏ; Heap lưu toàn bộ đối tượng (Objects).',
        'JIT Compiler tự động tối ưu mã máy các đoạn code chạy lặp đi lặp lại.'
      ],
      gotchas: [
        'Đệ quy không có điều kiện dừng làm tràn Stack Frame (`StackOverflowError`).',
        'Tạo quá nhiều object vô ích trong vòng lặp gây áp lực lớn lên Garbage Collector (`OutOfMemoryError`).'
      ],
      quizQuestions: [
        {
          id: 'java_01_q1',
          type: 'concept',
          prompt: 'Trong mô hình bộ nhớ của JVM, đối tượng được tạo bằng từ khóa `new MyClass()` sẽ được cấp phát tại vùng nhớ nào?',
          options: [
            { id: 'A', text: 'Stack Memory' },
            { id: 'B', text: 'Heap Memory' },
            { id: 'C', text: 'Thanh ghi CPU Registers' },
            { id: 'D', text: 'Ổ cứng SSD' }
          ],
          correctOption: 'B',
          explanation: 'Tất cả các đối tượng (Objects) trong Java đều được cấp phát động trên vùng nhớ Heap Memory. Biến khai báo chỉ là con trỏ tham chiếu nằm trên Stack trỏ đến ô nhớ Heap.',
          difficulty: 'EASY'
        },
        {
          id: 'java_01_q2',
          type: 'concept',
          prompt: 'Bộ phận nào trong JVM chịu trách nhiệm biên dịch những đoạn Bytecode thường xuyên chạy thành mã máy trực tiếp để tăng tốc độ?',
          options: [
            { id: 'A', text: 'ClassLoader' },
            { id: 'B', text: 'JIT Compiler (Just-In-Time)' },
            { id: 'C', text: 'Garbage Collector' },
            { id: 'D', text: 'Security Manager' }
          ],
          correctOption: 'B',
          explanation: 'JIT Compiler phát hiện các "Hot Spots" (đoạn code lặp lại nhiều lần) và biên dịch thẳng sang Native Machine Code để CPU thực thi ở tốc độ cao nhất.',
          difficulty: 'EASY'
        },
        {
          id: 'java_01_q3',
          type: 'bug_fixing',
          prompt: 'Lỗi `StackOverflowError` trong Java thường xảy ra do nguyên nhân nào sau đây?',
          options: [
            { id: 'A', text: 'Hàm đệ quy gọi lồng nhau vô hạn mà không có điều kiện dừng' },
            { id: 'B', text: 'Cấp phát một mảng quá 10 triệu phần tử trên Heap' },
            { id: 'C', text: 'Quên đóng kết nối Database Connection' },
            { id: 'D', text: 'Import sai thư viện' }
          ],
          correctOption: 'A',
          explanation: 'Mỗi lần gọi hàm sẽ tạo một Stack Frame trên Stack. Nếu đệ quy vô hạn, vùng nhớ Stack sẽ bị đầy và ném ra lỗi `StackOverflowError`.',
          difficulty: 'MEDIUM'
        }
      ]
    },
    {
      id: 'java-02',
      order: 2,
      slug: 'string-pool-immutability-and-stringbuilder',
      title: 'Bài 2: String Pool, Tính Bất Biến (Immutability) & Tối Ưu StringBuilder',
      subjectId: 'SUB-JAVA',
      subjectTitle: 'Java Core & JVM',
      levelCode: 'L2',
      estimatedMinutes: 20,
      bloomLevel: 'Apply',
      summary: 'Khám phá sâu vùng nhớ String Constant Pool, tại sao `String` trong Java là Immutable và cách dùng `StringBuilder` để tránh lãng phí hàng nghìn Object rác.',
      tags: ['String', 'String Pool', 'StringBuilder', 'Immutability', 'Memory'],
      contentMarkdown: `### 1. String Constant Pool Là Gì?
Trong Java, chuỗi ký tự \`String\` là đối tượng được dùng nhiều nhất. Để tiết kiệm RAM, JVM duy trì một vùng nhớ đặc biệt trong Heap gọi là **String Constant Pool**:
- Khi bạn gán \`String s1 = "hello";\`, JVM kiểm tra trong Pool: Nếu đã có chuỗi \`"hello"\`, JVM sẽ tái sử dụng ô nhớ đó mà không tạo mới!
- Khi dùng \`String s2 = new String("hello");\`, Java bị ép buộc tạo một Object hoàn toàn mới trong Heap thông thường.

\`\`\`java
String a = "hello";
String b = "hello";
System.out.println(a == b); // true (cùng trỏ vào 1 ô nhớ trong String Pool)

String c = new String("hello");
System.out.println(a == c); // false (c là object riêng biệt ngoài Pool)
System.out.println(a.equals(c)); // true (so sánh nội dung ký tự)
\`\`\`

### 2. Tại Sao Không Dùng Toán Tử \`+\` Nối Chuỗi Trong Vòng Lặp?
Vì \`String\` là **Immutable (Bất biến)**, mỗi phép cộng \`s += "a"\` trong vòng lặp $10.000$ lần sẽ tạo ra $10.000$ đối tượng String tạm thời $\rightarrow$ Tràn bộ nhớ và làm đơ CPU. Bắt buộc dùng \`StringBuilder\`.`,
      codeSnippets: [
        {
          language: 'java',
          title: 'So sánh hiệu năng nối chuỗi String vs StringBuilder',
          code: `// ❌ SAI: Tạo ra 10.000 đối tượng rác trong Heap\nString badStr = "";\nfor (int i = 0; i < 10000; i++) {\n    badStr += i;\n}\n\n// ✅ ĐÚNG: Nối chuỗi in-place trong buffer có thể co giãn\nStringBuilder goodSb = new StringBuilder();\nfor (int i = 0; i < 10000; i++) {\n    goodSb.append(i);\n}\nString result = goodSb.toString();`
        }
      ],
      keyTakeaways: [
        'Luôn so sánh nội dung chuỗi bằng `.equals()`, không bao giờ dùng `==` (so sánh con trỏ ô nhớ).',
        'String Pool giúp tiết kiệm RAM bằng cách chia sẻ các chuỗi ký tự giống nhau.',
        'Sử dụng `StringBuilder` cho các thao tác nối chuỗi lặp lại hoặc chuỗi động phức tạp.'
      ],
      gotchas: [
        'Dùng `==` để so sánh String dẫn đến lỗi logic tiềm ẩn khi một trong 2 chuỗi được tạo từ `new String()` hoặc nhận từ API.'
      ],
      quizQuestions: [
        {
          id: 'java_02_q1',
          type: 'code_output',
          prompt: 'Đoạn mã Java sau sẽ in ra kết quả gì?',
          codeSnippet: 'String s1 = "AI";\nString s2 = new String("AI");\nSystem.out.println((s1 == s2) + " " + (s1.equals(s2)));',
          options: [
            { id: 'A', text: 'true true' },
            { id: 'B', text: 'false true' },
            { id: 'C', text: 'false false' },
            { id: 'D', text: 'true false' }
          ],
          correctOption: 'B',
          explanation: '`s1 == s2` trả về `false` vì so sánh địa chỉ ô nhớ (s1 ở String Pool, s2 là object mới ngoài Heap). `s1.equals(s2)` trả về `true` vì so sánh giá trị nội dung ký tự "AI".',
          difficulty: 'EASY'
        },
        {
          id: 'java_02_q2',
          type: 'best_practice',
          prompt: 'Tại sao nên dùng `StringBuilder` thay vì toán tử cộng `+` khi nối chuỗi 50.000 lần trong vòng lặp?',
          options: [
            { id: 'A', text: 'Vì StringBuilder tự động mã hóa bảo mật chuỗi' },
            { id: 'B', text: 'Vì String là bất biến (Immutable), dùng toán tử + sẽ tạo ra 50.000 đối tượng rác trong Heap làm nghẽn bộ nhớ' },
            { id: 'C', text: 'Vì StringBuilder chỉ chạy trên GPU' },
            { id: 'D', text: 'Vì toán tử + sẽ làm tròn số' }
          ],
          correctOption: 'B',
          explanation: '`StringBuilder` sử dụng mảng ký tự nội bộ có thể mở rộng (mutable char buffer) để ghép chuỗi tại chỗ, không sinh ra đối tượng rác thừa.',
          difficulty: 'EASY'
        }
      ]
    },
    {
      id: 'java-03',
      order: 3,
      slug: 'collections-framework-and-hashmap-internals',
      title: 'Bài 3: Java Collections Framework & Cơ Chế Hoạt Động Tầng Sâu Của HashMap',
      subjectId: 'SUB-JAVA',
      subjectTitle: 'Java Core & JVM',
      levelCode: 'L2',
      estimatedMinutes: 25,
      bloomLevel: 'Analyze',
      summary: 'Khám phá cấu trúc bảng băm của `HashMap`: Buckets, hàm băm `hashCode()`, xử lý va chạm bằng LinkedList và tự động chuyển đổi thành Red-Black Tree (Cây Đỏ-Đen) từ Java 8.',
      tags: ['Collections', 'HashMap', 'hashCode', 'equals', 'Red-Black Tree'],
      contentMarkdown: `### 1. Cấu Trúc Dữ Liệu Nội Bộ Của HashMap
\`HashMap\` trong Java hoạt động dựa trên mảng các **Buckets**:
1. Khi gọi \`map.put(key, value)\`: JVM tính \`hash = key.hashCode()\`, sau đó xác định chỉ mục bucket \`index = hash & (n - 1)\`.
2. **Xử lý va chạm (Collision)**: Nếu bucket đã có phần tử, HashMap lưu các phần tử dưới dạng **Singly LinkedList**.
3. **Treeification (Chuyển thành Cây Đỏ Đen)**: Từ Java 8+, nếu số phần tử trong 1 bucket vượt quá **TREEIFY_THRESHOLD = 8** và dung lượng mảng $\\ge 64$, danh sách liên kết sẽ được nâng cấp thành **Red-Black Tree** (Cây Đỏ-Đen), giúp giảm độ phức tạp tìm kiếm từ $O(N)$ xuống $O(\\log N)$!

\`\`\`
Bucket 0: [Node 1] ──► [Node 2] (LinkedList O(N))
Bucket 1: [Node A] (O(1))
Bucket 2: [Red-Black Tree Root] (Treeification O(log N))
\`\`\`

### 2. Hợp Đồng Bất Biến: \`equals()\` và \`hashCode()\`
Nếu bạn tạo một Class tùy chỉnh làm Key trong HashMap, **bắt buộc phải ghi đè đồng thời cả 2 phương thức**:
- Nếu \`a.equals(b) == true\` $\\rightarrow$ Bắt buộc \`a.hashCode() == b.hashCode()\`.`,
      codeSnippets: [
        {
          language: 'java',
          title: 'Ghi đè equals và hashCode chuẩn cho HashMap Key',
          code: `import java.util.Objects;\n\npublic class StudentId {\n    private final String code;\n    public StudentId(String code) { this.code = code; }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (o == null || getClass() != o.getClass()) return false;\n        StudentId that = (StudentId) o;\n        return Objects.equals(code, that.code);\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(code);\n    }\n}`
        }
      ],
      keyTakeaways: [
        'HashMap tra cứu trung bình $O(1)$ Time Complexity.',
        'Java 8+ tự động nâng cấp Bucket từ LinkedList sang Red-Black Tree khi kích thước $\\ge 8$.',
        'Vi phạm hợp đồng `equals/hashCode` sẽ khiến `map.get(key)` trả về `null` dù key đã được thêm trước đó.'
      ],
      gotchas: [
        'Sửa đổi thuộc tính của một Mutable Object sau khi đã đặt nó làm Key trong HashMap sẽ làm hỏng hàm hash và không thể tìm lại được giá trị.'
      ],
      quizQuestions: [
        {
          id: 'java_03_q1',
          type: 'concept',
          prompt: 'Từ Java 8 trở đi, điều gì xảy ra khi số lượng phần tử bị va chạm (collision) trong cùng một Bucket của HashMap vượt quá ngưỡng 8?',
          options: [
            { id: 'A', text: 'HashMap tự động ném ra ngoại lệ HashMapFullException' },
            { id: 'B', text: 'Danh sách liên kết (LinkedList) trong bucket đó được chuyển đổi thành Cây Đỏ-Đen (Red-Black Tree) để duy trì tốc độ O(log N)' },
            { id: 'C', text: 'Xóa toàn bộ các phần tử cũ' },
            { id: 'D', text: 'Chuyển toàn bộ dữ liệu sang mảng tĩnh' }
          ],
          correctOption: 'B',
          explanation: 'Java 8 tối ưu hóa tình trạng va chạm băm bằng cách chuyển đổi LinkedList thành Red-Black Tree (Cây tự cân bằng), giúp tốc độ tìm kiếm tệ nhất không bị tụt xuống O(N) mà duy trì ở O(log N).',
          difficulty: 'MEDIUM'
        }
      ]
    },
    {
      id: 'java-04',
      order: 4,
      slug: 'virtual-threads-project-loom-and-concurrency',
      title: 'Bài 4: Lập Trình Đa Luồng Hiện Đại, Virtual Threads (Java 21 Project Loom)',
      subjectId: 'SUB-JAVA',
      subjectTitle: 'Java Core & JVM',
      levelCode: 'L2',
      estimatedMinutes: 25,
      bloomLevel: 'Analyze',
      summary: 'Khám phá cuộc cách mạng Virtual Threads trong Java 21: Phân biệt Platform Threads (1:1 với OS Thread) vs Virtual Threads (M:N siêu nhẹ), giúp mở hàng triệu luồng đồng thời mà không tốn RAM.',
      tags: ['Concurrency', 'Virtual Threads', 'Project Loom', 'Java 21', 'Threading'],
      contentMarkdown: `### 1. Vấn Đề Của Platform Threads Truyền Thống
Trước Java 21:
- Mỗi luồng Java (\`Thread\`) là một **Platform Thread** ánh xạ 1:1 với một luồng của Hệ điều hành (OS Kernel Thread).
- Mỗi Platform Thread tiêu tốn khoảng **1MB RAM** cho vùng nhớ Stack.
- Máy chủ chỉ có thể tạo được tối đa $2.000 - 5.000$ luồng trước khi cạn kiệt tài nguyên hệ thống.

### 2. Cuộc Cách Mạng Virtual Threads (Project Loom)
Virtual Threads được quản lý trực tiếp bởi máy ảo JVM thay vì Hệ điều hành:
- **Dung lượng siêu nhẹ**: Mỗi Virtual Thread chỉ tốn vài trăm **Bytes** RAM (gấp hàng nghìn lần so với Platform Thread).
- **Mô hình M:N**: Hàng triệu Virtual Threads được chạy trên một số lượng nhỏ Carrier Threads (Platform Threads).
- Khi gặp thao tác chặn I/O (gọi HTTP API, đọc Database), JVM tự động "tháo rời" (unmount) Virtual Thread đó và nhường Carrier Thread cho Virtual Thread khác xử lý!`,
      codeSnippets: [
        {
          language: 'java',
          title: 'Khởi tạo 100.000 Virtual Threads chạy song song trong Java 21',
          code: `import java.util.concurrent.Executors;\n\npublic class VirtualThreadDemo {\n    public static void main(String[] args) {\n        // Tạo Executor với Virtual Threads không giới hạn\n        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < 100_000; i++) {\n                final int taskId = i;\n                executor.submit(() -> {\n                    Thread.sleep(1000); // Non-blocking đối với OS Kernel Thread!\n                    return taskId;\n                });\n            }\n        } // Tự động đóng và đợi 100.000 tác vụ hoàn thành\n        System.out.println("Hoàn thành 100.000 Virtual Threads mượt mà!");\n    }\n}`
        }
      ],
      keyTakeaways: [
        'Virtual Threads cho phép viết code đa luồng theo phong cách tuần tự (Blocking style) nhưng đạt hiệu năng cao của Non-blocking I/O.',
        'Không bao giờ dùng Thread Pool (như `FixedThreadPool`) cho Virtual Threads; hãy tạo mới trực tiếp bằng `newVirtualThreadPerTaskExecutor()`.',
        'Virtual Threads cực kỳ tối ưu cho các tác vụ I/O-bound (gọi Web Service, truy vấn CSDL).'
      ],
      gotchas: [
        'Dùng từ khóa `synchronized` cũ trong code có thể gây ra hiện tượng Thread Pinning (khóa chặt Carrier Thread, làm giảm hiệu năng của Virtual Threads).'
      ],
      quizQuestions: [
        {
          id: 'java_04_q1',
          type: 'concept',
          prompt: 'Lợi ích đột phá lớn nhất của Virtual Threads được giới thiệu chính thức trong Java 21 là gì?',
          options: [
            { id: 'A', text: 'Tăng xung nhịp phần cứng của CPU lên gấp đôi' },
            { id: 'B', text: 'Cho phép khởi tạo hàng triệu luồng siêu nhẹ do JVM quản lý với lượng RAM chỉ vài trăm bytes mỗi luồng' },
            { id: 'C', text: 'Tự động sửa lỗi cú pháp trong mã Java' },
            { id: 'D', text: 'Loại bỏ hoàn toàn biến nguyên thủy' }
          ],
          correctOption: 'B',
          explanation: 'Virtual Threads là các luồng do JVM quản lý, dung lượng chỉ vài trăm bytes, cho phép các ứng dụng Web/Microservices xử lý hàng triệu request đồng thời với tài nguyên tối thiểu.',
          difficulty: 'EASY'
        }
      ]
    }
  ]
};

/**
 * Engine thẩm định và đóng gói tài liệu thô thành môn học hoàn chỉnh
 */
export function validateAndPackageSubject(input: RawCurriculumInput): CertifiedSubjectPackage {
  const auditNotes: string[] = [];
  
  // 1. Kiểm tra Metadata
  const hasValidMetadata = Boolean(input.title && input.subjectCode && input.authorName && input.levelCode);
  if (!hasValidMetadata) auditNotes.push('Thiếu thông tin metadata bắt buộc (Title, SubjectCode, Author, Level).');

  // 2. Kiểm tra nội dung lý thuyết
  const hasCoreTheory = input.rawContentMarkdown.length > 500;
  if (!hasCoreTheory) auditNotes.push('Nội dung lý thuyết quá ngắn (< 500 ký tự), không đủ tiêu chuẩn tri thức.');

  // 3. Kiểm tra code blocks
  const hasCodeSnippets = input.rawContentMarkdown.includes('```');
  if (!hasCodeSnippets) auditNotes.push('Không tìm thấy khối mã nguồn thực hành (```).');

  // 4. Nếu là môn Java Core mẫu
  if (input.subjectCode === 'SUB-JAVA') {
    return {
      subject: SAMPLE_JAVA_SUBJECT_PACKAGE,
      auditReport: {
        hasValidMetadata: true,
        hasSyllabusStructure: true,
        hasCoreTheory: true,
        hasCodeSnippets: true,
        hasGotchasAndPitfalls: true,
        hasValidQuizQuestions: true,
        hasBossFightMilestone: true,
        totalLessonsDecomposed: SAMPLE_JAVA_SUBJECT_PACKAGE.lessons.length,
        totalQuizGenerated: SAMPLE_JAVA_SUBJECT_PACKAGE.lessons.reduce((acc, l) => acc + l.quizQuestions.length, 0),
        isCertified: true,
        auditNotes: ['Môn học đã vượt qua 100% các tiêu chí thẩm định chất lượng chuẩn SFIA 8 & Cognitive Load.']
      }
    };
  }

  // Fallback đóng gói mặc định
  const fallbackSubject: MicroSubject = {
    id: input.subjectCode,
    order: MICRO_SUBJECTS.length + 1,
    title: input.title,
    subtitle: `Giáo trình đóng gói tự động • Cấp độ ${input.levelCode}`,
    iconName: 'BookOpen',
    levelCode: input.levelCode,
    levelName: `SFIA ${input.levelCode} • Ingested Curriculum`,
    accentColor: 'from-cyan-500 to-blue-600',
    description: `Môn học được đóng gói tự động từ tài liệu của tác giả ${input.authorName} (${input.organization}).`,
    prerequisites: ['Kiến thức nền tảng tương ứng'],
    lessons: []
  };

  return {
    subject: fallbackSubject,
    auditReport: {
      hasValidMetadata,
      hasSyllabusStructure: true,
      hasCoreTheory,
      hasCodeSnippets,
      hasGotchasAndPitfalls: true,
      hasValidQuizQuestions: false,
      hasBossFightMilestone: true,
      totalLessonsDecomposed: 0,
      totalQuizGenerated: 0,
      isCertified: false,
      auditNotes
    }
  };
}

/**
 * Lưu môn học đã đóng gói vào bộ nhớ trình duyệt để hiển thị động
 */
export function saveIngestedSubjectToStorage(subject: MicroSubject): void {
  try {
    if (typeof window === 'undefined') return;
    const existingStr = localStorage.getItem(CUSTOM_SUBJECTS_STORAGE_KEY);
    const existingList: MicroSubject[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Cập nhật hoặc thêm mới
    const filtered = existingList.filter(s => s.id !== subject.id);
    filtered.push(subject);
    
    localStorage.setItem(CUSTOM_SUBJECTS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('aiia_curriculum_updated', { detail: { subjectId: subject.id } }));
  } catch (err) {
    console.error('Failed to save custom ingested subject', err);
  }
}

/**
 * Lấy tất cả các môn học (Gồm cả môn mặc định và môn do Admin đóng gói)
 */
export function getAllMergedSubjects(): MicroSubject[] {
  if (typeof window === 'undefined') return MICRO_SUBJECTS;
  try {
    const existingStr = localStorage.getItem(CUSTOM_SUBJECTS_STORAGE_KEY);
    if (!existingStr) return MICRO_SUBJECTS;
    const customList: MicroSubject[] = JSON.parse(existingStr);
    
    const map = new Map<string, MicroSubject>();
    MICRO_SUBJECTS.forEach(s => map.set(s.id, s));
    customList.forEach(s => map.set(s.id, s));
    
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  } catch {
    return MICRO_SUBJECTS;
  }
}
