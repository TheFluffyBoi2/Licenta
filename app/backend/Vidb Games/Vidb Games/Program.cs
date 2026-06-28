using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.Google;
using Vidb_Games.Data;
using Vidb_Games.Services;
using Vidb_Games.Services.Interfaces;
using IGDB;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    }).AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["GoogleAuthentication:ClientId"]!;
        googleOptions.ClientSecret = builder.Configuration["GoogleAuthentication:ClientSecret"]!;

    });

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Introdu token-ul JWT astfel: Bearer {token-ul_tau}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<IIGDBService, IGDBService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddHttpClient<IRecommendService, RecommendService>();
builder.Services.AddHttpClient<CheapSharkService>(client =>
{
    client.DefaultRequestHeaders.UserAgent.ParseAdd("VidbGames/1.0 (wishlist-deals)");
});
builder.Services.AddHostedService<WishlistService>();
builder.Services.AddSingleton(_ => IGDBClient.CreateWithDefaults(
    builder.Configuration["IGDB:ClientId"]!,
    builder.Configuration["IGDB:ClientSecret"]!
));
builder.Services.AddScoped<IGDBService>();

builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: "AllowFrontend",
            policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            });
    }
);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseStaticFiles();
app.UseCors("AllowFrontend");

app.UseRouting();


app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapOpenApi();

app.Run();
