import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Notification } from "@4eplatform/shared/services/notifications";
import Select from "react-select";
import {
  AssignmentUserRequestProps,
  AssignmentUserRequestSchema,
} from "../../../../validations/assignment-user-request-validation";
import {
  AssignmentGroupRequestProps,
  AssignmentGroupRequestSchema,
} from "../../../../validations/assignment-group-request-validation";
import { useDispatch, useSelector } from "react-redux";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { fetchUsersForSendStep } from "../../../../redux/features/requests-slice/requests-slice";
import { RootState } from "../../../../redux/store/store";
import { postRequestTransaction } from "../../../../redux/features/requests-slice/request-transaction-slice";
import { useLocation } from "react-router-dom";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import CheckBoxDropDown from "../components/CheckBoxDropDown";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { Button, Spinner } from "react-bootstrap";

type PopupProps = {
  show: boolean;
  handleClose: any;
  id: string;
  stepId?: string;
  countTasks?: number;
  incomingRequestDetails?: any;
};
export const AssignmentPopup: FC<PopupProps> = ({
  show,
  handleClose,
  id,
  stepId,
  countTasks,
  incomingRequestDetails,
}) => {
  const intl = useIntl();
  let { id: requestInstanceId, systemId } = useParams();
  let navigate = useNavigate();
  const location = useLocation();
  let cardName = location?.state?.cardTitle;
  let language: string = intl.locale;
  const [selectedFileForAttachmentUser, setSelectedFileForAttachmentUser] =
    useState<any>();
  const [selectedFileForAttachmentGroup, setSelectedFileForAttachmentGroup] =
    useState<any>();
  const [requestType, setRequestType] = useState("Individual");
  let assignUsers = useSelector((state: RootState) => {
    return state?.requests?.assignUsers;
  });
  let loggedUserId = JSON.parse(localStorage.getItem("userInfo") as string)?.id;
  let [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 15 * 1024 * 1024;

  const validateFile = (file: any): boolean => {
    if (!file) return true;

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

  useEffect(() => {
    if (stepId) {
      dispatch(fetchUsersForSendStep(stepId) as any);
    }
  }, [stepId]);

  const handleRequestTypeChange = (event: any) => {
    setRequestType(event.target.value);
  };
  const {
    register: registerForUser,
    handleSubmit: handleSubmitForUser,
    watch: watchForUser,
    setValue: setValueForUser,
    trigger: triggerForUser,
    control: controlForUser,
    formState: { errors: errorsForUser },
  } = useForm<AssignmentUserRequestProps>({
    resolver: yupResolver(AssignmentUserRequestSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
  const {
    register: registerForGroup,
    handleSubmit: handleSubmitForGroup,
    watch: watchForGroup,
    setValue: setValueForGroup,
    control: controlForGroup,
    trigger: triggerForGroup,
    formState: { errors: errorsForGroup },
  } = useForm<AssignmentGroupRequestProps>({
    resolver: yupResolver(AssignmentGroupRequestSchema),
    mode: "all",
    reValidateMode: "onSubmit",
  });
  let dispatch = useDispatch();
  let formValuesForUser = watchForUser();
  let formValuesForGroup = watchForGroup();
  let [selectedManager, setSelectedManager] = useState<any>();
  let [selectedUser, setSelectedUser] = useState<any>();

  const options = assignUsers
    ?.filter((item:any) => {
      return item?.userId != loggedUserId;
    })
    ?.map((user:any) => ({
      value: user?.userId,
      label: `${user?.userName} (${user?.userFullName})`,
    }));
  const userOptions = assignUsers
    ?.filter((item:any) => item?.userId !== loggedUserId)
    ?.map((user:any) => ({
      value: user?.userId,
      label: `${user?.userName} (${user?.userFullName})`,
      userName: user?.userName,
      fullName: user?.userFullName,
    }));
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [userIds, setUserIds] = useState<any>([]);
  useEffect(() => {
    setValueForUser("requestType", requestType == "Individual" ? true : false);
    setValueForGroup("requestType", requestType == "Group" ? true : false);
  }, [requestType]);

  useEffect(() => {
    if (requestType == "Individual") {
      setSelectedUsers([]);
      setValueForGroup("manager", "");
      setValueForGroup("endDate", "");
      setValueForGroup("description", "");
      setSelectedManager({});
      setUserIds([]);
      setSelectedFileForAttachmentGroup(null);
    } else {
      setValueForUser("endDate", "");
      setValueForUser("assignTo", "");
      setValueForUser("description", "");
      setSelectedFileForAttachmentUser(null);
      setSelectedUser({});
    }
  }, [requestType]);

  useEffect(() => {
    if (formValuesForUser?.requestType) {
      setValueForUser("startDate", moment().format("YYYY-MM-DD"));
    }
  }, [formValuesForUser?.requestType]);
  useEffect(() => {
    if (formValuesForGroup?.requestType) {
      setValueForGroup("startDate", moment().format("YYYY-MM-DD"));
    }
  }, [formValuesForGroup?.requestType]);

  useEffect(() => {
    if (selectedManager?.value) {
      setValueForGroup("manager", selectedManager?.value);
      triggerForGroup("manager");
    }
  }, [selectedManager]);
  useEffect(() => {
    if (selectedUser?.value) {
      setValueForUser("assignTo", selectedUser?.value);
      triggerForUser("assignTo");
    }
  }, [selectedUser]);

  const handleFileInputChangeForUser = (event: any) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    setSelectedFileForAttachmentUser(file);
    event.target.value = "";
  };

  const handleFileInputChangeForGroup = (event: any) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    setSelectedFileForAttachmentGroup(file);
    event.target.value = "";
  };

  let handleAssignForUser = (formValues: AssignmentUserRequestProps) => {
    if (selectedFileForAttachmentUser && !validateFile(selectedFileForAttachmentUser)) {
      return;
    }

    let data = {
      comment: "",
      action: 16,
      requestInstanceId,
      // attachments: selectedFileForAttachmentUser,
      description: formValues?.description,
      // endDate: moment(formValues?.endDate).toISOString(),
      actionTakerId: formValues?.assignTo,
      groupAssginActionTackers: [],
      stepId,
      attachmentsForUserOrGroup: selectedFileForAttachmentUser,
    };
    setLoading(true);
    dispatch(postRequestTransaction(data) as any).then((res: any) => {
      setLoading(false);
      if (res?.payload?.statusEnum == 1) {
        showAlert(true, "AddedSuccessfully", intl, () => {
          const actionUrl = `/user-profile/requests/${res?.payload?.result}/details-for-assign`;
          const reportid = res?.payload?.result;
          const requestDate = incomingRequestDetails?.date;
          const requestName = incomingRequestDetails?.name;
          const requestType = incomingRequestDetails?.requestCategoryName;
         const requestNumber =incomingRequestDetails?.requestNumber;

          const assignUserEmail = assignUsers?.find((user:any) => {
            return user?.userId == formValues?.assignTo;
          })?.email as string;
          const assignUserId = assignUsers?.find((user:any) => {
            return user?.userId == formValues?.assignTo;
          })?.userId as string;
          Notification.attributionRequest(
            assignUserId,
            actionUrl,
            89,
            reportid,
            assignUserEmail,
            true,
            26,
            requestDate,
            requestName,
            requestType,
            "",
            "",
            "" ,
           requestNumber,

          );
          navigate(
            systemId
              ? `/approvals-requests/${systemId}?tabName=IncomingRequests`
              : `/approvals-requests?tabName=IncomingRequests`,
            {
              state: {
                subSystemId: "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02",
                cardTitle: cardName,
              },
            }
          );
          localStorage.setItem(
            "subSystemId",
            "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02"
          );
        });
      } else if (
        res?.payload?.message ==
        "The user counted the number of tasks available to him."
      ) {
        showAlert(
          false,
          "TheUserCountedTheNumberOfTasksAvailableToHim",
          intl,
          () => {}
        );
      } else if (
        res?.payload?.message == "Must Assgin ActionTaker Take Action"
      ) {
        handleClose();
        showAlert(false, "MustAssginActionTakerTakeAction", intl, () => {});
      } else if (res?.payload?.message == "The Current User Not Authorized") {
        handleClose();
        showAlert(
          false,
          "UserDoesn'tHaveAbilityToTakeActionForThisStep",
          intl,
          () => {}
        );
        return;
      } else if (
        res?.payload?.message ==
        "this Assgin Request Transaction not allow take action"
      ) {
        handleClose();
        showAlert(
          false,
          "UserDoesn'tHaveAbilityToTakeActionForThisStep",
          intl,
          () => {}
        );
        return;
      } else if (
        res?.payload?.message == "This Request Instance Reached Final Step"
      ) {
        handleClose();
        showAlert(false, "ThisRequestInstanceReachedFinalStep", intl, () => {});
        return;
      } else if (res?.payload?.message == "must Enter AssginRequestInstance") {
        handleClose();
        showAlert(false, "MustEnterAssginRequestInstance", intl, () => {});

        return;
      } else if (res?.payload?.message == "no assginRequestTemplateStep") {
        handleClose();
        showAlert(false, "NoAssginRequestTemplateStep", intl, () => {});

        return;
      } else {
        showAlert(false, "AnErrorOccured", intl, () => {});
        handleClose();
      }
    });
  };

  let handleAssignForGroup = (formValues: AssignmentGroupRequestProps) => {
    if (selectedFileForAttachmentGroup && !validateFile(selectedFileForAttachmentGroup)) {
      return;
    }

    let data = {
      comment: "",
      action: 16,
      requestInstanceId,
      // attachments: selectedFileForAttachmentGroup,
      description: formValues?.description,
      // endDate: moment(formValues?.endDate).toISOString(),
      actionTakerId: formValues?.manager,
      groupAssginActionTackers: userIds,
      stepId,
      attachmentsForUserOrGroup: selectedFileForAttachmentGroup,
    };
    if (userIds?.length == 0) {
      showAlert(false, "YouMustSelectUserAtLeastForGroup", intl, () => {});
    } else {
      setLoading(true);
      dispatch(postRequestTransaction(data) as any).then((res: any) => {
        setLoading(false);
        if (res?.payload?.statusEnum == 1) {
          showAlert(true, "AddedSuccessfully", intl, () => {
            const actionUrl = `/user-profile/requests/${res?.payload?.result}/details-for-assign`;
            const reportid = res?.payload?.result;
            const requestDate = incomingRequestDetails?.date;
            const requestName = incomingRequestDetails?.name;
             const requestNumber =incomingRequestDetails?.requestNumber;
            const requestType = incomingRequestDetails?.requestCategoryName;
            const assignUserEmail = assignUsers?.find((user:any) => {
              return user?.userId == formValues?.manager;
            })?.email as string;
            const assignUserId = assignUsers?.find((user:any) => {
              return user?.userId == formValues?.manager;
            })?.userId as string;
            Notification.attributionRequest(
              assignUserId,
              actionUrl,
              89,
              reportid,
              assignUserEmail,
              true,
              26,
              requestDate,
              requestName,
              requestType,
              "",
              "",
              "",
              requestNumber,
            );
            userIds?.forEach((id: any) => {
              const actionUrl = `/user-profile/requests/${res?.payload?.result}/details-for-assign`;
              const reportid = res?.payload?.result;
              const requestDate = incomingRequestDetails?.date;
              const requestName = incomingRequestDetails?.name;
              const requestType = incomingRequestDetails?.requestCategoryName;
              const requestNumber =incomingRequestDetails?.requestNumber;

              const assignUserEmail = assignUsers?.find((user:any) => {
                return user?.userId == id;
              })?.email as string;
              const assignUserId = assignUsers?.find((user:any) => {
                return user?.userId == id;
              })?.userId as string;
              Notification.attributionRequest(
                assignUserId,
                actionUrl,
                89,
                reportid,
                assignUserEmail,
                true,
                26,
                requestDate,
                requestName,
                requestType,
                "",
                "",
                "",
                requestNumber,

              );
            });
            navigate(
              systemId
                ? `/approvals-requests/${systemId}?tabName=IncomingRequests`
                : `/approvals-requeststabName=IncomingRequests`,
              {
                state: {
                  subSystemId: "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02",
                  cardTitle: cardName,
                },
              }
            );
            localStorage.setItem(
              "subSystemId",
              "20d0f22b-6a6e-42e5-999c-aaaa7f4d1d02"
            );
          });
        } else if (
          res?.payload?.message ==
          "The user counted the number of tasks available to him."
        ) {
          showAlert(
            false,
            "TheUserCountedTheNumberOfTasksAvailableToHim",
            intl,
            () => {}
          );
        } else if (
          res?.payload?.message == "This Request Instance Reached Final Step"
        ) {
          showAlert(
            false,
            "ThisRequestInstanceReachedFinalStep",
            intl,
            () => {}
          );
        } else if (
          res?.payload?.message == "must Enter AssginRequestInstance"
        ) {
          handleClose();
          showAlert(false, "MustEnterAssginRequestInstance", intl, () => {});

          return;
        } else if (res?.payload?.message == "no assginRequestTemplateStep") {
          handleClose();
          showAlert(false, "NoAssginRequestTemplateStep", intl, () => {});

          return;
        } else {
          showAlert(false, "AnErrorOccured", intl, () => {});
        }
      });
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
                  <h3>{intl.formatMessage({ id: "Assignment" })}</h3>
                </div>
              </Modal.Title>
            </Row>
          </div>
        </Modal.Header>
        <form
          onSubmit={
            requestType == "Group"
              ? handleSubmitForGroup(handleAssignForGroup)
              : handleSubmitForUser(handleAssignForUser)
          }
        >
          <Modal.Body className="pb-0">
            <Row className="justify-content-center mb-5">
              <div className="col-lg-12 mb-4 pt-3">
                <label
                  htmlFor="requestType"
                  className="form-label px-2 fontSz-6 required"
                >
                  {intl.formatMessage({ id: "RequestType" })}
                </label>
                <div className="d-flex">
                  <div className="form-check me-4">
                    <label className="form-check-label" htmlFor="individual">
                      {intl.formatMessage({ id: "Individual" })}
                    </label>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="requestType"
                      id="individual"
                      value="Individual"
                      checked={requestType === "Individual"}
                      onChange={handleRequestTypeChange}
                    />
                  </div>
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="group">
                      {intl.formatMessage({ id: "Group" })}
                    </label>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="requestType"
                      id="group"
                      value="Group"
                      checked={requestType === "Group"}
                      onChange={handleRequestTypeChange}
                    />
                  </div>
                </div>
              </div>
              {requestType == "Individual" ? (
                <>
                  <div className="col-lg-12 mb-4 pt-3">
                    <label
                      htmlFor="AssignTo"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "AssignTo" })}
                    </label>
                    <Controller
                      name="assignTo" // change later
                      control={controlForUser}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="userName"
                          className="react-select__container"
                          classNamePrefix="react-select"
                          placeholder={intl.formatMessage({
                            id: "SelectUserName",
                          })}
                          options={userOptions}
                          isClearable={true}
                          onChange={(selectedOption) =>
                            setSelectedUser(selectedOption)
                          }
                          value={selectedUser}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "NotAvailableUserName",
                            })
                          }
                          // filterOption={(option, inputValue) => {
                          //   const input = inputValue.toLowerCase();
                          //   return (
                          //     option.userName?.toLowerCase().includes(input) ||
                          //     option.fullName?.toLowerCase().includes(input)
                          //   );
                          // }}
                        />
                      )}
                    />
                    {DisplayErrorMessage(
                      errorsForUser?.assignTo?.message as string,
                      intl,
                      language
                    )}
                  </div>
                  <div className="col-lg-12 mb-4 pt-3">
                    <label
                      htmlFor="AssignDescription"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "Description" })}
                    </label>
                    <textarea
                      rows={4}
                      id="AssignDescription"
                      {...registerForUser("description")}
                      className="form-control form-control-solid mb-lg-2"
                      placeholder={intl.formatMessage({ id: "Description" })}
                    ></textarea>
                    {DisplayErrorMessage(
                      errorsForUser?.description?.message as string,
                      intl,
                      language
                    )}
                  </div>

                  <div className="col-lg-12 mb-2 pt-2">
                    <div className="col-lg-12 mb-2 pt-2 pb-3">
                      <label className="form-label px-2  fontSz-6">
                        {intl.formatMessage({ id: "ATTACHMENTS" })}
                      </label>
                      <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-5 h-80px">
                        <label
                          htmlFor="outputAttachment1"
                          style={{ overflow: "hidden" }}
                          className="form-label  dropzone-select  uploadFile-style inputAreaHeight"
                        >
                          <div
                            role="button"
                            className="d-flex align-items-center"
                          >
                            {selectedFileForAttachmentUser ? (
                              <>
                                <div>
                                  <ul className="d-flex align-items-center">
                                    <li className="d-flex align-items-center mx-1 position-relative">
                                      <img
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "50%",
                                        }}
                                        alt={
                                          selectedFileForAttachmentUser?.name
                                        }
                                        src={getIconSrc(
                                          selectedFileForAttachmentUser?.name,
                                          selectedFileForAttachmentUser,
                                          ""
                                        )}
                                        className={
                                          selectedFileForAttachmentUser?.name
                                        }
                                      />
                                      <div className="mx-1">
                                        {selectedFileForAttachmentUser?.name}
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  style={{
                                    width: "40px",
                                    display: "inline-block",
                                    marginLeft: "5px",
                                  }}
                                  src={toAbsoluteUrl(
                                    "/media/extensions/uploadFile.webp"
                                  )}
                                  className="img-fluid"
                                />
                                <div
                                  className="row py-auto"
                                  style={{ position: "relative", top: "-7px" }}
                                >
                                  <span className="text-primary fw-bolder">
                                    {intl.formatMessage({
                                      id: "QuickFileUploader",
                                    })}
                                  </span>
                                  <span>
                                    {" "}
                                    {intl.formatMessage({
                                      id: "DragAndDropOrChooseFilesFromComputer",
                                    })}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                        <div
                          className="dropzone dropzone-queue "
                          id="kt_dropzonejs_example_3"
                        >
                          <div className="dropzone-panel">
                            <input
                              type="file"
                              id="outputAttachment1"
                              name="attachments1"
                              onChange={handleFileInputChangeForUser}
                              placeholder={intl.formatMessage({
                                id: "FileUpload",
                              })}
                              className="dropzone-select  uploadFile-style inputAreaHeight d-none w-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {requestType === "Group" && (
                <>
                  <div className="col-lg-12 mb-4 pt-3">
                    <label
                      htmlFor="groupManager"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "GroupManager" })}
                    </label>

                    <Controller
                      name="manager" // change later
                      control={controlForGroup}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          id="ManagerName"
                          className="react-select__container"
                          classNamePrefix="react-select"
                          placeholder={intl.formatMessage({
                            id: "SelectManagerName",
                          })}
                          options={options}
                          isClearable={true}
                          onChange={(selectedOption) =>
                            setSelectedManager(selectedOption)
                          }
                          value={selectedManager}
                          noOptionsMessage={() =>
                            intl.formatMessage({
                              id: "NotAvailableUserName",
                            })
                          }
                          // filterOption={(option, inputValue) => {
                          //   const input = inputValue.toLowerCase();
                          //   return (
                          //     option.userName?.toLowerCase().includes(input) ||
                          //     option.fullName?.toLowerCase().includes(input)
                          //   );
                          // }}
                        />
                      )}
                    />
                    {DisplayErrorMessage(
                      errorsForGroup?.manager?.message as string,
                      intl,
                      language
                    )}
                  </div>

                  <div className="col-lg-12 mb-4 pt-3">
                    <label
                      htmlFor="members"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "Members" })}
                    </label>
                    <CheckBoxDropDown
                      selectedOptions={selectedUsers}
                      setSelectedOptions={setSelectedUsers}
                      options={assignUsers
                        ?.filter((ele) => {
                          return ele?.userId != selectedManager?.value;
                        })
                        ?.filter((ele) => {
                          return ele?.userId != loggedUserId;
                        })
                        ?.map((user) => {
                          return { id: user?.userId, name: user?.userName };
                        })}
                      selectedIds={userIds}
                      setSelectedIds={setUserIds}
                    />
                  </div>
                  <div className="col-lg-12 mb-4 pt-3">
                    <label
                      htmlFor="AssignDescription"
                      className="form-label px-2 fontSz-6 required"
                    >
                      {intl.formatMessage({ id: "Description" })}
                    </label>
                    <textarea
                      rows={4}
                      id="AssignDescription"
                      className="form-control form-control-solid mb-lg-2"
                      placeholder={intl.formatMessage({ id: "Description" })}
                      {...registerForGroup("description")}
                    ></textarea>
                    {DisplayErrorMessage(
                      errorsForGroup?.description?.message as string,
                      intl,
                      language
                    )}
                  </div>

                  <div className="col-lg-12 mb-2 pt-2">
                    <div className="col-lg-12 mb-2 pt-2 pb-3">
                      <label className="form-label px-2  fontSz-6">
                        {intl.formatMessage({ id: "ATTACHMENTS" })}
                      </label>
                      <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-5 h-80px">
                        <label
                          htmlFor="outputAttachment1"
                          style={{ overflow: "hidden" }}
                          className="form-label  dropzone-select  uploadFile-style inputAreaHeight"
                        >
                          <div
                            role="button"
                            className="d-flex align-items-center"
                          >
                            {selectedFileForAttachmentGroup ? (
                              <>
                                <div>
                                  <ul className="d-flex align-items-center">
                                    <li className="d-flex align-items-center mx-1 position-relative">
                                      <img
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "50%",
                                        }}
                                        alt={
                                          selectedFileForAttachmentGroup?.name
                                        }
                                        src={getIconSrc(
                                          selectedFileForAttachmentGroup?.name,
                                          selectedFileForAttachmentGroup,
                                          ""
                                        )}
                                      />
                                      <div className="mx-1">
                                        {selectedFileForAttachmentGroup?.name}
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </>
                            ) : (
                              <>
                                <img
                                  style={{
                                    width: "40px",
                                    display: "inline-block",
                                    marginLeft: "5px",
                                  }}
                                  src={toAbsoluteUrl(
                                    "/media/extensions/uploadFile.webp"
                                  )}
                                  className="img-fluid"
                                  alt=""
                                />
                                <div
                                  className="row py-auto"
                                  style={{ position: "relative", top: "-7px" }}
                                >
                                  <span className="text-primary fw-bolder">
                                    {intl.formatMessage({
                                      id: "QuickFileUploader",
                                    })}
                                  </span>
                                  <span>
                                    {" "}
                                    {intl.formatMessage({
                                      id: "DragAndDropOrChooseFilesFromComputer",
                                    })}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </label>
                        <div
                          className="dropzone dropzone-queue "
                          id="kt_dropzonejs_example_3"
                        >
                          <div className="dropzone-panel">
                            <input
                              type="file"
                              id="outputAttachment1"
                              name="attachments1"
                              onChange={handleFileInputChangeForGroup}
                              placeholder={intl.formatMessage({
                                id: "FileUpload",
                              })}
                              className="dropzone-select  uploadFile-style inputAreaHeight d-none w-100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                      {intl.formatMessage({ id: "Cancel" })}
                    </button>

                    {loading ? (
                      <Button variant="success" disabled className="px-15 w-75 min-w-300px">
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
                        className="btn btn-success me-5 w-100"
                      >
                        <span className="indicator-label">
                          {intl.formatMessage({ id: "Send" })}
                        </span>
                        <span className="indicator-progress">
                          {intl.formatMessage({ id: "Acceptance" })}
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