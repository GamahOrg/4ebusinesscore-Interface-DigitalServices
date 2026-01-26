import { FC } from "react";
import NewServiceRequestHome from "./components/NewServiceRequest";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const NewServiceRequest: FC = () => {
  let location = useLocation();
  let params = useParams();
  let id = location?.state?.mainClassificationId || params?.id || "";
  let serviceName = location?.state?.serviceName;
  let cardName = location?.state?.cardTitle;
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
          defaultName: "",
          name:
            serviceName ||
            cardName ||
            intl.formatMessage({ id: "RequestNewService" }),
        },
      ]
    : [
        {
          path: "",
          defaultName:
            serviceName ||
            cardName ||
            intl.formatMessage({ id: "RequestNewService" }),
          name:
            serviceName ||
            cardName ||
            intl.formatMessage({ id: "RequestNewService" }),
        },
      ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={
          serviceName ||
          cardName ||
          intl.formatMessage({ id: "RequestNewService" })
        }
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <NewServiceRequestHome />
    </>
  );
};

export { NewServiceRequest };
