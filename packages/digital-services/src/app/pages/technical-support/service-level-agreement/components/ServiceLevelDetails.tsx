import { FC, Fragment } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
  RootState,
} from "../../../../redux/store/store";
import { getSlaById } from "../../../../redux/features/SLA/slaDetailsSlice";
import { fetchAllEscalationLevelsBySlaId } from "../../../../redux/features/SLA/escalationLevelsBySlaSlice";
import { fetchUsers } from "../../../../redux/features/SLA/usersSlice";
const ServiceLevelDetails: FC = () => {
  const intl = useIntl();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const slaDetails = useAppSelector((state: RootState) => {
    return state?.slaDetails?.item;
  });

  const escalationLevelsBySlaId = useAppSelector(
    (state: RootState) => state?.escalationLevelsBySla?.items,
  );
  let users = useAppSelector((state) => {
    return state?.users?.data;
  });
  useEffect(() => {
    dispatch(getSlaById(id));
    dispatch(fetchAllEscalationLevelsBySlaId(id) as any);
  }, [id]);
  let theme = localStorage.getItem("Theme");
  useEffect(() => {
    dispatch(fetchUsers({ pageSize: "1000", pageNumber: "1" }) as any);
  }, []);
  return (
    <>
      <div className=" my-5">
        <div className="card card-xl-stretch mb-xl-0">
          <div className="card-header px-3 pt-3 pb-2  d-flex bg-light  border-secondary border-0 border-top-1 border-bottom-1 border-dashed   mx-7 mt-10 mb-5 ">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bolder fs-4 mb-2 ">
                {intl.formatMessage({ id: "AgreementData" })}
              </span>
              <span className="mt-1 fw-semibold fs-6">
                {intl.formatMessage({ id: "CurrentAgreementData" })}
              </span>
            </h3>
          </div>
          <div className="card-body py-3 px-3">
            <div className="tab-content">
              <div
                className="tab-pane fade active show"
                id="REGA_table_widget_5_tab_1"
              >
                <div className="mx-4">
                  <div className="row mb-5 mt-1 mx-1 rounded border-secondary shadow-sm gy-5">
                    <div className="col-4">
                      <span className="text-primary">
                        {intl.formatMessage({ id: "SLAName" })} :{" "}
                      </span>
                      <span
                        className={`fw-bolder ${
                          theme == "dark" ? "dark_mute_text" : ""
                        }`}
                        style={{
                          direction: intl.locale === "ar" ? "rtl" : "ltr",
                        }}
                      >
                        {slaDetails && intl.locale == "ar"
                          ? slaDetails[0]?.slaName
                          : slaDetails[0]?.slaNameEn}
                      </span>
                    </div>
                    <div className="col-4">
                      <span className="text-primary">
                        {intl.formatMessage({ id: "OrderImplementationTime" })}{" "}
                        :{" "}
                      </span>
                      <span
                        className={`fw-bolder ${
                          theme == "dark" ? "dark_mute_text" : ""
                        }`}
                      >
                        {slaDetails && slaDetails[0]?.implementDays}{" "}
                        {intl.formatMessage({ id: "Days" })}{" "}
                        {slaDetails && slaDetails[0]?.implementHours}{" "}
                        {intl.formatMessage({ id: "Hours" })}{" "}
                        {slaDetails && slaDetails[0]?.implementMinutes}{" "}
                        {intl.formatMessage({ id: "Minutes" })}
                      </span>
                    </div>
                    <div className="col-4">
                      <span className="text-primary">
                        {intl.formatMessage({ id: "ResponseTime" })} :{" "}
                      </span>
                      <span
                        className={`fw-bolder ${
                          theme == "dark" ? "dark_mute_text" : ""
                        }`}
                      >
                        {slaDetails && slaDetails[0]?.respondDays}{" "}
                        {intl.formatMessage({ id: "Days" })}{" "}
                        {slaDetails && slaDetails[0]?.respondHours}{" "}
                        {intl.formatMessage({ id: "Hours" })}{" "}
                        {slaDetails && slaDetails[0]?.respondMinutes}{" "}
                        {intl.formatMessage({ id: "Minutes" })}
                      </span>
                    </div>
                    <div className="col-12 my-5">
                      <span className="text-primary">
                        {intl.formatMessage({ id: "Description" })} :{" "}
                      </span>
                      <span
                        className={`fw-bolder ${
                          theme == "dark" ? "dark_mute_text" : ""
                        }`}
                      >
                        {intl.locale == "ar"
                          ? slaDetails[0]?.description
                          : slaDetails[0]?.descriptionEn}
                      </span>
                    </div>
                  </div>

                  {escalationLevelsBySlaId?.length > 0 && (
                    <>
                      <div className="table-responsive mt-8">
                        <table
                          className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4"
                          id="REGA-WS-caseList"
                        >
                          <thead>
                            <tr className="fw-bolder">
                              <th className="ps-4 min-w-150px text-center">
                                <span
                                  className={`fw-bolder ${
                                    theme == "dark" ? "dark_mute_text" : ""
                                  }`}
                                >
                                  {intl.formatMessage({ id: "Index" })}
                                </span>
                              </th>
                              <th className="min-w-150px text-center">
                                <span
                                  className={`fw-bolder ${
                                    theme == "dark" ? "dark_mute_text" : ""
                                  }`}
                                >
                                  {intl.formatMessage({ id: "Level" })}{" "}
                                </span>
                              </th>
                              <th className="min-w-150px text-center">
                                <span
                                  className={`fw-bolder ${
                                    theme == "dark" ? "dark_mute_text" : ""
                                  }`}
                                >
                                  {intl.formatMessage({ id: "Responsible" })}{" "}
                                </span>
                              </th>
                              <th className="min-w-150px text-center">
                                <span
                                  className={`fw-bolder ${
                                    theme == "dark" ? "dark_mute_text" : ""
                                  }`}
                                >
                                  {intl.formatMessage({ id: "Duration" })}{" "}
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {escalationLevelsBySlaId?.map(
                              (item: any, index: any) => {
                                return (
                                  <Fragment key={item?.id}>
                                    <tr>
                                      <td className="text-center border-end border-bottom fw-bolder text-dark">
                                        {index}
                                      </td>
                                      <td className="text-center border-end border-bottom fw-bolder text-dark">
                                        {item?.escalationLevelName}
                                      </td>
                                      <td className="text-center border-end border-bottom fw-bolder text-dark">
                                        {
                                          users?.find((user: any) => {
                                            return user?.id == item?.userId;
                                          })?.userName
                                        }
                                      </td>
                                      <td className="text-center border-end border-bottom fw-bolder text-dark">
                                        {item?.responseMinutes}{" "}
                                        {intl.formatMessage({ id: "Minutes" })}{" "}
                                        {item?.responseHours}{" "}
                                        {intl.formatMessage({ id: "Hours" })}{" "}
                                        {item?.responseDays}{" "}
                                        {intl.formatMessage({ id: "Days" })}{" "}
                                      </td>
                                    </tr>
                                  </Fragment>
                                );
                              },
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceLevelDetails;
