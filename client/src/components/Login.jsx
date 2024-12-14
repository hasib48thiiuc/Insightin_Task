import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useAuth } from "../context/Auth";

function LogIn(props) {
  const [formData, setFormData] = useState({});
  const model = {
    Email : formData.email,
    Password: formData.password
  };
  
  const [error, setError] = useState(null);
  const navigate = useNavigate("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  //const apiUrl = process.env.REACT_APP_BACKEND_URL ;

  // hendleChane part----------------------------------------
  const hendleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // onsubmit part------------------------------------------
  const hendleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    console.log("clickeeddd");
    if (
      !formData.email ||
      !formData.password ||
      formData.email === "" ||
      formData.password === ""
    ) {
      setError("All field required");
      console.log(error);
      setLoading(false);
    }
    try {
      const res = await fetch("http://localhost:5007/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(model),
      });

      const data = await res.json();
      if (data.success === "false") {
        setLoading(false);
        window.alert(data.maessage);
      }
      if (res.ok) {
        setLoading(false);
        console.log("see login data",data.token);

        login(data);
        navigate("/home");

     //   const loaddata = JSON.stringify(data);
        navigate("/home");
      }
    } catch (err) {
      setLoading(false);
      window.alert(err);
    }
  };

  return (
    <div className="mt-10  min-h-screen md:mx-auto sm:px-7  flex justify-center flex-col md:flex-row   max-w-3xl ">
      <div className=" w-2/3 mx-auto border-2 h-72 p-10 rounded-lg bg-zinc-700 text-white  ">
        <form onSubmit={hendleSubmit}>
          <Label className="mt-10" value="Your Email" />
          <TextInput
            className="text-black"
            type="email"
            placeholder="your@gmail.com"
            id="email"
            onBlur={hendleChange}
          />
          <Label className="mt-10 pt-10" value="Your Password" />
          <TextInput
            className="text-black"
            type="password"
            placeholder="Password"
            id="password"
            onBlur={hendleChange}
          />
          <Button
            type="submit"
            className="mt-5 text-black mb-5 w-full bg-gradient-to-r from-lime-400 to-green-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="text-sm m-4" /> <span>loading.....</span>
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        <p className="text-sm mt-2">
          don't have an account?
          <Link to="/signUp">
            <span className="text-cyan-500 font-semibold">Sign Up</span>
          </Link>
        </p>
        {error && (
          <Alert className="mt-5" color="failure">
            {error}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default LogIn;
