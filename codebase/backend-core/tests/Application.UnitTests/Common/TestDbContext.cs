using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Application.UnitTests.Common;

// DB trong bộ nhớ chỉ để test logic Application; không phụ thuộc Infrastructure hay Postgres.
public class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options), IApplicationDbContext
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<CurriculumModule> CurriculumModules => Set<CurriculumModule>();
    public DbSet<CurriculumTopic> CurriculumTopics => Set<CurriculumTopic>();
    public DbSet<CourseEnrollment> CourseEnrollments => Set<CourseEnrollment>();
    public DbSet<UserTopicProgress> UserTopicProgresses => Set<UserTopicProgress>();
    public DbSet<IssuedCertificate> IssuedCertificates => Set<IssuedCertificate>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizSubmission> QuizSubmissions => Set<QuizSubmission>();
    public DbSet<UserStreak> UserStreaks => Set<UserStreak>();
    public DbSet<PaymentLedger> PaymentLedgers => Set<PaymentLedger>();
}
