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
import ConvertedTab from "./ConvertedTab";
import { DetermineForResponse } from "../../../../models/get-report/ResponseReport";
import FilterMyReportsForAdminstrationManagerPopup from "../popups/FilterMyReportsForAdminstrationManagerPopup";
import {
  fetchReportsForAdministrationManager,
  GetcountReportsForAdministrationManager,
} from "../../../../redux/features/service-operation/report/ReportsForAdministrationManagerSlice";
import UnderProcedureTab from "./UnderProcedureTab";
import RejectedByWorkflowTab from "./RejectedByWorkflowTab";
import ExceptedTab from "./ExceptedTab";
import CanceledTab from "./CanceledTab";
import Spinner from "react-bootstrap/esm/Spinner";

function ReportsTab({
  tabName = "",
  selectedMainClassificationIds,
  isDelegation,
  search,
  RequestType,
  integrationId,
}: any) {
  let intl = useIntl();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const [subTabName, setSubTabName] = useState("all-reports");
  const [statisticsReport, setStatisticsReport] = useState(6);
  const [loadingTabs, setLoadingTabs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const componentMap = integrationId
    ? {
        0: SolvedTab,
        1: RejectTab,
        15: ExceptedTab,
        6: AllTab,
        7: LateTab,
        8: ContinuedTab,
        13: UnderProcedureTab,
        14: RejectedByWorkflowTab,
        16: CanceledTab,
      }
    : {
        0: SolvedTab,
        1: RejectTab,
        2: ClosedTab,
        4: ConvertedTab,
        6: AllTab,
        7: LateTab,
        8: ContinuedTab,
        13: UnderProcedureTab,
        14: RejectedByWorkflowTab,
        16: CanceledTab,
      };

  const SelectedTab =
    componentMap[statisticsReport as keyof typeof componentMap];

  let ReportsForAdministrationManager = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationManager;
  });
  let ReportsPagination = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationManager?.pagination;
  });

  let countReport = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationManager.statisticsReport;
  });

  let totalItems = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationManager?.totalItems;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTabs((prev) => ({ ...prev, [statisticsReport]: true }));
      const params = {
        pageSize,
        pageNumber: pageIndex,
        statisticsReport,
        ...(selectedMainClassificationIds &&
          selectedMainClassificationIds !== "null" && {
            ClassificationId: selectedMainClassificationIds,
          }),
        RequestType,
        search,
        delegation: isDelegation,
        ...(integrationId !== "" && { integrationid: integrationId }),
      };

      try {
        await dispatch(fetchReportsForAdministrationManager(params) as any);
      } finally {
        setLoadingTabs((prev) => ({ ...prev, [statisticsReport]: false }));
      }
    };

    fetchData();
  }, [
    selectedMainClassificationIds,
    pageIndex,
    pageSize,
    statisticsReport,
    search,
    isDelegation,
    RequestType,
    dispatch,
    integrationId,
  ]);

  useEffect(() => {
    const params = {
      DetermineForResponse:
        DetermineForResponse.GetReportsForAdministrationManager,
      ...(selectedMainClassificationIds &&
        selectedMainClassificationIds !== "null" && {
          ClassificationId: selectedMainClassificationIds,
        }),
      RequestType: RequestType,
      // search: search,
      delegation: isDelegation,
      ...(integrationId !== "" && { integrationid: integrationId }),
    };
    dispatch(GetcountReportsForAdministrationManager(params) as any);
  }, [selectedMainClassificationIds, isDelegation, dispatch, RequestType]);

  return (
    <Fragment>
      <div className="card-body py-3 pb-7">
        {!integrationId && (
          <div className="card-header border-0 pt-3 pb-2 mb-2">
            <div className="card-toolbar "></div>
          </div>
        )}
        <div className="card-toolbar "></div>

        <div className="d-flex flex-wrap mb-7 bg-light">
          <button
            className={`w-fit btn d-flex align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName === "all-reports" ? "active" : ""
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
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsForAdministrationManager?.countReport as any) === 6
                ? totalItems || 0
                : countReport?.allReports || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
              subTabName === "solved-reports" ? " active" : ""
            }`}
            onClick={() => {
              setSubTabName("solved-reports");
              setStatisticsReport(0);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Complete1" })}
            <span
              className={`bg-success opacity-75 h-fit mx-2 w-fit text-dark ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsForAdministrationManager?.countReport as any) === 0
                ? totalItems || 0
                : countReport?.solved || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
              subTabName === "continued-reports" ? " active" : ""
            }`}
            onClick={() => {
              setSubTabName("continued-reports");
              setStatisticsReport(8);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Continued" })}
            <span
              className={`bg-warning opacity-75 h-fit w-fit mx-2 text-dark ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsForAdministrationManager?.countReport as any) === 8
                ? totalItems || 0
                : countReport?.continued || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
              subTabName === "rejected-reports" ? " active" : ""
            }`}
            onClick={() => {
              setSubTabName("rejected-reports");
              setStatisticsReport(1);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Rejected" })}
            <span
              className={`bg-danger opacity-75 h-fit w-fit text-dark mx-2 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsForAdministrationManager?.countReport as any) === 1
                ? totalItems || 0
                : countReport?.rejected || 0}
            </span>
          </button>
          {!integrationId && (
            <button
              className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                subTabName === "closed-reports" ? " active" : ""
              }`}
              onClick={() => {
                setSubTabName("closed-reports");
                setStatisticsReport(2);
              }}
            >
              {" "}
              {intl.formatMessage({ id: "Closed" })}
              <span
                className={`bg-secondary opacity-75 h-fit w-fit text-dark mx-2 ${
                  intl.locale === "ar" ? "p-1" : ""
                }`}
              >
                {(ReportsForAdministrationManager?.countReport as any) === 2
                  ? totalItems || 0
                  : countReport?.closed || 0}
              </span>
            </button>
          )}
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
              subTabName === "late-reports" ? " active" : ""
            }`}
            onClick={() => {
              setSubTabName("late-reports");
              setStatisticsReport(7);
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Late" })}
            <span
              className={`bg-danger opacity-75 h-fit w-fit text-hover-dark mx-2 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsForAdministrationManager?.countReport as any) === 7
                ? totalItems || 0
                : countReport?.late || 0}
            </span>
          </button>
          {integrationId ? (
            <button
              className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                subTabName === "excepted-reports" ? " active" : ""
              }`}
              onClick={() => {
                setSubTabName("excepted-reports");
                setStatisticsReport(15);
              }}
            >
              {" "}
              {intl.formatMessage({ id: "ExceptedRequests" })}
              <span
                className={`bg-success opacity-75 h-fit w-fit text-hover-dark mx-2 ${
                  intl.locale === "ar" ? "p-1" : ""
                }`}
              >
                {(ReportsForAdministrationManager?.countReport as any) === 15
                  ? totalItems || 0
                  : countReport?.exceptionApprove || 0}
              </span>
            </button>
          ) : (
            <button
              className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                subTabName === "converted-reports" ? " active" : ""
              }`}
              onClick={() => {
                setSubTabName("converted-reports");
                setStatisticsReport(4);
              }}
            >
              {" "}
              {intl.formatMessage({ id: "Converted" })}
              <span
                className={`bg-success opacity-75 h-fit w-fit text-hover-dark mx-2 ${
                  intl.locale === "ar" ? "p-1" : ""
                }`}
              >
                {(ReportsForAdministrationManager?.countReport as any) === 4
                  ? totalItems || 0
                  : countReport?.converted || 0}
              </span>
            </button>
          )}

          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
              subTabName === "underProcedure-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(13);
              setSubTabName("underProcedure-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "UnderProcedure" })}
            <span
              className={`bg-primary opacity-75 h-fit w-fit text-hover-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.converted ?? 0} */}
              {(ReportsForAdministrationManager?.statisticsReport as any) === 13
                ? totalItems || 0
                : countReport?.wating || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
              subTabName === "rejectedByWorkflow-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(14);
              setSubTabName("rejectedByWorkflow-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "RejectedByWorkflow" })}
            <span
              className={`bg-danger opacity-75 h-fit w-fit text-hover-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.converted ?? 0} */}
              {(ReportsForAdministrationManager?.statisticsReport as any) === 14
                ? totalItems || 0
                : countReport?.rejectinRequestTemplate || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary ${
              subTabName === "cancelled-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(16);
              setSubTabName("cancelled-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Canceledd" })}
            <span
              className={`bg-danger opacity-75 h-fit w-fit text-hover-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.converted ?? 0} */}
              {(ReportsForAdministrationManager?.statisticsReport as any) === 16
                ? totalItems || 0
                : countReport?.canceld || 0}
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
            tabName={tabName}
            pagination={{
              ...ReportsPagination,
              setPageIndex: setPageIndex,
              setPageSize: setPageSize,
            }}
            responseReport={ReportsForAdministrationManager}
            integrationId={integrationId}
          />
        ) : null}
      </div>
      <FilterMyReportsForAdminstrationManagerPopup
        show={filterShow}
        handleClose={() => setFilterShow(false)}
        statisticsReport={statisticsReport}
      />
    </Fragment>
  );
}

export default ReportsTab;
