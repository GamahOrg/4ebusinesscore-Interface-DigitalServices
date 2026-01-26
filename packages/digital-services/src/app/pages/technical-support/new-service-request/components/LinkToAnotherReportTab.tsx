import { FC, Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { RootState, useAppDispatch, useAppSelector } from "../../../../redux/store/store";
import { getAllReports } from "../../../../redux/features/report/reportSlice";
import { OtherReportModel } from "../../../../models/ReportModel";

interface Iprop {
  active: any;
  setSourceReports:any; 
}
interface CheckboxState {
  id: boolean;
}

const LinkToAnotherReportTab: FC<Iprop> = ({ active ,setSourceReports  }) => {

  let intl = useIntl();
  const dispatch = useAppDispatch();
  
  const reports = useAppSelector((state: RootState) => state.report.data)
  const reportsStatus = useAppSelector((state: RootState) => state.report.status)
  
  const [checkboxes, setCheckboxes] = useState<Record<string, boolean>>({});


  useEffect(() => {
    setSourceReports(Object.keys(checkboxes).filter(key=>checkboxes[key]))
  }, [checkboxes])
  
  const handleCheckboxChange = (checkboxName: keyof CheckboxState) => {
    setCheckboxes({ ...checkboxes, [checkboxName]: !checkboxes[checkboxName] });
  };

  const onCheckboxChange = (id: string) => {
    const checkboxName = `${id}` as keyof CheckboxState;
    handleCheckboxChange(checkboxName);
  };
  
  const [filteredData, setFilteredData] = useState<OtherReportModel[]>([]);
  let [reportsData, setReportsData] = useState<OtherReportModel[]>([]);

  useEffect(() => {
    setFilteredData(reports);
    setReportsData(reports)
  },[reports])
  

  useEffect(() => {
    if (reportsData?.length) {
       const initialCheckboxes: Record<string, boolean> = {};
       reportsData.forEach((report) => {
         initialCheckboxes[`${report.id}`] = false;
       });
      setCheckboxes(initialCheckboxes)  
    }
  }, [reportsData])
  
  useEffect(() => {
    if (active) { 
      dispatch(getAllReports() as any)
    }
  },[active])

  const handleInputChange = (e:any) => {
    const inputValue = e.target.value.toLowerCase();
    const filtered = reportsData.filter((item) => {
      const titleMatch = item.reportTitle.toLowerCase().includes(inputValue);
      const numberMatch = item.reportNumber.toString().toLowerCase().includes(inputValue);
      return titleMatch || numberMatch;
    });
    setFilteredData(filtered);
  };
  return (
    <Fragment>
      <div
        className="tab-pane fade show"
        id="link"
        role="tabpanel"
        aria-labelledby="link-tab"
      >
        <div className="position-relative text-center py-4 w-90 mb-4 mx-auto">
          <input
            type="search"
            name="searchForProject"
            className="input input-group searchBoxDesign search_input"
            id="searchForProject"
            onChange={handleInputChange}
            placeholder={intl.formatMessage({
              id: "EnterTheReportNumberOrAddress",
            })}
          />
          <i className="fa-solid fa-light fa-magnifying-glass my-magnify fs-3 text-muted fa-fw position-absolute"></i>
        </div>
        <div style={{height:"240px", overflowY: "auto"}}>
        {reportsStatus=='loading' ?<p> جاري تحميل البلاغات السابقه..</p>:
        filteredData?filteredData?.map((item, index, arr) => {
          let { id, reportNumber, reportTitle } = item;
          return (
            <Fragment key={Math.random()}>
              <div
                className={`d-flex justify-content-between align-items-center my-5 pb-3 mx-5 h-fit ${
                  index !== arr.length - 1 ? "my-gray-dash-border" : ""
                }`}
              >
                <div className="d-flex align-items-center ">
                  <div className="d-flex mx-3 form-check form-check-custom form-check-success form-check-solid">
                    <input
                      className="form-check-input  form-check-success"
                      type="checkbox"
                      id="flexCheckDefault"
                      checked={checkboxes[`${id}` as keyof CheckboxState]}
                      onChange={() => onCheckboxChange(id)}

                    />
                  </div>
                  <p className="text-muted p-0 m-0 mx-3">{reportNumber}</p>
                  <p className="text-primary p-0 m-0 fw-bolder">{reportTitle}</p>
                </div>
              </div>
            </Fragment>
          );
        }):<span>لايوجد بلاغات سابقه</span>}
        </div>
      </div>
    </Fragment>
  );
};

export default LinkToAnotherReportTab;
