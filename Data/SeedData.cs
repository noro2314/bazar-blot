using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using BazarBlot.Api.Models;

namespace BazarBlot.Api.Data;

/// <summary>
/// Բազայի նախնական տվյալների ավելացում (Database Seeding)
/// Ստեղծում է նախնական օգտատերեր և ապրանքներ
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Բազայի նախնական տվյալների ավելացում
    /// Seed initial data to the database
    /// </summary>
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new AppDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>());

        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Բազայի ստեղծում, եթե գոյություն չունի
        // Create database if it doesn't exist
        await context.Database.EnsureCreatedAsync();

        // Դերերի ստեղծում
        // Create roles
        await CreateRoles(roleManager);

        // Նախնական օգտատերերի ստեղծում
        // Create initial users
        var adminUser = await CreateAdminUser(userManager);
        var regularUser = await CreateRegularUser(userManager);

        // Նախնական ապրանքների ստեղծում
        // Create initial products
        if (!context.Products.Any())
        {
            await CreateInitialProducts(context, adminUser.Id, regularUser.Id);
        }
    }

    /// <summary>
    /// Դերերի ստեղծում
    /// Create roles
    /// </summary>
    private static async Task CreateRoles(RoleManager<IdentityRole> roleManager)
    {
        string[] roleNames = { "Admin", "User", "Moderator" };

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

    /// <summary>
    /// Ադմինիստրատորի ստեղծում
    /// Create admin user
    /// </summary>
    private static async Task<ApplicationUser> CreateAdminUser(UserManager<ApplicationUser> userManager)
    {
        var adminEmail = "admin@bazarblot.am";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Ադմին",
                LastName = "Ավագ",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        return adminUser;
    }

    /// <summary>
    /// Սովորական օգտատիրոջ ստեղծում
    /// Create regular user
    /// </summary>
    private static async Task<ApplicationUser> CreateRegularUser(UserManager<ApplicationUser> userManager)
    {
        var userEmail = "user@bazarblot.am";
        var regularUser = await userManager.FindByEmailAsync(userEmail);

        if (regularUser == null)
        {
            regularUser = new ApplicationUser
            {
                UserName = userEmail,
                Email = userEmail,
                FirstName = "Արամ",
                LastName = "Աշխատակից",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(regularUser, "User123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(regularUser, "User");
            }
        }

        return regularUser;
    }

    /// <summary>
    /// Նախնական ապրանքների ստեղծում
    /// Create initial products
    /// </summary>
    private static async Task CreateInitialProducts(AppDbContext context, string adminUserId, string regularUserId)
    {
        var products = new[]
        {
            new Product
            {
                Name = "Հայկական Կավե",
                Description = "Հայաստանում աճեցված բարձրորակ արաբիկա կավե",
                Price = 3500,
                StockQuantity = 50,
                Category = "Ըմպելիքներ",
                ImageUrl = "/images/armenian-coffee.jpg",
                UserId = adminUserId
            },
            new Product
            {
                Name = "Արցախի Գինի",
                Description = "Արցախի լեռներից բերված կարմիր գինի",
                Price = 8000,
                StockQuantity = 30,
                Category = "Ըմպելիքներ",
                ImageUrl = "/images/artsakh-wine.jpg",
                UserId = adminUserId
            },
            new Product
            {
                Name = "Հայկական Մեղր",
                Description = "Բնական լեռնային մեղր Հայաստանից",
                Price = 2500,
                StockQuantity = 100,
                Category = "Սնունդ",
                ImageUrl = "/images/armenian-honey.jpg",
                UserId = regularUserId
            },
            new Product
            {
                Name = "Տավուշի Չիր",
                Description = "Տավուշի մարզից բերված անուշ չիր",
                Price = 1200,
                StockQuantity = 75,
                Category = "Սնունդ",
                ImageUrl = "/images/tavush-dried-fruit.jpg",
                UserId = regularUserId
            },
            new Product
            {
                Name = "Հայկական Կիլիմ",
                Description = "Ձեռքով գործված ավանդական հայկական կիլիմ",
                Price = 150000,
                StockQuantity = 5,
                Category = "Ազգային Արվեստ",
                ImageUrl = "/images/armenian-carpet.jpg",
                UserId = adminUserId
            }
        };

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}