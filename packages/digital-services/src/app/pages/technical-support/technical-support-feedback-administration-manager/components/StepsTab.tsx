import { Fragment, useEffect, FC } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { getAllReportStepByReportId } from "../../../../redux/features/service-operation/report/GetAllReportStep";
import moment from "moment";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";

type PopupProps = {
  reportId: string;
};
const StepsTab: FC<PopupProps> = ({ reportId }) => {
  let intl = useIntl();
  const dispatch = useDispatch();
  const getAllReportSteps = useSelector((state: RootState) => {
    return state?.GetAllReportSteps?.item;
  });

  useEffect(() => {
    dispatch(getAllReportStepByReportId(reportId) as any);
  }, [dispatch, reportId]);

  const convertNullString = (value: string) => {
    if (value == null || value === "" || value === "null") return "";
    else return value;
  };

  const selectedLang = localStorage.getItem("selectedLang");
  return (
    <Fragment>
      <div
        className="tab-pane fade show active"
        id="steps"
        role="tabpanel"
        aria-labelledby="steps-tab"
      >
        <div className="timeline-label">
          {getAllReportSteps?.map((item: any, index) => {
            return (
              <Fragment key={index}>
                <div className="timeline-item">
                  <div className="timeline-label fw-bold text-gray-800 fs-6 "></div>

                  <div className="timeline-badge px-4 my-8">
                    <img
                      alt="pic"
                      src={
                        convertNullString(item?.image) !== ""
                          ? `${
                              (window as any)._env_?.REACT_APP_API_User_Url
                            }/` + item?.image
                          : "/media/avatars/"
                      }
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                      }}
                      onError={(e: any) =>
                        (e.target.src = `/media/avatars/`)
                      }
                    />
                  </div>

                  <div className="fw-mormal timeline-content ps-3 mx-5">
                    <div className="row">
                      <div className="col-md-6 col-9">
                        <div className="border border-gray-300 rounded min-w-125px py-3 px-4 me-6 mb-3 d-flex flex-column align-items-center justify-content-center">
                          <h4 className="text-dark fw-black fw-bolder ">
                            {!item?.fullName?.trim() &&
                            item?.statusNameAr === "تم غلق" ? (
                              <span className="fs-6">
                                {intl.formatMessage({
                                  id: "TheRequestHasBeenClosedByTheSystem",
                                })}
                              </span>
                            ) : (
                              <>{item?.fullName}</>
                            )}
                            {item?.redirectTechFullName &&
                            item?.redirectTechFullName.trim() !== "" ? (
                              <>
                                <span className="fs-5 d-block my-3">
                                  {"  "}
                                  {intl.formatMessage({ id: "RedirectedTo" })}
                                  {"  "}
                                </span>
                                <div>{item?.redirectTechFullName}</div>
                              </>
                            ) : (
                              <></>
                            )}
                          </h4>
                          <p className="text-muted mb-0">{item?.jobNameAr} </p>
                        </div>
                      </div>
                      <div className="col-md-4 col-9">
                        <div className="border border-gray-300 rounded min-w-md-250px py-3 px-4 me-6 mb-3 d-flex flex-column align-items-center justify-content-center">
                          <h4 className="text-dark fw-bolder d-flex">
                            {moment
                              .tz(item?.statusDate, "UTC")
                              .tz(
                                Intl.DateTimeFormat().resolvedOptions().timeZone
                              )
                              .format("DD-MM-YYYY  /  hh:mm a")}
                          </h4>
                          <p className="text-mute mb-0">
                            {selectedLang === "Ar" ? (
                              <>
                                {"  "}
                                {intl.formatMessage({ id: "Datee" })}
                                {"  "}
                                {intl.locale === "ar"
                                  ? item.statusNameAr.includes("")
                                    ? item?.statusNameAr.replace("تم", "")
                                    : item.statusNameAr
                                  : item?.statusNameEn}
                              </>
                            ) : (
                              <>
                                {"  "}
                                {intl.locale === "ar"
                                  ? item.statusNameAr.includes("")
                                    ? item?.statusNameAr.replace("تم", "")
                                    : item.statusNameAr
                                  : item?.statusNameEn}
                                {"  "}
                                {intl.formatMessage({ id: "Datee" })}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {item?.statusNameAr === "الارسال" && (
                      <div className="row my-4  text-center">
                        <div className="col-md-12 mt-5 col-9">
                          <div className="border border-gray-300 rounded min-w-125px py-3 px-4 me-6 mb-3 ">
                            <p className="mb-0 py-2 fw-bolder d-flex justify-content-start align-items-center">
                              {" "}
                              <i className="fa fa-genderless text-warning fs-5 mx-3"></i>{" "}
                              {item?.note ? (
                                item?.note
                              ) : (
                                <span className="text-gray-500">
                                  {intl.formatMessage({ id: "NotExist" })}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {item?.statusNameAr !== "الارسال" &&
                      item?.statusNameAr !== "تم استلام" && (
                        <div className="row my-4  text-center">
                          <div className="col-md-12 mt-5 col-9">
                            <div className="border border-gray-300 rounded min-w-125px py-3 px-4 me-6 mb-3 ">
                              <p className="mb-0 py-2 fw-bolder d-flex justify-content-start align-items-center">
                                {" "}
                                <i className="fa fa-genderless text-warning fs-5 mx-3"></i>{" "}
                                {intl.locale === "ar" ? (
                                  <>
                                    <span className="mx-3">
                                      {intl.formatMessage({ id: "Reason1" })}{" "}
                                      {intl.locale === "ar"
                                        ? item.statusNameAr.includes("تم")
                                          ? item?.statusNameAr.replace("تم", "")
                                          : item?.statusNameAr
                                        : item?.statusNameEn}{" "}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="mx-3">
                                      {intl.locale === "ar"
                                        ? item.statusNameAr.includes("تم")
                                          ? item?.statusNameAr.replace("تم", "")
                                          : item?.statusNameAr
                                        : item?.statusNameEn}{" "}
                                      {intl.formatMessage({ id: "Reason1" })}{" "}
                                    </span>
                                  </>
                                )}
                                {"  :  "}
                                {item?.reason ? (
                                  <span className="mx-3">{item?.reason}</span>
                                ) : (
                                  <span className="text-gray-500">
                                    {intl.formatMessage({ id: "NotExist" })}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    {item?.statusNameAr === "تم اكتمال" &&
                      (item?.attatchment ? (
                        (() => {
                          const fileURL = item?.attatchment;
                          const fileName = fileURL.substring(
                            fileURL.lastIndexOf("/") + 1
                          );
                          return (
                            <>
                              <div className="row my-4 text-center">
                                <div className="col-md-12 mt-5 col-9">
                                  <div className="border border-gray-300 rounded min-w-125px py-3 px-4 me-6 mb-3">
                                    <div className="d-flex justify-content-between align-items-center py-3">
                                      <a
                                        rel="noreferrer"
                                        href={`${
                                          TicketingSystemAggRootUrl +
                                          item?.attatchment
                                        }`}
                                        target="_blank"
                                      >
                                        <div className="d-flex align-items-center justify-content-center h-70px">
                                          <img
                                            src={getIconSrc(
                                              fileName,
                                              { filePath: item?.attatchment },
                                              TicketingSystemAggRootUrl
                                            )}
                                            onError={(e: any) => {
                                              e.target.src =
                                                getIconSrcError(fileName);
                                            }}
                                            className="d-block h-50px w-50px rounded mx-2"
                                            alt=""
                                          />
                                          <div>
                                            <p className="text-dark-75 pt-2 mb-4 fw-bolder fs-6 text-hover-primary font-size-lg">
                                              {fileName}
                                            </p>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <div className="row my-4  text-center">
                          <div className="col-md-12 mt-5 col-9">
                            <div className="border border-gray-300 rounded min-w-125px py-3 px-4 me-6 mb-3 ">
                              <p className="mb-0 py-2 fw-bolder d-flex justify-content-start align-items-center">
                                {" "}
                                <i className="fa fa-genderless text-warning fs-5 mx-3"></i>{" "}
                                <span className="text-gray-500">
                                  {intl.formatMessage({ id: "NoAttachments" })}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default StepsTab;
