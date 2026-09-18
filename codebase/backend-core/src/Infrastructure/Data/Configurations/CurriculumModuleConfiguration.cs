using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class CurriculumModuleConfiguration : IEntityTypeConfiguration<CurriculumModule>
{
    public void Configure(EntityTypeBuilder<CurriculumModule> builder)
    {
        builder.ToTable("curriculum_modules");
        builder.HasKey(m => m.Id);
        builder.HasIndex(m => m.Slug).IsUnique();
        builder.HasMany(m => m.Topics)
            .WithOne(t => t.Module)
            .HasForeignKey(t => t.ModuleId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(m => m.Enrollments)
            .WithOne(e => e.Module)
            .HasForeignKey(e => e.ModuleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
