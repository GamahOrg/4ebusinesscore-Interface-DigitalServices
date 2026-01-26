import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ReportsTab from "./ReportsTab";
import AdminstrationReportsTab from "./AdminstrationReportsTab";
import EmployeesTab from "./EmployeesTab";
import MyReportsTab from "./MyReportsTab";
import IndicatorsTab from "./IndicatorsTab";
import Dropdown from "react-bootstrap/Dropdown";
import { featchGetmainClassification } from "../../../../redux/features/mainClassification/GetAllmainClassificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { DetermineForResponse } from "../../../../models/get-report/ResponseReport";
import { fetchGetCountAdmin } from "../../../../redux/features/service-operation/report/GetCountSlice";
import { useLocation } from "react-router-dom";

function TechnicalSupportFeedbacksAdminstrationManager() {
  let intl = useIntl();
  let dispatch = useDispatch();
  let location = useLocation();
  const mainClassificationId =
    localStorage.getItem("mainClassificationId") ||
    location?.state?.mainClassificationId;

  let mainClassificationData = useSelector((state: RootState) => {
    return state?.GetAllmainClassification.data;
  });

  const [selectedValue, setSelectedValue] = useState(
    intl.formatMessage({ id: "AllCategories" })
  );
  const [tabDisplayed, setTabDisplayed] = useState("my-reports");
  let [requestType, setRequestType] = useState(1);

  const [search, setSearch] = useState<string>("");
  // const [selectedMainClassificationIds, setSelectedMainClassificationIds] =
  //   useState<string | null>(null);
  const [selectedMainClassificationIds, setSelectedMainClassificationIds] =
    useState<string | null | any>(
      mainClassificationId !== "00000000-0000-0000-0000-000000000000"
        ? mainClassificationId
        : null
    );

  useEffect(() => {
    dispatch(
      featchGetmainClassification({
        pageSize: 10000,
        pageNumber: 1,
        ClassificationId: selectedMainClassificationIds,
      }) as any
    );
  }, []);

  useEffect(() => {
    if (mainClassificationId && mainClassificationData?.length > 0) {
      const selectedClassification =
        Array.isArray(mainClassificationData) &&
        mainClassificationData?.find(
          (classification) => classification.id === mainClassificationId
        );
      if (selectedClassification) {
        setSelectedValue(
          intl.locale == "ar"
            ? selectedClassification.name
            : selectedClassification.nameEn
        );
        setSelectedMainClassificationIds(mainClassificationId);
      }
    }
  }, [mainClassificationId, mainClassificationData]);

  useEffect(() => {
    const prams = {
      DetermineForResponse:
        DetermineForResponse.GetReportsForTechnicalSupportManager,
      ClassificationId: selectedMainClassificationIds,
      RequestType: requestType,
    };
    dispatch(fetchGetCountAdmin(prams) as any);
  }, [selectedMainClassificationIds, requestType]);

  return (
    <Fragment>
      <div className="card card-xl-stretch mb-xl-8">
        <div className="card-header d-flex">
          <div className="w-70 d-flex justify-content-md-between align-items-md-center flex-column flex-md-row">
            <button
              className={`w-30 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "my-reports" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "my-reports");
                setRequestType(1);
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "Tickets",
              })}{" "}
            </button>

            <button
              className={`w-30 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "ReportsTab" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "ReportsTab");
                setRequestType(0);
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "TheReports",
              })}{" "}
            </button>

            <button
              className={`w-50 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "adminstration-reports" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "adminstration-reports");
                setSearch((prev) => {
                  return prev;
                });
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "ManagementStatistics",
              })}{" "}
            </button>
            <button
              className={`w-50 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "employees" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "employees");
                setSearch((prev) => {
                  return prev;
                });
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "EmployeeStatistics",
              })}{" "}
            </button>
            <button
              className={`w-50 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "Indicators" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "Indicators");
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "Indicators",
              })}{" "}
            </button>
          </div>
          <div className="w-40 d-flex justify-content-end align-items-center">
            <div className="w-40 mx-3"> </div>
          </div>
        </div>
        {tabDisplayed === "ReportsTab" || tabDisplayed === "my-reports" ? (
          <>
            <div className="d-flex mb-2 pt-2 pb-3 justify-content-md-between align-items-md-center w-100 px-5 flex-column flex-md-row">
              <div className="position-relative w-45">
                <input
                  type="search"
                  name="searchForProject"
                  className="input input-group searchBoxDesign search_input"
                  id="searchForProject"
                  placeholder={intl.formatMessage({
                    id:
                      tabDisplayed === "my-reports"
                        ? "SearchTicket"
                        : "SearchReport",
                  })}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
              </div>
              <div className="w-200px">
                <Dropdown
                  onSelect={(eventKey) => {
                    const value: any =
                      eventKey === "all"
                        ? intl.formatMessage({ id: "AllCategories" })
                        : Array.isArray(mainClassificationData) &&
                          (intl.locale == "ar"
                            ? mainClassificationData?.find(
                                (classification) =>
                                  classification.id === eventKey
                              )?.name
                            : mainClassificationData?.find(
                                (classification) =>
                                  classification.id === eventKey
                              )?.nameEn);
                    setSelectedValue(value);
                    setSelectedMainClassificationIds(
                      eventKey === "all" ? null : eventKey
                    );
                  }}
                >
                  <Dropdown.Toggle
                    variant="null"
                    id="dropdown-basic"
                    className="form-select  inputHeight form-select-solid mt-1 mx-3  btn btn-null"
                  >
                    {selectedValue}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                    <Dropdown.Item
                      eventKey="all"
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "AllCategories" })}
                    </Dropdown.Item>

                    {Array.isArray(mainClassificationData) &&
                      mainClassificationData
                        ?.filter((item: any) => item?.isShowInHomePage === true)
                        ?.map((role: any) => (
                          <Dropdown.Item
                            className="DropDownOptions py-1"
                            key={role.id}
                            eventKey={role.id}
                          >
                            {intl?.locale.toLowerCase() === "ar"
                              ? role?.name
                              : role?.nameEn}
                          </Dropdown.Item>
                        ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="d-none mb-2 pt-2 pb-3 justify-content-md-between align-items-md-center w-100 px-5 flex-column flex-md-row">
              <div className="position-relative w-45">
                <input
                  type="search"
                  name="searchForProject"
                  className="input input-group searchBoxDesign search_input"
                  id="searchForProject"
                  placeholder={intl.formatMessage({
                    id: "SearchRequest",
                  })}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
              </div>
              <div className="w-200px">
                <Dropdown
                  onSelect={(eventKey) => {
                    const value: any =
                      eventKey === "all"
                        ? intl.formatMessage({ id: "AllCategories" })
                        : Array.isArray(mainClassificationData) &&
                          mainClassificationData?.find(
                            (classification) => classification.id === eventKey
                          )?.name;
                    setSelectedValue(value);
                    setSelectedMainClassificationIds(
                      eventKey === "all" ? null : eventKey
                    );
                  }}
                >
                  <Dropdown.Toggle
                    variant="null"
                    id="dropdown-basic"
                    className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                  >
                    {selectedValue}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                    <Dropdown.Item
                      eventKey="all"
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "AllCategories" })}
                    </Dropdown.Item>
                    {Array.isArray(mainClassificationData) &&
                      mainClassificationData
                        ?.filter((item: any) => item?.isShowInHomePage === true)
                        ?.map((role: any) => (
                          <Dropdown.Item
                            className="DropDownOptions py-1"
                            key={role.id}
                            eventKey={role.id}
                          >
                            {intl?.locale.toLowerCase() === "ar"
                              ? role?.name
                              : role?.name}
                          </Dropdown.Item>
                        ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </>
        )}

        {tabDisplayed === "ReportsTab" ? (
          <ReportsTab
            RequestType={requestType}
            tabName={tabDisplayed}
            selectedMainClassificationIds={selectedMainClassificationIds}
            search={search}
          />
        ) : tabDisplayed === "my-reports" ? (
          <MyReportsTab
            RequestType={requestType}
            tabName={tabDisplayed}
            selectedMainClassificationIds={selectedMainClassificationIds}
            search={search}
          />
        ) : tabDisplayed === "adminstration-reports" ? (
          <AdminstrationReportsTab />
        ) : tabDisplayed === "employees" ? (
          <EmployeesTab />
        ) : tabDisplayed === "Indicators" ? (
          <IndicatorsTab />
        ) : (
          ""
        )}
      </div>
    </Fragment>
  );
}

export default TechnicalSupportFeedbacksAdminstrationManager;
