import { FC, useState } from "react";
import { useIntl } from "react-intl";
import RedirectPopup from "../popups/RedirectPopup";
import DelayPopup from "../popups/DelayPopup";
import { ReportDtos } from "../../../../models/get-report/ResponseReport";
import SolveReportPopup from "../../technical-support-feedback-employee/popups/SolveReportPopup";
import RejectReportPopup from "../popups/RejectReportPopup";
import { Dropdown } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";

type ActionProps = {
  id: string;
  ReportDtos: ReportDtos;
  flag?: boolean;
  currentReport?: string;
};

export const Actions: FC<ActionProps> = ({
  id,
  ReportDtos,
  flag,
  currentReport,
}) => {
  const intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);

  const [solveShow, setSolveShow] = useState<boolean>(false);
  const [redirectShow, setRedirectShow] = useState<boolean>(false);
  const [delayShow, setDelayShow] = useState<boolean>(false);
  let [optin, setoptin] = useState("");
  let location = useLocation();
  let navigate = useNavigate();
  const cardTitle = location?.state?.cardTitle;
  const { systemId } = useParams();

  const dispatch = useDispatch();
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
              onClick={() =>
                navigate(
                  !systemId
                    ? `/technical-support-feedbacks-employee/${id}/details`
                    : `/course-approvals/${id}/details`,
                  {
                    state: {
                      mainClassificationId: id,
                      serviceName: cardTitle,
                      systemId,
                    },
                  }
                )
              }
              className="px-3 text-muted"
            >
              <i className="fa-solid fa-eye mx-3"></i>
              {intl.formatMessage({ id: "Show" })}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="modal fade" aria-hidden="true">
        {redirectShow ? (
          <RedirectPopup
            handleClose={() => setRedirectShow(false)}
            show={redirectShow}
            reportId={id}
            categoryName={ReportDtos?.mainClassificationName ?? ""}
            technetionId={ReportDtos?.technetionId ?? ""}
            mainclassificationId={ReportDtos?.mainClassificationId ?? ""}
            creatorId={ReportDtos?.creator}
            creatorEmail={ReportDtos?.creatorEmail}
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
              currentReport={currentReport}
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
              currentReport={currentReport}
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
