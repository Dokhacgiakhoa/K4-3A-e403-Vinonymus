using MediatR;

namespace AIIANotebook.Application.Features.Curriculum.Commands.ToggleTopicProgress;

/// <returns>false nếu bài học không thuộc chuyên đề đã chọn.</returns>
public record ToggleTopicProgressCommand(Guid ModuleId, Guid TopicId) : IRequest<bool>;
