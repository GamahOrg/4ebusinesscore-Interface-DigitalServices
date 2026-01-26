import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import ReportsTab from "./ReportsTab";
import AdminstrationReportsTab from "./AdminstrationReportsTab";
import EmployeesTab from "./EmployeesTab";
import MyReportsTab from "./MyReportsTab";
import IndicatorsTab from "./IndicatorsTab";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { getMainclassficationloggedinUserAdmin } from "../../../../redux/features/mainClassification/mainClassificationLoginUserSlicee";

function TechnicalSupportFeedbacksManager() {
  let intl = useIntl();
  let location = useLocation();
  const [tabDisplayed, setTabDisplayed] = useState("my-reports");
  let [search, setSearch] = useState("");

  const [isDelegation, setIsDelegation] = useState<any>(0);
  let [requestType, setRequestType] = useState(1);

  const [selectedValue, setSelectedValue] = useState(
    intl.formatMessage({ id: "AllCategories" })
  );
  let mainClassificationData = useSelector((state: RootState) => {
    return state?.mainClassificationLoginUser.mainclassficationloggedinData;
  });

  const mainClassificationId =
    localStorage.getItem("mainClassificationId") ||
    location?.state?.mainClassificationId;
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

  const [delegationValue, setDelegationValue] = useState(
    tabDisplayed == "reports"
      ? intl.formatMessage({ id: "AllMyDelegationsAndMyReports" })
      : intl.formatMessage({ id: "AllMyDelegationsAndMyRequests" })
  );
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getMainclassficationloggedinUserAdmin({
        pageSize: 10000,
        pageNumber: 1,
      }) as any
    );
  }, []);
  useEffect(() => {
    if (delegationValue === intl.formatMessage({ id: "Delegation" })) {
      setIsDelegation(2);
    } else if (
      delegationValue ===
        intl.formatMessage({ id: "AllMyDelegationsAndMyReports" }) ||
      delegationValue ===
        intl.formatMessage({ id: "AllMyDelegationsAndMyRequests" })
    ) {
      setIsDelegation(0);
    } else {
      setIsDelegation(1);
    }
  }, [delegationValue, intl]);

  const [selectedMainClassificationIds, setSelectedMainClassificationIds] =
    useState<string | null>(
      mainClassificationId != "00000000-0000-0000-0000-000000000000"
        ? mainClassificationId
        : null
    );
  let theme = localStorage.getItem("Theme");

  return (
    <Fragment>
      <div className="card card-xl-stretch mb-xl-8">
        <div className="card-header d-flex">
          <div className="w-70 d-flex justify-content-md-between align-items-md-center flex-column flex-md-row">
            <button
              className={`w-50 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "my-reports" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "my-reports");
                setRequestType(1);
                setDelegationValue(
                  intl.formatMessage({ id: "AllMyDelegationsAndMyRequests" })
                );
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "Tickets",
              })}{" "}
            </button>
            <button
              className={`w-50 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "reports" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "reports");
                setRequestType(0);
                setDelegationValue(
                  intl.formatMessage({ id: "AllMyDelegationsAndMyReports" })
                );
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
        {tabDisplayed == "reports" ? (
          <>
            <div className="my-4 my-md-0 d-flex px-5 align-items-md-center justify-content-md-between w-100 pb-4 flex-column flex-md-row">
              <div className="position-relative w-45">
                <input
                  type="search"
                  name="searchForProject"
                  className="input input-group searchBoxDesign search_input"
                  id="searchForProject"
                  placeholder={intl.formatMessage({
                    id: "SearchReport",
                  })}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
              </div>

              <div className="mb-0 pt-2 pb-3 w-md-40 d-flex align-items-md-center gap-2 flex-column flex-md-row">
                <Dropdown
                  className="w-50"
                  onSelect={(eventKey) => {
                    const value: any =
                      eventKey === "all"
                        ? intl.formatMessage({ id: "All" })
                        : Array.isArray(mainClassificationData) &&
                          (intl.locale == "ar"
                            ? mainClassificationData?.find(
                                (classification: any) =>
                                  classification.id === eventKey
                              )?.name
                            : mainClassificationData?.find(
                                (classification: any) =>
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
                              : role?.nameEn}
                          </Dropdown.Item>
                        ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  className="w-50"
                  onSelect={(eventKey: any) => {
                    setDelegationValue(eventKey);
                  }}
                >
                  <Dropdown.Toggle
                    variant="null"
                    id="dropdown-basic"
                    className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                  >
                    {delegationValue}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                    <Dropdown.Item
                      eventKey={intl.formatMessage({
                        id: "AllMyDelegationsAndMyReports",
                      })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({
                        id: "AllMyDelegationsAndMyReports",
                      })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={intl.formatMessage({ id: "Delegation" })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "Delegation" })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={intl.formatMessage({ id: "MyReports1" })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "MyReports1" })}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </>
        ) : tabDisplayed == "my-reports" ? (
          <>
            <div className="my-4 my-md-0 d-flex px-5 align-items-md-center justify-content-md-between w-100 pb-4 flex-column flex-md-row">
              <div className="position-relative w-45">
                <input
                  type="search"
                  name="searchForProject"
                  className="input input-group searchBoxDesign search_input"
                  id="searchForProject"
                  placeholder={intl.formatMessage({
                    id: "SearchTicket",
                  })}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
              </div>

              <div className="mb-2 pt-2 pb-3 w-md-40 d-flex align-items-md-center gap-2 flex-column flex-md-row">
                <Dropdown
                  className="w-50"
                  onSelect={(eventKey) => {
                    const value: any =
                      eventKey === "all"
                        ? intl.formatMessage({ id: "AllCategories" })
                        : Array.isArray(mainClassificationData) &&
                          (intl.locale == "ar"
                            ? mainClassificationData?.find(
                                (classification) =>
                                  classification?.id === eventKey
                              )?.name
                            : mainClassificationData?.find(
                                (classification) =>
                                  classification?.id === eventKey
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
                              : role?.nameEn}
                          </Dropdown.Item>
                        ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  className="w-50"
                  onSelect={(eventKey: any) => {
                    setDelegationValue(eventKey);
                  }}
                >
                  <Dropdown.Toggle
                    variant="null"
                    id="dropdown-basic"
                    className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                  >
                    {delegationValue}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                    <Dropdown.Item
                      eventKey={intl.formatMessage({
                        id: "AllMyDelegationsAndMyRequests",
                      })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({
                        id: "AllMyDelegationsAndMyRequests",
                      })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={intl.formatMessage({ id: "Delegation" })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "Delegation" })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={intl.formatMessage({ id: "MyRequests" })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "MyRequests" })}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="my-4 my-md-0 d-none px-5 align-items-md-center justify-content-md-between w-100 pb-4 flex-column flex-md-row">
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

              <div className="mb-2 pt-2 pb-3 w-40 d-flex align-items-md-center flex-column flex-md-row gap-2">
                <Dropdown
                  className="w-50"
                  onSelect={(eventKey) => {
                    const value: any =
                      eventKey === "all"
                        ? intl.formatMessage({ id: "AllCategories" })
                        : Array.isArray(mainClassificationData) &&
                          mainClassificationData?.find(
                            (classification) => classification?.id === eventKey
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
                              : role?.nameEn}
                          </Dropdown.Item>
                        ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  className="w-50"
                  onSelect={(eventKey: any) => {
                    setDelegationValue(eventKey);
                  }}
                >
                  <Dropdown.Toggle
                    variant="null"
                    id="dropdown-basic"
                    className="DropDownSelect form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                  >
                    {delegationValue}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="scroll-y mh-175px w-200px bg-gray-200 border-1">
                    <Dropdown.Item
                      eventKey={intl.formatMessage({
                        id: "AllMyDelegationsAndMyRequests",
                      })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({
                        id: "AllMyDelegationsAndMyRequests",
                      })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={intl.formatMessage({ id: "Delegation" })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "Delegation" })}
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey={intl.formatMessage({ id: "MyRequests" })}
                      className="DropDownOptions py-1"
                    >
                      {intl.formatMessage({ id: "MyRequests" })}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </>
        )}

        {tabDisplayed === "reports" ? (
          <ReportsTab
            RequestType={requestType}
            tabName={tabDisplayed}
            selectedMainClassificationIds={selectedMainClassificationIds}
            isDelegation={isDelegation}
            search={search}
          />
        ) : tabDisplayed === "my-reports" ? (
          <MyReportsTab
            RequestType={requestType}
            tabName={tabDisplayed}
            selectedMainClassificationIds={selectedMainClassificationIds}
            isDelegation={isDelegation}
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

export default TechnicalSupportFeedbacksManager;
