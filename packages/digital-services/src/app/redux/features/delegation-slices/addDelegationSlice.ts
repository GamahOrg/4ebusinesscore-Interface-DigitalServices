import { ResponseModel } from "./../../models/response-model";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserManagmentConsume } from "@4eplatform/shared/apis/user_management";

interface initialStateType {
  status: string;
  message: string;
}
const initialState: initialStateType = {
  status: "idle",
  message: "",
};

export const addDelegation = createAsyncThunk<ResponseModel, any>(
  "addDelegation",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume.addUserDelegation(data);
       
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

const addDelegationSlice = createSlice({
  name: "addDelegation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addDelegation.pending, (state: initialStateType) => {
        state.status = "loading";
      })
      .addCase(
        addDelegation.fulfilled,
        (state: initialStateType, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.message = action.payload?.message;
        }
      )
      .addCase(
        addDelegation.rejected,
        (state: initialStateType, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default addDelegationSlice.reducer;
