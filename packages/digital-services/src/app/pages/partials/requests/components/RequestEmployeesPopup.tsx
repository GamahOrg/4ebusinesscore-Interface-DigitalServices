import React, { useState } from "react";
import { useIntl } from "react-intl";
import Modal from "react-bootstrap/Modal";

type RequestEmployeesPopupProps = {
  show?: any;
  handleClose?: any;
  requestDetails?: any;
};

const RequestEmployeesPopup: React.FC<RequestEmployeesPopupProps> = ({
  show,
  handleClose,
  requestDetails,
}) => {
  const intl = useIntl();
  let language = intl.locale;
  return (
    <>
      <div className="modal fade" aria-hidden="true">
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
          // size="lg"
        >
          <div className="card">
            <Modal.Header
              closeButton
              style={{
                alignItems: intl.locale == "ar" ? "flex-start" : "center",
                flexDirection: intl.locale == "en" ? "column-reverse" : "row",
              }}
              className="border-bottom-0 shadow-sm"
            >
              <div className="card-header w-100 px-1 d-flex justify-content-center pb-2  border-bottom-0">
                <Modal.Title>
                  <h3 className="card-title d-flex justify-content-center align-items-center flex-column ">
                    <span className="card-label fs-3 my-5 fw-bolder">
                      {intl.formatMessage({ id: "RequestEmployees" })}
                    </span>
                  </h3>
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="table-responsive mt-4">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-7">
                  <thead>
                    <tr className="fw-bolder text-muted">
                      <th className=" text-center fs-5 fw-bolder">
                        {intl.formatMessage({ id: "EmployeeName" })}
                      </th>
                      <th className=" text-center fs-5 fw-bolder">
                        {intl.formatMessage({ id: "AdminstrationName" })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestDetails?.requestUsers?.length ? (
                      requestDetails.requestUsers.map((user: any) => (
                        <tr key={user.userId}>
                          <td>
                            <p className="text-center">{user?.userFullName}</p>
                          </td>
                          <td>
                            <p className="text-center">
                              {language === "ar" ? user.orgAr : user.orgAr}
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                      <td colSpan={2}>
                        <p className="text-center"
                        style={{color:" rgb(0, 158, 247)"}}>{intl.formatMessage({id : "NoEmployeesFound"})}</p>
                      </td>
                    </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center py-2 border-top-0"></Modal.Footer>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default RequestEmployeesPopup;
