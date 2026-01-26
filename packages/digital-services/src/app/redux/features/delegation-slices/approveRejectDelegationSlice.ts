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

export const approveRejectDelegation = createAsyncThunk<ResponseModel, any>(
  "approveRejectDelegation",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume.approveRejectDelegation(data.id, data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

const approveRejectDelegationSlice = createSlice({
  name: "approveRejectDelegation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(approveRejectDelegation.pending, (state: initialStateType) => {
        state.status = "loading";
      })
      .addCase(
        approveRejectDelegation.fulfilled,
        (state: initialStateType, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.message = action.payload?.message;
        }
      )
      .addCase(
        approveRejectDelegation.rejected,
        (state: initialStateType, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default approveRejectDelegationSlice.reducer;
