import { useIntl } from "react-intl";
import moment from "moment";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { SuggestedActions } from "./SuggestedActions";

function SuggestedRequestsTable({
  suggestedRequestsWithFilter,
  systemId,
  location,
}: any) {
  let intl = useIntl();
  const navigate = useNavigate();
  let cardName = location?.state?.cardTitle;
  let cardId = location?.state?.cardId;

  return (
    <div>
      <div className="table-responsive mb-3">
        <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 text-center dark-table-head">
          <thead>
            <tr className="fw-bolder projectSecColor">
              <th className="px-2 pb-3 min-w-50px max-w-150px text-muted">
                {intl.formatMessage({ id: "RequestNumber" })}
              </th>
              <th className="px-2 pb-3 min-w-150px max-w-350px text-muted">
                {systemId
                  ? intl.formatMessage({ id: "CourseTitle" })
                  : intl.formatMessage({ id: "RequestAddress" })}
              </th>
              <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                {intl.formatMessage({ id: "AdminstrationName" })}{" "}
              </th>
              <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                {intl.formatMessage({ id: "OrderType" })}{" "}
              </th>
              <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                {systemId === "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02"
                  ? intl.formatMessage({ id: "SubmissionDate" })
                  : intl.formatMessage({ id: "Date" })}
              </th>
              <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                {intl.formatMessage({ id: "RequestStatus" })}{" "}
              </th>
              <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                {intl.formatMessage({ id: "Procedures" })}{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {suggestedRequestsWithFilter?.map((item: any, index: number) => {
              return (
                <Fragment key={Math.random()}>
                  <tr className="align-middle ">
                    <td className="text-center">
                      <div
                        className="text-primary"
                        role="button"
                        onClick={() => {
                          navigate(
                            systemId
                              ? `/approvals-requests/${item?.id}/details-for-suggesting/${systemId}`
                              : location?.pathname === "/approvals-requests"
                                ? `/approvals-requests/${item?.id}/details-for-suggesting`
                                : `/user-profile/requests/${item?.id}/details-for-suggested`,
                            {
                              state: { cardId: cardId, cardTitle: cardName },
                            }
                          );
                        }}
                      >
                        {item?.requestNumber}
                      </div>
                    </td>
                    <td
                      className={`text-center position-relative ${
                        item?.requestStatus == 2 || item?.requestStatus == 5
                          ? "text-danger"
                          : item?.requestStatus == 1 || item?.requestStatus == 6
                            ? "text-success"
                            : item?.requestStatus == 0
                              ? "text-warning"
                              : item?.requestStatus == 3
                                ? "text-primary"
                                : "text-secondary"
                      }`}
                    >
                      <div
                        className="text-primary truncate-text mx-auto"
                        style={{
                          width: "250px",
                          minWidth: "50px",
                          maxWidth: "300px",
                        }}
                        role="button"
                        onClick={() => {
                          navigate(
                            systemId
                              ? `/approvals-requests/${item?.id}/details-for-suggesting/${systemId}`
                              : location?.pathname === "/approvals-requests"
                                ? `/approvals-requests/${item?.id}/details-for-suggesting`
                                : `/user-profile/requests/${item?.id}/details-for-suggested`,
                            {
                              state: { cardId: cardId, cardTitle: cardName },
                            }
                          );
                        }}
                      >
                        {item?.requestName}
                      </div>
                    </td>
                    <td className="text-muted text-center">
                      {item?.organizationName}
                    </td>
                    <td className="text-muted text-center">
                      {item.requestCategoryName}
                    </td>
                    <td className="text-center">
                      {moment(item?.requestDate).format("YYYY-MM-DD")}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badgex fw-bold py-2 px-5 mx-auto ${
                          item?.requestStatus == 2 || item?.requestStatus == 5
                            ? "badge-light-danger"
                            : item?.requestStatus == 1 ||
                                item?.requestStatus == 6
                              ? "badge-light-success"
                              : item?.requestStatus == 0
                                ? "badge-light-warning"
                                : item?.requestStatus == 3
                                  ? "badge-light-primary"
                                  : "badge-light-secondary"
                        }`}
                      >
                        {item?.requestStatus == 0
                          ? intl.formatMessage({
                              id: "UnderProcedure",
                            })
                          : item?.requestStatus == 1
                            ? intl.formatMessage({
                                id: "Accepted",
                              })
                            : item?.requestStatus == 2
                              ? intl.formatMessage({
                                  id: "Rejected",
                                })
                              : item?.requestStatus == 3
                                ? intl.formatMessage({
                                    id: "RequireEdit",
                                  })
                                : item?.requestStatus == 5
                                  ? intl.formatMessage({
                                      id: "Canceled",
                                    })
                                  : item?.requestStatus == 4
                                    ? intl.formatMessage({
                                        id: "Redirect",
                                      })
                                    : item?.requestStatus == 6
                                      ? intl.formatMessage({
                                          id: "ExceptionApproved",
                                        })
                                      : ""}
                      </span>
                    </td>
                    <td className="text-center">
                      <SuggestedActions
                        id={index}
                        item={item}
                        systemId={systemId}
                        location={location}
                      />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuggestedRequestsTable;
