import React, { FC, Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import RequestData from "./RequestData";
import QuestionsReport from "./QuestionsReport";
import RequestPath from "./RequestPath";
import { useDispatch, useSelector } from "react-redux";
import { getOutgoingRequestsById } from "../../../../redux/features/requests-slice/requests-slice";
import { fetchRequestTimeline } from "../../../../redux/features/requests-slice/request-timeline-slice";
import QuestionsReportForAssign from "./QuestionReportForAssign";
import IntegrationData from "./IntegrationData";
import { RootState } from "../../../../redux/store/store";

function RequestDetailsForSuggested() {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalRShow, setModalRShow] = useState<boolean>(false);
  const [cancelModalShow, setCancelModalShow] = useState<boolean>(false);
  let { id } = useParams();
  let [loading, setLoading] = useState<boolean>(true);
  let [tabName, setTabName] = useState<string>("RequestData");
  const userId = localStorage.getItem("userId");

  let intl = useIntl();
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(fetchRequestTimeline({ id }) as any);
    }
  }, [id]);

  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });
  const outgoingRequestDetails = useSelector((state: RootState) => {
    return state?.requests?.outgoingRequest;
  });
  const requestData = useSelector((state: RootState) => {
    return state?.requestData?.RequestData;
  });
  let [type] = useState("SuggestedRequest");

  useEffect(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    if (id) {
      dispatch(getOutgoingRequestsById(id) as any);
    }
  }, [id]);
  let [requestDetails, setRequestDetails] = useState<any>({});
  useEffect(() => {
    setRequestDetails(outgoingRequestDetails);
  }, [outgoingRequestDetails]);

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
              {requestData?.reportSubject ||
              requestData?.reportAttachments?.length != 0 ? (
                <>
                  <span
                    onClick={() => setTabName((prev) => "ApplicationForm")}
                    className={`${tabClasses()} ${tabName == "ApplicationForm" ? "active" : "text-muted"}`}
                  >
                    {intl.formatMessage({ id: "ApplicationForm" })}
                  </span>
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {requestTimeline?.isIntegration && requestTimeline?.integrationId != "9d11d2ee-42bd-4e77-9f19-dd098f31164c" ? <>
            <span
              onClick={() => setTabName((prev) => "IntegrationData")}
              className={`${tabClasses()} ${tabName == "IntegrationData" ? "active" : "text-muted"}`}
              >
              {intl.formatMessage({ id: "IntegrationData" })}
            </span>
          </> : <></>}
        </div>

        <div className="">
          {tabName == "RequestData" && (
            <RequestData
              request_id={requestDetails?.id}
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
            <QuestionsReportForAssign tabName={tabName}    requestDetails={requestDetails} />
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
      </div>
    </Fragment>
  );
}

export default RequestDetailsForSuggested;
