import axios from "axios";

export const myAxios = axios.create({
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});
