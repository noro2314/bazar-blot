using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BazarBlot.Api.Models;

/// <summary>
/// Ապրանքի մոդել (Product Model)
/// Բազարի ապրանքների համար
/// </summary>
public class Product
{
    /// <summary>
    /// Ապրանքի եզակի իդենտիֆիկատոր
    /// Product unique identifier
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Ապրանքի անվանումը
    /// Product name
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Ապրանքի նկարագրությունը
    /// Product description
    /// </summary>
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Ապրանքի գինը
    /// Product price
    /// </summary>
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    /// <summary>
    /// Ապրանքի քանակը պահեստում
    /// Product quantity in stock
    /// </summary>
    [Required]
    public int StockQuantity { get; set; }

    /// <summary>
    /// Ապրանքի կատեգորիան
    /// Product category
    /// </summary>
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Ապրանքի պատկերի URL-ը
    /// Product image URL
    /// </summary>
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Ապրանքի ստեղծման ամսաթիվը
    /// Product creation date
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Ապրանքի վերջին թարմացումը
    /// Product last update date
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Արդյո՞ք ապրանքը ակտիվ է
    /// Whether the product is active
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Ապրանքը ավելացրած օգտատիրոջ ID-ն
    /// ID of the user who added the product
    /// </summary>
    [Required]
    public string UserId { get; set; } = string.Empty;

    /// <summary>
    /// Ապրանքը ավելացրած օգտատիրը
    /// User who added the product
    /// </summary>
    [ForeignKey("UserId")]
    public virtual ApplicationUser User { get; set; } = null!;
}