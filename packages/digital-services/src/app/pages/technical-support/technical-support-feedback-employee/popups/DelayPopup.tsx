import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { PutOperationReportStatusDelay } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchReportsForTechnicalSupportManager } from "../../../../redux/features/service-operation/report/ReportsTechnicalSupportManagerSlice";
import { fetchReportsForAdministrationManager } from "../../../../redux/features/service-operation/report/ReportsForAdministrationManagerSlice";
import { fetchGetReportsForTechnicalSupportEmployee } from "../../../../redux/features/service-operation/report/ReportsForTechnicalSupportEmployeeSlice";
import { fetchGetCount } from "../../../../redux/features/service-operation/report/GetCountSlice";
import { DetermineForResponse } from "../../../../models/get-report/ResponseReport";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
type PopupProps = {
  show?: any;
  handleClose?: any;
  reportId: string;
  technetionId: string;
  creatorId: string;
  creatorEmail: string;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
  requestNumber?:any;
};
interface putRequset {
  technetionId: string;
  reason: string;
  reportId: string;
  day: number;
  hour: number;
  munite: number;
}
const DelayPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  reportId,
  technetionId,
  creatorId = "",
  creatorEmail = "",
  requestDate,
  requestName,
  requestType,
  requestNumber,
}) => {
  const intl = useIntl();

  const showAlert = (messageAddFail: boolean, text: string) => {
    Swal.fire({
      text: text,
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
  let [note, setnote] = useState<string>("");
  let [searchParams, setSearchParams] = useSearchParams();

  let [day, setday] = useState<number>(0);

  let [hour, sethour] = useState<number>(0);

  let [munite, setmunite] = useState<number>(0);
  let location = useLocation();

  const dispatch = useDispatch();
  const Submit = () => {
    if (!note) {
      showAlert(true, intl.formatMessage({ id: "MustEnterNotes" }));
    } else {
      let data: putRequset = {
        reason: note,
        reportId: reportId,
        technetionId: technetionId,
        munite: munite,
        hour: hour,
        day: day,
      };
      dispatch(
        PutOperationReportStatusDelay({
          id: reportId,
          body: data,
        }) as any
      )
        .then((result: any) => {
          if (
            result.payload.statusEnum === 3 &&
            (result.payload.message ===
              "Operation Report updated successfully" ||
              result.payload.message === "Operation Report added successfully")
          ) {
            Notification.delayed(
              creatorId,
              (window as any)._env_?.PUBLIC_URL +
                `/technical-support-feedbacks-administration-employee/${reportId}/details`,
              88,
              reportId,
              creatorEmail,
              true,
              Number(getWorkspaceKey()),
              requestDate,
              requestName,
              requestType,
              "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
              "",
              "",
              requestNumber,
            );
            showAlert(false, intl.formatMessage({ id: "SavedSuccessfully" }));
            handleClose();
            if (searchParams.get("tabName") === "reports") {
              const prams = {
                pageSize: searchParams.get("pageSize") || "10",
                pageNumber: searchParams.get("pageNumber") || "1",
                statisticsReport: searchParams.get("statisticsReport") || "6",
              };

              const countPrams = {
                DetermineForResponse:
                  DetermineForResponse.GetReportsForTechnicalSupportManager,
              };
              dispatch(fetchReportsForTechnicalSupportManager(prams) as any);
              dispatch(fetchGetCount(countPrams) as any);
            } else if (
              searchParams.get("tabName") === "adminstration-reports"
            ) {
              const prams = {
                pageSize: searchParams.get("pageSize") || "10",
                pageNumber: searchParams.get("pageNumber") || "1",
                statisticsReport: searchParams.get("statisticsReport") || "6",
              };

              const countPrams = {
                DetermineForResponse:
                  DetermineForResponse.GetReportsForAdministrationManager,
              };
              dispatch(fetchReportsForAdministrationManager(prams) as any);
              dispatch(fetchGetCount(countPrams) as any);
            } else if (searchParams.get("tabName") === "received-reports") {
              const prams = {
                pageSize: searchParams.get("pageSize") || "10",
                pageNumber: searchParams.get("pageNumber") || "1",
                statisticsReport: searchParams.get("statisticsReport"),
              };
              const prams2 = {
                DetermineForResponse:
                  DetermineForResponse.GetReportsForTechnicalSupportEmployee,
              };
              dispatch(
                fetchGetReportsForTechnicalSupportEmployee(prams) as any
              );
              dispatch(fetchGetCount(prams2) as any);
            }
          } else {
            showAlert(true, intl.formatMessage({ id: "AnErrorOccured" }));
          }
        })
        .catch((err: any) => {});
    }
  };
  return (
    <Fragment>
      <div className="modal-body scroll-y mx-5 mx-xl-18 pt-0 pb-15 mb-7">
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <div className="card">
            <Modal.Header
              closeButton
              style={{
                alignItems: intl.locale == "ar" ? "flex-start" : "center",
                flexDirection: intl.locale == "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <div className="mb-9 text-center">
                    <h1 className="mb-3">
                      {intl.formatMessage({ id: "ReportDelay" })}
                    </h1>
                    <h6 className="mb-2 text-muted">
                      {intl.formatMessage({
                        id: "PleaseEnterTheFollowingData",
                      })}
                    </h6>
                  </div>
                </Modal.Title>
              </div>
            </Modal.Header>
            <form
              className="d-block w-100"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Modal.Body>
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="form-label px-2 fontSz-6"
                  >
                    {intl.formatMessage({ id: "PostponementPeriod" })}
                  </label>
                  <div className="d-flex justify-content-between w-40 mb-4 mt-3">
                    <div className="d-flex align-items-center ">
                      <input
                        type="text"
                        value={day}
                        className="me-3 form-control form-control-solid text-center"
                        style={{ width: "50px" }}
                        onChange={(e) => {
                          setday(parseInt(e.target.value));
                        }}
                      />
                      <span className="d-inline-block ms-2 me-3">
                        {intl.formatMessage({
                          id: "Days",
                        })}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mx-3">
                      <input
                        type="text"
                        value={hour}
                        className="form-control mx-4 form-control-solid text-center"
                        style={{ width: "50px" }}
                        onChange={(e) => {
                          sethour(parseInt(e.target.value));
                        }}
                      />
                      <span className="d-inline-block ms-2 me-3">
                        {intl.formatMessage({
                          id: "Hours",
                        })}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mx-3">
                      <input
                        type="text"
                        value={munite}
                        className="form-control form-control-solid text-center mx-2"
                        style={{ width: "50px" }}
                        onChange={(e) => {
                          setmunite(parseInt(e.target.value));
                        }}
                      />
                      <span className="d-inline-block ms-2 me-4">
                        {intl.formatMessage({
                          id: "Minutes",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row w-100 mb-3 mt-4">
                  <div className="col-lg-12">
                    <label
                      htmlFor="reason"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "DelayReason" })}
                    </label>

                    <textarea
                      id="reason"
                      className="form-control h-150px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "DelayReason",
                      })}
                      onChange={(e) => {
                        setnote(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center py-2">
                <div className="mt-5 mb-5 col-12 col-lg-8 mx-auto">
                  <div className="outputCard card-diff-toolbar pt-5 w-100 mt-3 d-flex justify-content-center">
                    <div className="d-flex justify-content-center align-items-center w-50">
                      <div
                        onClick={handleClose}
                        className="btn btn-secondary mx-3 text-center w-100"
                      >
                        {intl.formatMessage({ id: "Cancel" })}
                      </div>
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        className="btn btn-success mx-3 text-center w-100"
                        style={{ border: "none" }}
                        onClick={() => {
                          Submit();
                        }}
                      >
                        {intl.formatMessage({ id: "Send" })}
                      </button>
                    </div>
                  </div>
                </div>{" "}
              </Modal.Footer>
            </form>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default DelayPopup;
