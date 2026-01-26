import { FC } from "react";
import TechnicalSupportFeedbacksAdminstrationManagerDetailsHome from "./components/TechnicalSupportFeedbacksManagerDetails";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";

const TechnicalSupportFeedbacksAdminstrationManagerDetails: FC = () => {
  let intl = useIntl();
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";

  const breadcrumbItems = [
    {
      path: "/technical-support-feedbacks-adminstration-manager",
      defaultName: intl.formatMessage({
        id: "TechnicalSupportFeedbacksManager",
      }),
      name: intl.formatMessage({ id: "TechnicalSupportFeedbacksManager" }),
    },
    {
      path: "",
      name: intl.formatMessage({ id: "FeedbackDetails" }),
    },
  ];
  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "FeedbackDetails" })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <TechnicalSupportFeedbacksAdminstrationManagerDetailsHome />
    </>
  );
};

export { TechnicalSupportFeedbacksAdminstrationManagerDetails };
