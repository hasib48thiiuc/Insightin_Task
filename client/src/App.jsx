import { Route,  Routes } from "react-router-dom";
// import AddEntry from "./components/AddEntry";
// import Header from "./components/Header";
// import Listing from "./components/Listing";
import { EntriesProvider } from "./context/EntriesContext";
import Login from "./components/Login";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/Auth";
import CreateNote from "./components/create-note";
import ReminderNote from "./components/reminder";
import ToDo from "./components/todo";
import BookmarkNote from "./components/BookMark";
function App() {
  return (
    <AuthProvider>
      <EntriesProvider>
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/signUp" element={<SignUp></SignUp>}></Route>
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home></Home>}></Route>
            <Route path="/create-note" element={<CreateNote />} />
            <Route path="/reminder" element={<ReminderNote />}></Route>
            <Route path="/todo" element={<ToDo />}></Route>
            <Route path="/bookmark" element={<BookmarkNote />}></Route>

          </Route>
        </Routes>
      </EntriesProvider>
    </AuthProvider>
  );
}

export default App;
