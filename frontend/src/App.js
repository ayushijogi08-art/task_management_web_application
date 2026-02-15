import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://task-management-web-application-cqg6.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingStatus, setEditingStatus] = useState("pending");

  const fetchTasks = async () => {
    const res = await axios.get(API_URL+ "/api/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post(API_URL+ "/api/tasks", { title, description });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
    setEditingStatus(task.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingTitle.trim()) return;
    await axios.put(`${API_URL}/${editingId}`, {
      title: editingTitle,
      description: editingDescription,
      status: editingStatus,
    });
    setEditingId(null);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
        background: "#f4f4f4",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Task Manager
        </h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            style={{ flex: 1, padding: "6px" }}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            style={{ flex: 1, padding: "6px" }}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                padding: "8px",
                border: "1px solid #eee",
                borderRadius: "4px",
              }}
            >
              {task._id === editingId ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={{ flex: 1, marginRight: "10px" }}
                  />
                  <input
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                    placeholder="Description"
                    style={{ flex: 1, marginRight: "10px" }}
                  />
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    style={{ marginRight: "10px" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={saveEdit} style={{ marginRight: "5px" }}>
                    Save
                  </button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        textDecoration:
                          task.status === "completed" ? "line-through" : "none",
                        color: task.status === "completed" ? "#888" : "#000",
                      }}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <small style={{ display: "block", color: "#666" }}>
                        {task.description}
                      </small>
                    )}
                  </div>
                  <span style={{ marginRight: "10px", color: "#666" }}>
                    {task.status}
                  </span>
                  <button
                    onClick={() => startEdit(task)}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task._id)}>X</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;