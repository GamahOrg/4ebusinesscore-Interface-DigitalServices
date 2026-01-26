import Reports from "./Reports";
import MyReportsTab from "./MyReportsTab";
import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useLocation, useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { featchGetmainClassification } from "../../../../redux/features/mainClassification/GetAllmainClassificationSlice";

function TechnicalSupportAdminstrationEmployeeReports() {
  let intl = useIntl();
  const [tabDisplayed, setTabDisplayed] = useState("my-reports");
  const [search, setSearch] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState(
    intl.formatMessage({ id: "AllCategories" })
  );
  const dispatch = useDispatch();
  let location = useLocation();
  let { id } = useParams();

  const mainClassificationId =
    localStorage.getItem("mainClassificationId") ||
    location?.state?.mainClassificationId;

  let mainClassificationData = useSelector((state: RootState) => {
    return state?.GetAllmainClassification.data;
  });

  const [selectedMainClassificationIds, setSelectedMainClassificationIds] =
    useState<string | null | any>(
      mainClassificationId !== "00000000-0000-0000-0000-000000000000"
        ? mainClassificationId
        : null
    );
  const [isDelegation, setIsDelegation] = useState<any>(0);
  const [delegationValue, setDelegationValue] = useState(
    intl.formatMessage({
      id:
        tabDisplayed === "reports"
          ? "AllMyDelegationsAndMyRequests"
          : "AllMyDelegationsAndMyReports",
    })
  );
  useEffect(() => {
    if (tabDisplayed == "reports") {
      if (delegationValue === intl.formatMessage({ id: "Delegation" })) {
        setIsDelegation(2);
      } else if (
        delegationValue ===
        intl.formatMessage({ id: "AllMyDelegationsAndMyRequests" })
      ) {
        setIsDelegation(0);
      } else {
        setIsDelegation(1);
      }
    } else {
      if (delegationValue === intl.formatMessage({ id: "Delegation" })) {
        setIsDelegation(2);
      } else if (
        delegationValue ===
        intl.formatMessage({ id: "AllMyDelegationsAndMyReports" })
      ) {
        setIsDelegation(0);
      } else {
        setIsDelegation(1);
      }
    }
  }, [delegationValue, intl]);

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
    dispatch(
      featchGetmainClassification({
        pageSize: 10000,
        pageNumber: 1,
        ClassificationId: selectedMainClassificationIds,
        ...(id && { subSystemId: id }),
      }) as any
    );
  }, []);

  return (
    <Fragment>
      <div className="card card-xl-stretch mb-xl-8 pt-2">
        <div className="card-header d-flex mx-5">
          <div className="d-flex gap-4 w-50 align-items-center">
            <button
              className={`w-md-40 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "my-reports" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "my-reports");
              }}
            >
              {" "}
              {id ? (
                <>
                  {intl.formatMessage({
                    id: "MyCourses",
                  })}{" "}
                </>
              ) : (
                <>
                  {intl.formatMessage({
                    id: "MyTickets",
                  })}{" "}
                </>
              )}
            </button>
            <button
              className={`w-md-40 btn d-flex justify-content-center align-items-center rounded-0 bg-transparent btn-active-color-primary border-0 ms-6 fs-5 pe-3 fw-bolder  border border-bottom border-white border-2 border-active-primary  ${
                tabDisplayed === "reports" ? "active" : ""
              }`}
              onClick={() => {
                setTabDisplayed((prev) => "reports");
              }}
            >
              {" "}
              {intl.formatMessage({
                id: "MyReports1",
              })}{" "}
            </button>
          </div>
        </div>
        {tabDisplayed === "reports" ? (
          <>
            <div className="d-flex px-4 mb-2 pt-2 pb-3 justify-content-md-between align-items-md-center w-100 flex-column flex-md-row">
              <div className="position-relative w-45">
                <input
                  type="search"
                  name="searchForProject"
                  className="input input-group searchBoxDesign search_input form-control"
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
              <div className="mb-0 pt-2 pb-3 w-md-40 d-flex align-items-center justify-content-md-end gap-3">
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
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex px-4  mb-2 pt-2 pb-3 justify-content-md-between align-items-md-center w-100 flex-column flex-md-row">
              <div className="position-relative w-45">
                <input
                  type="search"
                  name="searchForProject"
                  className="input input-group searchBoxDesign search_input form-control"
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
              <div className="mb-0 pt-2 pb-3 w-md-40 d-flex align-items-center justify-content-md-end gap-3">
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
              </div>
            </div>
          </>
        )}

        {tabDisplayed === "reports" ? (
          <Reports
            tabName={tabDisplayed}
            selectedMainClassificationIds={selectedMainClassificationIds}
            isDelegation={isDelegation}
            search={search}
          />
        ) : tabDisplayed === "my-reports" ? (
          <MyReportsTab
            tabName={tabDisplayed}
            selectedMainClassificationIds={selectedMainClassificationIds}
            isDelegation={isDelegation}
            search={search}
          />
        ) : (
          ""
        )}
      </div>
    </Fragment>
  );
}

export default TechnicalSupportAdminstrationEmployeeReports;
