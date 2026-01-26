import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { fetchStatisticsReportAdministrationForTechnicalSupportManager } from "../../../../redux/features/service-operation/StatisticsReportEmployee/StatisticsReportAdministrationForTechnicalSupportManager";
import { StatisticsReportAdministration } from "../../../../models/StatisticsReportEmployee/StatisticsReportAdministration-model";
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
    return state?.GetAllmainClassification.data;
  });

  let statisticsReport = useSelector((state: RootState) => {
    return state?.StatisticsReportAdministrationForTechnicalSupportManager;
  });

  useEffect(() => {
    const prams = {
      pageSize: pageSize,
      pageNumber: pageIndex,
      ClassificationId: selectedMainClassificationIds,
      RequestType: RequestType,
    };
    setLoading(true);
    dispatch(
      fetchStatisticsReportAdministrationForTechnicalSupportManager(
        prams
      ) as any
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
              <select
                className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1 w-70"
                value={selectedMainClassificationIds || "all"}
                onChange={(e) => {
                  const eventKey = e.target.value;
                  const value =
                    eventKey === "all"
                      ? intl.formatMessage({ id: "AllCategories" })
                      : intl.locale == "ar"
                      ? mainClassificationData?.find(
                          (classification) => classification.id === eventKey
                        )?.name
                      : mainClassificationData?.find(
                          (classification) => classification.id === eventKey
                        )?.nameEn;
                  setSelectedValue(value as string);
                  setSelectedMainClassificationIds(
                    eventKey === "all" ? null : eventKey
                  );
                }}
              >
                <option value="all">
                  {intl.formatMessage({ id: "AllCategories" })}
                </option>
                {mainClassificationData?.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {intl.locale == "ar" ? role?.name : role?.nameEn}
                  </option>
                ))}
              </select>

              <select
                className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1 w-70"
                value={selectedTypeValue}
                onChange={(e) => setSelectedTypeValue(e.target.value)}
              >
                <option value={intl.formatMessage({ id: "ServiceType" })}>
                  {intl.formatMessage({ id: "ServiceType" })}
                </option>
                <option value={intl.formatMessage({ id: "Report_2" })}>
                  {intl.formatMessage({ id: "Report_2" })}
                </option>
                <option value={intl.formatMessage({ id: "Request" })}>
                  {intl.formatMessage({ id: "Request" })}
                </option>
              </select>
            </div>
          </h3>
          <div className="card-toolbar "></div>
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
              <div className="table-responsive mt-3 pb-7">
                <table className="dark-table-head table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
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
                                {intl.locale=="ar"?item.mainClassificationName:item.mainClassificationNameEn}
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
              </div>
              {statisticsReport.statisticsReportEmployee ? (
                <SystemPagination
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                  totalItems={statisticsReport?.taotalItems}
                  totalPages={statisticsReport?.totalpages}
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
