import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ControlPanelAggConsume } from "@4eplatform/shared/apis/control_panel_agg";
import { ResponseModel } from "../../../models/response-model";
import { UserModel } from "../../../models/delegation/user-model";

export const fetchDelegationUser = createAsyncThunk<
  ResponseModel,
  number | string | Number
>("user/fetchUser", async (data: number | string | Number, thunkApi) => {
  try {
    const response = await ControlPanelAggConsume?.getUserbyId(data);
    return response;
  } catch (err: any) {
    return thunkApi.rejectWithValue(err);
  }
});
interface user {
  data: UserModel;
  status: string;
  message: string;
}
let initialState: user = {
  data: new UserModel(
    0,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    0,
    "",
    "",
    new Date(),
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ),
  status: "idle",
  message: "",
};

const delegationUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDelegationUser.pending, (state: user) => {
        state.status = "loading";
      })
      .addCase(
        fetchDelegationUser.fulfilled,
        (state: user, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload?.result as unknown as UserModel;
        }
      )
      .addCase(
        fetchDelegationUser.rejected,
        (state: user, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload?.message;
        }
      );
  },
});

export default delegationUserSlice.reducer;