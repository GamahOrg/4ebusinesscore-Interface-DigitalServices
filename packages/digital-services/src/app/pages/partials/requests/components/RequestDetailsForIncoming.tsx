import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { RejectPopup } from "../popups/RejectPopup";
import { AcceptPopup } from "../popups/AcceptPopup";
import RequestData from "./RequestData";
import QuestionsReport from "./QuestionsReport";
import RequestPath from "./RequestPath";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import {
  fetchIsAuthorizeStep,
  getIncomingRequestsById,
} from "../../../../redux/features/requests-slice/requests-slice";
import { ReOrderPopup } from "../popups/ReOrderPopup";
import { AssignmentPopup } from "../popups/AssignmentPopup";
import { fetchRequestTimeline } from "../../../../redux/features/requests-slice/request-timeline-slice";
import QuestionsReportForAssign from "./QuestionReportForAssign";
import { getAllDelegationFromUserByUserId } from "../../../../redux/features/delegation-slices/delegationSlice";
import IntegrationData from "./IntegrationData";

function RequestDetailsForIncoming() {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalRShow, setModalRShow] = useState<boolean>(false);
  const [reOrderModalShow, setReOrderModalShow] = useState<boolean>(false);
  const [assignmentModalShow, setAssignmentModalShow] =
    useState<boolean>(false);
  let { id } = useParams();
  let [loading, setLoading] = useState<boolean>(true);
  let [tabName, setTabName] = useState<string>("RequestData");
  let loggedInUserId = localStorage.getItem("userId") as string;
  let [delegatedUserIds, setDelegatedUserIds] = useState<any>([]);
  useEffect(() => {
    const body = {
      id: loggedInUserId,
      myParams: {
        pageNumber: "1",
        pageSize: "100000",
      },
    };
    dispatch(getAllDelegationFromUserByUserId(body) as any).then((res: any) => {
      setDelegatedUserIds(
        res?.payload?.result?.map((item: any) => {
          return item?.delegeatedToUserId?.toLowerCase();
        })
      );
    });
  }, []);
  let intl = useIntl();
  const dispatch = useDispatch();

  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });

  const incomingRequestDetails = useSelector((state: RootState) => {
    return state?.requests?.incomingRequest;
  });
  const requestData = useSelector((state: RootState) => {
    return state?.requestData?.RequestData;
  });
  let [type] = useState("IncomingRequest");
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getIncomingRequestsById(id) as any);
      dispatch(fetchIsAuthorizeStep(id) as any);
      dispatch(fetchRequestTimeline({ id }) as any);
    }
  }, [id]);
  const isAuthorizeStep = useSelector((state: RootState) => {
    return state?.requests?.isAuthorizeStep;
  });
  let [requestDetails, setRequestDetails] = useState<any>({});
  useEffect(() => {
    setRequestDetails(incomingRequestDetails);
  }, [incomingRequestDetails]);

  if (loading) {
    return <h2>loading..............</h2>;
  }

  let tabClasses = () => {
    return `w-fit btn d-flex justify-content-center
            align-items-center rounded-0 bg-transparent 
            btn-active-color-primary border-0 ms-6 fs-6  
            fw-bolder border border-bottom border-white 
            border-active-primary `;
  };
  let userId = localStorage.getItem("userId");
  let isExcepted = requestTimeline?.requestTimeLine
    ?.map((item: any) => {
      return {
        userId: item?.userId,
        isExceptionActionTacker: item?.isExceptionActionTacker,
      };
    })
    ?.find((ele: any) => {
      return ele?.userId == userId;
    })?.isExceptionActionTacker;

  let countTasksforLoggedUserWithNoAction =
    requestTimeline?.requestTimeLine?.find((item: any) => {
      return (
        item?.actionOptions == null &&
        item?.stepId?.toLowerCase() ==
          requestTimeline?.currentStepId?.toLowerCase()
      );
    })?.countTasks;
  return (
    <Fragment>
      <div className="card mb-5 mb-xl-10 shadow pb-5">
        <div className="tabs row d-flex text-center px-5 pt-8">
          <span
            onClick={() => setTabName((prev) => "RequestData")}
            className={`${tabClasses()} ${tabName == "RequestData" ? "active" : "text-muted"}`}
          >
            {intl.formatMessage({ id: "RequestData" })}
          </span>
          <span
            onClick={() => setTabName((prev) => "RequestPath")}
            className={`${tabClasses()} ${tabName == "RequestPath" ? "active" : "text-muted"}`}
          >
            {intl.formatMessage({ id: "RequestPath" })}
          </span>
          {requestDetails?.requestCategoryName == "إداره اللجان" ||
          requestDetails?.requestCategoryName == "إدارة اللجان" ||
          requestDetails?.requestCategoryName == "اداره اللجان" ||
          requestDetails?.requestCategoryName == "ادارة اللجان" ? (
            <></>
          ) : (
            <>
              {" "}
              <>
                <span
                  onClick={() => setTabName((prev) => "ApplicationForm")}
                  className={`${tabClasses()} ${tabName == "ApplicationForm" ? "active" : "text-muted"}`}
                >
                  {intl.formatMessage({ id: "ApplicationForm" })}
                </span>
              </>
            </>
          )}

          {requestTimeline?.isIntegration &&
          requestTimeline?.integrationId !=
            "9d11d2ee-42bd-4e77-9f19-dd098f31164c" ? (
            <>
              <span
                onClick={() => setTabName((prev) => "IntegrationData")}
                className={`${tabClasses()} ${tabName == "IntegrationData" ? "active" : "text-muted"}`}
              >
                {intl.formatMessage({ id: "IntegrationData" })}
              </span>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="">
          {tabName == "RequestData" && (
            <RequestData
              request_id={requestDetails?.id || id}
              setModalRShow={setModalRShow}
              setModalShow={setModalShow}
              type={type}
              requestDetails={requestDetails}
            />
          )}
          {tabName == "RequestPath" && (
            <RequestPath
              requestDetails={requestDetails}
              request_id={requestDetails?.id}
              requestCategoryName={requestDetails?.requestCategoryName}
            />
          )}
          {tabName == "ApplicationForm" && (
            <QuestionsReport
              subject={requestData?.reportSubject}
              attachments={requestData?.reportAttachments}
              request_id={requestDetails?.id}
              tabName={tabName}
            />
          )}
          {tabName == "AssignedRequests" && (
            <QuestionsReportForAssign tabName={tabName}    requestDetails={requestDetails}/>
          )}
          {tabName == "IntegrationData" && (
            <IntegrationData
              request_id={id}
              setModalRShow={setModalRShow}
              setModalShow={setModalShow}
              type={type}
              requestDetails={requestDetails}
            />
          )}
        </div>

        <>
          {type !== "OutgoingRequest" &&
          tabName !== "AssignedRequests" &&
          type !== "AssignedRequests" ? (
            <div className="d-flex flex-wrap flex-center flex-row-fluid py-2 gap-3 gap-md-4">
              {isExcepted ? (
                <></>
              ) : (
                <>
                  {isAuthorizeStep ? (
                    <>
                      <button
                        type="reset"
                        className="btn btn-danger px-4 px-md-15 mb-2 mb-md-0 w-100 w-md-auto"
                        onClick={() => setModalRShow(true)}
                      >
                        {intl.formatMessage({ id: "Reject" })}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success px-4 px-md-15 mb-2 mb-md-0 w-100 w-md-auto"
                        onClick={() => setModalShow(true)}
                      >
                        <span className="indicator-label">
                          {intl.formatMessage({ id: "Accept" })}
                        </span>
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {requestTimeline?.requestTimeLine?.filter((item: any) => {
                return (
                  item?.actionOptions !== null && item?.actionOptions != 16
                );
              })?.length > 0 && isAuthorizeStep ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 px-md-15 mb-2 mb-md-0 w-100 w-md-auto"
                    onClick={() => setReOrderModalShow(true)}
                  >
                    <span className="indicator-label">
                      {intl.formatMessage({ id: "ReOrder" })}
                    </span>
                  </button>
                </>
              ) : (
                <></>
              )}
              {requestTimeline?.requestTimeLine?.find((item: any) => {
                return (
                  item?.stepId?.toLowerCase() ==
                  requestTimeline?.currentStepId?.toLowerCase()
                );
              })?.assginRequestTemplateStepDto != null &&
              !(
                requestTimeline?.requestTimeLine?.find((item: any) => {
                  return (
                    item?.stepId?.toLowerCase() ==
                    requestTimeline?.currentStepId?.toLowerCase()
                  );
                })?.assginRequestTemplateStepDto?.isCountTask == false &&
                requestTimeline?.requestTimeLine?.find((item: any) => {
                  return (
                    item?.stepId?.toLowerCase() ==
                    requestTimeline?.currentStepId?.toLowerCase()
                  );
                })?.assginRequestTemplateStepDto?.countTask == 0
              ) ? (
                <>
                  {isAuthorizeStep ? (
                    <button
                      type="submit"
                      className="btn btn-primary px-4 px-md-15 mb-2 mb-md-0 w-100 w-md-auto"
                      style={{ opacity: ".7" }}
                      onClick={() => setAssignmentModalShow(true)}
                    >
                      <span className="indicator-label">
                        {intl.formatMessage({ id: "Assignment" })}
                      </span>
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          ) : (
            type == "AssignedRequests" &&
            tabName === "AssignedRequests" && <></>
          )}
        </>
      </div>

      <div className="modal fade" aria-hidden="true">
        <RejectPopup
          show={modalRShow}
          handleClose={() => setModalRShow(false)}
          id={requestDetails?.id}
          requestTimeline={requestTimeline}
          incomingRequestDetails={incomingRequestDetails}
        />
        <AcceptPopup
          show={modalShow}
          handleClose={() => setModalShow(false)}
          id={requestDetails?.id}
          requestTimeline={requestTimeline}
          incomingRequestDetails={incomingRequestDetails}
          type={type}
        />
        <ReOrderPopup
          show={reOrderModalShow}
          handleClose={() => setReOrderModalShow(false)}
          id={requestDetails?.id}
          incomingRequestDetails={incomingRequestDetails}
          requestTimeLines={requestTimeline?.requestTimeLine?.filter(
            (item: any) => {
              return item?.actionOptions !== null && item?.actionOptions != 16;
            }
          )}
        />
        <AssignmentPopup
          show={assignmentModalShow}
          handleClose={() => setAssignmentModalShow(false)}
          id={requestDetails?.id}
          stepId={requestTimeline?.currentStepId}
          incomingRequestDetails={incomingRequestDetails}
          countTasks={countTasksforLoggedUserWithNoAction}
        />
      </div>
    </Fragment>
  );
}

export default RequestDetailsForIncoming;
