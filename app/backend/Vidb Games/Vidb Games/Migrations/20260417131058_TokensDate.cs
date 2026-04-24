using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vidb_Games.Migrations
{
    /// <inheritdoc />
    public partial class TokensDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PasswordResetTokenDate",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VerificationTokenDate",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetTokenDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "VerificationTokenDate",
                table: "Users");
        }
    }
}
