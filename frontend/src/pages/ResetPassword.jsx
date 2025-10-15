import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) return setMessage("Passwords do not match");

        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/users/reset-password${token}`, { password });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.error || "Error resetting password")
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <form onSubmit={handleSubmit} className='bg-white p-4 rounded-2xl shadow-lg w-96'>
            <h2 className='text-2xl font-semibold text-center mb-2'>Reset Password</h2>
            <div className='relative mb-2'>
                <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                placeholder='New password' 
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-2 mb-2 border rounded-lg focus:ring focus:ring-blue-300' 
                required
                />

                <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-2 top-2 text-gray-500'>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            
            <div className='relative mb-2'>
                <input 
                type={showPassword ? "text" : "password"} 
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder='Confirm password'
                className='w-full p-2 mb-2 border rounded-lg focus:ring focus:ring-blue-300'
                required
                />

                <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-2 top-2 text-gray-500'
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

            </div>

            <button 
            type='submit' 
            disabled={loading} 
            className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>

            {message && (
                <p className='mt-2 text-center text-sm text-gray-600'>{message}</p>
            )}
        </form>
    </div>
  )
}

export default ResetPassword;