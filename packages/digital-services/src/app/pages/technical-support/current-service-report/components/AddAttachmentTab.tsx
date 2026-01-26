import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import React, { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { showAlert } from "@4eplatform/shared/services/showAlert";

interface Iprop {
  active: any;
  setAttachments: any;
  attachments: File[];
}

const AddAttachmentTab: FC<Iprop> = ({
  active,
  setAttachments,
  attachments,
}) => {
  let intl = useIntl();
  const [file, setFile] = useState<any>();

  const MAX_FILE_SIZE = 15 * 1024 * 1024;

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      showAlert(false, "YouHaveExceeded15MB", intl, () => {});
      return false;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];

    const allowedExtensions = [
      '.doc', '.docx',
      '.ppt', '.pptx',
      '.xls', '.xlsx',
      '.pdf',
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'
    ];

    const fileType = file.type;
    const fileName = file.name || '';
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (
      !allowedTypes.includes(fileType) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      showAlert(false, intl.formatMessage({ id: "AttachmentMsgErrType" }), intl, () => {});
      return false;
    }

    return true;
  };

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const filesUploaded = event.target.files;

    if (filesUploaded) {
      const filesArray = Array.from(filesUploaded);
      
      const validFiles: File[] = [];
      const invalidFiles: File[] = [];

      filesArray.forEach(file => {

        if(file.size > MAX_FILE_SIZE){
          showAlert(false, "YouHaveExceeded15MB", intl, () => {});
          return;
        }
        else if (validateFile(file)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      });

      if (validFiles.length > 0) {
        setFile(Array.from(validFiles));
        setAttachments((prev: File[]) => [...prev, ...validFiles]);
      }

      event.target.value = "";
    }
  }

  return (
    <Fragment>
      <div
        className="tab-pane fade active show"
        id="attachment"
        role="tabpanel"
        aria-labelledby="attachment-tab"
      >
        {attachments.length ? (
          <Fragment>
            <div className="mb-5">
              {attachments?.map((item) => {
                let { name, size } = item;
                return (
                  <Fragment key={Math.random()}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center justify-content-center h-70px">
                        <img
                          src={getIconSrc(name)}
                          onError={(e: any) => {
                            e.target.src = getIconSrcError(name);
                          }}
                          style={{
                            height: "70px",
                            width: "70px",
                            borderRadius: "50%",
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
                          setAttachments((prev: File[]) =>
                            prev.filter((item: File) => item.name !== name)
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
                      src={toAbsoluteUrl("/media/extensions/uploadFile.webp")}
                      className="img-fluid"
                      alt="upload files"
                    />
                  </div>
                  <div className="col-md-8">
                    <p className="text-primary fw-bolder my-1">
                      {" "}
                      {intl.formatMessage({ id: "QuickFileUploader" })}
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
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                    id="outputAttachment"
                    name="attachments"
                    placeholder={intl.formatMessage({ id: "FileUpload" })}
                    className="dropzone-select cursor-pointer w-100 uploadFile-style inputAreaHeight d-none"
                  />
                </div>
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="rounded  mb-1  mx-5 py-9">
              <label
                htmlFor="outputAttachment"
                className="form-label px-2 d-flex flex-column justify-content-center align-items-center fontSz-6 dropzone-select  uploadFile-style inputAreaHeight"
              >
                <img
                  src={toAbsoluteUrl("/media/extensions/uploadFile.webp")}
                  className="img-fluid d-block w-25 h-100px mb-3"
                  alt="attachment"
                />
                <p className="text-primary fw-bolder my-1">
                  {" "}
                  {intl.formatMessage({ id: "QuickFileUploader" })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: "DragAndDropOrChooseFilesFromComputer",
                  })}
                </p>
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
                    placeholder="رفع الملفات"
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                    className="dropzone-select w-100 uploadFile-style inputAreaHeight d-none"
                  />
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default AddAttachmentTab;