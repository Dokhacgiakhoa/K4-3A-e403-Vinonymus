/**
 * AI in Action (AIIA) - Master Micro-Curriculum & Spaced Repetition Knowledge Base
 * Standard: SFIA Framework (v8) & Bloom's Revised Taxonomy
 * Architecture: Modular Bite-Sized Lessons for Free Linear Study & Pro Gamified Path
 */

export interface MicroQuizOption {
  id: string;
  text: string;
}

export interface MicroQuizQuestion {
  id: string;
  type: 'concept' | 'code_output' | 'best_practice' | 'bug_fixing';
  prompt: string;
  codeSnippet?: string;
  options: MicroQuizOption[];
  correctOption: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface MicroLesson {
  id: string;
  order: number;
  slug: string;
  title: string;
  subjectId: string;
  subjectTitle: string;
  levelCode: 'L1' | 'L2' | 'L3' | 'L4';
  estimatedMinutes: number;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  summary: string;
  tags: string[];
  contentMarkdown: string;
  codeSnippets?: Array<{
    language: string;
    title: string;
    code: string;
  }>;
  keyTakeaways: string[];
  gotchas: string[];
  quizQuestions: MicroQuizQuestion[];
}

export interface MicroSubject {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  iconName: string;
  levelCode: 'L1' | 'L2' | 'L3' | 'L4';
  levelName: string;
  accentColor: string;
  description: string;
  prerequisites: string[];
  lessons: MicroLesson[];
}

export const MICRO_SUBJECTS: MicroSubject[] = [
  {
    id: 'SUB-PY',
    order: 1,
    title: 'Python Master & Clean Code Architecture',
    subtitle: 'Nền tảng ngôn ngữ cốt lõi, Quản lý bộ nhớ, OOP & Best Practices',
    iconName: 'Code2',
    levelCode: 'L1',
    levelName: 'SFIA L1 • Follower / Foundation',
    accentColor: 'from-amber-500 to-yellow-600',
    description: 'Xây dựng nền móng lập trình vững chắc với Python 3.12+, từ cú pháp cốt lõi, quản lý môi trường ảo venv, kiểu dữ liệu nguyên thủy đến OOP nâng cao, Decorator và Generator.',
    prerequisites: ['Tư duy logic cơ bản'],
    lessons: [
      {
        id: 'py-01',
        order: 1,
        slug: 'python-setup-venv-and-execution-model',
        title: 'Bài 1: Môi Trường Thực Thi, Virtualenv (venv) & Cơ Chế Hoạt Động Của CPython',
        subjectId: 'SUB-PY',
        subjectTitle: 'Python Master',
        levelCode: 'L1',
        estimatedMinutes: 15,
        bloomLevel: 'Understand',
        summary: 'Hiểu cách CPython biên dịch bytecode sang `.pyc`, cơ chế quản lý gói độc lập qua venv và tránh ô nhiễm Global Python Environment.',
        tags: ['Python', 'venv', 'CPython', 'Bytecode', 'pip'],
        contentMarkdown: `### 1. Cơ Chế Thực Thi Của Python (CPython Architecture)
Khi bạn chạy một file \`script.py\`, trình thông dịch CPython không thực thi trực tiếp mã nguồn văn bản mà thực hiện theo 2 bước:
1. **Biên dịch mã nguồn (Compilation)**: Mã nguồn Python được dịch thành **Bytecode** (các lệnh mã máy trung gian tối ưu) và lưu trong thư mục \`__pycache__/\` với đuôi \`.pyc\`.
2. **Thực thi trên máy ảo (Python Virtual Machine - PVM)**: PVM đọc từng chỉ lệnh Bytecode và chuyển thành các lệnh mã máy (Machine Code) để CPU phần cứng xử lý.

\`\`\`
Source Code (.py) ──► CPython Compiler ──► Bytecode (.pyc) ──► PVM Loop ──► Machine Code (CPU)
\`\`\`

### 2. Tại Sao Bắt Buộc Dùng Virtual Environment (venv)?
Trong các dự án kỹ thuật AI & Backend, các thư viện (dependencies) như PyTorch, FastAPI, Pandas có thể xung đột phiên bản nghiêm trọng. Nếu cài trực tiếp bằng \`pip install\` lên hệ điều hành (Global Python):
- Dự án A cần \`pydantic==1.10.x\` (legacy).
- Dự án B cần \`pydantic==2.8.x\` (modern).
- Cài đè sẽ phá vỡ toàn bộ môi trường máy chủ!

\`venv\` tạo ra một cây thư mục cô lập hoàn toàn chứa bản sao binary của Python và thư mục \`site-packages\` riêng biệt.`,
        codeSnippets: [
          {
            language: 'bash',
            title: 'Khởi tạo và kích hoạt môi trường venv chuẩn production',
            code: `# Bước 1: Tạo môi trường ảo với Python 3.12\npython -m venv .venv\n\n# Bước 2: Kích hoạt môi trường (Windows PowerShell)\n.venv\\Scripts\\Activate.ps1\n\n# Kích hoạt trên macOS/Linux\nsource .venv/bin/activate\n\n# Bước 3: Đóng băng danh sách dependencies\npip freeze > requirements.txt`
          }
        ],
        keyTakeaways: [
          'CPython dịch mã nguồn sang Bytecode (.pyc) trước khi PVM thực thi.',
          'Mỗi dự án bắt buộc phải có một virtual environment riêng để tránh dependency conflict.',
          'Không bao giờ commit thư mục .venv vào Git repository (thêm vào .gitignore).'
        ],
        gotchas: [
          'Quên kích hoạt venv trước khi chạy pip install dẫn đến cài nhầm vào Global OS.',
          'Chạy lệnh pip install mà không có requirements.txt cố định phiên bản gây lỗi drift môi trường trên production.'
        ],
        quizQuestions: [
          {
            id: 'py_01_q1',
            type: 'concept',
            prompt: 'CPython xử lý file mã nguồn .py như thế nào trước khi chạy trên CPU?',
            options: [
              { id: 'A', text: 'Biên dịch trực tiếp mã nguồn thành file nhị phân .exe độc lập' },
              { id: 'B', text: 'Biên dịch mã nguồn thành Bytecode trung gian (.pyc) rồi PVM thực thi' },
              { id: 'C', text: 'Chạy trực tiếp chuỗi ký tự văn bản mà không qua bước biên dịch nào' },
              { id: 'D', text: 'Chuyển mã nguồn sang ngôn ngữ C rồi mới chạy' }
            ],
            correctOption: 'B',
            explanation: 'CPython trước tiên biên dịch mã nguồn thành chỉ lệnh Bytecode (.pyc), sau đó máy ảo Python Virtual Machine (PVM) sẽ thông dịch và thực thi từng lệnh Bytecode.',
            difficulty: 'EASY'
          },
          {
            id: 'py_01_q2',
            type: 'best_practice',
            prompt: 'Lợi ích quan trọng nhất của việc sử dụng Virtual Environment (venv) trong dự án Python là gì?',
            options: [
              { id: 'A', text: 'Tăng tốc độ thực thi của CPU lên gấp 2 lần' },
              { id: 'B', text: 'Cách ly hoàn toàn các gói thư viện (dependencies), tránh xung đột phiên bản giữa các dự án' },
              { id: 'C', text: 'Tự động sửa lỗi cú pháp trong code Python' },
              { id: 'D', text: 'Mã hóa bảo vệ bản quyền mã nguồn không bị xem trộm' }
            ],
            correctOption: 'B',
            explanation: 'Virtual Environment giúp mỗi dự án có thư mục site-packages độc lập, tránh tình trạng xung đột phiên bản thư viện giữa các dự án khác nhau.',
            difficulty: 'EASY'
          },
          {
            id: 'py_01_q3',
            type: 'bug_fixing',
            prompt: 'Tại sao thư mục `.venv` KHÔNG NÊN được push lên Git repository?',
            options: [
              { id: 'A', text: 'Vì .venv chứa các binary và đường dẫn tuyệt đối gắn liền với máy cục bộ, không thể chạy trực tiếp trên máy khác' },
              { id: 'B', text: 'Vì Git không hỗ trợ commit thư mục có tên bắt đầu bằng dấu chấm' },
              { id: 'C', text: 'Vì dung lượng của .venv luôn vượt quá 100GB' },
              { id: 'D', text: 'Vì Python sẽ tự động xóa file .venv khi kết nối internet' }
            ],
            correctOption: 'A',
            explanation: '.venv chứa các liên kết và tệp nhị phân cục bộ theo hệ điều hành người dùng. Chuẩn mực là chỉ commit requirements.txt / pyproject.toml và tạo lại venv trên môi trường mới.',
            difficulty: 'MEDIUM'
          }
        ]
      },
      {
        id: 'py-02',
        order: 2,
        slug: 'python-types-memory-model-and-mutability',
        title: 'Bài 2: Hệ Thống Kiểu Dữ Liệu, Mô Hình Bộ Nhớ & Phân Biệt Mutable vs Immutable',
        subjectId: 'SUB-PY',
        subjectTitle: 'Python Master',
        levelCode: 'L1',
        estimatedMinutes: 20,
        bloomLevel: 'Apply',
        summary: 'Khám phá sâu cơ chế con trỏ đối tượng trong Python (Everything is an Object), phân biệt kiểu có thể thay đổi (Mutable) và bất biến (Immutable) để tránh bẫy tham chiếu bộ nhớ.',
        tags: ['Memory', 'Mutable', 'Immutable', 'id()', 'References'],
        contentMarkdown: `### 1. Tất Cả Mọi Thứ Trong Python Đều Là Đối Tượng (Object)
Trong Python, biến không phải là ô chứa giá trị trực tiếp như trong C/C++, mà là một **nhãn tên (Reference/Pointer)** trỏ đến một đối tượng trong vùng nhớ Heap.

Mỗi đối tượng trong CPython chứa ít nhất 3 thành phần:
- \`ob_refcnt\`: Số lượng tham chiếu đang trỏ đến đối tượng (dùng cho Garbage Collector).
- \`ob_type\`: Kiểu dữ liệu của đối tượng (int, str, list...).
- \`ob_value\`: Giá trị thực tế của đối tượng.

### 2. Bảng Phân Biệt Mutable vs Immutable
| Kiểu Dữ Liệu | Phân Loại | Khả Năng Sửa Giá Trị Tại Chỗ (In-place) | Ví Dụ |
| :--- | :--- | :--- | :--- |
| \`int\`, \`float\`, \`bool\` | **Immutable** (Bất biến) | ❌ Không (tạo object mới) | \`x = 5; x += 1\` (tạo int 6 mới) |
| \`str\`, \`tuple\`, \`bytes\` | **Immutable** (Bất biến) | ❌ Không | \`s = "hello"; s += "!"\` |
| \`list\`, \`dict\`, \`set\` | **Mutable** (Có thể đổi) | ✅ Có (giữ nguyên địa chỉ ô nhớ) | \`arr.append(10)\` |

### 3. Bẫy Nguy Hiểm: Default Argument Là Mutable Object
Nếu dùng \`def add_item(item, target_list=[])\`, tham số mặc định \`[]\` chỉ được khởi tạo **một lần duy nhất khi hàm được định nghĩa**. Mọi lần gọi hàm tiếp theo sẽ dùng chung một ô nhớ đó!`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Minh họa con trỏ bộ nhớ và bẫy default mutable argument',
            code: `# Minh họa id() bộ nhớ\na = [1, 2, 3]\nb = a  # b cùng trỏ vào ô nhớ của a\nb.append(4)\nprint(a)  # [1, 2, 3, 4] -> a bị thay đổi theo!\n\n# ❌ Bẫy Gotcha kinh điển:\ndef append_wrong(val, container=[]):\n    container.append(val)\n    return container\n\n# ✅ Cách khắc phục chuẩn Clean Code:\ndef append_clean(val, container=None):\n    if container is None:\n        container = []\n    container.append(val)\n    return container`
          }
        ],
        keyTakeaways: [
          'Mọi biến trong Python là con trỏ tham chiếu đến đối tượng trong bộ nhớ Heap.',
          'Immutable types (int, str, tuple) không thể thay đổi giá trị tại chỗ; Mutable types (list, dict, set) có thể sửa in-place.',
          'Không bao giờ đặt Mutable Object (như [] hoặc {}) làm giá trị mặc định của tham số hàm.'
        ],
        gotchas: [
          'Gán b = a với list/dict chỉ là sao chép con trỏ tham chiếu chứ không tạo bản sao độc lập (cần dùng copy.deepcopy()).',
          'Sửa đổi list/dict trong khi đang lặp qua chính nó bằng for loop dẫn đến Runtime Error hoặc nhảy cóc phần tử.'
        ],
        quizQuestions: [
          {
            id: 'py_02_q1',
            type: 'code_output',
            prompt: 'Đoạn mã sau sẽ in ra kết quả gì?',
            codeSnippet: 'a = [10, 20]\nb = a\nb.append(30)\nprint(len(a))',
            options: [
              { id: 'A', text: '2' },
              { id: 'B', text: '3' },
              { id: 'C', text: 'Báo lỗi NameError' },
              { id: 'D', text: '0' }
            ],
            correctOption: 'B',
            explanation: 'Vì List là kiểu Mutable, phép gán `b = a` khiến cả hai biến cùng trỏ vào một ô nhớ danh sách. Khi `b.append(30)`, danh sách tại ô nhớ đó có 3 phần tử, nên `len(a)` trả về 3.',
            difficulty: 'EASY'
          },
          {
            id: 'py_02_q2',
            type: 'concept',
            prompt: 'Kiểu dữ liệu nào dưới đây thuộc nhóm Immutable (Bất biến) trong Python?',
            options: [
              { id: 'A', text: 'List' },
              { id: 'B', text: 'Dictionary' },
              { id: 'C', text: 'Tuple' },
              { id: 'D', text: 'Set' }
            ],
            correctOption: 'C',
            explanation: 'Tuple và String là các kiểu dữ liệu Immutable (bất biến) trong Python, một khi đã tạo ra thì không thể thêm/bớt/sửa giá trị phần tử tại chỗ.',
            difficulty: 'EASY'
          },
          {
            id: 'py_02_q3',
            type: 'best_practice',
            prompt: 'Tại sao việc khai báo hàm `def process(data=[])` bị coi là Anti-pattern nguy hiểm?',
            options: [
              { id: 'A', text: 'Vì Python không cho phép khai báo mảng rỗng trong định nghĩa hàm' },
              { id: 'B', text: 'Vì danh sách mặc định chỉ được tạo một lần lúc nạp module và sẽ bị dùng chung qua tất cả các lần gọi hàm' },
              { id: 'C', text: 'Vì làm giảm tốc độ biên dịch của PVM' },
              { id: 'D', text: 'Vì biến data sẽ tự động chuyển thành kiểu số nguyên' }
            ],
            correctOption: 'B',
            explanation: 'Default argument dạng Mutable được đánh giá 1 lần duy nhất khi hàm được tạo, khiến các lần gọi hàm tiếp theo bị dính dữ liệu của lần gọi trước.',
            difficulty: 'MEDIUM'
          }
        ]
      },
      {
        id: 'py-03',
        order: 3,
        slug: 'python-control-flow-and-walrus-operator',
        title: 'Bài 3: Cấu Trúc Điều Kiển, Walrus Operator (:=) & Pattern Matching (match-case)',
        subjectId: 'SUB-PY',
        subjectTitle: 'Python Master',
        levelCode: 'L1',
        estimatedMinutes: 20,
        bloomLevel: 'Apply',
        summary: 'Làm chủ biểu thức điều kiện hiện đại trong Python 3.10+, toán tử gán Walrus Operator `:=` và Structural Pattern Matching.',
        tags: ['Control Flow', 'Walrus Operator', 'Match Case', 'Python 3.10+'],
        contentMarkdown: `### 1. Toán Tử Gán Walrus Operator (\`:=\`)
Được giới thiệu từ Python 3.8, Walrus Operator cho phép vừa gán giá trị cho một biến vừa trả về giá trị đó ngay trong một biểu thức điều kiện, giúp loại bỏ việc gọi lại hàm 2 lần:

\`\`\`python
# Cách cũ (lặp lại tính toán hoặc khai báo thừa):
data = fetch_api()
if len(data) > 10:
    print(f"Nhận được {len(data)} phần tử")

# Cách hiện đại với Walrus (:=):
if (n := len(fetch_api())) > 10:
    print(f"Nhận được {n} phần tử")
\`\`\`

### 2. Structural Pattern Matching (\`match-case\`)
Từ Python 3.10+, \`match-case\` thay thế các chuỗi \`if-elif-else\` cồng kềnh với khả năng bóc tách cấu trúc (Destructuring) dữ liệu phức tạp.`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Sử dụng match-case phân loại response AI Agent',
            code: `def handle_agent_response(response: dict):\n    match response:\n        case {"status": "success", "data": str(content)}:\n            print(f"AI Response: {content}")\n        case {"status": "error", "code": int(err_code), "message": msg}:\n            print(f"Error [{err_code}]: {msg}")\n        case _:\n            print("Unknown response format")`
          }
        ],
        keyTakeaways: [
          'Walrus Operator `:=` giúp gán biến trực tiếp trong biểu thức điều kiện.',
          'Match-case cung cấp khả năng pattern matching mạnh mẽ hơn hẳn switch-case truyền thống.',
          'Luôn có nhánh `case _:` làm fallback an toàn tránh unhandled cases.'
        ],
        gotchas: [
          'Lạm dụng Walrus Operator ở những biểu thức quá dài làm giảm tính dễ đọc của code (Readable code).'
        ],
        quizQuestions: [
          {
            id: 'py_03_q1',
            type: 'concept',
            prompt: 'Toán tử Walrus `:=` trong Python có chức năng gì?',
            options: [
              { id: 'A', text: 'So sánh bằng tuyệt đối cả về giá trị lẫn kiểu dữ liệu' },
              { id: 'B', text: 'Vừa gán giá trị cho biến vừa trả về giá trị đó ngay trong biểu thức' },
              { id: 'C', text: 'Định nghĩa một hàm nặc danh lambda' },
              { id: 'D', text: 'Ép kiểu chuỗi sang số nguyên' }
            ],
            correctOption: 'B',
            explanation: 'Toán tử Walrus `:=` (Assignment Expression) cho phép gán giá trị cho biến và đồng thời sử dụng kết quả đó trong biểu thức điều kiện.',
            difficulty: 'EASY'
          },
          {
            id: 'py_03_q2',
            type: 'code_output',
            prompt: 'Trong cú pháp `match-case` của Python, ký tự đại diện `_` trong `case _:` có ý nghĩa gì?',
            options: [
              { id: 'A', text: 'Bắt buộc biến phải có giá trị rỗng (None)' },
              { id: 'B', text: 'Nhánh mặc định (Default/Wildcard) khi không khớp với bất kỳ case nào ở trên' },
              { id: 'C', text: 'Lệnh thoát vòng lặp ngay lập tức' },
              { id: 'D', text: 'Khai báo biến private' }
            ],
            correctOption: 'B',
            explanation: '`case _:` đóng vai trò như `default` trong switch-case, khớp với bất kỳ giá trị nào còn lại chưa được xử lý.',
            difficulty: 'EASY'
          }
        ]
      },
      {
        id: 'py-04',
        order: 4,
        slug: 'python-collections-comprehensions-and-generators',
        title: 'Bài 4: List/Dict Comprehensions, Generator Expressions & Tiết Kiệm RAM',
        subjectId: 'SUB-PY',
        subjectTitle: 'Python Master',
        levelCode: 'L1',
        estimatedMinutes: 25,
        bloomLevel: 'Analyze',
        summary: 'Tối ưu hóa hiệu năng vòng lặp với Comprehensions và ứng dụng Generator (`yield`) để xử lý luồng dữ liệu hàng triệu bản ghi mà không tràn RAM.',
        tags: ['List Comprehension', 'Generators', 'yield', 'Memory Optimization'],
        contentMarkdown: `### 1. List Comprehension vs For Loop
List comprehension được thực thi ở tầng C của CPython, nhanh hơn vòng lặp for truyền thống 20-30%:
\`\`\`python
# Tốt: Clean & Fast
squares = [x * x for x in range(1000) if x % 2 == 0]
\`\`\`

### 2. Generator Expression & Từ Khóa \`yield\` (Lazy Evaluation)
Khi xử lý tệp dữ liệu lớn (dataset 10GB cho AI RAG):
- **List thường**: Nạp toàn bộ 10GB vào RAM -> Máy chủ crash (OOM - Out of Memory).
- **Generator (\`yield\`)**: Chỉ tạo ra từng phần tử một tại thời điểm cần dùng (Lazy Evaluation), RAM duy trì ở mức vài KB!`,
        codeSnippets: [
          {
            language: 'python',
            title: 'So sánh List vs Generator đọc file streaming',
            code: `import sys\n\n# List comprehension: Tốn nhiều bộ nhớ\nlist_data = [i for i in range(1_000_000)]\nprint(f"List RAM: {sys.getsizeof(list_data)} bytes")  # ~8.4 MB\n\n# Generator expression: Cực kỳ nhẹ\ngen_data = (i for i in range(1_000_000))\nprint(f"Generator RAM: {sys.getsizeof(gen_data)} bytes")  # ~200 bytes!`
          }
        ],
        keyTakeaways: [
          'List comprehension nhanh và gọn cho tập dữ liệu vừa và nhỏ.',
          'Generator (`yield` hoặc cú pháp `(...)`) là vũ khí tối thượng để xử lý dữ liệu lớn streaming với O(1) Memory.',
          'Generator chỉ có thể duyệt qua một lần duy nhất (exhausted).'
        ],
        gotchas: [
          'Cố gắng truy cập chỉ mục `gen[0]` trên một Generator sẽ gây ra TypeError (cần dùng `next(gen)`).'
        ],
        quizQuestions: [
          {
            id: 'py_04_q1',
            type: 'concept',
            prompt: 'Ưu điểm lớn nhất của Generator so với List khi xử lý 10 triệu bản ghi là gì?',
            options: [
              { id: 'A', text: 'Generator lưu dữ liệu vĩnh viễn trên ổ cứng SSD' },
              { id: 'B', text: 'Generator sinh dữ liệu theo cơ chế lười (Lazy Evaluation) từng phần tử một, tiết kiệm bộ nhớ RAM' },
              { id: 'C', text: 'Generator có thể truy xuất ngẫu nhiên theo index nhanh gấp đôi' },
              { id: 'D', text: 'Generator tự động chạy trên nhiều GPU' }
            ],
            correctOption: 'B',
            explanation: 'Generator chỉ sinh ra phần tử khi được yêu cầu (next), do đó mức tiêu thụ RAM luôn là O(1) bất kể dữ liệu lớn đến đâu.',
            difficulty: 'EASY'
          },
          {
            id: 'py_04_q2',
            type: 'code_output',
            prompt: 'Điều gì xảy ra khi bạn gọi hàm `next()` trên một Generator đã chạy hết các phần tử?',
            options: [
              { id: 'A', text: 'Tự động quay lại phần tử đầu tiên' },
              { id: 'B', text: 'Trả về giá trị None' },
              { id: 'C', text: 'Ném ra ngoại lệ StopIteration' },
              { id: 'D', text: 'Tạo vòng lặp vô tận' }
            ],
            correctOption: 'C',
            explanation: 'Khi Generator đã cạn kiệt phần tử, CPython sẽ raise ngoại lệ `StopIteration` để thông báo cho vòng lặp for dừng lại.',
            difficulty: 'MEDIUM'
          }
        ]
      },
      {
        id: 'py-05',
        order: 5,
        slug: 'python-advanced-functions-and-decorators',
        title: 'Bài 5: First-Class Functions, Closures & Xây Dựng Decorators Chuẩn Production',
        subjectId: 'SUB-PY',
        subjectTitle: 'Python Master',
        levelCode: 'L2',
        estimatedMinutes: 25,
        bloomLevel: 'Apply',
        summary: 'Hiểu bản chất hàm là First-Class Citizen, kỹ thuật bao bọc Closures và viết Decorators đo thời gian thực thi, retry gọi API LLM, log telemetry.',
        tags: ['Decorators', 'Closures', 'functools.wraps', 'Clean Code'],
        contentMarkdown: `### 1. Hàm Là Đối Tượng Bậc Nhất (First-Class Objects)
Trong Python:
- Hàm có thể được gán vào biến: \`f = my_func\`.
- Hàm có thể được truyền làm tham số cho hàm khác: \`map(clean_text, docs)\`.
- Hàm có thể trả về một hàm khác (Closure).

### 2. Decorator Là Gì?
Decorator là một hàm nhận vào một hàm khác và mở rộng hành vi của nó mà **không cần sửa đổi mã nguồn bên trong hàm gốc**. Thường dùng để: Đo thời gian thực thi, Logging, Kiểm tra quyền truy cập (Auth), Caching.`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Decorator đo thời gian và retry khi LLM API timeout',
            code: `import time\nimport functools\n\ndef measure_time(func):\n    @functools.wraps(func)  # Giữ nguyên docstring và function name\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        duration = time.perf_counter() - start\n        print(f"⏱️ [{func.__name__}] hoàn thành trong {duration:.4f}s")\n        return result\n    return wrapper\n\n@measure_time\ndef generate_embedding(text: str):\n    time.sleep(0.2)  # Giả lập gọi API\n    return [0.1, 0.5, 0.9]`
          }
        ],
        keyTakeaways: [
          'Luôn dùng `@functools.wraps(func)` trong decorator để giữ lại metadata (`__name__`, `__doc__`).',
          'Sử dụng `*args, **kwargs` để decorator có thể bọc bất kỳ hàm nào với số lượng tham số tùy ý.',
          'Decorator là nền tảng của các framework hiện đại như FastAPI (`@app.get`) và Flask.'
        ],
        gotchas: [
          'Quên `@functools.wraps` sẽ làm mất tên hàm gốc khi debug trong production logs.'
        ],
        quizQuestions: [
          {
            id: 'py_05_q1',
            type: 'best_practice',
            prompt: 'Tại sao bắt buộc phải sử dụng `@functools.wraps(func)` bên trong một custom Decorator?',
            options: [
              { id: 'A', text: 'Để tăng tốc độ thực thi hàm lên 100%' },
              { id: 'B', text: 'Để bảo toàn tên hàm gốc (__name__) và tài liệu (__doc__) của hàm bị bọc' },
              { id: 'C', text: 'Để ngăn hàm không bị crash khi có lỗi' },
              { id: 'D', text: 'Để biến hàm thành bất đồng bộ (async)' }
            ],
            correctOption: 'B',
            explanation: 'Không có `@functools.wraps`, hàm sau khi bọc sẽ bị đổi tên thành `wrapper`, gây khó khăn lớn khi ghi log và debug.',
            difficulty: 'EASY'
          },
          {
            id: 'py_05_q2',
            type: 'concept',
            prompt: 'Cú pháp `@my_decorator` đặt trước định nghĩa `def foo():` thực chất tương đương với phép gán nào?',
            options: [
              { id: 'A', text: 'foo = my_decorator(foo)' },
              { id: 'B', text: 'my_decorator = foo()' },
              { id: 'C', text: 'foo.my_decorator()' },
              { id: 'D', text: 'my_decorator(foo())' }
            ],
            correctOption: 'A',
            explanation: 'Decorator là cú pháp Syntactic Sugar tương đương hoàn toàn với `foo = my_decorator(foo)`.',
            difficulty: 'EASY'
          }
        ]
      },
      {
        id: 'py-06',
        order: 6,
        slug: 'python-oop-dunder-methods-and-dataclasses',
        title: 'Bài 6: Lập Trình Hướng Đối Tượng (OOP), Dunder Methods & Modern Dataclasses',
        subjectId: 'SUB-PY',
        subjectTitle: 'Python Master',
        levelCode: 'L2',
        estimatedMinutes: 25,
        bloomLevel: 'Apply',
        summary: 'Xây dựng Class chuẩn SOLID, làm chủ các phương thức ma thuật (Dunder/Magic methods: `__repr__`, `__eq__`, `__call__`) và sử dụng `@dataclass` tối giản boilerplate.',
        tags: ['OOP', 'Dataclass', 'Dunder Methods', 'SOLID'],
        contentMarkdown: `### 1. Các Phương Thức Ma Thuật (Dunder Methods) Cốt Lõi
- \`__init__(self, ...)\`: Khởi tạo thuộc tính đối tượng.
- \`__repr__(self)\`: Chuỗi hiển thị chính xác của đối tượng phục vụ logging và debug.
- \`__str__(self)\`: Chuỗi hiển thị thân thiện với người dùng.
- \`__eq__(self, other)\`: Định nghĩa phép so sánh bằng \`==\`.
- \`__call__(self, *args)\`: Cho phép gọi đối tượng như một hàm (\`obj()\`).

### 2. Hiện Đại Hóa Với \`@dataclass\`
Thay vì phải viết \`__init__\`, \`__repr__\`, \`__eq__\` thủ công cho hàng chục model dữ liệu, Python 3.7+ cung cấp \`@dataclass\` tự động sinh toàn bộ mã boilerplate.`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Sử dụng Dataclass định nghĩa AI Document Chunk',
            code: `from dataclasses import dataclass, field\nfrom typing import List\n\n@dataclass(frozen=True)  # frozen=True biến object thành Immutable & Hashable\nclass DocumentChunk:\n    chunk_id: str\n    text: str\n    score: float = 0.0\n    metadata: dict = field(default_factory=dict)\n\nchunk1 = DocumentChunk("c1", "Nội dung kiến thức RAG", 0.95)\nprint(chunk1)  # Tự động có __repr__ đẹp mắt!`
          }
        ],
        keyTakeaways: [
          'Dunder methods giúp class tương tác tự nhiên với các hàm dựng sẵn của Python (len, print, ==, hash).',
          '`@dataclass(frozen=True)` tạo đối tượng bất biến (Immutable), an toàn trong môi trường đa luồng.',
          'Dùng `field(default_factory=list)` cho thuộc tính mặc định kiểu mutable trong dataclass.'
        ],
        gotchas: [
          'Không dùng `metadata: dict = {}` trong dataclass vì sẽ bị lỗi mutable default; bắt buộc dùng `default_factory=dict`.'
        ],
        quizQuestions: [
          {
            id: 'py_06_q1',
            type: 'concept',
            prompt: 'Tham số `frozen=True` trong decorator `@dataclass(frozen=True)` mang lại tác dụng gì?',
            options: [
              { id: 'A', text: 'Tạm dừng chương trình 1 giây khi tạo đối tượng' },
              { id: 'B', text: 'Biến đối tượng thành bất biến (Immutable), không thể sửa giá trị thuộc tính sau khi tạo' },
              { id: 'C', text: 'Lưu đối tượng vào bộ nhớ đệm RAM vĩnh viễn' },
              { id: 'D', text: 'Tự động mã hóa dữ liệu' }
            ],
            correctOption: 'B',
            explanation: '`frozen=True` ngăn chặn việc gán lại giá trị cho các trường dữ liệu sau khi khởi tạo, giúp object an toàn và có thể hash được (làm key trong dictionary hoặc thêm vào set).',
            difficulty: 'EASY'
          }
        ]
      }
    ]
  },
  {
    id: 'SUB-DSA',
    order: 2,
    title: 'Data Structures & Algorithms (DSA in Action)',
    subtitle: 'Tối ưu độ phức tạp Big O, Con trỏ kép, Cửa sổ trượt & Đồ thị',
    iconName: 'Cpu',
    levelCode: 'L2',
    levelName: 'SFIA L2 • Practitioner / DSA Expert',
    accentColor: 'from-cyan-500 to-blue-600',
    description: 'Thấu hiểu cấu trúc dữ liệu và giải thuật từ góc nhìn quản lý ô nhớ RAM: Phân tích Big O thời gian & không gian, Two Pointers, Sliding Window, HashMap O(1), Binary Search và Graph Traversal.',
    prerequisites: ['Python Master & Kiến thức mảng cơ bản'],
    lessons: [
      {
        id: 'dsa-01',
        order: 1,
        slug: 'big-o-complexity-and-memory-model',
        title: 'Bài 1: Phân Tích Độ Phức Tạp Big O & Mô Phỏng Vùng Nhớ RAM Máy Tính',
        subjectId: 'SUB-DSA',
        subjectTitle: 'DSA in Action',
        levelCode: 'L2',
        estimatedMinutes: 20,
        bloomLevel: 'Analyze',
        summary: 'Nắm vững cách tính Big O ($O(1)$, $O(\\log N)$, $O(N)$, $O(N \\log N)$, $O(N^2)$), phân tích Worst-case vs Average-case và tối ưu Space Complexity.',
        tags: ['Big O', 'Time Complexity', 'Space Complexity', 'Memory RAM'],
        contentMarkdown: `### 1. Big O Notation Là Gì?
Big O là công cụ toán học mô tả **tốc độ tăng trưởng** của thời gian thực thi (Time) hoặc lượng bộ nhớ tiêu thụ (Space) khi kích thước đầu vào $N$ tiến tới vô cực.

### 2. Thang Đo Độ Phức Tạp Từ Nhanh Nhất Đến Chậm Nhất:
1. $O(1)$ - Constant: Truy xuất phần tử mảng theo index, tra cứu HashMap.
2. $O(\\log N)$ - Logarithmic: Binary Search (tìm kiếm nhị phân).
3. $O(N)$ - Linear: Duyệt qua mảng 1 lần.
4. $O(N \\log N)$ - Linearithmic: Merge Sort, Quick Sort (trung bình), Timsort (Python \`.sort()\`).
5. $O(N^2)$ - Quadratic: Hai vòng lặp lồng nhau (Nested for loop).
6. $O(2^N)$ / $O(N!)$ - Exponential / Factorial: Thuật toán vét cạn (Brute-force) đồ thị / sinh hoán vị.

\`\`\`
O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N)
\`\`\``,
        codeSnippets: [
          {
            language: 'python',
            title: 'So sánh O(N^2) vs O(N) bài toán Two Sum',
            code: `# Cách ngây thơ O(N^2): 2 vòng lặp lồng nhau\ndef two_sum_slow(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n\n# Cách tối ưu O(N) Time, O(N) Space với HashMap:\ndef two_sum_fast(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`
          }
        ],
        keyTakeaways: [
          'Big O đo tốc độ tăng theo $N$, bỏ qua các hằng số nhân và số hạng bậc thấp.',
          'Luôn hướng tới thuật toán $O(N)$ hoặc $O(N \\log N)$ khi xử lý dữ liệu lớn trên production.',
          'Đánh đổi Space lấy Time (Trade-off) là chiến lược kinh điển của cấu trúc dữ liệu HashMap.'
        ],
        gotchas: [
          'Nhầm lẫn giữa $O(1)$ Space (thuật toán In-place) và $O(N)$ Space (tạo mảng phụ mới).'
        ],
        quizQuestions: [
          {
            id: 'dsa_01_q1',
            type: 'concept',
            prompt: 'Độ phức tạp thời gian khi tra cứu một khóa (Key) trong Python Dictionary trung bình là bao nhiêu?',
            options: [
              { id: 'A', text: 'O(N)' },
              { id: 'B', text: 'O(1)' },
              { id: 'C', text: 'O(log N)' },
              { id: 'D', text: 'O(N^2)' }
            ],
            correctOption: 'B',
            explanation: 'Dictionary trong Python được triển khai bằng Bảng băm (Hash Table) với hàm băm tối ưu, cho phép tra cứu trung bình trong thời gian hằng số O(1).',
            difficulty: 'EASY'
          },
          {
            id: 'dsa_01_q2',
            type: 'concept',
            prompt: 'Nếu một thuật toán có 2 vòng lặp lồng nhau duyệt qua mảng kích thước N, độ phức tạp thời gian là gì?',
            options: [
              { id: 'A', text: 'O(N)' },
              { id: 'B', text: 'O(2N)' },
              { id: 'C', text: 'O(N^2)' },
              { id: 'D', text: 'O(log N)' }
            ],
            correctOption: 'C',
            explanation: 'Hai vòng lặp lồng nhau khiến số phép tính tăng theo tích N * N = N^2, thuộc cấp độ Quadratic O(N^2).',
            difficulty: 'EASY'
          }
        ]
      },
      {
        id: 'dsa-02',
        order: 2,
        slug: 'two-pointers-technique-and-in-place-mutation',
        title: 'Bài 2: Kỹ Thuật Con Trỏ Kép (Two Pointers) & Xử Lý Mảng Tại Chỗ (In-Place)',
        subjectId: 'SUB-DSA',
        subjectTitle: 'DSA in Action',
        levelCode: 'L2',
        estimatedMinutes: 25,
        bloomLevel: 'Apply',
        summary: 'Áp dụng mô hình 2 con trỏ chạy ngược chiều (Left/Right) hoặc cùng chiều (Fast/Slow) để giải quyết các bài toán tối ưu với $O(1)$ Extra Memory.',
        tags: ['Two Pointers', 'In-Place', 'O(1) Space', 'LeetCode'],
        contentMarkdown: `### 1. Bản Chất Kỹ Thuật Two Pointers
Thay vì dùng 2 vòng lặp lồng nhau $O(N^2)$, kỹ thuật Two Pointers dùng 2 chỉ mục di chuyển thông minh:
- **Dạng 1: Chạy ngược chiều (Left & Right)**: Thường áp dụng trên mảng đã sắp xếp (Sorted Array), bài toán Palindrome, cặp số có tổng bằng $K$.
- **Dạng 2: Con trỏ nhanh / chậm (Fast & Slow)**: Loại bỏ phần tử trùng lặp tại chỗ, phát hiện chu trình vòng lặp trong Linked List (Floyd Cycle Detection).`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Thuật toán xóa trùng lặp trên mảng đã sắp xếp (In-place O(1) Space)',
            code: `def remove_duplicates(nums: list[int]) -> int:\n    if not nums:\n        return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1`
          }
        ],
        keyTakeaways: [
          'Two Pointers giúp giảm độ phức tạp từ $O(N^2)$ xuống $O(N)$.',
          'Kỹ thuật In-place chỉnh sửa trực tiếp trên mảng gốc, đạt $O(1)$ Space Complexity.',
          'Luôn xác định điều kiện dừng của 2 con trỏ (\`left < right\`) để tránh vòng lặp vô tận.'
        ],
        gotchas: [
          'Quên cập nhật con trỏ \`left += 1\` hoặc \`right -= 1\` dẫn đến infinite loop.'
        ],
        quizQuestions: [
          {
            id: 'dsa_02_q1',
            type: 'concept',
            prompt: 'Điều kiện tiên quyết để áp dụng kỹ thuật Two Pointers chạy ngược chiều (Left/Right) tìm cặp số có tổng bằng Target là gì?',
            options: [
              { id: 'A', text: 'Mảng phải chứa toàn số nguyên dương' },
              { id: 'B', text: 'Mảng phải được sắp xếp theo thứ tự tăng dần (hoặc giảm dần)' },
              { id: 'C', text: 'Mảng phải có độ dài là số chẵn' },
              { id: 'D', text: 'Mảng không được chứa phần tử 0' }
            ],
            correctOption: 'B',
            explanation: 'Khi mảng đã sắp xếp, nếu tổng \`nums[L] + nums[R] < target\`, ta chắc chắn cần tăng \`L\` để tăng tổng; nếu \`> target\`, ta giảm \`R\`. Nếu mảng chưa sắp xếp, tính chất này không còn đúng.',
            difficulty: 'EASY'
          }
        ]
      }
    ]
  },
  {
    id: 'SUB-RAG',
    order: 3,
    title: 'Hybrid RAG, Vector Database & Retrieval Engine',
    subtitle: 'Chiến lược Chunking, Dense & Sparse Embedding, BM25 & RRF',
    iconName: 'BrainCircuit',
    levelCode: 'L3',
    levelName: 'SFIA L3 • Senior AI Engineer',
    accentColor: 'from-emerald-500 to-teal-600',
    description: 'Xây dựng hệ thống Hybrid RAG cấp độ sản xuất: Kỹ thuật phân đoạn văn bản thông minh (Chunking), Vector Embedding, Tìm kiếm kết hợp BM25 + Dense Vector và thuật toán xếp hạng Reciprocal Rank Fusion (RRF).',
    prerequisites: ['Python Master', 'DSA Cơ bản', 'Khái niệm Vector Embedding'],
    lessons: [
      {
        id: 'rag-01',
        order: 1,
        slug: 'chunking-strategies-and-semantic-boundaries',
        title: 'Bài 1: Chiến Lược Chunking Đa Tầng & Bảo Toàn Ranh Giới Ngữ Nghĩa',
        subjectId: 'SUB-RAG',
        subjectTitle: 'Hybrid RAG & Vector DB',
        levelCode: 'L3',
        estimatedMinutes: 25,
        bloomLevel: 'Analyze',
        summary: 'So sánh các chiến lược phân đoạn văn bản: Fixed-size Chunking, Recursive Character Splitter, Markdown Header Chunking và Semantic Chunking.',
        tags: ['RAG', 'Chunking', 'Token Limit', 'Embeddings'],
        contentMarkdown: `### 1. Tại Sao Chunking Quyết Định 80% Chất Lượng Của RAG?
Nếu đoạn văn bản (chunk) quá lớn:
- Nhiễm thông tin rác (Noise).
- Vượt quá Context Window của LLM.
- Vector Embedding bị "loãng" ngữ nghĩa (Diluted representation).

Nếu đoạn văn bản quá nhỏ:
- Mất ngữ cảnh bao quát (Loss of context).
- Câu bị cắt cụt giữa chừng khiến LLM hiểu sai.

### 2. Các Kỹ Thuật Chunking Chuẩn
- **Recursive Character Splitter**: Cắt tuần tự theo ưu tiên \`["\\n\\n", "\\n", " ", ""]\` để giữ nguyên đoạn văn và câu hoàn chỉnh.
- **Overlap (Độ gối đầu)**: Thường giữ 10-20% chunk size để không làm mất ngữ cảnh tại điểm nối giữa 2 chunks.`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Phân đoạn văn bản với Recursive Chunking và Overlap',
            code: `def recursive_chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> list[str]:\n    paragraphs = text.split("\\n\\n")\n    chunks = []\n    current_chunk = ""\n    for p in paragraphs:\n        if len(current_chunk) + len(p) <= chunk_size:\n            current_chunk += (p + "\\n\\n")\n        else:\n            if current_chunk:\n                chunks.append(current_chunk.strip())\n            current_chunk = p[-chunk_overlap:] + "\\n\\n" + p\n    if current_chunk:\n        chunks.append(current_chunk.strip())\n    return chunks`
          }
        ],
        keyTakeaways: [
          'Chunk size tối ưu cho hầu hết tài liệu kỹ thuật là 400 - 800 tokens kèm 10-15% overlap.',
          'Bảo toàn ranh giới tiêu đề Markdown giúp chunk giữ được ngữ cảnh danh mục cha.',
          'Semantic chunking tách đoạn dựa trên khoảng cách Cosine giữa các câu liên tiếp.'
        ],
        gotchas: [
          'Cắt text cứng theo số ký tự mà không xét ranh giới từ (word boundaries) làm chém đôi từ ngữ.'
        ],
        quizQuestions: [
          {
            id: 'rag_01_q1',
            type: 'concept',
            prompt: 'Mục đích chính của tham số Chunk Overlap (Độ gối đầu) trong kỹ thuật phân đoạn văn bản RAG là gì?',
            options: [
              { id: 'A', text: 'Để nhân đôi dung lượng lưu trữ của cơ sở dữ liệu' },
              { id: 'B', text: 'Để đảm bảo không bị đứt đoạn ngữ nghĩa của các câu nằm ngay tại ranh giới cắt giữa 2 chunks liền kề' },
              { id: 'C', text: 'Để mã hóa bảo mật đoạn văn bản' },
              { id: 'D', text: 'Để tăng tốc độ tính toán của Embedding model' }
            ],
            correctOption: 'B',
            explanation: 'Chunk Overlap giữ lại một phần đuôi của chunk trước gắn vào đầu chunk sau, giúp bảo toàn mạch văn và ngữ cảnh nguyên vẹn.',
            difficulty: 'EASY'
          }
        ]
      },
      {
        id: 'rag-02',
        order: 2,
        slug: 'hybrid-search-bm25-dense-vector-and-rrf',
        title: 'Bài 2: Tìm Kiếm Kết Hợp (Hybrid Search) BM25 + Dense Vector & Thuật Toán RRF',
        subjectId: 'SUB-RAG',
        subjectTitle: 'Hybrid RAG & Vector DB',
        levelCode: 'L3',
        estimatedMinutes: 30,
        bloomLevel: 'Evaluate',
        summary: 'Khắc phục điểm yếu mất từ khóa chính xác của Vector Search bằng cách kết hợp BM25 (Sparse) với Dense Vector qua công thức Reciprocal Rank Fusion ($RRF$).',
        tags: ['Hybrid Search', 'BM25', 'RRF', 'Dense Vector', 'PostgreSQL pgvector'],
        contentMarkdown: `### 1. Điểm Yếu Chí Mạng Của Vector Search Thuần Túy
Vector Search (Dense Embedding) rất giỏi nắm bắt ngữ nghĩa tổng quát (ví dụ: "chú chó" gần với "cún con"), nhưng **rất tệ khi tìm kiếm từ khóa chính xác** (Exact Match):
- Mã định danh sản phẩm: \`SKU-98214-X\`.
- Tên biến code: \`useStudyTimer\`.
- Số điện thoại, mã lỗi hệ thống \`ERR_403_FORBIDDEN\`.

### 2. Thuật Toán Reciprocal Rank Fusion (RRF)
RRF xếp hạng lại kết quả bằng cách cộng nghịch đảo thứ hạng từ cả 2 công cụ tìm kiếm:

$$RRF\\_Score(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$

Trong đó $k \\approx 60$ là hằng số làm mượt, $r_m(d)$ là thứ hạng của tài liệu trong hệ thống $m$ (BM25 hoặc Vector).`,
        codeSnippets: [
          {
            language: 'python',
            title: 'Triển khai thuật toán RRF kết hợp BM25 và Dense Search',
            code: `def reciprocal_rank_fusion(dense_ranks: list[str], sparse_ranks: list[str], k: int = 60) -> list[tuple[str, float]]:\n    scores = {}\n    for rank, doc_id in enumerate(dense_ranks, 1):\n        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank))\n    for rank, doc_id in enumerate(sparse_ranks, 1):\n        scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (k + rank))\n    return sorted(scores.items(), key=lambda x: x[1], reverse=True)`
          }
        ],
        keyTakeaways: [
          'Hybrid Search kết hợp thế mạnh của cả BM25 (chính xác từ khóa) và Vector Search (ngữ nghĩa).',
          'RRF giải quyết triệt để vấn đề thang đo điểm khác biệt giữa Cosine Distance và BM25 Score.',
          'Hằng số $k = 60$ là giá trị chuẩn được chứng minh qua nhiều nghiên cứu của SIGIR.'
        ],
        gotchas: [
          'Không nên cộng trực tiếp điểm Cosine Similarity (0-1) với điểm BM25 (0-vô cùng) vì scale không tương thích; bắt buộc phải dùng xếp hạng Rank hoặc RRF.'
        ],
        quizQuestions: [
          {
            id: 'rag_02_q1',
            type: 'concept',
            prompt: 'Tại sao trong hệ thống RAG chuẩn công nghiệp, người ta bắt buộc phải kết hợp BM25 (Sparse) với Vector Search (Dense)?',
            options: [
              { id: 'A', text: 'Vì Vector Search tốn ít RAM hơn BM25' },
              { id: 'B', text: 'Vì Vector Search thường bỏ sót các từ khóa tra cứu chính xác tuyệt đối như mã sản phẩm SKU, mã lỗi, tên biến' },
              { id: 'C', text: 'Vì BM25 có thể dịch văn bản đa ngôn ngữ' },
              { id: 'D', text: 'Vì BM25 chỉ chạy được trên điện thoại' }
            ],
            correctOption: 'B',
            explanation: 'Vector Embedding biểu diễn ngữ nghĩa trừu tượng nên dễ bị trôi khi tìm kiếm chính xác từng ký tự mã định danh, BM25 giải quyết hoàn hảo lỗ hổng này.',
            difficulty: 'MEDIUM'
          },
          {
            id: 'rag_02_q2',
            type: 'concept',
            prompt: 'Trong công thức Reciprocal Rank Fusion (RRF), đại lượng nào được sử dụng để tính điểm hợp nhất?',
            options: [
              { id: 'A', text: 'Kích thước file tài liệu tính bằng Kilobytes' },
              { id: 'B', text: 'Vị trí thứ hạng (Rank index) của tài liệu trong từng danh sách kết quả tìm kiếm' },
              { id: 'C', text: 'Số lượng chữ cái nguyên âm trong câu hỏi' },
              { id: 'D', text: 'Thời gian phản hồi của GPU' }
            ],
            correctOption: 'B',
            explanation: 'RRF sử dụng nghịch đảo của thứ hạng `1 / (k + rank)` nên không bị phụ thuộc vào sự chênh lệch đơn vị điểm số giữa các thuật toán khác nhau.',
            difficulty: 'MEDIUM'
          }
        ]
      }
    ]
  }
];

export function getAllLessons(): MicroLesson[] {
  return MICRO_SUBJECTS.flatMap(s => s.lessons);
}

export function getLessonById(lessonId: string): MicroLesson | undefined {
  return getAllLessons().find(l => l.id === lessonId);
}

export function getSubjectById(subjectId: string): MicroSubject | undefined {
  return MICRO_SUBJECTS.find(s => s.id === subjectId);
}
