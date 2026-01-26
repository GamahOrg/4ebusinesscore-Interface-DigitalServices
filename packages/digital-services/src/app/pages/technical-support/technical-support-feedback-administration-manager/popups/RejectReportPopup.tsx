import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import {
  PutOperationReportRejected,
  fetchGetReportById,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchReportsForAdministrationManager } from "../../../../redux/features/service-operation/report/ReportsForAdministrationManagerSlice";
import { useLocation, useSearchParams } from "react-router-dom";
import { fetchReportsForTechnicalSupportManager } from "../../../../redux/features/service-operation/report/ReportsTechnicalSupportManagerSlice";
import { fetchGetReportsForTechnicalSupportEmployee } from "../../../../redux/features/service-operation/report/ReportsForTechnicalSupportEmployeeSlice";
import { fetchGetCount } from "../../../../redux/features/service-operation/report/GetCountSlice";
import { DetermineForResponse } from "../../../../models/get-report/ResponseReport";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import { RootState } from "../../../../redux/store/store";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show?: any;
  handleClose?: any;
  reportId?: string;
  optin?: string;
  technetionId?: string;
  creatorId?: string;
  creatorEmail?: string;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
  requestNumber?:any;
};
interface putRequset {
  options?: string;
  technetionId?: string;
  reason?: string;
  reportId?: string;
}
const RejectReportPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  reportId = "",
  technetionId,
  optin,
  creatorEmail = "",
  creatorId = "",
  requestDate,
  requestName,
  requestType,
  requestNumber,
}) => {
  const intl = useIntl();
  let [loading, setLoading] = useState(false);

  const showAlert = (messageAddFail: boolean, text: string) => {
    //dispatch(restMassge());

    Swal.fire({
      text: text,
      icon: messageAddFail ? "error" : "success",
      heightAuto: false,
      buttonsStyling: false,
      confirmButtonText: intl.formatMessage({ id: "Agree" }),
      customClass: {
        popup: "my-swal-popup",
        confirmButton: `btn ${messageAddFail ? "btn-danger" : "btn-primary"}`,
      },
    }).then((result) => {
      if (!messageAddFail && result.isConfirmed) {
      }
    });
  };
  let [note, setnote] = useState<string>("");
  let [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  let location = useLocation();
  let report = useSelector((state: RootState) => {
    return state?.GetReportById?.report;
  });
  const Submit = () => {
    if (!note) {
      showAlert(true, intl.formatMessage({ id: "MustEnterNotes" }));
    } else {
      let data: putRequset = {
        options: optin ?? "",
        reason: note,
        reportId: reportId,
        technetionId: technetionId,
      };
      setLoading(true);
      dispatch(
        PutOperationReportRejected({
          id: reportId,
          body: data,
        }) as any
      )
        .then((result: any) => {
          setLoading(false);
          dispatch(fetchGetReportById(reportId) as any);
          if (
            result.payload.statusEnum === 3 &&
            (result.payload.message ===
              "Operation Report updated successfully" ||
              result.payload.message === "Operation Report added successfully")
          ) {
            let actionUrl =
              report?.serviceIntegration == 11 ||
              report?.serviceIntegration == 12
                ? `/user-profile/requests/${result?.payload?.result}/details-for-outgoing`
                : (window as any)._env_?.PUBLIC_URL +
                  `/technical-support-feedbacks-administration-employee/${reportId}/details`;
            let subsystemId =
              report?.serviceIntegration == 11 ||
              report?.serviceIntegration == 12
                ? ""
                : "b3c27ec9-a9b0-441d-ac1d-2159309a3738";
            if (location.pathname.includes("available-applicants-details")) {
            } else {
              Notification.refused(
                creatorId,
                actionUrl,
                89,
                reportId,
                creatorEmail,
                true,
                Number(getWorkspaceKey()),
                requestDate || report?.createOn,
                requestName || report?.reportTitle,
                requestType || report?.serviceCatalogName,
                report?.serviceIntegration == 11 ||
                  report?.serviceIntegration == 12
                  ? ""
                  : "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
                "",
                localStorage.getItem("mainClassificationId") !== "null"
                  ? localStorage.getItem("mainClassificationId")
                  : "",
                requestNumber ||report?.reportNumber,
              );
            }

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
              dispatch(fetchGetReportById(reportId) as any);
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
              dispatch(fetchGetReportById(reportId) as any);
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
                      {intl.formatMessage({ id: "RequestRejection" })}
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
                <div className="row w-100 mb-3">
                  <div className="col-lg-12">
                    <label
                      htmlFor="reason"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "RejectReason" })}
                    </label>

                    <textarea
                      id="reason"
                      className="form-control h-150px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "RejectReason",
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
                      {loading ? (
                        <Button
                          variant="success"
                          disabled
                          className="px-15 w-100 min-w-300px"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          <span>{intl.formatMessage({ id: "Adding" })}</span>
                        </Button>
                      ) : (
                        <button
                          type="button"
                          data-bs-dismiss="modal"
                          className="btn btn-danger mx-3 text-center w-100"
                          style={{ border: "none" }}
                          onClick={() => {
                            Submit();
                          }}
                        >
                          {intl.formatMessage({ id: "Reject" })}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Modal.Footer>
            </form>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default RejectReportPopup;
