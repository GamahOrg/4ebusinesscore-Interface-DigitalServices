import { FC, Fragment, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import SolveReportPopup from "../../technical-support-feedback-employee/popups/SolveReportPopup";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { fetchGetReportById } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import RejectReportPopup from "../popups/RejectReportPopup";
import RedirectPopup from "../popups/RedirectPopup";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import { ExceptionAgreePopup } from "../popups/ExceptionAgreePopup";
import { fetchRoleAssign } from "../../../../redux/features/delegation-slices/roleAssignSlice";
import DynamicForm from "../../../partials/dynamic-form/DynamicForm";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { isValidJson } from "@4eplatform/shared/functions/isValidJson";

type PopupProps = {
  reportId: string;
  reportModel: any;
  categoryName?: string;
  technetionId?: string;
  mainclassificationId?: string;
  attachments?: string[];
  dynamicForm?: any;
  reportAttachments?: string[];
  itemId?: string;
};
const OptionsTab: FC<PopupProps> = ({
  reportId,
  reportModel,
  categoryName,
  technetionId,
  mainclassificationId,
  attachments,
  reportAttachments,
  dynamicForm,
  itemId,
}) => {
  let intl = useIntl();
  // 15 الموافقه الاستثنائيه
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [solveShow, setSolveShow] = useState<boolean>(false);
  const [excetionAgreeShow, setExcetionAgreeShow] = useState<boolean>(false);
  let [activeAttchment, setActiveAttchment] = useState(true);
  let [activeLink, setActiveLink] = useState(false);
  let activeAttchmentHandler = () => {
    setActiveAttchment(true);
    setActiveLink(false);
  };
  const dispatch = useDispatch();
  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });

  const parms = useParams();

  useEffect(() => {
    if(parms.id){
     dispatch(fetchGetReportById(parms.id as string) as any);
    }
  }, [parms?.id, dispatch]);
  let [optin, setoptin] = useState<any>("");
  const [showBtn, setShowBtn] = useState<boolean>(false);

  useEffect(() => {
    setoptin(report?.reportSubject);
  }, [report?.reportSubject]);
  const [itemDynamicForm, setItemDynamicForm] = useState<any>("");
  // function isBase64(value: any) {
  //   try {
  //     return btoa(atob(value)) === value;
  //   } catch (e) {
  //     return false;
  //   }
  // }
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    setRerender((prev) => prev + 1);
    setItemDynamicForm(report?.requesterForm);
    if (report?.serviceIntegration == 11 || report?.serviceIntegration == 12) {
      dispatch(fetchRoleAssign({}) as any).then((res: any) => {
        if (
          res?.payload?.result === "Exceptional Approval" ||
          res?.payload?.result === "Both"
        ) {
          setShowBtn(true);
        }
      });
    }
  }, [report]);
  const isDarkMode = localStorage.getItem("Theme") === "dark";
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
            {itemDynamicForm !== "undefined" &&
              itemDynamicForm !== "[]" &&
              itemDynamicForm && isValidJson(itemDynamicForm) && (
                <DynamicForm
                  display={true}
                  formInputs={JSON.parse(itemDynamicForm as string)}
                  rerender={rerender}
                />
              )}
          </div>
          {reportModel?.reportAttachments?.length > 0 ? (
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
                        color: activeAttchment
                          ? isDarkMode
                            ? "#00aeef"
                            : "rgb(0, 158, 247)"
                          : isDarkMode
                          ? "#ffffff"
                          : "#000000",
                        backgroundColor: activeAttchment
                          ? isDarkMode
                            ? "#1e1e2f"
                            : "#ffffff"
                          : "transparent",
                        borderRadius: activeAttchment ? "20px" : "",
                        border: activeAttchment
                          ? isDarkMode
                            ? "1px solid #00aeef"
                            : "1px solid #009ef7"
                          : "none",
                      }}
                    >
                      {intl.formatMessage({ id: "Attachments" })}{" "}
                    </button>
                  </div>
                </div>
                <div className="col-lg-11 d-flex align-items-center justify-content-center">
                  <div
                    className="row w-100 flex-grow-1"
                    style={{ height: "360px", overflowY: "auto" }}
                  >
                    {reportModel?.reportAttachments ? (
                      <>
                        {reportModel?.reportAttachments?.map(
                          (attachment: any, idx: number) => {
                            const fileURL = attachment;
                            const fileName = fileURL.substring(
                              fileURL.lastIndexOf("/") + 1
                            );
                            return (
                              <div
                                className="d-flex justify-content-between align-items-center py-3 h-fit"
                                key={idx}
                              >
                                <a
                                  href={`${
                                    TicketingSystemAggRootUrl + attachment
                                  }`}
                                  target="_blank"
                                  key={idx}
                                  rel="noreferrer"
                                >
                                  <div className="d-flex align-items-center justify-content-center h-70px ">
                                    <img
                                      src={getIconSrc(
                                        fileName,
                                        { filePath: attachment },
                                        TicketingSystemAggRootUrl
                                      )}
                                      onError={(e: any) => {
                                        e.target.src =
                                          getIconSrcError(fileName);
                                      }}
                                      className="d-block h-100 w-50px rounded-circle mx-2"
                                      alt=""
                                    />
                                    <div>
                                      <p className="text-dark-75 mb-4 fw-bolder fs-6 text-hover-primary font-size-lg">
                                        {fileName}
                                      </p>
                                    </div>
                                  </div>
                                </a>
                                {/* <button
                                  type="button"
                                  className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
                                  data-kt-menu-trigger="click"
                                  data-kt-menu-placement="bottom-end"
                                >
                                  <span className="svg-icon svg-icon-2">
                                    <KTSVG path="/media/icons/duotune/general/gen074.svg" />
                                  </span>
                                </button> */}

                                {/* Rest of your code */}
                              </div>
                            );
                          }
                        )}
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
        <div className="row d-flex align-items-center justify-content-center">
          {showBtn &&
          (report?.serviceIntegration == 11 ||
            report?.serviceIntegration == 12) &&
          (report?.operationStatus == 14 || report?.operationStatus == 13) ? (
            <>
              <div className="col-2">
                <div
                  className="btn btn-success text-center"
                  onClick={() => setExcetionAgreeShow(true)}
                >
                  {intl.formatMessage({ id: "ExceptionAgree" })}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        {report?.operationStatus !== 0 &&
          report?.operationStatus !== 1 &&
          report?.operationStatus !== 2 &&
          report?.operationStatus !== 13 &&
          report?.operationStatus !== 14 &&
          report?.operationStatus !== 16 &&
          report?.operationStatus !== 15 && (
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-6">
              <div className="col-12 col-md-auto mb-2 mb-md-0">
                <div
                  className="btn btn-danger px-20 text-center w-100"
                  onClick={() => setRejectShow(true)}
                  style={{ border: "none" }}
                >
                  {intl.formatMessage({ id: "Reject" })}
                </div>
              </div>

              {report?.serviceIntegration != 11 &&
                report?.serviceIntegration != 12 && (
                  <div className="col-12 col-md-auto mb-2 mb-md-0">
                    <div
                      className="btn btn-primary px-20 text-center w-100"
                      onClick={() => setRedirectShow(true)}
                    >
                      {intl.formatMessage({ id: "Redirect" })}
                    </div>
                  </div>
                )}

              <div className="col-12 col-md-auto">
                <div
                  className="btn btn-primary px-20 text-center w-100"
                  onClick={() => setSolveShow(true)}
                >
                  {intl.formatMessage({ id: "Completion" })}
                </div>
              </div>
            </div>
          )}
        {(report?.serviceIntegration === 11 ||
          report?.serviceIntegration === 12) &&
          report?.operationStatus === 15 && (
            <div className="d-flex gap-4 justify-content-center mb-6">
              <div
                className="btn btn-danger px-20 text-center "
                onClick={() => setRejectShow(true)}
                style={{ border: "none" }}
              >
                {intl.formatMessage({ id: "Reject" })}
              </div>

              <div
                className="btn btn-primary px-20 text-center"
                onClick={() => setSolveShow(true)}
              >
                {intl.formatMessage({ id: "Completion" })}
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
          categoryName={categoryName}
          technetionId={technetionId}
          mainclassificationId={mainclassificationId}
          creatorId={report?.creator}
          creatorEmail={report?.creatorEmail}
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
      {excetionAgreeShow ? (
        <ExceptionAgreePopup
          show={excetionAgreeShow}
          handleClose={() => setExcetionAgreeShow(false)}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default OptionsTab;
