import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import { Link, useLocation } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store/store";
import TechnicalReportsSolutionsRow from "./technical-reports-solutions/technical-reports-solutions-row";
import { getResolverComponent } from "../../../../redux/features/Resolver/getAllResolveSlice";
import { getUserLoggedIn } from "../../../../redux/features/requestTemplate/requestTemplateSlice";
import Spinner from "react-bootstrap/esm/Spinner";
import { getMainClassification } from "../../../../redux/features/Resolver/getMainClassificationSlice";

function TechnicalReportsSolutions({ mainClassificationId }: any) {
  const intl = useIntl();
  const classificationId = localStorage.getItem("mainClassificationId");
  let [loading, setLoading] = useState<boolean>(true);

  const [MainId, setMainId] = useState("");
  useEffect(() => {
    if (classificationId) setMainId(classificationId);
  }, [classificationId]);

  let resolveReport = useAppSelector((state: RootState) => {
    return state?.getAllResolver.items;
  });
  let pagination = useAppSelector((state: RootState) => {
    return state?.getAllResolver?.pagination;
  });

  let location = useLocation();
  let cardTitle = location?.state?.cardTitle || location?.state?.serviceName;
  let cardId = location?.state?.cardId;
  let mainClassificationIdLocation =
    location?.state?.mainClassificationId || location?.state?.extraState;

  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let params: any;
    classificationId
      ? (params = {
          pageSize: pageSize,
          pageNumber: pageIndex,
          name: searchTerm || undefined,
          mainClassificationId: classificationId,
        })
      : (params = {
          pageSize: pageSize,
          pageNumber: pageIndex,
          name: searchTerm || undefined,
        });
    setLoading(true);
    dispatch(getResolverComponent(params) as any).then(() => {
      setLoading(false);
    });
  }, [pageIndex, pageSize, searchTerm, classificationId]);

  const handleSearch = () => {
    let params: any = {
      name: searchTerm,
      pageSize: pageSize,
      pageNumber: pageIndex,
    };
    dispatch(getResolverComponent(params) as any);
  };

  useEffect(() => {
    dispatch(getUserLoggedIn("") as any);
  }, []);

  let userLoggedIn = useAppSelector((state: RootState) => {
    return state?.requestTemplate?.userLogin;
  });

  const userRoleId = [
    "edf30411-8c1f-48b1-8011-81a557735b0d",
    "4450bea1-7bbf-43ce-ad43-e48a5b730583",
  ];
  useEffect(() => {
    dispatch(getMainClassification() as any);
  }, [dispatch]);

  return (
    <Fragment>
      <div className="card shadow p-6 mb-7 ">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="position-relative  py-4 w-50 mx-9">
            <button
              onClick={() => handleSearch()}
              className="btn  position-absolute end-0 top-0 h-100"
            >
              <i className="fas fa-search"></i>
            </button>
            <input
              type="search"
              name="searchForProject"
              className="input input-group searchBoxDesign search_input"
              id="searchForProject"
              placeholder={intl.formatMessage({
                id: "FindSolutions",
              })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i
              onClick={() => handleSearch()}
              className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"
            ></i>
          </div>
          {userLoggedIn?.userName === "SystemAdmin" ? (
            <div className="h-50 w-50 d-flex justify-content-end align-items-center">
              <Link
                to={`/technical-reports-solutions/add-new-solution/${MainId}`}
                state={{
                  mainClassificationId: mainClassificationIdLocation,
                  cardId,
                  cardTitle,
                }}
                className="btn btn-primary mx-1 text-center h-50"
                style={{ minWidth: "115px" }}
              >
                {intl.formatMessage({ id: "AddingSolution" })}
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>

        {loading ? (
          <div className="d-flex gap-4 justify-content-center align-items-center py-4">
            {intl.formatMessage({ id: "DataIsLoaded..." })}
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="table-responsive mb-3">
              <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4 text-center dark-table-head">
                {resolveReport?.length ? (
                  <thead>
                    <tr className="fw-bolder">
                      <th className="px-2 pb-3 min-w-50px max-w-200px text-muted">
                        {intl.formatMessage({ id: "SolutionTitle" })}{" "}
                      </th>
                      <th className="px-2 pb-3 min-w-50px  text-muted">
                        {intl.formatMessage({ id: "SolutionDescription" })}{" "}
                      </th>
                      <th className="px-2 pb-3 min-w-50px max-w-200px  text-muted">
                        {intl.formatMessage({ id: "SolutionClassification" })}{" "}
                      </th>
                      <th className="px-2 pb-3 min-w-50px  text-muted">
                        {intl.formatMessage({ id: "Date" })}{" "}
                      </th>
                      <th className="px-2 pb-3 min-w-50px max-w-250px text-center text-muted">
                        {intl.formatMessage({ id: "Procedures" })}{" "}
                      </th>
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {resolveReport?.map((item: any) => {
                    return (
                      <Fragment key={item?.id}>
                        <TechnicalReportsSolutionsRow
                          userLoggedIn={userLoggedIn}
                          userRoleId={userRoleId}
                          item={item}
                        />
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>

              {pagination?.totalPages > 0 ? (
                <SystemPagination
                  totalItems={pagination?.totalItems}
                  totalPages={pagination?.totalPages}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setPageIndex={setPageIndex}
                  setPageSize={setPageSize}
                />
              ) : (
                <div className="d-flex fw-bolder text-muted py-3 justify-content-center align-items-center">
                  {intl.formatMessage({ id: "No_data_yet" })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
}

export default TechnicalReportsSolutions;
