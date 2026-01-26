import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  PutOperationReportStatusSolved,
  fetchGetReportById,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { Notification } from "@4eplatform/shared/services/notifications";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../../redux/store/store";
import {
  validationSolvedForms,
  validationSolvedFormsSchema,
} from "../../../../validations/SolvedFormValidation";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
type PopupProps = {
  show?: any;
  handleClose?: any;
  technetionId?: string;
  reportId: string;
  creatorId?: string;
  creatorEmail?: string;
  currentReport?: any;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
  requestNumber?:any;
};

const SolveReportPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  technetionId,
  reportId,
  creatorId = "",
  creatorEmail = "",
  currentReport,
  requestDate,
  requestName,
  requestType,
  requestNumber,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  let location = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidationOn, setIsValidationOn] = useState(
    location.pathname?.includes("technical-support-feedbacks-employee") ||
      location.pathname?.includes(
        "technical-support-feedbacks-adminstration-manager"
      ) ||
      location.pathname?.includes(
        "technical-support-feedbacks-adminstration-manager"
      ) ||
      location.pathname?.includes("technical-support-feedbacks-manager") ||
      location.pathname?.includes("technical-support-feedbacks-manager")
  );
  // const [isReasonValidationOn, setIsReasonValidationOn] = useState(
  //   location.pathname?.includes(
  //     "technical-support-feedbacks-adminstration-manager"
  //   )
  // );
  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<validationSolvedForms>({
    resolver: yupResolver(validationSolvedFormsSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (show) {
      setValue("validationCheker", isValidationOn);
    }
  }, [show, isValidationOn]);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
    event.target.value = null;
  };

  const reportById = async () => {
    try {
      await dispatch(fetchGetReportById(reportId as string) as any);
    } catch (error) {
      console.error("Error fetching current report", error);
    }
  };

  const putsolveReport = async (formValues: validationSolvedForms) => {
    let formdata = new FormData();
    if (formValues?.DescriptionSolved) {
      formdata.append("DescriptionSolved", formValues.DescriptionSolved || "");
    }
    formdata.append("Reason", formValues.Reason || "");
    formdata.append("ReportId", reportId);
    formdata.append("TechnetionId", technetionId || "");
    if (selectedFile) {
      formdata.append("Attatchment", selectedFile);
    }
    try {
      const params = {
        id: reportId,
        body: formdata,
      };
      setLoading(true);
      const result = await dispatch(
        PutOperationReportStatusSolved(params) as any
      );
      if (
        result.payload.statusEnum === 1 &&
        (result.payload.message === "Operation Report updated successfully" ||
          result.payload.message === "Operation Report added successfully")
      ) {
        let actionUrl =
          report?.serviceIntegration == 11 || report?.serviceIntegration == 12
            ? `/user-profile/requests/${result?.payload?.result}/details-for-outgoing`
            : (window as any)._env_?.PUBLIC_URL +
              `/technical-support-feedbacks-administration-employee/${reportId}/details`;
        let subsystemId =
          report?.serviceIntegration == 11 || report?.serviceIntegration == 12
            ? ""
            : "b3c27ec9-a9b0-441d-ac1d-2159309a3738";
        Notification.solved(
          creatorId,
          actionUrl,
          89,
          reportId,
          creatorEmail,
          true,
          88,
          requestDate || report?.createOn,
          requestName || report?.reportTitle,
          requestType || report?.serviceCatalogName,
          subsystemId,
          "",
          "",
          requestNumber || report?.reportNumber
        );
        showAlert(true, "SavedSuccessfully", intl);
        setLoading(false);

        reportById();
        handleClose();
        currentReport();
      } else if (result.payload.message === "Request is Pending") {
        showAlert(false, "RequestIsPending", intl);
      } else if (result.payload.message === "Course Is Completed") {
        showAlert(false, "CountCompleted", intl);
      } else if (result.payload.message === "Course is already start") {
        showAlert(false, "CourseHasAlreadyStarted", intl);
      } else if (result.payload.message === "Hr already Take Action") {
        showAlert(false, "HrAlreadyTakenAction", intl);
      } else if (result.payload.message === "this Requset Not Found") {
        showAlert(false, "RequsetNotFound", intl);
      } else {
        showAlert(false, "AnErrorOccured", intl);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {}
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
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
                alignItems: intl.locale === "ar" ? "flex-start" : "flex-end",
                flexDirection: intl.locale === "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <div className="mb-9 text-center">
                    <h1 className="mb-3">
                      {intl.formatMessage({ id: "RequestCompletion" })}
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
              onSubmit={handleSubmit(putsolveReport)}
            >
              <Modal.Body>
                <div className="row w-100 mb-3">
                  <div className="col-lg-12">
                    <label
                      htmlFor="problem"
                      className={`form-label  px-2 fontSz-6 ${
                        isValidationOn ? "required" : ""
                      }`}
                    >
                      {intl.formatMessage({ id: "ReasonForClosure" })}
                    </label>

                    <textarea
                      id="problem"
                      className="form-control h-150px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "ReasonForClosure",
                      })}
                      {...register("Reason")}
                    ></textarea>
                    {DisplayErrorMessage(
                      errors?.Reason?.message,
                      intl,
                      intl.locale
                    )}
                  </div>
                </div>
                <div className="row w-100 mb-3">
                  <div className="col-lg-12">
                    <label
                      htmlFor="description"
                      className={`form-label px-2 fontSz-6`}
                    >
                      {intl.formatMessage({ id: "Description" })}
                    </label>

                    <textarea
                      id="description"
                      className="form-control h-150px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "Description",
                      })}
                      {...register("DescriptionSolved")}
                    ></textarea>
                    {DisplayErrorMessage(
                      errors?.DescriptionSolved?.message,
                      intl,
                      intl.locale
                    )}
                  </div>
                </div>
                <div className="row w-100 mb-3">
                  <div className="mb-2 pt-2 pb-3">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "Attachments" })}
                    </label>

                    <div className="w-100 d-flex bg-light-primary rounded border-primary border border-dashed mb-1 position-relative">
                      <label
                        htmlFor="outputAttachment"
                        className="w-100 form-label px-2  fontSz-6 dropzone-select  uploadFile-style inputAreaHeight"
                      >
                        <div className="row align-items-center w-100">
                          <div className="d-flex gap-4 align-items-center">
                            <img
                              alt=""
                              src={toAbsoluteUrl(
                                "/media/extensions/uploadFile.webp"
                              )}
                              className="d-inline-block h-75"
                            />
                            <div>
                              <p className="text-primary fw-bolder my-2 p-0">
                                {intl.formatMessage({
                                  id: "QuickFileUploader",
                                })}
                              </p>
                              <p className="p-0 my-1">
                                {intl.formatMessage({
                                  id: "DragAndDropOrChooseFilesFromComputer",
                                })}
                              </p>
                            </div>
                          </div>
                          {selectedFile && (
                            <>
                              <div>
                                <ul>
                                  {selectedFile && (
                                    <div className="d-flex align-items-center mx-2 position-relative w-100">
                                      <div className="d-flex -align-items-center w-95">
                                        <img
                                          alt=""
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                            borderRadius: "50%",
                                          }}
                                          src={getIconSrc(
                                            selectedFile.name,
                                            selectedFile
                                          )}
                                          className={selectedFile.name}
                                        />
                                        <div className="mx-1">
                                          {selectedFile.name}
                                        </div>
                                      </div>

                                      <div
                                        onClick={handleFileDelete}
                                        className="d-flex bg-danger close-img cursor-pointer w-30px h-30px align-items-center justify-content-center"
                                        style={{
                                          borderRadius: "50%",
                                          position: "absolute",
                                          top: "-9%",
                                          left: "0%",
                                        }}
                                      >
                                        <i className="bi bi-x fs-3 text-white"></i>
                                      </div>
                                    </div>
                                  )}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                      <div
                        className="dropzone dropzone-queue mb-2"
                        id="kt_dropzonejs_example_3"
                      >
                        <div className="dropzone-panel mb-lg-0 mb-2">
                          <input
                            type="file"
                            id="outputAttachment"
                            className="dropzone-select w-100 uploadFile-style inputAreaHeight d-none"
                            {...register("Attatchment")}
                            onChange={(e) => handleFileChange(e)}
                          />
                        </div>
                      </div>
                    </div>
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
                      {/* <button
                        type="submit"
                        data-bs-dismiss="modal"
                        className="btn btn-success mx-3 text-center w-100"
                        style={{ border: "none" }}
                      >
                        {intl.formatMessage({ id: "Send" })}
                      </button> */}
                      {!loading ? (
                        <button
                          type="submit"
                          data-bs-dismiss="modal"
                          className="btn btn-success mx-3 text-center w-100"
                          style={{ border: "none" }}
                        >
                          {intl.formatMessage({
                            id: "Send",
                          })}
                        </button>
                      ) : (
                        <Button
                          variant="success"
                          disabled
                          className="btn btn-success mx-3 text-center w-100 min-w-100"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          <span>{intl.formatMessage({ id: "Send" })}</span>
                        </Button>
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

export default SolveReportPopup;
