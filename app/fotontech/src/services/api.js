import axios from "axios";

const api = axios.create({
  baseURL: "https://fotontech-challenge-backend.herokuapp.com/"
});

export default api;
