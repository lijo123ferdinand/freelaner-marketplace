// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api';

export const getUsers = () => axios.get(`${API_BASE_URL}/users`);
export const createUser = (user) => axios.post(`${API_BASE_URL}/users`, user);
export const getProjects = () => axios.get(`${API_BASE_URL}/projects`);
export const createProject = (project) => axios.post(`${API_BASE_URL}/projects`, project);
