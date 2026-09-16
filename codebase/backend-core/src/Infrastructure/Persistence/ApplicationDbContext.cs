using AIIANotebook.Application.Common.Interfaces;
using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIIANotebook.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

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

    IQueryable<AppUser> IApplicationDbContext.Users => Users.AsNoTracking();
    IQueryable<CurriculumModule> IApplicationDbContext.CurriculumModules => CurriculumModules.AsNoTracking();
    IQueryable<CurriculumTopic> IApplicationDbContext.CurriculumTopics => CurriculumTopics.AsNoTracking();
    IQueryable<CourseEnrollment> IApplicationDbContext.CourseEnrollments => CourseEnrollments.AsNoTracking();
    IQueryable<UserTopicProgress> IApplicationDbContext.UserTopicProgresses => UserTopicProgresses.AsNoTracking();
    IQueryable<IssuedCertificate> IApplicationDbContext.IssuedCertificates => IssuedCertificates.AsNoTracking();
    IQueryable<QuizQuestion> IApplicationDbContext.QuizQuestions => QuizQuestions.AsNoTracking();
    IQueryable<QuizSubmission> IApplicationDbContext.QuizSubmissions => QuizSubmissions.AsNoTracking();
    IQueryable<UserStreak> IApplicationDbContext.UserStreaks => UserStreaks.AsNoTracking();
    IQueryable<PaymentLedger> IApplicationDbContext.PaymentLedgers => PaymentLedgers.AsNoTracking();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<Enum>().HaveConversion<string>();
        base.ConfigureConventions(configurationBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>(b =>
        {
            b.ToTable("users");
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<CurriculumModule>(b =>
        {
            b.ToTable("curriculum_modules");
            b.HasKey(m => m.Id);
            b.HasIndex(m => m.Slug).IsUnique();
            b.HasMany(m => m.Topics)
             .WithOne(t => t.Module)
             .HasForeignKey(t => t.ModuleId)
             .OnDelete(DeleteBehavior.Cascade);
            b.HasMany(m => m.Enrollments)
             .WithOne(e => e.Module)
             .HasForeignKey(e => e.ModuleId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CurriculumTopic>(b =>
        {
            b.ToTable("curriculum_topics");
            b.HasKey(t => t.Id);
            b.HasIndex(t => new { t.ModuleId, t.TopicNumber }).IsUnique();
        });

        modelBuilder.Entity<CourseEnrollment>(b =>
        {
            b.ToTable("course_enrollments");
            b.HasKey(e => e.Id);
            b.HasIndex(e => new { e.UserId, e.ModuleId }).IsUnique();
        });

        modelBuilder.Entity<UserTopicProgress>(b =>
        {
            b.ToTable("user_topic_progress");
            b.HasKey(p => p.Id);
            b.HasIndex(p => new { p.UserId, p.TopicId }).IsUnique();
        });

        modelBuilder.Entity<IssuedCertificate>(b =>
        {
            b.ToTable("issued_certificates");
            b.HasKey(c => c.Id);
            b.HasIndex(c => c.CertificateCode).IsUnique();
            b.HasIndex(c => new { c.UserId, c.ModuleId }).IsUnique();
        });

        modelBuilder.Entity<QuizQuestion>(b =>
        {
            b.ToTable("quiz_questions");
            b.HasKey(q => q.Id);
        });

        modelBuilder.Entity<QuizSubmission>(b =>
        {
            b.ToTable("quiz_submissions");
            b.HasKey(s => s.Id);
            b.HasIndex(s => s.UserId);
        });

        modelBuilder.Entity<UserStreak>(b =>
        {
            b.ToTable("user_streaks");
            b.HasKey(s => s.Id);
            b.HasIndex(s => s.UserId).IsUnique();
        });

        modelBuilder.Entity<PaymentLedger>(b =>
        {
            b.ToTable("payment_ledgers");
            b.HasKey(p => p.Id);
            b.HasIndex(p => p.OrderCode).IsUnique();
        });
    }
}
