import { FC } from "react";
import { ReportsTable } from "./components/reports-table";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

const TechnicalSupportReportsV2: FC = () => {
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let intl = useIntl();

  const breadcrumbItems = [
    {
      path: "",
      defaultName: intl.formatMessage({ id: "TechnicalSupportReports" }),
      name: intl.formatMessage({ id: "TechnicalSupportReports" }),
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "TechnicalSupportReports" })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        cardId={id}
        translate={false}
      />

      <ReportsTable />
    </>
  );
};

export default TechnicalSupportReportsV2;
