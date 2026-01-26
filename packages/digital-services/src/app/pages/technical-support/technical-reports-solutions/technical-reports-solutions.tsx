import { FC } from "react";
import TechnicalReportsSolutionsHome from "./components/TechnicalReportsSolutions";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalReportsSolutions: FC = () => {
  let intl = useIntl();
  let location = useLocation();
  let params = useParams();

  let mainClassificationId =
    location?.state?.mainClassificationId ||
    params?.classificationId ||
    location?.state?.extraState;
  let cardId = location?.state?.cardId;

  const breadcrumbItems = mainClassificationId
    ? [
        {
          path: `/main-categories/${mainClassificationId}`,
          defaultName: "MainCategories",
          name: "",
        },
        {
          path: "",
          defaultName: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
          name: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
        },
      ]
    : [
        {
          path: "",
          defaultName: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
          name: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
        },
      ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "TechnicalReportsSolutions" })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={mainClassificationId ? false : true}
        cardId={mainClassificationId || cardId}
        translate={false}
      />
      <TechnicalReportsSolutionsHome
        mainClassificationId={mainClassificationId}
      />
    </>
  );
};

export { TechnicalReportsSolutions };
