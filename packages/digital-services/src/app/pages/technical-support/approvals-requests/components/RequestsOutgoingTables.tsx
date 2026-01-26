import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RequestsFilterPopup from "../popups/RequestsFilterPopup";
import RequestsFilterForArchivePopup from "../popups/RequestsFilterForArchivePopup";
import {
  fetchCanceledFilterRequests,
  fetchIncomingFilterAssginRequsets,
  fetchIncomingRequestsWithFilter,
  fetchOutgoingRequestsWithFilter,
  fetchSuggestedRequestsWithFilter,
  getCountRequestInstances,
} from "../../../../redux/features/requests-slice/requests-slice";
import { fetchArchivedRequestsWithFilter } from "../../../../redux/features/requests-slice/archived-requests-slice";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { RootState } from "../../../../redux/store/store";
import CanceledRequestsTable from "./CanceledRequestsTable";
import OutgoingRequestsTable from "./OutgoingRequestsTable";
import IncomingRequestsTable from "./IncomingRequestsTable";
import AssignRequestsTable from "./AssignRequestsTable";
import ArchiveRequestsTable from "./ArchiveRequestsTable";
import SuggestedRequestsTable from "./SuggestedRequestsTable";
import Spinner from "react-bootstrap/esm/Spinner";

const OUTGOING = "OutgoingRequests";
const INCOMING = "IncomingRequests";
const ASSIGNED = "AssignedRequests";
const ARCHIVED = "ArchivedRequests";
const Canceled = "CanceledRequests";
const Suggested = "SuggestedRequests";

function RequestsOutgoingTables() {
  let intl = useIntl();
  const outgoingFilterRef = useRef(false);
  const incomingFilterRef = useRef(false);
  const assignFilterRef = useRef(false);
  const archiveFilterRef = useRef(false);
  const canceledFilterRef = useRef(false);
  const suggestedFilterRef = useRef(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    [OUTGOING]: false,
    [INCOMING]: false,
    [ASSIGNED]: false,
    [ARCHIVED]: false,
    [Canceled]: false,
    [Suggested]: false,
  });
  const setLoadingForRequests = (tabKey: string, value: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [tabKey]: value,
    }));
  };
  let dispatch = useDispatch();
  let location = useLocation();
  let [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const handleClose = () => setShowFilter(false);
  const [tabName, setTabName] = useState(
    (location.state && location.state.tabName) || OUTGOING
  );
  let [numberOfOutgoingRequests, setNumberOfOutgoingRequests] = useState(0);
  let [numberOfIncomingRequests, setNumberOfIncomingRequests] = useState(0);
  let [numberOfAssignedRequests, setNumberOfAssignedRequests] = useState(0);
  let [archivedRequestsWithFilter, setArchivedRequestsWithFilter] =
    useState<any>([]);
  let [totalItemsForArchive, setTotalItemsForArchive] = useState(0);
  let [totalPagesForArchive, setTotalPagesForArchive] = useState(0);
  const [pageSizeForArchive, setPageSizeForArchive] = useState<number>(10);
  const [pageIndexForArchive, setPageIndexForArchive] = useState<number>(1);
  const [pageSizeForOutgoing, setPageSizeForOutgoing] = useState<number>(10);
  const [pageIndexForOutgoing, setPageIndexForOutgoing] = useState<number>(1);
  const [pageSizeForIncoming, setPageSizeForIncoming] = useState<number>(10);
  const [pageIndexForIncoming, setPageIndexForIncoming] = useState<number>(1);
  const [pageSizeForAssign, setPageSizeForAssign] = useState<number>(10);
  const [pageIndexForAssign, setPageIndexForAssign] = useState<number>(1);
  const [pageSizeForCanceled, setPageSizeForCanceled] = useState<number>(10);
  const [pageIndexForCanceled, setPageIndexForCanceled] = useState<number>(1);
  const [pageSizeForSuggested, setPageSizeForSuggested] = useState<number>(10);
  const [pageIndexForSuggested, setPageIndexForSuggested] = useState<number>(1);

  const body = {
    requestInstanceNumber: [null],
    requestInstanceName: [null],
    orgIds: [null],
    dateTimes: [null],
    statues: [null],
    categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
    delegatedUsers: [null],
    requester: [null],
  };

  let incomingRequestsWithFilter: any = useSelector((state: RootState) => {
    return state?.requests?.incomingRequests;
  });
  let paginationIncomingTotalItems: any = useSelector((state: RootState) => {
    return state?.requests?.totalItemsForIncoming;
  });
  let paginationIncomingTotalPages: any = useSelector((state: RootState) => {
    return state?.requests?.totalPagesForIncoming;
  });

  let outgoingRequestsWithFilter: any = useSelector((state: RootState) => {
    return state?.requests?.outgoingRequests;
  });
  let paginationOutgoingTotalItems: any = useSelector((state: RootState) => {
    return state?.requests?.totalItemsForOutgoing;
  });
  let paginationOutgoingTotalPages: any = useSelector((state: RootState) => {
    return state?.requests?.totalPagesForOutgoing;
  });

  let assignRequestsWithFilter: any = useSelector((state: RootState) => {
    return state?.requests?.assignRequests;
  });
  let paginationAssignTotalItems = useSelector((state: RootState) => {
    return state?.requests?.totalItemsForAssign;
  });
  let paginationAssignTotalPages = useSelector((state: RootState) => {
    return state?.requests?.totalPagesForAssign;
  });

  let canceledRequestsWithFilter: any = useSelector((state: RootState) => {
    return state?.requests?.canceledRequests;
  });
  let paginationCancelledTotalItems = useSelector((state: RootState) => {
    return state?.requests?.totalItemsForCancelled;
  });
  let paginationCancelledTotalPages = useSelector((state: RootState) => {
    return state?.requests?.totalPagesForCancelled;
  });
  let suggestedRequestsWithFilter: any = useSelector((state: RootState) => {
    return state?.requests?.suggestedRequests;
  });
  let paginationSuggestedTotalItems = useSelector((state: RootState) => {
    return state?.requests?.totalItemsForSuggested;
  });
  let paginationSuggestedTotalPages = useSelector((state: RootState) => {
    return state?.requests?.totalPagesForSuggested;
  });

  let count = useSelector((state: RootState) => {
    return state?.requests?.requestCount;
  });
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const queryTab = searchParams.get("tabName");
    if (queryTab) {
      setTabName(queryTab);
    } else {
      setTabName(OUTGOING);
      setSearchParams({ tabName: OUTGOING });
    }
  }, []);
  useEffect(() => {
    if (tabName) {
      setSearchParams({ tabName });
    }
  }, [tabName]);
  useEffect(() => {
    setLoading(true);
    dispatch(
      getCountRequestInstances({
        RequestCategoryId:"d6f7cc44-0fcd-4b41-af42-643f71cf3703",
      }) as any
    ).then(() => {
      setLoading(false);
    });
  }, [dispatch]);
  const [filterValuesForOutgoingRequests, setFilterValuesForOutgoingRequests] =
    useState<any>(body);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForOutgoing,
      pageNumber: pageIndexForOutgoing,
    };
    if (tabName === OUTGOING || tabName === "") {
      setLoadingForRequests(OUTGOING, true);
      dispatch(
        fetchOutgoingRequestsWithFilter({
          body: {
            ...filterValuesForOutgoingRequests,
            categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
          },
          params,
        }) as any
      ).then(() => {
        setLoadingForRequests(OUTGOING, false);
      });
    }
  }, [
    pageSizeForOutgoing,
    pageIndexForOutgoing,
    filterValuesForOutgoingRequests,
    tabName,
  ]);
  useEffect(() => {
    if (
      JSON.stringify(outgoingFilterRef.current) !==
      JSON.stringify(filterValuesForOutgoingRequests)
    ) {
      setPageIndexForOutgoing(1);
      return;
    }
    outgoingFilterRef.current = filterValuesForOutgoingRequests;
  }, [filterValuesForOutgoingRequests]);
  const [filterValuesForIncomingRequests, setFilterValuesForIncomingRequests] =
    useState<any>(body);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForIncoming,
      pageNumber: pageIndexForIncoming,
    };
    if (tabName === INCOMING) {
      setLoadingForRequests(INCOMING, true);
      dispatch(
        fetchIncomingRequestsWithFilter({
          body: {
            ...filterValuesForIncomingRequests,
            categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
          },
          params,
        }) as any
      ).then(() => {
        setLoadingForRequests(INCOMING, false);
      });
    }
  }, [
    pageSizeForIncoming,
    pageIndexForIncoming,
    filterValuesForIncomingRequests,
    tabName,
  ]);
  useEffect(() => {
    if (
      JSON.stringify(incomingFilterRef.current) !==
      JSON.stringify(filterValuesForIncomingRequests)
    ) {
      setPageIndexForIncoming(1);
      return;
    }
    incomingFilterRef.current = filterValuesForIncomingRequests;
  }, [filterValuesForIncomingRequests]);
  const [filterValuesForAssignRequests, setFilterValuesForAssignRequests] =
    useState<any>(body);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForAssign,
      pageNumber: pageIndexForAssign,
    };
    if (tabName === ASSIGNED) {
      setLoadingForRequests(ASSIGNED, true);
      dispatch(
        fetchIncomingFilterAssginRequsets({
          body: {
            ...filterValuesForAssignRequests,
            categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
          },
          params,
        }) as any
      ).then((res: any) => {
        setNumberOfAssignedRequests(res?.payload?.totalItems);
        setLoadingForRequests(ASSIGNED, false);
      });
    }
  }, [
    pageSizeForAssign,
    pageIndexForAssign,
    filterValuesForAssignRequests,
    tabName,
  ]);
  useEffect(() => {
    if (
      JSON.stringify(assignFilterRef.current) !==
      JSON.stringify(filterValuesForAssignRequests)
    ) {
      setPageIndexForAssign(1);
      return;
    }
    assignFilterRef.current = filterValuesForAssignRequests;
  }, [filterValuesForAssignRequests]);
  const [filterValuesForArchiveRequests, setFilterValuesForArchiveRequests] =
    useState<any>(body);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForArchive,
      pageNumber: pageIndexForArchive,
    };
    if (tabName === ARCHIVED) {
      setLoadingForRequests(ARCHIVED, true);
      dispatch(
        fetchArchivedRequestsWithFilter({
          body: {
            ...filterValuesForArchiveRequests,
            categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
          },
          params,
        }) as any
      ).then((res: any) => {
        setArchivedRequestsWithFilter(res?.payload?.result);
        setTotalItemsForArchive(res?.payload?.totalItems);
        setTotalPagesForArchive(res?.payload?.totalPages);
        setLoadingForRequests(ARCHIVED, false);
      });
    }
  }, [
    pageSizeForArchive,
    pageIndexForArchive,
    filterValuesForArchiveRequests,
    tabName,
  ]);
  useEffect(() => {
    if (
      JSON.stringify(archiveFilterRef.current) !=
      JSON.stringify(filterValuesForArchiveRequests)
    ) {
      setPageIndexForArchive(1);
      return;
    }
    archiveFilterRef.current = filterValuesForArchiveRequests;
  }, [filterValuesForArchiveRequests]);

  const [filterValuesCanceledRequests, setFilterValuesCanceledRequests] =
    useState<any>(body);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForCanceled,
      pageNumber: pageIndexForCanceled,
    };
    if (tabName === Canceled) {
      setLoadingForRequests(Canceled, true);
      dispatch(
        fetchCanceledFilterRequests({
          body: {
            ...filterValuesCanceledRequests,
            categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
          },
          params,
        }) as any
      ).then((res: any) => {
        setLoadingForRequests(Canceled, false);
      });
    }
  }, [
    pageSizeForCanceled,
    pageIndexForCanceled,
    filterValuesCanceledRequests,
    tabName,
  ]);
  useEffect(() => {
    if (
      JSON.stringify(canceledFilterRef.current) !==
      JSON.stringify(filterValuesCanceledRequests)
    ) {
      setPageIndexForCanceled(1);
      return;
    }
    canceledRequestsWithFilter.current = filterValuesCanceledRequests;
  }, [filterValuesCanceledRequests]);

  const [filterValuesSuggestedRequests, setFilterValuesSuggestedRequests] =
    useState<any>(body);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForSuggested,
      pageNumber: pageIndexForSuggested,
    };
    if (tabName === Suggested) {
      setLoadingForRequests(Suggested, true);
      dispatch(
        fetchSuggestedRequestsWithFilter({
          body: {
            ...filterValuesSuggestedRequests,
            categoryIds: ["d6f7cc44-0fcd-4b41-af42-643f71cf3703"],
          },
          params,
        }) as any
      ).then(() => {
        setLoadingForRequests(Suggested, false);
      });
    }
  }, [
    pageSizeForSuggested,
    pageIndexForSuggested,
    filterValuesSuggestedRequests,
    tabName,
  ]);
  useEffect(() => {
    if (
      JSON.stringify(suggestedFilterRef.current) !==
      JSON.stringify(filterValuesSuggestedRequests)
    ) {
      setPageIndexForSuggested(1);
      return;
    }
    suggestedFilterRef.current = filterValuesSuggestedRequests;
  }, [filterValuesSuggestedRequests]);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForIncoming,
      pageNumber: pageIndexForIncoming,
    };
    window.addEventListener("requestStatusIsChanged", () => {
      dispatch(
        getCountRequestInstances({
          RequestCategoryId: "d6f7cc44-0fcd-4b41-af42-643f71cf3703",
        }) as any
      );
      setLoadingForRequests(INCOMING, true);
      dispatch(
        fetchIncomingRequestsWithFilter({
          body: filterValuesForIncomingRequests,
          params,
        }) as any
      ).then(() => {
        setLoadingForRequests(INCOMING, false);
      });
    });
    return () => {
      window.removeEventListener("requestStatusIsChanged", () => {
        dispatch(
          getCountRequestInstances({
            RequestCategoryId: "d6f7cc44-0fcd-4b41-af42-643f71cf3703",
          }) as any
        );
        setLoadingForRequests(INCOMING, true);
        dispatch(
          fetchIncomingRequestsWithFilter({
            body: filterValuesForIncomingRequests,
            params,
          }) as any
        ).then(() => {
          setLoadingForRequests(INCOMING, false);
        });
      });
    };
  }, []);
  useEffect(() => {
    if (count?.countRequestInstancesByActionTaker == 0) {
      searchParams.set("tabName", "OutgoingRequests");
      setTabName(OUTGOING);
      setSearchParams(searchParams);
    }
  }, [count?.countRequestInstancesByActionTaker]);
  let handleResetFilter = () => {
    if (tabName === ARCHIVED) {
      setFilterValuesForArchiveRequests(body);
    } else if (tabName === OUTGOING) {
      setFilterValuesForOutgoingRequests(body);
    } else if (tabName === INCOMING) {
      setFilterValuesForIncomingRequests(body);
    } else if (tabName === ASSIGNED) {
      setFilterValuesForAssignRequests(body);
    } else if (tabName === Canceled) {
      setFilterValuesCanceledRequests(body);
    } else if (tabName === Suggested) {
      setFilterValuesSuggestedRequests(body);
    }
  };
  return (
    <Fragment>
      <div className="detailsCard my-5">
        <div className="card card-xl-stretch mb-xl-8">
          {loading ? (
            <div className="d-flex gap-4 justify-content-center align-items-center py-4">
              {intl.formatMessage({ id: "DataIsLoaded..." })}
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <div className="card-body py-3">
                <div className="mb-8 mt-3 d-flex w-100 justify-content-between row flex-wrap">
                  <div className="col-md-11 col-sm-12">
                    <div className="d-flex flex-wrap">
                      {count?.countRequestInstancesForUser > 0 && (
                        <button
                          className={`btn rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                            tabName === OUTGOING || tabName === ""
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setTabName(OUTGOING)}
                        >
                          {" "}
                          <span className="ps-2">
                            {" "}
                            {
                              <>
                                {intl.formatMessage({
                                  id: "OutgoingRequests",
                                })}
                              </>
                            }
                          </span>
                          <span
                            className={`p-2 px-4 w-20 h-20 rounded text-center ${
                              tabName === OUTGOING
                                ? "bg-light-primary"
                                : "bg-light-dark text-gray-600"
                            }`}
                          >
                            {count?.countRequestInstancesForUser}
                          </span>
                        </button>
                      )}

                      {count?.countRequestInstancesByActionTaker > 0 && (
                        <>
                          {" "}
                          <button
                            className={` btn rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                              tabName === INCOMING || tabName === ""
                                ? "active"
                                : ""
                            }`}
                            onClick={() => setTabName(INCOMING)}
                          >
                            <span className="ps-2">
                              <>
                                {intl.formatMessage({
                                  id: "IncomingRequests",
                                })}
                              </>
                            </span>
                            <span
                              className={`p-2 px-4 w-20 h-20 rounded text-center ${
                                tabName === INCOMING
                                  ? "bg-light-primary"
                                  : "bg-light-dark text-gray-600"
                              }`}
                            >
                              {count?.countRequestInstancesByActionTaker}
                            </span>
                          </button>
                        </>
                      )}

                      {count?.countAssginRequsetsByActionTaker > 0 ? (
                        <>
                          <button
                            className={` btn rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                              tabName === ASSIGNED || tabName === ""
                                ? "active"
                                : ""
                            }`}
                            onClick={() => setTabName(ASSIGNED)}
                          >
                            <span className="ps-2">
                              {intl.formatMessage({ id: "AssignedRequests" })}
                            </span>
                            <span
                              className={`p-2 px-4 w-20 h-20 rounded text-center ${
                                tabName === ASSIGNED
                                  ? "bg-light-primary"
                                  : "bg-light-dark text-gray-600"
                              }`}
                            >
                              {count?.countAssginRequsetsByActionTaker}
                            </span>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}

                      {count?.countRequestInstancesTharUserTakeAction > 0 ? (
                        <>
                          <button
                            className={` btn rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                              tabName === ARCHIVED || tabName === ""
                                ? "active"
                                : ""
                            }`}
                            onClick={() => setTabName(ARCHIVED)}
                          >
                            <span className="ps-2">
                              {intl.formatMessage({ id: "ArchivedRequests" })}
                            </span>
                            <span
                              className={`p-2 px-4 w-20 h-20 rounded text-center ${
                                tabName === ARCHIVED
                                  ? "bg-light-primary"
                                  : "bg-light-dark text-gray-600"
                              }`}
                            >
                              {count?.countRequestInstancesTharUserTakeAction}
                            </span>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}

                      {count?.countCancelRequestInstance > 0 ? (
                        <>
                          <button
                            className={` btn rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                              tabName === Canceled ? "active" : ""
                            }`}
                            onClick={() => setTabName(Canceled)}
                          >
                            <span className="ps-2">
                              {intl.formatMessage({ id: "CanceledRequests" })}
                            </span>
                            <span
                              className={`p-2 px-4 w-20 h-20 rounded text-center ${
                                tabName === Canceled
                                  ? "bg-light-primary"
                                  : "bg-light-dark text-gray-600"
                              }`}
                            >
                              {count?.countCancelRequestInstance}
                            </span>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}

                      {count?.countRequestSuggestion > 0 ? (
                        <>
                          <button
                            className={` btn rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-6 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                              tabName === Suggested ? "active" : ""
                            }`}
                            onClick={() => setTabName(Suggested)}
                          >
                            <span className="ps-2">
                              {intl.formatMessage({
                                id: "SuggestedRequests",
                              })}
                            </span>
                            <span
                              className={`p-2 px-4 w-20 h-20 rounded text-center ${
                                tabName === Suggested
                                  ? "bg-light-primary"
                                  : "bg-light-dark text-gray-600"
                              }`}
                            >
                              {count?.countRequestSuggestion}
                            </span>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="col-md-1 col-sm-12">
                    <button
                      className="btn btn-primary"
                      style={{ height: "fit-content" }}
                      onClick={() => {
                        setShowFilter(true);
                      }}
                    >
                      {intl.formatMessage({ id: "Filtering" })}
                    </button>
                  </div>
                </div>

                {tabName === OUTGOING || tabName === "" ? (
                  <div
                    className={`tab-pane fade  ${
                      tabName === OUTGOING || tabName === "" ? "show" : ""
                    }`}
                    id="kt_tab_project_tasks"
                  >
                    {loadingStates[OUTGOING] ? (
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <>
                        {" "}
                        {outgoingRequestsWithFilter?.length > 0 ? (
                          <>
                            {" "}
                            <OutgoingRequestsTable
                              outgoingRequestsWithFilter={
                                outgoingRequestsWithFilter
                              }
                              location={location}
                            />
                            <SystemPagination
                              totalPages={paginationOutgoingTotalPages}
                              totalItems={paginationOutgoingTotalItems}
                              pageIndex={pageIndexForOutgoing}
                              pageSize={pageSizeForOutgoing}
                              setPageIndex={setPageIndexForOutgoing}
                              setPageSize={setPageSizeForOutgoing}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className=" py-10 text-center">
                              <p>
                                {" "}
                                {intl.formatMessage({ id: "NotFoundResults" })}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : tabName === INCOMING ? (
                  <div
                    className={`tab-pane fade  ${
                      tabName === INCOMING ? "show " : ""
                    }`}
                    id="kt_tab_staff_tasks"
                  >
                    {loadingStates[INCOMING] ? (
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <>
                        {" "}
                        {incomingRequestsWithFilter?.length > 0 ? (
                          <>
                            <IncomingRequestsTable
                              incomingRequestsWithFilter={
                                incomingRequestsWithFilter
                              }
                              location={location}
                              pageIndex={pageIndexForIncoming}
                              pageSize={pageSizeForIncoming}
                              callingAllRequests={() => {}}
                            />
                            <SystemPagination
                              totalPages={paginationIncomingTotalPages}
                              totalItems={paginationIncomingTotalItems}
                              pageIndex={pageIndexForIncoming}
                              pageSize={pageSizeForIncoming}
                              setPageIndex={setPageIndexForIncoming}
                              setPageSize={setPageSizeForIncoming}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className=" py-10 text-center">
                              <p>
                                {" "}
                                {intl.formatMessage({ id: "NotFoundResults" })}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : tabName === ASSIGNED ? (
                  <div
                    className={`tab-pane fade  ${
                      tabName === ASSIGNED ? "show " : ""
                    }`}
                    id="kt_tab_staff_tasks"
                  >
                    {loadingStates[ASSIGNED] ? (
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <>
                        {" "}
                        {assignRequestsWithFilter?.length > 0 ? (
                          <>
                            {" "}
                            <AssignRequestsTable
                              assignRequestsWithFilter={
                                assignRequestsWithFilter
                              }
                              location={location}
                            />
                            <SystemPagination
                              totalPages={paginationAssignTotalPages}
                              totalItems={paginationAssignTotalItems}
                              pageIndex={pageIndexForAssign}
                              pageSize={pageSizeForAssign}
                              setPageIndex={setPageIndexForAssign}
                              setPageSize={setPageSizeForAssign}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className=" py-10 text-center">
                              <p>
                                {" "}
                                {intl.formatMessage({ id: "NotFoundResults" })}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : tabName === ARCHIVED ? (
                  <div
                    className={`tab-pane fade  ${
                      tabName === ARCHIVED ? "show " : ""
                    }`}
                    id="kt_tab_staff_tasks"
                  >
                    {loadingStates[ARCHIVED] ? (
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <>
                        {totalItemsForArchive > 0 ? (
                          <>
                            <ArchiveRequestsTable
                              archivedRequestsWithFilter={
                                archivedRequestsWithFilter
                              }
                              location={location}
                            />
                            <SystemPagination
                              totalPages={totalPagesForArchive}
                              totalItems={totalItemsForArchive}
                              pageIndex={pageIndexForArchive}
                              pageSize={pageSizeForArchive}
                              setPageIndex={setPageIndexForArchive}
                              setPageSize={setPageSizeForArchive}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className=" py-10 text-center">
                              <p>
                                {" "}
                                {intl.formatMessage({ id: "NotFoundResults" })}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : tabName === Canceled ? (
                  <div
                    className={`tab-pane fade  ${
                      tabName === Canceled ? "show " : ""
                    }`}
                    id="kt_tab_staff_tasks"
                  >
                    {loadingStates[Canceled] ? (
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <>
                        {paginationCancelledTotalPages > 0 ? (
                          <>
                            <CanceledRequestsTable
                              canceledRequestsWithFilter={
                                canceledRequestsWithFilter
                              }
                              location={location}
                            />
                            <SystemPagination
                              totalPages={paginationCancelledTotalPages}
                              totalItems={paginationCancelledTotalItems}
                              pageIndex={pageIndexForCanceled}
                              pageSize={pageSizeForCanceled}
                              setPageIndex={setPageIndexForCanceled}
                              setPageSize={setPageSizeForCanceled}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className=" py-10 text-center">
                              <p>
                                {" "}
                                {intl.formatMessage({ id: "NotFoundResults" })}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : tabName === Suggested ? (
                  <div
                    className={`tab-pane fade  ${
                      tabName === Suggested ? "show " : ""
                    }`}
                    id="kt_tab_staff_tasks"
                  >
                    {loadingStates[Suggested] ? (
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <>
                        {paginationSuggestedTotalPages > 0 ? (
                          <>
                            <SuggestedRequestsTable
                              suggestedRequestsWithFilter={
                                suggestedRequestsWithFilter
                              }
                              location={location}
                            />
                            <SystemPagination
                              totalPages={paginationSuggestedTotalPages}
                              totalItems={paginationSuggestedTotalItems}
                              pageIndex={pageIndexForSuggested}
                              pageSize={pageSizeForSuggested}
                              setPageIndex={setPageIndexForSuggested}
                              setPageSize={setPageSizeForSuggested}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div className=" py-10 text-center">
                              <p>
                                {" "}
                                {intl.formatMessage({ id: "NotFoundResults" })}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {tabName === ARCHIVED ? (
        <>
          {" "}
          <RequestsFilterForArchivePopup
            show={showFilter}
            handleClose={() => {
              handleClose();
            }}
            tabName={tabName}
            setTotalItems={setTotalItemsForArchive}
            setTotalPages={setTotalPagesForArchive}
            {...{ setArchivedRequestsWithFilter }}
            pageSize={pageSizeForArchive}
            pageNumber={pageIndexForArchive}
            setFilterValuesForArchiveRequests={
              setFilterValuesForArchiveRequests
            }
            setPageNumber={setPageIndexForArchive}
            setLoadingForRequests={setLoadingForRequests}
            handleResetFilter={handleResetFilter}
          />
        </>
      ) : (
        <>
          <RequestsFilterPopup
            show={showFilter}
            handleClose={() => {
              handleClose();
            }}
            handleResetFilter={handleResetFilter}
            tabName={tabName}
            {...{
              setNumberOfAssignedRequests,
              setNumberOfIncomingRequests,
              setNumberOfOutgoingRequests,
            }}
            setFilterValuesForOutgoingRequests={
              setFilterValuesForOutgoingRequests
            }
            setFilterValuesForIncomingRequests={
              setFilterValuesForIncomingRequests
            }
            setFilterValuesForAssignRequests={setFilterValuesForAssignRequests}
            setFilterValuesCanceledRequests={setFilterValuesCanceledRequests}
            setFilterValuesSuggestedRequests={setFilterValuesSuggestedRequests}
            setPageNumber={
              tabName === OUTGOING
                ? setPageIndexForOutgoing
                : tabName === INCOMING
                ? setPageIndexForIncoming
                : tabName === ASSIGNED
                ? setPageIndexForAssign
                : tabName === Canceled
                ? setPageIndexForCanceled
                : tabName === Suggested
                ? setPageIndexForSuggested
                : setPageIndexForArchive
            }
            pageSize={
              tabName === OUTGOING
                ? pageSizeForOutgoing
                : tabName === INCOMING
                ? pageSizeForIncoming
                : tabName === ASSIGNED
                ? pageSizeForAssign
                : tabName === Canceled
                ? pageSizeForCanceled
                : tabName === Suggested
                ? pageSizeForSuggested
                : pageSizeForArchive
            }
            setLoadingForRequests={setLoadingForRequests}
            pageNumber={
              tabName === OUTGOING
                ? pageIndexForOutgoing
                : tabName === INCOMING
                ? pageIndexForIncoming
                : tabName === ASSIGNED
                ? pageIndexForAssign
                : tabName === Canceled
                ? pageIndexForCanceled
                : tabName === Suggested
                ? pageIndexForSuggested
                : pageIndexForArchive
            }
          />
        </>
      )}
    </Fragment>
  );
}

export default RequestsOutgoingTables;
