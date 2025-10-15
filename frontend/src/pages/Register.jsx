import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-200">
      <form className="bg-orange-100 p-8 rounded-xl shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input 
        className="w-full p-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="text" name="username" 
        placeholder="Username" 
        onChange={handleChange} 
        required 
        /><br /><br />

        <input 
        className="w-full p-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="email" 
        name="email" 
        placeholder="Email" 
        onChange={handleChange} 
        required 
        /><br /><br />
        
        <div className="relative mb-2">
          <input 
          className="w-full p-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type={showPassword ? "text" : "password"} 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          required 
          />
          <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>

        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" type="submit" >Register</button>
        <p>{message}</p>
        <p className="text-center">Already have an account? <Link to="/" className="text-blue-500 hover:text-blue-700">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
