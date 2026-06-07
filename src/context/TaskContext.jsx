import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

const API_URL = 'https://task-management-app-35ny.onrender.com/api/tasks';

export const useTasks = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Helper to get auth headers
  const getConfig = useCallback(() => {
    const token = localStorage.getItem('taskman_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(API_URL, getConfig());
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user, getConfig]);

  // Fetch tasks when user changes (login/logout)
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      const res = await axios.post(API_URL, taskData, getConfig());
      setTasks((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedData, getConfig());
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
      return res.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getConfig());
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskStatus = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        { status: newStatus },
        getConfig()
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  };

  const value = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    fetchTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
