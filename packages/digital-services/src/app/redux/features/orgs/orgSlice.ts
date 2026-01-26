import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OrgConsume } from "@4eplatform/shared/apis/org";
import { ResponseModel } from "../../../models/response-model";
import { OrgModel } from "../../../models/orgModel";

export const fetchOrgs = createAsyncThunk<ResponseModel, object | undefined>(
  "orgs/fetchorgs",
  async (query = {}) => {
    const response = await OrgConsume.getAllOrgs(query);
    return response;
  }
);

interface OrgHierarchy {
  orgs: OrgModel[];
}
let initialState: OrgHierarchy = {
  orgs: [],
};

const orgSlice = createSlice({
  name: "OrgHierarchy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchOrgs.fulfilled,
      (state: OrgHierarchy, action: PayloadAction<ResponseModel>) => {
        state.orgs = action.payload.result as OrgModel[];
      }
    );
  },
});

export default orgSlice.reducer;
