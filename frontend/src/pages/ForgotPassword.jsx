import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("localhost:5000/api/users/forgot-password", { email });
            setMessage(res.data.message);
            setTimeout(() => navigate("/"));
        } catch (err) {
            setMessage(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-2">Forgot Password</h2>
                
                <p className="text-sm text-gray-500 mb-2 text-center">
                    enter your email to receive a password reset link.
                </p>

                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                className="w-full p-1 mb-2 border rounded-lg focus:outline-none focus:ring-blue-300"
                required
                />

                <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-600">{message}</p>

                )}
            </form>
        </div>
    )
}

export default ForgotPassword;