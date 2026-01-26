import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import {
  fetchAssginRequestTransaction,
  postAssignRequestTransaction,
} from "../../../../redux/features/requests-slice/request-transaction-slice";
import { useParams, useNavigate } from "react-router-dom";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Notification } from "@4eplatform/shared/services/notifications";
import { DynamicWorkflowRootUrl } from "@4eplatform/shared/apis/dynamic_workflow";
import { RootState } from "../../../../redux/store/store";

const QuestionsReportForAssign: FC<{
  tabName?: string;
  reportid?: any;
   requestDetails?:any;
}> = ({ tabName, reportid ,requestDetails }) => {
  let navigate = useNavigate();
  let intl = useIntl();
  let { id } = useParams();
  const dispatch = useDispatch();
  const [selectedFileForAttachment, setSelectedFileForAttachment] =
    useState<any>();
  
  const MAX_FILE_SIZE = 15 * 1024 * 1024;

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showAlert(false, "You have exceeded 15 MB", intl, () => {});
      event.target.value = "";
      return;
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
      event.target.value = "";
      return;
    }

    setSelectedFileForAttachment(file);
    event.target.value = "";
  };

  let [comment, setComment] = useState("");
  
  useEffect(() => {
    if (id) {
      dispatch(fetchAssginRequestTransaction({ assginRequestId: id }) as any);
    }
  }, [id]);
  
  const requestTransactionData: any = useSelector((state: RootState) => {
    return state?.requestTransaction?.requestTransaction;
  });
  
  const assignRequestDetails = useSelector((state: RootState) => {
    return state?.requests?.assignRequest;
  });
  
  useEffect(() => {
    setComment(requestTransactionData?.comment);
  }, [requestTransactionData]);

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

  let handleSave = () => {
    if (selectedFileForAttachment && !validateFile(selectedFileForAttachment)) {
      return;
    }

    let data = {
      comment,
      assginRequestInstanceId: id,
      action: 1,
      attachments: selectedFileForAttachment ? selectedFileForAttachment : null,
    };
    
    dispatch(postAssignRequestTransaction(data) as any).then((res: any) => {
      if (res?.payload?.statusEnum == 1) {
        showAlert(true, "SavedSuccessfully", intl, () => {
          dispatch(
            fetchAssginRequestTransaction({ assginRequestId: id }) as any
          );
        });
      } else if (
        res?.payload?.message ==
        "this Assgin Request Transaction not allow take action"
      ) {
        showAlert(
          false,
          "AssginRequestUserNotAllowedToTakeThisAction",
          intl,
          () => {}
        );
      } else {
        showAlert(
          false,
          "errorMsg",
          intl,
          () => {}
        );
      }
    });
  };

  const handleSend = () => {
    if (selectedFileForAttachment && !validateFile(selectedFileForAttachment)) {
      return;
    }

    let data = {
      comment,
      assginRequestInstanceId: id,
      action: 2,
      attachments: selectedFileForAttachment ? selectedFileForAttachment : null,
    };
    
    dispatch(postAssignRequestTransaction(data) as any).then((res: any) => {
      if (res?.payload?.statusEnum === 1) {
        Notification.backrestDone(
          res?.payload?.result?.userId?.toLowerCase(),
          `/user-profile/requests/${reportid}/details-for-incoming`,
          89,
          reportid,
          res?.payload?.result?.email,
          true,
          26,
          new Date(),
          assignRequestDetails?.name,
          "طلب مسند",
          "",
          "",
          "",
          requestDetails?.requestNumber,

        );
        showAlert(true, "SentSuccessfully", intl, () => {
          navigate("/user-profile/requests?tabName=AssignedRequests");
        });
      } else if (
        res?.payload?.message ==
        "this Assgin Request Transaction not allow take action"
      ) {
        showAlert(
          false,
          "AssginRequestUserNotAllowedToTakeThisAction",
          intl,
          () => {}
        );
      } else {
        showAlert(
          false,
          "errorMsg",
          intl,
          () => {}
        );
      }
    });
  };

  const handleFileDelete = () => {
    setSelectedFileForAttachment(null);
  };

  return (
    <div className="QuestionsReport row col-lg-12 card-body pt-9 pb-0">
      <>
        <div className="mb-5">
          <label className="mb-4">
            <span>{intl.formatMessage({ id: "ServiceContent" })}</span>{" "}
            <span>:</span>
          </label>
          <textarea
            value={comment}
            className="form-control pt-4 form-control-lg form-control-solid mb-4"
            rows={5}
            onChange={(e) => {
              setComment(e?.target?.value);
            }}
          ></textarea>
        </div>

        <div className="mb-4">
          <div className="col-lg-12 mb-2 pt-2">
            <div className="col-lg-12 mb-2 pt-2 pb-3">
              <label className="form-label px-2  fontSz-6">
                {intl.formatMessage({ id: "ATTACHMENTS" })}
              </label>
              <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-5 h-80px">
                <label
                  htmlFor="outputAttachment1"
                  className="form-label  dropzone-select  uploadFile-style inputAreaHeight"
                >
                  <div role="button" className="d-flex align-items-center">
                    {selectedFileForAttachment ||
                    (requestTransactionData?.assginRequestTransactionAttachment
                      ?.length > 0
                      ? requestTransactionData
                          ?.assginRequestTransactionAttachment[0]
                          ?.attachmentName
                      : "") ? (
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
                                  selectedFileForAttachment?.name ||
                                    (requestTransactionData
                                      ?.assginRequestTransactionAttachment
                                      ?.length > 0
                                      ? requestTransactionData
                                          ?.assginRequestTransactionAttachment[0]
                                          ?.attachmentName
                                      : ""),
                                  selectedFileForAttachment || {
                                    path: requestTransactionData
                                      ?.assginRequestTransactionAttachment[0]
                                      ?.attachmentURL,
                                  },
                                  DynamicWorkflowRootUrl
                                )}
                              />
                              <div className="mx-1">
                                {selectedFileForAttachment?.name ||
                                  (requestTransactionData
                                    ?.assginRequestTransactionAttachment
                                    ?.length > 0
                                    ? requestTransactionData
                                        ?.assginRequestTransactionAttachment[0]
                                        ?.attachmentName
                                    : "")}
                              </div>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-10px",
                                  left: "-10px",
                                  height: "15px",
                                  width: "15px",
                                  borderRadius: "50%",
                                  backgroundColor: "red",
                                  display: "flex",
                                  color: "black",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                onClick={handleFileDelete}
                              >
                                x
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
                          src="/media/extensions/uploadFile.webp"
                          className="img-fluid"
                          alt=""
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
                      placeholder={intl.formatMessage({
                        id: "FileUpload",
                      })}
                      className="dropzone-select  uploadFile-style inputAreaHeight d-none w-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {requestTransactionData?.action == 2 ? (
            <></>
          ) : (
            <>
              <div className="d-flex flex-center flex-row-fluid py-2 gap-4">
                <button
                  className="btn btn-primary px-15"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  {intl.formatMessage({ id: "Save" })}
                </button>

                <button
                  className="btn btn-success px-15"
                  type="submit"
                  onClick={() => {
                    handleSend();
                  }}
                >
                  {intl.formatMessage({ id: "Send" })}
                </button>
              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default QuestionsReportForAssign;