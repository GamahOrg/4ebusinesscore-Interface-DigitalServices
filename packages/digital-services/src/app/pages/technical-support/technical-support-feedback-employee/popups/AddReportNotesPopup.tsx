import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { Notification } from "@4eplatform/shared/services/notifications";
import { getWorkspaceKey } from "@4eplatform/shared/index";
import {
  postReportNote,
  fetchReportNote,
} from "../../../../redux/features/service-operation/report/ReportNotesSlice";
import { Button, Spinner } from "react-bootstrap";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";

type PopupProps = {
  show?: any;
  handleClose?: any;
  reportId: string;
  creatorId?: any;
  creatorEmail?: any;
  requestDetails?: any;
};
interface postRequset {
  note: string;
  reportId: string;
  reportNoteAttachments: any;
  noteCreatortype: number;
}

const AddReportNotesPopup: React.FC<PopupProps> = ({
  show,
  handleClose,
  reportId,
  creatorId,
  creatorEmail,
  requestDetails,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [note, setNote] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const Submit = () => {
    if (!note) {
      showAlert(false, "MustEnterNotes", intl);
    } else {
      let data: postRequset = {
        note: note,
        reportId: reportId,
        noteCreatortype: 0,
        reportNoteAttachments: selectedFiles,
      };
      const totalSize = selectedFiles?.reduce(
        (acc, file) => acc + file.size,
        0
      );
      if (totalSize > MAX_SIZE_BYTES) {
        showAlert(false, "MaxSizeAttachments", intl);
        return;
      }
      setLoading(true);
      dispatch(postReportNote({ data }) as any)
        .then((result: any) => {
          if (
            result.payload.statusEnum === 1 &&
            result.payload.message === "Report Note added successfully"
          ) {
            Notification.addingNote(
              creatorId,
              `/digialservicesmanagement/technical-support-feedbacks-administration-employee/${reportId}/details`,
              89,
              reportId,
              creatorEmail,
              true,
              Number(getWorkspaceKey()),
              requestDetails?.createOn,
              requestDetails?.reportTitle,
              requestDetails?.mainClassificationName,
              "b3c27ec9-a9b0-441d-ac1d-2159309a3738",
              "",
              "",
              requestDetails?.reportNumber,
            );
            showAlert(
              true,
              intl.formatMessage({ id: "successfullyDone" }),
              intl
            );
            setLoading(false);
            handleClose();
            setNote("");
            setSelectedFiles([]);
            dispatch(fetchReportNote(reportId) as any);
          } else {
            showAlert(true, intl.formatMessage({ id: "AnErrorOccured" }), intl);
            setLoading(false);
          }
        })
        .catch((err: any) => {});
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
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
                alignItems: intl.locale === "ar" ? "flex-start" : "flex-end",
                flexDirection: intl.locale === "en" ? "column-reverse" : "row",
              }}
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0 mt-10">
                <Modal.Title>
                  <div className="mb-9 text-center">
                    <h1 className="mb-3">
                      {intl.formatMessage({ id: "AddNote" })}
                    </h1>
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
                <div className="row w-100 mb-2">
                  <div className="col-lg-12">
                    <h2 className="required">
                      {intl.formatMessage({ id: "Notes" })}
                    </h2>
                    <textarea
                      aria-hidden={!show}
                      id="notes"
                      className="mt-7 form-control h-100px pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
                      placeholder={intl.formatMessage({
                        id: "AddNotes",
                      })}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                  {/* <div className="col-lg-12">
                    <Fragment>
                      <div className="mb-5">
                        {attachments?.map((item :any) => {
                          let { name, size } = item;
                          return (
                            <Fragment key={Math.random()}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center justify-content-center h-70px">
                                  <img
                                    src={getIconSrc(name)}
                                    className="d-inline-block h-75 mx-2"
                                    style={{
                                      height: "50px",
                                      width: "100px",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <div>
                                    <p className="text-dark-75 mb-4 fw-bolder fs-6 text-hover-primary  font-size-lg">
                                      {name}
                                    </p>
                                    <p className="text-muted">
                                      {(size / 1024).toFixed(2)} KB
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="w-20px h-20px d-flex justify-content-center align-items-center myrounded bg-danger text-white cursor-pointer"
                                  onClick={() => {
                                    setAttachments((prev: any) =>
                                      prev.filter(
                                        (item: any) => item.name !== name
                                      )
                                    );
                                  }}
                                >
                                  x
                                </div>

                                <div
                                  className="menu menu-spe menu-sub menu-sub-dropdown w-200px w-md-200px"
                                  data-kt-menu="true"
                                >
                                  <div className="px-7 py-5">
                                    <div className="fs-5 text-dark fw-bolder">
                                      {intl.formatMessage({ id: "Properties" })}
                                    </div>
                                  </div>
                                  <div className="separator border-gray-200"></div>
                                  <div className="p-4">
                                    <div className="mb-5">
                                      <div className="">
                                        <label className="form-check form-check-sm form-check-custom form-check-solid">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="2"
                                          />
                                          <span className="form-check-label">
                                            {intl.formatMessage({
                                              id: "AddToFavorites",
                                            })}
                                          </span>
                                        </label>
                                        <label className="form-check form-check-sm form-check-custom form-check-solid py-2">
                                          <input
                                            id="indicatorsCardHideInput"
                                            className="form-check-input check-danger"
                                            type="checkbox"
                                            value="2"
                                          />
                                          <span className="form-check-label">
                                            {" "}
                                            {intl.formatMessage({
                                              id: "HideFromWorkspace",
                                            })}{" "}
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="mb-5">
                                      <label className="form-label fw-bold">
                                        {intl.formatMessage({
                                          id: "Notifications",
                                        })}
                                        :
                                      </label>
                                      <div className="form-check form-switch form-switch-sm form-check-custom form-check-solid py-2">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value=""
                                          name="notifications"
                                        />
                                        <label className="form-check-label">
                                          {intl.formatMessage({ id: "Enable" })}
                                        </label>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                      <button
                                        type="reset"
                                        className="btn btn-sm btn-light btn-active-light-primary me-2"
                                        data-kt-menu-dismiss="true"
                                      >
                                        {intl.formatMessage({ id: "Cancel" })}
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn btn-sm btn-primary"
                                        data-kt-menu-dismiss="true"
                                      >
                                        {intl.formatMessage({ id: "Agree" })}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                      <div className="h-fit notice d-flex bg-light-primary rounded border-primary border border-dashed mb-1">
                        <label
                          htmlFor="outputAttachment"
                          className="form-label px-2  fontSz-6 dropzone-select   w-100 uploadFile-style inputAreaHeight"
                        >
                          <div className="row align-items-center">
                            <div className="col-md-1">
                              <img
                                src="/media/extensions/uploadFile.webp"
                                className="img-fluid"
                                alt="upload files"
                              />
                            </div>
                            <div className="col-md-8">
                              <p className="text-primary fw-bolder my-1">
                                {" "}
                                {intl.formatMessage({
                                  id: "QuickFileUploader",
                                })}
                              </p>
                              <p>
                                {intl.formatMessage({
                                  id: "DragAndDropOrChooseFilesFromComputer",
                                })}
                              </p>
                            </div>
                          </div>
                        </label>
                        <div
                          className="dropzone dropzone-queue mb-2"
                          id="kt_dropzonejs_example_3"
                        >
                          <div className="dropzone-panel mb-lg-0 mb-2">
                            <input
                              multiple
                              type="file"
                              id="outputAttachment"
                              name="attachments"
                              placeholder={intl.formatMessage({
                                id: "FileUpload",
                              })}
                              onChange={(e) => {
                                handleFileChange(e);
                              }}
                              className="dropzone-select cursor-pointer w-100 uploadFile-style inputAreaHeight d-none"
                            />
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  </div> */}

                  <div className="col-12 mt-4">
                    <div className="pt-2">
                      <label className="form-label px-2 fs-6 text-gray-700">
                        {intl.formatMessage({ id: "Attachments" })}
                      </label>

                      <div className="w-100 d-flex bg-light-primary rounded border-primary border border-dashed mb-1 position-relative">
                        <label
                          htmlFor="outputAttachment"
                          className="form-label px-2  fontSz-6 dropzone-select  uploadFile-style inputAreaHeight"
                        >
                          <div className="row align-items-center">
                            <div className="d-flex gap-4 align-items-center">
                              <img
                                alt=""
                                src={toAbsoluteUrl(
                                  "/media/extensions/uploadFile.webp"
                                )}
                                className="d-inline-block h-75"
                              />
                              <div>
                                <p className="text-primary fw-bolder my-2 p-0">
                                  {intl.formatMessage({
                                    id: "QuickFileUploader",
                                  })}
                                </p>
                                <p className="p-0 my-1">
                                  {intl.formatMessage({
                                    id: "DragAndDropOrChooseFilesFromComputer",
                                  })}
                                </p>
                              </div>
                            </div>
                            {selectedFiles && (
                              <>
                                <div>
                                  <ul>
                                    {selectedFiles?.map((file, index) => (
                                      <li
                                        key={index}
                                        className="d-flex justify-content-between align-items-center my-2"
                                      >
                                        {file.name}
                                        <button
                                          onClick={() =>
                                            setSelectedFiles(() => {
                                              return selectedFiles?.filter(
                                                (selectedfile) =>
                                                  selectedfile !== file
                                              );
                                            })
                                          }
                                          className="bg-transparent text-danger fw-bold border-0"
                                        >
                                          <i className="bi bi-trash fa-lg"></i>
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                        <div
                          className="dropzone dropzone-queue"
                          id="kt_dropzonejs_example_3"
                        >
                          <div className="dropzone-panel">
                            <input
                              multiple
                              type="file"
                              id="outputAttachment"
                              className="dropzone-select w-100 uploadFile-style inputAreaHeight d-none"
                              onChange={(e) => handleImageChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                      {!loading ? (
                        <button
                          type="button"
                          data-bs-dismiss="modal"
                          className="btn btn-success mx-3 text-center w-100"
                          style={{ border: "none" }}
                          onClick={() => {
                            Submit();
                          }}
                        >
                          {intl.formatMessage({
                            id: "Send",
                          })}
                        </button>
                      ) : (
                        <Button
                          variant="success"
                          disabled
                          className="btn btn-success mx-3 text-center w-100"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-2"
                          />
                          <span>{intl.formatMessage({ id: "Send" })}</span>
                        </Button>
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

export default AddReportNotesPopup;
