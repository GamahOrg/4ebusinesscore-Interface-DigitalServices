import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RequestStatus } from "@4eplatform/shared/enums/enums";
import { ResponseModel } from "@4eplatform/shared/models/responseModel";
import { TrainingAggConsume } from "@4eplatform/shared/apis/training_agg";

interface RoleAssignState {
  roleAssign:string;
  status: RequestStatus;
  error: string | null;
}

const initialState: RoleAssignState = {
  roleAssign:"",
  status: RequestStatus.idle,
  error: "",
};

export const fetchRoleAssign = createAsyncThunk<ResponseModel, any>(
  "RoleAssign/fetchRoleAssign",
  async (params, thunkApi) => {
    try {
      const response = await TrainingAggConsume?.getRoleAssign();
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);


const RoleAssignSlice = createSlice({
  name: "RoleAssign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoleAssign.fulfilled, (state, action) => {
        state.status = RequestStatus.succeeded;
        state.roleAssign = (action as PayloadAction<ResponseModel>)
          .payload.result  as any  ;
      })
      .addCase(fetchRoleAssign.pending, handlePending)
      .addCase(fetchRoleAssign.rejected, handleRejected)

  },
});

const handlePending = (state: RoleAssignState) => {
  state.status = RequestStatus.loading;
};

const handleRejected = (state: RoleAssignState, action: any) => {
  state.status = RequestStatus.failed;
  state.error = action.error.message ?? "An error occurred";
};
const handleFulfilled = (state: RoleAssignState) => {
  state.status = RequestStatus.succeeded;
};

export default RoleAssignSlice.reducer;
