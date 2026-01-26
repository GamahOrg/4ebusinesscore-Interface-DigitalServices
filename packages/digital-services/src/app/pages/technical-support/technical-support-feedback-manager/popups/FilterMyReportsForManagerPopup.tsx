import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { getCategory } from "../../../../redux/features/category/categorySlice";
import { getMainClassification } from "../../../../redux/features/mainClassification/mainClassificationSlice";
import { fetchUsers } from "../../../../redux/features/SLA/usersSlice";
import { fetchFilterMyReport } from "../../../../redux/features/report/myReportsSlice";
import CheckBoxDropDown from "../../technical-support-feedback-employee/components/CheckBoxDropDown";
import { showAlert } from "@4eplatform/shared/services/showAlert";

type PopupProps = {
  show?: any;
  handleClose?: any;
  statisticsReport?:number,
};
const FilterMyReportsForManagerPopup: React.FC<PopupProps> = ({show, handleClose ,statisticsReport}) => {
  const intl = useIntl();
  const [filter, setFilter] = useState<any>({
    date: "",
    reportTitle: "",
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCategory({ pageSize: 1000, pageNumber: 1 }) as any);
    dispatch(getMainClassification({ pageSize: 1000, pageNumber: 1 }));
    dispatch(fetchUsers({ pageSize: 1000, pageNumber: 1 }) as any);

  }, []);
  let users = useAppSelector((state) => {
    return state?.users?.data;
  });
  let categories = useAppSelector((state) => {
    return state?.category?.data?.categories;
  });
  const [categoriesOptions, setCategoriesOptions] = useState<any>([]);
  let [selectedIdsForCategories, setSelectedIdsForCategories] = useState<
    string[]
  >([]);
  let classifications = useAppSelector((state) => {
    return state?.mainClassification?.data?.mainClassifications;
  });
  const [classificationsOptions, setClassificationsOptions] = useState<any>([]);
  let [selectedIdsForClassifications, setSelectedIdsForClassifications] =
    useState<string[]>([]);

  const [priorityOptions, setPriorityOptions] = useState<any>([]);
  let optionsForPriority = [
    { id: 1, name: intl.formatMessage({ id: "High" }) },
    { id: 2, name: intl.formatMessage({ id: "Medium" }) },
    { id: 3, name: intl.formatMessage({ id: "Low" }) },
    { id: 4, name: intl.formatMessage({ id: "Unknown" }) },
  ];

  let [selectedIdsForPriority, setSelectedIdsForPriority] = useState<string[]>(
    []
  );
  const [requestStatusOptions, setRequestStatusOptions] = useState<any>([]);
  let optionsForStatus = [
    { id: 1, name: intl.formatMessage({ id: "ApprovalDone" }) },
    { id: 0, name: intl.formatMessage({ id: "UnderProcedure" }) },
    { id: 2, name: intl.formatMessage({ id: "Rejected" }) },
  ];

  let [selectedIdsForRequestStatus, setSelectedIdsForRequestStatus] = useState<
    string[]
  >([]);
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prevFilter : any) => ({ ...prevFilter, [name]: value }));
  };
  const handleApplyFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = {
      statisticsReport:statisticsReport || "6",
      filterReportReportNumber: filter?.reportNumber
        ? [filter.reportNumber]
        : [null],
      filterReportReportTitle: filter?.reportTitle
        ? [filter.reportTitle]
        : [null],
      filterReportRequester:filter?.reportRequesterId
        ? [filter.reportRequesterId]
        : [null],
      date: filter.date ? [filter?.date?.split("T")[0]] : [null],
      filterReportPriority:
        selectedIdsForPriority?.length > 0 ? selectedIdsForPriority : [null],
      filterReportCategoryId:
        selectedIdsForCategories?.length > 0
          ? selectedIdsForCategories
          : [null],
      filterReportClassificationId: selectedIdsForClassifications?.length
        ? selectedIdsForClassifications
        : [null],
    };
    // your consume here
    dispatch(fetchFilterMyReport({body:params,params:{pageSize:"10",pageNumber:"1"}}) as any);
    showAlert(true , "FilteredSuccessfully" , intl);
    handleClose();
  };

  return (
    <Fragment>
      <div className="modal-dialog">
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
                  <div className="mb-9 text-center">
                    <h1 className="mb-3">
                      {intl.formatMessage({ id: "DataFiltering" })}
                    </h1>
                    <h6 className="mb-2 text-muted">
                      {intl.formatMessage({
                        id: "PleaseChooseDataClassification",
                      })}
                    </h6>
                  </div>
                </Modal.Title>
              </div>
            </Modal.Header>

            <form
              className="d-block w-100"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {" "}
              <Modal.Body>
                <div className="row w-100 mb-3">
                <div className="col-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="title"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({
                          id: "ReportNumber",
                        })}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                          <i className="fa-solid fa-hashtag special"></i>                          </span>
                        </div>
                        <input
                          type="number"
                          id="title"
                          placeholder={intl.formatMessage({
                            id: "ReportNumber",
                          })}
                          className="form-control"
                          name="reportNumber"
                          value={filter.reportNumber}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="title"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({
                          id: "ReportTitle",
                        })}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fas fa-clipboard-list special"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          id="title"
                          placeholder={intl.formatMessage({
                            id: "ReportTitle",
                          })}
                          className="form-control"
                          name="reportTitle"
                          value={filter.reportTitle}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-12 col-md-4">
                      <div className="mb-2 pt-2 pb-3 ">
                        <label className="form-label px-2  fs-6 text-gray-700">
                          {intl.formatMessage({ id: "Applicant" })}
                        </label>
                        <select
                          className="form-select form-select-solid"
                          onChange={handleFilterChange}
                          name="reportRequesterId"
                          value={filter.reportRequesterId}
                        >
                          <option value={""} selected>
                            {intl.formatMessage({ id: "Choose" })}
                          </option>
                          {users?.map((user: any) => (
                            <option key={user?.id} value={user?.id}>
                             <span >{user?.firstName} {   }</span> 
                             <span >{user?.forthName} {   }</span> 
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  <div className="col-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="type"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({
                          id: "ReportType",
                        })}
                      </label>
                      <CheckBoxDropDown
                        selectedOptions={categoriesOptions}
                        setSelectedOptions={setCategoriesOptions}
                        options={categories}
                        selectedIds={selectedIdsForCategories}
                        setSelectedIds={setSelectedIdsForCategories}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="category"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({
                          id: "ReportCategory",
                        })}
                      </label>
                      <CheckBoxDropDown
                        selectedOptions={classificationsOptions}
                        setSelectedOptions={setClassificationsOptions}
                        options={classifications}
                        selectedIds={selectedIdsForClassifications}
                        setSelectedIds={setSelectedIdsForClassifications}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="priority"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({
                          id: "ReportPriority",
                        })}
                      </label>
                      <CheckBoxDropDown
                        selectedOptions={priorityOptions}
                        setSelectedOptions={setPriorityOptions}
                        options={optionsForPriority}
                        selectedIds={selectedIdsForPriority}
                        setSelectedIds={setSelectedIdsForPriority}
                      />
                    </div>
                  </div>
                </div>
                <div className="row w-100 mb-3">
                  <div className="col-4">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="date"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({
                          id: "Date",
                        })}
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={filter.date}
                        onChange={handleFilterChange}
                        className="form-control form-control-lg form-control-solid mb-3 mb-lg-2 "
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center py-2">
                <div className="mt-5 mb-5 col-12 col-lg-8 mx-auto">
                  <div className="outputCard card-diff-toolbar pt-5 w-100 mt-3 d-flex justify-content-center">
                    <div className="d-flex justify-content-center align-items-center w-50">
                      <div
                        onClick={handleClose}
                        className="btn btn-secondary mx-3 text-center w-100"
                      >
                        {intl.formatMessage({ id: "Cancel" })}
                      </div>
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        className="btn btn-success mx-3 text-center w-100"
                        style={{ border: "none" }}
                        onClick={(e) => {
                          handleApplyFilter(e);
                          handleClose();
                        }}
                      >
                        {intl.formatMessage({ id: "Agree" })}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Footer>
            </form>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default FilterMyReportsForManagerPopup;
