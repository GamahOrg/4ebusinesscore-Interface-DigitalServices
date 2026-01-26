import { FC, Fragment, useEffect } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { getAllReportStatusByReportId } from "../../../../redux/features/service-operation/report/GetAllReportStatus";
import RequestPath from "../../approvals-requests/components/RequestPath";

type PopupProps = {
  reportId: string;
  requestId: string;
  technetionId: string;
  creatorId?: string;
  creatorName?: string;
  creatorEmail?: string;
  technicianName?: string;
  technicianEmail?: string;
  requestDetails: any;
};
const TrackTab: FC<PopupProps> = ({
  reportId,
  requestId,
  technetionId,
  creatorId,
  creatorEmail,
  creatorName,
  technicianName,
  technicianEmail,
  requestDetails,
}) => {
  let intl = useIntl();
  let { id } = useParams();
  const dispatch = useDispatch();
  const getAllReportSteps = useSelector((state: RootState) => {
    return state?.GetAllReportStatus?.item;
  });
  useEffect(() => {
    if (requestId != "00000000-0000-0000-0000-000000000000") {
      dispatch(getAllReportStatusByReportId(reportId) as any);
    }
  }, [reportId]);
  return (
    <Fragment>
      {/* <RequestPath
        steps={getAllReportSteps}
        request_id={requestId}
        technetionId={technetionId}
        creatorId={creatorId}
        creatorName={creatorEmail}
        creatorEmail={creatorName}
        technicianName={technicianName }
        technicianEmail={technicianEmail }
      /> */}
      <RequestPath
        creatorEmail={creatorEmail}
        creatorName={creatorName}
        creatorId={creatorId}
        requestDetails={getAllReportSteps}
        request_id={requestId}
        requestCategoryName={requestDetails?.requestCategoryName}
        fetchDataFrom={"technicalSupport"}
      />
    </Fragment>
  );
};

export default TrackTab;
