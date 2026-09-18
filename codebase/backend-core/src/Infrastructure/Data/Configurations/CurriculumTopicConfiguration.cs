using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class CurriculumTopicConfiguration : IEntityTypeConfiguration<CurriculumTopic>
{
    public void Configure(EntityTypeBuilder<CurriculumTopic> builder)
    {
        builder.ToTable("curriculum_topics");
        builder.HasKey(t => t.Id);
        builder.HasIndex(t => new { t.ModuleId, t.TopicNumber }).IsUnique();
    }
}
