import { FC, Fragment } from "react";
import { useIntl } from "react-intl";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { ResponseReport } from "../../../../models/get-report/ResponseReport";
import moment from "moment";
import {
  getStatusClass,
  getStatusLabel,
} from "@4eplatform/shared/functions/getTechincalSupportStatus";
import { DisplayNameOneProps } from "@4eplatform/shared/functions/displayName";

interface Props {
  responseReport: ResponseReport;
}
const ConvertedTab: FC<Props> = ({ responseReport }) => {
  let intl = useIntl();
  let [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const theme = localStorage.getItem("theme");
  const pageNumber = parseInt(searchParams.get("pageNumber") ?? "1", 10);
  let location = useLocation();
  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";
  const mainClassificationId = location?.state?.mainClassificationId || "";
  const { systemId } = useParams();

  return (
    <Fragment>
      <div
        className={`tab-pane fade  ${
          searchParams.get("subTabName") === "converted-reports" ? "show" : ""
        }`}
        id="converted-reports-tab"
      >
        <div className="mb-5">
          <div className="mb-3">
            <table className="dark-table-head table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 text-center">
              <thead>
                <tr className="fw-bolder">
                  <th className="px-2 pb-3 min-w-50px max-w-350px text-muted">
                    {intl.formatMessage({ id: "TicketNumber" })}
                  </th>

                  <th
                    className="px-2 pb-3  text-muted truncate-text"
                    style={{
                      width: "250px",
                      minWidth: "50px",
                      maxWidth: "300px",
                    }}
                  >
                    {intl.formatMessage({ id: "TheTicket" })}
                  </th>
                  <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                    {intl.formatMessage({ id: "Type2" })}{" "}
                  </th>
                  <th className="px-2 pb-3 min-w-50px  text-muted">
                    {intl.formatMessage({ id: "Category" })}{" "}
                  </th>
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
                    {intl.formatMessage({ id: "LastAction" })}{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {responseReport?.reports?.length >= 0
                  ? responseReport?.reports?.map((item) => {
                      const fullName = DisplayNameOneProps(
                        item?.administrationEmployee
                      );
                      return (
                        <Fragment key={Math.random()}>
                          <tr>
                            <td className="text-center text-primary">
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
                                  if (
                                    searchParams.get("tabName") === "my-reports"
                                  ) {
                                    navigate(
                                      `/technical-support-employee-report/${item.idReport}/details`,
                                      {
                                        state: {
                                          mainClassificationId:
                                            mainClassificationId,
                                          serviceName: cardTitle,
                                          systemId,
                                        },
                                      }
                                    );
                                  } else
                                    navigate(
                                      !systemId
                                        ? `/technical-support-feedbacks-employee/${item.idReport}/details`
                                        : `/course-approvals/${item.idReport}/details`,
                                      {
                                        state: {
                                          mainClassificationId:
                                            mainClassificationId,
                                          serviceName: cardTitle,
                                          systemId,
                                        },
                                      }
                                    );
                                }}
                              >
                                {item.reportTitle}
                              </p>
                              <p
                                className="text-primary fs-6 text-center truncate-text"
                                style={{
                                  width: "250px",
                                  minWidth: "50px",
                                  maxWidth: "300px",
                                }}
                              >
                                {item.commanName ? item.commanName : fullName}
                              </p>
                            </td>
                            <td
                              className={`${
                                theme === "dark"
                                  ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                  : "text-dark fs-5 text-center p-0 m-0"
                              }`}
                            >
                              {item.categoryName}
                            </td>
                            <td
                              className={`${
                                theme === "dark"
                                  ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                  : "text-dark fs-5 text-center p-0 m-0"
                              }`}
                            >
                              {item.mainClassificationName}
                            </td>
                            {/* <td
                              className={`${
                                theme === "dark"
                                  ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                  : "text-dark fs-5 text-center p-0 m-0"
                              }`}
                            >
                              {item.priorityLevel === 1
                                ? "عادي"
                                : item.priorityLevel === 2
                                  ? "خطر"
                                  : item.priorityLevel === 3
                                    ? "شديده الخطوره"
                                    : "غير معرفه"}
                            </td> */}
                            <td className="text-center">
                              <p className={`${getStatusClass(item?.status)}`}>
                                {getStatusLabel(item?.status, intl)}
                              </p>
                            </td>
                            <td
                              className={`${
                                theme === "dark"
                                  ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                  : "text-dark fs-5 text-center p-0 m-0"
                              }`}
                            >
                              {item.date != null ? (
                                <>
                                  <span>
                                    {moment(item.date).format("YYYY-MM-DD")}
                                  </span>

                                  <br />
                                  <span>
                                    {moment
                                      .tz(item.date, "UTC")
                                      .tz(
                                        Intl.DateTimeFormat().resolvedOptions()
                                          .timeZone
                                      )
                                      .format("hh:mm a")}
                                  </span>
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td
                              className={`${
                                theme === "dark"
                                  ? "text-white cursor-pointer fs-5 text-center p-0 m-0"
                                  : "text-dark fs-5 text-center p-0 m-0"
                              }`}
                            >
                              {item.lastUpdate != null ? (
                                <>
                                  <span>
                                    {moment(item.lastUpdate).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </span>

                                  <br />
                                  <span>
                                    {moment
                                      .tz(item.lastUpdate, "UTC")
                                      .tz(
                                        Intl.DateTimeFormat().resolvedOptions()
                                          .timeZone
                                      )
                                      .format("hh:mm a")}
                                  </span>
                                </>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConvertedTab;
