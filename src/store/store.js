import { configureStore } from "@reduxjs/toolkit";
import movies from "./reducers/movies";
import auth from "./reducers/auth";

const store = configureStore({
  reducer: {
    movies,
    auth,
  },
});

export default store;
