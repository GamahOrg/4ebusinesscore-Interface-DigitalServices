import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Row } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postRequestTransaction } from "../../../../redux/features/requests-slice/addRequestTransactionSlice";
import { useNavigate } from "react-router-dom";
import { Notification } from "@4eplatform/shared/services/notifications";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { useLocation, useParams } from "react-router";
import { RejectRequestSchema } from "../../../../validations/reject-request-validation";
import {
  getIncomingRequestsById
} from "../../../../redux/features/requests-slice/requests-slice";
import { fetchRequestTimeline } from "../../../../redux/features/requests-slice/request-timeline-slice";
import { RootState } from "../../../../redux/store/store";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show: boolean;
  handleClose: any;
  id?: number;
  requestTimeline?: any;
  incomingRequestDetails?: any;
  tabName?: string;
  pageIndex?: number;
  pageSize?: number;
};

export const RejectPopup: FC<PopupProps> = ({
  show,
  handleClose,
  id,
  tabName,
  pageIndex,
  pageSize,
}) => {
  const intl = useIntl();
  const location = useLocation();

  let language: string = intl.locale;
  const { id: requestInstanceId } = useParams();
  let [loading, setLoading] = useState(false);

  const [selectedFileForAttachment, setSelectedFileForAttachment] =
    useState<any>();
  let dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    if (id && show) {
      dispatch(fetchRequestTimeline({ id: id }) as any);
      dispatch(getIncomingRequestsById(id) as any);
    }
  }, [id, show]);

  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });

  const incomingRequestDetails = useSelector((state: RootState) => {
    return state?.requests?.incomingRequest;
  });

  let handleRejectRequest = (formData: any) => {
    let data = {
      comment: formData?.comment,
      action: 2,
      requestInstanceId: id || requestInstanceId,
      affectedSteps: [],
      attachments: selectedFileForAttachment,
    };
    setLoading(true);
    dispatch(postRequestTransaction(data) as any).then((res: any) => {
      setLoading(false);
      if (res?.payload?.statusEnum == 1) {
         if (
          location.pathname ==
          "/approvals-requests"
        ) {
          window.dispatchEvent(new Event("requestStatusIsChanged"))
        }
        const actionUrl = location.pathname.includes("details-for-incoming")
          ? `/user-profile/requests/${incomingRequestDetails?.id}/details-for-incoming`
          : `/user-profile/requests/${incomingRequestDetails?.id}/details-for-outgoing`;
        const reportid = incomingRequestDetails?.id;
        const receiverId = incomingRequestDetails?.createBy;
        const receiverEmail = incomingRequestDetails?.email;
        const requestDate = incomingRequestDetails?.date;
        const requestName = incomingRequestDetails?.name;
        const requestType = incomingRequestDetails?.requestCategoryName;
         const requestNumber =incomingRequestDetails?.requestNumber;
        Notification.rejectedRequest(
          receiverId,
          actionUrl,
          89,
          reportid,
          receiverEmail,
          true,
          26,
          requestDate,
          requestName,
          requestType,
          "",
          "",
          "",
          requestNumber,
        );
        showAlert(true, "TheRequestWasSuccessfullyRejected", intl, () => {});
        handleClose();
        if (location.pathname.includes("details-for-incoming")) {
          navigate("/user-profile/requests?tabName=incomingrequests");
        } else if (tabName === "incoming") {
        } else navigate("/user-profile/requests?tabName=outgoingrequests");
      window.dispatchEvent(new Event("incomingRequestIsDeleted"))
      } else if (
        res?.payload?.message == "Must Assgin ActionTaker Take Action"
      ) {
        handleClose();
        showAlert(false, "MustAssginActionTakerTakeAction", intl, () => {});
        return;
      } else if (res?.payload?.message == "The Current User Not Authorized") {
        handleClose();
        showAlert(
          false,
          "UserDoesn'tHaveAbilityToTakeActionForThisStep",
          intl,
          () => {}
        );
        return;
      } else if (
        res?.payload?.message == "This Request Instance Reached Final Step"
      ) {
        handleClose();
        showAlert(false, "ThisRequestInstanceReachedFinalStep", intl, () => {});
        return;
      } else if (res?.payload?.message == "must Enter AssginRequestInstance") {
        handleClose();
        showAlert(false, "MustEnterAssginRequestInstance", intl, () => {});

        return;
      } else if (res?.payload?.message == "no assginRequestTemplateStep") {
        handleClose();
        showAlert(false, "NoAssginRequestTemplateStep", intl, () => {});

        return;
      } else if (res?.payload?.message == "Comment Must Not Empty") {
        handleClose();
        showAlert(false, "CommentMustNotEmpty", intl, () => {});

        return;
      } else {
        handleClose();
        showAlert(false, "AnErrorOccured", intl, () => {});
      }
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RejectRequestSchema>({
    resolver: yupResolver(RejectRequestSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFileForAttachment(file);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{
            alignItems: intl.locale == "ar" ? "flex-start" : "center",
            flexDirection: intl.locale == "en" ? "column-reverse" : "row",
          }}
          className="pb-0 border-bottom-0"
        >
          <div className="card-header mt-10 d-flex justify-content-center w-100 px-4 border-bottom-0">
            <Row className="justify-content-center mt-5 mb-5">
              <Modal.Title id="contained-modal-title-vcenter">
                <div className="text-center">
                  <h3> {intl.formatMessage({ id: "ConfirmRejection" })}</h3>
                </div>
              </Modal.Title>
            </Row>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(handleRejectRequest)}>
          <Modal.Body className="pb-0">
            <Row className="justify-content-center mb-5">
              <div className="text-center">
                <h5>
                  {intl.formatMessage({
                    id: "AreYouSureToRejectTheRequest",
                  })}
                </h5>
              </div>
              <div className="col-lg-12 mb-2 pt-2">
                <label
                  htmlFor="RejectReason"
                  className="form-label px-2 fontSz-6 required"
                >
                  {intl.formatMessage({ id: "RejectReason" })}
                </label>
                <textarea
                  rows={4}
                  id="RejectReason"
                  {...register("comment")}
                  className="form-control form-control-lg form-control-solid mb-3 mb-lg-2"
                  placeholder={intl.formatMessage({ id: "RejectReason" })}
                ></textarea>
                {DisplayErrorMessage(
                  errors?.comment?.message as string,
                  intl,
                  language
                )}
              </div>
              <div className="col-lg-12 mb-2 pt-2">
                <div className="col-lg-12 mb-2 pt-2 pb-3">
                  <label className="form-label px-2  fontSz-6">
                    {intl.formatMessage({ id: "ATTACHMENTS" })}
                  </label>
                  <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-5 h-80px">
                    <label
                      htmlFor="outputAttachment1"
                      style={{ overflow: "hidden" }}
                      className="form-label  dropzone-select  uploadFile-style inputAreaHeight position-relative"
                    >
                      {selectedFileForAttachment && (
                        <div
                          style={{
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            height: "25px",
                            width: "25px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                            display: "flex",
                            color: "black",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 999,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedFileForAttachment(null);
                          }}
                        >
                          <i className="fas fa-times fs-4"></i>
                        </div>
                      )}
                      <div role="button" className="d-flex align-items-center">
                        {selectedFileForAttachment ? (
                          <>
                            <div>
                              <ul className="d-flex align-items-center">
                                <li className="d-flex align-items-center mx-1 position-relative">
                                  <img
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                    }}
                                    alt={selectedFileForAttachment?.name}
                                    src={getIconSrc(
                                      selectedFileForAttachment?.name,
                                      selectedFileForAttachment,
                                      ""
                                    )}
                                    className={selectedFileForAttachment?.name}
                                  />
                                  <div className="mx-1">
                                    {selectedFileForAttachment?.name}
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              style={{
                                width: "40px",
                                display: "inline-block",
                                marginLeft: "5px",
                              }}
                              src={toAbsoluteUrl(
                                "/media/extensions/uploadFile.webp"
                              )}
                              className="img-fluid"
                            />
                            <div
                              className="row py-auto"
                              style={{ position: "relative", top: "-7px" }}
                            >
                              <span className="text-primary fw-bolder">
                                {intl.formatMessage({
                                  id: "QuickFileUploader",
                                })}
                              </span>
                              <span>
                                {" "}
                                {intl.formatMessage({
                                  id: "DragAndDropOrChooseFilesFromComputer",
                                })}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                    <div
                      className="dropzone dropzone-queue "
                      id="kt_dropzonejs_example_3"
                    >
                      <div className="dropzone-panel">
                        <input
                          type="file"
                          id="outputAttachment1"
                          name="attachments1"
                          onChange={(e) => {
                            handleFileInputChange(e);
                            e.target.value = "";
                          }}
                          placeholder={intl.formatMessage({ id: "FileUpload" })}
                          className="dropzone-select  uploadFile-style inputAreaHeight d-none w-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </Modal.Body>

          <div className="row">
            <div className="col-12 col-lg-7 mx-auto mb-12">
              <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                <Modal.Footer className="w-100 justify-content-center pb-0 pt-2 border-top-0">
                  <div className="d-flex justify-content-center align-items-center w-100">
                    <button
                      type="reset"
                      className="btn btn-secondary me-3 w-100"
                      onClick={handleClose}
                    >
                      {intl.formatMessage({ id: "Cancel" })}
                    </button>

                    {loading ? (
                      <Button variant="success" disabled className="px-15 w-75">
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
                        type="submit"
                        className="  btn btn-danger me-5 w-100 "
                      >
                        <span className="indicator-label">
                          {intl.formatMessage({ id: "Reject" })}
                        </span>
                        <span className="indicator-progress">
                          {intl.formatMessage({ id: "Reject" })}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>{" "}
                        </span>
                      </button>
                    )}
                  </div>
                </Modal.Footer>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
