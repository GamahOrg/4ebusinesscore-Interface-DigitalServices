import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Row, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { useParams } from "react-router-dom";
import { postActionOnCourseStage } from "../../../../redux/features/training/apply-course";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show: boolean;
  handleClose: any;
  id?: any;
};

export enum ActionsCourseStage {
  Apply,
  Cancel,
}

export const CancelPopup: FC<PopupProps> = ({ show, handleClose, id }) => {
  const intl = useIntl();
  let { systemId } = useParams();
  let params = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [loading, setLoading] = useState(false);

  const handleActionOnCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("CourseStageId", id as string);
      formData.append("ActionCourseStage", String(ActionsCourseStage?.Cancel));
      formData.append("RequestId", params?.id as string);
      setLoading(true);
      const res = await dispatch(postActionOnCourseStage(formData) as any);
      setLoading(false);
      if (
        res?.payload?.message === "CourseStageIsCanceledSuccessully" ||
        res?.payload?.statusEnum == 1
      ) {
        showAlert(true, "CancelDone", intl);
        navigate(
          systemId ? `/approvals-requests/${systemId}` : `/approvals-requests`
        );
      } else if (
        res?.payload?.message === "don't have permission on this course"
      ) {
        showAlert(false, "YouHaveNoPermission", intl);
      } else if (res?.payload?.message === "already Cancel this Course ") {
        showAlert(false, "YouHaveNoPermission", intl);
      } else {
        showAlert(false, "AnErrorOccured", intl);
      }

      handleClose();
    } catch (error) {
      showAlert(false, "AnErrorOccured", intl);
      handleClose();
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{
            alignItems: intl.locale == "ar" ? "flex-start" : "flex-end",
            flexDirection: intl.locale == "en" ? "column-reverse" : "row",
          }}
          className="pb-0 border-bottom-0"
        >
          <div className="card-header mt-10 d-flex justify-content-center w-100 px-4 border-bottom-0">
            <Row className="justify-content-center mt-5 mb-5">
              <Modal.Title id="contained-modal-title-vcenter">
                <div className="text-center">
                  <h3> {intl.formatMessage({ id: "ConfirmCancel" })}</h3>
                </div>
              </Modal.Title>
            </Row>
          </div>
        </Modal.Header>
        <form onSubmit={handleActionOnCourse}>
          <Modal.Body className="pb-0">
            <Row className="justify-content-center mb-5">
              <div className="text-center">
                <h5>
                  {intl.formatMessage({
                    id: "AreYouSureToCancel",
                  })}
                </h5>
              </div>
            </Row>
          </Modal.Body>

          <div className="row">
            <div className="col-12 col-lg-7 mx-auto mb-12">
              <div className="outputCard card-diff-toolbar w-100 mt-3 d-flex justify-content-center">
                <Modal.Footer className="w-100 justify-content-center pb-0 pt-2 border-top-0">
                  <div className="d-flex justify-content-center align-items-center w-100">
                    <button
                      type="reset"
                      className="btn btn-secondary me-3 w-100"
                      onClick={handleClose}
                    >
                      {intl.formatMessage({ id: "No" })}
                    </button>

                    {loading ? (
                      <Button variant="success" disabled className="px-15 w-75">
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
                        className="  btn btn-danger me-5 w-100 "
                      >
                        <span className="indicator-label">
                          {intl.formatMessage({ id: "Yes" })}
                        </span>
                        <span className="indicator-progress">
                          {intl.formatMessage({ id: "Yes" })}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>{" "}
                        </span>
                      </button>
                    )}
                  </div>
                </Modal.Footer>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
