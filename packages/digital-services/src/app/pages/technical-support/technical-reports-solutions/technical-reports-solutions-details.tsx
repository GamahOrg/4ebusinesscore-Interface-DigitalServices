import { FC } from "react";
import TechnicalReportsSolutionsDetailsHome from "./components/TechnicalReportsSolutionsDetails";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

const TechnicalReportsSolutionsDetails: FC = () => {
  let intl = useIntl();

  let location = useLocation();

  let mainClassificationId =
    location?.state?.mainClassificationId || location?.state?.extraState;
  let id = location?.state?.cardId;

  const breadcrumbItems = mainClassificationId
    ? [
        {
          path: `/main-categories/${mainClassificationId}`,
          defaultName: "MainCategories",
          name: "",
        },
        {
          path: `/technical-reports-solutions/${mainClassificationId}`,
          defaultName: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
          name: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
        },
        {
          path: "",
          defaultName: intl.formatMessage({
            id: "TechnicalReportsSolutionsDetails",
          }),
          name: "",
        },
      ]
    : [
        {
          path: `/technical-reports-solutions`,
          defaultName: "",
          name: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
        },
        {
          path: "",
          defaultName: intl.formatMessage({
            id: "TechnicalReportsSolutionsDetails",
          }),
          name: "",
        },
      ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({
          id: "TechnicalReportsSolutionsDetails",
        })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={mainClassificationId ? false : true}
        cardId={mainClassificationId || id}
        translate={false}
      />
      <TechnicalReportsSolutionsDetailsHome />
    </>
  );
};

export { TechnicalReportsSolutionsDetails };
