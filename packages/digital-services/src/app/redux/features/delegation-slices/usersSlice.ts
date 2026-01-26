import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/response-model";
import { UsersModel } from "../../models/delegation/user_lookup-model";
import { UserManagmentConsume } from "@4eplatform/shared/apis/user_management";

export const fetchUser = createAsyncThunk<ResponseModel, any>(
  "delegations/fetchUsers",
  async (data: any, thunkApi) => {
    try {
       
      const response = await UserManagmentConsume.getAllUsers
        ( {
          pageSize: data?.pageSize,
          pageNumber: data?.pageNumber,
        });
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);

interface users {
  data: UsersModel[];
  status: string;
  totalPages: number;
  totalItems: number;
  message: string;
}

let initialState: users = {
  data: [],
  status: "idle",
  totalPages: 0,
  totalItems: 0,
  message: "",
};

const usersSlice = createSlice({
  name: "usersDDL",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state: users) => {
        state.status = "loading";
      })
      .addCase(
        fetchUser.fulfilled,
        (state: users, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload.result as unknown as UsersModel[];
          state.totalPages = action.payload.totalPages
          state.totalItems = action.payload.totalItems;
        }
      )
      .addCase(
        fetchUser.rejected,
        (state: users, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload;
        }
      );
  },
});

export default usersSlice.reducer;
