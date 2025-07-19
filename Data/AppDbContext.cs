using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BazarBlot.Api.Models;

namespace BazarBlot.Api.Data;

/// <summary>
/// Բազայի տվյալների համատեքստ (Database Context)
/// Կապում է մոդելները բազայի հետ
/// </summary>
public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Ապրանքների աղյուսակ
    /// Products table
    /// </summary>
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Ապրանքի մոդելի կարգավորումներ
        // Product model configurations
        builder.Entity<Product>(entity =>
        {
            // Ապրանքի անվանումը պարտադիր է և եզակի
            // Product name is required and unique
            entity.HasIndex(p => p.Name)
                .IsUnique()
                .HasDatabaseName("IX_Products_Name");

            // Գինը պետք է դրական լինի
            // Price must be positive
            entity.Property(p => p.Price)
                .HasPrecision(18, 2);

            // Քանակը պետք է ոչ բացասական լինի
            // Quantity must be non-negative
            entity.Property(p => p.StockQuantity)
                .HasDefaultValue(0);

            // Օգտատիրոջ հետ կապը
            // Relationship with user
            entity.HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Identity աղյուսակների անունները հայերենով
        // Identity table names in Armenian
        builder.Entity<ApplicationUser>().ToTable("Օգտատերեր"); // Users
        builder.Entity<Product>().ToTable("Ապրանքներ"); // Products
    }
}