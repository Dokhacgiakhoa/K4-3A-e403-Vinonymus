using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.Common.Interfaces;

// Application chỉ biết DbSet (trừu tượng của EF Core), không biết Npgsql hay chuỗi kết nối.
public interface IApplicationDbContext
{
    DbSet<AppUser> Users { get; }
    DbSet<CurriculumModule> CurriculumModules { get; }
    DbSet<CurriculumTopic> CurriculumTopics { get; }
    DbSet<CourseEnrollment> CourseEnrollments { get; }
    DbSet<UserTopicProgress> UserTopicProgresses { get; }
    DbSet<IssuedCertificate> IssuedCertificates { get; }
    DbSet<QuizQuestion> QuizQuestions { get; }
    DbSet<QuizSubmission> QuizSubmissions { get; }
    DbSet<UserStreak> UserStreaks { get; }
    DbSet<PaymentLedger> PaymentLedgers { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
