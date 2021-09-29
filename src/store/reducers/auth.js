import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../services/auth-service";

// export const login = createAsyncThunk("auth/login", async (arg, thunkAPI) => {
//   const response = await AuthService.login(arg);
//   console.log(response);
//   const data = response.data;

//   return data;
// });

const auth = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  //   extraReducers: {
  //     [login.pending]: (state, action) => {
  //       state.isLogging = true;
  //     },
  //     [login.fulfilled]: (state, action) => {
  //       state.user = action.payload.user;
  //       state.token = action.payload.token;
  //       state.isLogging = false;
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify({
  //           user: action.payload.user,
  //           token: action.payload.token,
  //         })
  //       );
  //     },
  //     [login.rejected]: (state, action) => {
  //       state.isError = action.error.message;
  //     },
  //   },
});

export const { setUser } = auth.actions;
export default auth.reducer;
