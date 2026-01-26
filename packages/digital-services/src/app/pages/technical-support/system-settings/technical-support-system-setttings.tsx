import { useIntl } from "react-intl";
import { Tabs } from "./components/tabs";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useLocation } from "react-router-dom";

export const TechnicalSupportSystemSetttings = () => {
  let intl = useIntl();
  let location = useLocation();
  let id = location?.state?.mainClassificationId || "";
  let cardName = location?.state?.cardTitle;
  let serviceName = location?.state?.serviceName;

  const breadcrumbItems = [
    {
      defaultName:
        cardName ||
        serviceName ||
        intl.formatMessage({ id: "DigitalServicesNotifications" }),
      name:
        cardName ||
        serviceName ||
        intl.formatMessage({ id: "DigitalServicesNotifications" }),
    },
  ];
  return (
    <>
      <DynamicToolbar
        defaultTitle={
          cardName || serviceName || intl.formatMessage({ id: "DigitalServicesNotifications" })
        }
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <Tabs />
    </>
  );
};
