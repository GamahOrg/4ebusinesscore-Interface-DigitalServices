import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getMainClassification,
  getMainClassificationById,
} from "../../../../redux/features/mainClassification/mainClassificationSlice";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store/store";
import { getServiceCatalog } from "../../../../redux/features/serviceCatalog/serviceCatalogSlice";
import { MainClassification } from "../../../../models/MainClassificationModel";
import { ServiceCatalog } from "../../../../models/serviceMangment/serviceCatalog/serviceCatalogModel";
import { setCurrentReport } from "../../../../redux/features/report/reportSlice";
import Spinner from "react-bootstrap/esm/Spinner";

function CurrentServiceReport() {
  let intl = useIntl();
  let [loadingForMainClassifications, setLoadingForMainClassifications] =
    useState<boolean>(false);
  let [loadingForSubClassifications, setLoadingForSubClassifications] =
    useState<boolean>(false);

  let { id } = useParams();

  let mainClassificationId = localStorage.getItem("mainClassificationId");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let [activeApps, setActiveApps] = useState("");
  let [serviceCatalogsData, setServiceCatalogsData] = useState<
    ServiceCatalog[]
  >([]);
  let location = useLocation();
  const cardTitle = location?.state?.serviceName || location?.state?.cardTitle;
  const createIconFromHTML = (htmlString: string) => {
    return React.createElement("div", {
      dangerouslySetInnerHTML: { __html: htmlString },
    });
  };
  let activeAppsHandler = (id: string) => {
    setActiveApps(id);
  };

  const mainClassification = useAppSelector(
    (state: RootState) => state.mainClassification.data.mainClassifications,
  );
  const serviceCatalogs = useAppSelector(
    (state: RootState) => state.serviceCatalog.data.data,
  );
  const report = useAppSelector(
    (state: RootState) => state.report.currentReport,
  );
  let notValidClassificationIds = [
    "",
    "00000000-0000-0000-0000-000000000000",
    "null",
    null,
    undefined,
  ];
  const filterdMainClassification = !notValidClassificationIds.includes(
    mainClassificationId,
  )
    ? mainClassification?.filter(
        (filterItem: any) =>
          filterItem?.id == mainClassificationId &&
          (filterItem?.serviceType === 3 || filterItem?.serviceType === 1),
      )
    : mainClassification?.filter(
        (filterItem: any) =>
          filterItem?.serviceType === 3 || filterItem?.serviceType === 1,
      );

  useEffect(() => {
    if (activeApps) {
      setServiceCatalogsData(() => {
        return (
          serviceCatalogs?.filter(
            (item: any) =>
              item.mainClassificationId == activeApps &&
              (item.serviceType === 3 || item.serviceType === 1),
          ) || []
        );
      });
    } else {
      if (mainClassificationId != "00000000-0000-0000-0000-000000000000") {
        setActiveApps(mainClassificationId as string);
      }
    }
  }, [activeApps, mainClassification, serviceCatalogs, mainClassificationId]);

  const navigationHandler = (serviceId: string) => {
    dispatch(setCurrentReport({ ...report, ServiceCatalogId: serviceId }));
    const hash = id ? "#filtered" : "";
    navigate(
      `/current-service-report/add-current-service/${activeApps}${hash}?serviceCatalogId=${serviceId}`,
      {
        state: {
          ServiceCatalogId: serviceId,
          mainClassificationId: id,
          serviceName: cardTitle,
        },
      },
    );
  };

  useEffect(() => {
    setLoadingForMainClassifications(true);
    dispatch(getMainClassification({}) as any).then(() => {
      setLoadingForMainClassifications(false);
    });
  }, []);

  useEffect(() => {
    setLoadingForSubClassifications(true);
    dispatch(getServiceCatalog() as any).then(() => {
      setLoadingForSubClassifications(false);
    });
  }, [mainClassification]);
  useEffect(() => {
    setActiveApps("");
  }, []);
  let isDark = localStorage.getItem("Theme") === "dark" ? true : false;

  return (
    <Fragment>
      <div
        id="kt_content_container"
        className="d-flex flex-column-fluid align-items-start"
      >
        <div className="content flex-row-fluid " id="kt_content">
          <div className="w-100 row  d-flex justify-content-between ">
            <div
              className="nav col-12 col-md-3 pt-7 card shadow h-fit pb-9  d-flex  flex-column nav-pills mb-3   background-pills "
              id="pills-tab"
              role="tablist"
            >
              <h5 className="me-3 pt-2 h-30px px-6 mb-3">
                {intl.formatMessage({ id: "MainClassification" })}{" "}
              </h5>
              {loadingForMainClassifications ? (
                <>
                  <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                    {intl.formatMessage({ id: "DataIsLoaded..." })}
                    <Spinner animation="border" variant="primary" />
                  </div>
                </>
              ) : (
                <div
                  className="w-100"
                  style={{
                    maxHeight: "50vh",
                    overflowY: "auto",
                    minHeight: "5vh",
                  }}
                >
                  {filterdMainClassification?.length ? (
                    filterdMainClassification
                      ?.filter((item: MainClassification) => {
                        return item?.isShowInHomePage;
                      })
                      ?.map((item: MainClassification) => (
                        <div
                          key={item.id}
                          className="nav-item  h-fit w-90 navTabsPills"
                          style={{ maxWidth: "90%" }}
                          role="presentation"
                        >
                          <button
                            className={`nav-link w-100 m-1 fs-5 fw-bolder d-flex justify-content-start align-items-center ps-3 py-3 gap-2 ${
                              activeApps == item.id
                                ? `rounded-0 active  border-0 ms-6 fs-5 pe-3 fw-bolder border-active-primary ${
                                    isDark
                                      ? "text-white"
                                      : "btn-active-color-primary"
                                  }`
                                : "text-muted"
                            }`}
                            id="apps-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#apps"
                            type="button"
                            role="tab"
                            aria-controls="options"
                            aria-selected="true"
                            onClick={() => {
                              activeAppsHandler(item.id as any);
                            }}
                          >
                            <span
                              id="getIconColor"
                              className={
                                item?.color ==
                                (item?.color?.toLocaleLowerCase() == "red" ||
                                  "احمر")
                                  ? "beIconRed"
                                  : item?.color ==
                                    (item?.color?.toLocaleLowerCase() ==
                                      "blue" || "ازرق")
                                  ? "beIconBlue"
                                  : item?.color ==
                                    (item?.color?.toLocaleLowerCase() ==
                                      "green" || "اخضر")
                                  ? "beIconGreen"
                                  : item?.color ==
                                    (item?.color?.toLocaleLowerCase() ==
                                      "yellow" || "اصفر")
                                  ? "beIconYellow"
                                  : ""
                              }
                            >
                              {createIconFromHTML(item.icon)}
                            </span>
                            <div>
                              <span className="fw-bolder fs-6">
                                {intl.locale == "ar" ? item.name : item.nameEn}
                              </span>
                            </div>
                          </button>
                        </div>
                      ))
                  ) : (
                    <p className="d-flex justify-content-center text-muted">
                      {" "}
                      {intl.formatMessage({ id: "NotExist" })}
                    </p>
                  )}
                </div>
              )}
            </div>
            {activeApps ? (
              <div
                className="tab-content col-12 col-md-9 px-2 "
                id="pills-tabContent"
              >
                <div
                  className="card mb-5 mb-xl-10 shadow pb-5 tab-pane fade show active"
                  id="apps"
                  role="tabpanel"
                  aria-labelledby="apps-tab"
                >
                  <div className="card-body pt-5 pb-0">
                    <h5 className="me-3 pt-2 h-30px px-4 mb-5">
                      {intl.formatMessage({ id: "SubCategory" })}{" "}
                    </h5>
                    {loadingForSubClassifications ? (
                      <>
                        <div className="d-flex gap-4 justify-content-center align-items-center py-4">
                          {intl.formatMessage({ id: "DataIsLoaded..." })}
                          <Spinner animation="border" variant="primary" />
                        </div>
                      </>
                    ) : (
                      <>
                        {" "}
                        {serviceCatalogsData.length > 0 &&
                        filterdMainClassification?.filter(
                          (item: MainClassification) => {
                            return item?.isShowInHomePage;
                          },
                        ).length > 0 ? (
                          serviceCatalogsData.map(
                            (catalog: ServiceCatalog, index) => (
                              <div
                                key={index}
                                className={`px-4 py-2 mb-3 w-100 ${
                                  index + 1 != serviceCatalogsData.length
                                    ? "my-gray-dash-border"
                                    : ""
                                }`}
                              >
                                <span
                                  onClick={() => navigationHandler(catalog.id)}
                                  className="text-white text-hover-primary cursor-pointer"
                                >
                                  <p className="pb-2 mb-2 text-primary -50 fs-5 fw-bolder">
                                    {intl.locale == "ar"
                                      ? catalog.name
                                      : catalog.nameEn}
                                  </p>
                                </span>
                              </div>
                            ),
                          )
                        ) : (
                          <p className="d-flex justify-content-center text-muted py-5">
                            {intl.formatMessage({ id: "NotExist" })}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default CurrentServiceReport;
