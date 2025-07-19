using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BazarBlot.Api.Data;
using BazarBlot.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Բազայի կապի տողի ստացում
// Get database connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// Entity Framework-ի կարգավորում
// Configure Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        // Development-ում SQLite-ի օգտագործում
        // Use SQLite in development
        options.UseSqlite(connectionString);
    }
    else
    {
        // Production-ում SQL Server-ի օգտագործում
        // Use SQL Server in production
        var azureConnection = builder.Configuration.GetConnectionString("AzureConnection");
        options.UseSqlServer(azureConnection ?? connectionString);
    }
});

// Identity ծառայության կարգավորում
// Configure Identity service
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Գաղտնաբառի պահանջներ
    // Password requirements
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Օգտատիրոջ պահանջներ
    // User requirements
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;

    // Լոգին պահանջներ
    // Lockout requirements
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication-ի կարգավորում
// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT key not found."));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Authorization-ի ավելացում
// Add Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
});

// CORS-ի կարգավորում
// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("BazarBlotPolicy", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("CORS:AllowedOrigins").Get<string[]>() ?? new[] { "*" };
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Controllers և API Explorer-ի ավելացում
// Add Controllers and API Explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger-ի կարգավորում JWT-ի համար
// Configure Swagger for JWT
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Բազար Բլոտ API",
        Version = "v1",
        Description = "Բազար Բլոտ խաղի API ծառայություն",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Բազար Բլոտ Թիմ",
            Email = "support@bazarblot.am"
        }
    });

    // JWT Authorization-ի ավելացում Swagger-ում
    // Add JWT Authorization in Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header օգտագործելով Bearer scheme. Օրինակ: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Application-ի կառուցում
// Build the application
var app = builder.Build();

// Նախնական տվյալների ավելացում
// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await SeedData.Initialize(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Սխալ տվյալների ավելացման ժամանակ (Error occurred seeding the database)");
    }
}

// HTTP պիպելայնի կարգավորում
// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Բազար Բլոտ API v1");
        options.RoutePrefix = string.Empty; // Swagger-ը բացել root path-ից
    });
}

// Middleware-ների կարգավորում
// Configure middlewares
app.UseHttpsRedirection();
app.UseCors("BazarBlotPolicy");
app.UseAuthentication();
app.UseAuthorization();

// Static files-ի սպասարկում (պատկերների համար)
// Serve static files (for images)
app.UseStaticFiles();

// Controllers-ների մապինգ
// Map controllers
app.MapControllers();

// Default endpoint-ի ավելացում
// Add default endpoint
app.MapGet("/", () => new
{
    Message = "Բարի գալուստ Բազար Բլոտ API (Welcome to Bazar Blot API)",
    Version = "1.0.0",
    Status = "Ակտիվ (Active)",
    Endpoints = new[]
    {
        "/swagger - API փաստաթղթեր",
        "/api/auth - Authentication",
        "/api/products - Ապրանքների կառավարում"
    }
});

// Ապպ-ի գործարկում
// Run the app
app.Run();
