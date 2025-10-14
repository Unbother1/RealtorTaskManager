import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-200 ">
      
      <form className="bg-orange-100 p-8 rounded-xl shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input 
        className="w-full p-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="email" 
        name="email" 
        placeholder="Email" 
        onChange={handleChange} 
        value={form.email}
        required /><br /><br />
        
        <div className="relative mb-2">
          <input 
          className="w-full p-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type={showPassword ? "text" : "password"} 
          name="password"
          value={form.password} 
          placeholder="Password" 
          onChange={handleChange} 
          required 
          />
          <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500"
          >
            { showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/*Forgot Password link */}
        <div className="text-right mb2">
          <Link to="//forgot-password" className="text-blue-500 hover:text-blue-700 text-sm" >Forgot Pasword?</Link>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">Login</button>
        <p>{message}</p>
        <p className="text-center">Don’t have an account? <Link to="/register"><a href="#" className="text-blue-500 hover:text-blue-700">Register</a> </Link></p>
      </form>


      
    </div>
  );
};

export default Login;
