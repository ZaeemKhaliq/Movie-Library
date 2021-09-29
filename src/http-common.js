import axios from "axios";
import getToken from "./helpers/getToken";

export default axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken(),
  },
});
