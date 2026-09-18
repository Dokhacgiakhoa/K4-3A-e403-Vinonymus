using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class QuizSubmissionConfiguration : IEntityTypeConfiguration<QuizSubmission>
{
    public void Configure(EntityTypeBuilder<QuizSubmission> builder)
    {
        builder.ToTable("quiz_submissions");
        builder.HasKey(s => s.Id);
        builder.HasIndex(s => s.UserId);
    }
}
