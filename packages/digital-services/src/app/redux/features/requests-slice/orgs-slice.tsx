import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/response-model";
import { Org } from "../../models/requests/orgs";
import { ControlPanelAggConsume } from "@4eplatform/shared/apis/control_panel_agg";


export const fetchOrgs = createAsyncThunk<ResponseModel, any>(
  "Orgs/fetchOrgs",
  async (data: any, thunkApi) => {
    try {
      const response = await ControlPanelAggConsume.getOrg({});
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);


interface orgs {
  data: Org[];
  status: string;
  message: string;
}

let initialState: orgs = {
  data: [],
  status: "idle",
  message: "",
};

const orgsSlice = createSlice({
  name: "orgs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgs.pending, (state: orgs ) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrgs.fulfilled,
        (state: orgs , action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload.result as unknown as Org[];
        }
      )
      .addCase(
        fetchOrgs.rejected,
        (state: orgs , action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload;
        }
      );
  },
});

export default orgsSlice.reducer;
