import { FC } from "react";
import EditingSolutionToTechnicalSupportReportsHome from "./components/EditingSolutionToTechnicalSupportReports";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
const EditingSolutionToTechnicalSupportReports: FC = () => {
  let location = useLocation();
  let intl = useIntl();

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
          defaultName: "",
          name: intl.formatMessage({
            id: "TechnicalReportsSolutions",
          }),
        },
        {
          path: "",
          defaultName: intl.formatMessage({
            id: "EditingSolutionToTechnicalSupportReports",
          }),
          name: "",
        },
      ]
    : [
        {
          path: `/technical-reports-solutions`,
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
            id: "EditingSolutionToTechnicalSupportReports",
          }),
          name: "",
        },
      ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({
          id: "EditingSolutionToTechnicalSupportReports",
        })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={mainClassificationId ? false : true}
        cardId={mainClassificationId || id}
        translate={false}
      />
      <EditingSolutionToTechnicalSupportReportsHome />
    </>
  );
};

export { EditingSolutionToTechnicalSupportReports };
