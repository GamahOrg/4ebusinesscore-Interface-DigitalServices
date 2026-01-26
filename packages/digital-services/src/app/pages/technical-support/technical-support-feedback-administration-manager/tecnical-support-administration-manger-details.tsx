import { FC } from "react";
import AdministrationManagerReportsDetails from "./components/AdministrationManagerReportsDetails";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalSupportAdministrationManagerDetails: FC = () => {
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
      <AdministrationManagerReportsDetails />
    </>
  );
};

export { TechnicalSupportAdministrationManagerDetails };
