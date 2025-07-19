using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BazarBlot.Api.Models;

/// <summary>
/// Օգտատիրոջ մոդել (User Model)
/// Ընդլայնում է IdentityUser-ը հավելյալ հատկություններով
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>
    /// Օգտատիրոջ անունը (առաջին անուն)
    /// User's first name
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Օգտատիրոջ ազգանունը (վերջին անուն)
    /// User's last name
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Օգտատիրոջ գրանցման ամսաթիվը
    /// User's registration date
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Օգտատիրոջ վերջին թարմացումը
    /// User's last update date
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Օգտատիրոջ լրիվ անունը (FirstName + LastName)
    /// User's full name
    /// </summary>
    public string FullName => $"{FirstName} {LastName}";
}