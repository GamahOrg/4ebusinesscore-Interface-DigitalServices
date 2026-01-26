import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import StepsTab from "../../technical-support-feedback-manager/components/StepsTab";
import TrackTab from "../../technical-support-feedback-manager/components/TrackTab";
import Swal from "sweetalert2";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import {
  PutOperationReportStatusClosed,
  PutOperationReportStatusReopen,
  fetchGetReportById,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import NotesTab from "../../technical-support-feedback-administration-employee/components/NotesTab";
import OptionsTab from "./MyOptionsTab";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import { DisplayNameOneProps } from "@4eplatform/shared/functions/displayName";
import {
  getStatusClass,
  getStatusLabel,
} from "@4eplatform/shared/functions/getTechincalSupportStatus";

interface putRequset {
  technetionId: string;
  reportId: string;
}

function ManagerReportsDetails() {
  let intl = useIntl();
  let [activeOptions, setActiveOptions] = useState(true);
  let [activeNotes, setActiveNotes] = useState(false);
  let [activeTrack, setActiveTrack] = useState(false);
  let [activeSteps, setActiveSteps] = useState(false);

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

  const parms = useParams();
  let reportId = `${parms.id}`;

  useEffect(() => {
    if (reportId) {
      dispatch(fetchGetReportById(reportId) as any);
    }
  }, [reportId]);
  const showAlert = (messageAddFail: boolean, text: string) => {
    Swal.fire({
      text: intl.formatMessage({
        id: messageAddFail ? text : "SavedSuccessfully",
      }),
      icon: messageAddFail ? "error" : "success",
      heightAuto: false,
      buttonsStyling: false,
      confirmButtonText: intl.formatMessage({ id: "Agree" }),
      customClass: {
        confirmButton: `btn ${messageAddFail ? "btn-danger" : "btn-primary"}`,
      },
    }).then((result) => {
      if (!messageAddFail && result.isConfirmed) {
      }
    });
  };
  const SubmitReportStatusClosed = () => {
    let data: putRequset = {
      technetionId: report?.technetionId,
      reportId: reportId,
    };
    dispatch(
      PutOperationReportStatusClosed({ id: reportId, body: data }) as any
    )
      .then((result: any) => {
        dispatch(fetchGetReportById(reportId) as any);
        if (result.payload.statusEnum === 1) {
          Notification.closeRequest(
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
            "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
            "",
            localStorage.getItem("mainClassificationId") || "",
            report?.reportNumber
          );
          showAlert(false, result.payload.message);
        } else {
          showAlert(true, result.payload.message);
        }
      })
      .catch((err: any) => {});
  };
  const SubmitReportStatusReopen = () => {
    let data: any = {
      reportId: reportId,
    };

    dispatch(
      PutOperationReportStatusReopen({ id: reportId, body: data }) as any
    )
      .then((result: any) => {
        dispatch(fetchGetReportById(reportId) as any);
        if (result.payload.statusEnum === 3) {
          Notification.reOpenRequest(
            report.technetionId,
            (window as any)._env_?.PUBLIC_URL +
              `/technical-support-feedbacks-administration-employee/${reportId}/details`,
            88,
            reportId,
            report.technicianEmail,
            true,
            Number(getWorkspaceKey()),
            report?.createOn,
            report?.reportTitle,
            report?.serviceCatalogName,
            "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
            "",
            localStorage.getItem("mainClassificationId") !== "null"
              ? localStorage.getItem("mainClassificationId")
              : "",
            report?.reportNumber
          );
          showAlert(false, result.payload.message);
        } else {
          showAlert(true, result.payload.message);
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
          <div className="card-header title_details_border bg-light  px-4 py-4  mb-3 w-100 d-flex align-items-center ">
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
          </div>
          <div className="card shadow p-7 mb-8">
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
              <div className="w-200px d-flex justify-content-start align-items-center my-3 my-md-0">
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
              <div className="w-200px d-flex justify-content-start align-items-center my-3 my-md-0">
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
              <div className="w-200px d-flex gap-1 justify-content-start align-items-center my-3 my-md-0">
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
              <div className="w-200px my-3 my-md-0">
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
              <div className="w-200px d-flex justify-content-start align-items-center my-3 my-md-0">
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

              <div className="w-200px my-3 my-md-0">
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
                  className={`d-inline-block mx-3 badgex badge-light-${getStatusClass(
                    report?.operationStatus
                  )}}`}
                >
                  {" "}
                  {getStatusLabel(report?.operationStatus, intl)}
                </span>
              </div>
              <div className="w-200px my-3 my-md-0">
                {/* <span className="text-primary d-inline-block mx-2">
                  {" "}
                  {intl.formatMessage({
                    id: "Time",
                  })}
                </span>
                :{" "}
                <span className="d-inline-block mx-1">
                  {moment(report?.createOn).format("HH:mm")}{" "}
                </span> */}
              </div>
            </div>
          </div>
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
                // style={{ width: "20%" }}
              >
                <button
                  className={`nav-link w-100 m-1 fs-5 fw-bolder  ${
                    activeOptions ? "active" : ""
                  }`}
                  id="options-tab"
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
                    borderRadius: `${activeOptions ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "TicketDetails" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                // style={{ width: "20%" }}
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
                  className={`nav-link w-100 m-1 fs-5 fw-bolder  ${
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
                    borderRadius: `${activeNotes ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "Notes" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2  navTabsPills"
                role="presentation"
                // style={{ width: "20%" }}
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
                  reportModel={report}
                  reportId={reportId}
                  categoryName={report?.categoryName}
                  technetionId={report?.technetionId}
                  mainclassificationId={report?.mainClassificationId}
                  attachments={report?.reportAttachments}
                  dynamicForm={report?.requesterForm}
                  reportAttachments={report?.reportAttachments}
                  itemId={report?.itemId}
                />
              ) : (
                ""
              )}
              {activeNotes ? (
                <NotesTab reportId={reportId} HidePostNotes={true} />
              ) : (
                ""
              )}
              {activeSteps ? <StepsTab reportId={reportId} /> : ""}
              {activeTrack ? (
                <TrackTab
                  requestId={report?.requestInstanceId}
                  reportId={reportId}
                  technetionId={report?.technetionId}
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

export default ManagerReportsDetails;
