import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import MovieService from "../../services/movie-service";

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async (arg, thunkAPI) => {
    try {
      const fetchMovies = await MovieService.getAllMovies();
      const movies = fetchMovies.data;
      return movies;
    } catch (err) {
      console.log(err.response);
      if (err.response) {
        const errorMessage = err.response.data.message;
        throw new Error(errorMessage);
      } else {
        throw new Error("Server is down!");
      }
    }
  }
);

const movies = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    isFetching: false,
    errorMessage: "",
  },
  reducers: {
    setMovies(state, action) {
      return (state = action.payload);
    },
  },
  extraReducers: {
    [getMovies.pending]: (state, action) => {
      console.log("I am pending! (Movies)");
      state.isFetching = true;
    },
    [getMovies.fulfilled]: (state, action) => {
      console.log("I am fulfilled! (Movies)");
      state.movies = action.payload;
      state.isFetching = false;
    },
    [getMovies.rejected]: (state, action) => {
      console.log("I am rejected! (Movies)", action);
      state.errorMessage = action.error.message;
      state.isFetching = false;
    },
  },
});

export const { setMovies } = movies.actions;
export default movies.reducer;
