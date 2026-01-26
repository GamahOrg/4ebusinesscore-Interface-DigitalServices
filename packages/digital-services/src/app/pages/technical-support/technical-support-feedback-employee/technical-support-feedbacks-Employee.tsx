import { FC, Fragment } from "react";
import TechnicalSupportReportsHome from "./components/TechnicalSupportReports";
import { useLocation } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalSupportFeedbacksEmployee: FC = () => {
  let location = useLocation();
  let intl = useIntl();

  const breadcrumbItems = [
    {
      path: "",
      defaultName: intl.formatMessage({
        id: "TechnicalSupportEmployeeFeedbacks",
      }),
      name: intl.formatMessage({ id: "TechnicalSupportEmployeeFeedbacks" }),
    },
  ];

  return (
    <Fragment>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({
          id: "TechnicalSupportEmployeeFeedbacks",
        })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        translate={false}
      />

      <TechnicalSupportReportsHome />
    </Fragment>
  );
};

export { TechnicalSupportFeedbacksEmployee };
