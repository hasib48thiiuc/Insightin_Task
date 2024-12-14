using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using NotesWebAPI.Models;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text.Json.Serialization;
using static AuthController;
using static NotesController;

[ApiController]
[Route("api/notes")]
[EnableCors("AllowSpecificOrigin")]

public class NotesController : ControllerBase
{  
    public static Dictionary<string, List<NotesDB>> UserNotes = new();
    [HttpPost("create")]

    public IActionResult CreateNote([FromBody] NoteNew note)
    {
        if (note.content.Length > 100) return BadRequest("Note is too long.");

        var userId =  JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString().Split(" ")[1]);
        if (!UserNotes.ContainsKey(userId))
        {
            UserNotes.Add(userId, new List<NotesDB>() { });
        }
        var format = "yyyy-MM-ddTHH:mm";
        DateTime? reminderDate = null;
        DateTime? duedate = null;
        if (note.ReminderDate is not null)
        {
             reminderDate = DateTime.ParseExact(note?.ReminderDate, format, CultureInfo.InvariantCulture);
        }
        if (note.DueDate is not null)
        {
             duedate = DateTime.ParseExact(note?.DueDate, format, CultureInfo.InvariantCulture);
        }
        UserNotes[userId].Add(new NotesDB
        {
            content = note.content,
            DueDate = duedate,
            IsComplete = note.IsComplete,
            Url = note.Url,
            ReminderDate = reminderDate,
            Type = note.Type,
            
        });    
        return Ok("Note created.");
    }

    [HttpGet("user")]
    public IActionResult GetUserNotes()
    {
        var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString().Split(" ")[1]);
        if (UserNotes.ContainsKey(userId))
        {
            return Ok(UserNotes[userId]); 
        }
        else
        {
            return Ok(new List<Note>()); 
        }
    }



     [HttpGet("today")]
     public IActionResult GetTodayNotes()
     {

        var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString().Split(" ")[1]);
        string today = DateTime.Today.Date.ToString("yyyy-MM-dd");
        List<NotesDB> dbByType = UserNotes.Where(x => x.Key == userId).
            SelectMany(x => x.Value.Where(x => (x.Type == "Reminder" || x.Type == "Todo"))).ToList();
         List<NotesDB>? notes = dbByType.Where(x=> (x.DueDate != null && x.DueDate.Value.Date.ToString("yyyy-MM-dd") == today) ||
            (x.ReminderDate != null && x.ReminderDate.Value.Date.ToString("yyyy-MM-dd") == today)).ToList();
        
        return Ok(notes);
     }

    [HttpGet("week")]
    public IActionResult GetWeekNotes()
    {
        var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString().Split(" ")[1]);

        var today = DateTime.Today;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(7);
        List<NotesDB> dbByType = UserNotes.Where(x => x.Key == userId).
          SelectMany(x => x.Value.Where(x => (x.Type == "Reminder" || x.Type == "Todo"))).ToList();
        return Ok(dbByType.Where(n => (n.DueDate >= startOfWeek && n.DueDate < endOfWeek) ||
           (n.ReminderDate >= startOfWeek && n.ReminderDate < endOfWeek) ));
    }

    [HttpGet("month")]
    public IActionResult GetMonthNotes()
    {
        var userId = JwtHelper.GetUserIdFromToken(Request.Headers["Authorization"].ToString().Split(" ")[1]);

        var today = DateTime.Today;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
        List<NotesDB> dbByType = UserNotes.Where(x => x.Key == userId).
        SelectMany(x => x.Value.Where(x => (x.Type == "Reminder" || x.Type == "Todo"))).ToList();
        return Ok(dbByType.Where(n => (n.DueDate >= startOfMonth && n.DueDate <= endOfMonth) ||
         (n.ReminderDate >= startOfMonth && n.ReminderDate <= endOfMonth)));
    }
}
