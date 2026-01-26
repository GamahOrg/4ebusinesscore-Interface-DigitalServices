import { FC } from "react";
import TechnicalSupportEmployeeDetails from "./components/TechnicalSupportEmployeeDetails";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalSupportFeedbacksEmployeeDetails: FC = () => {
  let intl = useIntl();
  const breadcrumbItems = [
    {
      path: "/technical-support-feedbacks-employee",
      defaultName: intl.formatMessage({
        id: "TechnicalSupportEmployeeFeedbacks",
      }),
      name: intl.formatMessage({ id: "TechnicalSupportEmployeeFeedbacks" }),
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
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        translate={false}
      />

      <TechnicalSupportEmployeeDetails />
    </>
  );
};

export { TechnicalSupportFeedbacksEmployeeDetails };
