import { FC } from "react";
import TechnicalSupportFeedbacksManagerHome from "./components/TechnicalSupportFeedbacksManager";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
const TechnicalSupportFeedbacksAdminstrationManager: FC = () => {
  let location = useLocation();
  let intl = useIntl();

  let id = location?.state?.mainClassificationId || "";

  const breadcrumbItems = [
    {
      path: "",
      defaultName: intl.formatMessage({
        id: "TechnicalSupportFeedbacksManager",
      }),
      name: intl.formatMessage({ id: "TechnicalSupportFeedbacksManager" }),
    },
  ];
  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({
          id: "TechnicalSupportFeedbacksManager",
        })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />

      <TechnicalSupportFeedbacksManagerHome />
    </>
  );
};

export { TechnicalSupportFeedbacksAdminstrationManager };
