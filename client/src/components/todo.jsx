import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TaskNote() {
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length > 100) {
      alert("Note exceeds the maximum length of 100 characters!");
      return;
    }

    const token = JSON.parse(localStorage.getItem("user"))?.token; // Get the user's token from local storage
    console.log("checking token form create ntote",JSON.parse(localStorage.getItem("user"))?.token);    const payload = {
      content,
      Type: "Todo",
      DueDate: dueDate,
      IsComplete: isComplete,
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
        alert("Task created successfully!");
        setContent("");
        setDueDate("");
        setIsComplete(false);
        navigate("/Home");
      } else {
        alert("Error creating task.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="mt-10 flex justify-center">
      <div className="w-2/3 mx-auto border-2 p-10 rounded-lg bg-zinc-700 text-white">
        <form onSubmit={handleSubmit}>
          <label className="block mt-5">Task Content</label>
          <textarea
            className="block w-full p-2 mt-2 text-black rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter task content"
            required
          />
          <label className="block mt-5">Due Date</label>
          <input
            type="datetime-local"
            className="block w-full p-2 mt-2 text-black rounded-md"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <div className="flex items-center mt-5">
            <input
              type="checkbox"
              id="isComplete"
              checked={isComplete}
              onChange={(e) => setIsComplete(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isComplete">Mark as Complete</label>
          </div>
          <div className="flex gap-4 mt-5">
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-lime-400 to-green-500 text-black rounded-md"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => navigate("/Home")}
              className="w-full py-2 bg-gradient-to-r from-red-400 to-pink-500 text-black rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskNote;
