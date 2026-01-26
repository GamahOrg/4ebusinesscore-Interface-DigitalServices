import moment from "moment";
import { AssignActions } from "./AssignActions";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { RequestStatus } from "../../../../enums/request-status-enum";
function AssignRequestsTable({
  assignRequestsWithFilter,
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
              <th className="px-2 pb-3 min-w-50px max-w-350px text-muted">
                {systemId
                  ? intl.formatMessage({ id: "CourseTitle" })
                  : intl.formatMessage({ id: "RequestAddress" })}
              </th>
              <th className="px-2 pb-3 min-w-50px max-w-350px text-muted">
                {intl.formatMessage({ id: "Applicant" })}
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
            {assignRequestsWithFilter?.map((item: any, index: number) => {
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
                              ? `/approvals-requests/${item?.assginRequsetId}/details-for-assign/${systemId}`
                              : location?.pathname === "/approvals-requests"
                              ? `/approvals-requests/${item?.assginRequsetId}/details-for-assign`
                              : `/user-profile/requests/${item?.assginRequsetId}/details-for-assign`,
                            {
                              state: { cardId: cardId, cardTitle: cardName },
                            }
                          );
                        }}
                      >
                        {item?.requestNumber}
                      </div>
                    </td>
                    <td className="text-center position-relative">
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
                              ? `/approvals-requests/${item?.assginRequsetId}/details-for-assign/${systemId}`
                              : location?.pathname === "/approvals-requests"
                              ? `/approvals-requests/${item?.assginRequsetId}/details-for-assign`
                              : `/user-profile/requests/${item?.assginRequsetId}/details-for-assign`,
                            {
                              state: { cardId: cardId, cardTitle: cardName },
                            }
                          );
                        }}
                      >
                        {item?.name}
                      </div>
                    </td>

                    <td className="text-muted text-center">
                      {item?.createdByFirstName +
                        " " +
                        (item?.createdByFourthName
                          ? item?.createdByFourthName
                          : item?.createdByThirdName
                          ? item?.createdByThirdName
                          : item?.createdBySecondName)}
                    </td>

                    <td>
                      <p className="text-primary fw-bolder fs-5 cursor-pointer my-0 py-0 text-center">
                        {intl?.locale.toLowerCase() == "ar"
                          ? item?.orgNameAr
                          : item?.orgNameEn}
                      </p>
                    </td>
                    <td className="text-muted text-center">
                      {item.requestCategoryName}
                    </td>
                    <td className="text-center">
                      {moment(item?.date).format("YYYY-MM-DD")}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badgex fw-bold py-2 px-5 mx-auto ${
                          item?.requestStatus == RequestStatus.Rejected
                            ? "badge-light-danger"
                            : item?.requestStatus == RequestStatus.Cancel
                            ? "badge-light-danger"
                            : item?.requestStatus == RequestStatus.Accepted ||
                              item?.requestStatus ==
                                RequestStatus.ExceptionApproved
                            ? "badge-light-success"
                            : item?.requestStatus == RequestStatus.Pinding
                            ? "badge-light-warning"
                            : ""
                        }`}
                      >
                        {item?.requestStatus == RequestStatus.Rejected
                          ? intl.formatMessage({
                              id: "Rejected",
                            })
                          : item?.requestStatus == RequestStatus.Accepted
                          ? intl.formatMessage({
                              id: "Accepted",
                            })
                          : item?.requestStatus == RequestStatus.Pinding
                          ? intl.formatMessage({
                              id: "Pinding",
                            })
                          : item?.requestStatus == RequestStatus.Cancel
                          ? intl.formatMessage({
                              id: "Canceled",
                            })
                          : item?.requestStatus ==
                            RequestStatus.ExceptionApproved
                          ? intl.formatMessage({
                              id: "ExceptionApproved",
                            })
                          : ""}
                      </span>
                    </td>
                    <td className="text-center">
                      <AssignActions
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

export default AssignRequestsTable;
