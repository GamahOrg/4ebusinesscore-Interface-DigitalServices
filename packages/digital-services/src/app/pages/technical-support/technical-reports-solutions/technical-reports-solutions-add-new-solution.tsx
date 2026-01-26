import { FC } from "react";
import { useLocation } from "react-router-dom";
import AddingNewSolutionToTechnicalSupportReportsHome from "./components/AddingNewSolutionToTechnicalSupportReports";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const AddingNewSolutionToTechnicalSupportReports: FC = () => {
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
            id: "AddingNewSolutionToTechnicalSupportReports",
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
            id: "AddingNewSolutionToTechnicalSupportReports",
          }),
          name: "",
        },
      ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({
          id: "AddingNewSolutionToTechnicalSupportReports",
        })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={mainClassificationId ? false : true}
        cardId={mainClassificationId || id}
        translate={false}
      />
      <AddingNewSolutionToTechnicalSupportReportsHome
        idFormainClassification={mainClassificationId}
      />
    </>
  );
};

export { AddingNewSolutionToTechnicalSupportReports };
