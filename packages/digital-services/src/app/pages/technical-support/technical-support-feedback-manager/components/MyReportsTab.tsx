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
import { fetchReportsForTechnicalSupportManager } from "../../../../redux/features/service-operation/report/ReportsTechnicalSupportManagerSlice";
import UnderProcedureTab from "./UnderProcedureTab";
import RejectedByWorkflowTab from "./RejectedByWorkflowTab";
import Spinner from "react-bootstrap/esm/Spinner";

interface ReportsTabProps {
  tabName?: string;
  RequestType: any;
  selectedMainClassificationIds: any;
  search: any;
}
function MyReportsTab({
  tabName = "",
  RequestType,
  search,
  selectedMainClassificationIds,
}: ReportsTabProps) {
  let intl = useIntl();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [subTabName, setSubTabName] = useState("all-reports");
  const [statisticsReport, setStatisticsReport] = useState(6);
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const [loadingTabs, setLoadingTabs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const componentMap = {
    0: SolvedTab,
    1: RejectTab,
    2: ClosedTab,
    4: ConvertedTab,
    6: AllTab,
    7: LateTab,
    8: ContinuedTab,
    13: UnderProcedureTab,
    14: RejectedByWorkflowTab,
  };

  const SelectedTab =
    componentMap[statisticsReport as keyof typeof componentMap];

  const dispatch = useDispatch();

  // let ReportsForTechnicalSupportEmployee = useSelector((state: RootState) => {
  //   return state?.ReportsForAdministrationEmployee;
  // });

  // let myReportCount = useSelector((state: RootState) => {
  //   return state?.GetMyReportCount?.statisticsReport;
  // });
  let countReport = useSelector((state: RootState) => {
    return state?.GetCount.statisticsReport;
  });
  let ReportsTechnicalSupportManager = useSelector((state: RootState) => {
    return state?.ReportsForTechnicalSupportManager;
  });
  let ReportsPagination = useSelector((state: RootState) => {
    return state?.ReportsForTechnicalSupportManager?.pagination;
  });
  let totalItems = useSelector((state: RootState) => {
    return state?.ReportsForTechnicalSupportManager?.totalItems;
  });

  // useEffect(() => {
  //   dispatch(
  //     featchGetmainClassification({ pageSize: 1000, pageNumber: 1 }) as any
  //   );
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTabs((prev) => ({
        ...prev,
        [statisticsReport]: true,
      }));

      const params = {
        pageSize,
        pageNumber: search !== "" ? 1 : pageIndex,
        statisticsReport,
        ClassificationId: selectedMainClassificationIds,
        RequestType,
        search,
      };

      try {
        await dispatch(fetchReportsForTechnicalSupportManager(params) as any);
      } finally {
        setLoadingTabs((prev) => ({
          ...prev,
          [statisticsReport]: false,
        }));
      }
    };

    fetchData();
  }, [
    selectedMainClassificationIds,
    pageIndex,
    pageSize,
    statisticsReport,
    search,
    RequestType,
    dispatch,
  ]);

  // useEffect(() => {
  //   const prams = {
  //     DetermineForResponse:
  //       DetermineForResponse.GetReportsForTechnicalSupportManager,
  //     ClassificationId: selectedMainClassificationIds,
  //     RequestType: RequestType,
  //   };
  //   dispatch(fetchGetCountAdmin(prams) as any);
  // }, [selectedMainClassificationIds]);

  return (
    <Fragment>
      <div className="card-body py-3 pb-7">
        <div className="card-header border-0 pt-3 pb-2 mb-2">
          <div className="card-toolbar "></div>
        </div>
        <div className="d-flex flex-wrap flex-column flex-md-row mb-3 mb-md-7 bg-light gap-2 gap-md-0">
          <button
            className={`w-fit w-md-auto btn d-flex align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
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
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 6
                ? totalItems || 0
                : countReport?.allReports || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
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
              className={`bg-success opacity-75 h-fit  mx-3 w-fit text-dark ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 0
                ? totalItems || 0
                : countReport?.solved || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
              subTabName === "continued-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(8);
              setSubTabName("continued-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Continued" })}
            <span
              className={`bg-warning opacity-75 h-fit  w-fit mx-3 text-dark ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 8
                ? totalItems || 0
                : countReport?.continued || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
              subTabName === "rejected-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(1);
              setSubTabName("rejected-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Rejected" })}
            <span
              className={`bg-danger opacity-75 h-fit  w-fit text-dark mx-3 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 1
                ? totalItems || 0
                : countReport?.rejected || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
              subTabName === "closed-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(2);
              setSubTabName("closed-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Closed" })}
            <span
              className={`bg-secondary opacity-75 h-fit  w-fit text-dark mx-3 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 2
                ? totalItems || 0
                : countReport?.closed || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
              subTabName === "late-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(7);
              setSubTabName("late-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Late" })}
            <span
              className={`bg-danger opacity-75 h-fit w-fit text-hover-dark mx-3 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 7
                ? totalItems || 0
                : countReport?.late || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
              subTabName === "converted-reports" ? " active" : ""
            }`}
            onClick={() => {
              setStatisticsReport(4);
              setSubTabName("converted-reports");
            }}
          >
            {" "}
            {intl.formatMessage({ id: "Converted" })}
            <span
              className={`bg-success opacity-75 h-fit w-fit text-hover-dark mx-3 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 4
                ? totalItems || 0
                : countReport?.converted || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
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
              className={`bg-primary  opacity-75 h-fit w-fit text-hover-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.converted ?? 0} */}
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 13
                ? totalItems || 0
                : countReport?.wating || 0}
            </span>
          </button>
          <button
            className={`w-fit w-md-auto btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-0 fw-bolder border border-bottom border-white border-2 border-active-primary mb-2 mb-md-0 me-0 me-md-2 ${
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
              {(ReportsTechnicalSupportManager?.statisticsReport as any) === 14
                ? totalItems || 0
                : countReport?.rejectinRequestTemplate || 0}
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
            responseReport={ReportsTechnicalSupportManager}
          />
        ) : null}
      </div>
    </Fragment>
  );
}

export default MyReportsTab;
