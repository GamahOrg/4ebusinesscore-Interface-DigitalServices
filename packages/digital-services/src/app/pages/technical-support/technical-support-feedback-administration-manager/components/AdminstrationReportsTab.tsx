import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { StatisticsReportAdministration } from "../../../../models/StatisticsReportEmployee/StatisticsReportAdministration-model";
import { fetchStatisticsReportAdministrationForAdministrationManager } from "../../../../redux/features/service-operation/StatisticsReportEmployee/StatisticsReportAdministrationForAdministrationManager";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { Dropdown } from "react-bootstrap";
import Spinner from "react-bootstrap/esm/Spinner";

function AdminstrationReportsTab() {
  let intl = useIntl();
  let [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedValue, setSelectedValue] = useState(
    intl.formatMessage({ id: "AllCategories" })
  );
  const [selectedTypeValue, setSelectedTypeValue] = useState(
    intl.formatMessage({ id: "ServiceType" })
  );
  let RequestType = 0;

  if (selectedTypeValue == intl.formatMessage({ id: "ServiceType" })) {
    RequestType = 2;
  } else if (selectedTypeValue == intl.formatMessage({ id: "Report_2" })) {
    RequestType = 0;
  } else if (selectedTypeValue == intl.formatMessage({ id: "Request" })) {
    RequestType = 1;
  }

  const [selectedMainClassificationIds, setSelectedMainClassificationIds] =
    useState<string | null>(null);

  let mainClassificationData = useSelector((state: RootState) => {
    return state?.mainClassificationLoginUser.mainclassficationloggedinData;
  });
  let statisticsReport = useSelector((state: RootState) => {
    return state?.StatisticsReportAdministrationForAdministrationManager;
  });
  useEffect(() => {
    const params = {
      pageSize: pageSize,
      pageNumber: pageIndex,
      ClassificationId: selectedMainClassificationIds,
      RequestType: RequestType,
    };
    setLoading(true);
    dispatch(
      fetchStatisticsReportAdministrationForAdministrationManager(params) as any
    ).then(() => {
      setLoading(false);
    });
  }, [selectedMainClassificationIds, pageSize, pageIndex, RequestType]);

  return (
    <Fragment>
      <div className="card-body py-3 pb-7">
        <div className="card-header border-0 pt-3 pb-2 mb-2">
          <h3 className="card-title align-items-start flex-column w-50">
            <div className="mb-2 pt-2 pb-3 w-400px d-flex gap-2 flex-column flex-md-row">
              <Dropdown
                onSelect={(eventKey) => {
                  const value: any =
                    eventKey === "all"
                      ? intl.formatMessage({ id: "AllCategories" })
                      : intl.locale == "ar"
                      ? mainClassificationData?.find(
                          (classification) => classification.id === eventKey
                        )?.name
                      : mainClassificationData?.find(
                          (classification) => classification.id === eventKey
                        )?.nameEn;
                  setSelectedValue(value);
                  setSelectedMainClassificationIds(
                    eventKey === "all" ? null : eventKey
                  );
                }}
                className="w-80"
              >
                <Dropdown.Toggle
                  variant="null"
                  id="dropdown-basic"
                  className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                >
                  {selectedValue}
                </Dropdown.Toggle>

                <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                  <Dropdown.Item
                    eventKey="all"
                    className="DropDownOptions py-1"
                  >
                    {intl.formatMessage({ id: "AllCategories" })}
                  </Dropdown.Item>
                  {Array.isArray(mainClassificationData) &&
                    mainClassificationData
                      ?.filter((item: any) => item?.isShowInHomePage === true)
                      ?.map((role: any) => (
                        <Dropdown.Item
                          className="DropDownOptions py-1"
                          key={role.id}
                          eventKey={role.id}
                        >
                          {intl?.locale.toLowerCase() === "ar"
                            ? role?.name
                            : role?.nameEn}
                        </Dropdown.Item>
                      ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown
                onSelect={(eventKey: any) => {
                  setSelectedTypeValue(eventKey);
                }}
                className="w-80"
              >
                <Dropdown.Toggle
                  variant="null"
                  id="dropdown-basic"
                  className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                >
                  {selectedTypeValue}
                </Dropdown.Toggle>

                <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                  <Dropdown.Item
                    className="DropDownOptions py-1"
                    key={2}
                    eventKey={intl.formatMessage({ id: "ServiceType" })}
                  >
                    {intl.formatMessage({ id: "ServiceType" })}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="DropDownOptions py-1"
                    key={0}
                    eventKey={intl.formatMessage({ id: "Report_2" })}
                  >
                    {intl.formatMessage({ id: "Report_2" })}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="DropDownOptions py-1"
                    key={1}
                    eventKey={intl.formatMessage({ id: "Request" })}
                  >
                    {intl.formatMessage({ id: "Request" })}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </h3>
        </div>
        <div className="mb-5 mt-7 container-xxl">
          {loading ? (
            <>
              <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                {intl.formatMessage({ id: "DataIsLoaded..." })}
                <Spinner animation="border" variant="primary" />
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="table-responsive mt-3 pb-7">
                {statisticsReport?.statisticsReportEmployee ? (
                  <table className="dark-table-head table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 text-center">
                    <thead>
                      <tr className="fw-bolder text-muted">
                        <th className="min-w-200px text-center">
                          {intl.formatMessage({ id: "Department" })}
                        </th>
                        <th className="min-w-200px text-center">
                          {intl.formatMessage({ id: "Total2" })}
                        </th>
                        <th className="min-w-200px text-center">
                          {intl.formatMessage({
                            id: "Completed",
                          })}{" "}
                        </th>
                        <th className="min-w-200px text-center">
                          {intl.formatMessage({
                            id: "Latest",
                          })}{" "}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {statisticsReport?.statisticsReportEmployee?.map(
                        (item: StatisticsReportAdministration, index) => {
                          return (
                            <Fragment key={Math.random()}>
                              <tr>
                                <td className="text-center">
                                  {intl.locale == "ar"
                                    ? item.mainClassificationName
                                    : item.mainClassificationNameEn}
                                </td>

                                <td className="text-center text-primary">
                                  {item.allReports}
                                </td>
                                <td className="text-center text-success">
                                  {item.solved}
                                </td>
                                <td className="text-center text-danger">
                                  {item.lateReport}
                                </td>
                              </tr>
                            </Fragment>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                ) : (
                  <span className="d-flex justify-content-center py-10 text-muted">
                    {intl.formatMessage({ id: "NotExist" })}{" "}
                    <i className="fa-solid fa-ban px-3 fs-4"></i>
                  </span>
                )}
              </div>
              {statisticsReport.statisticsReportEmployee ? (
                <SystemPagination
                  totalItems={statisticsReport?.taotalItems}
                  totalPages={statisticsReport?.totalpages}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default AdminstrationReportsTab;
