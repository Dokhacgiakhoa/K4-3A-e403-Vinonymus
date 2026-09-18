using AIIANotebook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AIIANotebook.Infrastructure.Data.Configurations;

public class PaymentLedgerConfiguration : IEntityTypeConfiguration<PaymentLedger>
{
    public void Configure(EntityTypeBuilder<PaymentLedger> builder)
    {
        builder.ToTable("payment_ledgers");
        builder.HasKey(p => p.Id);
        builder.HasIndex(p => p.OrderCode).IsUnique();
    }
}
