using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class UserStreakConfiguration : IEntityTypeConfiguration<UserStreak>
{
    public void Configure(EntityTypeBuilder<UserStreak> builder)
    {
        builder.ToTable("user_streaks");
        builder.HasKey(s => s.Id);
        builder.HasIndex(s => s.UserId).IsUnique();
    }
}
