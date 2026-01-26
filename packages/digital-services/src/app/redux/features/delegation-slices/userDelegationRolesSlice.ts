import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/response-model";
import { UserManagmentConsume } from "@4eplatform/shared/apis/user_management";
import { userDelegationRolesModel } from "../../models/delegation/user-delegation-roles";
import { ControlPanelAggConsume } from "@4eplatform/shared/apis/control_panel_agg";

export const fetchUserDelegationRoles = createAsyncThunk<ResponseModel, any>(
  "delegations/fetchUserDelegationRoles",
  async (data: any, thunkApi) => {
    try {
      const response = await UserManagmentConsume.getAllUserDelegationRoles
        (
         {
            userId:data.id,
          pageSize: data?.pageSize,
          pageNumber: data?.pageNumber,
        });

      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);
export const getWorkspaceTree = createAsyncThunk<any, any>(
  "Delegation/getWorkspaceTree",
  async (data: any, thunkApi) => {
    try {
      const response = await ControlPanelAggConsume.GetWorkspaceTreePermisionRoleId(data);
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

interface userDelegationRoles {
  data: userDelegationRolesModel[];
  workspaceTree:any;
  status: string;
  totalPages: number;
  message: string;
}

let initialState: userDelegationRoles = {
  data: [],
  workspaceTree:[],
  status: "idle",
  totalPages: 0,
  message: "",

};

const userDelegationRolesSlice = createSlice({
  name: "userDelegationRoles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDelegationRoles.pending, (state: userDelegationRoles) => {
        state.status = "loading";
      })
      .addCase(
        fetchUserDelegationRoles.fulfilled,
        (state: userDelegationRoles, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.data = action.payload.result as unknown as userDelegationRolesModel[];
          state.totalPages = action.payload.totalPages
        }
      )
      .addCase(
        fetchUserDelegationRoles.rejected,
        (state: userDelegationRoles, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload;
        }
      ).addCase(getWorkspaceTree.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getWorkspaceTree.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.workspaceTree = action.payload.result ;
        }
      )
      .addCase(
        getWorkspaceTree.rejected,
        (state, action: PayloadAction<any>) => {
          state.status = "failed";
          state.message = action.payload;
        }
      )
  },
});

export default userDelegationRolesSlice.reducer;
