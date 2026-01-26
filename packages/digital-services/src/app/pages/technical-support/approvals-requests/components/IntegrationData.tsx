import { useIntl } from "react-intl";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { fetchReportDataByRequestinstanceId } from "../../../../redux/features/requests-slice/request-instance-slice";

interface IntegrationDataProps {
  setModalRShow: any;
  setModalShow: any;
  requestDetails: any;
  type: any;
  request_id: any;
}
const IntegrationData: FC<IntegrationDataProps> = ({
  requestDetails,
  type,
  request_id,
}) => {
  let intl = useIntl();
  const dispatch = useDispatch();

  const requestInstanceData = useSelector((state: RootState) => {
    return state?.requestInstance?.data;
  });

  useEffect(() => {
    if (request_id !== "00000000-0000-0000-0000-000000000000") {
      dispatch(fetchReportDataByRequestinstanceId(request_id) as any);
    }
  }, [request_id]);

  return (
    <>
      <div className="RequestData">
        <div className="card-body pt-9 pb-0">
          <div
            className="card-header bg-light  px-4 py-4  mb-3 w-100"
            style={{
              borderTop: "1px dashed #A1A5B7",
              borderBottom: "1px dashed #A1A5B7",
              lineHeight: "2.5",
            }}
          >
            <h3 className="card-title align-items-start flex-column w-100">
              <span className="card-label fw-bolder text-black fs-4 mb-2 ">
                {intl.formatMessage({
                  id: "IntegrationData",
                })}
              </span>
              {type === "OutgoingRequest" ? (
                <span className="mt-1 fs-6 text-muted">
                  {intl.formatMessage({
                    id: "OutgoingRequests",
                  })}
                </span>
              ) : type == "IncomingRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "IncomingRequests",
                    })}
                  </span>
                </>
              ) : type == "SuggestedRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "SuggestedRequests",
                    })}
                  </span>
                </>
              ) : type == "ArchivedRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "ArchivedRequests",
                    })}
                  </span>
                </>
              ) : type == "CancelledRequest" ? (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "CanceledRequests",
                    })}
                  </span>
                </>
              ) : (
                <>
                  <span className="mt-1 fs-6 text-muted">
                    {intl.formatMessage({
                      id: "AssignedRequests",
                    })}
                  </span>
                </>
              )}
            </h3>
          </div>

          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({
                id: "RequestAddress",
              })}{" "}
              :
            </p>
            <p
              className="px-2 mb-0  pb-2 fw-bolder"
              style={{ color: "#009EF7" }}
            >
              {requestInstanceData?.reportname}
            </p>
          </div>

          {requestInstanceData?.integrationaname ? (
            <>
              <div
                style={{ borderBottom: "1px dashed #A1A5B7" }}
                className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
              >
                <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
                  {intl.formatMessage({ id: "IntegrationName" })} :
                </p>
                <p
                  className="px-2 mb-0  pb-2  fw-bolder"
                  style={{ color: "#727272" }}
                >
                  {requestInstanceData?.integrationaname}
                </p>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "IntegrationSystem" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2  fw-bolder"
              style={{ color: "#727272" }}
            >
              {requestInstanceData?.integrationtype}
            </p>
          </div>

          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "MainClassification" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2  fw-bolder"
              style={{ color: "#727272" }}
            >
              {requestInstanceData?.mainclassifficationname}
            </p>
          </div>

          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "SystemName" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2  fw-bolder"
              style={{ color: "#727272" }}
            >
              {requestInstanceData?.subsystemname}
            </p>
          </div>

          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "Servicename" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2  fw-bolder"
              style={{ color: "#727272" }}
            >
              {requestInstanceData?.servicename}
            </p>
          </div>

          <div
            style={{ borderBottom: "1px dashed #A1A5B7" }}
            className="d-flex  align-items-center  px-4 py-4  mb-3 w-100"
          >
            <p className="pb-2 mb-0 fw-bolder" style={{ color: "#727272" }}>
              {intl.formatMessage({ id: "Clause" })} :
            </p>
            <p
              className="px-2 mb-0  pb-2  fw-bolder"
              style={{ color: "#727272" }}
            >
              {requestInstanceData?.itemname}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntegrationData;
