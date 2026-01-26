import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { RootState } from "../../../../redux/store/store";
import { Button, Spinner } from "react-bootstrap";
import {
  validationResolverForms,
  validationResolverFormsSchema,
} from "../../../../validationResolverForms.tsx/validationResolverForms";
import {
  MainClassificationServiceCatalog,
  ServiceCatalog,
} from "../../../../models/ServiceCatalog";
import { getServiceCatalog } from "../../../../redux/features/Resolver/getServicesCatalog";
import { getMainClassification } from "../../../../redux/features/Resolver/getMainClassificationSlice";
import { addResolveReport } from "../../../../redux/features/Resolver/addResolveSlice";
import DisplayErrorMessage from "@4eplatform/shared/functions/displayErrorMessage";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { toAbsoluteUrl } from "@4eplatform/gateway/src/app/helpers";
import getIconSrc from "@4eplatform/shared/functions/getIconSrc";

let AddingNewSolutionToTechnicalSupportReports = ({
  idFormainClassification,
}: any) => {
  let intl = useIntl();
  const { classificationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  let [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<validationResolverForms>({
    resolver: yupResolver(validationResolverFormsSchema),
    mode: "all",
    reValidateMode: "onChange",
  });
  const isFile = watch("imageUrl");

  let dispatch = useDispatch();

  let mainClassification = useSelector((state: RootState) => {
    return state?.mainClassificationService.items;
  });
  let serviceCatalog = useSelector((state: RootState) => {
    return state?.getserviceCatalog.item;
  });

  let [mainClassificationId, setmainClassificationId] = useState<string>("");

  useEffect(() => {
    if (classificationId !== "00000000-0000-0000-0000-000000000000") {
      setmainClassificationId(classificationId as string);
      setValue("mainClassificationId", classificationId as string);
      dispatch(getServiceCatalog(classificationId as string) as any);
    }
  }, [classificationId]);

  const handleServiceCatalog = (index: string) => {
    setmainClassificationId(index);
    dispatch(getServiceCatalog(index) as any);
  };

  useEffect(() => {
    dispatch(getMainClassification() as any);
  }, [dispatch]);

  const AddresolveReport = async (formValues: validationResolverForms) => {
    let body = {
      resolveName: formValues.resolveName,
      resolveDescription: formValues.resolveDescription || "",
      mainClassificationId: formValues.mainClassificationId || "",
      serviceCatalogId: formValues.serviceCatalogId || "",
      imageUrl: formValues?.imageUrl[0] || "",
    };

    try {
      setLoading(true);
      const result = await dispatch(addResolveReport(body) as any);
      setLoading(false);

      if (result?.payload.message === "Resolve Report already exist") {
        showAlert(false, "ResolveReportAlreadyExist", intl);
      } else {
        if (result?.payload.statusEnum === 1) {
          Promise.resolve(showAlert(true, "successfullyDone", intl)).then(
            () => {
              navigate(
                classificationId
                  ? `/technical-reports-solutions/${classificationId}`
                  : "/technical-reports-solutions",
                {
                  state: {
                    mainClassificationId: idFormainClassification,
                    cardTitle: location?.state?.cardTitle,
                    cardId: location?.state?.cardId,
                  },
                },
              );
            },
          );
        }
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="card shadow p-8 mb-7 ">
        <div className="mb-6">
          <p className="fw-bolder fs-4 text-dark mb-4">
            {" "}
            {intl.formatMessage({ id: "AddNewSolution" })}
          </p>
          <p className="text-muted fs-7">
            {intl.formatMessage({ id: "PleaseEnterTheFollowingData" })}
          </p>
        </div>
        <hr className="mb-4" />
        <form onSubmit={handleSubmit(AddresolveReport)}>
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
                    id="resolveName"
                    type="text"
                    className="form-control"
                    placeholder={intl.formatMessage({ id: "SolutionTitle" })}
                    {...register("resolveName")}
                  />
                  {DisplayErrorMessage(
                    errors?.resolveName?.message,
                    intl,
                    intl.locale,
                  )}
                </div>
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
                  {...register("mainClassificationId")}
                  onChange={(e) => {
                    handleServiceCatalog(e.target.value);
                  }}
                  disabled={
                    classificationId !== "00000000-0000-0000-0000-000000000000"
                      ? true
                      : false
                  }
                  defaultValue={
                    classificationId !== "00000000-0000-0000-0000-000000000000"
                      ? classificationId
                      : ""
                  }
                >
                  <option
                    value={""}
                    // selected={classificationId ? false : true}
                    disabled
                  >
                    {intl.formatMessage({ id: "Choose" })}
                  </option>
                  {Array.isArray(mainClassification) &&
                    mainClassification?.map(
                      (item: MainClassificationServiceCatalog) => (
                        <option
                          key={item.mainClassificationId}
                          value={item.mainClassificationId}
                        >
                          {intl.locale == "ar"
                            ? item.mainClassificationName
                            : item.mainClassificationNameEn}
                        </option>
                      ),
                    )}
                </select>
                {DisplayErrorMessage(
                  errors?.mainClassificationId?.message,
                  intl,
                  intl.locale,
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
                  data-dropdown-parent="#kt_menu_62775e8642438"
                  data-allow-clear="true"
                  data-select2-id="select2-data-4-vqtd"
                  tabIndex={-1}
                  {...register("serviceCatalogId")}
                  disabled={
                    mainClassificationId == "" ||
                    mainClassificationId == undefined
                      ? true
                      : false
                  }
                  defaultValue={""}
                >
                  <option value={""} disabled>
                    {intl.formatMessage({ id: "Choose" })}{" "}
                  </option>
                  {Array.isArray(serviceCatalog) &&
                    serviceCatalog?.map((item: ServiceCatalog) => (
                      <option
                        key={item.serviceCatalogId}
                        value={item.serviceCatalogId}
                      >
                        {intl.locale == "ar"
                          ? item.serviceCatalogName
                          : item.serviceCatalogNameEn}
                      </option>
                    ))}
                </select>
                {DisplayErrorMessage(
                  errors?.serviceCatalogId?.message,
                  intl,
                  intl.locale,
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
                          <>
                            {" "}
                            <img
                              src={getIconSrc(isFile[0]?.name, isFile[0])}
                              className="img-fluid"
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                              }}
                            />
                          </>
                        ) : (
                          <img
                            alt="img"
                            src={toAbsoluteUrl(
                              "/media/extensions/uploadFile.webp",
                            )}
                            className="img-fluid"
                          />
                        )}
                      </div>
                      {isFile?.length ? (
                        <div className="col-md-8">
                          <div className="d-flex align-items-center py-2">
                            <span className="text-primary fw-bolder">
                              {isFile?.length
                                ? isFile[0]?.name?.slice(0, 40)
                                : ""}
                              ...
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
              state={{
                mainClassificationId: idFormainClassification,
                cardTitle: location?.state?.cardTitle,
                cardId: location?.state?.cardId,
              }}
              className="btn btn-secondary mx-1 text-center"
              style={{ minWidth: "120px" }}
            >
              {intl.formatMessage({ id: "Cancel" })}
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
                type="submit"
                className="btn btn-success mx-1 text-center"
                style={{ minWidth: "120px" }}
              >
                {intl.formatMessage({ id: "Add" })}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddingNewSolutionToTechnicalSupportReports;
