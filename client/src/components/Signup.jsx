import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

function SignUp() {
  const [formData, setFormData] = useState({});
  const model = {
    Name: formData.username,
    Email: formData.email,
    Password: formData.password,
    DateOfBirth: formData.DateOfBirth,  // Add DateOfBirth field
  };
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password || !formData.username || !formData.DateOfBirth) {
      window.alert("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5007/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(model),
      });

      if (res.ok) {
        setLoading(false);
        navigate("/");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="mt-10 min-h-screen flex justify-center flex-col items-center max-w-3xl mx-auto">
      <div className="w-2/3 border-2 py-10 px-5 rounded-lg bg-gray-700 text-white">
        <form onSubmit={handleSubmit}>
          <Label className="mt-5" value="Your Email" />
          <TextInput
            className="text-black"
            type="email"
            placeholder="your@gmail.com"
            id="email"
            onBlur={handleChange}
          />
          <Label className="mt-5" value="Your Username" />
          <TextInput
            className="text-black"
            type="text"
            placeholder="username"
            id="username"
            onBlur={handleChange}
          />
          <Label className="mt-5" value="Your Password" />
          <TextInput
            className="text-black"
            type="password"
            placeholder="Password"
            id="password"
            onBlur={handleChange}
          />
          <Label className="mt-5" value="Date of Birth" />
          <TextInput
            className="text-black"
            type="date"
            id="DateOfBirth"
            onBlur={handleChange}
          />
          <Button
            type="submit"
            className="mt-5 w-full bg-gradient-to-r from-lime-400 to-green-500"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign Up"}
          </Button>
        </form>
        <p className="text-sm mt-2">
          Already have an account?
          <Link to="/">
            <span className="text-cyan-500 font-semibold"> Sign In</span>
          </Link>
        </p>
        {error && <Alert className="mt-5" color="failure">{error}</Alert>}
      </div>
    </div>
  );
}

export default SignUp;
