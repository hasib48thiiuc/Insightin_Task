import  { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateNote() {
  const [noteNew, setNoteNew] = useState(""); // State for the content of the note
  const navigate = useNavigate();  // For navigation to the dashboard
  const token = JSON.parse(localStorage.getItem("user"))?.token; // Get the user's token from local storage
  console.log("checking token form create ntote",JSON.parse(localStorage.getItem("user"))?.token);
  
//const note = JSON.stringify({ content: noteNew });
  // Handle note creation
  const payload = {
    content: noteNew, // Ensure it matches the backend's 'content' field
    Type: "Regular" // Matches the 'Type' field in the backend
// Matches the 'ReminderDate' field in the backend
  };
  const handleCreateNote = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (noteNew.trim() === "") {
      alert("Note cannot be empty.");
      return;
    }
  
    try {
      // Send the note to the backend for saving
      const res = await fetch("http://localhost:5007/api/notes/create", {
        method: "POST", // POST request to create a new note
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`, // Attach token for secure access
        },
        body: JSON.stringify(payload), // Send the note content as expected by the backend
      });
  
      if (res.ok) {
        alert("Note created successfully!");
        navigate("/Home"); // Redirect to the dashboard after creating the note
      } else {
        alert("Failed to create note.");
      }
    } catch (err) {
      console.error("Error creating note:", err); // Log any errors that occur during note creation
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Create a New Note</h1>
      <form onSubmit={handleCreateNote} className="space-y-4">
        {/* Textarea for user to enter the note content */}
        <textarea
          className="w-full p-2 border rounded"
          rows="5"
          maxLength="100"
          placeholder="Write your note here (max 100 characters)..."
          value={noteNew}
          onChange={(e) => setNoteNew(e.target.value)}  // Update the state as the user types
        />
        <div>
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
        </div>
      </form>
    </div>
  );
}

export default CreateNote;
