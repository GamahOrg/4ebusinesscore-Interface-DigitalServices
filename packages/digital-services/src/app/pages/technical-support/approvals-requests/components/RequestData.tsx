import { useIntl } from "react-intl";
import { FC, useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { RootState } from "../../../../redux/store/store";
import { fetchReportsByRequestId } from "../../../../redux/features/requests-slice/request-data-slice";
import RequestEmployeesPopup from "../popups/RequestEmployeesPopup";
import { TrainingRootUrl } from "@4eplatform/shared/apis/training";
import { DynamicWorkflowRootUrl } from "@4eplatform/shared/apis/dynamic_workflow";
import ViewRequester from "../popups/ViewRequester";

interface RequestDataProps {
  setModalRShow: any;
  setModalShow: any;
  requestDetails: any;
  type: any;
  request_id?: any;
}

const RequestData: FC<RequestDataProps> = ({
  requestDetails,
  type,
  setModalRShow = () => {},
  setModalShow = () => {},
  request_id,
}) => {
  let intl = useIntl();
  const [viewEmployee, setViewEmployee] = useState<boolean>(false);
  const dispatch = useDispatch();

  const requestData = useSelector((state: RootState) => {
    return state?.requestData?.RequestData;
  });

  useEffect(() => {
    if (request_id) {
      dispatch(fetchReportsByRequestId(request_id) as any);
    }
  }, [request_id]);
  const [viewEmployes, setViewEmployes] = useState<boolean>(false);
  let attachmentRootUrl =
    requestDetails?.serviceType == 11
      ? TrainingRootUrl
      : DynamicWorkflowRootUrl;
  return (
    <>
      <div className="RequestData">
        <div className="card-body pt-9 pb-0">
          <div
            className="card-header bg-light  px-4 py-4  mb-3 w-100"
            style={{
              borderTop: "1px dashed #A1A5B7",
              borderBottom: "1px dashed #A1A5B7",
              lineHeight: "2.5",
            }}
          >
            <h3 className="card-title align-items-start flex-column w-100">
              <span className="card-label fw-bolder  fs-4 mb-2 ">
                {intl.formatMessage({
                  id: "RequestData",
                })}
              </span>
              {type === "OutgoingRequest" ? (
                <span className="mt-1 fs-6 text-muted">
                  {intl.formatMessage({
                    id: "OutgoingRequests",
                  })}
                </span>
              ) : type == "IncomingRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "IncomingRequests",
                    })}
                  </span>
                </>
              ) : type == "SuggestedRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "SuggestedRequests",
                    })}
                  </span>
                </>
              ) : type == "ArchivedRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "ArchivedRequests",
                    })}
                  </span>
                </>
              ) : type == "CancelledRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "CanceledRequests",
                    })}
                  </span>
                </>
              ) : (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "AssignedRequests",
                    })}
                  </span>
                </>
              )}
            </h3>
          </div>
          {type == "OutgoingRequest" || type == "SuggestedRequest" ? (
            <> </>
          ) : (
            <></>
          )}
          {/* {type != "OutgoingRequest" ? ( */}
          <div
            className="d-flex w-100 align-items-center"
            style={{ borderBottom: "1px dashed #A1A5B7" }}
          >
            <div
              role="button"
              onClick={() => {
                setViewEmployee(true);
              }}
              className="d-flex  px-4 py-4  mb-3"
            >
              <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
                {intl.formatMessage({
                  id:
                    type != "SuggestedRequest" ? "Applicant" : "SuggestedFrom",
                })}{" "}
                :
              </p>
              <p
                className="px-2 mb-0  pb-2  fw-bolder"
                style={{ color: "#009EF7" }}
              >
                {requestDetails?.createdByFirstName +
                  " " +
                  requestDetails?.createdBySecondName +
                  " " +
                  requestDetails?.createdByThirdName +
                  " " +
                  requestDetails?.createdByFourthName}
              </p>
            </div>
            {requestDetails?.requestUsers?.length > 0 && (
              <div
                role="button"
                onClick={() => {
                  setViewEmployes(true);
                }}
                className="px-2 mb-3 py-4  fw-bolder d-flex"
              >
                <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
                  {intl.formatMessage({ id: "RequestEmployees" })} :
                </p>
                <p
                  className="px-2 mb-0  pb-2  fw-bolder"
                  style={{ color: "#009EF7" }}
                >
                  {requestDetails?.requestUsers?.length}
                </p>
              </div>
            )}
          </div>
          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 " style={{ color: "#727272" }}>
              {intl.formatMessage({
                id: "RequestNumber",
              })}{" "}
              :{" "}
            </p>
            <p
              className="px-2 mb-0  pb-2 fw-bolder"
              style={{ color: "#727272" }}
            >
              {requestData?.requestNumber || requestDetails?.requestNumber}
            </p>
          </div>
          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({
                id: "RequestAddress",
              })}{" "}
              :
            </p>
            <p
              className="px-2 mb-0  pb-2 fw-bolder"
              style={{ color: "#009EF7" }}
            >
              {requestDetails?.requestName || requestDetails?.name}
            </p>
          </div>
          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({
                id: "RequestDescription",
              })}{" "}
              :
            </p>
            <textarea
              id="RequestDescription"
              className="form-control disabled pt-2 form-control-lg form-control-solid mb-3 mb-lg-2"
              placeholder={intl.formatMessage({
                id: "RequestDescription",
              })}
              style={{
                color: "#009EF7",
                wordBreak: "break-word",
                lineHeight: "1.7",
                fontWeight: 500,
                textAlign: "justify",
              }}
              rows={2}
              value={requestData?.reportSubject || requestDetails?.description}
              disabled
            ></textarea>
          </div>
          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({
                id: "RequestAttachment",
              })}{" "}
              :
            </p>
            <div
              className="px-2 mb-0 pb-2 fw-bolder"
              style={{ color: "#009EF7" }}
            >
              {requestData?.reportAttachments.length === 0 ||
              !!!requestData?.reportAttachments ? (
                <span>{intl.formatMessage({ id: "NoAttachments" })}</span>
              ) : (
                requestData?.reportAttachments.map((attachment: any) => (
                  <div
                    className="d-flex align-items-center mx-3 flex-shrink-0"
                    key={Math?.random()}
                  >
                    <a
                      href={`${attachmentRootUrl}${attachment.fileUrl}`}
                      target="_blank"
                      download
                      className="d-flex align-items-center"
                    >
                      <img
                        src={getIconSrc(
                          attachment?.fileUrl,
                          { path: attachment?.fileUrl },
                          attachmentRootUrl
                        )}
                        className="w-30px h-30px"
                        alt="pdf"
                      />
                      <div className="d-flex flex-column mx-2">
                        <span>
                          {attachment.fileUrl.substring(
                            attachment.fileUrl.lastIndexOf("/") + 1
                          )}
                        </span>
                      </div>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {requestDetails?.requestCategoryName && (
            <div
              style={{ borderBottom: "1px dashed #A1A5B7" }}
              className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
            >
              <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
                {intl.formatMessage({ id: "OrderType" })} :
              </p>
              <p
                className="px-2 mb-0  pb-2  fw-bolder"
                style={{ color: "#727272" }}
              >
                {requestDetails?.requestCategoryName}
              </p>
            </div>
          )}

          {requestData?.item && (
            <div
              style={{ borderBottom: "1px dashed #A1A5B7" }}
              className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
            >
              <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
                {intl.formatMessage({ id: "ClauseName" })} :
              </p>
              <p
                className="px-2 mb-0  pb-2  fw-bolder"
                style={{ color: "#727272" }}
              >
                {requestData?.item}
              </p>
            </div>
          )}

          {requestDetails?.serviceType != 3 ? (
            <></>
          ) : (
            <>
              {requestDetails?.mainClassification && (
                <div
                  style={{ borderBottom: "1px dashed #A1A5B7" }}
                  className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
                >
                  <p
                    className="pb-2 mb-0 fw-bolder"
                    style={{ color: "#727272" }}
                  >
                    {intl.formatMessage({ id: "MainClassification" })} :
                  </p>
                  <p
                    className="px-2 mb-0  pb-2  fw-bolder"
                    style={{ color: "#727272" }}
                  >
                    {requestDetails?.mainClassification}
                  </p>
                </div>
              )}

              {requestDetails?.serviceCatalog && (
                <div
                  style={{ borderBottom: "1px dashed #A1A5B7" }}
                  className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
                >
                  <p
                    className="pb-2 mb-0 fw-bolder"
                    style={{ color: "#727272" }}
                  >
                    {intl.formatMessage({ id: "Catalog" })} :
                  </p>
                  <p
                    className="px-2 mb-0  pb-2  fw-bolder"
                    style={{ color: "#727272" }}
                  >
                    {requestDetails?.serviceCatalog}
                  </p>
                </div>
              )}

              {requestDetails?.category && (
                <div
                  style={{ borderBottom: "1px dashed #A1A5B7" }}
                  className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
                >
                  <p
                    className="pb-2 mb-0 fw-bolder"
                    style={{ color: "#727272" }}
                  >
                    {intl.formatMessage({ id: "Type2" })} :
                  </p>
                  <p
                    className="px-2 mb-0  pb-2  fw-bolder"
                    style={{ color: "#727272" }}
                  >
                    {requestDetails?.category}
                  </p>
                </div>
              )}
            </>
          )}
          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex align-items-center px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "AdminstrationName" })} :
            </p>
            {type === "OutgoingRequest" ? (
              <p
                className="px-2 mb-0  pb-2  fw-bolder"
                style={{ color: "#727272" }}
              >
                {intl?.locale == "ar"
                  ? requestDetails?.orgNameAr
                  : requestDetails?.orgNameEn}
              </p>
            ) : (
              <p
                className="px-2 mb-0  pb-2  fw-bolder"
                style={{ color: "#727272" }}
              >
                {intl?.locale == "ar"
                  ? requestDetails?.orgNameAr
                  : requestDetails?.orgNameEn}
              </p>
            )}
          </div>
          <div
            className="d-flex align-items-center  px-4 py-4  mb-3 w-100"
            style={{ borderBottom: "1px dashed #A1A5B7" }}
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "RequestDate" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2 fw-bolder"
              style={{ color: "#727272" }}
            >
              {moment
                .tz(requestDetails?.date, "UTC")
                .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                .format("YYYY-MM-DD / hh:mm a")}
            </p>
          </div>
          <div className="d-flex align-items-center   px-4 py-4  mb-3 w-100">
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "RequestStatus" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2  fw-bolder"
              style={{
                color: `${
                  requestDetails?.requestStatus == 4
                    ? "rgb(128,128,128)"
                    : requestDetails?.requestStatus == 3
                    ? "#3232a8"
                    : requestDetails?.requestStatus == 2
                    ? "#F14141"
                    : requestDetails?.requestStatus == 1 ||
                      requestDetails?.requestStatus == 6
                    ? "#52CD50"
                    : requestDetails?.requestStatus == 0
                    ? "#ffc700"
                    : requestDetails?.requestStatus == 5
                    ? "#F14141"
                    : ""
                }`,
              }}
            >
              {requestDetails?.requestStatus == 0
                ? intl.formatMessage({ id: "UnderProcedure" })
                : requestDetails?.requestStatus == 1
                ? intl.formatMessage({ id: "Accepted" })
                : requestDetails?.requestStatus == 2
                ? intl.formatMessage({ id: "Rejected" })
                : requestDetails?.requestStatus == 3
                ? intl.formatMessage({ id: "RequireEdit" })
                : requestDetails?.requestStatus == 4
                ? intl.formatMessage({ id: "Redirect" })
                : requestDetails?.requestStatus == 5
                ? intl.formatMessage({ id: "Canceled" })
                : requestDetails?.requestStatus == 6
                ? intl.formatMessage({
                    id: "ExceptionApproved",
                  })
                : ""}
            </p>
          </div>
        </div>
      </div>
      <div>
        {/* <ViewEmployee
          handleClose={() => setViewEmployee(false)}
          show={viewEmployee}
          requestDetails={requestDetails}
          // id={output?.id}
          // projectId={id}
        /> */}
        <ViewRequester
          show={viewEmployee}
          handleClose={() => setViewEmployee(false)}
          id={requestDetails?.createBy}
        />
        <RequestEmployeesPopup
          handleClose={() => setViewEmployes(false)}
          show={viewEmployes}
          requestDetails={requestDetails}
        />
      </div>
    </>
  );
};

export default RequestData;
