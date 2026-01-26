import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import {
  PostRatingsReport,
  fetchRatingsReport,
} from "../../../../redux/features/service-operation/report/RatingsReportSlice";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show?: any;
  handleClose?: any;
  reportId: string;
  creatorId?: any;
  creatorEmail?: any;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
};
interface putRequset {
  note: string;
  reportId: string;
}
const AddNotesPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  reportId,
  creatorId,
  creatorEmail,
  requestDate,
  requestName,
  requestType,
}) => {
  const intl = useIntl();
  let [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState<string>("");

  const dispatch = useDispatch();
  const Submit = () => {
    if (!note) {
      showAlert(false, "MustEnterNotes", intl);
    } else {
      let data: putRequset = {
        note: note,
        reportId: reportId,
      };
      setLoading(true);
      dispatch(
        PostRatingsReport({
          data: data,
        }) as any
      )
        .then((result: any) => {
          setLoading(false);
          if (
            result.payload.statusEnum === 1 &&
            (result.payload.message === "Ratings Report added successfully" ||
              result.payload.message === "Ratings Report added successfully")
          ) {
            Notification.addingNote(
              creatorId,
              (window as any)._env_?.PUBLIC_URL +
                `/technical-support-feedbacks-administration-employee/${reportId}/details`,
              88,
              reportId,
              creatorEmail,
              true,
              Number(getWorkspaceKey()),
              requestDate,
              requestName,
              requestType,
              "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
              ""
            );

            showAlert(true, "successfullyDone", intl);
            handleClose();
            dispatch(fetchRatingsReport(reportId) as any);
          } else {
            showAlert(false, "AnErrorOccured", intl);
          }
        })
        .catch((err: any) => {});
    }
  };
  return (
    <Fragment>
      <div
        className="modal fade"
        id="Rega_modal_add_note"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        aria-hidden="false"
      >
        <Modal
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
          aria-hidden="false"
        >
          <div className="card">
            <div className="mx-5"></div>
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
                      {intl.formatMessage({ id: "AddNote" })}
                    </h1>
                    <h6 className="mb-2 text-muted">
                      {intl.formatMessage({
                        id: "PleaseAddYourCommentsAndChooseYourRating",
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
              <Modal.Body>
                <div className="row w-100 mb-7">
                  <div className="col-lg-12">
                    <h2>{intl.formatMessage({ id: "Notes" })}</h2>
                    <textarea
                      aria-hidden={!show}
                      id="notes"
                      className="mt-7 form-control h-100px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "AddNotes",
                      })}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center py-2 border-top-0">
                <div className="mt-9 mb-5 col-12 col-lg-8 mx-auto">
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
    </Fragment>
  );
};

export default AddNotesPopup;
