import { FC, Fragment, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import RedirectPopup from "../popups/RedirectPopup";
import RejectReportPopup from "../popups/RejectReportPopup";
import { useParams, useLocation } from "react-router";
import SolveReportPopup from "../../technical-support-feedback-employee/popups/SolveReportPopup";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import { RootState } from "../../../../redux/store/store";
import { fetchGetReportById } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { useDispatch, useSelector } from "react-redux";
import { isValidToParse } from "@4eplatform/shared/assets/Json";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import DynamicForm from "../../../partials/dynamic-form/DynamicForm";
import { isValidJson } from "@4eplatform/shared/functions/isValidJson";

type PopupProps = {
  reportId: string;
  categoryName: string;
  technetionId: string;
  mainclassificationId: string;
  requesterForm: any;
  attachments?: string[];
  dynamicForm?: any;
  reportAttachments?: any;
  itemId?: string;
};
const OptionsTab: FC<PopupProps> = ({
  reportId,
  categoryName,
  technetionId,
  mainclassificationId,
  requesterForm,
  attachments,
  dynamicForm,
  reportAttachments,
  itemId,
}) => {
  let intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [solveShow, setSolveShow] = useState<boolean>(false);
  const location = useLocation();
  const tabName = location?.state?.tabName;

  let [activeAttchment, setActiveAttchment] = useState(true);
  let [activeLink, setActiveLink] = useState(false);
  let activeAttchmentHandler = () => {
    setActiveAttchment(true);
    setActiveLink(false);
  };
  let activeLinkHandler = () => {
    setActiveAttchment(false);
    setActiveLink(true);
  };

  const [itemDynamicForm, setItemDynamicForm] = useState<any>("");
  const [inputValues, setInputValues] = useState<any>({});

  useEffect(() => {
    const replaceInputsWithLabels = () => {
      const tempDiv: any = document.createElement("div");
      tempDiv.innerHTML = dynamicForm as string;
      const draggableDivs = tempDiv.querySelectorAll(
        "[data-rbd-drag-handle-draggable-id]"
      );
      draggableDivs.forEach((draggableDiv: any) => {
        draggableDiv.parentNode.removeChild(draggableDiv);
      });

      const inputElements2 = tempDiv.querySelectorAll(".new-questionnaire1");
      inputElements2.forEach((inputElement: any) => {
        inputElement.setAttribute("readOnly", true);
        inputElement.style.border = "none";
      });

      const inputElements = tempDiv.querySelectorAll(".new-questionnaire2");
      inputElements.forEach((inputElement: any) => {
        const labelElement = document.createElement("label");
        labelElement.textContent = `${inputElement.value}`; // You can customize the label content as needed
        inputElement.parentNode.replaceChild(labelElement, inputElement);
      });
      setItemDynamicForm(tempDiv.innerHTML);
    };

    replaceInputsWithLabels();
  }, [dynamicForm]);

  const dispatch = useDispatch();
  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });

  const parms = useParams();

  useEffect(() => {
    dispatch(fetchGetReportById(parms.id as string) as any);
  }, [parms?.id]);
  let [optin, setoptin] = useState<any>("");
  useEffect(() => {
    setoptin(report?.reportSubject);
  }, [report?.reportSubject]);
  const [rerender, setRerender] = useState(0);

useEffect(() => {
  if (report?.requesterForm) {
    setRerender((prev) => prev + 1);
  }
}, [report?.requesterForm]);

  return (
    <Fragment>
      <div
        className="tab-pane fade show active"
        id="options"
        role="tabpanel"
        aria-labelledby="options-tab"
      >
        <div className="row mb-9">
          <div className="col-lg-6">
            {optin ? (
              <>
                <textarea
                  className="form-control pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                  placeholder={intl.formatMessage({
                    id: "ServiceContent",
                  })}
                  readOnly
                  value={optin}
                  onChange={(e) => {
                    setoptin(e.target.value);
                  }}
                  style={{ resize: "vertical", height: "450px" }}
                ></textarea>
              </>
            ) : (
              <></>
            )}
            {report?.requesterForm !== "undefined" &&
              report?.requesterForm !== "[]" &&
              isValidToParse(report?.requesterForm)  && isValidJson(report?.requesterForm) && (
                <DynamicForm
                  display={true}
                  formInputs={JSON.parse(report?.requesterForm as string)}
                  rerender={rerender}
                />
              )}
          </div>
          {reportAttachments?.length > 0 ? (
            <div className="col-lg-6 card  shadow h-450px ">
              <div className="w-100">
                <div
                  className="nav row  mx-auto nav-pills mb-7   background-pills d-flex justify-content-center justify-content-lg-evenly"
                  id="pills-tab"
                  role="tablist"
                >
                  <div
                    className="nav-item col-12 col-lg-2 w-40 navTabsPills"
                    role="presentation"
                  >
                    <button
                      className={`nav-link w-100 m-1 fs-5 fw-bolder  ${
                        activeAttchment
                          ? "rounded-0 active btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary"
                          : ""
                      }`}
                      id="attachment-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#attachment"
                      type="button"
                      role="tab"
                      aria-controls="options"
                      aria-selected="true"
                      onClick={() => {
                        activeAttchmentHandler();
                      }}
                      style={{
                        color: `${
                          activeAttchment ? "rgb(0, 158, 247)" : "black"
                        }`,
                        backgroundColor: `${activeAttchment ? "white" : ""}`,
                        borderRadius: `${activeAttchment ? "20px" : ""}`,
                      }}
                    >
                      {intl.formatMessage({ id: "Attachments" })}{" "}
                    </button>
                  </div>
                </div>
                <div className="col-lg-11 d-flex align-items-center">
                  <div className="row w-100 flex-grow-1">
                    {attachments ? (
                      <>
                        {attachments?.map((attachment: any, idx) => {
                          const fileURL = attachment;
                          const fileName = fileURL.substring(
                            fileURL.lastIndexOf("/") + 1
                          );
                          return (
                            <div
                              className="d-flex justify-content-between align-items-center py-3"
                              key={idx}
                            >
                              <a
                                href={`${
                                  TicketingSystemAggRootUrl + attachment
                                }`}
                                target="_blank"
                                key={idx}
                              >
                                <div className="d-flex align-items-center justify-content-center h-70px ">
                                  <img
                                    src={getIconSrc(
                                      fileName,
                                      { filePath: attachment },
                                      TicketingSystemAggRootUrl
                                    )}
                                    onError={(e: any) => {
                                      e.target.src = getIconSrcError(fileName);
                                    }}
                                  />
                                  <div>
                                    <p className="text-dark-75 mb-4 fw-bolder fs-6 text-hover-primary font-size-lg">
                                      {fileName}
                                    </p>
                                  </div>
                                </div>
                              </a>
                              <button
                                type="button"
                                className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                                data-kt-menu-trigger="click"
                                data-kt-menu-placement="bottom-end"
                              >
                                <span className="svg-icon svg-icon-2">
                                  <KTSVG path="/media/icons/duotune/general/gen074.svg" />
                                </span>
                              </button>

                              {/* Rest of your code */}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>-</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {report?.operationStatus !== 0 &&
          report?.operationStatus !== 1 &&
          report?.operationStatus !== 2 &&
          report?.operationStatus !== 13 &&
          report?.operationStatus !== 14 &&
          tabName !== "my-reposts" && (
            <div className="row justify-content-center mb-6">
              <div className="col-2">
                <div
                  className="btn btn-danger w-85 text-center "
                  onClick={() => setRejectShow(true)}
                  style={{ border: "none" }}
                >
                  {intl.formatMessage({ id: "Reject" })}
                </div>
              </div>
              <div className="col-2">
                <div
                  className="btn btn-primary w-85 text-center"
                  onClick={() => setRedirectShow(true)}
                >
                  {intl.formatMessage({ id: "Redirect" })}
                </div>
              </div>

              <div className="col-2">
                <div
                  className="btn btn-primary w-85 text-center"
                  onClick={() => setSolveShow(true)}
                >
                  {intl.formatMessage({ id: "Completion" })}
                </div>
              </div>
            </div>
          )}
      </div>
      {rejectShow ? (
        <RejectReportPopup
          show={rejectShow}
          handleClose={() => setRejectShow(false)}
          reportId={reportId}
          optin={optin}
          technetionId={technetionId}
          creatorId={report?.creator}
          creatorEmail={report?.creatorEmail}
          requestDate={report?.createOn}
          requestName={report?.reportTitle}
          requestType={report?.serviceCatalogName}
         requestNumber={report?.reportNumber}
        />
      ) : (
        ""
      )}

      {redirectShow ? (
        <RedirectPopup
          handleClose={() => setRedirectShow(false)}
          show={redirectShow}
          reportId={reportId}
          optin={optin}
          creatorId={report?.creator}
          creatorEmail={report?.creatorEmail}
          categoryName={categoryName}
          technetionId={technetionId}
          mainclassificationId={mainclassificationId}
          itemId={itemId}
          requestDate={report?.createOn}
          requestName={report?.reportTitle}
          requestType={report?.serviceCatalogName}
         requestNumber={report?.reportNumber}
        />
      ) : (
        ""
      )}

      {solveShow ? (
        <SolveReportPopup
          show={solveShow}
          handleClose={() => setSolveShow(false)}
          technetionId={technetionId}
          reportId={reportId}
          creatorId={report?.creator}
          creatorEmail={report?.creatorEmail}
           requestNumber={report?.reportNumber}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default OptionsTab;
