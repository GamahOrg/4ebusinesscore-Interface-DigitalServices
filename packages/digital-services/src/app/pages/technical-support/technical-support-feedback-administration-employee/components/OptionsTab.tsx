import { FC, Fragment, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router";
import SolveReportPopup from "../../technical-support-feedback-employee/popups/SolveReportPopup";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { useDispatch } from "react-redux";
// import { RootState } from "../../../../redux/store/store";
import { fetchGetReportById } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import RejectReportPopup from "../../technical-support-feedback-manager/popups/RejectReportPopup";
import RedirectPopup from "../../technical-support-feedback-manager/popups/RedirectPopup";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import DynamicForm from "../../../partials/dynamic-form/DynamicForm";
import { isValidJson } from "@4eplatform/shared/functions/isValidJson";

type PopupProps = {
  reportId: string;
  reportModel: any;
  attachments?: string[];
  reportAttachments?: any;
};
const OptionsTab: FC<PopupProps> = ({
  reportId,
  reportModel,
  attachments,
  reportAttachments,
}) => {
  let intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [solveShow, setSolveShow] = useState<boolean>(false);
  let [activeAttchment, setActiveAttchment] = useState(true);
  let [activeLink, setActiveLink] = useState(false);
  let activeAttchmentHandler = () => {
    setActiveAttchment(true);
    setActiveLink(false);
  };
  // let activeLinkHandler = () => {
  //   setActiveAttchment(false);
  //   setActiveLink(true);
  // };

  const dispatch = useDispatch();
  // let report = useSelector((state: RootState) => {
  //   return state?.GetReportById.report;
  // });

  const parms = useParams();

  useEffect(() => {
    dispatch(fetchGetReportById(parms.id as string) as any);
  }, [parms?.id, dispatch]);
  let [optin, setoptin] = useState("");
  useEffect(() => {
    setoptin(intl.locale=="ar"?reportModel?.reportSubject:reportModel?.reportSubjectEn);
  }, [reportModel?.reportSubject]);
  // const [itemDynamicForm, setItemDynamicForm] = useState<any>("");
  // function isBase64(value: any) {
  //   try {
  //     return btoa(atob(value)) === value;
  //   } catch (e) {
  //     return false;
  //   }
  // }
  const [rerender, setRerender] = useState(0);

useEffect(() => {
  if (reportModel?.requesterForm) {
    setRerender((prev) => prev + 1);
  }
}, [reportModel?.requesterForm]);
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
                  readOnly
                  className="form-control pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                  placeholder={intl.formatMessage({
                    id: "ServiceContent",
                  })}
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
            {reportModel?.requesterForm !== "undefined" &&
              reportModel?.requesterForm !== "[]" &&  isValidJson(reportModel?.requesterForm) &&
              reportModel?.requesterForm && (
                <DynamicForm
                  display={true}
                  formInputs={JSON.parse(reportModel?.requesterForm as string)}
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

                <div className="col-lg-11 d-flex align-items-center justify-content-center">
                  <div
                    className="row w-100 flex-grow-1"
                    style={{ height: "360px", overflowY: "auto" }}
                  >
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
                                rel="noreferrer"
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
      </div>
      {rejectShow ? (
        <RejectReportPopup
          show={rejectShow}
          handleClose={() => setRejectShow(false)}
          reportId={reportId}
          optin={optin}
          technetionId={reportModel?.technetionId}
          creatorId={reportModel?.creator}
          creatorEmail={reportModel?.creatorEmail}
          requestNumber={reportModel?.reportNumber}
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
          categoryName={reportModel?.categoryName}
          technetionId={reportModel?.technetionId}
          mainclassificationId={reportModel?.mainclassificationId}
          creatorId={reportModel?.creator}
          creatorEmail={reportModel?.creatorEmail}
          requestDate={reportModel?.createOn}
          requestName={reportModel?.reportTitle}
          requestType={reportModel?.serviceCatalogName}
          requestNumber={reportModel?.reportNumber}
        />
      ) : (
        ""
      )}

      {solveShow ? (
        <SolveReportPopup
          show={solveShow}
          handleClose={() => setSolveShow(false)}
          technetionId={reportModel?.technetionId}
          reportId={reportId}
          creatorId={reportModel?.creator}
          creatorEmail={reportModel?.creatorEmail}
          requestNumber={reportModel?.reportNumber}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default OptionsTab;
