using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NMS_WEBAPI.Models;
using NotesWebAPI.Models;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/auth")]
[EnableCors("AllowSpecificOrigin")]
public class AuthController : ControllerBase
{
    public static List<User> Users = new();
 
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterModel model)
    {
        if (Users.Any(x=>x.Email == model.Email))
            return BadRequest("User already exists.");
        Users.Add(
            new User
            {
                Email = model.Email,
                Id=Guid.NewGuid().ToString(),
                Name = model.Name,
                Password = model.Password,
                DateOfBirth = DateOnly.Parse(model.DateOfBirth)
            });
        return Ok("User registered successfully.");
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        if (Users.Any(x => x.Email == model.Email && x.Password == model.Password))
        {
            string userId = Users.Where( user=> user.Email == model.Email ).Select(x=>x.Id).FirstOrDefault(); 
            var token = JwtHelper.GenerateToken(userId);

            return Ok(new { token });
        }
        return Unauthorized("Invalid credentials.");
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var token = Request.Headers["Authorization"].ToString().Split(" ")[1];

        TokenBlackList.BlacklistedTokens.Add(token);

        return Ok("User logged out successfully.");
    }
  

}


 
 
