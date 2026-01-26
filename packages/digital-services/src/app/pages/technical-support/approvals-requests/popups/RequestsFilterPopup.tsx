import React, { ChangeEvent, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import CheckBoxDropDown from "../../technical-support-feedback-employee/components/CheckBoxDropDown";
import { fetchAllDelegationToUser } from "../../../../redux/features/delegation/delegationSlice";
import { fetchOrgs } from "../../../../redux/features/mainClassification/orgsSlice";
import { fetchUsers } from "../../../../redux/features/SLA/usersSlice";
import { getMainClassification } from "../../../../redux/features/mainClassification/mainClassificationSlice";
import { fetchMainClassificationTree } from "../../../../redux/features/mainClassification/mainClassificationTreeSlice";
import { getRequestCategory } from "../../../../redux/features/requestTemplate/requestTemplateSlice";
import {
  useAppDispatch,
  useAppSelector,
  RootState,
} from "../../../../redux/store/store";
import CheckBoxDropDownWithSelectAll from "../../../partials/CheckBoxDropDownWithSelectAll";

type PopupProps = {
  show?: any;
  handleClose?: any;
  setNumberOfOutgoingRequests?: any;
  setNumberOfIncomingRequests?: any;
  setNumberOfAssignedRequests?: any;
  tabName?: string;
  setFilterValuesForOutgoingRequests?: any;
  setFilterValuesForIncomingRequests?: any;
  setFilterValuesForAssignRequests?: any;
  setFilterValuesCanceledRequests?: any;
  setFilterValuesSuggestedRequests?: any;
  pageSize?: number;
  pageNumber?: number;
  setPageNumber?: any;
  setLoadingForRequests?: (tabName: string, isLoading: boolean) => void;
  handleResetFilter?:any
};

const RequestsFilterPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  setNumberOfOutgoingRequests,
  setNumberOfIncomingRequests,
  setNumberOfAssignedRequests,
  tabName,
  setFilterValuesForOutgoingRequests,
  setFilterValuesForIncomingRequests,
  setFilterValuesForAssignRequests,
  setFilterValuesCanceledRequests,
  setFilterValuesSuggestedRequests,
  pageSize,
  pageNumber,
  setPageNumber,
  setLoadingForRequests,
  handleResetFilter
}) => {
  const { control } = useForm({});
  const intl = useIntl();
  let language = intl.locale;

  const [filter, setFilter] = useState<any>({
    requestNumber: "",
    requestName: "",
    date: "",
    requesterName: "",
  });
  const dispatch = useAppDispatch();
  let orgs = useAppSelector((state: RootState) => {
    return state?.orgsSlice?.data;
  });
  let requestCategories = useAppSelector((state: RootState) => {
    return state?.requestCategory?.data;
  });
  let users = useAppSelector((state: RootState) => {
    return state?.users?.data;
  });
  const mainClassifications = useAppSelector((state: RootState) => {
    return state?.mainClassification?.data?.mainClassifications;
  });
  const mainClassificationTree = useAppSelector((state) => {
    return state?.mainClassificationTree?.data;
  });

  let [applicantOptions, setApplicantOptions] = useState<any>([]);
  useEffect(() => {
    setApplicantOptions(
      users?.map((user: any) => {
        return {
          label: user?.userName,
          value: user?.id,
        };
      })
    );
  }, [users]);
  let [selectedApplicants, setSelectedApplicants] = useState<any>([]);

  const [mainClassificationId, setMainClassificationId] = useState<string>("");
  const [catalogId, setCatalogId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [itemsId, setItemsId] = useState<string>("");

  const [selectedCatalogs, setSelectedCatalogs] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchOrgs({}) as any);
    dispatch(getRequestCategory() as any);
    dispatch(fetchUsers({ pageSize: 1000, pageNumber: 1 }) as any);
  }, []);

  useEffect(() => {
    if (show && mainClassificationId) {
      setCatalogId("");
      setCategoryId("");
      setItemsId("");
      setSelectedCatalogs([]);
      setSelectedCategories([]);
      setSelectedItems([]);
    }
  }, [show, mainClassificationId]);

  useEffect(() => {
    if (show) {
      dispatch(
        getMainClassification({
          pageSize: 10000,
          pageNumber: 1,
          // subSystemId: localStorage.getItem("subsystemId"),
        }) as any
      );
    } else if (show) {
      dispatch(getMainClassification({ pageSize: 1000, pageNumber: 1 }) as any);
    } else {
      return;
    }
  }, [show, localStorage.getItem("subsystemId")]);

  useEffect(() => {
    if (show && mainClassificationId && mainClassificationId !== "-1") {
      dispatch(fetchMainClassificationTree(mainClassificationId) as any);
    }
  }, [show, mainClassificationId]);

  const handleCatalogChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCatalogId = e.target.value;
    setCatalogId(selectedCatalogId);

    const selectedCatalog = mainClassificationTree?.serviceCatalogs?.find(
      (catalog: any) => catalog.id === selectedCatalogId
    );

    setSelectedCategories(selectedCatalog?.categories || []);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);

    const selectedCategory = selectedCategories.find(
      (category: any) => category.id === selectedCategoryId
    );

    setSelectedItems(selectedCategory?.items || []);
  };

  const [categoryTypeOptions, setCategoryTypeOptions] = useState([]);
  useEffect(() => {
    setCategoryTypeOptions(categoryTypeOptions);
  }, [requestCategories]);
  let [selectedIdsForTypes, setSelectedIdsForTypes] = useState<string[]>([]);

  const [orgOptions, setOrgOptions] = useState<any>([]);
  let [selectedIdsForOrgs, setSelectedIdsForOrgs] = useState<string[]>([]);

  const [usersOptions, setUsersOptions] = useState<any>([]);
  let [selectedIdsForDelegatedUsers, setSelectedIdsForDelegatedUsers] =
    useState<string[]>([]);

  let incomingDelegations: any = useAppSelector((state: RootState) => {
    return state?.delegation?.incomingDelegations;
  });

  useEffect(() => {
    let params: any = {
      pageSize: "100000",
      pageNumber: "1",
    };
    dispatch(fetchAllDelegationToUser({ body: {}, params }) as any);
  }, []);
  const [requestStatusOptions, setRequestStatusOptions] = useState<any>([]);
  let optionsForStatus = [
    { id: 1, name: intl.formatMessage({ id: "ApprovalDone" }) },
    { id: 0, name: intl.formatMessage({ id: "UnderProcedure" }) },
    { id: 2, name: intl.formatMessage({ id: "Rejected" }) },
    { id: 5, name: intl.formatMessage({ id: "Canceled" }) },
  ];

  let [selectedIdsForRequestStatus, setSelectedIdsForRequestStatus] = useState<
    string[]
  >([]);
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevFilter: any) => ({ ...prevFilter, [name]: value }));
  };
  let userLoggedInDetails = JSON.parse(
    localStorage?.getItem("userInfo") as string
  );
  const handleApplyFilter = async (e: React.FormEvent, type: any) => {
    e.preventDefault();
    const params =
      type === "submit"
        ? {
            requestInstanceNumber: filter.requestNumber
              ? [filter.requestNumber]
              : [null],
            requestInstanceName: filter.requestName
              ? [filter.requestName]
              : [null],
            orgIds:
              selectedIdsForOrgs?.length > 0 ? selectedIdsForOrgs : [null],
            dateTimes: filter.date ? [filter.date] : [null],
            statues:
              selectedIdsForRequestStatus?.length > 0
                ? selectedIdsForRequestStatus
                : [null],
            categoryIds:
              selectedIdsForTypes?.length > 0 ? selectedIdsForTypes : [null],
            delegatedUsers:
              selectedIdsForDelegatedUsers?.length > 0
                ? selectedIdsForDelegatedUsers?.filter((id) => {
                    return id != "";
                  })
                : [null],
            requester:
              tabName == "IncomingRequests" ||
              (tabName == "AssignedRequests" && selectedApplicants?.length > 0)
                ? selectedApplicants?.map((applicant: any) => {
                    return applicant?.value;
                  })
                : [null],
            ...{
              mainClassificationsIds:
                mainClassificationId != "-1" ? mainClassificationId : [null],
            },
            serviceCatalogsIds: catalogId,
            serviceManagementCategoryIds: categoryId,
            itemIds: itemsId,
          }
        : {};

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    if (tabName == "OutgoingRequests" || tabName == null) {
      // setPageNumber(1);
      // setLoadingForRequests?.(tabName as string, true);
      setFilterValuesForOutgoingRequests?.(filteredParams);
    } else if (tabName == "IncomingRequests") {
      // setPageNumber(1);
      // setLoadingForRequests?.(tabName as string, true);
      setFilterValuesForIncomingRequests?.(filteredParams);
    } else if (tabName == "AssignedRequests") {
      // setPageNumber(1);
      // setLoadingForRequests?.(tabName as string, true);
      setFilterValuesForAssignRequests?.(filteredParams);
    } else if (tabName == "CanceledRequests") {
      // setPageNumber(1);
      // setLoadingForRequests?.(tabName as string, true);
      setFilterValuesCanceledRequests?.(filteredParams);
    } else if (tabName == "SuggestedRequests") {
      // setPageNumber(1);
      // setLoadingForRequests?.(tabName as string, true);
      setFilterValuesSuggestedRequests?.(filteredParams);
    }

    if (type !== "cancel") showAlert(true, "FilteredSuccessfully", intl);
    setFilter({
      requestNumber: "",
      requestName: "",
      date: "",
      requesterId: "",
    });
    setSelectedIdsForRequestStatus([]);
    setSelectedIdsForTypes([]);
    setSelectedIdsForOrgs([]);
    setCategoryTypeOptions([]);
    setOrgOptions([]);
    setRequestStatusOptions([]);
    handleClose();
  };

  const options = [
    { name: intl.formatMessage({ id: "All" }), id: "" },
    {
      name: userLoggedInDetails?.userName,
      id: userLoggedInDetails?.id,
    },
  ].concat(
    incomingDelegations
      ?.filter(
        (item: any) =>
          item?.statusTo === 1 &&
          new Date(item?.endDate) >= new Date() &&
          item?.isActive
      )
      ?.map((delegation: any) => ({
        name: delegation?.userNameFrom,
        id: delegation?.delegeatedFromUserId,
      }))
  );

  const uniqueOptions = Array.from(
    new Set(options?.map((option) => option?.id))
  )?.map((id) => options?.find((option) => option?.id === id));

  return (
    <>
      <div className="modal-dialog modal-dialog-centered mw-1000px">
        <Modal
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <div className="card">
            <Modal.Header
              closeButton
              style={{
                alignItems: intl.locale == "ar" ? "flex-start" : "flex-end",
                flexDirection: intl.locale == "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <h3 className="card-title flex-column align-items-center">
                    <span className="card-label fw-bolder fs-3 mb-2 ">
                      {intl.formatMessage({
                        id: "DataFiltering",
                      })}
                    </span>
                    <span className="mt-1 fw-semibold fs-5 text-muted">
                      {intl.formatMessage({
                        id: "PleaseEnterTheData",
                      })}
                    </span>
                  </h3>
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="row my-2">
                <div className="col-sm-6 col-12 col-md-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "OrderID" })}
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fa-solid fa-hashtag special"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "OrderID",
                        })}
                        name="requestNumber"
                        value={filter.requestNumber}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-12 col-md-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "RequestName" })}
                    </label>

                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-clipboard-list special"></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={intl.formatMessage({
                          id: "RequestName",
                        })}
                        name="requestName"
                        value={filter.requestName}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </div>
                {tabName == null ||
                tabName == "OutgoingRequests" ||
                tabName == "SuggestedRequests" ? (
                  <></>
                ) : (
                  <>
                    <div className="col-sm-6 col-12 col-md-4">
                      <div className="mb-2 pt-2 pb-3 ">
                        <label className="form-label px-2  fs-6 text-gray-700">
                          {intl.formatMessage({ id: "Applicant" })}
                        </label>
                        <Controller
                          name="Applicant"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              id="Applicant"
                              className="react-select__container"
                              classNamePrefix="react-select"
                              placeholder={intl.formatMessage({
                                id: "Choose",
                              })}
                              options={applicantOptions}
                              isClearable={true}
                              onChange={(selectedOption) =>
                                setSelectedApplicants(selectedOption)
                              }
                              isMulti
                              value={selectedApplicants}
                              noOptionsMessage={() =>
                                intl.formatMessage({
                                  id: "NotAvailableUsers",
                                })
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="col-sm-6 col-12 col-md-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "AdminstrationName" })}
                    </label>
                    <CheckBoxDropDown
                      selectedOptions={orgOptions}
                      setSelectedOptions={setOrgOptions}
                      options={orgs?.map((org: any) => {
                        return {
                          name: language == "ar" ? org?.nameAr : org?.nameEn,
                          id: org?.id,
                        };
                      })}
                      selectedIds={selectedIdsForOrgs}
                      setSelectedIds={setSelectedIdsForOrgs}
                    />
                  </div>
                </div>

                 {/* <div className="col-sm-6 col-12 col-md-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "OrderType" })}
                    </label>
                    <CheckBoxDropDown
                      selectedOptions={categoryTypeOptions}
                      setSelectedOptions={setCategoryTypeOptions}
                      options={requestCategories}
                      selectedIds={selectedIdsForTypes}
                      setSelectedIds={setSelectedIdsForTypes}
                    />
                  </div>
                </div> */}

                <div className="col-sm-6 col-12 col-md-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "RequestStatus" })}
                    </label>
                    <CheckBoxDropDown
                      selectedOptions={requestStatusOptions}
                      setSelectedOptions={setRequestStatusOptions}
                      options={optionsForStatus}
                      selectedIds={selectedIdsForRequestStatus}
                      setSelectedIds={setSelectedIdsForRequestStatus}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12 col-md-4">
                  <div className="mb-2 pt-2 pb-3 ">
                    <label className="form-label px-2  fs-6 text-gray-700">
                      {intl.formatMessage({ id: "TheDate" })}
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "TheDate",
                      })}
                      name="date"
                      value={filter.date}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                {tabName == "OutgoingRequests" ||
                location.search == "" ||
                tabName == "SuggestedRequests" ? (
                  <></>
                ) : (
                  <>
                    <div className="col-sm-6 col-12 col-md-4">
                      <div className="mb-2 pt-2 pb-3 ">
                        <label className="form-label px-2  fs-6 text-gray-700">
                          {intl.formatMessage({ id: "OrderOwner" })}
                        </label>
                        <CheckBoxDropDownWithSelectAll
                          selectedOptions={usersOptions}
                          setSelectedOptions={setUsersOptions}
                          options={uniqueOptions}
                          selectedIds={selectedIdsForDelegatedUsers}
                          setSelectedIds={setSelectedIdsForDelegatedUsers}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="col-sm-6 col-12 col-md-4">
                  <label className="form-label px-2  fs-6 text-gray-700">
                    {intl.formatMessage({ id: "MainClassification" })}
                  </label>
                  <select
                    id="mainClassification"
                    className="form-select myform-control form-select-solid select2-hidden-accessible mt-1"
                    data-placeholder="اختر"
                    tabIndex={-1}
                    defaultValue={-1}
                    aria-hidden="true"
                    onClick={(e: any) => {
                      setMainClassificationId(e.target.value);
                    }}
                  >
                    <option value={-1}>
                      {intl.formatMessage({ id: "Choose" })}
                    </option>
                    {Array.isArray(mainClassifications) &&
                      mainClassifications?.map((item: any) => {
                        return (
                          <option key={item?.id} value={item?.id}>
                            {intl.locale=="ar"?item?.name:item?.nameEn}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="col-sm-6 col-12 col-md-4">
                  <label className="form-label px-2  fs-6 text-gray-700">
                    {intl.formatMessage({ id: "Catalog" })}
                  </label>
                  <select
                    id="catalog"
                    className="form-select"
                    value={catalogId}
                    onChange={handleCatalogChange}
                  >
                    <option value="">
                      {intl.formatMessage({ id: "Choose" })}
                    </option>
                    {mainClassificationTree?.serviceCatalogs?.map(
                      (catalog: any) => (
                        <option key={catalog.id} value={catalog.id}>
                          {intl.locale=="ar"?catalog.name:catalog.nameEn}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="col-sm-6 col-12 col-md-4">
                  <label className="form-label px-2  fs-6 text-gray-700">
                    {intl.formatMessage({ id: "Subcategory" })}
                  </label>
                  <select
                    id="subcategory"
                    className="form-select"
                    value={categoryId}
                    onChange={handleCategoryChange}
                  >
                    <option value="">
                      {intl.formatMessage({ id: "Choose" })}
                    </option>
                    {selectedCategories?.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {intl.locale=="ar"?category.name:category.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-sm-6 col-12 col-md-4">
                  <label className="form-label px-2  fs-6 text-gray-700">
                    {intl.formatMessage({ id: "SubItem" })}
                  </label>
                  <select
                    id="subItem"
                    className="form-select"
                    value={itemsId}
                    onChange={(e) => setItemsId(e.target.value)}
                  >
                    <option value="">
                      {intl.formatMessage({ id: "Choose" })}
                    </option>
                    {selectedItems?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {intl.locale=="ar"?item.name:item.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center py-2">
              <div className="mt-5 mb-5 col-12 col-lg-7 mx-auto">
                <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                  <div className="d-flex justify-content-center align-items-center w-50">
                    <button
                      type="reset"
                      className="btn btn-secondary mx-1 text-center w-100"
                      onClick={(e) => {
                        handleApplyFilter(e, "cancel");
                        setFilter({
                          requestNumber: "",
                          requestName: "",
                          date: "",
                          requesterName: "",
                        });
                        setSelectedIdsForRequestStatus([]);
                        setSelectedIdsForTypes([]);
                        setSelectedIdsForOrgs([]);
                        setCategoryTypeOptions([]);
                        setOrgOptions([]);
                        setRequestStatusOptions([]);
                        handleResetFilter()
                      }}
                    >
                      {intl.formatMessage({ id: "Cancel" })}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleApplyFilter(e, "submit")}
                      className="btn btn-success mx-1 text-center w-100"
                      style={{ border: "none" }}
                    >
                      {intl.formatMessage({ id: "Agree" })}
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RequestsFilterPopup;
