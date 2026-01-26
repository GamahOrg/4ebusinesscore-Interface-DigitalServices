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
import { fetchGetReportsForAdministrationEmployee } from "../../../../redux/features/service-operation/report/ReportsForAdministrationEmployeeSlice";
import { DetermineForResponse } from "../../../../models/get-report/ResponseReport";
import { fetchMyReportCount } from "../../../../redux/features/service-operation/report/GetMyReportCountSlice";
import UnderProcedureTab from "./UnderProcedureTab";
import RejectedByWorkflowTab from "./RejectedByWorkflowTab";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";

function MyReportsTab({
  tabName = "",
  selectedMainClassificationIds,
  isDelegation,
  search,
}: any) {
  let intl = useIntl();
  const RequestType = 1;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingTabs, setLoadingTabs] = useState<{ [key: number]: boolean }>(
    {}
  );
  let { id } = useParams();
  const [serachPageIndex, setSerachPageIndex] = useState(1);
  const [serachPageSize, setSerachPageSize] = useState(10);

  const [subTabName, setSubTabName] = useState("all-reports");
  const [statisticsReport, setStatisticsReport] = useState(6);
  const [filterShow, setFilterShow] = useState<boolean>(false);

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
  let myCountReport = useSelector((state: RootState) => {
    return state?.GetMyReportCount.statisticsReport;
  });
  let ReportsForTechnicalSupportEmployee = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationEmployee;
  });
  let ReportsPagination = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationEmployee?.pagination;
  });

  let totalItems = useSelector((state: RootState) => {
    return state?.ReportsForAdministrationEmployee?.totalItems;
  });
useEffect(() => {
  setPageIndex(1);
  setSerachPageIndex(1);
}, [statisticsReport]);
  useEffect(() => {
    const fetchData = async () => {
      setLoadingTabs((prev) => ({
        ...prev,
        [statisticsReport]: true,
      }));

      const prams = {
        pageSize: search === "" ? pageSize : serachPageSize,
        pageNumber: search === "" ? pageIndex : serachPageIndex,
        statisticsReport,
        ClassificationId: selectedMainClassificationIds,
        RequestType,
        search,
        delegation: isDelegation,
        ...(id && { subSystemId: id }),
      };

      await dispatch(fetchGetReportsForAdministrationEmployee(prams) as any);

      setLoadingTabs((prev) => ({
        ...prev,
        [statisticsReport]: false,
      }));
    };

    fetchData();
  }, [
    selectedMainClassificationIds,
    pageIndex,
    pageSize,
    statisticsReport,
    search,
    isDelegation,
    serachPageIndex,
    serachPageSize,
    dispatch,
    id,
  ]);

  useEffect(() => {
    const prams = {
      DetermineForResponse:
        DetermineForResponse.GetReportsForTechnicalSupportManager,
      ClassificationId: selectedMainClassificationIds,
      RequestType: RequestType,
      delegation: isDelegation,
      ...(id && { subSystemId: id }),
    };
    dispatch(fetchMyReportCount(prams) as any);
  }, [selectedMainClassificationIds, isDelegation, dispatch, id]);

  return (
    <Fragment>
      <div className="card-body py-3 pb-7">
        <div className="card-header border-0 pt-3 pb-2 mb-2">
          <div className="card-toolbar "></div>
        </div>
        <div className="d-flex flex-wrap mb-7 bg-light">
          <button
            className={`w-fit btn d-flex align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-primary opacity-75 h-fit w-fit text-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.allReports ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              6
                ? totalItems || 0
                : myCountReport?.allReports || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-success opacity-75 h-fit  mx-1 w-fit text-dark ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.solved ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              0
                ? totalItems || 0
                : myCountReport?.solved || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-warning opacity-75 h-fit  w-fit mx-1 text-dark ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.continued ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              8
                ? totalItems || 0
                : myCountReport?.continued || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-danger opacity-75 h-fit  w-fit text-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.rejected ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              1
                ? totalItems || 0
                : myCountReport?.rejected || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-secondary opacity-75 h-fit  w-fit text-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.closed ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              2
                ? totalItems || 0
                : myCountReport?.closed || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-danger opacity-50 h-fit w-fit text-hover-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.late ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              7
                ? totalItems || 0
                : myCountReport?.late || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              className={`bg-success opacity-50 h-fit w-fit text-hover-dark mx-1 ${
                intl.locale === "ar" ? "p-1" : ""
              }`}
            >
              {/* {myCountReport?.converted ?? 0} */}
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              4
                ? totalItems || 0
                : myCountReport?.converted || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              13
                ? totalItems || 0
                : myCountReport?.wating || 0}
            </span>
          </button>
          <button
            className={`w-fit btn rounded-0 bg-transparent btn-active-color-primary border-0 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
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
              {(ReportsForTechnicalSupportEmployee?.statisticsReport as any) ===
              14
                ? totalItems || 0
                : myCountReport?.rejectinRequestTemplate || 0}
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
              setPageIndex: search === "" ? setPageIndex : setSerachPageIndex,
              setPageSize: search === "" ? setPageSize : setSerachPageSize,
            }}
            responseReport={ReportsForTechnicalSupportEmployee}
          />
        ) : null}
      </div>
    </Fragment>
  );
}

export default MyReportsTab;
