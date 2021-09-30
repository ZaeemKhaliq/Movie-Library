import axios from "axios";
import getToken from "./helpers/getToken";

export default axios.create({
  baseURL: "https://movie-library-mern.herokuapp.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken(),
  },
});
