import { FC } from "react";
import ManagerReportsDetails from "./components/ManagerReportsDetails";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";

const TechnicalSupportManagerDetails: FC = () => {
  let intl = useIntl();
  let location = useLocation();

  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      path: "/technical-support-feedbacks-manager",
      defaultName: intl.formatMessage({ id: "TechnicalSupportAdminFeedbacks" }),
      name: intl.formatMessage({ id: "TechnicalSupportAdminFeedbacks" }),
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
      <ManagerReportsDetails />
    </>
  );
};

export { TechnicalSupportManagerDetails };
