import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { NotificationsList } from "./NotificationsList";
import { getAllNotificationSettings } from "../../../../redux/features/notifications/notificationsSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import Spinner from "react-bootstrap/esm/Spinner";

export const SystemNotifications: FC = () => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(
        getAllNotificationSettings({
          PageNumber: currentPage,
          PageSize: pageSize,
        }) as any
      );
      setLoading(false);
    };
    fetchData();
  }, [currentPage, pageSize]);
  const notifications = useSelector((state: RootState) => {
    return state?.notifications?.notifications;
  });
  let pagination = useSelector((state: RootState) => {
    return state?.notifications?.pagination;
  });
  return (
    <>
      <div className="d-flex flex-column-fluid align-items-start container-xxl p-0">
        <div className="content flex-row-fluid" id="kt_content">
          <div
            className="flex-lg-row-fluid"
            data-select2-id="select2-data-129-tmo1"
          >
            <div className=" mb-5 mb-xl-8">
              <div className="card-body py-3">
                {isLoading ? (
                  <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                    {intl.formatMessage({ id: "DataIsLoaded..." })}
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className="table-responsive">
                    {notifications && notifications?.length > 0 ? (
                      <table
                        className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4"
                        id="REGA-WS-caseList"
                      >
                        <thead>
                          <tr className="fw-bolder text-muted">
                            <th className="min-w-50px">
                              {intl.formatMessage({ id: "CommitteesID" })}
                            </th>
                            <th className="min-w-250px ">
                              {intl.formatMessage({ id: "Cardname" })}
                            </th>
                            <th className="min-w-150px text-center">
                              {intl.formatMessage({ id: "Notification" })}
                            </th>
                            <th className="min-w-150px text-center">
                              {intl.formatMessage({ id: "EmailNotification" })}
                            </th>
                            <th className="min-w-100px text-center">
                              {intl.formatMessage({
                                id: "SystemNotifications",
                              })}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((notification, index) => (
                            <tr key={notification.id}>
                              <NotificationsList
                                notification={notification}
                                index={index}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-dark">
                        {intl.formatMessage({ id: "NoNotificationsFound" })}
                      </div>
                    )}
                    {pagination?.totalPages > 0 && (
                      <SystemPagination
                        totalItems={pagination?.totalItems}
                        totalPages={pagination?.totalPages}
                        pageIndex={currentPage}
                        pageSize={pageSize}
                        setPageIndex={setCurrentPage}
                        setPageSize={setPageSize}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
