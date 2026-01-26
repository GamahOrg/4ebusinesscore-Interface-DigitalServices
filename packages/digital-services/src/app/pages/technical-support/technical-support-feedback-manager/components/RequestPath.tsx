import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { useIntl } from "react-intl";
import "./stepper.css";
import { fetchRequestTimeline } from "../../../../redux/features/requestTemplate/request-timeline-slice";
import moment from "moment";
import "moment-timezone";
import { DynamicWorkflowAggRootUrl } from "@4eplatform/shared/apis/dynamic_workflow_agg";
import { ViewRequestEmployee } from "../popups/ViewRequestEmployeePopup";
import getIconSrc from '@4eplatform/shared/functions/getIconSrc';
import { RequestAllDelegation } from "./RequestAllDelegation";

const RequestPath: FC<{
  request_id: string;
  steps?: any[];
  technetionId?: string;
  creatorId?: any;
  creatorName?: string;
  creatorEmail?: string;
  technicianName?: string;
  technicianEmail?: string;
}> = ({ request_id, steps, creatorId, creatorName, creatorEmail, technetionId, technicianName, technicianEmail }) => {
  let intl = useIntl();
  var isContenue = true;
  const dispatch = useDispatch();
  const [userId, setUserId] = useState<string>("");
  const [modalShow, setModalShow] = useState<boolean>(false);

  const requesterIdCheacker = request_id == "00000000-0000-0000-0000-000000000000"
  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });

  useEffect(() => {
    if (requesterIdCheacker) { 
      return
    } else {
      dispatch(fetchRequestTimeline({ id: request_id }) as any);
    }
  }, [request_id]);

  const renderLabel = (action: any) => {
    switch (action) {
      case 0:
        return (
          <span className="label bg-light-warning text-warning d-flex align-items-center">
            {intl.formatMessage({ id: "UnderProcedure" })}{" "}
          </span>
        );
      case 1:
        return (
          <span className="label bg-light-success text-success d-flex align-items-center">
            {intl.formatMessage({ id: "ApprovalDone" })}
          </span>
        );
      case 2:
        isContenue = false;
        return (
          <span className="label  bg-light-danger text-danger d-flex align-items-center">
            {intl.formatMessage({ id: "RejectionDone" })}
          </span>
        );
      case 9:
        isContenue = false;
        return (
          <span className="label bg-light-primary text-primary d-flex align-items-center">
            {intl.formatMessage({ id: "WaitingForApproval" })}
          </span>
        );
      case 16:
        isContenue = false;
        return (
          <span className="label bg-light-primary text-primary d-flex align-items-center">
            {intl.formatMessage({ id: "WaitingForAssigned" })}
          </span>
        );
    }
  };


  return (
    <>
      {requestTimeline ? (
        <div className="">
          <div className="stepper-content">
            <div className="stepper-item">
              <div className="stepper-item-header">
                <i className="fa-solid fa-user"></i>
              </div>
              <div
                role="button"
                className="stepper-item-content card pb-3"
                onClick={() => {
                  setUserId(creatorId);
                  setModalShow(true);
                }}
              >
                <div className="d-flex justify-content-start mb-1">
                  <p className="name mx-5">
                    {intl.formatMessage({ id: "Applicant" })}
                  </p>
                </div>
                <span className="text-dark-800 mx-5">{creatorEmail}</span>
                <span className="mx-5">
                  <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                  <span className="text-dark-500">{creatorName}</span>
                </span>
              </div>
            </div>
            <div className="stepper-item">
              <div className="stepper-item-header text-dark">
                <i className="fa-solid fa-pen stepper-item-icon-creation"></i>{" "}
              </div>
              <div className="stepper-item-content creation card">
                <p className="">
                  <i className="fa-solid fa-calendar-days mx-3"></i>
                  <span className="text-gray-500">
                    {intl.formatMessage({ id: "ReportCreationDate" })}:{" "}
                  </span>{" "}
                  <span className="text-gray-800">
                    {moment
                      .tz(requestTimeline?.requestDate, "UTC")
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format("YYYY-MM-DD / hh:mm a")}{" "}
                  </span>
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-3"></div>
              <div className="line col-6 d-flex justify-content-center ">
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
              </div>
              <div className="col-3"></div>
            </div>
      { technetionId != "00000000-0000-0000-0000-000000000000" ? <>
            
          {request_id != "00000000-0000-0000-0000-000000000000" ? <>
            {requestTimeline?.requestTimeLine?.map((item: any, index: any) => {
              return (
                <RequestAllDelegation item={item}
                  requestTimeline={requestTimeline}
                  setUserId={setUserId}
                  setModalShow={setModalShow}
                  renderLabel={renderLabel}
                  isContenue={isContenue}
                  index={index}
                />
                )
              })}

            {requestTimeline?.serviceType != 3 ? (
              <></>
            ) : (
              technetionId == "00000000-0000-0000-0000-000000000000" || requestTimeline?.technicianId == "00000000-0000-0000-0000-000000000000" ?
              ""
              :
              <>
                <div className="stepper-item">
                  <div className="stepper-item-header">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div
                    role="button"
                    className="stepper-item-content card pb-3"
                    onClick={() => {
                      setUserId(requestTimeline?.technicianId);
                      setModalShow(true);
                    }}
                  >
                    <div className="d-flex justify-content-start mb-1">
                      <p className="name mx-5">
                        {intl.formatMessage({ id: "technicianUserName" })}
                      </p>
                    </div>
                    <span className="text-dark-800 mx-5">
                      {requestTimeline?.technicianUserName}
                    </span>
                    <span className="mx-5">
                      <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                      <span className="text-dark-500">
                        {requestTimeline?.technicianEmail}
                      </span>
                    </span>
                  </div>
                </div>
              </>
            )}
            <div className="row">
              <div className="col-3"></div>
              <div className="line col-6 d-flex justify-content-center ">
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
              </div>
              <div className="col-3"></div>
            </div>
            {steps?.map((step, index) => (
              <div key={index} className="stepper-item">
                <div className="stepper-item-header text-blue-500">
                  {step.operationStatus === 5 ? (
                    <i className="fa-solid fa-folder-open "></i>
                  ) : step.operationStatus === 3 ? (
                    <i className="fa-regular fa-hourglass-half"></i>
                  ) : step.operationStatus === 4 ? (
                    <i className="fa-solid fa-diamond-turn-right"></i>
                  ) : step.operationStatus === 2 ? (
                    <i className="fa-solid fa-lock"></i>
                  ) : step.operationStatus === 11 ? (
                    <i className="fa-solid fa-lock-open"></i>
                  ) : step.operationStatus === 0 ? (
                    <i className="fa-solid fa-circle-check "></i>
                  ) : (
                    <i className="fa-solid fa-paperclip"></i>
                  )}
                </div>
                <div className="stepper-item-content creation card">
                  {index < steps.length - 1 ? (
                    <div className="stepper-line">
                      <div className="point"></div>
                      <div className="point"></div>
                      <div className="point"></div>
                      <div className="line"></div>
                      <div className="point"></div>
                      <div className="point"></div>
                    </div>
                  ) : null}
                  <p className="d-flex">
                    <i className="fa-solid fa-calendar-days mx-3 text-gray-600"></i>
                    <span className="text-gray-500">
                      {intl.locale == "ar"
                        ? step.statusNameAr
                        : step?.statusNameEn}
                      :{" "}
                    </span>{" "}
                    <span className="d-flex mx-2 text-gray-700">
                      <span>
                        {" "}
                        {moment
                          .tz(step?.statusDate, "UTC")
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format("YYYY-MM-DD / hh:mm a")}{" "}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            ))}
              </> : <>
              <div className="stepper-item">
                <div className="stepper-item-header">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div
                  role="button"
                  className="stepper-item-content card pb-3"
                  onClick={() => {
                    setUserId(`${technetionId}`);
                    setModalShow(true);
                  }}
                >
                  <div className="d-flex justify-content-start mb-1">
                    <p className="name mx-5">
                      {intl.formatMessage({ id: "technicianUserName" })}
                    </p>
                  </div>
                  <span className="text-dark-800 mx-5">
                    {technicianName}
                  </span>
                  <span className="mx-5">
                    <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                    <span className="text-dark-500">
                      {technicianEmail}
                    </span>
                  </span>
                </div>
              </div>
          </> }

      </> : <>
        {request_id != "00000000-0000-0000-0000-000000000000" ? <>
            {requestTimeline?.requestTimeLine?.map((item: any, index: any) => {
              return (
                <div key={index} className="stepper-item">
                  <div className="stepper-item-header">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="stepper-item-content card pb-3">
                    {index < requestTimeline?.requestTimeLine?.length - 1 ? (
                      <div className="stepper-line">
                        <div className="point"></div>
                        <div className="point"></div>
                        <div className="point"></div>
                        <div className="line"></div>
                        <div className="point"></div>
                        <div className="point"></div>
                      </div>
                    ) : null}
                    <div className="d-flex justify-content-between mb-1">
                      <p
                        className="name mx-5 text-hover-primary cursor-pointer"
                        onClick={
                          item?.actionTakerType === 0 ||
                          item?.actionTakerType === 3
                            ? () => {
                                setUserId(item?.actionTakerUserId);
                                setModalShow(true);
                              }
                            : null
                        }
                      >
                        {item?.actionTakerType === 1 ? (
                          <>{item?.actionTakerName}</>
                        ) : (
                          <>
                            {item?.actionTakerFullName} <br />
                            {item?.actionTakerName}
                          </>
                        )}
                      </p>
                      {item?.isSystemApprove &&
                      item?.actionOptions == 1 &&
                      isContenue ? (
                        <>
                          <span className="label bg-light-success text-success d-flex align-items-center">
                            {intl.formatMessage({ id: "AcceptedBySkip" })}
                          </span>
                        </>
                      ) : item?.transactions
                          ?.filter((transaction: any) => {
                            return (
                              transaction?.userName == item?.actionTakerName ||
                              (transaction?.userName ==
                                item?.actionTakerUserName &&
                                transaction?.actionOptions == 16)
                            );
                          })
                          ?.map((ele: any) => {
                            return ele?.assginRequestInstanceDto;
                          })
                          ?.map((e: any) => {
                            if (e?.assginRequestTransactions?.length > 0) {
                              return e?.assginRequestTransactions;
                            } else {
                              return [{ action: 9 }];
                            }
                          })
                          ?.flat()
                          ?.reverse()[0]?.action == 2 &&
                        item?.actionOptions == 16 ? (
                        renderLabel(9)
                      ) : (
                        isContenue &&
                        (item?.actionDate
                          ? renderLabel(item?.actionOptions)
                          : renderLabel(9))
                      )}
                    </div>
                    {item?.actionTakerType === 1 &&
                      item?.actionOptions !== 0 &&
                      item?.transactions?.length > 0 && (
                        <>
                          <p className="name mb-2">
                            {item?.transactions[index]?.userFullName +
                              " ( " +
                              item?.transactions[index]?.userName?.split(
                                "@"
                              )[0] +
                              " ) "}
                          </p>
                          {item?.transactions.length > 0 && (
                            <></>
                          )}
                        </>
                      )}
                    {item?.receivedDate ? (
                      <span className="mx-5">
                        <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                        <span className="text-gray-500">
                          {intl.formatMessage({ id: "RequestDeliveryDate" })}:{" "}
                        </span>{" "}
                        <span className="text-gray-800">
                          {moment
                            .tz(item?.receivedDate, "UTC")
                            .tz(
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                            )
                            .format("YYYY-MM-DD / hh:mm a")}
                        </span>
                      </span>
                    ) : null}

                    {item?.actionTakerType == 0 ? (
                      <>
                        {requestTimeline?.requestTimeLine?.find((item: any) => {
                          return (
                            item?.stepId?.toLowerCase() ==
                            requestTimeline?.currentStepId?.toLowerCase()
                          );
                        })?.assginRequestTemplateStepDto ? (
                          <>
                            {item?.transactions?.find((transaction: any) => {
                              return (
                                transaction?.userName ==
                                  item?.actionTakerName &&
                                transaction?.actionOptions == 16
                              );
                            })?.assginRequestInstanceDto
                              ?.assginRequestTransactions?.length == 0 ? (
                              <>
                                <div className="stepper-item pt-4 px-4">
                                  <div
                                    style={{ height: "38px", width: "38px" }}
                                    className="stepper-item-header mt-7 text-success "
                                  >
                                    <i className="fa-solid fa-user fs-4 text-success"></i>
                                  </div>
                                  <div className="stepper-item-content px-0 mx-3">
                                    <span className="mt-2">
                                      <span className="name mt-7 text-gray-600 fs-7 mx-1">
                                        {intl.formatMessage({
                                          id: "AssignedToo",
                                        }) + " :"}
                                      </span>{" "}
                                      <span className="text-primary fw-bolder">
                                        {item?.transactions?.find(
                                          (transaction: any) => {
                                            return (
                                              transaction?.userName ==
                                                item?.actionTakerName &&
                                              transaction?.actionOptions == 16
                                            );
                                          }
                                        )?.assginRequestInstanceDto
                                          ?.userFullName ||
                                          item?.transactions?.find(
                                            (transaction: any) => {
                                              return (
                                                transaction?.userName ==
                                                  item?.actionTakerName &&
                                                transaction?.actionOptions == 16
                                              );
                                            }
                                          )?.assginRequestInstanceDto?.userName}
                                      </span>
                                    </span>
                                    {item?.transactions?.find(
                                      (transaction: any) => {
                                        return (
                                          transaction?.userName ==
                                            item?.actionTakerName &&
                                          transaction?.actionOptions == 16
                                        );
                                      }
                                    )?.assginRequestInstanceDto?.comment && (
                                      <span className="mt-2">
                                        <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                        <span className="text-primary fw-bolder">
                                          {intl.formatMessage({
                                            id: "Comments",
                                          }) + " :"}
                                        </span>{" "}
                                        <span className="text-primary fw-bolder">
                                          {item?.transactions?.find(
                                            (transaction: any) => {
                                              return (
                                                transaction?.userName ==
                                                  item?.actionTakerName &&
                                                transaction?.actionOptions == 16
                                              );
                                            }
                                          )?.assginRequestInstanceDto
                                            ?.comment ||
                                            intl.formatMessage({
                                              id: "NoComment",
                                            })}
                                        </span>
                                      </span>
                                    )}
                                    <div className="stepper-line bottom-0 pt-6">
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="line  bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              item?.transactions
                                ?.filter((transaction: any) => {
                                  return (
                                    transaction?.userName ==
                                      item?.actionTakerName &&
                                    transaction?.actionOptions == 16
                                  );
                                })
                                ?.map((ele: any) => {
                                  return ele?.assginRequestInstanceDto;
                                })
                                ?.map((assignee: any) => {
                                  return (
                                    <>
                                      <div className="stepper-item pt-4 px-4">
                                        <div
                                          style={{
                                            height: "38px",
                                            width: "38px",
                                          }}
                                          className="stepper-item-header mt-7 text-success"
                                        >
                                          <i className="fa-solid fa-user fs-4 text-success"></i>
                                        </div>
                                        <div className="stepper-item-content px-0 mx-3">
                                          <span className="mt-2">
                                            <span className="name mt-7 text-gray-600 fs-7 mx-1">
                                              {intl.formatMessage({
                                                id: "AssignedToo",
                                              }) + " :"}
                                            </span>{" "}
                                            <span className="text-primary fw-bolder">
                                              {assignee?.userFullName ||
                                                assignee?.userName}
                                            </span>
                                          </span>
                                          {assignee?.assginRequestTransactions?.find(
                                            (transition: any) => {
                                              return (
                                                transition?.userName ==
                                                assignee?.userName
                                              );
                                            }
                                          )?.comment && (
                                            <span className="mt-2">
                                              <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                              <span className="text-primary fw-bolder">
                                                {intl.formatMessage({
                                                  id: "Comments",
                                                }) + " :"}
                                              </span>{" "}
                                              <span className="text-primary fw-bolder">
                                                {assignee?.assginRequestTransactions?.find(
                                                  (transition: any) => {
                                                    return (
                                                      transition?.userName ==
                                                      assignee?.userName
                                                    );
                                                  }
                                                )?.comment ||
                                                  intl.formatMessage({
                                                    id: "NoComment",
                                                  })}
                                              </span>
                                            </span>
                                          )}

                                          <span className="mt-2">
                                            <i className="fa-solid fa-file-arrow-down mx-3 text-primary fw-bolder"></i>
                                            <span className="text-primary fw-bolder">
                                              {intl.formatMessage({
                                                id: "Attachments",
                                              }) + " :"}
                                            </span>{" "}
                                            <span className="text-primary fw-bolder">
                                              {assignee?.assginRequestTransactions?.find(
                                                (transition: any) => {
                                                  return (
                                                    transition?.userName ==
                                                    assignee?.userName
                                                  );
                                                }
                                              )
                                                ?.assginRequestTransactionAttachments
                                                ?.length > 0 ? (
                                                assignee?.assginRequestTransactions
                                                  ?.find((transition: any) => {
                                                    return (
                                                      transition?.userName ==
                                                      assignee?.userName
                                                    );
                                                  })
                                                  ?.assginRequestTransactionAttachments?.map(
                                                    (item: any) => {
                                                      return (
                                                        <a
                                                          href={`${DynamicWorkflowAggRootUrl}${item?.attachmentName}`}
                                                          target="_blank"
                                                          download
                                                        >
                                                          <img
                                                            style={{
                                                              width: "15px",
                                                              height: "15px",
                                                              borderRadius:
                                                                "50px",
                                                            }}
                                                            src={getIconSrc(
                                                              item?.attachmentURL,
                                                              DynamicWorkflowAggRootUrl +
                                                                item?.attachmentName
                                                            )}
                                                            alt=""
                                                          />
                                                          {item?.attachmentURL}
                                                        </a>
                                                      );
                                                    }
                                                  )
                                              ) : (
                                                <span className="text-primary fw-bolder">
                                                  {intl.formatMessage({
                                                    id: "NotFound",
                                                  })}
                                                </span>
                                              )}
                                            </span>
                                          </span>
                                          <div className="stepper-line bottom-0 pt-6">
                                            <div className="point bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="line  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : item?.actionTakerType == 3 ? (
                      <>
                        {requestTimeline?.requestTimeLine?.find((item: any) => {
                          return (
                            item?.stepId?.toLowerCase() ==
                            requestTimeline?.currentStepId?.toLowerCase()
                          );
                        })?.assginRequestTemplateStepDto ? (
                          <>
                            {item?.transactions?.find((transaction: any) => {
                              return (
                                transaction?.userName ==
                                  item?.actionTakerUserName &&
                                transaction?.actionOptions == 16
                              );
                            })?.assginRequestInstanceDto
                              ?.assginRequestTransactions?.length == 0 ? (
                              <>
                                <div className="stepper-item pt-4 px-4">
                                  <div
                                    style={{ height: "38px", width: "38px" }}
                                    className="stepper-item-header mt-7 text-success "
                                  >
                                    <i className="fa-solid fa-user fs-4 text-success"></i>
                                  </div>
                                  <div className="stepper-item-content px-0 mx-3">
                                    <span className="mt-2">
                                      <span className="name mt-7 text-gray-600 fs-7 mx-1">
                                        {intl.formatMessage({
                                          id: "AssignedToo",
                                        }) + " :"}
                                      </span>{" "}
                                      <span className="text-primary fw-bolder">
                                        {item?.transactions?.find(
                                          (transaction: any) => {
                                            return (
                                              transaction?.userName ==
                                                item?.actionTakerUserName &&
                                              transaction?.actionOptions == 16
                                            );
                                          }
                                        )?.assginRequestInstanceDto
                                          ?.userFullName ||
                                          item?.transactions?.find(
                                            (transaction: any) => {
                                              return (
                                                transaction?.userName ==
                                                  item?.actionTakerUserName &&
                                                transaction?.actionOptions == 16
                                              );
                                            }
                                          )?.assginRequestInstanceDto?.userName}
                                      </span>
                                    </span>
                                    {item?.transactions?.find(
                                      (transaction: any) => {
                                        return (
                                          transaction?.userName ==
                                            item?.actionTakerName &&
                                          transaction?.actionOptions == 16
                                        );
                                      }
                                    )?.assginRequestInstanceDto?.comment && (
                                      <span className="mt-2">
                                        <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                        <span className="text-primary fw-bolder">
                                          {intl.formatMessage({
                                            id: "Comments",
                                          }) + " :"}
                                        </span>{" "}
                                        <span className="text-primary fw-bolder">
                                          {item?.transactions?.find(
                                            (transaction: any) => {
                                              return (
                                                transaction?.userName ==
                                                  item?.actionTakerName &&
                                                transaction?.actionOptions == 16
                                              );
                                            }
                                          )?.assginRequestInstanceDto
                                            ?.comment ||
                                            intl.formatMessage({
                                              id: "NoComment",
                                            })}
                                        </span>
                                      </span>
                                    )}
                                    <div className="stepper-line bottom-0 pt-6">
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="line  bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              item?.transactions
                                ?.filter((transaction: any) => {
                                  return (
                                    transaction?.userName ==
                                      item?.actionTakerUserName &&
                                    transaction?.actionOptions == 16
                                  );
                                })
                                ?.map((ele: any) => {
                                  return ele?.assginRequestInstanceDto;
                                })
                                ?.map((assignee: any) => {
                                  return (
                                    <>
                                      <div className="stepper-item pt-4 px-4">
                                        <div
                                          style={{
                                            height: "38px",
                                            width: "38px",
                                          }}
                                          className="stepper-item-header mt-7 text-success"
                                        >
                                          <i className="fa-solid fa-user fs-4 text-success"></i>
                                        </div>
                                        <div className="stepper-item-content px-0 mx-3">
                                          <span className="mt-2">
                                            <span className="name mt-7 text-gray-600 fs-7 mx-1">
                                              {intl.formatMessage({
                                                id: "AssignedToo",
                                              }) + " :"}
                                            </span>{" "}
                                            <span className="text-primary fw-bolder">
                                              {assignee?.userFullName ||
                                                assignee?.userName}
                                            </span>
                                          </span>
                                          {assignee?.assginRequestTransactions?.find(
                                            (transition: any) => {
                                              return (
                                                transition?.userName ==
                                                assignee?.userName
                                              );
                                            }
                                          )?.comment && (
                                            <span className="mt-2">
                                              <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                              <span className="text-primary fw-bolder">
                                                {intl.formatMessage({
                                                  id: "Comments",
                                                }) + " :"}
                                              </span>{" "}
                                              <span className="text-primary fw-bolder">
                                                {assignee?.assginRequestTransactions?.find(
                                                  (transition: any) => {
                                                    return (
                                                      transition?.userName ==
                                                      assignee?.userName
                                                    );
                                                  }
                                                )?.comment ||
                                                  intl.formatMessage({
                                                    id: "NoComment",
                                                  })}
                                              </span>
                                            </span>
                                          )}

                                          <span className="mt-2">
                                            <i className="fa-solid fa-file-arrow-down mx-3 text-primary fw-bolder"></i>
                                            <span className="text-primary fw-bolder">
                                              {intl.formatMessage({
                                                id: "Attachments",
                                              }) + " :"}
                                            </span>{" "}
                                            <span className="text-primary fw-bolder">
                                              {assignee?.assginRequestTransactions?.find(
                                                (transition: any) => {
                                                  return (
                                                    transition?.userName ==
                                                    assignee?.userName
                                                  );
                                                }
                                              )
                                                ?.assginRequestTransactionAttachments
                                                ?.length > 0 ? (
                                                assignee?.assginRequestTransactions
                                                  ?.find((transition: any) => {
                                                    return (
                                                      transition?.userName ==
                                                      assignee?.userName
                                                    );
                                                  })
                                                  ?.assginRequestTransactionAttachments?.map(
                                                    (item: any) => {
                                                      return (
                                                        <a
                                                          href={`${DynamicWorkflowAggRootUrl}${item?.attachmentName}`}
                                                          target="_blank"
                                                          download
                                                        >
                                                          <img
                                                            style={{
                                                              width: "15px",
                                                              height: "15px",
                                                              borderRadius:
                                                                "50px",
                                                            }}
                                                            src={getIconSrc(
                                                              item?.attachmentURL,
                                                              DynamicWorkflowAggRootUrl +
                                                                item?.attachmentName
                                                            )}
                                                            alt=""
                                                          />
                                                          {item?.attachmentURL}
                                                        </a>
                                                      );
                                                    }
                                                  )
                                              ) : (
                                                <span className="text-primary fw-bolder">
                                                  {intl.formatMessage({
                                                    id: "NotFound",
                                                  })}
                                                </span>
                                              )}
                                            </span>
                                          </span>
                                          <div className="stepper-line bottom-0 pt-6">
                                            <div className="point bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="line  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {requestTimeline?.requestTimeLine?.find((item: any) => {
                          return (
                            item?.stepId?.toLowerCase() ==
                            requestTimeline?.currentStepId?.toLowerCase()
                          );
                        })?.assginRequestTemplateStepDto ? (
                          <>
                            {item?.transactions?.find((transaction: any) => {
                              return (
                                transaction?.userName ==
                                  item?.actionTakerName &&
                                transaction?.actionOptions == 16
                              );
                            })?.assginRequestInstanceDto
                              ?.assginRequestTransactions?.length == 0 ? (
                              <>
                                <div className="stepper-item pt-4 px-4">
                                  <div
                                    style={{ height: "38px", width: "38px" }}
                                    className="stepper-item-header mt-7 text-success "
                                  >
                                    <i className="fa-solid fa-user fs-4 text-success"></i>
                                  </div>
                                  <div className="stepper-item-content px-0 mx-3">
                                    <span className="mt-2">
                                      <span className="name mt-7 text-gray-600 fs-7 mx-1">
                                        {intl.formatMessage({
                                          id: "AssignedToo",
                                        }) + " :"}
                                      </span>{" "}
                                      <span className="text-primary fw-bolder">
                                        {item?.transactions?.find(
                                          (transaction: any) => {
                                            return (
                                              transaction?.userName ==
                                                item?.actionTakerName &&
                                              transaction?.actionOptions == 16
                                            );
                                          }
                                        )?.assginRequestInstanceDto
                                          ?.userFullName ||
                                          item?.transactions?.find(
                                            (transaction: any) => {
                                              return (
                                                transaction?.userName ==
                                                  item?.actionTakerName &&
                                                transaction?.actionOptions == 16
                                              );
                                            }
                                          )?.assginRequestInstanceDto?.userName}
                                      </span>
                                    </span>
                                    {item?.transactions?.find(
                                      (transaction: any) => {
                                        return (
                                          transaction?.userName ==
                                            item?.actionTakerName &&
                                          transaction?.actionOptions == 16
                                        );
                                      }
                                    )?.assginRequestInstanceDto?.comment && (
                                      <span className="mt-2">
                                        <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                        <span className="text-primary fw-bolder">
                                          {intl.formatMessage({
                                            id: "Comments",
                                          }) + " :"}
                                        </span>{" "}
                                        <span className="text-primary fw-bolder">
                                          {item?.transactions?.find(
                                            (transaction: any) => {
                                              return (
                                                transaction?.userName ==
                                                  item?.actionTakerName &&
                                                transaction?.actionOptions == 16
                                              );
                                            }
                                          )?.assginRequestInstanceDto
                                            ?.comment ||
                                            intl.formatMessage({
                                              id: "NoComment",
                                            })}
                                        </span>
                                      </span>
                                    )}
                                    <div className="stepper-line bottom-0 pt-6">
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="line  bg-success"></div>
                                      <div className="point bg-success"></div>
                                      <div className="point bg-success"></div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              item?.transactions
                                ?.filter((transaction: any) => {
                                  return (
                                    transaction?.userName ==
                                      item?.actionTakerName &&
                                    transaction?.actionOptions == 16
                                  );
                                })
                                ?.map((ele: any) => {
                                  return ele?.assginRequestInstanceDto;
                                })
                                ?.map((assignee: any) => {
                                  return (
                                    <>
                                      <div className="stepper-item pt-4 px-4">
                                        <div
                                          style={{
                                            height: "38px",
                                            width: "38px",
                                          }}
                                          className="stepper-item-header mt-7 text-success"
                                        >
                                          <i className="fa-solid fa-user fs-4 text-success"></i>
                                        </div>
                                        <div className="stepper-item-content px-0 mx-3">
                                          <span className="mt-2">
                                            <span className="name mt-7 text-gray-600 fs-7 mx-1">
                                              {intl.formatMessage({
                                                id: "AssignedToo",
                                              }) + " :"}
                                            </span>{" "}
                                            <span className="text-primary fw-bolder">
                                              {assignee?.userFullName ||
                                                assignee?.userName}
                                            </span>
                                          </span>
                                          {assignee?.assginRequestTransactions?.find(
                                            (transition: any) => {
                                              return (
                                                transition?.userName ==
                                                assignee?.userName
                                              );
                                            }
                                          )?.comment && (
                                            <span className="mt-2">
                                              <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                              <span className="text-primary fw-bolder">
                                                {intl.formatMessage({
                                                  id: "Comments",
                                                }) + " :"}
                                              </span>{" "}
                                              <span className="text-primary fw-bolder">
                                                {assignee?.assginRequestTransactions?.find(
                                                  (transition: any) => {
                                                    return (
                                                      transition?.userName ==
                                                      assignee?.userName
                                                    );
                                                  }
                                                )?.comment ||
                                                  intl.formatMessage({
                                                    id: "NoComment",
                                                  })}
                                              </span>
                                            </span>
                                          )}

                                          <span className="mt-2">
                                            <i className="fa-solid fa-file-arrow-down mx-3 text-primary fw-bolder"></i>
                                            <span className="text-primary fw-bolder">
                                              {intl.formatMessage({
                                                id: "Attachments",
                                              }) + " :"}
                                            </span>{" "}
                                            <span className="text-primary fw-bolder">
                                              {assignee?.assginRequestTransactions?.find(
                                                (transition: any) => {
                                                  return (
                                                    transition?.userName ==
                                                    assignee?.userName
                                                  );
                                                }
                                              )
                                                ?.assginRequestTransactionAttachments
                                                ?.length > 0 ? (
                                                assignee?.assginRequestTransactions
                                                  ?.find((transition: any) => {
                                                    return (
                                                      transition?.userName ==
                                                      assignee?.userName
                                                    );
                                                  })
                                                  ?.assginRequestTransactionAttachments?.map(
                                                    (item: any) => {
                                                      return (
                                                        <a
                                                          href={`${DynamicWorkflowAggRootUrl}${item?.attachmentName}`}
                                                          target="_blank"
                                                          download
                                                        >
                                                          <img
                                                            style={{
                                                              width: "15px",
                                                              height: "15px",
                                                              borderRadius:
                                                                "50px",
                                                            }}
                                                            src={getIconSrc(
                                                              item?.attachmentURL,
                                                              DynamicWorkflowAggRootUrl +
                                                                item?.attachmentName
                                                            )}
                                                            alt=""
                                                          />
                                                          {item?.attachmentURL}
                                                        </a>
                                                      );
                                                    }
                                                  )
                                              ) : (
                                                <span className="text-primary fw-bolder">
                                                  {intl.formatMessage({
                                                    id: "NotFound",
                                                  })}
                                                </span>
                                              )}
                                            </span>
                                          </span>
                                          <div className="stepper-line bottom-0 pt-6">
                                            <div className="point bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="line  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                            <div className="point  bg-success"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                })
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}

                    {item?.actionDate ? (
                      <span className="mx-5">
                        <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                        <span className="text-gray-500">
                          {item?.actionOptions === 1 &&
                            intl.formatMessage({ id: "ConfirmationDate" }) +
                              " : "}
                          {item?.actionOptions === 2 &&
                            intl.formatMessage({ id: "RejectDate" }) + " :"}
                        </span>{" "}
                        <span className="text-gray-800">
                          {moment
                            .tz(item?.actionDate, "UTC")
                            .tz(
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                            )
                            .format("YYYY-MM-DD / hh:mm a")}
                        </span>
                      </span>
                    ) : null}

                    {item?.transactions
                      ?.filter((transaction: any) => {
                        return (
                          transaction?.userName == item?.actionTakerUserName
                        );
                      })
                      ?.reverse()[0]?.comment != ""
                      ? item?.transactions
                          ?.filter((transaction: any) => {
                            return (
                              transaction?.userName == item?.actionTakerUserName
                            );
                          })
                          ?.reverse()[0]?.comment && (
                          <span className="mx-5 mt-2">
                            <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                            <span className="text-primary fw-bolder">
                              {intl.formatMessage({ id: "Comments" }) + " :"}
                            </span>{" "}
                            <span className="text-primary fw-bolder">
                              {
                                item?.transactions
                                  ?.filter((transaction: any) => {
                                    return (
                                      transaction?.userName ==
                                      item?.actionTakerUserName
                                    );
                                  })
                                  ?.reverse()[0]?.comment
                              }
                            </span>
                          </span>
                        )
                      : item?.actionOptions === 0
                        ? null
                        :
                          ""}

                    {item?.transactions
                      ?.filter((transaction: any) => {
                        return (
                          transaction?.userName == item?.actionTakerUserName
                        );
                      })
                      ?.reverse()[0]?.requestTransactionAttachmentDtos
                      ? item?.transactions
                          ?.filter((transaction: any) => {
                            return (
                              transaction?.userName == item?.actionTakerUserName
                            );
                          })
                          ?.reverse()[0]
                          ?.requestTransactionAttachmentDtos[0] && (
                          <span className="mx-5 mt-2">
                            <i className="fa-solid fa-file-arrow-down mx-3 text-primary fw-bolder"></i>
                            <span className="text-primary fw-bolder">
                              {intl.formatMessage({ id: "Attachments" }) + " :"}
                            </span>{" "}
                            <span className="text-primary fw-bolder">
                              <a
                                href={`${DynamicWorkflowAggRootUrl}${
                                  item?.transactions
                                    ?.filter((transaction: any) => {
                                      return (
                                        transaction?.userName ==
                                        item?.actionTakerUserName
                                      );
                                    })
                                    ?.reverse()[0]
                                    ?.requestTransactionAttachmentDtos[0]
                                    ?.attachmentURL
                                }`}
                                target="_blank"
                                download
                              >
                                <img
                                  style={{
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50px",
                                  }}
                                  src={getIconSrc(
                                    item?.transactions
                                      ?.filter((transaction: any) => {
                                        return (
                                          transaction?.userName ==
                                          item?.actionTakerUserName
                                        );
                                      })
                                      ?.reverse()[0]
                                      ?.requestTransactionAttachmentDtos[0]
                                      ?.attachmentName,
                                    `${DynamicWorkflowAggRootUrl}${
                                      item?.transactions
                                        ?.filter((transaction: any) => {
                                          return (
                                            transaction?.userName ==
                                            item?.actionTakerUserName
                                          );
                                        })
                                        ?.reverse()[0]
                                        ?.requestTransactionAttachmentDtos[0]
                                        ?.attachmentURL
                                    }`
                                  )}
                                  alt=""
                                />
                                {
                                  item?.transactions
                                    ?.filter((transaction: any) => {
                                      return (
                                        transaction?.userName ==
                                        item?.actionTakerUserName
                                      );
                                    })
                                    ?.reverse()[0]
                                    ?.requestTransactionAttachmentDtos[0]
                                    ?.attachmentName
                                }
                              </a>
                            </span>
                          </span>
                        )
                      : item?.actionOptions === 0
                        ? null
                        : 
                          ""}
                  </div>
                </div>
              );
            })}
            
            <div className="row">
              <div className="col-3"></div>
              <div className="line col-6 d-flex justify-content-center ">
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
                <div className="hr-dot"></div>
              </div>
              <div className="col-3"></div>
            </div>
            {steps?.map((step, index) => (
              <div key={index} className="stepper-item">
                <div className="stepper-item-header text-blue-500">
                  {step.operationStatus === 5 ? (
                    <i className="fa-solid fa-folder-open "></i>
                  ) : step.operationStatus === 3 ? (
                    <i className="fa-regular fa-hourglass-half"></i>
                  ) : step.operationStatus === 4 ? (
                    <i className="fa-solid fa-diamond-turn-right"></i>
                  ) : step.operationStatus === 2 ? (
                    <i className="fa-solid fa-lock"></i>
                  ) : step.operationStatus === 11 ? (
                    <i className="fa-solid fa-lock-open"></i>
                  ) : step.operationStatus === 0 ? (
                    <i className="fa-solid fa-circle-check "></i>
                  ) : (
                    <i className="fa-solid fa-paperclip"></i>
                  )}
                </div>
                <div className="stepper-item-content creation card">
                  {index < steps.length - 1 ? (
                    <div className="stepper-line">
                      <div className="point"></div>
                      <div className="point"></div>
                      <div className="point"></div>
                      <div className="line"></div>
                      <div className="point"></div>
                      <div className="point"></div>
                    </div>
                  ) : null}
                  <p className="d-flex">
                    <i className="fa-solid fa-calendar-days mx-3 text-gray-600"></i>
                    <span className="text-gray-500">
                      {intl.locale == "ar"
                        ? step.statusNameAr
                        : step?.statusNameEn}
                      :{" "}
                    </span>{" "}
                    <span className="d-flex mx-2 text-gray-700">
                      <span>
                        {" "}
                        {moment
                          .tz(step?.statusDate, "UTC")
                          .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                          .format("YYYY-MM-DD / hh:mm a")}{" "}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            ))}
              </> : <>
              <div className="stepper-item">
                <div className="stepper-item-header">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div
                  role="button"
                  className="stepper-item-content card pb-3"
                  onClick={() => {
                    setUserId(`${technetionId}`);
                    setModalShow(true);
                  }}
                >
                  <div className="d-flex justify-content-start mb-1">
                    <p className="name mx-5">
                      {intl.formatMessage({ id: "technicianUserName" })}
                    </p>
                  </div>
                  <span className="text-dark-800 mx-5">
                    {technicianName}
                  </span>
                  <span className="mx-5">
                    <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                    <span className="text-dark-500">
                      {technicianEmail}
                    </span>
                  </span>
                </div>
              </div>
          </> }
      </>}
           
          </div>
        </div>
      ) : requesterIdCheacker ?
        <div className="">
          <div className="stepper-content">
            <div className="stepper-item">
              <div className="stepper-item-header">
                <i className="fa-solid fa-user"></i>
              </div>
              <div
                role="button"
                className="stepper-item-content card pb-3"
                onClick={() => {
                  setUserId(creatorId);
                  setModalShow(true);
                }}
              >
                <div className="d-flex justify-content-start mb-1">
                  <p className="name mx-5">
                    {intl.formatMessage({ id: "Applicant" })}
                  </p>
                </div>
                <span className="text-dark-800 mx-5">{creatorEmail}</span>
                <span className="mx-5">
                  <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                  <span className="text-dark-500">{creatorName}</span>
                </span>
              </div>
            </div>
            <div className="stepper-item">
              <div className="stepper-item-header text-dark">
                <i className="fa-solid fa-pen stepper-item-icon-creation"></i>{" "}
              </div>
              <div className="stepper-item-content creation card">
                <p className="">
                  <i className="fa-solid fa-calendar-days mx-3"></i>
                  <span className="text-gray-500">
                    {intl.formatMessage({ id: "ReportCreationDate" })}:{" "}
                  </span>{" "}
                  <span className="text-gray-800">
                    {moment
                      .tz(requestTimeline?.requestDate, "UTC")
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .format("YYYY-MM-DD / hh:mm a")}{" "}
                  </span>
                </p>
              </div>
            </div>
            
           
                        
            {
              technetionId == "00000000-0000-0000-0000-000000000000" ?
              ""
              :
              <>
                <div className="stepper-item">
                  <div className="stepper-item-header">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div
                    role="button"
                    className="stepper-item-content card pb-3"
                    onClick={() => {
                      setUserId(requestTimeline?.technicianId || technetionId);
                      setModalShow(true);
                    }}
                  >
                    <div className="d-flex justify-content-start mb-1">
                      <p className="name mx-5">
                        {intl.formatMessage({ id: "technicianUserName" })}
                      </p>
                    </div>
                    <span className="text-dark-800 mx-5">
                      {technicianName}
                    </span>
                    <span className="mx-5">
                      <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                      <span className="text-dark-500">
                        {technicianEmail}
                      </span>
                    </span>
                  </div>
                </div>
              </>
            }
          
          </div>
        </div>

      : <></>}
      
      {modalShow ? (
        <>
          <ViewRequestEmployee
            show={modalShow}
            handleClose={() => setModalShow(false)}
            id={userId}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default RequestPath;
