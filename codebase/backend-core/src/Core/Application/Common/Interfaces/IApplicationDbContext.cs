using AIIANotebook.Domain.Entities;

namespace AIIANotebook.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    IQueryable<AppUser> Users { get; }
    IQueryable<CurriculumModule> CurriculumModules { get; }
    IQueryable<CurriculumTopic> CurriculumTopics { get; }
    IQueryable<CourseEnrollment> CourseEnrollments { get; }
    IQueryable<UserTopicProgress> UserTopicProgresses { get; }
    IQueryable<IssuedCertificate> IssuedCertificates { get; }
    IQueryable<QuizQuestion> QuizQuestions { get; }
    IQueryable<QuizSubmission> QuizSubmissions { get; }
    IQueryable<UserStreak> UserStreaks { get; }
    IQueryable<PaymentLedger> PaymentLedgers { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
