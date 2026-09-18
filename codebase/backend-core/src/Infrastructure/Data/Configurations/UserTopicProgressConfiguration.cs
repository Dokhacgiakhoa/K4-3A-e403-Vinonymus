using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class UserTopicProgressConfiguration : IEntityTypeConfiguration<UserTopicProgress>
{
    public void Configure(EntityTypeBuilder<UserTopicProgress> builder)
    {
        builder.ToTable("user_topic_progress");
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => new { p.UserId, p.TopicId }).IsUnique();
    }
}
