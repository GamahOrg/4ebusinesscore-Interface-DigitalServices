import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TrainingConsume } from "@4eplatform/shared/apis/training";
import { ResponseModel } from "@4eplatform/shared/models/responseModel";

interface ApplyCourseState {}

const initialState: ApplyCourseState = {};

export const postActionOnCourseStage = createAsyncThunk<ResponseModel, any>(
  "applyCourse/postActionOnCourseStage",
  async (newActionOnCourseStage, thunkApi) => {
    try {
      const response = await TrainingConsume.addActionOnCourseStage(
        newActionOnCourseStage
      );
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const applyCourseSlice = createSlice({
  name: "applyCourse",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default applyCourseSlice.reducer;
