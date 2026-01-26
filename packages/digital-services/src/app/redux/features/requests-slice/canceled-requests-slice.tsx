import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ResponseModel } from "../../models/response-model";
import { IncomingRequests } from "../../models/requests/incoming-requests";
import { DynamicWorkflowAggConsume } from "@4eplatform/shared/apis/dynamic_workflow_agg";

export const fetchCanceledFilterRequests = createAsyncThunk<ResponseModel, any>(
  "canceledRequests/fetchCanceledFilterRequests",
  async (data: any, thunkApi) => {
    var bodyFormData = new FormData();
    if (Object.keys(data?.body)?.length > 0) {
      if (data?.body?.orgIds[0] != null) {
        for (let index = 0; index < data?.body?.orgIds?.length; index++) {
          bodyFormData.append("orgIds", data?.body?.orgIds[index]);
        }
      }
      
      if (data?.body?.mainClassificationsIds) {
        bodyFormData.append("mainClassificationsIds", data?.body?.mainClassificationsIds);
      }
      if (data?.body?.serviceCatalogsIds) {
        bodyFormData.append("serviceCatalogsIds", data?.body?.serviceCatalogsIds);
      }
      if (data?.body?.serviceManagementCategoryIds) {
        bodyFormData.append("serviceManagementCategoryIds", data?.body?.serviceManagementCategoryIds);
      }
      if (data?.body?.itemIds) {
        bodyFormData.append("itemIds", data?.body?.itemIds);
      }
      
      if (data?.body?.requester[0] != null) {
        for (let index = 0; index < data?.body?.requester?.length; index++) {
          bodyFormData.append("requester", data?.body?.requester[index]);
        }
      }
      if (data?.body?.requestInstanceName[0] != null) {
        for (
          let index = 0;
          index < data?.body?.requestInstanceName?.length;
          index++
        ) {
          bodyFormData.append(
            "requestInstanceName",
            data?.body?.requestInstanceName[index]
          );
        }
      }
      if (data?.body?.categoryIds[0] != null) {
        for (let index = 0; index < data?.body?.categoryIds?.length; index++) {
          bodyFormData.append("categoryIds", data?.body?.categoryIds[index]);
        }
      }
      if (data?.body?.requestInstanceNumber[0] != null) {
        for (
          let index = 0;
          index < data?.body?.requestInstanceNumber?.length;
          index++
        ) {
          bodyFormData.append(
            "requestInstanceNumber",
            data?.body?.requestInstanceNumber[index]
          );
        }
      }
      if (data?.body?.statues[0] != null) {
        for (let index = 0; index < data?.body?.statues?.length; index++) {
          bodyFormData.append("statues", data?.body?.statues[index]);
        }
      }
      if (data?.body?.dateTimes[0] != null) {
        for (let index = 0; index < data?.body?.dateTimes?.length; index++) {
          bodyFormData.append(
            "dateTimes",
            data?.body?.dateTimes[index].split("T")[0]
          );
        }
      }
      if (data?.body?.delegatedUsers[0] != null) {
        for (
          let index = 0;
          index < data?.body?.delegatedUsers?.length;
          index++
        ) {
          bodyFormData.append(
            "delegatedUsers",
            data?.body?.delegatedUsers[index]
          );
        }
      }
    }
    try {
      const response =
        await DynamicWorkflowAggConsume.getCanceledFilterAssignRequests({
          params: data.params,
          body: bodyFormData,
        });
      return response;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.message);
    }
  }
);

interface canceledRequests {
  canceledRequests: IncomingRequests[];
  status: string;
  totalPages: number;
  totalItems: number;
  message: string;
}

let initialState: canceledRequests = {
  canceledRequests: [],
  status: "idle",
  totalPages: 0,
  totalItems: 0,
  message: "",
};

const canceledRequestsSlice = createSlice({
  name: "canceledRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCanceledFilterRequests.pending,
        (state: canceledRequests) => {
          state.status = "loading";
        }
      )
      .addCase(
        fetchCanceledFilterRequests.fulfilled,
        (state: canceledRequests, action: PayloadAction<ResponseModel>) => {
          state.status = "succeeded";
          state.canceledRequests = action.payload
            .result as unknown as IncomingRequests[];
          state.totalPages = action.payload.totalPages;
          state.totalItems = action.payload.totalItems;
        }
      );
  },
});

export default canceledRequestsSlice.reducer;
