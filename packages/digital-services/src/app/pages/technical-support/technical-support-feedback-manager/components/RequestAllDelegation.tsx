import {  useEffect, useState } from "react";
import { getAllDelegationFromUserByUserId } from "../../../../redux/features/delegation/delegationSlice";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import moment from "moment";
import { DynamicWorkflowAggRootUrl } from "@4eplatform/shared/apis/dynamic_workflow_agg";
import AssigneeRequestPath from "../../approvals-requests/components/AssigneeRequestPath";

export const RequestAllDelegation = ({
  item,
  requestTimeline,
  setUserId,
  setModalShow,
  renderLabel,
  isContenue,
  index,
}: any) => {
  let intl = useIntl();
  const dispatch = useDispatch();
  const [delegatedUserIds, setDelegatedUserIds] = useState<any>({});

  useEffect(() => {
    const body = {
      id: item?.actionTakerUserId?.toLowerCase(),
      myParams: {
        pageNumber: "1",
        pageSize: "100000",
      },
    };
    dispatch(getAllDelegationFromUserByUserId(body) as any).then((res: any) => {
      setDelegatedUserIds((prev: any) => {
        return {
          ...prev,
          [item?.actionTakerUserId?.toLowerCase()]: res?.payload?.result,
        };
      });
    });
  }, [item?.actionTakerUserId?.toLowerCase()]);

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
              item?.actionTakerType === 0 || item?.actionTakerType === 3
                ? () => {
                    setUserId(item?.actionTakerUserId);
                    setModalShow(true);
                  }
                : () => {}
            }
          >
            {item?.actionTakerType === 1 ? (
              <>{item?.actionTakerName}</>
            ) : (
              <>
                {item?.actionTakerFullName
                  ?.split(" ")
                  ?.map((name: any) => {
                    if (name == "undefined" || name == undefined) {
                      return "";
                    } else {
                      return name;
                    }
                  })
                  ?.join(" ")}{" "}
                <br />
                {item?.actionTakerName}
              </>
            )}
          </p>

          {item?.isSystemApprove && item?.actionOptions == 1 && isContenue ? (
            <>
              <span className="label bg-light-success text-success d-flex align-items-center">
                {intl.formatMessage({ id: "AcceptedBySkip" })}
              </span>
            </>
          ) : item?.transactions
              ?.filter((transaction: any) => {
                return (
                  (transaction?.userName == item?.actionTakerName ||
                    transaction?.userName == item?.actionTakerUserName ||
                    delegatedUserIds[item?.actionTakerUserId?.toLowerCase()]
                      ?.map((user: any) => {
                        return user?.delegeatedToUserId?.toLowerCase();
                      })
                      ?.includes(transaction?.userId?.toLowerCase())) &&
                  transaction?.actionOptions == 16
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
              ?.reverse()[0]?.action == 2 && item?.actionOptions == 16 ? (
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
                {item?.transactions?.find((ele: any) => {
                  return (
                    ele?.userId?.toLowerCase() ==
                    item?.actionTakerUserId?.toLowerCase()
                  );
                })?.userFullName || item?.actionTakerFullName}
                {item?.transactions?.find((ele: any) => {
                  return (
                    ele?.userId?.toLowerCase() ==
                    item?.actionTakerUserId?.toLowerCase()
                  );
                })?.userFullName || item?.actionTakerFullName
                  ? " ( "
                  : ""}
                {(item?.transactions
                  ?.find((ele: any) => {
                    return (
                      ele?.userId?.toLowerCase() ==
                      item?.actionTakerUserId?.toLowerCase()
                    );
                  })
                  ?.userName?.includes("@")
                  ? item?.transactions
                      ?.find((ele: any) => {
                        return (
                          ele?.userId?.toLowerCase() ==
                          item?.actionTakerUserId?.toLowerCase()
                        );
                      })
                      ?.userName?.split("@")[0]
                  : item?.transactions?.find((ele: any) => {
                      return (
                        ele?.userId?.toLowerCase() ==
                        item?.actionTakerUserId?.toLowerCase()
                      );
                    })?.userName) || item?.actionTakerUserName}
                {item?.transactions?.find((ele: any) => {
                  return (
                    ele?.userId?.toLowerCase() ==
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
                  .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
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
                  {item?.templetStepStatus == 0 ? (
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
                  {item?.templetStepStatus == 3 ? (
                    <>
                      <span className="text-danger mx-1">
                        {intl.formatMessage({ id: "Late" })}
                      </span>
                    </>
                  ) : item?.templetStepStatus == 2 ? (
                    <>
                      <span className="text-success mx-1">
                        {intl.formatMessage({ id: "InTime" })}
                      </span>
                    </>
                  ) : item?.templetStepStatus == 1 ? (
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
        {item?.transactions?.find((ele: any) => {
          return (
            ele?.userId?.toLowerCase() ===
            item?.actionTakerUserId?.toLowerCase()
          );
        })?.actionOptions !== item?.actionOptions ? (
          <>
            {item.isExceptionActionTacker !== true ? (
              <>
                {item?.transactions?.find((ele: any) => {
                  return ele?.actionOptions === 1;
                })?.userName ||
                item?.transactions?.find((ele: any) => {
                  return ele?.actionOptions === 2;
                })?.userName ||
                item?.transactions?.find((ele: any) => {
                  return ele?.actionOptions === 16;
                })?.userName ? (
                  <>
                    <span className="mx-5">
                      <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                      <span className="text-gray-500">
                        {intl.formatMessage({ id: "DelegatedTo" })}:{" "}
                      </span>{" "}
                      <span className="text-gray-800">
                        {item?.actionOptions == 1 ? (
                          <>
                            {
                              item?.transactions?.find((ele: any) => {
                                return ele?.actionOptions == 1;
                              })?.userFullName
                            }
                            (
                            {
                              item?.transactions?.find((ele: any) => {
                                return ele?.actionOptions == 1;
                              })?.userName
                            }
                            )
                          </>
                        ) : item?.actionOptions == 2 ? (
                          <>
                            {
                              item?.transactions?.find((ele: any) => {
                                return ele?.actionOptions == 2;
                              })?.userFullName
                            }
                            (
                            {
                              item?.transactions?.find((ele: any) => {
                                return ele?.actionOptions == 2;
                              })?.userName
                            }
                            )
                          </>
                        ) : item?.actionOptions == 16 ? (
                          <>
                            {
                              item?.transactions?.find((ele: any) => {
                                return ele?.actionOptions == 16;
                              })?.userFullName
                            }
                            (
                            {
                              item?.transactions?.find((ele: any) => {
                                return ele?.actionOptions == 16;
                              })?.userName
                            }
                            )
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        <AssigneeRequestPath item={item} requestTimeline={requestTimeline} />

        {item?.actionDate ? (
          <span className="mx-5">
            <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
            <span className="text-gray-500">
              {item?.actionOptions === 1 &&
                intl.formatMessage({ id: "ConfirmationDate" }) + " : "}
              {item?.actionOptions === 2 &&
                intl.formatMessage({ id: "RejectDate" }) + " :"}
            </span>{" "}
            <span className="text-gray-800">
              {moment
                .tz(item?.actionDate, "UTC")
                .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                .format("YYYY-MM-DD / hh:mm a")}
            </span>
          </span>
        ) : null}

        {item?.transactions
          ?.filter((transaction: any) => {
            return (
              transaction?.userName == item?.actionTakerUserName ||
              delegatedUserIds[item?.actionTakerUserId?.toLowerCase()]
                ?.map((user: any) => {
                  return user?.delegeatedToUserId?.toLowerCase();
                })
                ?.includes(transaction?.userId?.toLowerCase())
            );
          })
          ?.reverse()[0]?.comment != ""
          ? item?.transactions
              ?.filter((transaction: any) => {
                return (
                  transaction?.userName == item?.actionTakerUserName ||
                  delegatedUserIds[item?.actionTakerUserId?.toLowerCase()]
                    ?.map((user: any) => {
                      return user?.delegeatedToUserId?.toLowerCase();
                    })
                    ?.includes(transaction?.userId?.toLowerCase())
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
                          transaction?.userName == item?.actionTakerUserName ||
                          delegatedUserIds[
                            item?.actionTakerUserId?.toLowerCase()
                          ]
                            ?.map((user: any) => {
                              return user?.delegeatedToUserId?.toLowerCase();
                            })
                            ?.includes(transaction?.userId?.toLowerCase())
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
              transaction?.userName == item?.actionTakerUserName ||
              delegatedUserIds[item?.actionTakerUserId?.toLowerCase()]
                ?.map((user: any) => {
                  return user?.delegeatedToUserId?.toLowerCase();
                })
                ?.includes(transaction?.userId?.toLowerCase())
            );
          })
          ?.reverse()[0]?.requestTransactionAttachmentDtos
          ? item?.transactions
              ?.filter((transaction: any) => {
                return (
                  transaction?.userName == item?.actionTakerUserName ||
                  delegatedUserIds[item?.actionTakerUserId?.toLowerCase()]
                    ?.map((user: any) => {
                      return user?.delegeatedToUserId?.toLowerCase();
                    })
                    ?.includes(transaction?.userId?.toLowerCase())
                );
              })
              ?.reverse()[0]?.requestTransactionAttachmentDtos[0] && (
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
                              item?.actionTakerUserName ||
                            delegatedUserIds[
                              item?.actionTakerUserId?.toLowerCase()
                            ]
                              ?.map((user: any) => {
                                return user?.delegeatedToUserId?.toLowerCase();
                              })
                              ?.includes(transaction?.userId?.toLowerCase())
                          );
                        })
                        ?.reverse()[0]?.requestTransactionAttachmentDtos[0]
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
                                item?.actionTakerUserName ||
                              delegatedUserIds[
                                item?.actionTakerUserId?.toLowerCase()
                              ]
                                ?.map((user: any) => {
                                  return user?.delegeatedToUserId?.toLowerCase();
                                })
                                ?.includes(transaction?.userId?.toLowerCase())
                            );
                          })
                          ?.reverse()[0]?.requestTransactionAttachmentDtos[0]
                          ?.attachmentName,
                        {
                          path: item?.transactions
                            ?.filter((transaction: any) => {
                              return (
                                transaction?.userName ==
                                  item?.actionTakerUserName ||
                                delegatedUserIds[
                                  item?.actionTakerUserId?.toLowerCase()
                                ]
                                  ?.map((user: any) => {
                                    return user?.delegeatedToUserId?.toLowerCase();
                                  })
                                  ?.includes(transaction?.userId?.toLowerCase())
                              );
                            })
                            ?.reverse()[0]?.requestTransactionAttachmentDtos[0]
                            ?.attachmentURL,
                        },
                        DynamicWorkflowAggRootUrl
                      )}
                      alt=""
                    />
                    {
                      item?.transactions
                        ?.filter((transaction: any) => {
                          return (
                            transaction?.userName ==
                              item?.actionTakerUserName ||
                            delegatedUserIds[
                              item?.actionTakerUserId?.toLowerCase()
                            ]
                              ?.map((user: any) => {
                                return user?.delegeatedToUserId?.toLowerCase();
                              })
                              ?.includes(transaction?.userId?.toLowerCase())
                          );
                        })
                        ?.reverse()[0]?.requestTransactionAttachmentDtos[0]
                        ?.attachmentName
                    }
                  </a>
                </span>
              </span>
            )
          : item?.actionOptions === 0
            ? null
            : ""}
      </div>
    </div>
  );
};
