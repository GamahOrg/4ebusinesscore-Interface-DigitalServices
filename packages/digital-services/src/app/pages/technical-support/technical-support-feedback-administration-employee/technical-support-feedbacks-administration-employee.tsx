import { FC } from "react";
import TechnicalSupportAdminstrationEmployeeReports from "./components/TechnicalSupportAdminstrationEmployeeReports";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalSupportFeedbacksAdministrationEmployee: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let intl = useIntl();
  const breadcrumbItems = [
    {
      path: "",
      defaultName: intl.formatMessage({ id: "TechnicalSupportFeedbacks" }),
      name: intl.formatMessage({ id: "TechnicalSupportFeedbacks" }),
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "TechnicalSupportFeedbacks" })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />

      <TechnicalSupportAdminstrationEmployeeReports />
    </>
  );
};

export { TechnicalSupportFeedbacksAdministrationEmployee };
