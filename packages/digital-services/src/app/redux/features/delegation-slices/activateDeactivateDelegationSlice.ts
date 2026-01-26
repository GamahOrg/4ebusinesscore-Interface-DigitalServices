import { ResponseModel } from "../../models/response-model";
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

export const activateDeactivateDelegation = createAsyncThunk<ResponseModel, any>(
  "activateDeactivateDelegation",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume.activateDeactivateDelegation(data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

const activateDeactivateDelegationSlice = createSlice({
  name: "activateDeactivateDelegation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(activateDeactivateDelegation.pending, (state: initialStateType) => {
        state.status = "loading";
      })
      .addCase(
        activateDeactivateDelegation.fulfilled,
        (state: initialStateType, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.message = action.payload?.message;
        }
      )
      .addCase(
        activateDeactivateDelegation.rejected,
        (state: initialStateType, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default activateDeactivateDelegationSlice.reducer;
