using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class IssuedCertificateConfiguration : IEntityTypeConfiguration<IssuedCertificate>
{
    public void Configure(EntityTypeBuilder<IssuedCertificate> builder)
    {
        builder.ToTable("issued_certificates");
        builder.HasKey(c => c.Id);
        builder.HasIndex(c => c.CertificateCode).IsUnique();
        builder.HasIndex(c => new { c.UserId, c.ModuleId }).IsUnique();
    }
}
