import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Notification } from "@4eplatform/shared/services/notifications";
import { AcceptRequestSchema } from "../../../../validations/accept-request-validation";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { postRequestTransaction } from "../../../../redux/features/requests-slice/addRequestTransactionSlice";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { RootState } from "../../../../redux/store/store";
import { fetchRequestTimeline } from "../../../../redux/features/requestTemplate/request-timeline-slice";
import { getIncomingRequestsById } from "../../../../redux/features/requests-slice/requests-slice";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show: boolean;
  handleClose: any;
  id: string;
  pageIndex?: any;
  pageSize?: any;
  callingAllRequests?: any;
};
export const AcceptPopupForApprovals: FC<PopupProps> = ({
  show,
  handleClose,
  id,
  pageIndex,
  pageSize,
  callingAllRequests,
}) => {
  const intl = useIntl();
  let { systemId, id: requestInstanceId } = useParams();
  const location = useLocation();
  let [loading, setLoading] = useState(false);

  let cardName = location?.state?.cardTitle;
  const [selectedFileForAttachment, setSelectedFileForAttachment] =
    useState<any>();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let loggedInUserId = localStorage.getItem("userId") as string;

  const MAX_FILE_SIZE = 15 * 1024 * 1024;

  const validateFile = (file: any): boolean => {
    if (!file) return true;

    if (file.size > MAX_FILE_SIZE) {
      showAlert(false, "YouHaveExceeded15MB", intl, () => {});
      return false;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];

    const allowedExtensions = [
      '.doc', '.docx',
      '.ppt', '.pptx',
      '.xls', '.xlsx',
      '.pdf',
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'
    ];

    const fileType = file.type;
    const fileName = file.name || '';
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (
      !allowedTypes.includes(fileType) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      showAlert(false, intl.formatMessage({ id: "AttachmentMsgErrType" }), intl, () => {});
      return false;
    }

    return true;
  };

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

  let handleAcceptRequest = (fromData: any) => {
    if (selectedFileForAttachment && !validateFile(selectedFileForAttachment)) {
      return;
    }

    let data = {
      comment: fromData?.comment,
      action: 1,
      requestInstanceId: id || requestInstanceId,
      affectedSteps: [],
      attachments: selectedFileForAttachment,
    };
    setLoading(true);
    dispatch(postRequestTransaction(data) as any).then((res: any) => {
      setLoading(false);
      if (res?.payload?.statusEnum == 1) {
        const actionUrlForIncomingForApprove = `/user-profile/requests/${incomingRequestDetails?.id}/details-for-incoming`;
        const actionUrlForOutgoing = `/user-profile/requests/${incomingRequestDetails?.id}/details-for-outgoing`;
        let approveUrl = actionUrlForIncomingForApprove;
        const reportid = incomingRequestDetails?.id;
        const receiverId = incomingRequestDetails?.createBy;
        const receiverEmail = incomingRequestDetails?.email;
        const requestDate = incomingRequestDetails?.date;
        const requestName = incomingRequestDetails?.name;
        const requestType = incomingRequestDetails?.requestCategoryName;
         const requestNumber =incomingRequestDetails?.requestNumber;

        let currentRequestTimeLineIndex = requestTimeline?.requestTimeLine
          ?.filter((ele: any) => {
            return (
              !ele?.exceptionActionTackersDto
                ?.map((user: any) => {
                  return user?.userId?.toLowerCase();
                })
                ?.includes(ele?.actionTakerUserId?.toLowerCase()) &&
              ele?.actionOptions == null
            );
          })
          ?.findIndex((item: any) => {
            return (
              item?.stepId?.toLowerCase() ==
              requestTimeline?.currentStepId?.toLowerCase()
            );
          });
        const approvalAcceptRequesterEmail =
          requestTimeline?.requestTimeLine?.filter((ele: any) => {
            return (
              !ele?.exceptionActionTackersDto
                ?.map((user: any) => {
                  return user?.userId?.toLowerCase();
                })
                ?.includes(ele?.actionTakerUserId?.toLowerCase()) &&
              ele?.actionOptions == null
            );
          })[currentRequestTimeLineIndex + 1]?.actionTakerEmail;

        const approvalAcceptRequesterId = requestTimeline?.requestTimeLine
          ?.filter((ele: any) => {
            return (
              !ele?.exceptionActionTackersDto
                ?.map((user: any) => {
                  return user?.userId?.toLowerCase();
                })
                ?.includes(ele?.actionTakerUserId?.toLowerCase()) &&
              ele?.actionOptions == null
            );
          })
          [currentRequestTimeLineIndex + 1]?.actionTakerUserId?.toLowerCase();
        if (
          requestTimeline?.requestTimeLine
            ?.filter((ele: any) => {
              return !ele?.exceptionActionTackersDto
                ?.map((user: any) => {
                  return user?.userId?.toLowerCase();
                })
                ?.includes(ele?.actionTakerUserId?.toLowerCase());
            })
            ?.reverse()[0]
            ?.actionTakerUserId?.toLowerCase() == loggedInUserId
        ) {
          Notification.accepted(
            receiverId,
            actionUrlForOutgoing,
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
            requestNumber
          );
        } else if (!approvalAcceptRequesterEmail) {
          Notification.accepted(
            receiverId,
            actionUrlForOutgoing,
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
        } else {
          Notification.accepted(
            receiverId,
            actionUrlForOutgoing,
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
          Notification.addingRequest(
            approvalAcceptRequesterId,
            approveUrl,
            89,
            reportid,
            approvalAcceptRequesterEmail,
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
        }
        window.dispatchEvent(new Event("incomingRequestIsDeleted"));
      } else if (
        res?.payload?.message == "Must Assgin ActionTaker Take Action"
      ) {
        handleClose();
        showAlert(false, "MustAssginActionTakerTakeAction", intl, () => {});
        return;
      } else if (
        res?.payload?.message == "This Request Instance Reached Final Step"
      ) {
        handleClose();
        showAlert(false, "ThisRequestInstanceReachedFinalStep", intl, () => {});
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
      } else if (res?.payload?.message == "must Enter AssginRequestInstance") {
        handleClose();
        showAlert(false, "MustEnterAssginRequestInstance", intl, () => {});

        return;
      } else if (res?.payload?.message == "no assginRequestTemplateStep") {
        handleClose();
        showAlert(false, "NoAssginRequestTemplateStep", intl, () => {});

        return;
      } else {
        handleClose();
        showAlert(false, "AnErrorOccured", intl, () => {});
        return;
      }
      showAlert(true, "AcceptedSuccessfully", intl, () => {});
      handleClose();

      if (pageIndex) {
        callingAllRequests();
      } else {
        navigate(
          systemId ? `/approvals-requests/${systemId}` : `/approvals-requests`,
          {
            state: {
              subSystemId: "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02",
              cardTitle: cardName,
              tabName: "IncomingRequests",
            },
          }
        );
      }
      localStorage.setItem(
        "subSystemId",
        "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02"
      );
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptRequestSchema>({
    resolver: yupResolver(AcceptRequestSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
  let language = intl.locale;
  
  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    setSelectedFileForAttachment(file);
    event.target.value = "";
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{
            alignItems: intl.locale == "ar" ? "flex-start" : "flex-end",
            flexDirection: intl.locale == "en" ? "column-reverse" : "row",
          }}
          className="pb-0 border-bottom-0"
        >
          <div className="card-header mt-10 d-flex justify-content-center w-100 px-4 border-bottom-0">
            <Row className="justify-content-center mt-5 mb-5">
              <Modal.Title id="contained-modal-title-vcenter">
                <div className="text-center">
                  <h3>
                    {intl.formatMessage({ id: "AcceptanceConfirmation" })}
                  </h3>
                </div>
              </Modal.Title>
            </Row>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(handleAcceptRequest)}>
          <Modal.Body className="pb-0">
            <Row className="justify-content-center mb-5">
              <div className="text-center">
                <h5>
                  {intl.formatMessage({ id: "AreYouSureToAcceptTheRequest" })}
                </h5>
              </div>
              <div className="col-lg-12 mb-4 pt-3">
                <label
                  htmlFor="AcceptReason"
                  className="form-label px-2 fontSz-6"
                >
                  {intl.formatMessage({ id: "AcceptReason" })}
                </label>
                <textarea
                  rows={4}
                  id="AcceptReason"
                  {...register("comment")}
                  className="form-control form-control-solid mb-lg-2"
                  placeholder={intl.formatMessage({ id: "AcceptReason" })}
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
                          onChange={handleFileInputChange}
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
                      <Button variant="success" disabled className="px-15 w-75 min-w-300px">
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
                        className="  btn btn-success me-5 w-100 "
                      >
                        <span className="indicator-label">
                          {intl.formatMessage({ id: "Acceptance" })}
                        </span>
                        <span className="indicator-progress">
                          {intl.formatMessage({ id: "Acceptance" })}
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