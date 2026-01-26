import { FC, Fragment } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ResponseReport } from "../../../../models/get-report/ResponseReport";
import moment from "moment";
import { Pagination } from "@4eplatform/shared/models/Pagination";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import {
  getStatusClass,
  getStatusLabel,
} from "@4eplatform/shared/functions/getTechincalSupportStatus";
import { DisplayNameOneProps } from "@4eplatform/shared/functions/displayName";

interface Props {
  responseReport: ResponseReport | undefined;
  pagination?: Pagination;
  tabName?: string;
  integrationId?: string;
}
const ContinuedTab: FC<Props> = ({
  responseReport,
  pagination,
  tabName,
  integrationId,
}) => {
  let intl = useIntl();
  let navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  let location = useLocation();
  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";
  const prevLocation =
    location?.pathname?.includes("available-applicants-table") ||
    location?.pathname?.includes("applicants-requests")
      ? location?.pathname
      : null;

  const { systemId } = useParams();
  return (
    <Fragment>
      <div className={`tab-pane`} id="continued-reports-tab">
        {" "}
        <div className="mb-5">
          <div className="table-responsive mb-3">
            {responseReport?.reports?.length ? (
              <table className="dark-table-head table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 text-center">
                <thead>
                  <tr className="fw-bolder">
                    <th className="px-2 pb-3 min-w-50px max-w-350px text-muted">
                      {intl.formatMessage({ id: "ReportNumber" })}
                    </th>

                    <th className="px-2 pb-3 min-w-50px  text-muted">
                      {intl.formatMessage({
                        id: integrationId ? "Requests" : "TheTicket",
                      })}
                    </th>
                    <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                      {intl.formatMessage({ id: "Type2" })}{" "}
                    </th>
                    <th className="px-2 pb-3 min-w-50px  text-muted">
                      {intl.formatMessage({ id: "Category" })}{" "}
                    </th>
                    {!integrationId && (
                      <>
                        <th className="px-2 pb-3 min-w-50px max-w-100px text-muted">
                          {intl.formatMessage({ id: "TicketOwner" })}{" "}
                        </th>
                        <th className="px-4 pb-3 min-w-50px  text-muted">
                          {intl.formatMessage({ id: "Rating" })}{" "}
                        </th>
                      </>
                    )}
                    {/* <th className="px-2 pb-3 min-w-50px  text-muted">
                      {intl.formatMessage({ id: "Priority" })}{" "}
                    </th> */}
                    <th className="px-2 pb-3 min-w-50px  text-muted">
                      {intl.formatMessage({ id: "Status" })}{" "}
                    </th>
                    <th className="px-2 pb-3 min-w-50px  text-muted">
                      {intl.formatMessage({ id: "Date" })}{" "}
                    </th>
                    <th className="px-2 pb-3 min-w-50px  text-muted">
                      {intl.formatMessage({ id: "LastUpdate" })}{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responseReport?.reports?.map((item) => {
                    const fullName = DisplayNameOneProps(
                      item?.administrationEmployee
                    );
                    const fullNameTechnication = DisplayNameOneProps(
                      item?.technicalSupportEmployee
                    );
                    return (
                      <Fragment key={Math.random()}>
                        <tr>
                          <td
                            onClick={() => {
                              if (tabName === "my-reports") {
                                systemId
                                  ? navigate(
                                      `/available-applicants-details/${item.idReport}/details`,
                                      {
                                        state: {
                                          tabName: tabName,
                                          serviceName: cardTitle,
                                          prevLocation,
                                        },
                                      }
                                    )
                                  : navigate(
                                      `/technical-support-feedbacks-adminstration-manager/${item.idReport}/details`,
                                      {
                                        state: {
                                          tabName: tabName,
                                          serviceName: cardTitle,
                                          prevLocation,
                                        },
                                      }
                                    );
                              } else
                                navigate(
                                  `/technical-support-feedbacks-adminstration-manager/${item.idReport}/details`,
                                  {
                                    state: {
                                      serviceName: cardTitle,
                                      prevLocation,
                                    },
                                  }
                                );
                            }}
                            className="text-center text-primary cursor-pointer"
                          >
                            {item.reportNumber}
                          </td>
                          <td
                            style={{
                              width: "250px",
                              minWidth: "50px",
                              maxWidth: "300px",
                            }}
                          >
                            <p
                              className="text-primary cursor-pointer fs-5 text-center p-0 m-0 truncate-text"
                              style={{
                                width: "250px",
                                minWidth: "50px",
                                maxWidth: "300px",
                              }}
                              onClick={() => {
                                if (tabName === "my-reports") {
                                  systemId
                                    ? navigate(
                                        `/available-applicants-details/${item.idReport}/details`,
                                        {
                                          state: {
                                            tabName: tabName,
                                            serviceName: cardTitle,
                                            prevLocation,
                                          },
                                        }
                                      )
                                    : navigate(
                                        `/technical-support-feedbacks-adminstration-manager/${item.idReport}/details`,
                                        {
                                          state: {
                                            tabName: tabName,
                                            serviceName: cardTitle,
                                            prevLocation,
                                          },
                                        }
                                      );
                                } else
                                  navigate(
                                    `/technical-support-feedbacks-adminstration-manager/${item.idReport}/details`,
                                    {
                                      state: {
                                        serviceName: cardTitle,
                                        prevLocation,
                                      },
                                    }
                                  );
                              }}
                            >
                              {item.reportTitle}
                            </p>
                            <p
                              onClick={() => {
                                if (tabName === "my-reports") {
                                  systemId
                                    ? navigate(
                                        `/available-applicants-details/${item.idReport}/details`,
                                        {
                                          state: {
                                            tabName: tabName,
                                            serviceName: cardTitle,
                                            prevLocation,
                                          },
                                        }
                                      )
                                    : navigate(
                                        `/technical-support-feedbacks-adminstration-manager/${item.idReport}/details`,
                                        {
                                          state: {
                                            tabName: tabName,
                                            serviceName: cardTitle,
                                            prevLocation,
                                          },
                                        }
                                      );
                                } else
                                  navigate(
                                    `/technical-support-feedbacks-adminstration-manager/${item.idReport}/details`,
                                    {
                                      state: {
                                        serviceName: cardTitle,
                                        prevLocation,
                                      },
                                    }
                                  );
                              }}
                              className="text-primary fs-6 text-center cursor-pointer truncate-text"
                              style={{
                                width: "250px",
                                minWidth: "50px",
                                maxWidth: "300px",
                              }}
                            >
                              {item.commanName ? item.commanName : fullName}
                            </p>
                          </td>
                          <td className="text-center px-2">
                            {item.categoryName}
                          </td>
                          <td className="text-center px-2">
                            {item.mainClassificationName}
                          </td>
                          {!integrationId && (
                            <>
                              <td
                                className={`${
                                  theme === "dark"
                                    ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                    : "text-dark fs-5 text-center p-0 m-0"
                                } px-2`}
                              >
                                {fullNameTechnication}
                              </td>
                              <td
                                className={`${
                                  theme === "dark"
                                    ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                    : "text-dark fs-5 text-center p-0 m-0"
                                } px-2`}
                              >
                                {item?.ratingsReportStatus || "ـ ـ ـ"}
                              </td>
                            </>
                          )}
                          {/* <td className="text-center">
                            {" "}
                            {item.priorityLevel === 1
                              ? "مرتفع"
                              : item.priorityLevel === 2
                                ? "متوسط"
                                : item.priorityLevel === 3
                                  ? "منخفض"
                                  : "غير معرفه"}
                          </td> */}
                          <td className="text-center px-2">
                            <p className={`${getStatusClass(item?.status)}`}>
                              {getStatusLabel(item?.status, intl)}
                            </p>
                          </td>
                          <td className="text-center">
                            <p className="text-muted p-0 px-2 m-0">
                              {moment(item.date).format("YYYY-MM-DD")}
                            </p>
                          </td>
                          <td className="text-center px-2">
                            {moment(item.lastUpdate).format("YYYY-MM-DD")}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <span className="d-flex justify-content-center py-10 text-muted">
                {intl.formatMessage({ id: "NotExist" })}{" "}
                <i className="fa-solid fa-ban px-3 fs-4"></i>
              </span>
            )}
          </div>
          {responseReport?.reports?.length ? (
            <SystemPagination
              totalItems={pagination?.totalItems}
              totalPages={pagination?.totalPages}
              pageIndex={pagination?.pageIndex}
              pageSize={pagination?.pageSize}
              setPageIndex={pagination?.setPageIndex}
              setPageSize={pagination?.setPageSize}
            />
          ) : null}
        </div>
      </div>
    </Fragment>
  );
};

export default ContinuedTab;
