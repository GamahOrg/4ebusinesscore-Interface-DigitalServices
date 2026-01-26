import { FC, Fragment, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import RedirectPopup from "../popups/RedirectPopup";
import RejectReportPopup from "../popups/RejectReportPopup";
import { useLocation, useParams } from "react-router";
import SolveReportPopup from "../../technical-support-feedback-employee/popups/SolveReportPopup";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import {
  fetchGetReportById,
  getAllDelegationToUserByUserId,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import { isValidToParse } from "@4eplatform/shared/assets/Json";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import { fetchRequestTimeline } from "../../../../redux/features/requestTemplate/request-timeline-slice";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import DynamicForm from "../../../partials/dynamic-form/DynamicForm";
import { isValidJson } from "@4eplatform/shared/functions/isValidJson";

type PopupProps = {
  reportId: string;
  categoryName: string;
  technetionId: string;
  mainclassificationId: string;
  attachments?: string[];
  requesterForm?: any;
  reportAttachments?: any;
  operationStatus?: number;
  creatorId?: any;
  creatorEmail?: any;
  itemId?: string;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
  requestId?: string;
};
const OptionsTab: FC<PopupProps> = ({
  reportId,
  categoryName,
  technetionId,
  mainclassificationId,
  attachments,
  requesterForm,
  reportAttachments,
  operationStatus,
  creatorId,
  creatorEmail,
  itemId,
  requestDate,
  requestName,
  requestType,
  requestId,
}) => {
  let intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [solveShow, setSolveShow] = useState<boolean>(false);
  let [activeAttchment, setActiveAttchment] = useState(true);
  let [activeLink, setActiveLink] = useState(false);
  let [isTechnetion, setIsTechnetion] = useState(false);
  let location = useLocation();
  const isDarkMode = localStorage.getItem("Theme") === "dark";

  let activeAttchmentHandler = () => {
    setActiveAttchment(true);
    setActiveLink(false);
  };
  let activeLinkHandler = () => {
    setActiveAttchment(false);
    setActiveLink(true);
  };

  const dispatch = useDispatch();
  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });

  const parms = useParams();

  useEffect(() => {
    if (parms?.id) {
      dispatch(fetchGetReportById(parms.id as string) as any);
    }
  }, [parms?.id, dispatch]);
  let [optin, setoptin] = useState<any>("");
  useEffect(() => {
    setoptin(report?.reportSubject);
  }, [report?.reportSubject]);
  const [itemDynamicForm, setItemDynamicForm] = useState<any>("");
  function isBase64(value: any) {
    try {
      return btoa(atob(value)) === value;
    } catch (e) {
      return false;
    }
  }
  // Adding a useEffect to handle status update and refetch the report data
  useEffect(() => {
    if (reportId) {
      if (report?.operationStatus === 0) {
        dispatch(fetchGetReportById(reportId as string) as any);
      }
    }
  }, [report?.operationStatus, dispatch, reportId]);

  let userLoggedIn = localStorage.getItem("userId");

  useEffect(() => {
    if (userLoggedIn) {
      dispatch(
        getAllDelegationToUserByUserId({
          id: userLoggedIn as string,
          myparams: {
            pageNumber: 1,
            pageSize: 1000,
          },
        }) as any
      );
    }
  }, [userLoggedIn, dispatch]);

  const delegated = useSelector((state: RootState) => {
    return state?.GetReportById?.data;
  });

  const [delegatedToUserIds, setDelegatedToUserIds] = useState<any>([]);

  useEffect(() => {
    const extractedDelegatedToUserIds = delegated?.map(
      (delegated: any) => delegated?.delegeatedFromUserId
    );
    setDelegatedToUserIds(extractedDelegatedToUserIds);
  }, [delegated]);

  useEffect(() => {
    if (
      userLoggedIn === report?.technetionId ||
      delegatedToUserIds?.includes(report?.technetionId)
    ) {
      setIsTechnetion(true);
    }
  }, [userLoggedIn, report?.technetionId, delegatedToUserIds]);

  let attachmentRootUrl = TicketingSystemAggRootUrl;
  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });
  useEffect(() => {
    if (requestId) {
      dispatch(fetchRequestTimeline({ id: requestId }) as any);
    }
  }, [requestId]);
  let [isRequestTimeLineIsFinished, setIsRequestTimeLineIsFinished] =
    useState(false);
  useEffect(() => {
    if (requestTimeline) {
      setIsRequestTimeLineIsFinished(
        [...(requestTimeline?.requestTimeLine || [])]?.reverse()[0]
          ?.actionOptions != null
          ? true
          : false
      );
    }
  }, [requestTimeline]);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    if (report?.requesterForm) {
      setRerender((prev) => prev + 1);
    }
  }, [report?.requesterForm]);
  return (
    <Fragment>
      <div
        className="tab-pane fade show active"
        id="options"
        role="tabpanel"
        aria-labelledby="options-tab"
      >
        <div className="row mb-9">
          <div className="col-lg-6">
            {optin ? (
              <>
                <textarea
                  className="form-control pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                  placeholder={intl.formatMessage({
                    id: "ServiceContent",
                  })}
                  readOnly
                  value={optin}
                  style={{ resize: "vertical", height: "450px" }}
                  onChange={(e) => {
                    setoptin(e.target.value);
                  }}
                ></textarea>
              </>
            ) : (
              <></>
            )}
            {report?.requesterForm !== "undefined" &&
              report?.requesterForm !== "[]" &&
              isValidToParse(report?.requesterForm)  && isValidJson(report?.requesterForm) && (
                <DynamicForm
                  display={true}
                  rerender={rerender}
                  formInputs={JSON.parse(report?.requesterForm as string)}
                />
              )}
          </div>
          {reportAttachments?.length > 0 ? (
            <div className="col-lg-6 card  shadow h-450px ">
              <div className="w-100">
                <div
                  className="nav row  mx-auto nav-pills mb-7   background-pills d-flex justify-content-center justify-content-lg-evenly"
                  id="pills-tab"
                  role="tablist"
                >
                  <div
                    className="nav-item col-12 col-lg-2 w-40 navTabsPills"
                    role="presentation"
                  >
                    <button
                      className={`nav-link w-100 m-1 fs-5 fw-bolder  ${
                        activeAttchment
                          ? "rounded-0 active btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary"
                          : ""
                      }`}
                      id="attachment-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#attachment"
                      type="button"
                      role="tab"
                      aria-controls="options"
                      aria-selected="true"
                      onClick={() => {
                        activeAttchmentHandler();
                      }}
                      style={{
                        color: activeAttchment
                          ? isDarkMode
                            ? "#00aeef"
                            : "rgb(0, 158, 247)"
                          : isDarkMode
                          ? "#ffffff"
                          : "#000000",
                        backgroundColor: activeAttchment
                          ? isDarkMode
                            ? "#1e1e2f"
                            : "#ffffff"
                          : "transparent",
                        borderRadius: activeAttchment ? "20px" : "",
                        border: activeAttchment
                          ? isDarkMode
                            ? "1px solid #00aeef"
                            : "1px solid #009ef7"
                          : "none",
                      }}
                    >
                      {intl.formatMessage({ id: "Attachments" })}{" "}
                    </button>
                  </div>
                </div>
                <div className="col-lg-11 d-flex align-items-center justify-content-center">
                  <div
                    className="row w-100 flex-grow-1"
                    style={{ height: "360px", overflowY: "auto" }}
                  >
                    {attachments ? (
                      <>
                        {attachments?.map((attachment: any, idx) => {
                          const fileURL = attachment;
                          const fileName = fileURL.substring(
                            fileURL.lastIndexOf("/") + 1
                          );

                          return (
                            <div
                              className="d-flex justify-content-between h-fit align-items-center py-3"
                              key={idx}
                            >
                              <a
                                rel="noreferrer"
                                href={
                                  (window as any)._env_
                                    ?.REACT_APP_API_Ticketing_Agg_Url +
                                  "/" +
                                  attachment
                                }
                                target="_blank"
                                download
                                key={idx}
                              >
                                <div className="d-flex align-items-center justify-content-center h-70px ">
                                  <img
                                    src={getIconSrc(
                                      fileName,
                                      { filePath: attachment },
                                      TicketingSystemAggRootUrl
                                    )}
                                    onError={(e: any) => {
                                      e.target.src = getIconSrcError(fileName);
                                    }}
                                    className="d-block h-100 w-50px rounded-circle mx-2"
                                    alt=""
                                  />
                                  <div>
                                    <p className="text-dark-75 pt-2 mb-4 fw-bolder fs-6 text-hover-primary font-size-lg">
                                      {fileName}
                                    </p>
                                  </div>
                                </div>
                              </a>
                              {/* {attachments?.length > 1 ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                                  data-kt-menu-trigger="click"
                                  data-kt-menu-placement="bottom-end"
                                >
                                  <span className="svg-icon svg-icon-2">
                                    <KTSVG path="/media/icons/duotune/general/gen074.svg" />
                                  </span>
                                </button>
                              ) : null} */}

                              {/* Rest of your code */}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>-</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {isRequestTimeLineIsFinished ||
        requestId == "00000000-0000-0000-0000-000000000000" ? (
          <>
            {operationStatus === 0 ||
            operationStatus === 1 ||
            operationStatus === 2 ||
            !isTechnetion ? null : (
              <div className="row justify-content-center mb-6">
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-2 mb-sm-0">
                  <div
                    className="btn btn-danger w-100 text-center"
                    onClick={() => setRejectShow(true)}
                    style={{ border: "none" }}
                  >
                    {intl.formatMessage({ id: "Reject" })}
                  </div>
                </div>
                {location?.pathname?.includes("course-approvals") ? null : (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-2 mb-sm-0">
                    <div
                      className="btn btn-primary w-100 text-center"
                      onClick={() => setRedirectShow(true)}
                    >
                      {intl.formatMessage({ id: "Redirect" })}
                    </div>
                  </div>
                )}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-2 mb-sm-0">
                  <div
                    className="btn btn-primary w-100 text-center"
                    onClick={() => setSolveShow(true)}
                  >
                    {intl.formatMessage({ id: "Completion" })}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      {rejectShow ? (
        <RejectReportPopup
          show={rejectShow}
          handleClose={() => setRejectShow(false)}
          reportId={reportId}
          optin={optin}
          technetionId={technetionId}
          creatorEmail={creatorEmail}
          creatorId={creatorId}
          requestDate={requestDate}
          requestName={requestName}
          requestType={requestType}
          requestNumber={report?.reportNumber}
        />
      ) : (
        ""
      )}

      {redirectShow ? (
        <RedirectPopup
          handleClose={() => setRedirectShow(false)}
          show={redirectShow}
          reportId={reportId}
          optin={optin}
          categoryName={categoryName}
          technetionId={technetionId}
          mainclassificationId={mainclassificationId}
          creatorId={creatorId}
          creatorEmail={creatorEmail}
          itemId={itemId}
          requestDate={requestDate}
          requestName={requestName}
          requestType={requestType}
          requestNumber={report?.reportNumber}
        />
      ) : (
        ""
      )}

      {solveShow ? (
        <SolveReportPopup
          show={solveShow}
          handleClose={() => setSolveShow(false)}
          technetionId={technetionId}
          reportId={reportId}
          creatorId={creatorId}
          creatorEmail={creatorEmail}
          requestDate={requestDate}
          requestName={requestName}
          requestType={requestType}
          requestNumber={report?.reportNumber}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default OptionsTab;
