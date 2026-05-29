import axios from "axios";

const API = "http://localhost:5000/api/employees";

// GET
export const getEmployees = () => axios.get(API);

// CREATE
export const addEmployee = (data) => axios.post(API, data);

// DELETE
export const deleteEmployee = (id) =>
  axios.delete(`${API}/${id}`);

// UPDATE
export const updateEmployee = (id, data) =>
  axios.put(`${API}/${id}`, data);