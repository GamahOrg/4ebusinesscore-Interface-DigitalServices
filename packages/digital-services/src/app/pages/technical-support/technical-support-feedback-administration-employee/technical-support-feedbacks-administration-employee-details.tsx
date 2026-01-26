import { FC } from "react";
import TechnicalSupportAdminstrationEmployeeReportsDetails from "./components/TechnicalSupportAdminstrationEmployeeReportsDetails";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalSupportFeedbacksAdministrationEmployeeDetails: FC = () => {
  let location = useLocation();
  let intl = useIntl();
  let id = location?.state?.mainClassificationId || "";

  const breadcrumbItems = [
    {
      path: "/technical-support-feedbacks-administration-employee",
      defaultName: intl.formatMessage({ id: "TechnicalSupportFeedbacks" }),
      name: intl.formatMessage({ id: "TechnicalSupportFeedbacks" }),
    },
    {
      path: "",
      defaultName: intl.formatMessage({ id: "FeedbackDetails" }),
      name: "",
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "FeedbackDetails" })}
        extraTitle={""}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />

      <TechnicalSupportAdminstrationEmployeeReportsDetails />
    </>
  );
};

export { TechnicalSupportFeedbacksAdministrationEmployeeDetails };
