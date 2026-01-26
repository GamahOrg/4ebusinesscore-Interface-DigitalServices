import { FC } from "react";
import ServiceLevelDetails from "./components/ServiceLevelDetails";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const TechnicalSupportServiceLevelAgreementDetailsSla: FC = () => {
  let intl = useIntl();

  const breadcrumbItems = [
    {
      path: "/technical-support-service-level-agreement-details",
      defaultName: intl.formatMessage({ id: "ServiceLevelAgreement" }),
      name: intl.formatMessage({ id: "ServiceLevelAgreement" }),
    },
    {
      path: "",
      defaultName: intl.formatMessage({ id: "AgreementLevelDatailsSla" }),
      name: "",
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "AgreementLevelDatailsSla" })}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        translate={false}
      />
      <ServiceLevelDetails />
    </>
  );
};

export default TechnicalSupportServiceLevelAgreementDetailsSla;
