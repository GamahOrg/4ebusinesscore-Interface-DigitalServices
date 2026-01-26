import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { OutgoingActions } from "./OutgoingActions";
import moment from "moment";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { fetchArchivedRequestsWithFilter } from "../../../../redux/features/requests-slice/archived-requests-slice";
import { RequestStatus } from "../../../../enums/request-status-enum";
import RequestsFilterForArchivePopup from "../popups/RequestsFilterForArchivePopup";

function RequestsTableForArchive() {
  let intl = useIntl();
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);

  let [archivedRequestsWithFilter, setArchivedRequestsWithFilter] = useState(
    []
  );
  let [totalItems, setTotalItems] = useState(0);
  let [totalPages, setTotalPages] = useState(0);

  const [showFilter, setShowFilter] = useState(false);
  const handleClose = () => setShowFilter(false);
  useEffect(() => {
    let params: any = {
      pageSize: pageSize,
      pageNumber: pageIndex,
    };
    dispatch(fetchArchivedRequestsWithFilter({ body: {}, params }) as any).then(
      (res: any) => {
        setArchivedRequestsWithFilter(res?.payload?.result);
        setTotalItems(res?.payload?.totalItems);
        setTotalPages(res?.payload?.totalPages);
      }
    );
  }, [pageSize, pageIndex, dispatch]);
  return (
    <Fragment>
      <div className="detailsCard my-5">
        <div className="card card-xl-stretch mb-xl-8">
          <div className="card-body py-3">
            <div className="mb-8 mt-3 pe-5 d-flex w-100 justify-content-between">
              <div className="d-flex w-75"></div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowFilter(true);
                }}
              >
                {intl.formatMessage({ id: "Filtering" })}
              </button>
            </div>

            {archivedRequestsWithFilter?.length > 0 ? (
              <>
                <div className="table-responsive mb-3">
                  <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 text-center dark-table-head">
                    <thead>
                      <tr className="fw-bolder projectSecColor">
                        <th className="px-2 pb-3 min-w-50px max-w-350px text-muted">
                          {intl.formatMessage({ id: "RequestNumber" })}
                        </th>
                        <th className="px-2 pb-3 min-w-150px max-w-350px text-muted">
                          {intl.formatMessage({ id: "RequestAddress" })}
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
                          {intl.formatMessage({ id: "Date" })}{" "}
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
                      {archivedRequestsWithFilter?.map((item: any, index) => {
                        return (
                          <Fragment key={Math.random()}>
                            <tr className="align-middle ">
                              <td className="text-center">
                                <div
                                  className="text-primary"
                                  role="button"
                                  onClick={() => {
                                    navigate(
                                      `/user-profile/requests/${item?.id}/details-for-outgoing`
                                    );
                                  }}
                                >
                                  {item?.requestNumber}
                                </div>
                              </td>
                              <td className="text-center position-relative">
                                <div
                                  className="text-primary truncate-text"
                                  role="button"
                                  onClick={() => {
                                    navigate(
                                      `/user-profile/requests/${item?.id}/details-for-outgoing`
                                    );
                                  }}
                                >
                                  {item?.name}
                                </div>
                              </td>

                              <td className="text-muted text-center">
                                {item?.createdByFirstName +
                                  " " +
                                  item?.createdByFourthName}
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
                                    item?.requestStatus ==
                                    RequestStatus.Rejected
                                      ? "badge-light-danger"
                                      : item?.requestStatus ==
                                            RequestStatus.Accepted ||
                                          item?.requestStatus ==
                                            RequestStatus.ExceptionApproved
                                        ? "badge-light-success"
                                        : item?.requestStatus ==
                                            RequestStatus.Pinding
                                          ? "badge-light-warning"
                                          : ""
                                  }`}
                                >
                                  {item?.requestStatus == RequestStatus.Rejected
                                    ? intl.formatMessage({ id: "Rejected" })
                                    : item?.requestStatus ==
                                        RequestStatus.Accepted
                                      ? intl.formatMessage({ id: "Accepted" })
                                      : item?.requestStatus ==
                                          RequestStatus.Pinding
                                        ? intl.formatMessage({ id: "Pinding" })
                                        : item?.requestStatus ==
                                            RequestStatus.ExceptionApproved
                                          ? intl.formatMessage({
                                              id: "ExceptionApproved",
                                            })
                                          : ""}
                                </span>
                              </td>
                              <td className="text-center">
                                <OutgoingActions id={index} item={item} />
                              </td>
                            </tr>
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <SystemPagination
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                />
              </>
            ) : (
              <>
                {" "}
                <div className=" py-10 text-center">
                  <p> {intl.formatMessage({ id: "NotFoundResults" })}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <RequestsFilterForArchivePopup
        show={showFilter}
        handleClose={() => {
          handleClose();
        }}
        {...{ setTotalItems, setTotalPages, setArchivedRequestsWithFilter }}
      />
    </Fragment>
  );
}

export default RequestsTableForArchive;
