import { FC, Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import RedirectPopup from "../popups/RedirectPopup";
import DelayPopup from "../popups/DelayPopup";
import { ReportDtos } from "../../../../models/get-report/ResponseReport";
import SolveReportPopup from "../../technical-support-feedback-employee/popups/SolveReportPopup";
import RejectReportPopup from "../popups/RejectReportPopup";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";

type ActionProps = {
  id: string;
  ReportDtos: ReportDtos;
  flag?: boolean;
};

export const Actions: FC<ActionProps> = ({ id, ReportDtos, flag }) => {
  const intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);

  const [solveShow, setSolveShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [delayShow, setDelayShow] = useState<boolean>(false);
  let [optin, setoptin] = useState("");
  let [searchParams, setSearchParams] = useSearchParams();

  let location = useLocation();
  const cardTitle =
    location?.state?.serviceName || location?.state?.cardTitle || "";

  let report = useSelector((state: RootState) => {
    return state?.GetReportById.report;
  });
  return (
    <>
      <div>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            <i className="bi bi-three-dots fs-4"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu className="menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-135px py-3">
            <Dropdown.Item
              as={Link}
              to={`/technical-support-feedbacks-manager/${id}/details`}
              state={{
                serviceName: cardTitle,
              }}
              className="px-3 text-muted"
            >
              <i className="fa-solid fa-eye mx-3"></i>
              {intl.formatMessage({ id: "Show" })}
            </Dropdown.Item>

            {ReportDtos?.status === 8 || ReportDtos?.status === 7 ? (
              searchParams.get("tabName") == "my-reports" && (
                <Fragment>
                  <Dropdown.Item
                    onClick={() => setRedirectShow(true)}
                    className="px-3 text-primary"
                  >
                    <i className="bi bi-repeat mx-3"></i>

                    {intl.formatMessage({ id: "Redirect" })}
                  </Dropdown.Item>
                </Fragment>
              )
            ) : (
              <></>
            )}

            {flag === false ? (
              ReportDtos?.status === 7 || ReportDtos?.status === 8 ? (
                searchParams.get("tabName") == "my-reports" && (
                  <Fragment>
                    <Dropdown.Item
                      onClick={() => setDelayShow(true)}
                      className="px-3 text-danger"
                    >
                      <i className="bi bi-calendar-plus mx-3"></i>
                      {intl.formatMessage({ id: "Delay" })}
                    </Dropdown.Item>
                  </Fragment>
                )
              ) : (
                <></>
              )
            ) : (
              ""
            )}

            {flag === true ? (
              ReportDtos?.status === 7 || ReportDtos?.status === 8 ? (
                searchParams.get("tabName") == "my-reports" && (
                  <Fragment>
                    <Dropdown.Item
                      onClick={() => setSolveShow(true)}
                      className="px-3 text-danger"
                    >
                      <i className="bi bi-calendar-plus mx-3"></i>
                      {intl.formatMessage({ id: "Solve" })}
                    </Dropdown.Item>
                  </Fragment>
                )
              ) : (
                <></>
              )
            ) : (
              ""
            )}

            {flag === true ? (
              ReportDtos?.status === 7 || ReportDtos?.status === 8 ? (
                <Fragment>
                  <Dropdown.Item
                    onClick={() => setRejectShow(true)}
                    className="px-3 text-danger"
                  >
                    <i className="bi bi-calendar-plus mx-3"></i>
                    {intl.formatMessage({ id: "Reject" })}
                  </Dropdown.Item>
                </Fragment>
              ) : (
                <></>
              )
            ) : (
              ""
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="modal fade" aria-hidden="true">
        {redirectShow ? (
          <RedirectPopup
            handleClose={() => setRedirectShow(false)}
            show={redirectShow}
            reportId={id}
            creatorId={ReportDtos?.creator}
            creatorEmail={ReportDtos?.creatorEmail}
            categoryName={ReportDtos?.mainClassificationName ?? ""}
            technetionId={ReportDtos?.technetionId ?? ""}
            mainclassificationId={ReportDtos?.mainClassificationId ?? ""}
            requestDate={report?.createOn}
            requestName={report?.reportTitle}
            requestType={report?.serviceCatalogName}
              requestNumber={report?.reportNumber}
          />
        ) : (
          ""
        )}

        {flag === false ? (
          delayShow ? (
            <DelayPopup
              show={delayShow}
              handleClose={() => setDelayShow(false)}
              reportId={id}
              creatorId={ReportDtos?.creator}
              creatorEmail={ReportDtos?.creatorEmail}
              technetionId={ReportDtos?.technetionId ?? ""}
              requestDate={report?.createOn}
              requestName={report?.reportTitle}
              requestType={report?.serviceCatalogName}
              requestNumber={report?.reportNumber}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {flag === true ? (
          solveShow ? (
            <SolveReportPopup
              show={solveShow}
              handleClose={() => setSolveShow(false)}
              technetionId={ReportDtos?.technetionId ?? ""}
              reportId={id}
              creatorId={ReportDtos?.creator}
              creatorEmail={ReportDtos?.creatorEmail}
              requestDate={report?.createOn}
              requestName={report?.reportTitle}
              requestType={report?.serviceCatalogName}
              requestNumber={report?.reportNumber}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {flag === true ? (
          rejectShow ? (
            <RejectReportPopup
              show={rejectShow}
              handleClose={() => setRejectShow(false)}
              reportId={id}
              technetionId={ReportDtos?.technetionId ?? ""}
              creatorId={ReportDtos?.creator}
              creatorEmail={ReportDtos?.creatorEmail}
              requestDate={report?.createOn}
              requestName={report?.reportTitle}
              requestType={report?.serviceCatalogName}
              requestNumber={report?.reportNumber}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
};
