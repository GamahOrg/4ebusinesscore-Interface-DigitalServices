import { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { fetchRequsetdReport } from "../../../../redux/features/service-operation/report/GetRequsetdReportbyIdSlice";
import { RequsetdReportmodel } from "../../../../models/get-report/modelRequsetdReport";
import ApprovalDetails from "./ApprovalDetails";
interface putRequset {
  technetionId: string;
  options: string;
  reportId: string;
}
function TechnicalSupportFeedbacksAdminstrationManagerApprovalDetails() {
  const [modalShow, setModalShow] = useState<boolean>(false);
  let intl = useIntl();
  const [rejectShow, setRejectShow] = useState<boolean>(false);
  let RequsetdReport = useSelector((state: RootState) => {
    return state?.GetRequsetdReportbyId.RequsetdRepor;
  });
  const [data, setdata] = useState<RequsetdReportmodel[]>([])
  let navigate=useNavigate();
  const dispatch = useDispatch();
  const parms = useParams();
  let reportId = `${parms.id}`;
  useEffect(() => {
    
    let prams = {
      pageSize: 1000,
      pageNumber: 1,
    };
    dispatch(fetchRequsetdReport({ 
      params: prams }) as any);
  }, []);
  let [note, setnote] = useState<string>("");
  useEffect(() => {
    setdata(RequsetdReport as any);
  }, [RequsetdReport]);
  return (
  <>
  {data?.length?
  data?.map((a)=>{
    return(
      <ApprovalDetails responseReport={a} />
    )

  }):(
    <Fragment>
    <div className="detailsCard my-5">
      <div className="card card-xl-stretch mb-xl-6 pt-7">
        <h2 className="text-center fw-bolder mb-7 mt-8">
          {intl.formatMessage({ id: "DetailsOfTheServiceApprovalRequest" })}
        </h2>   
      </div>
    </div>
  </Fragment>
  )}
 
  </>
  );
}

export default TechnicalSupportFeedbacksAdminstrationManagerApprovalDetails;
