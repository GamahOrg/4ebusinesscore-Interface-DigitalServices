import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getResolverById } from "../../../../redux/features/Resolver/getResolverDetailsSlice";
import { FAQRootUrl } from "@4eplatform/shared/apis/faq";

function TechnicalReportsSolutionsDetails() {
  let intl = useIntl();
  let { id } = useParams();

  const { classificationId } = useParams();
  const [MainId, setMainId] = useState("");
  useEffect(() => {
    if (classificationId) setMainId(classificationId);
  }, [classificationId]);

  const dispatch = useDispatch();

  let resolveReport = useSelector((state: RootState) => {
    return state?.resolverDetails.item;
  });
  useEffect(() => {
    dispatch(getResolverById(id) as any);
  }, []);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  return (
    <Fragment>
      <div className="card mb-5 mb-xl-10 shadow pb-5">
        <div className="card-body pt-9 pb-0">
          <div className="card-header title_details_border bg-light  px-4 py-4  mb-3 w-100 d-flex align-items-center ">
            <h3 className="card-title align-items-start flex-column w-40">
              <span className="card-label fw-bolder fs-4 mb-2 ">
                {intl.formatMessage({
                  id: "ReportSolutionData",
                })}
              </span>
              <span className="mt-1 fs-6 ">
                {intl.formatMessage({
                  id: "CurrentReportSolutionData",
                })}
              </span>
            </h3>
            {user?.username === "SystemAdmin" ? (
              <div className="h-50 w-50 d-flex flex-column flex-sm-row align-items-end my-2 my-sm-0 justify-content-end align-items-sm-center">
                <Link
                  to={`/technical-reports-solutions/${id}/edit-solution/${MainId}`}
                  className="btn btn-secondary mx-1 text-center h-50"
                  style={{ minWidth: "115px" }}
                >
                  {intl.formatMessage({ id: "EditingSolution" })}
                </Link>

                <Link
                  to={`/technical-reports-solutions/add-new-solution/${MainId}`}
                  className="btn btn-primary mx-1 text-center h-50 mt-2 mt-md-0"
                  style={{ minWidth: "115px" }}
                >
                  {intl.formatMessage({ id: "AddingSolution" })}
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="d-flex my-gray-dash-border align-items-center  px-4 py-4  mb-3 w-100">
            <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
              {intl.formatMessage({
                id: "SolutionTitle",
              })}{" "}
              :{" "}
            </p>
            <p className="px-2 mb-0  pb-2 fw-bolder text-primary ">
              {resolveReport?.resolveName}
            </p>
          </div>
          {resolveReport?.resolveDescription ? (
            <>
              <div className=" my-gray-dash-border d-flex  align-items-center  px-4 py-4  mb-3 w-100">
                <p className="pb-2 mb-0 fw-bolder text-muted-50 fw-bolder fs-6">
                  {intl.formatMessage({
                    id: "SolutionDescription",
                  })}{" "}
                  :
                </p>
                <p className="px-2 mb-0  pb-2 text-muted-50 fw-bolder fs-6">
                  {resolveReport?.resolveDescription}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          {resolveReport?.mainClassificationName ? (
            <>
              <div className="d-flex  px-4 py-4  mb-3 w-100 align-items-center my-gray-dash-border">
                <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
                  {intl.formatMessage({ id: "MainClassification" })} :
                </p>
                <p className="px-2 mb-0  pb-2  text-muted-50 fw-bolder fs-6 ">
                  {resolveReport?.mainClassificationName}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          {resolveReport?.serviceCatalogName ? (
            <>
              <div className="d-flex my-gray-dash-border align-items-center  px-4 py-4  mb-3 w-100">
                <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
                  {intl.formatMessage({ id: "SubCategory" })} :
                </p>
                <p className="px-2 mb-0  pb-2  text-muted-50 fw-bolder fs-6">
                  {resolveReport?.serviceCatalogName}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          <div className=" my-gray-dash-border d-flex align-items-center px-4 py-4  mb-3 w-100">
            <p className="pb-2 mb-0  text-muted-50 fw-bolder fs-6">
              {intl.formatMessage({ id: "Date" })} :
            </p>
            <p className="px-2 mb-0  pb-2  text-muted-50 fw-bolder fs-6">
              {resolveReport?.createdOn}
            </p>
          </div>
          <div className="d-flex align-items-center  px-4 py-4  mb-3 w-100 my-gray-dash-border">
            <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
              {intl.formatMessage({ id: "Time" })} :
            </p>
            <p className="px-2 mb-0  pb-2 text-muted-50 fw-bolder fs-6">
              {resolveReport?.timeOfCreation}
            </p>
          </div>
          <div className="d-flex align-items-center  px-4 py-4  mb-3 w-100 my-gray-dash-border">
            <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
              {intl.formatMessage({ id: "CreatedBy" })} :
            </p>
            <p className="px-2 mb-0  pb-2 text-muted-50 fw-bolder fs-6">
              {resolveReport?.creatorName}
            </p>
          </div>
          <div className="d-flex align-items-center  px-4 py-4  mb-3 w-100 my-gray-dash-border">
            <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
              {intl.formatMessage({ id: "CreatedOnDate" })} :
            </p>
            <p className="px-2 mb-0  pb-2 text-muted-50 fw-bolder fs-6">
              {moment(resolveReport?.createdOn).format("YYYY-MM-DD")}
            </p>
          </div>
          {resolveReport?.updatedOn ? (
            <>
              <div
                className={`d-flex align-items-center  px-4 py-4  mb-3 w-100 ${resolveReport?.imageUrl ? "my-gray-dash-border" : ""}`}
              >
                <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
                  {intl.formatMessage({ id: "LastUpdateDate" })} :
                </p>
                <p className="px-2 mb-0  pb-2 text-muted-50 fw-bolder fs-6">
                  {resolveReport?.updatedOn}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          {resolveReport?.imageUrl ? (
            <>
              <div className="d-flex align-items-center  px-4 py-4  mb-3 w-100">
                <p className="pb-2 mb-0 text-muted-50 fw-bolder fs-6">
                  {intl.formatMessage({ id: "Attachment" })} :
                </p>
                <p className="px-2 mb-0  pb-2 text-muted-50 fw-bolder fs-6">
                  <a
                    target="_blank"
                    href={FAQRootUrl + "/" + resolveReport?.imageUrl}
                  >
                    {intl.formatMessage({ id: "OpenAttachment" })}
                  </a>
                </p>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default TechnicalReportsSolutionsDetails;
