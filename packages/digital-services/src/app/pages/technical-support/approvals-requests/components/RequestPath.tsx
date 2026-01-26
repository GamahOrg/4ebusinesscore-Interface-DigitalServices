import { FC, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import "./stepper.css";
import moment from "moment";
import AssigneeRequestPath from "./AssigneeRequestPath";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import ViewRequestEmployee from "../popups/ViewRequestEmployeePopup";
import { ViewRequestEmployee as ViewRequestEmployeeAlt } from "../../technical-support-feedback-manager/popups/ViewRequestEmployeePopup";
import ViewTechnicianPopup from "../popups/ViewTechnicianPopup";
import { RootState } from "../../../../redux/store/store";
import { getIncomingRequestsById } from "../../../../redux/features/requests-slice/requests-slice";
import { getAllDelegationFromUserByUserId } from "../../../../redux/features/delegation/delegationSlice";
import { fetchRequestTimeline } from "../../../../redux/features/requestTemplate/request-timeline-slice";
import { DynamicWorkflowRootUrl } from "@4eplatform/shared/apis/dynamic_workflow";
import { fetchOrgs } from "../../../../redux/features/orgs/orgSlice";

const RequestPath: FC<{
  request_id: string;
  requestCategoryName?: string;
  requestDetails?: any;
  fetchDataFrom?: string;
  creatorEmail?: any;
  creatorName?: any;
  creatorId?: any;
}> = ({
  request_id,
  requestCategoryName,
  requestDetails,
  fetchDataFrom,
  creatorEmail,
  creatorName,
  creatorId,
}) => {
  let intl = useIntl();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalTechnicianShow, setModalTechnicianShow] =
    useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const dispatch = useDispatch();
  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });
  let [delegatedUserIds, setDelegatedUserIds] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      if (request_id) {
        await dispatch(getIncomingRequestsById(request_id) as any);
      }
    };
    fetchData();
  }, [request_id, dispatch]);

  useEffect(() => {
    if (request_id) {
      dispatch(fetchRequestTimeline({ id: request_id }) as any);
    }
  }, [request_id, dispatch]);

  useEffect(() => {
    requestTimeline?.requestTimeLine?.forEach((item: any) => {
      const body = {
        id: item?.actionTakerUserId?.toLowerCase(),
        myParams: {
          pageNumber: "1",
          pageSize: "100000",
        },
      };
      dispatch(getAllDelegationFromUserByUserId(body) as any).then(
        (res: any) => {
          setDelegatedUserIds((prev: any) => {
            return {
              ...prev,
              [item?.actionTakerUserId?.toLowerCase()]: res?.payload?.result,
            };
          });
        }
      );
    });
  }, [requestTimeline?.requestTimeLine, dispatch]);
  const renderLabel = (action: any, item: any) => {
    let mappedAction =
      action == 4 && item?.stepId == currentStepId ? 9 : action;
    if (
      item?.stepId === currentStepId ||
      item?.stepId === redirectedStepId ||
      stepsBeforeCurrent?.includes(item?.stepId)
    ) {
      switch (mappedAction) {
        case 0:
          return (
            <span className="label bg-light-warning text-warning d-flex align-items-center justify-content-center py-3 my-3 my-md-0">
              {intl.formatMessage({ id: "UnderProcedure" })}{" "}
            </span>
          );
        case 1:
          return (
            <span className="label bg-light-success text-success d-flex align-items-center justify-content-center py-3 my-3 my-md-0">
              {intl.formatMessage({ id: "ApprovalDone" })}
            </span>
          );
        case 2:
          return (
            <span className="label  bg-light-danger text-danger d-flex align-items-center justify-content-center py-3 my-3 my-md-0">
              {intl.formatMessage({ id: "RejectionDone" })}
            </span>
          );
        case 4:
          return (
            <span className="label  bg-light-primary text-primary d-flex align-items-center justify-content-center py-3 my-3 my-md-0">
              {intl.formatMessage({ id: "Redirected" })}
            </span>
          );
        case 32:
          return (
            <></>
          );
        case 9:
        case null:
          return (
            <span className="label bg-light-primary text-primary d-flex align-items-center justify-content-center py-3 my-3 my-md-0">
              {intl.formatMessage({ id: "WaitingForApproval" })}
            </span>
          );
        case 16:
          return (
            <span className="label bg-light-primary text-primary d-flex align-items-center justify-content-center py-3 my-3 my-md-0">
              {intl.formatMessage({ id: "WaitingForAssigned" })}
            </span>
          );
      }
    } else {
      return null;
    }
  };

  const checkUndefinedName = (name: any) => {
    if (
      name === "undefined" ||
      name === "null" ||
      name === undefined ||
      name === null
    ) {
      return "";
    } else {
      return name;
    }
  };

  const [userData, setUserData] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    fourthName: "",
  });

  useEffect(() => {
    setUserData({
      firstName: checkUndefinedName(requestDetails?.createdByFirstName),
      secondName: checkUndefinedName(requestDetails?.createdBySecondName),
      thirdName: checkUndefinedName(requestDetails?.createdByThirdName),
      fourthName: checkUndefinedName(requestDetails?.createdByFourthName),
    });
  }, [requestDetails]);
   let allOrgs = useSelector((state: RootState) => {
    return state?.orgs?.orgs;
  });
  useEffect(()=>{
    dispatch(fetchOrgs({}) as any);
  },[])
  let stepIds = requestTimeline?.requestTimeLine?.map((item: any) => {
    return item?.stepId;
  });
  let currentStepId =
    requestTimeline?.currentStepId || requestTimeline?.lastStepTakeactionId;
  let redirectedStepId = requestTimeline?.requestTimeLine
    ?.filter((item: any) => {
      return item?.actionOptions == 4;
    })
    ?.reverse()[0]?.stepId;
  let currentStepIndex = stepIds?.findIndex((stepId: any) => {
    return stepId == currentStepId;
  });
  let redirectedStepIndex = stepIds?.findIndex((stepId: any) => {
    return stepId == redirectedStepId;
  });
  let stepsBeforeCurrent = stepIds?.slice(0, currentStepIndex + 1);
  let stepsBeforeRedirected = stepIds?.slice(
    0,
    redirectedStepId ? redirectedStepIndex + 1 : currentStepIndex + 1
  );
  const findOrgByNameAr = (orgs: any[], name: string): any => {
  for (const org of orgs) {
    if (org?.nameAr?.trim() === name?.trim()) {
      return org;
    }

    if (org?.children?.length) {
      const result = findOrgByNameAr(org.children, name);
      if (result) return result;
    }
  }
  return null;
};

   let mapActionTakerName=(actionTakerName:string,type:number)=>{
   if(type !=1){
     let updatedActionTakerName=""
    if(actionTakerName?.includes("مدير المشروع")){
      updatedActionTakerName=actionTakerName?.replace("مدير المشروع",intl.formatMessage({id:"ProjectManager"}))
      return updatedActionTakerName
    }
    else if(actionTakerName?.includes("مالك المشروع")){
      updatedActionTakerName=actionTakerName?.replace("مالك المشروع",intl.formatMessage({id:"ProjectOwner"}))
      return updatedActionTakerName
    }
    else if(actionTakerName?.includes("المدير المباشر")){
      updatedActionTakerName=actionTakerName?.replace("المدير المباشر",intl.formatMessage({id:"DirectManager"}))
      return updatedActionTakerName
    }
    else if(actionTakerName?.includes("القائم بالطلب")){
      updatedActionTakerName=actionTakerName?.replace("القائم بالطلب",intl.formatMessage({id:"Requester"}))
      return updatedActionTakerName
    }
    else {
      return actionTakerName
    }
   }
   else if(type==1){
   const matchedOrg = findOrgByNameAr(allOrgs, actionTakerName);
   const orgName = matchedOrg?.[intl.locale === "ar" ? "nameAr" : "nameEn"];
   return orgName
  }
  }
  return (
    <>
      {requestTimeline ? (
        <div className="">
          <div className="stepper-content">
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
                      .format("YYYY-MM-DD / hh:mm a")}
                  </span>
                </p>
              </div>
            </div>
            <div className="stepper-item">
              <div className="stepper-item-header">
                <i className="fa-solid fa-user"></i>
              </div>
              {requestDetails?.createBy ? (
                <>
                  <div
                    role="button"
                    className="stepper-item-content card pb-3"
                    onClick={() => {
                      setUserId(requestDetails?.createBy);
                      setModalShow(true);
                    }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <p className="name mx-5">
                        {intl.formatMessage({ id: "Applicant" })}
                      </p>
                      {requestTimeline?.status == 5 ? (
                        <span className="label  bg-light-danger text-danger">
                          {intl.formatMessage({ id: "CancelDone" })}
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                    <span className="text-dark-800 mx-5">
                      {" "}
                      {`${userData.firstName} ${userData.secondName} ${checkUndefinedName(userData.thirdName)} ${userData.fourthName}`.trim()}{" "}
                    </span>
                    <span className="mx-5">
                      <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                      <span className="text-dark-500">
                        {requestDetails?.email}
                      </span>
                    </span>
                  </div>
                </>
              ) : (
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
                  <span className="text-dark-800 mx-5"> {creatorName}</span>
                  <span className="mx-5">
                    <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                    <span className="text-dark-500">{creatorEmail}</span>
                  </span>
                </div>
              )}
            </div>
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
                    <div className="d-flex mb-1 flex-column flex-md-row justify-content-md-between">
                      <p
                        className="name mx-5 text-hover-primary cursor-pointer"
                        onClick={
                          item?.actionTakerType === 0 ||
                          item?.actionTakerType === 3
                            ? () => {
                                setUserId(item?.actionTakerUserId);
                                setModalShow(true);
                              }
                            : () => {}
                        }
                      >
                        {item?.actionTakerType === 1 ? (
                          <>{mapActionTakerName(item?.actionTakerName,item?.actionTakerType)}</>
                        ) : (
                          <>
                            {item?.actionTakerFullName
                              ?.split(" ")
                              ?.map((name: any) => {
                                if (
                                  name === "undefined" ||
                                  name === undefined
                                ) {
                                  return "";
                                } else {
                                  return name;
                                }
                              })
                              ?.join(" ")}{" "}
                            <br />
                            {mapActionTakerName(item?.actionTakerName,item?.actionTakerType)}
                          </>
                        )}
                      </p>

                      <div className="d-flex flex-column gap-3">
                        {item?.isSystemApprove &&
                        item?.actionOptions === 1 &&
                        stepsBeforeRedirected?.includes(item?.stepId) ? (
                          <>
                            <span className="label bg-light-success text-success d-flex align-items-center justify-content-center py-3">
                              {intl.formatMessage({ id: "AcceptedBySkip" })}
                            </span>
                          </>
                        ) : item?.transactions
                            ?.filter((transaction: any) => {
                              return (
                                (transaction?.userName ===
                                  item?.actionTakerName ||
                                  transaction?.userName ===
                                    item?.actionTakerUserName ||
                                  delegatedUserIds[
                                    item?.actionTakerUserId?.toLowerCase()
                                  ]
                                    ?.map((user: any) => {
                                      return user?.delegeatedToUserId?.toLowerCase();
                                    })
                                    ?.includes(
                                      transaction?.userId?.toLowerCase()
                                    )) &&
                                transaction?.actionOptions === 16
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
                            ?.reverse()[0]?.action === 2 &&
                          item?.actionOptions === 16 &&
                          stepsBeforeRedirected?.includes(item?.stepId) ? (
                          renderLabel(9, item)
                        ) : (
                          stepsBeforeRedirected?.includes(item?.stepId) &&
                          (item?.actionDate
                            ? renderLabel(item?.actionOptions, item)
                            : renderLabel(9, item))
                        )}

                        {requestTimeline?.status === 6 && (
                          <span className="label bg-light-primary text-primary d-flex align-items-center justify-content-center py-3">
                            {intl.formatMessage({ id: "ExceptionApproved" })}
                          </span>
                        )}
                      </div>
                    </div>

                    {item?.actionTakerType === 1 &&
                      item?.actionOptions !== 0 &&
                      item?.transactions?.length > 0 && (
                        <>
                          <p className="name mb-2">
                            {item?.transactions?.find((ele: any) => {
                              return (
                                ele?.userId?.toLowerCase() ===
                                item?.actionTakerUserId?.toLowerCase()
                              );
                            })?.userFullName || item?.actionTakerFullName}
                            {item?.transactions?.find((ele: any) => {
                              return (
                                ele?.userId?.toLowerCase() ===
                                item?.actionTakerUserId?.toLowerCase()
                              );
                            })?.userFullName || item?.actionTakerFullName
                              ? " ( "
                              : ""}
                            {(item?.transactions
                              ?.find((ele: any) => {
                                return (
                                  ele?.userId?.toLowerCase() ===
                                  item?.actionTakerUserId?.toLowerCase()
                                );
                              })
                              ?.userName?.includes("@")
                              ? item?.transactions
                                  ?.find((ele: any) => {
                                    return (
                                      ele?.userId?.toLowerCase() ===
                                      item?.actionTakerUserId?.toLowerCase()
                                    );
                                  })
                                  ?.userName?.split("@")[0]
                              : item?.transactions?.find((ele: any) => {
                                  return (
                                    ele?.userId?.toLowerCase() ===
                                    item?.actionTakerUserId?.toLowerCase()
                                  );
                                })?.userName) || item?.actionTakerUserName}
                            {item?.transactions?.find((ele: any) => {
                              return (
                                ele?.userId?.toLowerCase() ===
                                item?.actionTakerUserId?.toLowerCase()
                              );
                            })?.userFullName || item?.actionTakerFullName
                              ? " ) "
                              : ""}
                          </p>
                        </>
                      )}
                    <div className="d-flex align-items-center justify-content-between">
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
                      ) : (
                        <div style={{ width: "50%" }} className="mx-2"></div>
                      )}
                      <div className="mt-2">
                        {item?.isSlaVisbale ? (
                          <>
                            <span className="text-primary mx-2">SLA :</span>
                            <div className="d-inline">
                              <span>(</span>
                              {item?.templetStepStatus === 0 ? (
                                <>{intl.formatMessage({ id: "NotFound" })}</>
                              ) : (
                                <>
                                  <span>{item?.implementationDays}</span>
                                  <span className="mx-1">
                                    {intl.formatMessage({ id: "Days" })}
                                  </span>
                                  <span> : </span>
                                  <span>{item?.implementationHours}</span>
                                  <span className="mx-1">
                                    {intl.formatMessage({ id: "Hours" })}
                                  </span>
                                  <span> : </span>
                                  <span>{item?.implementationMinutes}</span>
                                  <span className="mx-1">
                                    {intl.formatMessage({ id: "Minutes" })}
                                  </span>
                                </>
                              )}
                              <span>)</span>
                            </div>
                            <div className="h-fit d-flex align-items-center justify-content-center">
                              {item?.templetStepStatus === 3 ? (
                                <>
                                  <span className="text-danger mx-1">
                                    {intl.formatMessage({ id: "Late" })}
                                  </span>
                                </>
                              ) : item?.templetStepStatus === 2 ? (
                                <>
                                  <span className="text-success mx-1">
                                    {intl.formatMessage({ id: "InTime" })}
                                  </span>
                                </>
                              ) : item?.templetStepStatus === 1 ? (
                                <div className="text-center">
                                  (
                                  <span className="text-gray mx-1">
                                    {intl.formatMessage({ id: "NotYet" })}
                                  </span>
                                  )
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    {(item?.actionOptions == 1 ||
                      item?.actionOptions == 2 ||
                      item?.actionOptions == 16) &&
                    [...item?.transactions]
                      ?.reverse()[0]
                      ?.userId?.toLowerCase() !=
                      item?.actionTakerUserId?.toLowerCase() ? (
                      <>
                      {[...item?.transactions]?.reverse()[0]?.userName && (
                        <span className="mx-4">
                          <span className="mx-5">
                            <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                            <span className="text-gray-500">
                              {intl.formatMessage({ id: "DelegatedTo" })}:{" "}
                            </span>{" "}
                            <span className="text-gray-800">
                              {[...item?.transactions]?.reverse()[0]?.userName}
                            </span>
                          </span>
                        </span>
                      )}
                        
                      </>
                    ) : (
                      <></>
                    )}
                    <AssigneeRequestPath
                      item={item}
                      requestTimeline={requestTimeline}
                    />

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
                          (transaction?.userName ===
                            item?.actionTakerUserName ||
                            delegatedUserIds[
                              item?.actionTakerUserId?.toLowerCase()
                            ]
                              ?.map((user: any) => {
                                return user?.delegeatedToUserId?.toLowerCase();
                              })
                              ?.includes(transaction?.userId?.toLowerCase())) &&
                          transaction?.isRequireEdit == false
                        );
                      })
                      ?.reverse()[0]?.comment !== ""
                      ? item?.transactions
                          ?.filter((transaction: any) => {
                            return (
                              (transaction?.userName ===
                                item?.actionTakerUserName ||
                                delegatedUserIds[
                                  item?.actionTakerUserId?.toLowerCase()
                                ]
                                  ?.map((user: any) => {
                                    return user?.delegeatedToUserId?.toLowerCase();
                                  })
                                  ?.includes(
                                    transaction?.userId?.toLowerCase()
                                  )) &&
                              transaction?.isRequireEdit == false
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
                                      (transaction?.userName ===
                                        item?.actionTakerUserName ||
                                        delegatedUserIds[
                                          item?.actionTakerUserId?.toLowerCase()
                                        ]
                                          ?.map((user: any) => {
                                            return user?.delegeatedToUserId?.toLowerCase();
                                          })
                                          ?.includes(
                                            transaction?.userId?.toLowerCase()
                                          )) &&
                                      transaction?.isRequireEdit == false
                                    );
                                  })
                                  ?.reverse()[0]?.comment
                              }
                            </span>
                          </span>
                        )
                      : item?.actionOptions === 0
                        ? null
                        : ""}

                    {item?.transactions
                      ?.filter((transaction: any) => {
                        return (
                          (transaction?.userName ===
                            item?.actionTakerUserName ||
                            delegatedUserIds[
                              item?.actionTakerUserId?.toLowerCase()
                            ]
                              ?.map((user: any) => {
                                return user?.delegeatedToUserId?.toLowerCase();
                              })
                              ?.includes(transaction?.userId?.toLowerCase())) &&
                          transaction?.isRequireEdit == false
                        );
                      })
                      ?.reverse()[0]?.requestTransactionAttachmentDtos
                      ? item?.transactions
                          ?.filter((transaction: any) => {
                            return (
                              (transaction?.userName ===
                                item?.actionTakerUserName ||
                                delegatedUserIds[
                                  item?.actionTakerUserId?.toLowerCase()
                                ]
                                  ?.map((user: any) => {
                                    return user?.delegeatedToUserId?.toLowerCase();
                                  })
                                  ?.includes(
                                    transaction?.userId?.toLowerCase()
                                  )) &&
                              transaction?.isRequireEdit == false
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
                                rel="noreferrer"
                                href={`${DynamicWorkflowRootUrl}${
                                  item?.transactions
                                    ?.filter((transaction: any) => {
                                      return (
                                        (transaction?.userName ===
                                          item?.actionTakerUserName ||
                                          delegatedUserIds[
                                            item?.actionTakerUserId?.toLowerCase()
                                          ]
                                            ?.map((user: any) => {
                                              return user?.delegeatedToUserId?.toLowerCase();
                                            })
                                            ?.includes(
                                              transaction?.userId?.toLowerCase()
                                            )) &&
                                        transaction?.isRequireEdit == false
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
                                          (transaction?.userName ===
                                            item?.actionTakerUserName ||
                                            delegatedUserIds[
                                              item?.actionTakerUserId?.toLowerCase()
                                            ]
                                              ?.map((user: any) => {
                                                return user?.delegeatedToUserId?.toLowerCase();
                                              })
                                              ?.includes(
                                                transaction?.userId?.toLowerCase()
                                              )) &&
                                          transaction?.isRequireEdit == false
                                        );
                                      })
                                      ?.reverse()[0]
                                      ?.requestTransactionAttachmentDtos[0]
                                      ?.attachmentName,
                                    {
                                      path: item?.transactions
                                        ?.filter((transaction: any) => {
                                          return (
                                            (transaction?.userName ===
                                              item?.actionTakerUserName ||
                                              delegatedUserIds[
                                                item?.actionTakerUserId?.toLowerCase()
                                              ]
                                                ?.map((user: any) => {
                                                  return user?.delegeatedToUserId?.toLowerCase();
                                                })
                                                ?.includes(
                                                  transaction?.userId?.toLowerCase()
                                                )) &&
                                            transaction?.isRequireEdit == false
                                          );
                                        })
                                        ?.reverse()[0]
                                        ?.requestTransactionAttachmentDtos[0]
                                        ?.attachmentURL,
                                    },
                                    DynamicWorkflowRootUrl
                                  )}
                                  alt=""
                                />
                                {
                                  item?.transactions
                                    ?.filter((transaction: any) => {
                                      return (
                                        (transaction?.userName ===
                                          item?.actionTakerUserName ||
                                          delegatedUserIds[
                                            item?.actionTakerUserId?.toLowerCase()
                                          ]
                                            ?.map((user: any) => {
                                              return user?.delegeatedToUserId?.toLowerCase();
                                            })
                                            ?.includes(
                                              transaction?.userId?.toLowerCase()
                                            )) &&
                                        transaction?.isRequireEdit == false
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
                        : ""}
                    {Array.isArray(item?.transactions) &&
                    item?.transactions?.filter((element: any) => {
                      return element?.isRequireEdit == true;
                    })?.length > 0 ? (
                      <>
                        <div className="p-5">
                          <label className="mb-5">
                            {intl.formatMessage({
                              id: "PrevLogsActionsForUserOnRequest",
                            })}
                            :
                          </label>
                          <ul>
                            {" "}
                            {item?.transactions
                              ?.filter((element: any) => {
                                return element?.isRequireEdit == true;
                              })
                              ?.map((ele: any) => {
                                return (
                                  <Fragment key={ele?.id}>
                                    <li>
                                      {" "}
                                      <div
                                        className={`${ele?.actionOptions != 1 && ele?.actionOptions != 2 ? "d-flex align-items-center justify-content-between" : "d-block"}`}
                                      >
                                        <span className="mx-5 mt-2">
                                          <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                          <span className="text-primary fw-bolder">
                                            {intl.formatMessage({
                                              id: "Activity",
                                            }) + " :"}
                                          </span>{" "}
                                          <span
                                            className={`text-${ele?.actionOptions == 1 ? "success" : ele?.actionOptions == 2 ? "danger" : "primary"} fw-bolder`}
                                          >
                                            {intl.formatMessage({
                                              id:
                                                ele?.actionOptions == 1
                                                  ? "RequestAcceptance"
                                                  : ele?.actionOptions == 2
                                                    ? "RequestRejection"
                                                    : ele?.actionOptions == 4
                                                      ? "RequestRedirect"
                                                      : ele?.actionOptions == 16
                                                        ? "RequestAssign"
                                                        : "",
                                            })}
                                          </span>
                                          {/* {ele?.actionOptions == 16 ? (
                                            <>
                                              <span>
                                                {
                                                  item?.transactions?.find(
                                                    (element) => {
                                                      return (
                                                        element?.actionOptions ==
                                                        16
                                                      );
                                                    }
                                                  )?.assginRequestInstanceDto
                                                    ?.userFullName
                                                }
                                              </span>
                                            </>
                                          ) : (
                                            <></>
                                          )} */}
                                        </span>

                                        {(ele?.actionOptions == 1 ||
                                          ele?.actionOptions == 2 ||
                                          ele?.actionOptions == 4) &&
                                        ele?.requestTransactionAttachmentDtos
                                          ?.length > 0 ? (
                                          <>
                                            <span className="mx-5 mt-2">
                                              <i className="fa-solid fa-file-arrow-down mx-3 text-primary fw-bolder"></i>
                                              <span className="text-primary fw-bolder">
                                                {intl.formatMessage({
                                                  id: "Attachments",
                                                }) + " :"}
                                              </span>{" "}
                                              {ele?.requestTransactionAttachmentDtos?.map(
                                                (
                                                  attachment: any,
                                                  index: number
                                                ) => {
                                                  return (
                                                    <Fragment key={index}>
                                                      <span className="text-primary fw-bolder">
                                                        <a
                                                          rel="noreferrer"
                                                          href={`${DynamicWorkflowRootUrl}${attachment?.attachmentURL}`}
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
                                                              attachment?.attachmentName,
                                                              {
                                                                path: attachment?.attachmentURL,
                                                              },
                                                              DynamicWorkflowRootUrl
                                                            )}
                                                            alt={
                                                              attachment?.attachmentName
                                                            }
                                                          />
                                                          {
                                                            attachment?.attachmentName
                                                          }
                                                        </a>
                                                      </span>
                                                    </Fragment>
                                                  );
                                                }
                                              )}
                                            </span>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                        {(ele?.actionOptions == 1 ||
                                          ele?.actionOptions == 2 ||
                                          ele?.actionOptions == 4) &&
                                        ele?.comment ? (
                                          <>
                                            <span className="mx-5 mt-2">
                                              <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                                              <span className="text-primary fw-bolder">
                                                {intl.formatMessage({
                                                  id: "Comments",
                                                }) + " :"}
                                              </span>{" "}
                                              <span className="text-primary fw-bolder">
                                                {ele?.comment}
                                              </span>
                                            </span>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </li>
                                  </Fragment>
                                );
                              })}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
            
            {requestTimeline?.serviceType !=11 && requestTimeline?.serviceType !=12 && requestTimeline?.technicianId &&
              requestTimeline?.technicianId !==
                "00000000-0000-0000-0000-000000000000" &&
              requestTimeline?.technicianId !== "" &&
              requestTimeline?.technicianId !== null &&
              requestTimeline?.technicianId !== "null" && (
                <div
                  className="stepper-item cursor-pointer text-hover-primary"
                  onClick={() => {
                    setModalTechnicianShow(true);
                  }}
                >
                  <div className="stepper-item-header">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="stepper-item-content card pb-3">
                    <div className="d-flex justify-content-start mb-1">
                      <p className="name mx-5">
                        {intl.formatMessage({ id: "technicianUserName" })}
                      </p>
                    </div>
                    <span className="text-dark-800 mx-5 ">
                      {requestTimeline?.technicianUserName}
                    </span>
                    {requestTimeline?.technicianEmail ? (
                      <>
                        <span className="mx-5">
                          <i className="fa-solid fa-envelope text-gray-500 mx-3"></i>
                          <span className="text-dark-500">
                            {requestTimeline?.technicianEmail}
                          </span>
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      ) : null}

      {fetchDataFrom ? (
        <>
          {modalShow ? (
            <>
              <ViewRequestEmployeeAlt
                show={modalShow}
                handleClose={() => setModalShow(false)}
                id={userId}
              />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
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
      )}
      {modalTechnicianShow ? (
        <>
          <ViewTechnicianPopup
            show={modalTechnicianShow}
            handleClose={() => setModalTechnicianShow(false)}
            id={requestTimeline?.technicianId}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default RequestPath;
