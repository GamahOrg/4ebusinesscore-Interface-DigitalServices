import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PutOperationReportConverted,
  fetchGetReportById,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { Notification } from "@4eplatform/shared/services/notifications";
import { fetchItemTechnicians } from "../../../../redux/features/item/itemTechniciansSlice";
import { ItemRequesterModel } from "../../../../models/ItemRequesterModel";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show?: any;
  handleClose?: any;
  reportId: string;
  optin?: string;
  categoryName?: string;
  technetionId?: string;
  mainclassificationId?: string;
  creatorId: string;
  creatorEmail: string;
  itemId?: string;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
  requestNumber?: any;
};

interface putRequset {
  options: string;
  technetionId?: string;
  reason: string;
  reportId: string;
  redirectTechId: string;
}
const RedirectPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  reportId,
  optin,
  categoryName,
  technetionId,
  mainclassificationId,
  creatorId = "",
  creatorEmail = "",
  itemId,
  requestDate,
  requestName,
  requestType,
  requestNumber,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();

  let TechData = useSelector((state: RootState) => {
    return state?.itemTechnician?.data;
  });
  let [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [TechOptions, setTechOptions] = useState<ItemRequesterModel[]>([
    new ItemRequesterModel("", "", "", 0, "", "", "", "", "", "", "", ""),
  ]);

  let [selectedTechIds, setSelectedTechIds] = useState<string>("");
  let [selectedTechEmail, setSelectedTechEmail] = useState<string>("");

  let [searchParams, setSearchParams] = useSearchParams();
  const showAlert = (messageAddFail: boolean, text: string) => {
    Swal.fire({
      text: text,
      icon: messageAddFail ? "error" : "success",
      heightAuto: false,
      buttonsStyling: false,
      confirmButtonText: intl.formatMessage({ id: "Agree" }),
      customClass: {
        popup: "my-swal-popup",
        confirmButton: `btn ${messageAddFail ? "btn-danger" : "btn-primary"}`,
      },
    }).then((result) => {
      if (!messageAddFail && result.isConfirmed) {
      }
    });
  };
  let [note, setnote] = useState<string>("");

  const Submit = () => {
    if (!note) {
      showAlert(true, intl.formatMessage({ id: "MustEnterNotes" }));
    } else if (selectedTechIds.length <= 0) {
      showAlert(
        true,
        intl?.locale.toLowerCase() === "ar"
          ? "يجب اختيار موظف  "
          : "must choes employee"
      );
    } else {
      let data: putRequset = {
        options: optin ?? "",
        reason: note,
        reportId: reportId,
        technetionId: technetionId,
        redirectTechId: selectedTechIds,
      };
      setLoading(true);
      dispatch(
        PutOperationReportConverted({
          id: reportId,
          body: data,
        }) as any
      )
        .then((result: any) => {
          setLoading(false);
          dispatch(fetchGetReportById(reportId) as any);
          if (
            result.payload.statusEnum === 1 &&
            (result.payload.message ===
              "Operation Report updated successfully" ||
              result.payload.message === "Operation Report added successfully")
          ) {
            Notification.transformed(
              selectedTechIds,
              `/digialservicesmanagement/technical-support-feedbacks-employee/${reportId}/details`,
              88,
              reportId,
              selectedTechEmail,
              true,
              Number(getWorkspaceKey()),
              requestDate,
              requestName,
              requestType,
              "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
              "",
              "",
              requestNumber
            );
            showAlert(false, intl.formatMessage({ id: "SavedSuccessfully" }));
            handleClose();
            navigate(-1);
          } else {
            showAlert(true, intl.formatMessage({ id: "AnErrorOccured" }));
          }
        })
        .catch((err: any) => {});
    }
  };
  useEffect(() => {
    if (itemId) {
      dispatch(fetchItemTechnicians(itemId) as any);
    }
  }, [itemId]);

  useEffect(() => {
    setTechOptions(TechData as any);
  }, [TechData]);
  return (
    <Fragment>
      <div className="modal-body scroll-y mx-5 mx-xl-18 pt-0 pb-15 mb-7">
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <div className="card">
            <Modal.Header
              closeButton
              style={{
                alignItems: intl.locale == "ar" ? "flex-start" : "center",
                flexDirection: intl.locale == "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <div className="mb-9 text-center">
                    <h1 className="mb-3">
                      {intl.formatMessage({ id: "ReportRedirect" })}
                    </h1>
                    <h6 className="mb-2 text-muted">
                      {intl.formatMessage({
                        id: "PleaseEnterTheFollowingData",
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
                  <div className="col-6">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="category"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({ id: "ReportCategory" })}
                      </label>
                      <select
                        id="category"
                        className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                        data-kt-select2="true"
                        data-placeholder={intl.formatMessage({
                          id: "ReportCategory",
                        })}
                        data-dropdown-parent="#kt_menu_62775e8642438"
                        data-allow-clear="true"
                        data-select2-id="select2-data-4-vqtd"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <option selected>{categoryName ?? "qqq"}</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-2 pt-2 pb-3">
                      <label
                        htmlFor="employee"
                        className="form-label px-2 required fw-bolder"
                      >
                        {intl.formatMessage({
                          id: "EmployeeOfTheSameDepartment",
                        })}
                      </label>
                      <select
                        id="employee"
                        className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                        onChange={(e) => {
                          const selectedTechId = e.target.value;
                          const selectedTech = TechOptions.find(
                            (role) => role?.userId === selectedTechId
                          );
                          setSelectedTechEmail(selectedTech?.email ?? "");
                          setSelectedTechIds(selectedTechId);
                        }}
                        data-placeholder={intl.formatMessage({
                          id: "EmployeeOfTheSameDepartment",
                        })}
                      >
                        <option disabled selected value="">
                          {intl.formatMessage({
                            id: "EmployeeOfTheSameDepartment",
                          })}
                        </option>
                        {TechOptions?.map((role) => (
                          <option key={role?.userId} value={role?.userId}>
                            {intl?.locale.toLowerCase() == "ar"
                              ? `${role?.firstName ?? "mohamed"} ${
                                  role?.secondName ?? ""
                                }`
                              : `${role?.firstName ?? "mohamed"} ${
                                  role?.secondName ?? ""
                                }`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row w-100 mb-3">
                  <div className="col-lg-12">
                    <label
                      htmlFor="reason"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "RedirectReason" })}
                    </label>

                    <textarea
                      id="reason"
                      className="form-control h-150px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "RedirectReason",
                      })}
                      onChange={(e) => {
                        setnote(e.target.value);
                      }}
                    ></textarea>
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
                      {loading ? (
                        <Button
                          variant="success"
                          disabled
                          className="px-15 w-100 min-w-300px"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          <span>{intl.formatMessage({ id: "Adding" })}</span>
                        </Button>
                      ) : (
                        <button
                          type="button"
                          data-bs-dismiss="modal"
                          className="btn btn-success mx-3 text-center w-100"
                          style={{ border: "none" }}
                          onClick={() => {
                            Submit();
                          }}
                        >
                          {intl.formatMessage({ id: "Send" })}
                        </button>
                      )}
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

export default RedirectPopup;
