using AIIANotebook.Domain.Entities;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Application.Features.Curriculum;

public record CurriculumModuleDto(
    Guid Id,
    int ModuleNumber,
    string Title,
    string Slug,
    string Description,
    SFIALevel TargetLevel,
    string BloomLevel,
    int EstimatedHours,
    string HumanAiRatio,
    string? CodeSnippet,
    string? CodeLanguage,
    bool IsEnrolled = false,
    int CompletedTopicsCount = 0,
    int TotalTopicsCount = 0,
    int ProgressPercent = 0,
    bool IsCompleted = false,
    CurriculumTrack Track = CurriculumTrack.Universal
);

public static class CurriculumService
{
    public static List<CurriculumModuleDto> GetDefaultModules()
    {
        return new List<CurriculumModuleDto>
        {
            new(Guid.Parse("11111111-1111-1111-1111-111111111100"), 0, "Chuyên Đề 0.1 • Bản Chất AI, Giải Mã Nỗi Sợ & Lịch Sử Tiến Hóa", "chuyen-de-0-1-ban-chat-ai", "Khám phá bản chất thật của Trí tuệ nhân tạo từ thần thoại đến kỷ nguyên Generative AI.", SFIALevel.L0, "Remember & Understand", 30, "20% AI - 80% Human", "# Tư duy AI cơ bản", "python", false, 0, 0, 0, false, CurriculumTrack.Universal),
            new(Guid.Parse("11111111-1111-1111-1111-111111111101"), 1, "Mảng, Quản lý Bộ nhớ Python/Java & Git", "mang-bo-nho-git", "Hiểu sâu cấu trúc Array và Memory Management giữa Python và Java.", SFIALevel.L1, "Remember", 20, "20% AI - 80% Human", "public class MemoryArrayDemo { ... }", "java", false, 0, 0, 0, false, CurriculumTrack.TechBase),
            new(Guid.Parse("11111111-1111-1111-1111-111111111102"), 2, "Two Pointers, Sliding Window & String Manipulation", "two-pointers-sliding-window", "Tối ưu hóa độ phức tạp thời gian từ O(N²) xuống O(N).", SFIALevel.L1, "Understand", 20, "20% AI - 80% Human", "def lengthOfLongestSubstring(s: str) -> int: ...", "python", false, 0, 0, 0, false, CurriculumTrack.TechBase),
            new(Guid.Parse("11111111-1111-1111-1111-111111111103"), 3, "Stack, Queue, Monotonic Stack & Cơ chế Đệ quy", "stack-queue-monotonic", "Khám phá cấu trúc Stack/Queue và ứng dụng Next Greater Element.", SFIALevel.L2, "Apply", 20, "30% AI - 70% Human", "def dailyTemperatures(temperatures: List[int]) -> List[int]: ...", "python", false, 0, 0, 0, false, CurriculumTrack.TechBase),
            new(Guid.Parse("11111111-1111-1111-1111-111111111104"), 4, "HashMap, HashSet, Kỹ thuật Băm & Tránh Va Chạm", "hashmap-hashset-collision", "Bản chất hàm băm hashCode(), equals() và Treeification.", SFIALevel.L2, "Apply", 20, "30% AI - 70% Human", "Map<String, Integer> map = new HashMap<>();", "java", false, 0, 0, 0, false, CurriculumTrack.TechBase)
        };
    }
}
