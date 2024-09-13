import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import setToken from "../../helpers/token";

const initialState = {
    user: {},
    token: localStorage.getItem("token") || null,
    isAuth: Boolean(localStorage.getItem("isAuth")),
    userType: null,
    errors: null,
    isLoading: false,
  };

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/user/login", info);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error occurred");
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      setToken();
      const res = await axios.get("http://localhost:5000/user/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error occurred");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/user/register", info);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.isLoading = false;
      state.token = null;
      state.isAuth = false;
      state.errors = null;
      state.user = {};
      state.userType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, { payload }) => {
        localStorage.setItem("token", payload.token || "");
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("user", JSON.stringify(payload.user || {}));

        state.isLoading = false;
        state.token = payload.token || null;
        state.isAuth = true;
        state.user = payload.user || {};
        state.userType = payload.user?.userType || null;
        state.errors = null;
      })
      .addCase(getMe.fulfilled, (state, { payload }) => {
        localStorage.setItem("user", JSON.stringify(payload || {}));
        state.isLoading = false;
        state.user = payload || {};
        state.userType = payload?.userType || null;
        state.errors = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        localStorage.setItem("token", payload.token || "");
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("user", JSON.stringify(payload.user || {}));

        state.isLoading = false;
        state.token = payload.token || null;
        state.isAuth = true;
        state.user = payload.user || {};
        state.userType = payload.user?.userType || null;
        state.errors = null;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.errors = payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const AuthReducer = authSlice.reducer;
