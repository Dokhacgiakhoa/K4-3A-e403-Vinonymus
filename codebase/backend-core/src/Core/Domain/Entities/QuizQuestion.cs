using AIIANotebook.Domain.Common;
using AIIANotebook.Domain.Enums;

namespace AIIANotebook.Domain.Entities;

public class QuizQuestion : BaseEntity
{
    public Guid? ModuleId { get; set; }
    public SFIALevel Level { get; set; } = SFIALevel.L1;
    public required string QuestionText { get; set; }
    public required string OptionA { get; set; }
    public required string OptionB { get; set; }
    public required string OptionC { get; set; }
    public required string OptionD { get; set; }
    public required string CorrectOption { get; set; } // "A", "B", "C", "D"
    public required string Explanation { get; set; }
    public bool IsSimulationMock { get; set; } = true; // NDA-compliant simulation
}
