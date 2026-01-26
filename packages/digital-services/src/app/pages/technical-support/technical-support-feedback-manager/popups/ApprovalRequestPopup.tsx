import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import { EmployeeHierarchyPopup } from "../../../partials/EmployeeHierarchyPopup";
import { useDispatch, useSelector } from "react-redux";
import { PostConsentRequest } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { fetchGetMangerToRequesterByReportId } from "../../../../redux/features/service-operation/report/GetMangerToRequesterByReportIdSlice";
import { RootState } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show?: any;
  handleClose?: any;
  reportId: string;
  senderId: string;
};
interface putRequset {
  managerId: string;
  senderId: string;
  note: string;
  reportId: string;
}
const ApprovalRequestPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  reportId,
  senderId,
}) => {
  const intl = useIntl();
  const [modalShow, setModalShow] = useState<boolean>(false);
  let [loading, setLoading] = useState(false);

  const showAlert = (messageAddFail: boolean, text: string) => {
    Swal.fire({
      text: text,
      icon: messageAddFail ? "error" : "success",
      heightAuto: false,
      buttonsStyling: false,
      confirmButtonText: intl.formatMessage({ id: "Agree" }),
      customClass: {
        confirmButton: `btn ${messageAddFail ? "btn-danger" : "btn-primary"}`,
      },
    }).then((result) => {
      if (!messageAddFail && result.isConfirmed) {
      }
    });
  };
  let navigate = useNavigate();
  const dispatch = useDispatch();
  let [note, setnote] = useState<string>("");
  let manger = useSelector((state: RootState) => {
    return state?.MangerToRequesterByReportId.mager;
  });
  useEffect(() => {
    dispatch(fetchGetMangerToRequesterByReportId(reportId) as any).then(
      (a: any) => {}
    );
  }, []);
  const Submit = () => {
    if (!note) {
      showAlert(true, intl.formatMessage({ id: "MustEnterNotes" }));
    } else if (!manger?.userId) {
      showAlert(
        true,
        intl?.locale.toLowerCase() === "ar"
          ? "هذا الموظف ليس له مدير"
          : "this employee not have manger"
      );
    } else {
      let data: putRequset = {
        note: note,
        reportId: reportId,
        senderId: senderId,
        managerId: manger?.userId,
      };
      setLoading(true);
      dispatch(
        PostConsentRequest({
          reportId: data.reportId,
          senderId: data.senderId,
          note: data.note,
          managerId: data.managerId,
        }) as any
      )
        .then((result: any) => {
          setLoading(false);
          if (
            result.payload.statusEnum === 3 &&
            result.payload.message === "Operation Report updated successfully"
          ) {
            showAlert(false, intl.formatMessage({ id: "SavedSuccessfully" }));
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            showAlert(true, intl.formatMessage({ id: "AnErrorOccured" }));
          }
        })
        .catch((err: any) => {});
    }
  };

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
                alignItems: intl.locale == "ar" ? "flex-start" : "flex-end",
                flexDirection: intl.locale == "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <div className="mb-9 text-center">
                    <h1 className="mb-3">
                      {intl.formatMessage({ id: "ConsentRequest" })}
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
                  <div className="col-12">
                    <div className="mb-2 pt-2 pb-3 ">
                      <label
                        htmlFor="name"
                        className="form-label px-2 fontSz-6"
                      >
                        {intl.formatMessage({ id: "EmployeeName" })}
                      </label>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fas fa-user-cog special"></i>
                          </span>
                        </div>
                        <input
                          className="form-control"
                          placeholder={intl.formatMessage({
                            id: "EmployeeName",
                          })}
                          value={manger?.fulName}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row w-100 mb-3">
                  <div className="col-lg-12">
                    <label htmlFor="notes" className="form-label px-2 fontSz-6">
                      {intl.formatMessage({ id: "Notes" })}
                    </label>

                    <textarea
                      id="notes"
                      className="form-control h-150px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "Notes",
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
                          className="px-15 w-100"
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
      <div className="modal fade" aria-modal="true">
        <EmployeeHierarchyPopup
          show={modalShow}
          handleClose={() => setModalShow(false)}
        />
      </div>
    </Fragment>
  );
};

export default ApprovalRequestPopup;
