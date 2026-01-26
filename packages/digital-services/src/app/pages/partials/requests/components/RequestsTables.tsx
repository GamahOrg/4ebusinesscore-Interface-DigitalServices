import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import RequestsFilterPopup from "../popups/RequestsFilterPopup";
import {
  fetchIncomingRequestsWithFilter,
  fetchOutgoingRequestsWithFilter,
  fetchIncomingFilterAssginRequsets,
  getCountRequestInstances,
  fetchCanceledFilterRequests,
  fetchSuggestedRequestsWithFilter,
} from "../../../../redux/features/requests-slice/requests-slice";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { fetchArchivedRequestsWithFilter } from "../../../../redux/features/requests-slice/archived-requests-slice";
import RequestsFilterForArchivePopup from "../popups/RequestsFilterForArchivePopup";
import OutgoingRequestsTable from "./OutgoingRequestsTable";
import IncomingRequestsTable from "./IncomingRequestsTable";
import AssignRequestsTable from "./AssignRequestsTable";
import ArchiveRequestsTable from "./ArchiveRequestsTable";
import CanceledRequestsTable from "./CanceledRequestsTable";
import SuggestedRequestsTable from "./SuggestedRequestsTable";

function RequestsTables() {
  let intl = useIntl();
  let dispatch = useDispatch();

  let location = useLocation();

  let [searchParams, setSearchParams] = useSearchParams();

  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);

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

  useEffect(() => {
    if (!searchParams.get("tabName")) {
      searchParams.set("tabName", "outgoingrequests");
    }
  }, [searchParams.get("tabName")]);

  const [showFilter, setShowFilter] = useState(false);
  const handleClose = () => setShowFilter(false);
  useEffect(() => {
    let params: any = {
      pageSize: pageSize,
      pageNumber: pageIndex,
    };
    dispatch(fetchOutgoingRequestsWithFilter({ body: {}, params }) as any);
  }, [pageSize, pageIndex, dispatch]);
  useEffect(() => {
    let params: any = {
      pageSize: pageSize,
      pageNumber: pageIndex,
    };
    dispatch(fetchIncomingRequestsWithFilter({ body: {}, params }) as any);
  }, [pageSize, pageIndex, dispatch]);
  useEffect(() => {
    let params: any = {
      pageSize: pageSize,
      pageNumber: pageIndex,
    };
    dispatch(
      fetchIncomingFilterAssginRequsets({ body: {}, params }) as any
    ).then((res: any) => {
      setNumberOfAssignedRequests(res?.payload?.totalItems);
    });
  }, [pageSize, pageIndex, dispatch]);
  let [numberOfOutgoingRequests, setNumberOfOutgoingRequests] = useState(0);
  let [numberOfIncomingRequests, setNumberOfIncomingRequests] = useState(0);
  let [numberOfAssignedRequests, setNumberOfAssignedRequests] = useState(0);

  let [archivedRequestsWithFilter, setArchivedRequestsWithFilter] =
    useState<any>([]);
  let [totalItemsForArchive, setTotalItemsForArchive] = useState(0);
  let [totalPagesForArchive, setTotalPagesForArchive] = useState(0);
  const [pageSizeForArchive, setPageSizeForArchive] = useState<number>(10);
  const [pageIndexForArchive, setPageIndexForArchive] = useState<number>(1);
  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForArchive,
      pageNumber: pageIndexForArchive,
    };
    dispatch(fetchArchivedRequestsWithFilter({ body: {}, params }) as any).then(
      (res: any) => {
        setArchivedRequestsWithFilter(res?.payload?.result);
        setTotalItemsForArchive(res?.payload?.totalItems);
        setTotalPagesForArchive(res?.payload?.totalPages);
      }
    );
  }, [pageSizeForArchive, pageIndexForArchive, dispatch]);
  const [pageSizeForCanceled, setPageSizeForCanceled] = useState<number>(10);
  const [pageIndexForCanceled, setPageIndexForCanceled] = useState<number>(1);

  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForCanceled,
      pageNumber: pageIndexForCanceled,
    };
    dispatch(fetchCanceledFilterRequests({ body: {}, params }) as any).then(
      (res: any) => {
      }
    );
  }, [pageSizeForCanceled, pageIndexForCanceled, dispatch]);

  const [pageSizeForSuggested, setPageSizeForSuggested] = useState<number>(10);
  const [pageIndexForSuggested, setPageIndexForSuggested] = useState<number>(1);

  useEffect(() => {
    let params: any = {
      pageSize: pageSizeForSuggested,
      pageNumber: pageIndexForSuggested,
    };

    dispatch(fetchSuggestedRequestsWithFilter({ body: {}, params }) as any);
  }, [pageSizeForSuggested, pageIndexForSuggested, dispatch]);

  useEffect(() => {
    dispatch(getCountRequestInstances({}) as any);
  }, [dispatch]);

  let count = useSelector((state: RootState) => {
    return state?.requests?.requestCount;
  });
  return (
    <Fragment>
      <div className="detailsCard my-5">
        <div className="card card-xl-stretch mb-xl-8">
          <div className="card-body py-3">
            <div className="mb-8 mt-3 d-flex gap-5 flex-wrap w-100 justify-content-between">
              <div className="d-flex flex-wrap gap-2 justify-content-sm-start justify-content-center">
                <button
                  className={`btn rounded-0 px-sm-4 px-0 bg-transparent btn-active-color-primary border-0 fs-7 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                    searchParams.get("tabName") === "outgoingrequests" ||
                    location.search === ""
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    searchParams.set("tabName", "outgoingrequests");
                    setSearchParams(searchParams);
                  }}
                >
                  {" "}
                  <span className="ps-2">
                    {" "}
                    {intl.formatMessage({ id: "OutgoingRequests" })}
                  </span>
                  <span
                    className={`p-2 px-4 w-10 h-10 rounded text-center ${
                      searchParams.get("tabName") === "outgoingrequests"
                        ? "bg-light-primary"
                        : "bg-light-dark text-gray-600"
                    }`}
                  >
                    {count?.countRequestInstancesForUser
                      ? count?.countRequestInstancesForUser
                      : 0}
                  </span>
                </button>
                <button
                  className={`btn rounded-0 px-sm-4 px-0 bg-transparent btn-active-color-primary border-0 fs-7 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                    searchParams.get("tabName") === "incomingrequests"
                      ? " active"
                      : ""
                  }`}
                  onClick={() => {
                    searchParams.set("tabName", "incomingrequests");
                    setSearchParams(searchParams);
                  }}
                >
                  <span className="ps-2">
                    {intl.formatMessage({ id: "IncomingRequests" })}
                  </span>
                  <span
                    className={`p-2 px-4 w-10 h-10 rounded text-center ${
                      searchParams.get("tabName") === "incomingrequests"
                        ? "bg-light-primary"
                        : "bg-light-dark text-gray-600"
                    }`}
                  >
                    {count?.countRequestInstancesByActionTaker
                      ? count?.countRequestInstancesByActionTaker
                      : 0}
                  </span>
                </button>

                {count?.countAssginRequsetsByActionTaker ? (
                  <>
                    <button
                      className={`btn rounded-0 px-sm-4 px-0 bg-transparent btn-active-color-primary border-0 fs-7 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                        searchParams.get("tabName") === "AssignedRequests"
                          ? " active"
                          : ""
                      }`}
                      onClick={() => {
                        searchParams.set("tabName", "AssignedRequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      <span className="ps-2">
                        {intl.formatMessage({ id: "AssignedRequests" })}
                      </span>
                      <span
                        className={`p-2 px-4 w-10 h-10 rounded text-center ${
                          searchParams.get("tabName") === "AssignedRequests"
                            ? "bg-light-primary"
                            : "bg-light-dark text-gray-600"
                        }`}
                      >
                        {count?.countAssginRequsetsByActionTaker
                          ? count?.countAssginRequsetsByActionTaker
                          : 0}
                      </span>
                    </button>
                  </>
                ) : (
                  <></>
                )}

                {count?.countRequestInstancesTharUserTakeAction ? (
                  <>
                    <button
                      className={`btn rounded-0 px-sm-4 px-0 bg-transparent btn-active-color-primary border-0 fs-7 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                        searchParams.get("tabName") === "ArchivedRequests"
                          ? " active"
                          : ""
                      }`}
                      onClick={() => {
                        searchParams.set("tabName", "ArchivedRequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      <span className="ps-2">
                        {intl.formatMessage({ id: "ArchivedRequests" })}
                      </span>
                      <span
                        className={`p-2 px-4 w-10 h-10 rounded text-center ${
                          searchParams.get("tabName") === "ArchivedRequests"
                            ? "bg-light-primary"
                            : "bg-light-dark text-gray-600"
                        }`}
                      >
                        {count?.countRequestInstancesTharUserTakeAction
                          ? count?.countRequestInstancesTharUserTakeAction
                          : 0}
                      </span>
                    </button>
                  </>
                ) : (
                  <></>
                )}

                {count?.countCancelRequestInstance ? (
                  <>
                    <button
                      className={` btn rounded-0 px-sm-4 px-0 bg-transparent btn-active-color-primary border-0 fs-7 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                        searchParams.get("tabName") === "canceledRequests"
                          ? " active"
                          : ""
                      }`}
                      onClick={() => {
                        searchParams.set("tabName", "canceledRequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      <span className="ps-2">
                        {intl.formatMessage({ id: "CanceledRequests" })}
                      </span>
                      <span
                        className={`p-2 px-4 w-10 h-10 rounded text-center ${
                          searchParams.get("tabName") === "canceledRequests"
                            ? "bg-light-primary"
                            : "bg-light-dark text-gray-600"
                        }`}
                      >
                        {count?.countCancelRequestInstance
                          ? count?.countCancelRequestInstance
                          : 0}
                      </span>
                    </button>
                  </>
                ) : (
                  <></>
                )}

                {count?.countCancelRequestInstance ? (
                  <>
                    <button
                      className={` btn rounded-0 px-sm-4 px-0 bg-transparent btn-active-color-primary border-0 fs-7 fw-bolder border border-bottom border-white border-2 border-active-primary ${
                        searchParams.get("tabName") === "suggestedRequests"
                          ? " active"
                          : ""
                      }`}
                      onClick={() => {
                        searchParams.set("tabName", "suggestedRequests");
                        setSearchParams(searchParams);
                      }}
                    >
                      <span className="ps-2">
                        {intl.formatMessage({ id: "SuggestedRequests" })}
                      </span>
                      <span
                        className={`p-2 px-4 w-10 h-10 rounded text-center ${
                          searchParams.get("tabName") === "suggestedRequests"
                            ? "bg-light-primary"
                            : "bg-light-dark text-gray-600"
                        }`}
                      >
                        {count?.countRequestSuggestion
                          ? count?.countRequestSuggestion
                          : 0}
                      </span>
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <button
                className="btn btn-primary w-sm-auto w-100"
                onClick={() => {
                  setShowFilter(true);
                }}
              >
                {intl.formatMessage({ id: "Filtering" })}
              </button>
            </div>

            {searchParams.get("tabName") === "outgoingrequests" ||
            location.search === "" ? (
              <div
                className={`tab-pane fade  ${
                  searchParams.get("tabName") === "outgoingrequests" ||
                  location.search === ""
                    ? "show"
                    : ""
                }`}
                id="kt_tab_project_tasks"
              >
                {outgoingRequestsWithFilter?.length > 0 ? (
                  <>
                    {" "}
                    <OutgoingRequestsTable
                      outgoingRequestsWithFilter={outgoingRequestsWithFilter}
                    />
                    <SystemPagination
                      totalPages={paginationOutgoingTotalPages}
                      totalItems={paginationOutgoingTotalItems}
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
            ) : searchParams.get("tabName") === "incomingrequests" ? (
              <div
                className={`tab-pane fade  ${
                  searchParams.get("tabName") === "incomingrequests"
                    ? "show "
                    : ""
                }`}
                id="kt_tab_staff_tasks"
              >
                {incomingRequestsWithFilter?.length > 0 ? (
                  <>
                    <IncomingRequestsTable
                      incomingRequestsWithFilter={incomingRequestsWithFilter}
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                    />
                    <SystemPagination
                      totalPages={paginationIncomingTotalPages}
                      totalItems={paginationIncomingTotalItems}
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
            ) : searchParams.get("tabName") === "AssignedRequests" ? (
              <div
                className={`tab-pane fade  ${
                  searchParams.get("tabName") === "AssignedRequests"
                    ? "show "
                    : ""
                }`}
                id="kt_tab_staff_tasks"
              >
                {assignRequestsWithFilter?.length > 0 ? (
                  <>
                    {" "}
                    <AssignRequestsTable
                      assignRequestsWithFilter={assignRequestsWithFilter}
                    />
                    <SystemPagination
                      totalPages={paginationAssignTotalPages}
                      totalItems={paginationAssignTotalItems}
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
            ) : searchParams.get("tabName") === "ArchivedRequests" ? (
              <div
                className={`tab-pane fade  ${
                  searchParams.get("tabName") === "ArchivedRequests"
                    ? "show "
                    : ""
                }`}
                id="kt_tab_staff_tasks"
              >
                {totalItemsForArchive > 0 ? (
                  <>
                    <ArchiveRequestsTable
                      archivedRequestsWithFilter={archivedRequestsWithFilter}
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
                      <p> {intl.formatMessage({ id: "NotFoundResults" })}</p>
                    </div>
                  </>
                )}
              </div>
            ) : searchParams.get("tabName") === "canceledRequests" ? (
              <div
                className={`tab-pane fade  ${
                  searchParams.get("tabName") === "canceledRequests"
                    ? "show "
                    : ""
                }`}
                id="kt_tab_staff_tasks"
              >
                {canceledRequestsWithFilter?.length > 0 ? (
                  <>
                    {" "}
                    <CanceledRequestsTable
                      canceledRequestsWithFilter={canceledRequestsWithFilter}
                    />
                    <SystemPagination
                      totalPages={paginationCancelledTotalItems}
                      totalItems={paginationCancelledTotalPages}
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
                      <p> {intl.formatMessage({ id: "NotFoundResults" })}</p>
                    </div>
                  </>
                )}
              </div>
            ) : searchParams.get("tabName") === "suggestedRequests" ? (
              <div
                className={`tab-pane fade  ${
                  searchParams.get("tabName") === "suggestedRequests"
                    ? "show "
                    : ""
                }`}
                id="kt_tab_staff_tasks"
              >
                {suggestedRequestsWithFilter?.length > 0 ? (
                  <>
                    {" "}
                    <SuggestedRequestsTable
                      suggestedRequestsWithFilter={suggestedRequestsWithFilter}
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
                      <p> {intl.formatMessage({ id: "NotFoundResults" })}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {searchParams.get("tabName") === "ArchivedRequests" ? (
        <>
          {" "}
          <RequestsFilterForArchivePopup
            show={showFilter}
            handleClose={() => {
              handleClose();
            }}
            setTotalItems={setTotalItemsForArchive}
            setTotalPages={setTotalPagesForArchive}
            {...{ setArchivedRequestsWithFilter }}
          />
        </>
      ) : (
        <>
          <RequestsFilterPopup
            show={showFilter}
            handleClose={() => {
              handleClose();
            }}
            {...{
              setNumberOfAssignedRequests,
              setNumberOfIncomingRequests,
              setNumberOfOutgoingRequests,
            }}
          />
        </>
      )}
    </Fragment>
  );
}

export default RequestsTables;
