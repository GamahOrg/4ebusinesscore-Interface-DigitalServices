import { FC, Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { fetchReportNote } from "../../../../redux/features/service-operation/report/ReportNotesSlice";
import AddReportNotesPopup from "../popups/AddReportNotesPopup";
import moment from "moment-timezone";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { getAllDelegationToUserByUserId } from "../../../../redux/features/service-operation/report/getReportByIdSlice";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import { log } from "console";

interface Props {
  reportId: string;
  creatorId?: any;
  creatorEmail?: any;
  HidePostNotes?: boolean;
  requestDetails?: any;
}

const NotesTab: FC<Props> = ({
  reportId,
  creatorId,
  creatorEmail,
  HidePostNotes = false,
  requestDetails,
}) => {
  let intl = useIntl();
  const dispatch = useDispatch();
  const [AddNotesShow, setAddNotesShow] = useState<boolean>(false);
  let [isTechnetion, setIsTechnetion] = useState(false);

  // const [notes, setNotes] = useState<rattingModel[]>([]);

  // let RatingsReport = useSelector((state: RootState) => {
  //   return state?.RatingsReport.reports;
  // });

  // let report = useSelector((state: RootState) => {
  //   return state?.GetReportById.report;
  // });

  let reportNotes = useSelector((state: RootState) => {
    return state?.ReportNotes?.reportNotes;
  });

  useEffect(() => {
    // dispatch(fetchRatingsReport(reportId) as any);
    dispatch(fetchReportNote(reportId) as any);
  }, [reportId, dispatch]);

  const convertNullString = (value: string) => {
    if (value == null || value === "" || value === "null") return "";
    else return value;
  };

  let userLoggedIn = localStorage.getItem("userId");

  useEffect(() => {
    if (userLoggedIn) {
      dispatch(
        getAllDelegationToUserByUserId({
          id: userLoggedIn as string,
          myparams: {
            pageNumber: 1,
            pageSize: 1000,
          },
        }) as any,
      );
    }
  }, [userLoggedIn, dispatch]);

  const delegated = useSelector((state: RootState) => {
    return state?.GetReportById?.data;
  });

  const [delegatedToUserIds, setDelegatedToUserIds] = useState<any>([]);

  useEffect(() => {
    const extractedDelegatedToUserIds = delegated?.map(
      (delegated: any) => delegated?.delegeatedFromUserId,
    );
    setDelegatedToUserIds(extractedDelegatedToUserIds);
  }, [delegated]);

  useEffect(() => {
    if (
      userLoggedIn === requestDetails?.technetionId ||
      delegatedToUserIds.includes(requestDetails?.technetionId)
    ) {
      setIsTechnetion(true);
    }
  }, [userLoggedIn, requestDetails?.technetionId, delegatedToUserIds]);
  return (
    <Fragment>
      <div
        className="tab-pane fade show active"
        id="notes"
        role="tabpanel"
        aria-labelledby="notes-tab"
      >
        <div
          className="timeline-label my-5"
          style={{
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          {Array.isArray(reportNotes) && reportNotes.length > 0 ? (
            reportNotes.map((item) => {
              return (
                <Fragment key={Math.random()}>
                  <div className="timeline-item">
                    <div className="timeline-label fw-bold text-gray-800 fs-6 "></div>
                    <div className="timeline-badge px-4 my-8">
                      <img
                        alt=""
                        src={
                          convertNullString(item?.creatorImage) !== ""
                            ? `${
                                (window as any)._env_?.REACT_APP_API_User_Url
                              }/` + item?.creatorImage
                            : toAbsoluteUrl("/media/avatars/avtar.webp")
                        }
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                        }}
                        onError={(e: any) =>
                          (e.target.src = toAbsoluteUrl(
                            `/media/avatars/avtar.webp`,
                          ))
                        }
                      />
                    </div>

                    <div
                      className="stepper-item-content card pb-3 bg-light"
                      style={{ margin: "0 48px" }}
                    >
                      <span className="mx-5">
                        <span className="mx-5 name">
                          {item?.noteCreator === 0
                            ? intl.formatMessage({ id: "Technician" })
                            : item?.noteCreator === 1
                            ? intl.formatMessage({ id: "Applicant" })
                            : ""}
                        </span>
                      </span>
                      <div className="mx-5 my-2">
                        <p className="name mx-5">{item?.creatorName}</p>
                      </div>
                      <span className="mx-5 my-2">
                        <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                        <span className="text-gray-500">
                          {intl.formatMessage({ id: "NoteDate" })}:{" "}
                        </span>
                        <span className="text-gray-800">
                          {moment
                            .tz(item?.createdon, "UTC")
                            .tz(
                              Intl.DateTimeFormat().resolvedOptions().timeZone,
                            )
                            .format("YYYY-MM-DD / hh:mm a")}
                        </span>
                      </span>
                      <span className="mx-5 my-2">
                        <i className="fa-regular fa-comments mx-1 text-primary fw-bolder"></i>
                        <span className="text-primary fw-bolder">
                          {intl.formatMessage({ id: "TheNote" }) + " :"}
                        </span>
                        <span className="text-primary fw-bolder">
                          {item.note}
                        </span>
                      </span>
                      <span className="mx-5 mt-2 d-flex align-items-baseline flex-column flex-md-row">
                        <div>
                          <i className="fa-solid fa-file-arrow-down mx-2 text-primary fw-bolder"></i>
                          <span className="text-primary fw-bolder">
                            {intl.formatMessage({ id: "Attachments" }) + " :"}
                          </span>
                        </div>
                        <div className="d-flex flex-column w-80 mx-auto">
                          {Array.isArray(item?.noteAttchment) &&
                          item?.noteAttchment.length > 0 ? (
                            item?.noteAttchment.map((attachment: any) => (
                              <span
                                className="text-primary fw-bolder mx-3 my-3"
                                key={attachment?.filepath}
                              >
                                <a
                                  rel="noreferrer"
                                  href={
                                    (window as any)._env_
                                      ?.REACT_APP_API_Ticketing_Agg_Url +
                                    "/" +
                                    attachment?.filepath
                                  }
                                  target="_blank"
                                  download
                                >
                                  <img
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    src={getIconSrc(
                                      attachment?.fileName,
                                      { filePath: attachment?.filepath },
                                      (window as any)._env_
                                        ?.REACT_APP_API_Ticketing_Agg_Url,
                                    )}
                                    // alt={
                                    //   attachment?.fileName ||
                                    //   intl.formatMessage({ id: "Attachments" })
                                    // }
                                    onError={(e: any) => {
                                      e.target.src = getIconSrcError(
                                        attachment?.fileName,
                                      );
                                    }}
                                  />
                                  <span className="mx-3">
                                    {attachment?.fileName}
                                  </span>
                                </a>
                              </span>
                            ))
                          ) : (
                            <span>
                              {intl.formatMessage({ id: "NoAttachments" })}
                            </span>
                          )}
                        </div>
                      </span>
                    </div>
                  </div>
                </Fragment>
              );
            })
          ) : HidePostNotes ? (
            <div className="text-primary d-inline-block mx-3">
              {intl.formatMessage({ id: "NoNotes" })}
            </div>
          ) : (
            <></>
          )}
        </div>

        {!HidePostNotes && isTechnetion && (
          <div
            onClick={() => setAddNotesShow(true)}
            className=" cursor-pointer d-flex align-items-center my-3"
          >
            <i className="fa-solid fa-plus fs-4 mx-2"></i>{" "}
            <span className="text-dark fs-4 text-decoration-underline">
              {" "}
              {intl.formatMessage({ id: "AddNote" })}
            </span>
          </div>
        )}
      </div>
      <AddReportNotesPopup
        show={AddNotesShow}
        handleClose={() => setAddNotesShow(false)}
        reportId={reportId}
        creatorId={creatorId}
        creatorEmail={creatorEmail}
        requestDetails={requestDetails}
      />
    </Fragment>
  );
};

export default NotesTab;
