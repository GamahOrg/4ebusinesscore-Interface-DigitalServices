import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { useParams, useNavigate } from "react-router-dom";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Notification } from "@4eplatform/shared/services/notifications";
import {
  fetchAssginRequestTransaction,
  postAssignRequestTransaction,
} from "../../../../redux/features/requests-slice/request-transaction-slice";
import { RootState } from "../../../../redux/store/store";
import { useLocation } from "react-router-dom";
import { DynamicWorkflowRootUrl } from "@4eplatform/shared/apis/dynamic_workflow";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { Button, Spinner } from "react-bootstrap";

const QuestionsReportForAssign: FC<{
  tabName?: string;
  reportid?: any;
  requestDetails?:any;
}> = ({ tabName, reportid ,requestDetails}) => {
  let navigate = useNavigate();
  let intl = useIntl();
  let [loadingForSave, setLoadingForSave] = useState<boolean>(false);
  let [loadingForSend, setLoadingForSend] = useState<boolean>(false);
  let { id, systemId } = useParams();
  const location = useLocation();
  let cardName = location?.state?.cardTitle;
  const dispatch = useDispatch();
  const [selectedFileForAttachment, setSelectedFileForAttachment] =
    useState<any>();
  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFileForAttachment(file);
    event.target.value = "";
  };
  let [comment, setComment] = useState("");
  const assignRequestDetails = useSelector((state: RootState) => {
    return state?.requests?.assignRequest;
  });
  useEffect(() => {
    if (id) {
      dispatch(fetchAssginRequestTransaction({ assginRequestId: id }) as any);
    }
  }, [id]);
  const requestTransactionData: any = useSelector((state: RootState) => {
    return state?.requestTransaction?.requestTransaction;
  });

  useEffect(() => {
    setComment(requestTransactionData?.comment);
  }, [requestTransactionData]);
  let handleSave = () => {
    let data = {
      comment,
      assginRequestInstanceId: id,
      action: 1,
      attachments: selectedFileForAttachment ? selectedFileForAttachment : null,
    };
    setLoadingForSave(true);
    dispatch(postAssignRequestTransaction(data) as any).then((res: any) => {
      setLoadingForSave(false);
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
        showAlert(false, "AnErrorOccured", intl, () => {});
      }
    });
  };
  let handleSend = () => {
    let data = {
      comment,
      assginRequestInstanceId: id,
      action: 2,
      attachments: selectedFileForAttachment ? selectedFileForAttachment : null,
    };
    setLoadingForSend(true);
    dispatch(postAssignRequestTransaction(data) as any).then((res: any) => {
      setLoadingForSend(false);
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
          navigate(`/approvals-requests/${systemId}`, {
            state: { cardTitle: cardName },
          });
          localStorage.setItem("subSystemId", systemId as string);
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
        showAlert(false, "AnErrorOccured", intl, () => {});
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
                          src={toAbsoluteUrl("/media/extensions/uploadFile.webp")}
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
                {loadingForSave ? (
                  <Button variant="success" disabled className="px-15 w-15">
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
                    className="btn btn-primary px-15"
                    onClick={() => {
                      handleSave();
                    }}
                  >
                    {intl.formatMessage({ id: "Save" })}
                  </button>
                )}

                {loadingForSend ? (
                  <Button variant="success" disabled className="px-15 w-15">
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
                    className="btn btn-success px-15"
                    type="submit"
                    onClick={() => {
                      handleSend();
                    }}
                  >
                    {intl.formatMessage({ id: "Send" })}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default QuestionsReportForAssign;
