import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const [allNotes, setAllNotes] = useState([]);
  const [todayNotes, setTodayNotes] = useState([]);
  const [weekNotes, setWeekNotes] = useState([]);
  const [monthNotes, setMonthNotes] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // To toggle dropdown visibility

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigate = (noteType) => {
    setIsDropdownOpen(false); // Close dropdown after selection
    navigate(`/${noteType}`); // Navigate based on selected note type
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const token1 = JSON.parse(localStorage.getItem("user"))?.token; // Get the user's token from local storage
      console.log("checking token form dashboard",JSON.parse(localStorage.getItem("user"))?.token);
      

      try {
        // Fetching all notes
        const resAll = await fetch("http://localhost:5007/api/notes/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token1}`,
          },
        });
        const dataAll = await resAll.json();
        console.log("data of all notes",dataAll);
        setAllNotes(dataAll);

        // Fetching today's notes
        const resToday = await fetch("http://localhost:5007/api/notes/today", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token1}`,
          },
        });
        const dataToday = await resToday.json();
        setTodayNotes(dataToday);

        // Fetching this week's notes
        const resWeek = await fetch("http://localhost:5007/api/notes/week", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token1}`,
          },
        });
        const dataWeek = await resWeek.json();
        setWeekNotes(dataWeek);

        // Fetching this month's notes
        const resMonth = await fetch("http://localhost:5007/api/notes/month", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token1}`,
          },
        });
        const dataMonth = await resMonth.json();
        setMonthNotes(dataMonth);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    fetchNotes();
  }, [token]);

  const handleLogout = async () => {
    const token1 = JSON.parse(localStorage.getItem("user"))?.token; // Get the token from localStorage
  
    try {
      // Call the API to log the user out
      const res = await fetch("http://localhost:5007/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token1}`, // Attach token for secure access
        },
      });
  
      if (res.ok) {
        logout();
        navigate("/"); // Navigate to login page after successful logout
      } else {
        console.error("Failed to logout");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };
  
  return (
    <div>
      <nav className="p-4 bg-blue-500 text-white flex justify-between">
        <h1 className="text-lg font-bold">My Notes</h1>
        <div className="relative">
          <button
            className="mr-4 bg-green-600 px-4 py-2 rounded"
            onClick={handleDropdownToggle}
          >
            Create Note
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white text-black border rounded mt-1">
              <ul>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigate("create-note")}
                >
                  Regular Note
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigate("reminder")}
                >
                  Reminder
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigate("todo")}
                >
                  To-Do
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleNavigate("BookMark")}
                >
                  Bookmark
                </li>
              </ul>
            </div>
          )}
          <button
            className="bg-red-600 px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
  {/* Column 1: All Notes */}
  <div className="col-span-1">
    <h2 className="text-xl font-semibold">All Notes</h2>
    <div>
      {allNotes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        allNotes.map((note, index) => (
          <div key={index} className="my-2 p-4 border rounded">
            {note.type === "Bookmark" ? (
              <a
                href={note.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {note.content}
              </a>
            ) : note.type === "Todo" ? (
              <div>
                <p>{note.content}</p>
                <div className="mt-2">
                  <span>Task Completed: </span>
                  <label className="mr-2">
                    <input
                      type="radio"
                      checked={note.isComplete === true}
                      onChange={() => handleCheckboxChange(note.id, "All Notes", true)}
                      className="mr-1"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={note.isComplete === false}
                      onChange={() => handleCheckboxChange(note.id, "All Notes", false)}
                      className="mr-1"
                    />
                    No
                  </label>
                </div>
              </div>
            ) : (
              <textarea
                value={note.content}
                rows={3}
                readOnly
                className="w-full p-2 border rounded resize-none"
                style={{ height: 'auto' }}
              />
            )}
          </div>
        ))
      )}
    </div>
  </div>

  {/* Column 2: Today's Notes */}
  <div className="col-span-1">
    <h2 className="text-xl font-semibold">Today's Task/Reminder</h2>
    <div>
      {todayNotes.length === 0 ? (
        <p>No notes available for today.</p>
      ) : (
        todayNotes.map((note, index) => (
          <div key={index} className="my-2 p-4 border rounded">
            {note.type === "Bookmark" ? (
              <a
                href={note.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {note.content}
              </a>
            ) : note.type === "Todo" ? (
              <div>
                <p>{note.content}</p>
                <div className="mt-2">
                  <span>Task Completed: </span>
                  <label className="mr-2">
                    <input
                      type="radio"
                      checked={note.isComplete === true}
                      onChange={() => handleCheckboxChange(note.id, "Today", true)}
                      className="mr-1"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={note.isComplete === false}
                      onChange={() => handleCheckboxChange(note.id, "Today", false)}
                      className="mr-1"
                    />
                    No
                  </label>
                </div>
              </div>
            ) : (
              <textarea
                value={note.content}
                rows={3}
                readOnly
                className="w-full p-2 border rounded resize-none"
                style={{ height: 'auto' }}
              />
            )}
            {note.ReminderDate && (
              <p>Reminder: {new Date(note.ReminderDate).toLocaleString()}</p>
            )}
          </div>
        ))
      )}
    </div>
  </div>

  {/* Column 3: This Week's Notes */}
  <div className="col-span-1">
    <h2 className="text-xl font-semibold">This Week's Tasks/Reminder</h2>
    <div>
      {weekNotes.length === 0 ? (
        <p>No notes available for this week.</p>
      ) : (
        weekNotes.map((note, index) => (
          <div key={index} className="my-2 p-4 border rounded">
            {note.type === "Bookmark" ? (
              <a
                href={note.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {note.content}
              </a>
            ) : note.type === "Todo" ? (
              <div>
                <p>{note.content}</p>
                <div className="mt-2">
                  <span>Task Completed: </span>
                  <label className="mr-2">
                    <input
                      type="radio"
                      checked={note.isComplete === true}
                      onChange={() => handleCheckboxChange(note.id, "This Week", true)}
                      className="mr-1"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={note.isComplete === false}
                      onChange={() => handleCheckboxChange(note.id, "This Week", false)}
                      className="mr-1"
                    />
                    No
                  </label>
                </div>
              </div>
            ) : (
              <textarea
                value={note.content}
                rows={3}
                readOnly
                className="w-full p-2 border rounded resize-none"
                style={{ height: 'auto' }}
              />
            )}
            {note.DueDate && (
              <p>Due: {new Date(note.DueDate).toLocaleString()}</p>
            )}
          </div>
        ))
      )}
    </div>
  </div>

  {/* Column 4: This Month's Notes */}
  <div className="col-span-1">
    <h2 className="text-xl font-semibold">This Month's Tasks/Reminder</h2>
    <div>
      {monthNotes.length === 0 ? (
        <p>No notes available for this month.</p>
      ) : (
        monthNotes.map((note, index) => (
          <div key={index} className="my-2 p-4 border rounded">
            {note.type === "Bookmark" ? (
              <a
                href={note.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {note.content}
              </a>
            ) : note.type === "Todo" ? (
              <div>
                <p>{note.content}</p>
                <div className="mt-2">
                  <span>Task Completed: </span>
                  <label className="mr-2">
                    <input
                      type="radio"
                      checked={note.isComplete === true}
                      onChange={() => handleCheckboxChange(note.id, "This Month", true)}
                      className="mr-1"
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={note.isComplete === false}
                      onChange={() => handleCheckboxChange(note.id, "This Month", false)}
                      className="mr-1"
                    />
                    No
                  </label>
                </div>
              </div>
            ) : (
              <textarea
                value={note.content}
                rows={3}
                readOnly
                className="w-full p-2 border rounded resize-none"
                style={{ height: 'auto' }}
              />
            )}
            {note.DueDate && (
              <p>Due: {new Date(note.DueDate).toLocaleString()}</p>
            )}
          </div>
        ))
      )}
    </div>
  </div>
</div>


    </div>
  );
}

export default Home;
