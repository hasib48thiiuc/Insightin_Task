import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ReminderNote() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = JSON.parse(localStorage.getItem("user"))?.token; // Get the user's token from local storage
    console.log("checking token form create ntote",JSON.parse(localStorage.getItem("user"))?.token);    const payload = {
      content: content,
      Type: "Reminder",
      ReminderDate: reminderDate,
    };

    try {
      const res = await fetch("http://localhost:5007/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Reminder created!");
        navigate("/home");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Error creating reminder");
      }
    } catch (err) {
      setError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen md:mx-auto sm:px-7 flex justify-center flex-col md:flex-row max-w-3xl">
      <div className="w-2/3 mx-auto border-2 h-auto p-10 rounded-lg bg-zinc-700 text-white">
        <form onSubmit={handleSubmit}>
          <label className="block mt-5 text-sm font-medium">Reminder Content</label>
          <textarea
            className="block w-full p-2 mt-2 text-black rounded-md"
            placeholder="Enter your reminder content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <label className="block mt-5 text-sm font-medium">Reminder Date</label>
          <input
            type="datetime-local"
            className="block w-full p-2 mt-2 text-black rounded-md"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            required
          />

          <button
            type="submit"
            className="mt-5 w-full py-2 text-black bg-gradient-to-r from-lime-400 to-green-500 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="text-sm">Loading...</span>
              </>
            ) : (
              "Create Reminder"
            )}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
            onClick={() => navigate("/home")}
          >
            Cancel
          </button>
        </form>

        {error && (
          <div className="mt-5 p-3 bg-red-500 text-white rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReminderNote;
