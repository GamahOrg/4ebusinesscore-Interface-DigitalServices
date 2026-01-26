import { FC, Fragment, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { fetchGetReportById } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
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
  attachments?: string[];
  requesterForm?: any;
  reportAttachments?: any;
};
const MyOptionsTab: FC<PopupProps> = ({
  reportId,
  categoryName,
  technetionId,
  mainclassificationId,
  attachments,
  requesterForm,
  reportAttachments,
}) => {
  let intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [solveShow, setSolveShow] = useState<boolean>(false);
  let { id } = useParams();
  let navigate = useNavigate();
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
  const [itemDynamicForm, setItemDynamicForm] = useState<any>("");
  function isBase64(value: any) {
    try {
      return btoa(atob(value)) === value;
    } catch (e) {
      return false;
    }
  }
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
                  className="form-control h-450px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                  placeholder={intl.formatMessage({
                    id: "ServiceContent",
                  })}
                  readOnly
                  value={optin}
                  onChange={(e) => {
                    setoptin(e.target.value);
                  }}
                ></textarea>
              </>
            ) : (
              <></>
            )}
            {requesterForm !== "undefined" &&
              requesterForm !== "[]" &&
              isValidToParse(requesterForm) && isValidJson(requesterForm) && (
                <DynamicForm
                  display={true}
                  formInputs={JSON.parse(requesterForm as string)}
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
                                rel="noreferrer"
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
      </div>
    </Fragment>
  );
};

export default MyOptionsTab;
