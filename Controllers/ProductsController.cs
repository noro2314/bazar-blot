using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BazarBlot.Api.Data;
using BazarBlot.Api.Models;
using System.Security.Claims;

namespace BazarBlot.Api.Controllers;

/// <summary>
/// Ապրանքների կառավարման կոնտրոլեր
/// Products management controller
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Բոլոր ապրանքների ստացում
    /// Get all products
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] string? category = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool activeOnly = true)
    {
        try
        {
            var query = _context.Products.Include(p => p.User).AsQueryable();

            // Ֆիլտրացում ակտիվ ապրանքների համար
            // Filter for active products only
            if (activeOnly)
            {
                query = query.Where(p => p.IsActive);
            }

            // Կատեգորիայով ֆիլտրացում
            // Filter by category
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category.Contains(category));
            }

            // Գնային ֆիլտրացում
            // Price filtering
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            var products = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
            
            _logger.LogInformation("Վերադարձվել է {Count} ապրանք", products.Count);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ապրանքների ստացման սխալ");
            return StatusCode(500, "Ապրանքների ստացման սխալ");
        }
    }

    /// <summary>
    /// Կոնկրետ ապրանքի ստացում ID-ով
    /// Get specific product by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        try
        {
            var product = await _context.Products
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                _logger.LogWarning("Ապրանք {Id} ID-ով չի գտնվել", id);
                return NotFound($"Ապրանք {id} ID-ով չի գտնվել");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ապրանք {Id} ստացման սխալ", id);
            return StatusCode(500, "Ապրանք ստացման սխալ");
        }
    }

    /// <summary>
    /// Նոր ապրանքի ստեղծում
    /// Create new product
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        try
        {
            // Ընթացիկ օգտատիրոջ ID-ի ստացում
            // Get current user ID
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Օգտատիրոջ ID-ն չի գտնվել");
            }

            product.UserId = userId;
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Ստեղծվել է նոր ապրանք {Name} օգտատիրոջ {UserId} կողմից", 
                product.Name, userId);

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ապրանք ստեղծման սխալ");
            return StatusCode(500, "Ապրանք ստեղծման սխալ");
        }
    }

    /// <summary>
    /// Ապրանքի թարմացում
    /// Update product
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        try
        {
            if (id != product.Id)
            {
                return BadRequest("ID-ներն չեն համապատասխանում");
            }

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound($"Ապրանք {id} ID-ով չի գտնվել");
            }

            // Ստուգել, արդյոք օգտատիրը կարող է թարմացնել այս ապրանքը
            // Check if user can update this product
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && existingProduct.UserId != userId)
            {
                return Forbid("Դուք չեք կարող թարմացնել այս ապրանքը");
            }

            // Թարմացնել միայն թույլատրված դաշտերը
            // Update only allowed fields
            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.Category = product.Category;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.IsActive = product.IsActive;
            existingProduct.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Թարմացվել է ապրանք {Id} օգտատիրոջ {UserId} կողմից", 
                id, userId);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ապրանք {Id} թարմացման սխալ", id);
            return StatusCode(500, "Ապրանք թարմացման սխալ");
        }
    }

    /// <summary>
    /// Ապրանքի ջնջում
    /// Delete product
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound($"Ապրանք {id} ID-ով չի գտնվել");
            }

            // Ստուգել, արդյոք օգտատիրը կարող է ջնջել այս ապրանքը
            // Check if user can delete this product
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");
            
            if (!isAdmin && product.UserId != userId)
            {
                return Forbid("Դուք չեք կարող ջնջել այս ապրանքը");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Ջնջվել է ապրանք {Id} օգտատիրոջ {UserId} կողմից", 
                id, userId);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ապրանք {Id} ջնջման սխալ", id);
            return StatusCode(500, "Ապրանք ջնջման սխալ");
        }
    }

    /// <summary>
    /// Ապրանքի կատեգորիաների ստացում
    /// Get product categories
    /// </summary>
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        try
        {
            var categories = await _context.Products
                .Where(p => p.IsActive && !string.IsNullOrEmpty(p.Category))
                .Select(p => p.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Կատեգորիաների ստացման սխալ");
            return StatusCode(500, "Կատեգորիաների ստացման սխալ");
        }
    }
}