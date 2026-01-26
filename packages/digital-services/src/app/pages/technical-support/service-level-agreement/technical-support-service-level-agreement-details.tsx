import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Actions } from "./components/actions";
import { Link, useLocation } from "react-router-dom";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../redux/store/store";
import { getSla } from "../../../redux/features/SLA/slaSlice";
import { SystemPagination } from "@4eplatform/shared/components/SystemPagination";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import Spinner from "react-bootstrap/esm/Spinner";

export const TechnicalSupportServiceLevelAgreementDetails: FC = () => {
  const intl = useIntl();
  let [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  let SLA = useAppSelector((state: RootState) => {
    return state?.sla?.items;
  });
  let totalItems = useAppSelector((state: RootState) => {
    return state?.sla?.taotalItems;
  });
  let totalPages = useAppSelector((state: RootState) => {
    return state?.sla?.totalpages;
  });
  const mainClassificationId = localStorage.getItem("mainClassificationId");
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let params: any = {
      ...(searchTerm && { searchTerm }),
      pageSize: pageSize,
      pageNumber: pageIndex,
      ...(mainClassificationId !== "00000000-0000-0000-0000-000000000000" && {
        mainClassificationId,
      }),
    };
    setLoading(true);
    dispatch(getSla(params) as any).then(() => {
      setLoading(false);
    });
  }, [searchTerm, dispatch, pageIndex, pageSize]);
  let language = intl.locale;
  let theme = localStorage?.getItem("Theme");

  let location = useLocation();
  let cardTitle = location?.state?.cardTitle;
  let cardId = location?.state?.cardId;

  const breadcrumbItems = [
    {
      path: "",
      defaultName:
        cardTitle || intl.formatMessage({ id: "ServiceLevelAgreement" }),
      name: cardTitle || intl.formatMessage({ id: "ServiceLevelAgreement" }),
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={
          cardTitle || intl.formatMessage({ id: "ServiceLevelAgreement" })
        }
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardId={cardId}
        translate={false}
      />
      <div
        id="kt_content_container"
        className="d-flex flex-column-fluid align-items-start container-xxl p-0"
      >
        <div className="content flex-row-fluid" id="kt_content">
          <div
            className="flex-lg-row-fluid"
            data-select2-id="select2-data-129-tmo1"
          >
            <div className="card mb-5 mb-xl-8">
              <div className="d-flex align-items-center justify-content-between flex-wrap w-100 pt-5">
                <div className="py-3">
                  <div className="position-relative w-md-400px">
                    <input
                      type="search"
                      className={`form-control m-3 form-control-solid ps-10 ${
                        theme === "dark" ? "bg-dark text-white" : ""
                      }`}
                      name="search"
                      placeholder={intl.formatMessage({
                        id: "TypeYourSearchHere",
                      })}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i
                      className={`fa-solid fa-light fa-magnifying-glass my-magnify fs-3 ${
                        theme === "dark" ? "text-white" : "text-muted"
                      } fa-fw position-absolute`}
                    ></i>
                  </div>
                </div>
                <div className="py-3 ms-5">
                  <Link
                    to={{
                      pathname:
                        "/technical-support-service-level-agreement-details/addNewTechnicalAgreement",
                    }}
                    state={{ cardId, cardName: cardTitle }}
                    className="btn btn-primary"
                  >
                    <bdi>
                      {intl.formatMessage({
                        id: "AddNewAgreement",
                      })}
                    </bdi>
                  </Link>
                </div>
              </div>
              <div className="card-body py-3">
                {loading ? (
                  <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                    {intl.formatMessage({ id: "DataIsLoaded..." })}
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
                    <div className="py-5 taskLogs">
                      <div className="table-responsive">
                        <div className="table-responsive">
                          <table
                            className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4 dark-table-head"
                            id="REGA-WS-caseList"
                          >
                            <thead>
                              <tr className="fw-bolder">
                                <th
                                  className={`ps-4 min-w-100px ${
                                    theme == "dark" ? "dark_mute_text" : ""
                                  }`}
                                >
                                  <span
                                    className={`${
                                      theme == "dark" ? "dark_mute_text" : ""
                                    }`}
                                  >
                                    {intl.formatMessage({ id: "SLAName" })}
                                  </span>
                                </th>
                                <th className="min-w-250px">
                                  <span
                                    className={`${
                                      theme == "dark" ? "dark_mute_text" : ""
                                    }`}
                                  >
                                    {intl.formatMessage({
                                      id: "ServiceImplementationPeriod",
                                    })}
                                  </span>
                                </th>
                                <th className="min-w-150px">
                                  <span
                                    className={`${
                                      theme == "dark" ? "dark_mute_text" : ""
                                    }`}
                                  >
                                    {intl.formatMessage({
                                      id: "ResponseTime",
                                    })}
                                  </span>
                                </th>
                                <th className="min-w-50px text-center">
                                  <span
                                    className={`${
                                      theme == "dark" ? "dark_mute_text" : ""
                                    }`}
                                  >
                                    {intl.formatMessage({
                                      id: "Actions",
                                    })}
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {SLA?.map((item: any) => (
                                <tr key={item?.id}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="ms-5">
                                        <Link
                                          to={`/technical-support-service-level-agreement-details/technical-support-service-level-agreement-details-sla/${item?.id}`}
                                          className="text-primary-800 text-hover-primary fw-bolder fs-6"
                                          state={{
                                            cardId,
                                            cardName: cardTitle,
                                          }}
                                        >
                                          {intl.locale == "ar"
                                            ? item?.slaName
                                            : item?.slaNameEn}
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="ms-5">
                                        <span className="text-gray-800 fw-bolder d-block fs-6">
                                          {language == "ar"
                                            ? item?.implementPeriodAr
                                            : item?.implementPeriodEn}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="ms-5">
                                        <span className="text-gray-800 fw-bolder d-block fs-6">
                                          {language == "ar"
                                            ? item?.respondPeriodAr
                                            : item?.respondPeriodEn}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <Actions
                                        id={item?.id}
                                        {...{
                                          pageSize,
                                          pageIndex,
                                          setPageSize,
                                          setPageIndex,
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {totalPages > 0 ? (
                          <SystemPagination
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            setPageIndex={setPageIndex}
                            setPageSize={setPageSize}
                            totalPages={totalPages}
                            totalItems={totalItems}
                          />
                        ) : (
                          <div className="d-flex fw-bolder justify-content-center align-items-center">
                            {intl.formatMessage({ id: "No_data_yet" })}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
