import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import {
  fetchRatingsReport,
  PostRatingsReport,
} from "../../../../redux/features/service-operation/report/RatingsReportSlice";
import { ResponseStatus } from "@4eplatform/shared/enums/enums";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show: boolean;
  handleClose: any;
  reportId: string;
  requestId: string;
  technetionId?: any;
  creatorId?: any;
  creatorName?: string;
  creatorEmail?: any;
  technicianName?: string;
  technicianEmail?: any;
  requestDate?: any;
  requestName?: any;
  requestType?: any;
  requestNumber?: any;
};
export const AddRatingPopup: FC<PopupProps> = ({
  show,
  handleClose,
  reportId,
  creatorId,
  creatorEmail,
  requestDate,
  requestName,
  requestType,
  technetionId,
  technicianEmail,
  requestNumber,
}) => {
  const intl = useIntl();
  const [rating, setRating] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState("");
  let [loading, setLoading] = useState(false);
  const { id } = useParams();
  let dispatch = useDispatch();
  const buildStars = () => {
    const stars: any = [];
    for (let i = 1; i <= 5; i++) {
      const starClass =
        i <= rating ? "bi bi-star-fill text-warning fa-3x" : "bi bi-star fa-3x";
      stars.push(
        <i key={i} className={starClass} onClick={() => setRating(i)}></i>
      );
    }
    return stars;
  };

  const submitRate = () => {
    if (rating === 0 && !ratingComment) {
      showAlert(false, "YouMustEnterARating", intl);
      return;
    }
    const data = {
      note: ratingComment,
      reportId: id,
      ratingsReportStatus: rating,
    };
    setLoading(true);
    dispatch(PostRatingsReport({ data }) as any)
      .then((result: any) => {
        if (result?.payload?.statusEnum === ResponseStatus.SavedSuccessfully) {
          handleClose();
          dispatch(fetchRatingsReport(id) as any);
          showAlert(true, result?.payload?.message, intl);
          setRatingComment("");
          Notification.addRating(
            technetionId,
            `/digialservicesmanagement/technical-support-feedbacks-employee/${reportId}/details`,
            88,
            reportId,
            technicianEmail,
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
        } else {
          showAlert(false, result?.payload?.message, intl);
        }
        setLoading(false);
      })
      .catch((error: any) => {
        showAlert(false, "AnErrorOccured", intl);
      });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <div className="card">
          <Modal.Header
            closeButton
            style={{
              alignItems: intl.locale == "ar" ? "flex-start" : "flex-end",
              flexDirection: intl.locale == "en" ? "column-reverse" : "row",
            }}
            className="pb-0 border-bottom-0"
          >
            <div className="card-header mt-10 d-flex justify-content-center w-100 px-4 border-bottom-0">
              <Row className="justify-content-center mt-5 mb-10">
                <Modal.Title id="contained-modal-title-vcenter">
                  <div className="text-center">
                    <h2> {intl.formatMessage({ id: "AddReview" })}</h2>
                    <p className="text-muted">
                      {intl.formatMessage({
                        id: "PleaseAddReview",
                      })}
                    </p>
                  </div>
                </Modal.Title>
              </Row>
            </div>
          </Modal.Header>

          <Row className="d-inline-block m-auto pb-5">{buildStars()}</Row>
          <div className="mb-3 p-5">
            <label className="mb-2" htmlFor="floatingTextarea1">
              {intl.formatMessage({ id: "WriteComment" })}
            </label>
            <textarea
              className="form-control form-control-solid"
              rows={5}
              id="floatingTextarea1"
              data-kt-autosize="true"
              onChange={(e) => setRatingComment(e.target.value)}
            ></textarea>
          </div>
          <Modal.Body className="pb-0 mx-4">
            <div className="row">
              <div className="col-12 col-lg-7 mx-auto mb-20 mt-5">
                <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                  <div className="d-flex justify-content-center align-items-center w-100">
                    <button
                      type="submit"
                      onClick={() => {
                        handleClose();
                      }}
                      data-bs-dismiss="modal"
                      className=" btn btn-secondary me-5 w-50 "
                    >
                      <span className="indicator-label">
                        {" "}
                        {intl.formatMessage({ id: "Cancel" })}
                      </span>
                    </button>
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
                        type="submit"
                        onClick={() => {
                          submitRate();
                        }}
                        data-bs-dismiss="modal"
                        className="  btn btn-success me-5 w-50 "
                      >
                        <span className="indicator-label">
                          {" "}
                          {intl.formatMessage({ id: "ADD" })}
                        </span>
                        <span className="indicator-progress">
                          {intl.formatMessage({ id: "ADD" })}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>{" "}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};
