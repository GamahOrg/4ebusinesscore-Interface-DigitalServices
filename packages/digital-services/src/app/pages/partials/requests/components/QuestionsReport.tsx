import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { fetchReportsByRequestId } from "../../../../redux/features/requests-slice/request-data-slice";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { DynamicWorkflowRootUrl } from "@4eplatform/shared/apis/dynamic_workflow";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import { RootState } from "../../../../redux/store/store";
import DynamicForm from "../../../technical-support/approvals-requests/components/DynamicForm";
import { isValidJson } from "@4eplatform/shared/functions/isValidJson";

const QuestionsReport: FC<{
  request_id?: string;
  subject?: string;
  attachments?: any;
  tabName?: string;
}> = ({ request_id, subject, attachments, tabName }) => {
  let intl = useIntl();
  const dispatch = useDispatch();
  const requestData = useSelector((state: RootState) => {
    return state?.requestData?.RequestData;
  });
  useEffect(() => {
    if (request_id) {
      dispatch(fetchReportsByRequestId(request_id) as any);
    }
  }, [request_id]);
  return (
    <div className="QuestionsReport row col-lg-12 card-body pt-9 pb-0">
      {requestData?.requesterForm &&
      requestData?.requesterForm !== "undefined"  && isValidJson(requestData?.requesterForm) &&
      JSON.parse(requestData?.requesterForm as string).length ? (
        <DynamicForm
          display={true}
          formInputs={JSON.parse(requestData?.requesterForm as string)}
        />
      ) : (
        <>
          <div
            className={`mb-5 d-flex ${
              subject ? "flex-column gap-2" : "gap-4"
            } `}
          >
            <label className="mb-4">
              <span>{intl.formatMessage({ id: "ServiceContent" })}</span>{" "}
              <span>:</span>
            </label>
            {subject ? (
              <textarea
                value={subject}
                readOnly={subject !== undefined}
                className="form-control pt-4 form-control-lg form-control-solid mb-4"
                rows={5}
              ></textarea>
            ) : (
              <h5> {intl.formatMessage({ id: "NotFound" })}</h5>
            )}
          </div>

          <div
            className={`mb-4 d-flex ${
              attachments && attachments.length ? "flex-column gap-2" : "gap-4"
            } `}
          >
            <label className="mb-4">
              <span>{intl.formatMessage({ id: "Attachments" })}</span>{" "}
              <span> :</span>
            </label>

            {tabName === "ApplicationForm" ? (
              attachments && attachments.length ? (
                attachments?.map((attachment: any) => (
                  <div
                    className="d-flex align-items-center mx-3 flex-shrink-0"
                    key={Math?.random()}
                  >
                    <a
                      href={`${TicketingSystemAggRootUrl}${attachment.fileUrl}`}
                      target="_blank"
                      download
                      rel="noreferrer"
                      className="d-flex align-items-center"
                    >
                      <img
                        src={getIconSrc(
                          attachment?.fileUrl,
                          { path: attachment?.fileUrl },
                          DynamicWorkflowRootUrl
                        )}
                        className="w-30px h-30px"
                        alt="pdf"
                      />
                      <div className="d-flex flex-column mx-2">
                        <span>
                          {attachment.fileUrl.substring(
                            attachment.fileUrl.lastIndexOf("/") + 1
                          )}
                        </span>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <h5> {intl.formatMessage({ id: "NotFound" })}</h5>
              )
            ) : (
              <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-5 h-80px">
                <label
                  htmlFor="outputAttachment"
                  className="form-label  dropzone-select  uploadFile-style inputAreaHeight"
                >
                  <div role="button" className="d-flex align-items-center">
                    <div className="py-auto ps-3">
                      <img
                        style={{ width: "25px" }}
                        src="/media/extensions/uploadFile.webp"
                        className="img-fluid"
                      />
                    </div>
                    <div className="row py-auto">
                      <span className="text-primary fw-bolder">
                        {intl.formatMessage({ id: "QuickFileUploader" })}
                      </span>
                      <span>
                        {" "}
                        {intl.formatMessage({
                          id: "DragAndDropOrChooseFilesFromComputer",
                        })}
                      </span>
                    </div>
                  </div>
                </label>
                <div
                  className="dropzone dropzone-queue "
                  id="kt_dropzonejs_example_3"
                >
                  <div className="dropzone-panel">
                    <input
                      multiple
                      type="file"
                      id="outputAttachment"
                      name="attachments"
                      placeholder={intl.formatMessage({
                        id: "FileUpload",
                      })}
                      className="dropzone-select  uploadFile-style inputAreaHeight d-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionsReport;
