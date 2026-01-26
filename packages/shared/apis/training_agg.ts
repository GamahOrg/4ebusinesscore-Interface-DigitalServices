import { Endpoint } from "../models/EndPoint";
import initializeConsume from "../services/requests";
let version = `v1/`;

const TrainingAggEndpoints: { [key: string]: Endpoint } = {
  getAppliedCourseStage: {
    url: `${version}AppliedCourseStage/GetAllAppliedCourses`,
    method: `get`,
  },
  getGroup: {
    url: `${version}Group/GetGroupById`,
    method: `getById`,
  },
  postHrAction: {
    url: `${version}HrAction/PostActionHr`,
    method: `post`,
  },
  getAllMyavailableCourses: {
    url: `${version}MyavailableCourse/GetAllMyavailableCourse`,
    method: `get`,
  },
  getAllUserApplicationByCourseStageHr: {
    url: `${version}MyavailableCourse/GetAllUserApplicationforcoursebyCoursestageidHR`,
    method: `get`,
  },
  getAllUserApplicationCourseByCourseStageId: {
    url: `${version}MyavailableCourse/GetAllUserApplicationforcoursebyCoursestageid`,
    method: `get`,
  },
  getAllPendingUserApplicationsByCourseStageId: {
    url: `${version}MyavailableCourse/GetAllPendingUserApplicationsByCourseStageId`,
    method: `get`,
  },
  getAllApprovedUserApplicationsByCourseStageId: {
    url: `${version}MyavailableCourse/GetAllApprovedUserApplicationsByCourseStageId`,
    method: `get`,
  },
  getAllUserApplicationCourseStage: {
    url: `${version}MyavailableCourse/GetAllUserApplicationforcoursebyCoursestageid`,
    method: `get`,
  },
  getAllMyCourses: {
    url: `${version}UnavaliableCourse/GetAllMyCourses`,
    method: `get`,
  },
  getAllUnAvailableCoursesForAppliers: {
    url: `${version}UnavaliableCourse/GetAllUnAvailableCoursesForAppliers`,
    method: `get`,
  },
  getUnavalibleCourseById: {
    url: `${version}UnavaliableCourse/GetUnavalibleCourseById`,
    method: `getById`,
  },
  getAllUsersForUnAvailableCourse: {
    url: `${version}UnavaliableCourse/GetAllUsersForUnAvailableCourse`,
    method: `getById`,
  },
  getUserSurveyByCourseStage: {
    url: `${version}UserServey/GetuseServeybycoursestage`,
    method: `get`,
  },
  getRoleAssign: {
    url: `${version}Group/CheckRoleAssign`,
    method: `get`,
  },
  getAllRoles: {
    url: `${version}Group/GetAllRoleAssign`,
    method: `get`,
  },
  getRoleById: {
    url: `${version}Group/GetRoleAssignById`,
    method: `getById`,
  },
};
const TrainingAggBaseUrl = `${
  (window as any)._env_?.REACT_APP_API_Training_Agg_Url
}/api/`;
export const TrainingAggRootUrl = `${
  (window as any)._env_?.REACT_APP_API_Training_Agg_Url
}/`;

export const TrainingAggConsume = initializeConsume(
  TrainingAggBaseUrl,
  TrainingAggEndpoints
);
