import { FC, Fragment, useEffect, useState } from "react";
import { ResolveReportDto } from "../../../../../models/ResolveReportDto";
import moment from "moment";
import { Actions } from "../Actions";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useIntl } from "react-intl";

interface Iprop {
  item: ResolveReportDto;
  userRoleId?: any;
  userLoggedIn?: any;
}
export const TechnicalReportsSolutionsRow: FC<Iprop> = ({
  item,
  userRoleId,
  userLoggedIn,
}) => {
  const { classificationId } = useParams();
  const [MainId, setMainId] = useState("");
  useEffect(() => {
    if (classificationId) setMainId(classificationId);
  }, [classificationId]);
  let intl = useIntl();
  let location = useLocation();
  let cardTitle = location?.state?.cardTitle || location?.state?.serviceName;
  let cardId = location?.state?.cardId;
  let mainClassificationIdLocation =
    location?.state?.mainClassificationId || location?.state?.extraState;
  let mainClassifications = useSelector((state: RootState) => {
    return state?.mainClassificationService.items;
  });
  let mainClassificationName =
    intl.locale == "ar"
      ? mainClassifications?.find((ele: any) => {
          return (
            ele?.mainClassificationId?.toLowerCase() ==
            item?.mainClassificationId?.toLowerCase()
          );
        })?.mainClassificationName
      : mainClassifications?.find((ele: any) => {
          return (
            ele?.mainClassificationId?.toLowerCase() ==
            item?.mainClassificationId?.toLowerCase()
          );
        })?.mainClassificationNameEn;
  return (
    <Fragment key={item?.id}>
      <tr>
        <td>
          <Link
            to={`/technical-reports-solutions/${item?.id}/details/${MainId}`}
            state={{
              mainClassificationId: mainClassificationIdLocation,
              cardId,
              cardTitle,
            }}
          >
            <p className=" text-center">{item?.resolveName || "-"}</p>
          </Link>
        </td>
        <td className="text-center">{item?.resolveDescription || "-"}</td>
        <td className="text-center">{mainClassificationName || "-"}</td>
        <td className="text-center">
          <p>{moment(item?.createdOn).format("YYYY-MM-DD") || "-"}</p>
        </td>
        <td>
          <div className="text-center">
            <Actions
              userRoleId={userRoleId}
              userLoggedIn={userLoggedIn}
              id={item?.id}
            />
          </div>
        </td>
      </tr>
    </Fragment>
  );
};

export default TechnicalReportsSolutionsRow;
