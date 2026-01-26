import { FC, Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { useLocation } from "react-router";
import { AcceptPopup } from "../../../../../app/pages/partials/AcceptPopup";
import { useDispatch } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import {
  PutConsentRequestStatus,
} from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { RequsetdReportmodel } from "../../../../models/get-report/modelRequsetdReport";
interface putRequset {
  managerNote?: string;
  consentRequestId: string,
  rejectedReason?: string,
  consentRequestStatus :number
}
interface Props {
  responseReport: RequsetdReportmodel;
}
const ApprovalDetails: FC<Props> = ({ responseReport }) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  let location = useLocation();
  let intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  const [RequsetdRepor, setdata] = useState<RequsetdReportmodel>();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const parms = useParams();
  let [note, setnote] = useState<string>("");
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
  const SubmitAccpet = () => {
    if (!note) {
      showAlert(true, "note Rquerd");
      return;
    }
    let data: putRequset = {
      managerNote: note,
      consentRequestStatus:0,
      consentRequestId:responseReport?.requsetId??""
    };
    dispatch(
      PutConsentRequestStatus({
        id: responseReport?.requsetId??"",
        body: data,
      }) as any
    )
      .then((result: any) => {
        if (result.payload.statusEnum !== 3) {
          showAlert(true, result.payload.message);
        } else {
          showAlert(false, result.payload.message);
        }
      })
      .catch((err: any) => {});
  };
  const SubmitReject = () => {
    if (!note) {
      showAlert(true, "note Rquerd");
      return;
    }
    let data: putRequset = {
      rejectedReason: note,
      consentRequestStatus:1,
      consentRequestId:responseReport?.requsetId??""
    };
    dispatch(
      PutConsentRequestStatus({
        id: responseReport?.requsetId??"",
        body: data,
      }) as any
    )
      .then((result: any) => {
        if (result.payload.statusEnum !== 3) {
          showAlert(true, result.payload.message);
        } else {
          showAlert(false, result.payload.message);
        }
      })
      .catch((err: any) => {});
  };
  useEffect(() => {
    setdata(responseReport as any);
  }, [responseReport]);
  return (
    <Fragment>
      <div className="detailsCard my-5">
        <div className="card card-xl-stretch mb-xl-6 pt-7">
          <h2 className="text-center fw-bolder mb-7 mt-8">
            {intl.formatMessage({ id: "DetailsOfTheServiceApprovalRequest" })}
          </h2>
          <div className="container-xxl mb-7 ">
            <p className="fs-3 p-3 mb-5 fw-bolder text-dark">
              {intl.formatMessage({ id: "RequesterData" })}
            </p>
            {
              <div className="w-100 mb-3 mt-4 px-6 card pt-6  border border-2 border-gray border-bottom-4">
                <div className=" d-flex justify-content-between mb-9">
                  <div className="d-flex justify-content-between align-items-center">
                    <img
                      src="/media/avatars/300-3.jpg"
                      className="d-block mx-2"
                      style={{
                        height: "100px",
                        width: "120px",
                        borderRadius: "10px",
                      }}
                      alt="profile img"
                    />
                    <div className="mx-3 text-gray-700">
                      <p className="mb-3 fw-bolder text-primary fw-bold fs-4">
                        {RequsetdRepor?.administrationEmployee}
                      </p>
                      <p className="mb-3 text-muted fs-5 ">
                        {intl?.locale.toLowerCase() === "ar"
                          ? RequsetdRepor?.orgNameAr
                          : RequsetdRepor?.orgNameEn}
                      </p>
                      <div className="mb-3 text-muted">
                        <i className="fa-regular fa-envelope d-inline-block  fs-3"></i>
                        <span className="d-inline-block ms-4">
                          {RequsetdRepor?.emial}
                        </span>
                      </div>
                      <div className="mb-3 text-muted">
                        <i
                          className="fa-solid fa-phone fs-3"
                          style={{ transform: "rotate(270deg)" }}
                        ></i>
                        <span className="d-inline-block ms-4">
                          +{RequsetdRepor?.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-dark fs-3 mb-4 fw-bolder">
                  {intl.formatMessage({ id: "ReportData" })}
                </p>
                <div className="mb-9">
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="w-25 text-black-50 d-flex  align-items-center">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Requester",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {RequsetdRepor?.administrationEmployee}
                      </span>
                    </div>
                    <div className="w-25 text-black-50 d-flex align-items-center">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "ReportNumber",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {" "}
                        {RequsetdRepor?.reportNumber}
                      </span>
                    </div>
                    <div className="w-25 text-black-50 d-flex align-items-center">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Address",
                        })}

                      </span>
                      :
                      <span className="d-inline-block mx-3 ">
                        {" "}
                        {RequsetdRepor?.reportTitle}
                      </span>
                    </div>
                    <div className="w-25 text-black-50 d-flex  align-items-center">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Type2",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {RequsetdRepor?.iteamName}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="w-25 text-black-50 d-flex align-items-center">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Category",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {" "}
                        {RequsetdRepor?.categoryName}{" "}
                      </span>
                    </div>
                    <div className="w-25 text-black-50">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Priority",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {" "}
                        {RequsetdRepor?.priorityLevel == 1
                          ? "عادي"
                          : RequsetdRepor?.priorityLevel == 2
                          ? "خطر"
                          : RequsetdRepor?.priorityLevel == 3
                          ? "شديده الخطوره"
                          : "غير معرفه"}
                      </span>
                    </div>
                    <div className="w-25 text-black-50">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Status",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3 badgex badge-light-danger">
                        {" "}
                        {RequsetdRepor?.status == 0
                          ? "ملحوله"
                          : RequsetdRepor?.status == 1
                          ? "مرفوضه"
                          : RequsetdRepor?.status == 2
                          ? "مغلقه"
                          : RequsetdRepor?.status == 3
                          ? "مؤجله"
                          : RequsetdRepor?.status == 4
                          ? "محوله"
                          : RequsetdRepor?.status == 5
                          ? "مستلمه"
                          : RequsetdRepor?.status == 6
                          ? ""
                          : RequsetdRepor?.status == 7
                          ? "متاخره"
                          : RequsetdRepor?.status == 8
                          ? "ساريه"
                          : RequsetdRepor?.status == 9
                          ? "مرسله"
                          : RequsetdRepor?.status == 10
                          ? "مقبوله"
                          : RequsetdRepor?.status == 11
                          ? "معاده الفتح"
                          : RequsetdRepor?.status == -1
                          ? "غير معرفه"
                          : ""}
                      </span>
                    </div>
                    {
                      <div className="w-25 text-black-50">
                        <span className="text-primary d-inline-block mx-3">
                          {" "}
                          {intl.formatMessage({
                            id: "Time",
                          })}
                        </span>
                        :
                        <span className="d-inline-block mx-3">
                          {" "}
                            {RequsetdRepor?.time}
                        </span>
                      </div>
                    }
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="w-25 text-black-50">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "Date",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {" "}
                        {RequsetdRepor?.date != null
                          ? moment(RequsetdRepor?.date).format("YYYY-MM-DD")
                          : "_"}
                      </span>
                    </div>
                    <div className="w-25 text-black-50">
                      <span className="text-primary d-inline-block mx-3">
                        {" "}
                        {intl.formatMessage({
                          id: "LastUpdate",
                        })}
                      </span>
                      :
                      <span className="d-inline-block mx-3">
                        {" "}
                        {RequsetdRepor?.lastUpdate != null
                          ? moment(RequsetdRepor?.lastUpdate).format(
                              "YYYY-MM-DD"
                            )
                          : "_"}
                      </span>
                    </div>
                  </div>
                </div>

                <form
                  className=" d-block w-100 h-fit"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="pt-3 mb-7">
                    <label htmlFor="addNotes" className="px-2 mb-3">
                      {intl.formatMessage({ id: "Notes" })}
                    </label>
                    <textarea
                      name="admine notes"
                      placeholder={intl.formatMessage({
                        id: "AddNotesToTheRequest",
                      })}
                      onChange={(e) => {
                        setnote(e.target.value);
                      }}
                      className="form-control form-control-solid mb-3 mb-lg-0 min-h-100px"
                      style={{ maxHeight: "200px" }}
                      id="addNotes"
                    ></textarea>
                  </div>
                  <div className="mt-5 mb-5 col-12 col-lg-8 mx-auto">
                    <div className="outputCard card-diff-toolbar pt-5 w-100 mt-3 d-flex justify-content-center">
                      <div className="d-flex justify-content-center align-items-center w-50">
                        <div
                          className="btn btn-secondary mx-3 text-center w-25"
                          onClick={() => SubmitReject()}
                        >
                          {intl.formatMessage({ id: "Reject" })}
                        </div>
                        <button
                          type="button"
                          onClick={() => SubmitAccpet()}
                          className="btn btn-success mx-3 text-center w-25"
                          style={{ border: "none" }}
                        >
                          {intl.formatMessage({ id: "Acceptance" })}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            }
          </div>
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_accept" aria-hidden="true">
        <AcceptPopup show={modalShow} handleClose={() => setModalShow(false)} />
      </div>
    </Fragment>
  );
};

export default ApprovalDetails;
