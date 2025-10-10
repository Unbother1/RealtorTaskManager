import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch all tasks for the logged-in user

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch tasks. Please log in again.");
    }
  };

  // Mark task as done

  const markDone = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}/done`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => (t._id === id ? { ...t, status: "done" } : t)));
    } catch (err) {
      console.error(err);
      setMessage("Could not update task.");
    }
  };

  // Logout

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "40px" }}>
      <h2>📅 Realtor Task Manager</h2>
      <button onClick={handleLogout}>Logout</button>
      <p style={{ color: "red" }}>{message}</p>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Title</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.status}</td>
                <td>
                  {task.status !== "done" ? (
                    <button onClick={() => markDone(task._id)}>Mark Done</button>
                  ) : (
                    "✅"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
