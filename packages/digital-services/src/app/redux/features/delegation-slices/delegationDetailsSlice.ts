import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Delegation, delegationModel } from "../../models/delegation/delegation-model";
import { ResponseModel } from "../../models/response-model";
import { delegationRolePermissionModel } from "../../models/delegation/delegation-role-permission-model";
import { UserManagmentConsume } from "@4eplatform/shared/apis/user_management";

export const fetchDelegationDetails = createAsyncThunk<ResponseModel, any>(
  "delegation/fetchDelegationDetails",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume.getDelegationDetailsById(data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
interface delegationDetails {
  data: Delegation;
  status: string;
  message: string;
}
let initialState: delegationDetails = {
  data: new Delegation(
    "",
    new Date(),
    new Date(),
    true,
    null,
    null,
    true,
    null,
    false,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    null,
    null,
    "",
    "",
    "",
    null,
    null,
    "",
    "",
    0,
    0
  ),
  status: "idle",
  message: "",
};

const delegationDetailsSlice = createSlice({
  name: "fetchDelegationDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDelegationDetails.pending, (state: delegationDetails) => {
        state.status = "loading";
      })
      .addCase(
        fetchDelegationDetails.fulfilled,
        (state: delegationDetails, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload?.result as unknown as Delegation;
        }
      )
      .addCase(
        fetchDelegationDetails.rejected,
        (state: delegationDetails, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default delegationDetailsSlice.reducer;
