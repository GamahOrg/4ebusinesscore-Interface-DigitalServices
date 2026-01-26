import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import OptionsTab from "./OptionsTab";
import StepsTab from "./StepsTab";
import TrackTab from "./TrackTab";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import {
  PostOperationReport,
  fetchGetReportById,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import moment from "moment-timezone";
import { getAllReportStatusByReportId } from "../../../../redux/features/service-operation/report/GetAllReportStatus";
import NotesTab from "./NotesTab";
import { fetchRatingsReport } from "../../../../redux/features/service-operation/report/RatingsReportSlice";
import {
  getStatusClass,
  getStatusLabel,
} from "@4eplatform/shared/functions/getTechincalSupportStatus";
import { DisplayNameOneProps } from "@4eplatform/shared/functions/displayName";

function TechnicalSupportEmployeeDetails() {
  let intl = useIntl();
  let theme = localStorage.getItem("Theme");
  let [activeOptions, setActiveOptions] = useState(true);
  let [activeNotes, setActiveNotes] = useState(false);
  let [activeTrack, setActiveTrack] = useState(false);
  let [activeSteps, setActiveSteps] = useState(false);
  let [rate, setRate] = useState(0);
  let [requesterNote, setRequesterNote] = useState("");
  let activeOptionsHandler = () => {
    setActiveOptions(true);
    setActiveNotes(false);
    setActiveTrack(false);
    setActiveSteps(false);
  };
  let activeTrackHandler = () => {
    setActiveOptions(false);
    setActiveTrack(true);
    setActiveNotes(false);
    setActiveSteps(false);
  };

  let activeNotesHandler = () => {
    setActiveOptions(false);
    setActiveTrack(false);
    setActiveNotes(true);
    setActiveSteps(false);
  };
  let activeStepsHandler = () => {
    setActiveOptions(false);
    setActiveTrack(false);
    setActiveNotes(false);
    setActiveSteps(true);
  };
  const dispatch = useDispatch();
  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });

  const parms = useParams();
  let reportId = `${parms.id}`;

  useEffect(() => {
    if (reportId) {
      dispatch(fetchRatingsReport(reportId) as any);
      dispatch(fetchGetReportById(reportId) as any)
        .then((result: any) => {
          if (!result.payload.result.received) {
            dispatch(PostOperationReport({ reportId: reportId }) as any);
          }
        })
        .catch((err: any) => {});
    }
  }, [reportId, dispatch]);

  let reportRate = useSelector((state: RootState) => {
    return state?.RatingsReport.reports;
  });

  useEffect(() => {
    if (reportRate) {
      setRate(reportRate?.ratingsReportStatus);
      setRequesterNote(reportRate?.note);
    }
  }, [reportRate]);
  const fullName = DisplayNameOneProps(report?.creatorName);

  useEffect(() => {
    if (report) {
      localStorage.setItem(
        "ClassificationName",
        report?.mainClassificationName
      );
      // localStorage.setItem("isSubSystem", "false");
    }
  }, [report]);
  return (
    <Fragment>
      <div className="card mb-5 mb-xl-10 shadow pb-5">
        <div className="card-body pt-9 pb-0">
          <div className="card-header title_details_border bg-light  px-4 py-4  mb-3 w-100 d-flex align-items-center ">
            <h3 className="card-title align-items-start flex-column w-40">
              <span className="card-label fw-bolder fs-4 mb-2 ">
                {intl.formatMessage({
                  id: "TicketData",
                })}
              </span>
              <span className="mt-1 fs-6 ">
                {intl.formatMessage({
                  id: "CurrentTicketData",
                })}
              </span>
            </h3>
          </div>
          <div className="card shadow p-7 mb-8">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "TicketRequester",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {report?.commanName ? report?.commanName : fullName}
                </span>
              </div>
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "TicketNumber",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {" "}
                  {report?.reportNumber}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center  my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "DateAndTime",
                  })}
                </span>
                :
                <span className="d-inline-block mx-2">
                  {report?.createOn !== null ? (
                    <>
                      {moment.tz(report?.createOn, "UTC").format("YYYY-MM-DD")}
                      <br />
                      {moment
                        .tz(report?.createOn, "UTC")
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .format("hh:mm a")}
                    </>
                  ) : (
                    "_"
                  )}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center  my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "LastAction",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {" "}
                  {report?.lastUpdate !== null ? (
                    <>
                      {moment
                        .tz(report?.lastUpdate, "UTC")
                        .format("YYYY-MM-DD")}
                      <br />
                      {moment
                        .tz(report?.lastUpdate, "UTC")
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .format("hh:mm a")}
                    </>
                  ) : (
                    "_"
                  )}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Category",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {intl.locale == "ar" ? (
                    report?.mainClassificationName ? (
                      report?.mainClassificationName
                    ) : (
                      <span className="text-gray-500">
                        {intl.formatMessage({ id: "NotExist" })}
                      </span>
                    )
                  ) : report?.mainClassificationNameEn ? (
                    report?.mainClassificationNameEn
                  ) : (
                    <span className="text-gray-500">
                      {intl.formatMessage({ id: "NotExist" })}
                    </span>
                  )}
                </span>
              </div>
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Catalog",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {intl.locale == "ar" ? (
                    report?.serviceCatalogName ? (
                      report?.serviceCatalogName
                    ) : (
                      <span className="text-gray-500">
                        {intl.formatMessage({ id: "NotExist" })}
                      </span>
                    )
                  ) : report?.serviceCatalogNameEn ? (
                    report?.serviceCatalogNameEn
                  ) : (
                    <span className="text-gray-500">
                      {intl.formatMessage({ id: "NotExist" })}
                    </span>
                  )}
                </span>
              </div>
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Type2",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {intl.locale == "ar" ? (
                    report?.categoryName ? (
                      report?.categoryName
                    ) : (
                      <span className="text-gray-500">
                        {intl.formatMessage({ id: "NotExist" })}
                      </span>
                    )
                  ) : report?.categoryNameEn ? (
                    report?.categoryNameEn
                  ) : (
                    <span className="text-gray-500">
                      {intl.formatMessage({ id: "NotExist" })}
                    </span>
                  )}
                </span>
              </div>
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "SubItem",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {intl.locale == "ar" ? (
                    report?.itemName ? (
                      report?.itemName
                    ) : (
                      <span className="text-gray-500">
                        {intl.formatMessage({ id: "NotExist" })}
                      </span>
                    )
                  ) : report?.itemNameEn ? (
                    report?.itemNameEn
                  ) : (
                    <span className="text-gray-500">
                      {intl.formatMessage({ id: "NotExist" })}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
              <div className="w-200px  d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Address",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3 ">
                  {report?.reportTitle} 
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Priority",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {report?.priorityLevel === 1
                    ? intl.formatMessage({ id: "High" })
                    : report?.priorityLevel === 2
                    ? intl.formatMessage({ id: "Medium" })
                    : report?.priorityLevel === 3
                    ? intl.formatMessage({ id: "Low" })
                    : intl.formatMessage({ id: "Unknown" })}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center my-3 my-md-0">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Status",
                  })}
                </span>
                :
                <span
                  className={`d-inline-block px-1 mx-3 badgex badge-light-${getStatusClass(
                    report?.operationStatus
                  )}}`}
                >
                  {" "}
                  {getStatusLabel(report?.operationStatus, intl)}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center my-3 my-md-0">
                {/* <span className="text-primary d-inline-block mx-2">
                  {" "}
                  {intl.formatMessage({
                    id: "Time",
                  })}
                </span>
                <span className="d-inline-block mx-1">
                  {report?.createOn != null
                    ? moment
                        .tz(report?.createOn, "UTC")
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .format("LT")
                    : "_"}{" "}
                </span> */}
              </div>
            </div>
          </div>
          {reportRate ? (
            <div className="card shadow p-7 mb-8">
              <div className="d-flex justify-content-md-between align-items-md-center flex-column flex-md-row">
                <div className="d-flex">
                  <span className="text-primary d-inline-block mx-3">
                    {" "}
                    {intl.formatMessage({
                      id: "Reviews",
                    })}
                  </span>
                  :
                  <span className="d-inline-block mx-3">
                    {[1, 2, 3, 4, 5]?.map((number) => {
                      return (
                        <Fragment key={Math.random()}>
                          <i
                            className="fa-solid fa-star mx-2 fs-4 cursor-pointer"
                            style={{
                              color: number <= rate ? "#FFC700" : "gray",
                            }}
                          ></i>
                        </Fragment>
                      );
                    })}
                  </span>
                </div>
                <div className="col-6 d-flex">
                  <span className="text-primary d-inline-block mx-3">
                    {" "}
                    {intl.formatMessage({
                      id: "Note",
                    })}
                  </span>
                  :
                  <span
                    className="d-inline-block mx-3"
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      maxWidth: "100%",
                      width: "350px",
                      display: "inline-block",
                    }}
                  >
                    {requesterNote
                      ? requesterNote
                      : intl.formatMessage({ id: "NoComment" })}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="w-100  border-radius-20px">
            <div
              className="nav row w-75 mx-auto nav-pills mb-7 border-radius-20px  background-pills d-flex justify-content-start justify-content-lg-evenly"
              id="pills-tab"
              role="tablist"
              style={{
                backgroundColor: theme === "dark" ? "light" : "#F5F8FA",
              }}
            >
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
              >
                <button
                  className={`nav-link w-100 m-1 fs-5 fw-bolder  ${
                    activeOptions ? "active" : "text-dark"
                  }`}
                  id="options-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#options"
                  type="button"
                  role="tab"
                  aria-controls="options"
                  aria-selected="true"
                  onClick={() => {
                    activeOptionsHandler();
                  }}
                  style={{
                    color:
                      theme === "dark"
                        ? activeOptions
                          ? "#fff"
                          : "#ccc"
                        : activeOptions
                        ? "#fff"
                        : "black",
                    backgroundColor: activeOptions
                      ? theme === "dark"
                        ? "#444"
                        : "rgb(0, 158, 247)"
                      : theme === "dark"
                      ? "transparent"
                      : "",
                    borderRadius: `${activeOptions ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "TicketDetails" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2  navTabsPills"
                role="presentation"
                // style={{ width: "25%" }}
              >
                <button
                  className={`nav-link w-100 m-1 fs-5 fw-bolder   ${
                    activeNotes ? "active" : "text-dark"
                  }`}
                  id="notes-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#notes"
                  type="button"
                  role="tab"
                  aria-controls="options"
                  aria-selected="false"
                  onClick={() => {
                    activeNotesHandler();
                  }}
                  style={{
                    color:
                      theme === "dark"
                        ? activeNotes
                          ? "#fff"
                          : "#ccc"
                        : activeNotes
                        ? "#fff"
                        : "black",
                    backgroundColor: activeNotes
                      ? theme === "dark"
                        ? "#444"
                        : "rgb(0, 158, 247)"
                      : theme === "dark"
                      ? "transparent"
                      : "",
                    borderRadius: `${activeNotes ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "ContactTheApplicant" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                // style={{ width: "20%" }}
              >
                <button
                  className={`nav-link w-100 fs-5 m-1 fw-bolder ${
                    activeTrack ? "active" : "text-dark"
                  }`}
                  id="track-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#track"
                  type="button"
                  role="tab"
                  aria-controls="track"
                  aria-selected="false"
                  onClick={() => {
                    activeTrackHandler();
                    dispatch(getAllReportStatusByReportId(reportId) as any);
                  }}
                  style={{
                    color:
                      theme === "dark"
                        ? activeTrack
                          ? "#fff"
                          : "#ccc"
                        : activeTrack
                        ? "#fff"
                        : "black",
                    backgroundColor: activeTrack
                      ? theme === "dark"
                        ? "#444"
                        : "rgb(0, 158, 247)"
                      : theme === "dark"
                      ? "transparent"
                      : "",
                    borderRadius: `${activeTrack ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "TicketStatusTracking" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                // style={{ width: "20%" }}
              >
                <button
                  className={`nav-link w-100 m-1 fs-5 fw-bolder ${
                    activeSteps ? "active" : "text-dark"
                  }`}
                  id="steps-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#steps"
                  type="button"
                  role="tab"
                  aria-controls="pills-ideas"
                  aria-selected="false"
                  onClick={() => {
                    activeStepsHandler();
                  }}
                  style={{
                    color:
                      theme === "dark"
                        ? activeSteps
                          ? "#fff"
                          : "#ccc"
                        : activeSteps
                        ? "#fff"
                        : "black",
                    backgroundColor: activeSteps
                      ? theme === "dark"
                        ? "#444"
                        : "rgb(0, 158, 247)"
                      : theme === "dark"
                      ? "transparent"
                      : "",
                    borderRadius: `${activeSteps ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "TicketSteps" })}{" "}
                </button>
              </div>
            </div>

            <div className="tab-content px-2" id="pills-tabContent">
              {activeOptions ? (
                <OptionsTab
                  reportId={reportId}
                  categoryName={report?.categoryName}
                  technetionId={report?.technetionId}
                  mainclassificationId={report?.mainClassificationId}
                  attachments={report?.reportAttachments}
                  requesterForm={report?.requesterForm}
                  reportAttachments={report?.reportAttachments}
                  operationStatus={report?.operationStatus}
                  creatorId={report?.creator}
                  creatorEmail={report?.creatorEmail}
                  itemId={report?.itemId}
                  requestDate={report?.lastUpdate}
                  requestName={report?.reportTitle}
                  requestType={report?.categoryName}
                  requestId={report?.requestInstanceId}
                />
              ) : (
                ""
              )}
              {activeNotes ? (
                <NotesTab
                  reportId={reportId}
                  creatorId={report?.creator}
                  creatorEmail={report?.creatorEmail}
                  requestDetails={report}
                />
              ) : (
                ""
              )}
              {activeSteps ? <StepsTab reportId={reportId} /> : ""}
              {activeTrack ? (
                <TrackTab
                  requestId={report?.requestInstanceId}
                  technetionId={report?.technetionId}
                  reportId={reportId}
                  creatorId={report?.creator}
                  creatorName={report?.creatorName}
                  creatorEmail={report?.creatorEmail}
                  technicianName={report?.technicianName}
                  technicianEmail={report?.technicianEmail}
                  requestDetails={report}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default TechnicalSupportEmployeeDetails;
