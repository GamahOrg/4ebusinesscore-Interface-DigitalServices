import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { delegationModel } from "../../models/delegation/delegation-model";
import { ResponseModel } from "../../models/response-model";
import { UserManagmentConsume } from "@4eplatform/shared/apis/user_management";

export const fetchRequestsDelegations = createAsyncThunk<ResponseModel, any>(
  "delegations/getRequestDelegations",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume.getUserRequestsDelegation(
        {
          pageSize: data?.pageSize,
          pageNumber: data?.pageNumber,
        }
      );
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);

interface delegations {
  data: delegationModel[];
  status: string;
  totalPages: number;
  message: string;
}

let initialState: delegations = {
  data: [],
  status: "idle",
  totalPages: 0,
  message: "",
};

const requestDelegationsSlice = createSlice({
  name: "getRequestDelegations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsDelegations.pending, (state: delegations) => {
        state.status = "loading";
      })
      .addCase(
        fetchRequestsDelegations.fulfilled,
        (state: delegations, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload.result as unknown as delegationModel[];
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(
        fetchRequestsDelegations.rejected,
        (state: delegations, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload;
        }
      );
  },
});

export default requestDelegationsSlice.reducer;
