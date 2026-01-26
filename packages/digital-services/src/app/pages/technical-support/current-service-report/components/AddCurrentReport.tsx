import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { truncate } from "@4eplatform/shared/functions/truncateText";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AddPopup } from "../../../partials/AddPopup";
import AddAttachmentTab from "./AddAttachmentTab";
import { Tab } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { isValidJson } from "@4eplatform/shared/functions/isValidJson";
import {
  fetchRequestTimeline,
  getAllReports,
  getIncomingRequestsById,
  addReport,
} from "../../../../redux/features/report/reportSlice";
import { RootState } from "../../../../redux/store/store";
import {
  fetchMainClassificationTree,
  fetchMainClassificationtTitleById,
} from "../../../../redux/features/mainClassification/mainClassificationTreeSlice";
import { Category } from "../../../../models/CategoryModel";
import Swal from "sweetalert2";
import {
  fetchItemById,
  getWorkSpaceById,
} from "../../../../redux/features/item/itemByIdSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  reportModelProps,
  validationReportModelSchema,
} from "./../../../../validations/ValidationReportModel";
import { Notification } from "@4eplatform/shared/services/notifications";
import moment from "moment";
import { fetchItemRequesters } from "../../../../redux/features/item/itemRequestersSlice";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import axios from "axios";
import DynamicForm from "../../../partials/dynamic-form/DynamicForm";
import { Button, Spinner } from "react-bootstrap";

const useEffectAllDepsChange = (fn: any, deps: any) => {
  const [changeTarget, setChangeTarget] = useState(deps);

  useEffect(() => {
    setChangeTarget((prev: any) => {
      if (prev.every((dep: any, i: number) => dep !== deps[i])) {
        return deps;
      }

      return prev;
    });
  }, [deps]);

  useEffect(fn, changeTarget);
};

const AddCurrentReport = ({ setPageTitle }: any) => {
  let intl = useIntl();
  let language: string = intl.locale;
  let location = useLocation();
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [sourceReports, setsourceReports] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { id }: any = useParams();
  const report = useSelector((state: RootState) => state.report.currentReport);
  const [serviceCatalog, setServiceCatalog] = useState<any>({});
  const [category, setCategory] = useState<any>({});
  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let [loading, setLoading] = useState(false);
  const [questionsList, setQuestionsList] = useState<any>([]);
  const [requestId, setRequestId] = useState<string>("");

  const [actionUrl, setActionUrl] = useState<string>("");
  const [reportId, setReportId] = useState<string>("");
  const [approvalAcceptRequesterEmail, setApprovalAcceptRequesterEmail] =
    useState<string>("");
  const [approvalAcceptRequesterId, setApprovalAcceptRequesterId] =
    useState<string>("");
  const [requestName, setRequestName] = useState<string>("");
  const [requestType, setRequestType] = useState<string>("");
  const [requestDate, setRequestDate] = useState<string>("");
  const [requestNumber, setRequestNumber] = useState<string>("");
  const [itemById, setItemById] = useState<any>([]);
  const [itemRequesters, setItemRequesters] = useState<any>([]);
  const [serviceEndpoint, setServiceEndpoint] = useState<null | []>(null);
  const [isSystemsIntegration, setIsSystemsIntegration] =
    useState<boolean>(false);
  let [searchParams, setSearchParams] = useSearchParams();

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<reportModelProps>({
    resolver: yupResolver(validationReportModelSchema),
    mode: "all",
    reValidateMode: "onChange",
  });
  let formValues = watch();
  const reportName = formValues.ReportTitle;
  const reportType = serviceCatalog.name;

  const mainClassificationTree = useSelector(
    (state: RootState) => state.mainClassificationTree.data,
  );
  const mainClassificationtTitleById = useSelector((state: RootState) => {
    return (
      state?.mainClassificationTree?.titlesData?.[0] ||
      state?.mainClassificationTree?.titlesData[0]
    );
  });

  const mainClassificationtTitle =
    intl.locale == "ar"
      ? useSelector((state: RootState) => {
          return (
            state?.mainClassificationTree?.titlesData?.[0] ||
            state?.mainClassificationTree?.titlesData[0]
          )?.title;
        })
      : useSelector((state: RootState) => {
          return (
            state?.mainClassificationTree?.titlesData?.[0] ||
            state?.mainClassificationTree?.titlesData[0]
          )?.titleEn;
        });

  useEffect(() => {
    if (mainClassificationtTitle) {
      setPageTitle(mainClassificationtTitle);
    }
  }, [mainClassificationtTitle, setPageTitle]);

  const serviceCatalogHandler = () => {
    const catalogId =
      report.ServiceCatalogId ||
      location?.state?.ServiceCatalogId ||
      searchParams.get("serviceCatalogId");

    let serviceCatalogData = mainClassificationTree?.serviceCatalogs.filter(
      (catalogs: any) => catalogs.id == catalogId,
    )[0];

    let serviceCatalogDataFiltrerd = serviceCatalogData?.categories?.filter(
      (cate: any) => cate?.serviceType === 1 || cate?.serviceType === 3,
    );

    if (serviceCatalogDataFiltrerd) {
      setServiceCatalog(serviceCatalogData);
      if (serviceCatalogDataFiltrerd.length) {
        setCategories(serviceCatalogDataFiltrerd);
        setCategory(serviceCatalogDataFiltrerd?.[0]);
        setValue("CategoryId", serviceCatalogDataFiltrerd[0].id);
      }
    }
  };

  useEffect(() => {
    const data = {
      mainClassificationId: id,
      serviceType: 3,
    };
    dispatch(fetchMainClassificationTree(id) as any);
    dispatch(fetchMainClassificationtTitleById(data) as any);
  }, [id]);

  useEffect(() => {
    serviceCatalogHandler();
  }, [mainClassificationTree]);

  let itemDynamicFormm = useSelector((state: RootState) => {
    return formValues.ItemId === "" || formValues.ItemId === undefined
      ? null
      : state?.itemById?.data?.result?.dynamicForm;
  });
  let itemData = useSelector((state: RootState) => {
    return state?.itemById?.data?.result;
  });
  let workspaceByIdData = useSelector((state: RootState) => {
    return state?.itemById?.workspaceByIdData;
  });

  // let itemRequesters = useSelector((state: RootState) => {
  //   return state?.itemRequesters?.data;
  // });

  useEffect(() => {
    const fetchData = async () => {
      if (formValues.ItemId) {
        try {
          await dispatch(fetchItemById(formValues.ItemId) as any).then(
            (res: any) => {
              setItemById(res?.payload?.result);
              setIsSystemsIntegration(
                res?.payload?.result?.isIintegrated || false,
              );

              if (res?.payload?.result?.isIintegrated) {
                dispatch(
                  getWorkSpaceById(
                    res?.payload?.result?.workspaceServiceID
                      ? res?.payload?.result?.workspaceServiceID
                      : "",
                  ) as any,
                ).then(async (res: any) => {
                  const endPoint =
                    workspaceByIdData?.endPoint ||
                    res?.payload?.result?.endPoint;

                  if (endPoint) {
                    const formatUrl = () => {
                      if (!endPoint.startsWith("http")) {
                        return `${
                          (window as any)._env_?.REACT_APP_API_Base_Url
                        }:${endPoint}`;
                      }
                      return endPoint;
                    };

                    try {
                      const apiUrl = formatUrl();
                      const headers = {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token",
                        )}`,
                      };

                      const response = await axios.get(apiUrl, { headers });
                      setServiceEndpoint(response?.data?.result);
                    } catch (error) {
                      console.error("Error fetching service endpoint:", error);
                    }
                  }
                });
              }
            },
          );
          await dispatch(
            fetchItemRequesters({
              id: formValues.ItemId,
              params: { pageSize: 10000, pageNumber: 1 },
            }) as any,
          ).then((res: any) => setItemRequesters(res?.payload?.result));
        } catch (error) {}
      }
    };
    fetchData();
  }, [formValues.ItemId, workspaceByIdData?.endPoint]);

  useEffect(() => {
    dispatch(getAllReports() as any);
  }, []);

  useEffect(() => {
    if (category?.subCategories?.length) {
      setSubCategories(category.subCategories);
      setValue("ReportSubCategory", category?.subCategories[0].id);
    } else {
      setSubCategories([]);
    }

    if (category?.items?.length) {
      setItems(category.items);
      setValue("ItemId", "");
    } else {
      setItems([]);
    }
  }, [category]);

  const handleCategoryChange = (event: any) => {
    const selectedId = event.target.value;
    const selectedCategory = categories.find(
      (category: any) => category.id === selectedId,
    );
    setValue("CategoryId", selectedId);
    setCategory(selectedCategory);
  };

  let [activeAttachment, setActiveAttchment] = useState(true);
  let [activeLink, setActiveLink] = useState(false);

  let activeAttchmentHandler = () => {
    setActiveAttchment(true);
    setActiveLink(false);
  };

  const getFormattedMessage = (defaultTitleMessage?: string) => {
    return defaultTitleMessage
      ? intl.formatMessage({ id: defaultTitleMessage })
      : "";
  };

  const [itemDynamicForm, setItemDynamicForm] = useState<any>("");

  useEffect(() => {
    const fetchData = async () => {
      if (requestId) {
        await dispatch(getIncomingRequestsById(requestId) as any);
        await dispatch(fetchRequestTimeline({ id: requestId }) as any).then(
          (result: any) => {
            setApprovalAcceptRequesterEmail(
              result?.payload?.result?.requestTimeLine?.filter((item: any) => {
                return !item?.exceptionActionTackersDto
                  ?.map((user: any) => {
                    return user?.userId?.toLowerCase();
                  })
                  ?.includes(item?.actionTakerUserId?.toLowerCase());
              })[0]?.actionTakerEmail,
            );
            setApprovalAcceptRequesterId(
              result?.payload?.result?.requestTimeLine?.filter((item: any) => {
                return !item?.exceptionActionTackersDto
                  ?.map((user: any) => {
                    return user?.userId?.toLowerCase();
                  })
                  ?.includes(item?.actionTakerUserId?.toLowerCase());
              })[0]?.actionTakerUserId,
            );
          },
        );
      }
    };

    fetchData();
  }, [requestId]);

  const incomingRequestDetails = useSelector((state: RootState) => {
    return state?.report?.incomingRequest;
  });

  const requestTimeline = useSelector((state: RootState) => {
    return state?.requestTimeline?.data;
  });

  useEffect(() => {
    setRequestName(incomingRequestDetails?.name);
    setRequestType(incomingRequestDetails?.requestCategoryName);
    setRequestDate(moment(incomingRequestDetails?.date).format("LLL"));
    setRequestNumber(incomingRequestDetails?.requestNumber);
  }, [incomingRequestDetails]);

  // let mainclassificationId = incomingRequestDetails?.mainClassificationId;

  useEffect(() => {
    if (approvalAcceptRequesterEmail) {
      Notification.addingRequest(
        approvalAcceptRequesterId?.toLowerCase(),
        actionUrl,
        89,
        reportId,
        approvalAcceptRequesterEmail,
        true,
        26,
        requestDate,
        requestName,
        requestType,
        "",
        "",
        id,
        requestNumber,
      );
    }
  }, [approvalAcceptRequesterEmail]);

  const localStorageUserId = localStorage.getItem("userId");

  useEffectAllDepsChange(() => {
    if (
      !itemById?.canBeRequestedByAllUsers &&
      itemRequesters.length &&
      !itemRequesters?.some(
        (itemReq: any) => itemReq?.userId === localStorageUserId,
      )
    ) {
      Swal.fire({
        text: intl.formatMessage({ id: "YouHaveNoPermission" }),
        icon: "warning",
        heightAuto: false,
        buttonsStyling: false,
        confirmButtonText: intl.formatMessage({ id: "Agree" }),
        customClass: {
          confirmButton: "btn btn-warning",
        },
      });
    }
  }, [itemById, itemRequesters]);

  const navigate = useNavigate();
  const submitHandler = async () => {
    const isValid = await trigger();
    if (isValid) {
      let dynamicForm = document.getElementById(
        "dynamic_form",
      ) as HTMLFormElement;

      let errorMessages: { name: string; message: string }[] = [];
      let isAnyChecked: any = [];

      if (dynamicForm) {
        for (let i = 0; i < dynamicForm?.elements?.length; i++) {
          let inputElement = dynamicForm?.elements[i] as
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement;

          if (
            inputElement instanceof HTMLInputElement ||
            inputElement instanceof HTMLSelectElement ||
            inputElement instanceof HTMLTextAreaElement
          ) {
            if (!inputElement.checkValidity()) {
              if (!errorMessages.some((obj) => obj.name === inputElement.name))
                errorMessages.push({
                  name: inputElement.name,
                  message: inputElement.validationMessage,
                });
            }
          }
        }

        if (dynamicForm && !dynamicForm?.checkValidity()) {
          if (errorMessages.length > 0) {
            isAnyChecked = Array(errorMessages.length).fill(false);

            errorMessages.map((err: any, index: number) => {
              let checkboxes = document.getElementsByName(
                err.name,
              ) as NodeListOf<HTMLInputElement>;

              for (let i = 0; i < checkboxes.length; i++) {
                let checkbox = checkboxes[i];

                if (checkbox.checked) {
                  isAnyChecked[index] = true;
                }
              }
            });
            if (!isAnyChecked.every((value: any) => value === true)) {
              showAlert(false, "YouMustFillRequiredInputs", intl);
              return;
            }
          } else {
            showAlert(false, "YouMustFillRequiredInputs", intl);

            return;
          }
        }
      }

      setIsLoading(true);

      let formData = new FormData();
      let data = watch();
      data.MainClassificationId = mainClassificationTree.id;
      data.ServiceCatalogId = serviceCatalog.id;
      data.TechnicianId = mainClassificationTree.id;
      data.RequesterForm = JSON.stringify(questionsList);

      const dataWithIndexSignature = data as { [key: string]: any };
      Object.keys(dataWithIndexSignature).forEach((key) => {
        formData.append(key, dataWithIndexSignature[key]);
      });
      attachments.forEach((file, index) => {
        formData.append("AttachmentDTOs", file);
      });
      if (sourceReports?.length > 0) {
        for (let index = 0; index < sourceReports?.length; index++) {
          formData.append("SourceReports", sourceReports[index]);
        }
      }
      const MAX_TOTAL_SIZE_MB = 30;
      const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

      let totalSize = 0;

      attachments?.forEach((file) => {
        totalSize += file.size;
      });

      if (totalSize > MAX_TOTAL_SIZE_BYTES) {
        showAlert(false, "FilesIsTooLarge", intl);
        setIsLoading(false);
        return;
      }
      setLoading(true);
      await dispatch(addReport(formData) as any)
        .then((result: any) => {
          const payload = result?.payload;

          const isPayloadTooLarge =
            (payload?.status === 400 || payload?.status === 413) &&
            payload?.errors?.[""]?.[0]?.includes("Request body too large");

          if (isPayloadTooLarge) {
            showAlert(false, "FilesIsTooLarge", intl);
            setIsLoading(false);
            setLoading(false);
            return;
          }
          const isReportTitleContainInValidTags =
            (payload?.status === 400 &&
              payload?.errors?.["ReportTitle"]?.[0]?.includes("script tags")) ||
            payload?.errors?.["ReportTitle"]?.[0]?.includes("CSV tags.") ||
            payload?.errors?.["ReportTitle"]?.[0]?.includes("HTML");

          if (isReportTitleContainInValidTags) {
            showAlert(false, "YouMustn'tEnterCodeSymbolsForReportTitle", intl);
            setIsLoading(false);
            setLoading(false);
            return;
          }
          if (
            result.payload.statusEnum === 3 &&
            result?.payload?.result?.requestInstanceId === ""
          ) {
            if (
              requestTimeline?.serviceType != 11 &&
              requestTimeline?.serviceType != 12
            ) {
              Notification.received(
                result?.payload?.result.technicianId,
                `/digialservicesmanagement/technical-support-feedbacks-employee/${result.payload.result?.reportId}/details`,
                89,
                result?.payload?.result.reportId,
                result?.payload?.result.email,
                true,
                31,
                requestDate,
                reportName,
                reportType,
                "",
                "",
                id,
                requestNumber,
              );
            }
            showAlert(true, "AddedSuccessfully", intl, () => {
              if (result.isConfirmed) {
                navigate(-1);
              } else {
                setTimeout(() => {
                  navigate(-1);
                }, 200);
              }
            });
          } else if (result.payload.statusEnum === 3) {
            setIsLoading(false);
            showAlert(true, "SavedSuccessfully", intl, () => {
              if (result.isConfirmed) {
                navigate(-1);
              } else {
                setTimeout(() => {
                  navigate(-1);
                }, 200);
              }
            });
            setRequestId(result?.payload?.result?.requestInstanceId);
            setActionUrl(
              `/user-profile/requests/${result.payload.result.requestInstanceId}/details-for-incoming`,
            );
            setReportId(result.payload.result.requestInstanceId);
          } else if (
            result?.payload?.message ==
            "YouAreNotAllowed,PleaseConsultYourManager!"
          ) {
            showAlert(false, "NotAllowed", intl);
          } else {
            showAlert(false, "AnErrorOccured", intl);
            setIsLoading(false);
          }
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  };

  let [changed, setChanged] = useState<number>(0);
  let [formState, setFormState] = useState<any>("");

  useEffect(() => {
    setItemDynamicForm(itemDynamicFormm);
    setChanged(Math.random() * 1000);
  }, [itemDynamicFormm]);

  useEffect(() => {
    if (
      !isBase64(itemDynamicForm) &&
      itemDynamicForm != null &&
      isValidJson(itemDynamicForm)
    ) {
      setFormState((prev: any) => {
        return (
          <>
            <DynamicForm
              rerender={changed}
              setQuestionsList={setQuestionsList}
              formInputs={JSON.parse(itemDynamicForm as string)}
            />
          </>
        );
      });
    } else {
      setFormState("");
    }
  }, [itemDynamicForm, changed]);

  function isBase64(value: any) {
    try {
      return btoa(atob(value)) === value;
    } catch (e) {
      return false;
    }
  }
  return (
    <Fragment>
      <div className="card shadow p-8 mb-7 ">
        <div className="mb-6">
          <p className="fw-bolder fs-4 text-dark mb-4">
            {" "}
            {intl.locale == "ar"
              ? mainClassificationtTitleById?.title ||
                intl.formatMessage({ id: "AddNewReport" })
              : mainClassificationtTitleById?.titleEn ||
                intl.formatMessage({ id: "AddNewReport" })}
          </p>
          <p className="text-muted fs-7">
            {intl.formatMessage({ id: "PleaseEnterTheFollowingData" })}
          </p>
        </div>
        <hr className="mb-4" />

        <div className="row mb-4">
          <div className="col-sm-12 col-lg-6">
            <div className="mb-2 pt-2 pb-3 ">
              <label
                htmlFor={"ReportTitle"}
                className="form-label px-2 fontSz-6 required"
              >
                {(
                  intl.locale == "ar"
                    ? mainClassificationtTitleById?.titleDescription
                    : mainClassificationtTitleById?.titleDescriptionEn
                )
                  ? intl.locale == "ar"
                    ? mainClassificationtTitleById?.titleDescription
                    : mainClassificationtTitleById?.titleDescriptionEn
                  : getFormattedMessage("ReportTitle")}
              </label>
              <div className="input-group mt-1">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-clipboard-list special"></i>
                  </span>
                </div>
                <input
                  id="ReportTitle"
                  type="text"
                  className="form-control"
                  placeholder={
                    (
                      intl.locale == "ar"
                        ? mainClassificationtTitleById?.titleDescription
                        : mainClassificationtTitleById?.titleDescriptionEn
                    )
                      ? intl.locale == "ar"
                        ? mainClassificationtTitleById?.titleDescription
                        : mainClassificationtTitleById?.titleDescriptionEn
                      : getFormattedMessage("ReportTitle")
                  }
                  {...register("ReportTitle")}
                />
                {DisplayErrorMessage(
                  errors?.ReportTitle?.message,
                  intl,
                  language,
                )}
              </div>
            </div>
          </div>
          {/* <div className="col-lg-6 col-sm-12">
            <div className="mb-2 pt-2 pb-3 ">
              <label
                htmlFor={"ReportTitleEn"}
                className="form-label px-2 fontSz-6 required"
              >
                {(
                  intl.locale == "en"
                    ? mainClassificationtTitleById?.titleDescriptionEn
                    : ""
                )
                  ? (intl.locale == "en"
                      ? mainClassificationtTitleById?.titleDescriptionEn
                      : "") + " "
                  : getFormattedMessage("ReportTitleEn")}
              </label>
              <div className="input-group mt-1">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-clipboard-list special"></i>
                  </span>
                </div>
                <input
                  id="ReportTitleEn"
                  type="text"
                  className="form-control"
                  placeholder={
                    (
                      intl.locale == "en"
                        ? mainClassificationtTitleById?.titleDescriptionEn
                        : ""
                    )
                      ? (intl.locale == "en"
                          ? mainClassificationtTitleById?.titleDescriptionEn
                          : "") + " "
                      : getFormattedMessage("ReportTitleEn")
                  }
                  {...register("ReportTitleEn")}
                />
                {DisplayErrorMessage(
                  errors?.ReportTitleEn?.message,
                  intl,
                  language
                )}
              </div>
            </div>
          </div> */}
        </div>

        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="mb-2 pt-2 pb-3 ">
              <label
                htmlFor="MainClassification"
                className="form-label px-2 fontSz-6 "
              >
                {intl.locale == "ar"
                  ? mainClassificationtTitleById?.mainClassificationDescription ||
                    getFormattedMessage("MainClassification")
                  : mainClassificationtTitleById?.mainClassificationDescriptionEn ||
                    getFormattedMessage("MainClassification")}
              </label>
              <div className="input-group">
                <input
                  id="MainClassification"
                  type="text"
                  className="form-control disable"
                  placeholder={
                    intl.locale == "ar"
                      ? mainClassificationtTitleById?.mainClassificationDescription ||
                        getFormattedMessage("MainClassification")
                      : mainClassificationtTitleById?.mainClassificationDescriptionEn ||
                        getFormattedMessage("MainClassification")
                  }
                  value={
                    intl.locale == "ar"
                      ? mainClassificationTree?.name ?? ""
                      : mainClassificationTree?.nameEn ?? ""
                  }
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-2 pt-2 pb-3 ">
              <label
                htmlFor="SubCategory"
                className="form-label px-2 fontSz-6 "
              >
                {intl.locale == "ar"
                  ? mainClassificationtTitleById?.catalogDescription ||
                    getFormattedMessage("SubCategory")
                  : mainClassificationtTitleById?.catalogDescriptionEn ||
                    getFormattedMessage("SubCategory")}
              </label>
              <div className="input-group">
                <input
                  id="SubCategory"
                  type="text"
                  className="form-control disable"
                  placeholder={
                    intl.locale == "ar"
                      ? mainClassificationtTitleById?.catalogDescription ||
                        getFormattedMessage("SubCategory")
                      : mainClassificationtTitleById?.catalogDescriptionEn ||
                        getFormattedMessage("SubCategory")
                  }
                  value={
                    intl.locale == "ar"
                      ? serviceCatalog?.name ?? ""
                      : serviceCatalog?.nameEn ?? ""
                  }
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="mb-2 pt-2 pb-3">
              <label
                htmlFor="ReportType"
                className="form-label px-2 fontSz-6 required"
              >
                {intl.locale == "ar"
                  ? mainClassificationtTitleById?.categoryDescription ||
                    getFormattedMessage("ServiceType")
                  : mainClassificationtTitleById?.categoryDescriptionEn ||
                    getFormattedMessage("ServiceType")}
              </label>

              <select
                id="ReportType"
                className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                data-kt-select2="true"
                data-placeholder={
                  intl.locale == "ar"
                    ? mainClassificationtTitleById?.categoryDescription ||
                      getFormattedMessage("ServiceType")
                    : mainClassificationtTitleById?.categoryDescriptionEn ||
                      getFormattedMessage("ServiceType")
                }
                data-dropdown-parent="#kt_menu_62775e8642438"
                data-allow-clear="true"
                data-select2-id="select2-data-4-vqtd"
                tabIndex={-1}
                value={category?.id}
                {...register("CategoryId")}
                onChange={handleCategoryChange}
              >
                {Array.isArray(categories) &&
                  categories
                    ?.filter(
                      (cate: any) =>
                        cate?.serviceType === 1 || cate?.serviceType === 3,
                    )
                    ?.map((category: Category) => (
                      <option key={category.id} value={category.id}>
                        {intl.locale == "ar" ? category.name : category.nameEn}
                      </option>
                    ))}
              </select>

              {DisplayErrorMessage(
                errors?.CategoryId?.message
                  ? intl.formatMessage({ id: "YouMustSelectOption" })
                  : "",
                intl,
                language,
              )}
            </div>
          </div>
          <div className="col-lg-6">
            {items.length ? (
              <div className="mb-2 pt-2 pb-3">
                <label
                  htmlFor="Country"
                  className="form-label px-2 fontSz-6 required"
                >
                  {intl.locale == "ar"
                    ? mainClassificationtTitleById?.itemDescription ||
                      getFormattedMessage("Clause")
                    : mainClassificationtTitleById?.itemDescriptionEn ||
                      getFormattedMessage("Clause")}
                </label>

                <div className=" row w-100 d-flex mx-0 justify-content-between align-items-center">
                  <div className="col-lg-12 col-md-12 col-sm-12 px-0">
                    <select
                      id="ReportItem"
                      className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                      data-kt-select2="true"
                      data-placeholder={
                        intl.locale == "ar"
                          ? mainClassificationtTitleById?.itemDescription ||
                            getFormattedMessage("Clause")
                          : mainClassificationtTitleById?.itemDescriptionEn ||
                            getFormattedMessage("Clause")
                      }
                      data-dropdown-parent="#kt_menu_62775e8642438"
                      data-allow-clear="true"
                      data-select2-id="select2-data-4-vqtd"
                      tabIndex={-1}
                      {...register("ItemId")}
                    >
                      <option value={""}>
                        {intl.formatMessage({ id: "Choose" })}
                      </option>
                      {Array.isArray(items) &&
                        items
                          ?.filter(
                            (cate: any) =>
                              cate?.serviceType === 1 ||
                              cate?.serviceType === 3,
                          )
                          ?.map((item: any, index: number) => (
                            <option value={item.id} key={item.id}>
                              {intl.locale == "ar" ? item?.name : item?.nameEn}
                            </option>
                          ))}
                    </select>
                    {DisplayErrorMessage(
                      errors?.ItemId?.message ? "YouMustSelectOption" : "",
                      intl,
                      language,
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {isSystemsIntegration ? (
            <>
              <div className="col-lg-6">
                <div className="mb-2 pt-2 pb-3">
                  <label
                    htmlFor="systemsIntegration"
                    className="form-label px-2 fontSz-6 required"
                  >
                    {getFormattedMessage("SystemsIntegration")}
                  </label>

                  <div className=" row w-100 d-flex mx-0 justify-content-between align-items-center">
                    <div className="col-lg-12 col-md-12 col-sm-12 px-0">
                      <select
                        id="systemsIntegration"
                        className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                        data-kt-select2="true"
                        data-placeholder={getFormattedMessage(
                          "SystemsIntegration",
                        )}
                        data-dropdown-parent="#kt_menu_62775e8642438"
                        data-allow-clear="true"
                        data-select2-id="select2-data-4-vqtd"
                        tabIndex={-1}
                        {...register("integretedId")}
                        onChange={(e) => {
                          const selectedOption =
                            e.target.options[e.target.selectedIndex];
                          const integrationType = selectedOption.getAttribute(
                            "data-integration-type",
                          );
                          setValue(
                            "serviceIntegration",
                            integrationType ? +integrationType : undefined,
                          );
                        }}
                      >
                        <option value={""}>
                          {intl.formatMessage({ id: "Choose" })}
                        </option>
                        {Array.isArray(serviceEndpoint) &&
                          serviceEndpoint?.map((service: any) => (
                            <option
                              data-integration-type={service.integrationType}
                              value={service.id}
                              key={service.id}
                            >
                              {(intl.locale === "ar"
                                ? truncate(service.nameAr)
                                : truncate(service.nameEn)) ||
                                truncate(service.name)}
                            </option>
                          ))}
                      </select>
                      {DisplayErrorMessage(
                        errors?.integretedId?.message
                          ? "YouMustSelectOption"
                          : "",
                        intl,
                        language,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="row mb-4 mx-0 px-0">
          <div className="col-lg-6">
            {subCategories.length ? (
              <div className="mb-2 pt-2 pb-3">
                <label
                  htmlFor="ReportSubCategory"
                  className="form-label px-2 fontSz-6"
                >
                  {getFormattedMessage("ReportSubCategory")}
                </label>

                <select
                  id="ReportSubCategory"
                  className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1 not-allowed"
                  data-kt-select2="true"
                  data-placeholder={getFormattedMessage("ReportSubCategory")}
                  data-dropdown-parent="#kt_menu_62775e8642438"
                  data-allow-clear="true"
                  data-select2-id="select2-data-4-vqtd"
                  tabIndex={-1}
                  {...register("ReportSubCategory")}
                >
                  {Array.isArray(subCategories) &&
                    subCategories?.map((item: any, index: any) => (
                      <option key={item.id} value={item.id}>
                        {intl.locale == "ar" ? item.name : item.nameEn}
                      </option>
                    ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <textarea
              className="form-control pt-4 form-control-lg form-control-solid mb-3 mb-lg-2"
              rows={3}
              placeholder={
                (
                  intl.locale == "ar"
                    ? mainClassificationtTitleById?.subjectDescription
                    : mainClassificationtTitleById?.subjectDescriptionEn
                )
                  ? intl.locale == "ar"
                    ? mainClassificationtTitleById?.subjectDescription
                    : mainClassificationtTitleById?.subjectDescriptionEn
                  : getFormattedMessage("ServiceContent") + "*"
              }
              {...register("ReportSubject")}
            ></textarea>

            {DisplayErrorMessage(
              errors?.ReportSubject?.message,
              intl,
              language,
            )}
            <br />
            <br />
            {formState}
          </div>
          <div className="col-lg-6 card shadow py-8">
            <div className="w-100">
              <div
                className="pt-5 nav row mx-auto nav-pills mb-7 background-pills d-flex justify-content-center justify-content-lg-evenly"
                id="pills-tab"
                role="tablist"
              >
                <div
                  className="nav-item col-12 col-lg-2 w-40 navTabsPills"
                  role="presentation"
                >
                  <button
                    className={`nav-link  w-fit btn d-flex btn-active-color-primary justify-content-center align-items-center rounded-0 bg-transparent border-0 ms-6 fs-6 fw-bolder border border-bottom border-white border-2 ${
                      activeAttachment ? "active" : ""
                    }`}
                    id="attachment-tab"
                    onClick={activeAttchmentHandler}
                    aria-controls="attachment"
                    style={{
                      backgroundColor: activeAttachment ? "white" : "",
                      borderRadius: activeAttachment ? "20px" : "",
                    }}
                  >
                    {intl.formatMessage({ id: "AddAttachments" })}
                  </button>
                </div>
              </div>
              <div className="tab-content px-2" id="pills-tabContent">
                <Tab.Content>
                  <Tab.Pane eventKey="attachment" active={activeAttachment}>
                    <AddAttachmentTab
                      attachments={attachments}
                      setAttachments={setAttachments}
                      active={activeAttachment}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-7 d-flex justify-content-center align-items-center w-100 mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary mx-1 text-center w-25"
          >
            {intl.formatMessage({ id: "Cancel" })}
          </button>
          {loading ? (
            <Button variant="success" disabled className="px-15 w-25">
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
            <div
              onClick={() => setModalShow(true)}
              className={`btn btn-success mx-1 text-center w-25 `}
            >
              {intl.formatMessage({ id: "Add" })}
            </div>
          )}
        </div>
      </div>
      <div className="modal fade" id="Rega_modal_add">
        <AddPopup
          submitHandler={submitHandler}
          isLoading={isLoading}
          show={modalShow}
          handleClose={() => setModalShow(false)}
        />
      </div>
    </Fragment>
  );
};

export default AddCurrentReport;
