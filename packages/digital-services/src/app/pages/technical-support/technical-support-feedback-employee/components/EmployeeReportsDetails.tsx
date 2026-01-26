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
import MyOptionsTab from "./MyOptionsTab";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";

interface putRequset {
  technetionId: string;
  reportId: string;
}

function EmployeeReportsDetails() {
  let intl = useIntl();
  let [activeOptions, setOptionsNotes] = useState(true);
  let [activeNotes, setActiveNotes] = useState(false);
  let [activeTrack, setActiveTrack] = useState(false);
  let [activeSteps, setActiveSteps] = useState(false);

  let setActiveHandler = (
    options: boolean,
    notes: boolean,
    track: boolean,
    steps: boolean
  ) => {
    setOptionsNotes(options);
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
    dispatch(fetchGetReportById(reportId) as any);
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
            `/digialservicesmanagement/technical-support-feedbacks-administration-employee/${reportId}/details`,
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
  return (
    <Fragment>
      <div className="card mb-5 mb-xl-10 shadow pb-5">
        <div className="card-body pt-9 pb-0">
          <div className="card-header title_details_border bg-light  px-4 py-4  mb-3 w-100 d-flex align-items-center ">
            <h3 className="card-title align-items-start flex-column w-40">
              <span className="card-label fw-bolder fs-4 mb-2 ">
                {intl.formatMessage({
                  id: "ReportData",
                })}
              </span>
              <span className="mt-1 fs-6">
                {intl.formatMessage({
                  id: "CurrentReportData",
                })}
              </span>
            </h3>
            <div className="h-50 w-50 d-flex justify-content-end align-items-center">
              {report?.operationStatus == 0 ||
              report?.operationStatus == 1 ||
              report?.operationStatus == 2 ? (
                <button
                  className="btn btn-primary mx-1 text-center w-25 h-50"
                  onClick={() => {
                    SubmitReportStatusReopen();
                    dispatch(fetchGetReportById(reportId) as any);
                  }}
                >
                  {intl.formatMessage({ id: "ReportReopen" })}
                </button>
              ) : (
                <button
                  disabled={
                    report?.operationStatus == 0 ||
                    +report?.operationStatus == 1
                      ? false
                      : true
                  }
                  className="btn disable btn-primary mx-1 text-center w-25 h-50"
                >
                  {intl.formatMessage({ id: "ReportReopen" })}
                </button>
              )}
              {report?.operationStatus == 3 ||
              report?.operationStatus == 4 ||
              report?.operationStatus == 5 ||
              report?.operationStatus == 6 ||
              report?.operationStatus == 7 ||
              report?.operationStatus == 8 ||
              report?.operationStatus == 9 ||
              report?.operationStatus == 11 ||
              report?.operationStatus == -1 ||
              report?.operationStatus == 10 ? (
                <button
                  className="btn btn-primary mx-1 text-center w-25 h-50"
                  onClick={() => {
                    SubmitReportStatusClosed();
                    dispatch(fetchGetReportById(reportId) as any);
                  }}
                >
                  {intl.formatMessage({ id: "ReportClose" })}
                </button>
              ) : (
                <button
                  className="btn disable btn-primary mx-1 text-center w-25 h-50"
                  disabled
                >
                  {intl.formatMessage({ id: "ReportClose" })}
                </button>
              )}
            </div>
          </div>
          <div className="card shadow p-7 mb-8">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="w-200px d-flex justify-content-start align-items-center">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Requester",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {report?.creatorName}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "ReportNumber",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {" "}
                  {report?.reportNumber}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center">
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
              <div className="w-200px d-flex justify-content-start align-items-center">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Type2",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {report?.categoryName}
                </span>
              </div>
              <div className="w-200px d-flex justify-content-start align-items-center">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Category",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {report?.mainClassificationName}
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="w-200px">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Priority",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {report?.priorityLevel == 1
                    ? "مرتفع"
                    : report?.priorityLevel == 2
                    ? "متوسط"
                    : report?.priorityLevel == 3
                    ? "منخفض"
                    : ""}
                </span>
              </div>
              <div className="w-200px">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Status",
                  })}
                </span>
                :
                <span
                  className={`d-inline-block mx-3 badgex badge-light-${
                    report?.operationStatus == 0
                      ? "success"
                      : report?.operationStatus == 1
                      ? "danger"
                      : report?.operationStatus == 2
                      ? "dark"
                      : report?.operationStatus == 3
                      ? "primary"
                      : report?.operationStatus == 4
                      ? "dark"
                      : report?.operationStatus == 5
                      ? "dark"
                      : report?.operationStatus == 6
                      ? "dark"
                      : report?.operationStatus == 7
                      ? "dark"
                      : report?.operationStatus == 13
                      ? "primary"
                      : report?.operationStatus == 8
                      ? "warning"
                      : "primary"
                  }`}
                >
                  {" "}
                  {report?.operationStatus == 0
                    ? "مكتمله"
                    : report?.operationStatus == 1
                    ? "مرفوضه"
                    : report?.operationStatus == 2
                    ? "مغلقه"
                    : report?.operationStatus == 3
                    ? "مؤجله"
                    : report?.operationStatus == 4
                    ? "محوله"
                    : report?.operationStatus == 5
                    ? "مستلمه"
                    : report?.operationStatus == 6
                    ? ""
                    : report?.operationStatus == 7
                    ? "متاخره"
                    : report?.operationStatus == 8
                    ? "ساريه"
                    : report?.operationStatus == 9
                    ? "مرسله"
                    : report?.operationStatus == 10
                    ? "مقبوله"
                    : report?.operationStatus == 13
                    ? "تحت الدراسة"
                    : report?.operationStatus == 11
                    ? "معاده الفتح"
                    : report?.operationStatus == -1
                    ? "غير معرفه"
                    : ""}
                </span>
              </div>
              <div className="w-200px">
                <span className="text-primary d-inline-block mx-2">
                  {" "}
                  {intl.formatMessage({
                    id: "Time",
                  })}
                </span>
                :{" "}
                <span className="d-inline-block mx-1">
                  {moment(report?.createOn).format("HH:mm")}{" "}
                </span>
              </div>
              <div className="w-200px">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "Date",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {" "}
                  {moment(report?.createOn).format("YYYY-MM-DD")}{" "}
                </span>
              </div>
              <div className="w-200px">
                <span className="text-primary d-inline-block mx-3">
                  {" "}
                  {intl.formatMessage({
                    id: "LastUpdate",
                  })}
                </span>
                :
                <span className="d-inline-block mx-3">
                  {" "}
                  {moment(report?.lastUpdate).format("YYYY-MM-DD")}{" "}
                </span>
              </div>
            </div>
          </div>
          <div className="w-100  border-radius-20px">
            <div
              className="nav row w-75 mx-auto nav-pills mb-7 border-radius-20px  background-pills d-flex justify-content-start justify-content-lg-evenly"
              id="pills-tab"
              role="tablist"
              style={{ backgroundColor: "#F5F8FA" }}
            >
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                style={{ width: "20%" }}
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
                    color: `${activeOptions ? "rgb(0, 158, 247)" : "black"}`,
                    backgroundColor: `${activeOptions ? "white" : ""}`,
                    borderRadius: `${activeOptions ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "ReportDetails" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                style={{ width: "20%" }}
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
                  aria-selected="false"
                  onClick={() => {
                    setActiveHandler(false, true, false, false);
                  }}
                  style={{
                    color: `${activeNotes ? "rgb(0, 158, 247)" : "black"}`,
                    backgroundColor: `${activeNotes ? "white" : ""}`,
                    borderRadius: `${activeNotes ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "Notes" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                style={{ width: "20%" }}
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
                    color: `${activeTrack ? "rgb(0, 158, 247)" : "black"}`,
                    backgroundColor: `${activeTrack ? "white" : ""}`,
                    borderRadius: `${activeTrack ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "ReportStatusTracking" })}{" "}
                </button>
              </div>
              <div
                className="nav-item col-12 col-lg-2 navTabsPills"
                role="presentation"
                style={{ width: "20%" }}
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
                    color: `${activeSteps ? "rgb(0, 158, 247)" : "black"}`,
                    backgroundColor: `${activeSteps ? "white" : ""}`,
                    borderRadius: `${activeSteps ? "20px" : ""}`,
                  }}
                >
                  {intl.formatMessage({ id: "ReportSteps" })}{" "}
                </button>
              </div>
            </div>

            <div className="tab-content px-2" id="pills-tabContent">
              {activeOptions ? (
                <MyOptionsTab
                  reportId={reportId}
                  categoryName={report?.categoryName}
                  technetionId={report?.technetionId}
                  mainclassificationId={report?.mainClassificationId}
                  attachments={report?.reportAttachments}
                  requesterForm={report?.requesterForm}
                  reportAttachments={report?.reportAttachments}
                />
              ) : (
                ""
              )}
              {activeNotes ? <NotesTab reportId={reportId} /> : ""}
              {activeSteps ? <StepsTab reportId={reportId} /> : ""}
              {activeTrack ? (
                <TrackTab
                  requestId={report.requestInstanceId}
                  reportId={reportId}
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

export default EmployeeReportsDetails;
