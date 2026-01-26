import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import AllTab from "./AllTab";
import SolvedTab from "./SolvedTab";
import ContinuedTab from "./ContinuedTab";
import RejectTab from "./RejectTab";
import ClosedTab from "./ClosedTab";
import LateTab from "./LateTab";
import { DetermineForResponse } from "../../../../models/get-report/ResponseReport";
import FilterPopup from "../popups/FilterPopup";

import { fetchGetReportsForTechnicalSupportEmployee } from "../../../../redux/features/service-operation/report/ReportsForTechnicalSupportEmployeeSlice";
import { fetchGetCount } from "../../../../redux/features/service-operation/report/GetCountSlice";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";

function ReportsTab({
  tabName = "",
  RequestType,
  selectedMainClassificationIds,
  isDelegation,
  search,
  integrationId = "",
  subsystemId = "",
}: any) {
  let intl = useIntl();
  const dispatch = useDispatch();
  const { systemId } = useParams();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [subTabName, setSubTabName] = useState("all-reports");
  const [statisticsReport, setStatisticsReport] = useState(6);
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const isSubSystem =
    localStorage.getItem("mainClassificationId") ===
    "00000000-0000-0000-0000-000000000000";
  const [loadingTabs, setLoadingTabs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const componentMap = {
    0: SolvedTab,
    1: RejectTab,
    2: ClosedTab,
    6: AllTab,
    8: ContinuedTab,
    7: LateTab,
  };

  const SelectedTab =
    componentMap[statisticsReport as keyof typeof componentMap];
  let ReportsForTechnicalSupportEmployee = useSelector((state: RootState) => {
    return state?.ReportsForTechnicalSupportEmployee;
  });

  let mainClassificationData = useSelector((state: RootState) => {
    return state?.mainClassificationLoginUser.mainclassficationloggedinData;
  });

  let countReport = useSelector((state: RootState) => {
    return state?.GetCount.statisticsReport;
  });

  let ReportsPagination = useSelector((state: RootState) => {
    return state?.ReportsForTechnicalSupportEmployee?.pagination;
  });

  useEffect(() => {
    const params = {
      DetermineForResponse:
        DetermineForResponse.GetReportsForTechnicalSupportEmployee,
      ClassificationId: selectedMainClassificationIds,
      delegation: isDelegation,
      Requesttype: RequestType,
      ...((systemId || subsystemId) && {
        subSystemId: systemId || subsystemId,
      }),
      ...(integrationId !== "" && { integrationid: integrationId }),
    };

    if (isSubSystem) {
      dispatch(fetchGetCount(params) as any);
    } else if (selectedMainClassificationIds) {
      dispatch(fetchGetCount(params) as any);
    }
  }, [selectedMainClassificationIds, isDelegation, RequestType, systemId]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        pageSize: pageSize,
        pageNumber: pageIndex,
        ClassificationId: selectedMainClassificationIds,
        statisticsReport: statisticsReport,
        search: search,
        delegation: isDelegation,
        Requesttype: RequestType,
        ...((systemId || subsystemId) && {
          subSystemId: systemId || subsystemId,
        }),
        ...(integrationId !== "" && { integrationid: integrationId }),
      };

      setLoadingTabs((prev) => ({
        ...prev,
        [statisticsReport]: true,
      }));

      try {
        if (isSubSystem || selectedMainClassificationIds) {
          await dispatch(
            fetchGetReportsForTechnicalSupportEmployee(params) as any
          );
        }
      } finally {
        setLoadingTabs((prev) => ({
          ...prev,
          [statisticsReport]: false,
        }));
      }
    };

    fetchData();
  }, [
    isSubSystem,
    selectedMainClassificationIds,
    pageIndex,
    pageSize,
    statisticsReport,
    search,
    isDelegation,
    systemId,
    subsystemId,
    integrationId,
    RequestType,
    dispatch,
  ]);

  return (
    <Fragment>
      <div className="card-body py-3 pb-7">
        {!integrationId && (
          <div className="card-header border-0 pt-3 pb-2 mb-2">
            <h3 className="card-title align-items-start flex-column"></h3>
            <div className="d-flex align-items-center w-100 pb-4"></div>
            <div className="card-toolbar ">
              <div className="d-flex justify-content-between align-items-center mt-3 mt-lg-0 justify-content-lg-end"></div>
            </div>
          </div>
        )}
        <div className="d-flex flex-wrap mb-7 bg-light">
          <button
            className={`w-fit btn d-flex align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName == "all-reports" ? "active" : ""
            }`}
            onClick={() => {
              setSubTabName("all-reports");
              setStatisticsReport(6);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "AllTickets" })}
            <span
              className={`bg-primary opacity-75 h-fit w-fit text-dark mx-2 ${
                intl.locale == "ar" ? "p-1" : ""
              }`}
            >
              {/* {countReport?.allReports ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ==
              6
                ? ReportsPagination.totalItems || 0
                : countReport?.allReports || 0}
            </span>
          </button>
          <button
            className={`w-150px btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName == "solved-reports" ? " active" : ""
            }`}
            onClick={() => {
              setSubTabName("solved-reports");
              setStatisticsReport(0);
              setPageIndex(1);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Complete1" })}
            <span
              className={`bg-success opacity-75 h-fit  mx-3 w-fit text-dark ${
                intl.locale == "ar" ? "p-1" : ""
              }`}
            >
              {/* {countReport?.solved ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ==
              0
                ? ReportsPagination.totalItems || 0
                : countReport?.solved || 0}
            </span>
          </button>
          <button
            className={`w-150px btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName == "continued-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(8);
              setSubTabName("continued-reports");
              setPageIndex(1);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Continued" })}
            <span
              className={`bg-warning opacity-75 h-fit  w-fit mx-3 text-dark ${
                intl.locale == "ar" ? "p-1" : ""
              }`}
            >
              {/* {countReport?.continued ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ==
              8
                ? ReportsPagination.totalItems || 0
                : countReport?.continued || 0}
            </span>
          </button>
          <button
            className={`w-150px btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName == "rejected-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(1);
              setSubTabName("rejected-reports");
              setPageIndex(1);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Rejected" })}
            <span
              className={`bg-danger opacity-75 h-fit  w-fit text-dark mx-3 ${
                intl.locale == "ar" ? "p-1" : ""
              }`}
            >
              {/* {countReport?.rejected ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ==
              1
                ? ReportsPagination.totalItems || 0
                : countReport?.rejected || 0}
            </span>
          </button>
          <button
            className={`w-150px btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName == "closed-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(2);
              setSubTabName("closed-reports");
              setPageIndex(1);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Closed" })}
            <span
              className={`bg-secondary opacity-75 h-fit  w-fit text-dark mx-3 ${
                intl.locale == "ar" ? "p-1" : ""
              }`}
            >
              {/* {countReport?.closed ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ==
              2
                ? ReportsPagination.totalItems || 0
                : countReport?.closed || 0}
            </span>
          </button>
          <button
            className={`w-150px btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName == "late-reports" ? " active" : ""
            }`}
            onClick={() => {
              setSubTabName("late-reports");
              setStatisticsReport(7);
              setPageIndex(1);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Late" })}
            <span
              className={`bg-danger opacity-50 h-fit w-fit text-hover-dark mx-3 ${
                intl.locale == "ar" ? "p-1" : ""
              }`}
            >
              {/* {countReport?.late ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ==
              7
                ? ReportsPagination.totalItems || 0
                : countReport?.late || 0}
            </span>
          </button>
        </div>
        {loadingTabs[statisticsReport] ? (
          <>
            <div className="d-flex gap-4 justify-content-center align-items-center py-4">
              {intl.formatMessage({ id: "DataIsLoaded..." })}
              <Spinner animation="border" variant="primary" />
            </div>
          </>
        ) : SelectedTab ? (
          <SelectedTab
            responseReport={ReportsForTechnicalSupportEmployee}
            pagination={{
              ...ReportsPagination,
              setPageIndex: setPageIndex,
              setPageSize: setPageSize,
            }}
            currentReport={() => {
              dispatch(
                fetchGetReportsForTechnicalSupportEmployee({
                  pageSize: pageSize,
                  pageNumber: pageIndex,
                  ClassificationId: selectedMainClassificationIds,
                  statisticsReport: statisticsReport,
                  search: search,
                  delegation: isDelegation,
                  Requesttype: 1,
                }) as any
              );
            }}
          />
        ) : null}
      </div>
      <FilterPopup show={filterShow} handleClose={() => setFilterShow(false)} />
    </Fragment>
  );
}

export default ReportsTab;
