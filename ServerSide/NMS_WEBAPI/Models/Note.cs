using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;

namespace NotesWebAPI.Models
{
    public enum NoteType
    {
        Regular,
        Reminder,
        Todo,
        Bookmark
    }
    public class NotesDB
    {
        public int? Id { get; set; }

        public string? content { get; set; }

        public string? Type { get; set; }

        public DateTime? ReminderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public bool? IsComplete { get; set; }
        public string? Url { get; set; }
    }

    public class NoteNew : Note
    {
        //public string content { get; set; }
    }
    public class Note
    {
        public int? Id { get; set; }

        [JsonPropertyName("content")]
        public string? content { get; set; }

        [JsonPropertyName("Type")]
        public string? Type { get; set; }

        [JsonPropertyName("ReminderDate")]
        public string? ReminderDate { get; set; }
        public string? DueDate { get; set; }
        public bool? IsComplete { get; set; }
        public string? Url { get; set; }
    }

}
