import { FC } from "react";
import CurrentServiceReportHome from "./components/CurrentServiceReport";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const CurrentServiceReport: FC = () => {
  let location = useLocation();
  let params = useParams();
  let id = location?.state?.mainClassificationId || params?.id || "";

  let intl = useIntl();

  const breadcrumbItems = id
    ? [
        {
          path: `/main-categories/${id}`,
          defaultName: "MainCategories",
          name: "",
        },
        {
          path: "",
          defaultName: intl.formatMessage({ id: "CurrentServiceReportt" }),
          name: intl.formatMessage({ id: "CurrentServiceReportt" }),
        },
      ]
    : [
        {
          path: "",
          defaultName: intl.formatMessage({ id: "CurrentServiceReportt" }),
          name: intl.formatMessage({ id: "CurrentServiceReportt" }),
        },
      ];
  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "CurrentServiceReportt" })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <CurrentServiceReportHome />
    </>
  );
};

export { CurrentServiceReport };
