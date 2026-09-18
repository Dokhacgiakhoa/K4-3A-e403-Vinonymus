using System.Reflection;
using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options), IApplicationDbContext
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

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // Enum lưu dạng chữ để đọc được trong DB và khớp các ràng buộc CHECK đã có.
        configurationBuilder.Properties<Enum>().HaveConversion<string>();
        base.ConfigureConventions(configurationBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Tách dữ liệu nghiệp vụ khỏi public (FAQ/RAG) trên cùng project Supabase.
        modelBuilder.HasDefaultSchema("app");
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
