import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import Swal from "sweetalert2";
import { getMainClassification } from "../../../../redux/features/mainClassification/mainClassificationSlice";
import { getColorClass } from "@4eplatform/shared/functions/getColor";
import Spinner from "react-bootstrap/esm/Spinner";

function IndicatorsTab() {
  let intl = useIntl();
  let [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [serachPageIndex, setSerachPageIndex] = useState(1);
  const [serachPageSize, setSerachPageSize] = useState(10);
  const [search, setSearch] = useState<string>("");
  let theme = localStorage.getItem("Theme");

  const mainClassifications = useSelector(
    (state: any) => state.mainClassification?.data?.mainClassifications
  );

  const { totalItems, totalPages } = useSelector(
    (state: any) => state.mainClassification?.data
  );

  useEffect(() => {
    const params = {
      pageSize: search == "" ? pageSize : serachPageSize,
      pageNumber: search == "" ? pageIndex : serachPageIndex,
      search: search,
    };
    setLoading(true);
    dispatch(getMainClassification(params) as any).then(() => {
      setLoading(false);
    });
  }, [pageSize, pageIndex, search, serachPageIndex, serachPageSize]);

  const handleClick = (event: React.MouseEvent, item: any) => {
    if (!item?.kpi) {
      event.preventDefault();
      showSuccessOrFailureAlert("IndicatorsPrepared", "warning");
    }
  };

  const showSuccessOrFailureAlert = (text: any, icon: any) => {
    Swal.fire({
      text: intl.formatMessage({ id: text }),
      icon: icon,
      heightAuto: false,
      buttonsStyling: false,
      confirmButtonText: intl.formatMessage({ id: "Agree" }),
      customClass: {
        confirmButton: `btn btn-${icon !== "error" ? "primary" : "danger"}`,
        popup:
          theme === "dark"
            ? [
                "swal2-html-container-dark",
                "swal2-success-circular-line-left-dark",
                "swal2-success-circular-line-right-dark",
              ]
            : "",
      },
    });
  };

  return (
    <>
      <div className="card-body py-3 pb-7">
        <div className="card-header border-0 pt-3 pb-2 mb-2">
          <div className="d-flex mb-2 pt-2 pb-3 justify-content-between align-items-center w-100">
            <div className="position-relative w-45">
              <input
                type="search"
                name="searchForProject"
                className="input input-group searchBoxDesign search_input"
                id="searchForProject"
                placeholder={intl.formatMessage({
                  id: "SearchService",
                })}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
            </div>
          </div>
        </div>

        <div
          className="flex-lg-row-fluid"
          data-select2-id="select2-data-129-tmo1"
        >
          <div className="tab-content">
            <div
              id="kt_project_users_table_pane"
              className="tab-pane fade active show"
            >
              <div className="card card-flush">
                <div className="card-body pt-0">
                  {loading ? (
                    <>
                      <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                        {intl.formatMessage({ id: "DataIsLoaded..." })}
                        <Spinner animation="border" variant="primary" />
                      </div>
                    </>
                  ) : (
                    <>
                      {mainClassifications?.length > 0 ? (
                        <>
                          <div className="table-responsive">
                            <table
                              id="kt_project_users_table"
                              className="table table-row-bordered table-row-dashed gy-4 align-middle fw-bolder"
                            >
                              <thead className="fs-7 text-gray-400 text-uppercase">
                                <tr>
                                  <th className="min-w-250px">
                                    {intl.formatMessage({ id: "Servicename" })}
                                  </th>
                                  <th className="min-w-50px text-center">
                                    {intl.formatMessage({
                                      id: "TheProcedures",
                                    })}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="fs-6">
                                {mainClassifications?.map(
                                  (item: any, index: number) => (
                                    <tr key={index}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div className="symbol symbol-50px mb-2 toolsIcon indicatorsIcons">
                                            <span
                                              className={`m-4 p-2 w-20 text-center rounded-2 mb-3  bg-light-${getColorClass(
                                                item?.color
                                              )}`}
                                            >
                                              <span
                                                className={`svg-icon svg-icon-4x svg-icon-${getColorClass(
                                                  item?.color
                                                )}`}
                                                dangerouslySetInnerHTML={{
                                                  __html: item?.icon,
                                                }}
                                              ></span>
                                            </span>
                                          </div>

                                          <div className="d-flex flex-column justify-content-center">
                                            {item?.kpi ? (
                                              <>
                                                <Link
                                                  onClick={(event) =>
                                                    handleClick(event, item)
                                                  }
                                                  to={item?.kpi || "#"}
                                                  target="_blank"
                                                  className="mb-1 text-gray-800 text-hover-info"
                                                >
                                                  {intl.locale=="ar"?item?.name:item?.nameEn}
                                                </Link>
                                              </>
                                            ) : (
                                              <>
                                                <div
                                                  onClick={(event) =>
                                                    handleClick(event, item)
                                                  }
                                                  className="mb-1 text-gray-800 text-hover-info cursor-pointer"
                                                >
                                                  {intl.locale=="ar"?item?.name:item?.nameEn}
                                                </div>
                                              </>
                                            )}
                                            <div className="fw-bold fs-6 text-gray-400">
                                              {intl.locale=="ar"?item?.description:item?.descriptionEn}
                                            </div>
                                          </div>
                                        </div>
                                      </td>

                                      <td className="text-center">
                                        {item?.kpi ? (
                                          <>
                                            <Link
                                              onClick={(event) =>
                                                handleClick(event, item)
                                              }
                                              to={item?.kpi || "#"}
                                              target="_blank"
                                              className="text-primary fw-bolder text-hover-primary mb-1 fs-6"
                                            >
                                              <i className="fa-solid fa-eye mx-2"></i>
                                              {intl.formatMessage({
                                                id: "Show",
                                              })}
                                            </Link>
                                          </>
                                        ) : (
                                          <>
                                            <div
                                              onClick={(event) =>
                                                handleClick(event, item)
                                              }
                                              className="text-primary fw-bolder text-hover-primary mb-1 fs-6 cursor-pointer"
                                            >
                                              <i className="fa-solid fa-eye mx-2"></i>
                                              {intl.formatMessage({
                                                id: "Show",
                                              })}
                                            </div>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="d-flex justify-content-center py-10 text-muted">
                            {intl.formatMessage({ id: "NotExist" })}{" "}
                            <i className="fa-solid fa-ban px-3 fs-4"></i>
                          </span>
                        </>
                      )}
                      {+totalPages > 0 ? (
                        <SystemPagination
                          totalItems={+totalItems}
                          totalPages={+totalPages}
                          pageIndex={search == "" ? pageIndex : serachPageIndex}
                          pageSize={search == "" ? pageSize : serachPageSize}
                          setPageIndex={
                            search == "" ? setPageIndex : setSerachPageIndex
                          }
                          setPageSize={
                            search == "" ? setPageSize : setSerachPageSize
                          }
                        />
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndicatorsTab;
