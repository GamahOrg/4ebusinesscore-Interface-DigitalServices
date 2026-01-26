import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import NotesTab from "./NotesTab";
import StepsTab from "../../technical-support-feedback-manager/components/StepsTab";
import TrackTab from "../../technical-support-feedback-manager/components/TrackTab";
import moment from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import {
  PutOperationReportStatusClosed,
  PutOperationReportStatusReopen,
  fetchGetReportById,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import OptionsTab from "./OptionsTab";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import { AddRatingPopup } from "../popups/AddRatingPopup";
import { fetchRatingsReport } from "../../../../redux/features/service-operation/report/RatingsReportSlice";
import {
  getStatusClass,
  getStatusLabel,
} from "@4eplatform/shared/functions/getTechincalSupportStatus";
import { DisplayNameOneProps } from "@4eplatform/shared/functions/displayName";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Button, Spinner } from "react-bootstrap";

interface putRequset {
  technetionId: string;
  reportId: string;
}

function TechnicalSupportAdminstrationEmployeeReportsDetails() {
  let intl = useIntl();
  let [loadingForReopen, setLoadingForReopen] = useState(false);
  let [loadingForClose, setLoadingForClose] = useState(false);
  let [activeOptions, setActiveOptions] = useState(false);
  let [activeNotes, setActiveNotes] = useState(false);
  let [activeTrack, setActiveTrack] = useState(false);
  let [activeSteps, setActiveSteps] = useState(true);
  let [rate, setRate] = useState(0);
  let [requesterNote, setRequesterNote] = useState("");

  const [showRatePopup, setShowRatePopup] = useState<boolean>(false);

  let setActiveHandler = (
    options: boolean,
    notes: boolean,
    track: boolean,
    steps: boolean
  ) => {
    setActiveOptions(options);
    setActiveNotes(notes);
    setActiveTrack(track);
    setActiveSteps(steps);
  };

  const dispatch = useDispatch();
  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });

  let reportRate = useSelector((state: RootState) => {
    return state?.RatingsReport.reports;
  });

  useEffect(() => {
    if (reportRate) {
      setRate(reportRate?.ratingsReportStatus);
      setRequesterNote(reportRate?.note);
    }
  }, [reportRate]);

  const parms = useParams();
  let reportId = `${parms.id}`;

  useEffect(() => {
    dispatch(fetchGetReportById(reportId) as any);
    dispatch(fetchRatingsReport(reportId) as any);
  }, [reportId, dispatch]);

  const SubmitReportStatusClosed = () => {
    let data: putRequset = {
      technetionId: report?.technetionId,
      reportId: reportId,
    };
    setLoadingForClose(true);
    dispatch(
      PutOperationReportStatusClosed({ id: reportId, body: data }) as any
    )
      .then((result: any) => {
        setLoadingForClose(false);
        dispatch(fetchGetReportById(reportId) as any);
        if (result.payload.statusEnum === 1) {
          Notification.closeRequest(
            report?.technetionId,
            `/digialservicesmanagement/technical-support-feedbacks-employee/${reportId}/details`,
            88,
            reportId,
            report.technicianEmail,
            true,
            Number(getWorkspaceKey()),
            report?.createOn,
            report?.reportTitle,
            report?.serviceCatalogName,
            localStorage.getItem("subSystemId") ||
              "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
            "",
            localStorage.getItem("mainClassificationId") || "",
            report?.reportNumber
          );

          showAlert(
            true,
            intl.formatMessage({ id: "ReportStatusISUpdated" }),
            intl,
            () => {}
          );
        } else {
          showAlert(false, result.payload.message, intl, () => {});
        }
      })
      .catch((err: any) => {});
  };
  const SubmitReportStatusReopen = () => {
    let data: any = {
      reportId: reportId,
    };
    setLoadingForReopen(true);
    dispatch(
      PutOperationReportStatusReopen({ id: reportId, body: data }) as any
    )
      .then((result: any) => {
        setLoadingForReopen(false);
        dispatch(fetchGetReportById(reportId) as any);
        if (result.payload.statusEnum === 3) {
          Notification.reOpenRequest(
            report.technetionId,
            `/digialservicesmanagement/technical-support-feedbacks-employee/${reportId}/details`,
            88,
            reportId,
            report.technicianEmail,
            true,
            Number(getWorkspaceKey()),
            report?.createOn,
            report?.reportTitle,
            report?.serviceCatalogName,
            localStorage.getItem("subSystemId") ||
              "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
            "",
            localStorage.getItem("mainClassificationId") !== "null"
              ? localStorage.getItem("mainClassificationId")
              : "",
            report?.reportNumber
          );
          showAlert(
            true,
            intl.formatMessage({ id: "ReportStatusISUpdated" }),
            intl,
            () => {}
          );
        } else {
          showAlert(false, result.payload.message, intl, () => {});
        }
      })
      .catch((err: any) => {});
  };
  const fullName = DisplayNameOneProps(report?.creatorName);
  let theme = localStorage.getItem("Theme");
  return (
    <Fragment>
      <div className="card mb-5 mb-xl-10 shadow pb-5">
        <div className="card-body pt-9 pb-0">
          <div className="card-header title_details_border bg-light  px-4 py-4  mb-3 w-100 d-flex align-items-md-center flex-column flex-md-row ">
            <h3 className="card-title align-items-start flex-column w-40">
              <span className="card-label fw-bolder fs-4 mb-2 ">
                {intl.formatMessage({
                  id: "TicketData",
                })}
              </span>
              <span className="mt-1 fs-6">
                {intl.formatMessage({
                  id: "CurrentTicketData",
                })}
              </span>
            </h3>
            <div className="h-50  d-flex flex-wrap  justify-content-md-end align-items-md-center flex-column flex-md-row">
              {true &&
              (report?.operationStatus === 0 ||
                report?.operationStatus === 1 ||
                report?.operationStatus === 2) ? (
                <button
                  className="btn btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                  onClick={() => {
                    setShowRatePopup(true);
                  }}
                >
                  {intl.formatMessage({ id: "AddReview" })}
                </button>
              ) : (
                ""
              )}

              {report?.technetionId !==
              "00000000-0000-0000-0000-000000000000" ? (
                <>
                  {report?.operationStatus === 0 ||
                  report?.operationStatus === 1 ||
                  report?.operationStatus === 2 ? (
                    <>
                      {loadingForReopen ? (
                        <Button
                          variant="primary"
                          disabled
                          className="px-15 w-35"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          <span>{intl.formatMessage({ id: "Editing" })}</span>
                        </Button>
                      ) : (
                        <button
                          className="btn btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                          onClick={() => {
                            SubmitReportStatusReopen();
                            dispatch(fetchGetReportById(reportId) as any);
                          }}
                        >
                          {intl.formatMessage({ id: "TicketReopen" })}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      disabled={
                        report?.operationStatus === 0 ||
                        +report?.operationStatus === 1
                          ? false
                          : true
                      }
                      className="btn disable btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                    >
                      {intl.formatMessage({ id: "TicketReopen" })}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    disabled={true}
                    className="btn disable btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                  >
                    {intl.formatMessage({ id: "TicketReopen" })}
                  </button>
                </>
              )}

              {report?.technetionId !==
              "00000000-0000-0000-0000-000000000000" ? (
                <>
                  {report?.operationStatus === 3 ||
                  report?.operationStatus === 4 ||
                  report?.operationStatus === 0 ||
                  report?.operationStatus === 1 ||
                  report?.operationStatus === 5 ||
                  report?.operationStatus === 6 ||
                  report?.operationStatus === 7 ||
                  report?.operationStatus === 8 ||
                  report?.operationStatus === 9 ||
                  report?.operationStatus === 11 ||
                  report?.operationStatus === -1 ||
                  report?.operationStatus === 10 ? (
                    <>
                      {loadingForClose ? (
                        <Button
                          variant="primary"
                          disabled
                          className="px-15 w-45"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          <span>{intl.formatMessage({ id: "Editing" })}</span>
                        </Button>
                      ) : (
                        <button
                          className="btn btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                          onClick={() => {
                            SubmitReportStatusClosed();
                            dispatch(fetchGetReportById(reportId) as any);
                          }}
                        >
                          {intl.formatMessage({ id: "TicketClose" })}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="btn disable btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                      disabled
                    >
                      {intl.formatMessage({ id: "TicketClose" })}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    className="btn disable btn-primary mx-1 my-2 my-md-0 text-center  h-50"
                    disabled
                  >
                    {intl.formatMessage({ id: "TicketClose" })}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="card shadow p-7 mb-8">
            {/* First Row */}
            <div className="row mb-5">
              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "TicketRequester",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
                    {report?.commanName ? report?.commanName : fullName}
                  </span>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "TicketNumber",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
                    {report?.reportNumber}
                  </span>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "DateAndTime",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
                    {report?.createOn !== null ? (
                      <>
                        {moment
                          .tz(report?.createOn, "UTC")
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format("YYYY-MM-DD")}
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
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "LastAction",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
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
            </div>

            {/* Second Row */}
            <div className="row mb-5">
              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "Category",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
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
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "Catalog",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
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
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "Type2",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
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
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "SubItem",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
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
            </div>

            {/* Third Row */}
            <div className="row">
              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "Address",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
                    {report?.reportTitle}
                  </span>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "Priority",
                    })}
                  </span>
                  :
                  <span className="d-inline-block ms-2">
                    {report?.priorityLevel === 1
                      ? intl.formatMessage({ id: "High" })
                      : report?.priorityLevel === 2
                      ? intl.formatMessage({ id: "Medium" })
                      : report?.priorityLevel === 3
                      ? intl.formatMessage({ id: "Low" })
                      : intl.formatMessage({ id: "Unknown" })}
                  </span>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-primary d-inline-block me-2">
                    {intl.formatMessage({
                      id: "Status",
                    })}
                  </span>
                  :
                  <span
                    className={`d-inline-block px-1 ms-2 badgex badge-light-${getStatusClass(
                      report?.operationStatus
                    )}`}
                  >
                    {getStatusLabel(report?.operationStatus, intl)}
                  </span>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-12 mb-3 mb-lg-0">
                {/* Empty column for future use or can be removed */}
              </div>
            </div>
          </div>
          {reportRate ? (
            <div className="card shadow p-7 mb-8 ">
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

          <div className="w-100 border-radius-20px">
            <div
              className="nav row w-75 mx-auto nav-pills mb-7 border-radius-20px background-pills d-flex justify-content-start justify-content-lg-evenly"
              id="pills-tab"
              role="tablist"
              style={{
                backgroundColor: theme === "dark" ? "light" : "#F5F8FA",
              }}
            >
              {/* زر ReportSteps */}
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
              >
                <button
                  className={`nav-link w-100 m-1 fs-5 fw-bolder ${
                    activeSteps ? "active" : ""
                  }`}
                  id="steps-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#steps"
                  type="button"
                  role="tab"
                  aria-controls="pills-ideas"
                  aria-selected="false"
                  onClick={() => {
                    setActiveHandler(false, false, false, true);
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
                    borderRadius: activeSteps ? "20px" : "",
                    fontWeight: activeSteps ? "bold" : "normal",
                  }}
                >
                  {intl.formatMessage({ id: "TicketSteps" })}
                </button>
              </div>

              {/* زر ReportDetails */}
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
              >
                <button
                  className={`nav-link w-100 m-1 fs-5 fw-bolder ${
                    activeOptions ? "active" : ""
                  }`}
                  id="notes-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#options"
                  type="button"
                  role="tab"
                  aria-controls="options"
                  aria-selected="true"
                  onClick={() => {
                    setActiveHandler(true, false, false, false);
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
                    borderRadius: activeOptions ? "20px" : "",
                    fontWeight: activeOptions ? "bold" : "normal",
                  }}
                >
                  {intl.formatMessage({ id: "TicketDetails" })}
                </button>
              </div>

              {/* زر ContactTheOrderingOutlet (مُشروط) */}
              {report?.technetionId !==
                "00000000-0000-0000-0000-000000000000" && (
                <div
                  className="nav-item col-12 col-lg-2 navTabsPills"
                  role="presentation"
                >
                  <button
                    className={`nav-link w-100 m-1 fs-5 fw-bolder ${
                      activeNotes ? "active" : ""
                    }`}
                    id="notes-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#notes"
                    type="button"
                    role="tab"
                    aria-controls="options"
                    aria-selected="true"
                    onClick={() => {
                      setActiveHandler(false, true, false, false);
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
                      borderRadius: activeNotes ? "20px" : "",
                      fontWeight: activeNotes ? "bold" : "normal",
                    }}
                  >
                    {intl.formatMessage({ id: "ContactTheOrderingOutlet" })}
                  </button>
                </div>
              )}

              {/* زر ReportStatusTracking */}
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
              >
                <button
                  className={`nav-link w-100 fs-5 m-1 fw-bolder ${
                    activeTrack ? "active" : ""
                  }`}
                  id="track-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#track"
                  type="button"
                  role="tab"
                  aria-controls="track"
                  aria-selected="false"
                  onClick={() => {
                    setActiveHandler(false, false, true, false);
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
                    borderRadius: activeTrack ? "20px" : "",
                    fontWeight: activeTrack ? "bold" : "normal",
                  }}
                >
                  {intl.formatMessage({ id: "TicketStatusTracking" })}
                </button>
              </div>
            </div>

            {/* المحتوى لكل تبويب */}
            <div className="tab-content px-2" id="pills-tabContent">
              {activeOptions && (
                <OptionsTab
                  reportId={reportId}
                  reportModel={report}
                  reportAttachments={report?.reportAttachments}
                  attachments={report?.reportAttachments}
                />
              )}
              {activeNotes && (
                <NotesTab
                  technetionId={report?.technetionId}
                  technetionEmail={report?.technicianEmail}
                  reportId={reportId}
                  requestDetails={report}
                />
              )}
              {activeTrack && (
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
              )}
              {activeSteps && <StepsTab reportId={reportId} />}
            </div>
          </div>
        </div>
      </div>
      <AddRatingPopup
        show={showRatePopup}
        handleClose={() => setShowRatePopup(false)}
        requestId={report?.requestInstanceId}
        technetionId={report?.technetionId}
        reportId={reportId}
        creatorId={report?.creator}
        creatorName={report?.creatorName}
        creatorEmail={report?.creatorEmail}
        technicianName={report?.technicianName}
        technicianEmail={report?.technicianEmail}
        requestDate={report?.createOn}
        requestName={report?.reportTitle}
        requestType={report?.categoryName}
        requestNumber={report?.reportNumber}
      />
    </Fragment>
  );
}

export default TechnicalSupportAdminstrationEmployeeReportsDetails;
