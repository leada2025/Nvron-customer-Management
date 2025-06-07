import axios from 'axios';

const API = axios.create({
  baseURL: "https://nvron-customer-management-back.onrender.com",
  withCredentials: true, // if you're using cookies for auth
});

export default API;
