import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { slaProps, slaSchema } from "../../../../validations/SLAValidation";
import { addSLA } from "../../../../redux/features/SLA/addSlaSlice";
import { RootState } from "../../../../redux/store/store";
import { fetchEscalationLevels } from "../../../../redux/features/SLA/escalationLevelSlice";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { getResolverById } from "../../../../redux/features/Resolver/getResolverDetailsSlice";
import { getMainClassification } from "../../../../redux/features/Resolver/getMainClassificationSlice";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Button, Spinner } from "react-bootstrap";

export const AddTechnicalAgreement: FC<any> = () => {
  const intl = useIntl();
  let [statusEnum, setStatusEnum] = useState<number>();
  let location = useLocation();
  let [loading, setLoading] = useState(false);
  let allLevels = location?.state?.allLevelss;
  const mainClassificationId = localStorage.getItem("mainClassificationId");

  const options = [
    {
      name: intl.formatMessage({
        id: "Important",
      }),
      id: 1,
    },
    {
      name: intl.formatMessage({
        id: "Urgent",
      }),
      id: 2,
    },
    {
      name: intl.formatMessage({
        id: "Normal",
      }),
      id: 3,
    },
    {
      name: intl.formatMessage({
        id: "Summary",
      }),
      id: 4,
    },
  ];
  const escalationLevels = useSelector((state: RootState) => {
    return state?.escalationLevel?.items;
  });
  let [message, setMessage] = useState<any>("");
  let language = intl.locale;
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<slaProps>({
    resolver: yupResolver(slaSchema),
    mode: "all",
    reValidateMode: "onChange",
  });
  let dispatch = useDispatch();
  useEffect(() => {
    let params: any = {
      pageSize: 100,
      pageNumber: 1,
    };
    dispatch(fetchEscalationLevels(params) as any);
  }, []);

  let mainClassification = useSelector((state: RootState) => {
    return state?.mainClassificationService.items;
  });
  let resolveReport = useSelector((state: RootState) => {
    return state?.resolverDetails.item;
  });

  const [resolveReportDetails, setresolveReportDetails] =
    useState<any>(resolveReport);

  useEffect(() => {
    if (mainClassificationId) {
      dispatch(getResolverById(mainClassificationId) as any);
      dispatch(getMainClassification() as any);
    }
  }, [mainClassificationId]);

  useEffect(() => {
    setresolveReportDetails(resolveReport);
  }, [resolveReport]);

  let [mainClassificationIds, setmainClassificationIds] = useState<string>("");

  const handleServiceCatalog = (index: string) => {
    setresolveReportDetails((prev: any) => {
      let value = index;
      let id = "";
      return {
        ...prev,
        [id]: value,
      };
    });
    setmainClassificationIds(index);
  };

  useEffect(() => {
    if (resolveReport?.mainClassificationId) {
      setmainClassificationIds(resolveReport?.mainClassificationId);
    }
  }, [resolveReport]);

  useEffect(() => {
    if (mainClassificationIds) {
      setValue("mainClassificationId", mainClassificationIds);
    }
  }, [mainClassificationIds]);

  useEffect(() => {
    setValue("implementDays", 0);
    setValue("implementHours", 0);
    setValue("implementMinutes", 0);
    setValue("respondDays", 0);
    setValue("respondHours", 0);
    setValue("respondMinutes", 0);
  }, []);
  let formValues = watch();
  const AddSla = (formValues: slaProps) => {
    const responseTimeInMinutes =
      (formValues?.respondDays ?? 0) * 24 * 60 +
      (formValues?.respondHours ?? 0) * 60 +
      (formValues?.respondMinutes ?? 0);

    const fulfillmentTimeInMinutes =
      (formValues?.implementDays ?? 0) * 24 * 60 +
      (formValues?.implementHours ?? 0) * 60 +
      (formValues?.implementMinutes ?? 0);

    if (
      formValues.respondDays == 0 &&
      formValues.respondHours == 0 &&
      formValues.respondMinutes == 0 &&
      formValues.implementDays == 0 &&
      formValues.implementHours == 0 &&
      formValues.implementMinutes == 0
    ) {
      showAlert(false, "FulfilledTime&ResponseTimeAreRequired", intl);
      return setMessage(
        intl.formatMessage({ id: "FulfilledTime&ResponseTimeAreRequired" })
      );
    } else if (
      formValues.implementDays == 0 &&
      formValues.implementHours == 0 &&
      formValues.implementMinutes == 0
    ) {
      showAlert(false, "FulfilledTimeIsRequired", intl);
      return setMessage(intl.formatMessage({ id: "FulfilledTimeIsRequired" }));
    } else if (
      formValues.respondDays == 0 &&
      formValues.respondHours == 0 &&
      formValues.respondMinutes == 0
    ) {
      showAlert(false, "ResponseTimeIsRequired", intl);
      return setMessage(intl.formatMessage({ id: "ResponseTimeIsRequired" }));
    } else if (
      ((formValues.respondDays as number) < 0 ||
        (formValues.respondHours as number) < 0 ||
        (formValues.respondMinutes as number) < 0) &&
      ((formValues.implementDays as number) < 0 ||
        (formValues.implementHours as number) < 0 ||
        (formValues.implementMinutes as number) < 0)
    ) {
      showAlert(
        false,
        "ResponseTime&FulfilledTimeMustBeInPositiveNumbers",
        intl
      );
      return setMessage(
        intl.formatMessage({
          id: "ResponseTime&FulfilledTimeMustBeInPositiveNumbers",
        })
      );
    } else if (
      (formValues.implementDays as number) < 0 ||
      (formValues.implementHours as number) < 0 ||
      (formValues.implementMinutes as number) < 0
    ) {
      showAlert(false, "FulfilledTimeMustBeInPositiveNumbers", intl);
      return setMessage(
        intl.formatMessage({ id: "FulfilledTimeMustBeInPositiveNumbers" })
      );
    } else if (
      (formValues.respondDays as number) < 0 ||
      (formValues.respondHours as number) < 0 ||
      (formValues.respondMinutes as number) < 0
    ) {
      showAlert(false, "ResponseTimeMustBeInPositiveNumbers", intl);
      return setMessage(
        intl.formatMessage({ id: "ResponseTimeMustBeInPositiveNumbers" })
      );
    } else if (responseTimeInMinutes > fulfillmentTimeInMinutes) {
      // Display an error message or handle the condition as needed
      if (language == "ar") {
        showAlert(
          false,
          "يجب ان تكون مده الاستجابه اقل من فتره تنفيذ الخدمه",
          intl
        );
        return setMessage("يجب ان تكون مده الاستجابه اقل من فتره تنفيذ الخدمه");
      } else if (language == "en") {
        showAlert(
          false,
          "Response time must be less than Fulfilled time",
          intl
        );
        return setMessage("Response time must be less than Fulfilled time");
      }
    }

    let body = {
      slaName: formValues.slaName,
      slaNameEn: formValues.slaNameEn,
      implementDays: formValues.implementDays,
      implementHours: formValues.implementHours,
      implementMinutes: formValues.implementMinutes,
      respondDays: formValues.respondDays,
      respondHours: formValues.respondHours,
      respondMinutes: formValues.respondMinutes,
      description: formValues.description || "",
      descriptionEn: formValues.descriptionEn || "",
      status: formValues.status,
      mainClassifficationid:
        mainClassificationId != "00000000-0000-0000-0000-000000000000"
          ? mainClassificationId
          : formValues.mainClassificationId,
      escalationLevelIds:
        allLevels?.length > 0
          ? [
              ...allLevels?.map((level: any) => {
                return level?.id;
              }),
            ]
          : [],
    };
    setLoading(true);
    dispatch(addSLA(body as any) as any).then((res: any) => {
      setMessage(res?.payload?.message);
      setStatusEnum(res?.payload?.statusEnum);
      setLoading(false);
    });
  };
  useEffect(() => {
    if (mainClassificationId != "00000000-0000-0000-0000-000000000000") {
      setValue("mainClassificationId", mainClassificationId as string);
    }
  }, [mainClassificationId, mainClassification]);

  useEffect(() => {
    if (message == "SLA added successfully") {
      showAlert(true, "AddedSuccessfully", intl);
      reset();
      setMessage("");
      navigate("/technical-support-service-level-agreement-details");
    } else if (message == '["SlaNameIsAlreadyExists"]') {
      showAlert(false, "SlaNameIsAlreadyExists", intl);
    } else if (
      message == "CannotAssignEscalationLevelsWithTheSameNameToOneSla" ||
      message == '["CannotAssignEscalationLevelsWithTheSameNameToOneSla"]'
    ) {
      showAlert(
        false,
        "CannotAssignEscalationLevelsWithTheSameNameToOneSla",
        intl
      );
    } else if (
      message == "CannotAssignEscalationLevelsWithTheSameResponsiblesUsers" ||
      message == '["CannotAssignEscalationLevelsWithTheSameResponsiblesUsers"]'
    ) {
      showAlert(
        false,
        "CannotAssignEscalationLevelsWithTheSameResponsiblesUsers",
        intl
      );
    } else if (
      message ==
      '["CannotAssignEscalationLevelsWithTheSameNameToOneSla","CannotAssignEscalationLevelsWithTheSameResponsiblesUsers"]'
    ) {
      showAlert(
        false,
        "CannotAssignEscalationLevelsWithTheSameResponsiblesUsers/CannotAssignEscalationLevelsWithTheSameNameToOneSla",
        intl
      );
    }
  }, [message]);
  let slaData = {
    slaName: formValues.slaName,
    implementDays: formValues.implementDays as number,
    implementHours: formValues.implementHours as number,
    implementMinutes: formValues.implementMinutes as number,
    respondDays: formValues.respondDays as number,
    respondHours: formValues.respondHours as number,
    respondMinutes: formValues.respondMinutes as number,
    description: formValues.description,
    status: formValues.status,
  };
  let data = location?.state?.slaData;
  useEffect(() => {
    if (data) {
      setValue("description", data?.description || "");
      setValue("slaName", data?.slaName || "");
      setValue("implementDays", (data?.implementDays as number) || 0);
      setValue("implementHours", (data?.implementHours as number) || 0);
      setValue("implementMinutes", (data?.implementMinutes as number) || 0);
      setValue("respondDays", (data?.respondDays as number) || 0);
      setValue("respondHours", (data?.respondHours as number) || 0);
      setValue("respondMinutes", (data?.respondMinutes as number) || 0);
      setValue("status", data?.status || "");
    }
  }, [data]);

  let cardName = location?.state?.cardName;
  let cardId = location?.state?.cardId;

  const breadcrumbItems = [
    {
      path: "/technical-support-service-level-agreement-details",
      defaultName: "ServiceLevelAgreement",
      name: cardName,
    },
    { path: "", defaultName: "AddNewAgreement", name: "" },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={"AddNewAgreement"}
        extraTitle={""}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardId={cardId}
        cardOption={cardName}
      />
      <div
        id="kt_content_container"
        className="d-flex flex-column-fluid align-items-start container-xxl p-0"
      >
        <div className="content flex-row-fluid" id="kt_content">
          <form onSubmit={handleSubmit(AddSla)}>
            <div
              className="flex-lg-row-fluid"
              data-select2-id="select2-data-129-tmo1"
            >
              <div className="card mb-5 mb-xl-8 pt-5">
                <div>
                  <div className="card-header px-1 pb-2 mb-5 mt-5 px-2 px-3">
                    <p className="card-title align-items-start flex-column px-5 pb-5">
                      <span className="card-label fw-bolder fs-3 mb-2 ">
                        <bdi>
                          {intl.formatMessage({
                            id: "AddNewAgreement",
                          })}
                        </bdi>
                      </span>
                      <span className="mt-1 fw-semibold fs-5 text-muted">
                        {intl.formatMessage({
                          id: "PleaseEnterTheData",
                        })}
                        :
                      </span>
                    </p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="mb-2 pt-2 pb-3">
                        <label
                          style={{
                            width: "100%",
                            textAlign: language == "ar" ? "right" : "left",
                          }}
                          className="form-label px-2  fs-6 text-gray-700 required"
                        >
                          {intl.formatMessage({ id: "SLANameInArabic" })}
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-file-signature special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            {...register("slaName")}
                          />
                        </div>
                        {DisplayErrorMessage(
                          errors?.slaName?.message,
                          intl,
                          language
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="mb-2 pt-2 pb-3">
                        <label
                          style={{
                            width: "100%",
                            textAlign: language == "ar" ? "right" : "left",
                          }}
                          className="form-label px-2  fs-6 text-gray-700 required"
                        >
                          {intl.formatMessage({ id: "SLANameInEnglish" })}
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-file-signature special"></i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            {...register("slaNameEn")}
                          />
                        </div>
                        {DisplayErrorMessage(
                          errors?.slaNameEn?.message,
                          intl,
                          language
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 d-lg-flex justify-content-center">
                      <div className="mb-2 pt-2 pb-3 w-300px">
                        <label
                          style={{
                            width: "100%",
                            textAlign: language == "ar" ? "right" : "left",
                          }}
                          className="form-label px-2  fs-6 text-gray-700 required"
                        >
                          <bdi>
                            <span className="text-muted">
                              {language != "en" && ` (Fulfilled Time) `}
                            </span>
                            {intl.formatMessage({
                              id: "ServiceImplementationPeriod",
                            })}
                          </bdi>
                        </label>
                        <div className="d-flex justify-content-between w-50">
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control form-control-solid text-center"
                              style={{ width: "50px" }}
                              {...register("implementDays")}
                            />

                            <span className="d-inline-block ms-2 me-4">
                              {intl.formatMessage({
                                id: "Days",
                              })}
                            </span>
                          </div>
                          {DisplayErrorMessage(
                            errors?.implementDays?.message,
                            intl,
                            language
                          )}
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control form-control-solid text-center"
                              style={{ width: "50px" }}
                              {...register("implementHours")}
                            />

                            <span className="d-inline-block ms-2 me-4">
                              {intl.formatMessage({
                                id: "Hours",
                              })}
                            </span>
                          </div>
                          {DisplayErrorMessage(
                            errors?.implementHours?.message,
                            intl,
                            language
                          )}
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control 
                                          form-control-solid text-center"
                              style={{ width: "50px" }}
                              {...register("implementMinutes")}
                            />

                            <span className="d-inline-block ms-2 me-4">
                              {intl.formatMessage({
                                id: "Minutes",
                              })}
                            </span>
                            {DisplayErrorMessage(
                              errors?.implementMinutes?.message,
                              intl,
                              language
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="mb-2 pt-2 pb-3">
                        <label
                          style={{
                            width: "100%",
                            textAlign: language == "ar" ? "right" : "left",
                          }}
                          className="form-label px-2  fs-6 text-gray-700 required"
                        >
                          <bdi>
                            <span className="text-muted">
                              {language != "en" && ` (Response Time) `}
                            </span>
                            {intl.formatMessage({
                              id: "ResponseTime",
                            })}
                          </bdi>
                        </label>
                        <div className="d-flex justify-content-between w-50">
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control form-control-solid text-center"
                              style={{ width: "50px" }}
                              {...register("respondDays")}
                            />

                            <span className="d-inline-block ms-2 me-4">
                              {intl.formatMessage({
                                id: "Days",
                              })}
                            </span>
                            {DisplayErrorMessage(
                              errors?.respondDays?.message,
                              intl,
                              language
                            )}
                          </div>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control form-control-solid text-center"
                              style={{ width: "50px" }}
                              {...register("respondHours")}
                            />

                            <span className="d-inline-block ms-2 me-4">
                              {intl.formatMessage({
                                id: "Hours",
                              })}
                            </span>
                            {DisplayErrorMessage(
                              errors?.respondHours?.message,
                              intl,
                              language
                            )}
                          </div>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control 
                                          form-control-solid  text-center"
                              style={{ width: "50px" }}
                              {...register("respondMinutes")}
                            />

                            <span className="d-inline-block ms-4">
                              {intl.formatMessage({
                                id: "Minutes",
                              })}
                            </span>
                            {DisplayErrorMessage(
                              errors?.respondMinutes?.message,
                              intl,
                              language
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {mainClassificationId ==
                    "00000000-0000-0000-0000-000000000000" ? (
                      <>
                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="mb-2 pt-2 pb-3 ">
                            <label
                              htmlFor="MainClassification"
                              className="form-label px-2 required"
                            >
                              {intl.formatMessage({ id: "MainClassification" })}
                            </label>
                            <select
                              id="MainClassification"
                              className="form-select myform-control form-select-solid select2-hidden-accessible mt-1"
                              data-placeholder="اختر"
                              tabIndex={-1}
                              aria-hidden="true"
                              {...register("mainClassificationId")}
                              onChange={(e) => {
                                handleServiceCatalog(e.target.value);
                              }}
                              defaultValue={""}
                            >
                              <option value={""} disabled>
                                {intl.formatMessage({ id: "Choose" })}
                              </option>
                              {Array.isArray(mainClassification) &&
                                mainClassification?.map((item: any) => (
                                  <option
                                    key={item?.mainClassificationId}
                                    value={item?.mainClassificationId}
                                  >
                                    {intl.locale == "ar"
                                      ? item.mainClassificationName
                                      : item.mainClassificationNameEn}
                                  </option>
                                ))}
                            </select>
                            {DisplayErrorMessage(
                              errors?.mainClassificationId?.message
                                ? "YouMustSelectOption"
                                : "",
                              intl,
                              language
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-12 col-md-6 col-lg-4">
                          <div className="mb-2 pt-2 pb-3 ">
                            <label
                              htmlFor="MainClassification"
                              className="form-label px-2 required"
                            >
                              {intl.formatMessage({ id: "MainClassification" })}
                            </label>
                            <select
                              id="MainClassification"
                              className="form-select myform-control form-select-solid select2-hidden-accessible mt-1"
                              data-placeholder="اختر"
                              tabIndex={-1}
                              aria-hidden="true"
                              {...register("mainClassificationId")}
                              onChange={(e) => {
                                handleServiceCatalog(e.target.value);
                              }}
                              disabled
                            >
                              <option value={""}>
                                {intl.formatMessage({ id: "Choose" })}
                              </option>
                              {Array.isArray(mainClassification) &&
                                mainClassification?.map((item: any) => (
                                  <option
                                    key={item?.mainClassificationId}
                                    value={item?.mainClassificationId}
                                  >
                                    {intl.locale == "ar"
                                      ? item.mainClassificationName
                                      : item.mainClassificationNameEn}
                                  </option>
                                ))}
                            </select>
                            {DisplayErrorMessage(
                              errors?.mainClassificationId?.message
                                ? "YouMustSelectOption"
                                : "",
                              intl,
                              language
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    <>
                      <div className="col-12 col-md-6 col-lg-4">
                        <div className="mb-2 pt-2 pb-3">
                          <label
                            style={{
                              width: "100%",
                              textAlign: language == "ar" ? "right" : "left",
                            }}
                            className="form-label px-2  fs-6 text-gray-700 required"
                          >
                            <bdi>
                              {" "}
                              {intl.formatMessage({
                                id: "Status",
                              })}
                            </bdi>
                          </label>
                          <select
                            {...register("status")}
                            className="form-select form-select-solid"
                            defaultValue={0}
                          >
                            <option value={0} disabled>
                              {intl.formatMessage({ id: "Choose" })}
                            </option>
                            {Array.isArray(options) &&
                              options?.map((item) => (
                                <option value={item?.id} key={item?.id}>
                                  {item?.name}
                                </option>
                              ))}
                          </select>
                          {DisplayErrorMessage(
                            errors?.status?.message,
                            intl,
                            language
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-8 col-lg-8 d-lg-flex px-5">
                        {/* <div className="mb-2 pt-2 pb-3 w-100"> */}
                        {/* <label className="form-label px-2  fs-6 text-gray-700 invisible">
                            AddEscalationLevel
                          </label> */}
                        {/* <div className="d-flex align-items-center"> */}
                        {/* <button
                              className="btn btn-success w-40 mx-2"
                              onClick={() => {
                                navigate("/add-escalation-level", {
                                  state: slaData,
                                });
                              }}
                            >
                              <bdi>
                                {intl.formatMessage({
                                  id: "AddEscalationLevel",
                                })}
                              </bdi>
                            </button> */}
                        {/* </div> */}
                        {/* </div> */}
                      </div>
                    </>
                  </div>
                </div>
                <label
                  style={{
                    width: "100%",
                    textAlign: language == "ar" ? "right" : "left",
                  }}
                  className="form-label px-2  fs-6 text-gray-700 mx-5"
                >
                  {intl.formatMessage({
                    id: "DescriptionInArabic",
                  })}
                </label>
                <div className="my-4 mx-8">
                  <textarea
                    className="form-control form-control-solid "
                    rows={5}
                    {...register("description")}
                    placeholder={intl.formatMessage({
                      id: "Description",
                    })}
                  />
                </div>
                <label
                  style={{
                    width: "100%",
                    textAlign: language == "ar" ? "right" : "left",
                  }}
                  className="form-label px-2  fs-6 text-gray-700 mx-5"
                >
                  {intl.formatMessage({
                    id: "DescriptionInEnglish",
                  })}
                </label>
                <div className="my-4 mx-8">
                  <textarea
                    className="form-control form-control-solid "
                    rows={5}
                    {...register("descriptionEn")}
                    placeholder={intl.formatMessage({
                      id: "Description",
                    })}
                  />
                </div>
                <div className="p-3 text-center pb-5">
                  <Link
                    onClick={() => {}}
                    className="btn btn-secondary m-3 px-5 py-3"
                    style={{ width: "125px" }}
                    to={"/technical-support-service-level-agreement-details"}
                  >
                    {intl.formatMessage({
                      id: "Cancel",
                    })}
                  </Link>
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
                    <button
                      className="btn btn-success m-3 px-5 py-3"
                      style={{ width: "125px" }}
                      type="submit"
                    >
                      {intl.formatMessage({
                        id: "Add",
                      })}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
