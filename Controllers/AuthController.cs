using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BazarBlot.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace BazarBlot.Api.Controllers;

/// <summary>
/// Նույնականացման և գրանցման կոնտրոլեր
/// Authentication and registration controller
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Օգտատիրոջ գրանցում
    /// User registration
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");

                _logger.LogInformation("Նոր օգտատիրոջ գրանցում՝ {Email}", model.Email);

                var token = await GenerateJwtToken(user);
                return Ok(new
                {
                    Message = "Գրանցումը հաջողակ է",
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.FullName
                    }
                });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Գրանցման սխալ՝ {Email}", model.Email);
            return StatusCode(500, "Գրանցման սխալ");
        }
    }

    /// <summary>
    /// Օգտատիրոջ մուտք
    /// User login
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("Անվավեր email կամ գաղտնաբառ");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (result.Succeeded)
            {
                var token = await GenerateJwtToken(user);

                _logger.LogInformation("Հաջողակ մուտք՝ {Email}", model.Email);

                return Ok(new
                {
                    Message = "Մուտքը հաջողակ է",
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.FullName
                    }
                });
            }

            return Unauthorized("Անվավեր email կամ գաղտնաբառ");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Մուտքի սխալ՝ {Email}", model.Email);
            return StatusCode(500, "Մուտքի սխալ");
        }
    }

    /// <summary>
    /// JWT token-ի գեներացում
    /// Generate JWT token
    /// </summary>
    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT key not found."));

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new("FirstName", user.FirstName),
            new("LastName", user.LastName)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryInMinutes"] ?? "60")),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

/// <summary>
/// Գրանցման մոդել
/// Registration model
/// </summary>
public class RegisterModel
{
    [Required(ErrorMessage = "Email-ը պարտադիր է")]
    [EmailAddress(ErrorMessage = "Անվավեր email ֆորմատ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Գաղտնաբառը պարտադիր է")]
    [MinLength(6, ErrorMessage = "Գաղտնաբառը պետք է ունենա նվազագույնը 6 նիշ")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Գաղտնաբառի հաստատումը պարտադիր է")]
    [Compare("Password", ErrorMessage = "Գաղտնաբառերը չեն համապատասխանում")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Անունը պարտադիր է")]
    [MaxLength(50, ErrorMessage = "Անունը չպետք է գերազանցի 50 նիշը")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ազգանունը պարտադիր է")]
    [MaxLength(50, ErrorMessage = "Ազգանունը չպետք է գերազանցի 50 նիշը")]
    public string LastName { get; set; } = string.Empty;
}

/// <summary>
/// Մուտքի մոդել
/// Login model
/// </summary>
public class LoginModel
{
    [Required(ErrorMessage = "Email-ը պարտադիր է")]
    [EmailAddress(ErrorMessage = "Անվավեր email ֆորմատ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Գաղտնաբառը պարտադիր է")]
    public string Password { get; set; } = string.Empty;
}