import { FC } from "react";
import TechnicalSupportFeedbacksManagerHome from "./components/TechnicalSupportFeedbacksAdminstrationManager";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";
const TechnicalSupportFeedbacksManager: FC = () => {
  let location = useLocation();
  let intl = useIntl();

  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "",
      defaultName: intl.formatMessage({ id: "TechnicalSupportAdminFeedbacks" }),
      name: intl.formatMessage({ id: "TechnicalSupportAdminFeedbacks" }),
    },
  ];
  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({
          id: "TechnicalSupportAdminFeedbacks",
        })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <TechnicalSupportFeedbacksManagerHome />
    </>
  );
};

export { TechnicalSupportFeedbacksManager };
