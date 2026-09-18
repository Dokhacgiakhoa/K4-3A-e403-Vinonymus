namespace AIIANotebook.Application.Features.Curriculum;

public readonly record struct CourseProgress(int Completed, int Total)
{
    public int Percent => Total > 0 ? (int)Math.Round((double)Completed / Total * 100) : 0;
    public bool IsCompleted => Total > 0 && Completed >= Total;
}
