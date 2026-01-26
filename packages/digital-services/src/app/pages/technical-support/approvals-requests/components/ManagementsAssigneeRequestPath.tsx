import { DynamicWorkflowRootUrl } from "@4eplatform/shared/apis/dynamic_workflow";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";
import { useIntl } from "react-intl";

function ManagementsAssigneeRequestPath({
  requestTimeline,
  item,
  delegatedUserIds,
}: any) {
  let intl = useIntl();
  return (
    <>
      {requestTimeline?.requestTimeLine?.find((item: any) => {
        return (
          item?.stepId?.toLowerCase() ==
          requestTimeline?.currentStepId?.toLowerCase()
        );
      })?.assginRequestTemplateStepDto || item?.assginRequestTemplateStepDto ? (
        <>
          {item?.transactions?.find((transaction: any) => {
            return (
              transaction?.acceptanceDate == item?.actionDate &&
              transaction?.actionOptions == 16
            );
          })?.assginRequestInstanceDto?.assginRequestTransactions?.length ==
          0 ? (
            <>
              <div className="stepper-item pt-4 px-4">
                <div
                  style={{ height: "38px", width: "38px" }}
                  className="stepper-item-header mt-7 text-success "
                >
                  <i className="fa-solid fa-user fs-4 text-success"></i>
                </div>
                <div className="stepper-item-content px-0 mx-3">
                  <div>
                    {item?.transactions?.find((transaction: any) => {
                      return (
                        transaction?.acceptanceDate ==
                          item?.actionDate &&
                        transaction?.actionOptions == 16
                      );
                    })?.assginRequestInstanceDto?.description && (
                      <span className="mt-2">
                        <i
                          className="fa-regular fa-comments mx-3 fw-bolder text-primary-original"
                          style={{ color: "red !important" }}
                        ></i>
                        <span className="text-primary-original fw-bolder">
                          {intl.formatMessage({ id: "Comments" }) + " :"}
                        </span>{" "}
                        <span className="text-primary-original fw-bolder">
                          {item?.transactions?.find((transaction: any) => {
                            return (
                              transaction?.actionDate ==
                                item?.acceptanceDate &&
                              transaction?.actionOptions == 16
                            );
                          })?.assginRequestInstanceDto?.description ||
                            intl.formatMessage({ id: "NoComment" })}
                        </span>
                      </span>
                    )}

                    <br />
                    {item?.transactions?.find((transaction: any) => {
                      return (
                        transaction?.acceptanceDate ==
                          item?.actionDate &&
                        transaction?.actionOptions == 16
                      );
                    })?.assginRequestInstanceDto
                      ?.assginRequestTemplateStepAttachment?.length ? (
                      <span className="mt-2">
                        <i className="fa-solid fa-file-arrow-down mx-3 text-primary-original fw-bolder"></i>
                        <span className="text-primary-original fw-bolder">
                          {intl.formatMessage({
                            id: "Attachments",
                          }) + " :"}
                        </span>{" "}
                        <span className="text-primary-original fw-bolder">
                          {item?.transactions?.find((transaction: any) => {
                            return (
                              transaction?.acceptanceDate ==
                                item?.actionDate &&
                              transaction?.actionOptions == 16
                            );
                          })?.assginRequestInstanceDto
                            ?.assginRequestTemplateStepAttachment?.length >
                          0 ? (
                            item?.transactions
                              ?.find((transaction: any) => {
                                return (
                                  transaction?.acceptanceDate ==
                                    item?.actionDate &&
                                  transaction?.actionOptions == 16
                                );
                              })
                              ?.assginRequestInstanceDto?.assginRequestTemplateStepAttachment?.map(
                                (item: any) => {
                                  return (
                                    <a
                                      href={`${DynamicWorkflowRootUrl}${item?.attachmentURL}`}
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
                                          item?.attachmentName,
                                          { path: item?.attachmentName },
                                          DynamicWorkflowRootUrl
                                        )}
                                        onError={(e: any) =>
                                          (e.target.src = getIconSrcError(
                                            item?.attachmentName
                                          ))
                                        }
                                        alt=""
                                      />
                                      {item?.attachmentName}
                                    </a>
                                  );
                                }
                              )
                          ) : (
                            <span className="text-primary-original fw-bolder">
                              {intl.formatMessage({
                                id: "NotFound",
                              })}
                            </span>
                          )}
                        </span>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <span className="mt-2">
                    <span className="name mt-7 text-gray-600 fs-7 mx-1">
                      {intl.formatMessage({ id: "AssignedToo" }) + " :"}
                    </span>{" "}
                    <span className="text-primary fw-bolder">
                      {item?.transactions?.find((transaction: any) => {
                        return (
                          transaction?.acceptanceDate == item?.actionDate
 &&
                          transaction?.actionOptions == 16
                        );
                      })?.assginRequestInstanceDto?.userFullName ||
                        item?.transactions?.find((transaction: any) => {
                          return (
                            transaction?.acceptanceDate ==
                              item?.actionDate &&
                            transaction?.actionOptions == 16
                          );
                        })?.assginRequestInstanceDto?.userName}{" "}
                      (
                      {
                        item?.transactions?.find((transaction: any) => {
                          return (
                            transaction?.acceptanceDate ==
                              item?.actionDate &&
                            transaction?.actionOptions == 16
                          );
                        })?.assginRequestInstanceDto?.userName
                      }
                      )
                    </span>
                  </span>
                  {item?.transactions?.find((transaction: any) => {
                    return (
                      transaction?.userName == item?.acceptanceDate &&
                      transaction?.actionDate == 16
                    );
                  })?.assginRequestInstanceDto?.assginRequestTransactions[0]
                    ?.assginRequestTransactions[0]?.userName ? (
                    <>
                      <span className="mt-2">
                        <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                        <span className="text-gray-500">
                          {intl.formatMessage({ id: "DelegatedTo" })}:{" "}
                        </span>{" "}
                        <span className="text-gray-800">
                          {
                            item?.transactions?.find((transaction: any) => {
                              return (
                                transaction?.acceptanceDate ==
                                  item?.actionDate &&
                                transaction?.actionOptions == 16
                              );
                            })?.assginRequestInstanceDto
                              ?.assginRequestTransactions[0]
                              ?.assginRequestTransactions[0]?.userFullName
                          }
                          (
                          {
                            item?.transactions?.find((transaction: any) => {
                              return (
                                transaction?.acceptanceDate ==
                                  item?.actionDate &&
                                transaction?.actionOptions == 16
                              );
                            })?.assginRequestInstanceDto
                              ?.assginRequestTransactions[0]
                              ?.assginRequestTransactions[0]?.userName
                          }
                          )
                        </span>
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                  {item?.transactions?.find((transaction: any) => {
                    return (
                      transaction?.acceptanceDate == item?.actionDate &&
                      transaction?.actionOptions == 16
                    );
                  })?.assginRequestInstanceDto?.comment && (
                    <span className="mt-2">
                      <i className="fa-regular fa-comments mx-3 text-primary fw-bolder"></i>
                      <span className="text-primary fw-bolder">
                        {intl.formatMessage({ id: "Comments" }) + " :"}
                      </span>{" "}
                      <span className="text-primary fw-bolder">
                        {item?.transactions?.find((transaction: any) => {
                          return (
                            transaction?.acceptanceDate ==
                              item?.actionDate &&
                            transaction?.actionOptions == 16
                          );
                        })?.assginRequestInstanceDto?.comment ||
                          intl.formatMessage({ id: "NoComment" })}
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
                  (transaction?.acceptanceDate == item?.actionDate ||
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
              ?.map((assignee: any) => {
                return (
                  <>
                    <div className="stepper-item pt-4 px-4">
                      <div
                        style={{ height: "38px", width: "38px" }}
                        className="stepper-item-header mt-7 text-success"
                      >
                        <i className="fa-solid fa-user fs-4 text-success"></i>
                      </div>
                      <div className="stepper-item-content px-0 mx-3">
                        <div>
                          {assignee?.description && (
                            <span className="mt-2">
                              <i
                                className="fa-regular fa-comments mx-3 fw-bolder text-primary-original"
                                style={{ color: "red !important" }}
                              ></i>
                              <span className="text-primary-original fw-bolder">
                                {intl.formatMessage({ id: "Comments" }) + " :"}
                              </span>{" "}
                              <span className="text-primary-original fw-bolder">
                                {assignee?.description ||
                                  intl.formatMessage({ id: "NoComment" })}
                              </span>
                            </span>
                          )}

                          <br />
                          {assignee?.assginRequestTemplateStepAttachment
                            ?.length ? (
                            <span className="mt-2">
                              <i className="fa-solid fa-file-arrow-down mx-3 text-primary-original fw-bolder"></i>
                              <span className="text-primary-original fw-bolder">
                                {intl.formatMessage({
                                  id: "Attachments",
                                }) + " :"}
                              </span>{" "}
                              <span className="text-primary-original fw-bolder">
                                {assignee?.assginRequestTemplateStepAttachment
                                  ?.length > 0 ? (
                                  assignee?.assginRequestTemplateStepAttachment?.map(
                                    (item: any) => {
                                      return (
                                        <a
                                          href={`${DynamicWorkflowRootUrl}${item?.attachmentURL}`}
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
                                              item?.attachmentName,
                                              {
                                                path: item?.attachmentName,
                                              },
                                              DynamicWorkflowRootUrl
                                            )}
                                            onError={(e: any) =>
                                              (e.target.src = getIconSrcError(
                                                item?.attachmentName
                                              ))
                                            }
                                            alt=""
                                          />
                                          {item?.attachmentName}
                                        </a>
                                      );
                                    }
                                  )
                                ) : (
                                  <span className="text-primary-original fw-bolder">
                                    {intl.formatMessage({
                                      id: "NotFound",
                                    })}
                                  </span>
                                )}
                              </span>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <span className="mt-2">
                          <span className="name mt-7 text-gray-600 fs-7 mx-1">
                            {intl.formatMessage({
                              id: "AssignedToo",
                            }) + " :"}
                          </span>{" "}
                          <span className="text-primary fw-bolder">
                            {assignee?.userFullName || assignee?.userName} (
                            {assignee?.userName})
                          </span>
                        </span>
                        {assignee?.assginRequestTransactions[0]?.userName ? (
                          <>
                            <span className="mt-2">
                              <i className="fa-solid fa-calendar-days text-gray-500 mx-3"></i>
                              <span className="text-gray-500">
                                {intl.formatMessage({ id: "DelegatedTo" })}:{" "}
                              </span>{" "}
                              <span className="text-gray-800">
                                {
                                  assignee?.assginRequestTransactions[0]
                                    ?.userFullName
                                }{" "}
                                (
                                {
                                  assignee?.assginRequestTransactions[0]
                                    ?.userName
                                }
                                )
                              </span>
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                        {assignee?.assginRequestTransactions?.find(
                          (transition: any) => {
                            return (
                              transition?.userName === assignee?.userName ||
                              transition?.createBy !== assignee?.userId
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
                                    transition?.userName ===
                                      assignee?.userName ||
                                    transition?.createBy !== assignee?.userId
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
                                  transition?.userName === assignee?.userName ||
                                  transition?.createBy !== assignee?.userId
                                );
                              }
                            )?.assginRequestTransactionAttachments?.length >
                            0 ? (
                              assignee?.assginRequestTransactions
                                ?.find((transition: any) => {
                                  return (
                                    transition?.userName ===
                                      assignee?.userName ||
                                    transition?.createBy !== assignee?.userId
                                  );
                                })
                                ?.assginRequestTransactionAttachments?.map(
                                  (item: any) => {
                                    return (
                                      <a
                                        href={`${DynamicWorkflowRootUrl}${item?.attachmentName}`}
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
                                            item?.attachmentName,
                                            { path: item?.attachmentName },
                                            DynamicWorkflowRootUrl
                                          )}
                                          onError={(e: any) =>
                                            (e.target.src = getIconSrcError(
                                              item?.attachmentName
                                            ))
                                          }
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
  );
}

export default ManagementsAssigneeRequestPath;
