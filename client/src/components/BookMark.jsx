import { useState } from "react";
import { useNavigate } from "react-router-dom";
function BookmarkNote() {
  const [content, setContent] = useState("");

  const navigate = useNavigate();  // For navigation to the dashboard


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length > 100) {
      alert("URL exceeds the maximum length of 100 characters!");
      return;
    }

    const token = JSON.parse(localStorage.getItem("user"))?.token; // Get the user's token from local storage
    console.log("checking token form create ntote",JSON.parse(localStorage.getItem("user"))?.token);
    const payload = {
      content,
      Type: "Bookmark",
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
        alert("Bookmark created successfully!");
        setContent("");
        navigate('/home');
      } else {
        alert("Error creating bookmark.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="mt-10 flex justify-center">
      <div className="w-2/3 mx-auto border-2 p-10 rounded-lg bg-zinc-700 text-white">
        <form onSubmit={handleSubmit}>
          <label className="block mt-5">Bookmark URL</label>
          <input
            type="url"
            className="block w-full p-2 mt-2 text-black rounded-md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter URL"
            required
          />
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

export default BookmarkNote;
