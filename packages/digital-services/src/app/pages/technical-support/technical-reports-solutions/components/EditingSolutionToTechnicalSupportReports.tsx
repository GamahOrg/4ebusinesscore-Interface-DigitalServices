import { Fragment, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { ResolveDetails } from "../../../../models/ResolveDetails";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  validationResolverForms,
  validationResolverFormsSchema,
} from "../../../../validationResolverForms.tsx/validationResolverForms";
import {
  MainClassificationServiceCatalog,
  ServiceCatalog,
} from "../../../../models/ServiceCatalog";
import { getResolverById } from "../../../../redux/features/Resolver/getResolverDetailsSlice";
import { getMainClassification } from "../../../../redux/features/Resolver/getMainClassificationSlice";
import { getServiceCatalog } from "../../../../redux/features/Resolver/getServicesCatalog";
import { editResolver } from "../../../../redux/features/Resolver/editResolveSlice";
import { TicketingSystemAggRootUrl } from "@4eplatform/shared/apis/ticketing_system_agg";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { Button, Spinner } from "react-bootstrap";
import getIconSrcError from "@4eplatform/shared/functions/getIconSrcError";

function EditingSolutionToTechnicalSupportReports() {
  let intl = useIntl();
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [loading, setLoading] = useState<boolean>(false);

  let resolveReport = useSelector((state: RootState) => {
    return state?.resolverDetails.item;
  });
  useEffect(() => {
    if (id) {
      dispatch(getResolverById(id) as any);
      dispatch(getMainClassification() as any);
    }
  }, [id]);

  const [resolveReportDetails, setresolveReportDetails] =
    useState<ResolveDetails>(resolveReport);

  useEffect(() => {
    setresolveReportDetails(resolveReport);
  }, [resolveReport]);
  const [isAPIHasFile, setIsAPIHasFile] = useState("");
  useEffect(() => {
    setValue("resolveDescription", resolveReport?.resolveDescription);
    if (resolveReport?.imageUrl)
      setIsAPIHasFile(TicketingSystemAggRootUrl + resolveReport?.imageUrl);
  }, [resolveReport]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<validationResolverForms>({
    resolver: yupResolver(validationResolverFormsSchema),
    mode: "all",
    reValidateMode: "onChange",
  });

  const isFile = watch("imageUrl");
  let mainClassification = useSelector((state: RootState) => {
    return state?.mainClassificationService.items;
  });
  let serviceCatalog = useSelector((state: RootState) => {
    return state?.getserviceCatalog.item;
  });

  let [mainClassificationId, setmainClassificationId] = useState<string>("");
  let [serviceCatalogId, setserviceCatalogId] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<any>();

  const handleServiceCatalog = (index: string) => {
    setresolveReportDetails((prev) => {
      let value = index;
      let id = "";
      return {
        ...prev,
        [id]: value,
      };
    });
    setmainClassificationId(index);
  };

  useEffect(() => {
    if (resolveReport?.mainClassificationId) {
      setmainClassificationId(resolveReport?.mainClassificationId);
    }
  }, [resolveReport]);

  useEffect(() => {
    if (mainClassificationId) {
      setValue("mainClassificationId", mainClassificationId);
      dispatch(getServiceCatalog(mainClassificationId) as any);
    }
  }, [mainClassificationId]);

  useEffect(() => {
    setValue("serviceCatalogId", resolveReportDetails?.serviceCatalogId);
  }, [resolveReportDetails]);
  useEffect(() => {
    setValue("resolveName", resolveReportDetails?.resolveName);
  }, [resolveReportDetails]);
  const handleInputChange = (e: any, id: string) => {
    let value = e.target.value;
    setresolveReportDetails((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };
  const [changeAttachmentState, setChangeAttachmentState] =
    useState<boolean>(false);
  const imageUrl = resolveReportDetails?.imageUrl;
  const href =
    imageUrl && imageUrl.startsWith("wwwroot")
      ? TicketingSystemAggRootUrl + imageUrl
      : imageUrl;
  const attachmentUrl =
    imageUrl && imageUrl.startsWith("wwwroot")
      ? imageUrl:
       imageUrl;
  const UpdateresolveReport = async (formValues: validationResolverForms) => {
    let body = formValues?.imageUrl[0]
      ? {
          resolveName: formValues.resolveName,
          resolveDescription: formValues.resolveDescription || "",
          mainClassificationId: formValues.mainClassificationId || "",
          serviceCatalogId: formValues.serviceCatalogId || "",
          imageUrl: formValues?.imageUrl[0],
        }
      : {
          resolveName: formValues.resolveName,
          resolveDescription: formValues.resolveDescription || "",
          mainClassificationId: formValues.mainClassificationId || "",
          serviceCatalogId: formValues.serviceCatalogId || "",
          imageUrl: null,
          attachmentUrl: changeAttachmentState ? null : attachmentUrl,
        };
    try {
      setLoading(true);
      const result = await dispatch(
        editResolver({ id: id, item: body }) as any
      );
      setLoading(false);

      if (result?.payload.message === "Resolve Report already exist") {
        showAlert(false, "ResolveReportAlreadyExist", intl);
      } else {
        if (result?.payload.statusEnum === 1) {
          Promise.resolve(showAlert(true, "successfullyDone", intl)).then(
            () => {
              navigate("/technical-reports-solutions");
            }
          );
        }
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  return (
    <Fragment>
      <div className="card shadow p-8 mb-7 ">
        <div className="mb-6">
          <p className="fw-bolder fs-4 text-dark mb-4">
            {" "}
            {intl.formatMessage({ id: "EditingSolution" })}
          </p>
          <p className="text-muted fs-7">
            {intl.formatMessage({ id: "PleaseEnterTheFollowingData" })}
          </p>
        </div>
        <hr className="mb-4" />
        <form onSubmit={handleSubmit(UpdateresolveReport)}>
          <div className="row mb-4">
            <div className="col-lg-6">
              <div className="mb-2 pt-2 pb-3 ">
                <label
                  htmlFor="SolutionTitle"
                  className="form-label px-2 required "
                >
                  {intl.formatMessage({ id: "SolutionTitle" })}
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="far fa-lightbulb special"></i>
                    </span>
                  </div>
                  <input
                    id="SolutionTitle"
                    type="text"
                    className="form-control"
                    placeholder={intl.formatMessage({ id: "SolutionTitle" })}
                    {...register("resolveName")}
                  />
                </div>
                {DisplayErrorMessage(
                  errors?.resolveName?.message,
                  intl,
                  intl.locale
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-2 pt-2 pb-3 ">
                <label
                  htmlFor="SolutionDescription"
                  className="form-label px-2 "
                >
                  {intl.formatMessage({ id: "SolutionDescription" })}
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-info-circle special"></i>
                    </span>
                  </div>
                  <input
                    id="resolveDescription"
                    type="text"
                    className="form-control"
                    placeholder={intl.formatMessage({
                      id: "SolutionDescription",
                    })}
                    {...register("resolveDescription")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-6">
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
                  onChange={(e) => handleServiceCatalog(e.target.value)}
                  defaultValue={resolveReportDetails?.mainClassificationId}
                >
                  <option value={""} disabled>
                    {intl.formatMessage({ id: "Choose" })}
                  </option>
                  {mainClassification?.map(
                    (item: MainClassificationServiceCatalog) => (
                      <option
                        key={item.mainClassificationId}
                        value={item.mainClassificationId}
                        // selected={
                        //   item.mainClassificationId ===
                        //   resolveReportDetails?.mainClassificationId
                        // }
                      >
                          {intl.locale=="ar"?item.mainClassificationName:item.mainClassificationNameEn}
                      </option>
                    )
                  )}
                </select>

                {DisplayErrorMessage(
                  errors?.mainClassificationId?.message,
                  intl,
                  intl.locale
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-2 pt-2 pb-3">
                <label
                  htmlFor="SubCategory"
                  className="form-label px-2 fontSz-6 required"
                >
                  {intl.formatMessage({ id: "SubCategory" })}
                </label>

                <select
                  id="SubCategory"
                  className="form-select myform-control inputHeight form-select-solid select2-hidden-accessible mt-1"
                  data-kt-select2="true"
                  data-placeholder={intl.formatMessage({
                    id: "SubCategory",
                  })}
                  tabIndex={-1}
                  aria-hidden="true"
                  {...register("serviceCatalogId")}
                  defaultValue={resolveReportDetails?.serviceCatalogId}
                >
                  <option value={""} disabled>
                    {intl.formatMessage({ id: "Choose" })}
                  </option>
                  {serviceCatalog?.map((item: ServiceCatalog) => (
                    <option
                      key={item.serviceCatalogId}
                      value={item.serviceCatalogId}
                      // selected={
                      //   item.serviceCatalogId ==
                      //   resolveReportDetails?.serviceCatalogId
                      // }
                    >
                      {intl.locale=="ar"?item.serviceCatalogName:item.serviceCatalogNameEn}
                    </option>
                  ))}
                </select>
                {DisplayErrorMessage(
                  errors?.serviceCatalogId?.message,
                  intl,
                  intl.locale
                )}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-lg-6">
              <div className="mb-2 pt-2 pb-3">
                <label
                  htmlFor="Attachments"
                  className="form-label px-2 fontSz-6"
                >
                  {intl.formatMessage({ id: "Attachments" })}
                </label>
                <div className=" notice d-flex bg-light-primary rounded border-primary border border-dashed mb-1">
                  <label
                    htmlFor="outputAttachment"
                    className="form-label px-2  fontSz-6 dropzone-select   w-100 uploadFile-style inputAreaHeight"
                  >
                    <div className="row align-items-center">
                      <div className="col-md-1">
                        {isFile?.length ? (
                          <img
                            src={getIconSrc(isFile[0]?.name, isFile[0])}
                            className="img-fluid"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                            }}
                          />
                        ) : imageUrl ? (
                          <img
                            src={getIconSrc(
                              imageUrl,
                              { filePath: imageUrl },
                              TicketingSystemAggRootUrl
                            )}
                            className="img-fluid"
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                            }}
                            onError={(e: any) => {
                              e.target.src = getIconSrcError(imageUrl);
                            }}
                          />
                        ) : (
                          <img
                            src={toAbsoluteUrl("/media/extensions/uploadFile.webp")}
                            className="img-fluid"
                            alt="upload file"
                          />
                        )}
                      </div>

                      {isFile?.length ? (
                        <div className="col-md-8">
                          <div className="d-flex align-items-center py-2">
                            <span className="text-primary fw-bolder">
                              {isFile?.length
                                ? isFile[0]?.name?.slice(0, 40) || (
                                    <a
                                      className="py-2"
                                      href={resolveReportDetails?.imageUrl}
                                    >
                                      {resolveReportDetails?.imageUrl.substring(
                                        resolveReportDetails?.imageUrl.lastIndexOf(
                                          "/"
                                        ) + 1
                                      )}
                                      ...
                                    </a>
                                  )
                                : ""}
                            </span>
                            <button
                              style={{ height: "20px", width: "20px" }}
                              type="button"
                              className="btn btn-icon btn-danger rounded-circle ms-2"
                              onClick={() => setValue("imageUrl", "")}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        </div>
                      ) : resolveReport?.imageUrl &&
                        isAPIHasFile &&
                        resolveReportDetails.imageUrl !== "null" ? (
                        <>
                          <div className="col-md-8">
                            <div className="d-flex align-items-center py-2">
                              <span className="text-primary fw-bolder">
                                {
                                  <a
                                    className="py-2"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={href}
                                  >
                                    {resolveReportDetails?.imageUrl?.substring(
                                      resolveReportDetails?.imageUrl?.lastIndexOf(
                                        "/"
                                      ) + 1
                                    )}
                                    ...
                                  </a>
                                }
                              </span>
                              <button
                                style={{ height: "20px", width: "20px" }}
                                type="button"
                                className="btn btn-icon btn-danger rounded-circle ms-2"
                                onClick={() => {
                                  setIsAPIHasFile("");
                                  setChangeAttachmentState(true);
                                }}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-md-8">
                            <p className="text-primary fw-bolder my-1">
                              {" "}
                              {intl.formatMessage({ id: "QuickFileUploader" })}
                            </p>
                            <p>
                              {intl.formatMessage({
                                id: "DragAndDropOrChooseFilesFromComputer",
                              })}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                  <div
                    className="dropzone dropzone-queue mb-2"
                    id="kt_dropzonejs_example_3"
                  >
                    <div className="dropzone-panel mb-lg-0 mb-2">
                      <input
                        type="file"
                        accept="image/*"
                        id="outputAttachment"
                        placeholder={intl.formatMessage({ id: "FileUpload" })}
                        className="dropzone-select w-100 uploadFile-style inputAreaHeight d-none"
                        {...register("imageUrl")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" mt-7 d-flex justify-content-center align-items-center w-50 mx-auto">
            <Link
              to="/technical-reports-solutions"
              className="btn btn-secondary mx-1 text-center"
              style={{ minWidth: "120px" }}
            >
              {intl.formatMessage({ id: "Cancel" })}
            </Link>
            {loading ? (
              <Button variant="success" disabled className="px-15 w-35">
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
                className="btn btn-primary mx-1 text-center"
                style={{ minWidth: "120px" }}
              >
                {intl.formatMessage({ id: "Save" })}
              </button>
            )}
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default EditingSolutionToTechnicalSupportReports;
