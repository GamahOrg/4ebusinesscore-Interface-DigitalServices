import { FC, useState } from "react";
import { useIntl } from "react-intl";
import AddNewServiceRequestHome from "./components/AddNewServiceRequest";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
const AddNewServiceRequest: FC = () => {
  const intl = useIntl();

  let location = useLocation();
  let params = useParams();
  let id = location?.state?.mainClassificationId || "";
  let serviceName = location?.state?.serviceName;
  let cardName = location?.state?.cardTitle;
  const filtered = location?.hash;
  const [pageTitle, setPageTitle] = useState(
    `${intl.formatMessage({ id: "Add" }) + " " + serviceName || cardName}`
  );

  const breadcrumbItems = id
    ? [
        {
          path: `/main-categories/${id}`,
          defaultName: "MainCategories",
          name: "",
        },
        {
          path: `/new-service-request/${params?.id && filtered ? id : ""}`,
          defaultName:
            serviceName ||
            intl.formatMessage({ id: "RequestNewService" }),
          name:
            serviceName ||
            intl.formatMessage({ id: "RequestNewService" }),
        },
        { path: "", defaultName: "AddNewService", name: "" },
      ]
    : [
        {
          path: `/new-service-request/${id && filtered ? id : ""}`,
          defaultName:
            serviceName ||
            cardName ||
            intl.formatMessage({ id: "RequestNewService" }),
          name:
            serviceName ||
            cardName ||
            intl.formatMessage({ id: "RequestNewService" }),
        },
        {
          path: "",
          defaultName: intl.formatMessage({ id: "AddNewService" }),
          name: `${pageTitle}`,
        },
      ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "AddNewRequest" })}
        extraTitle={pageTitle}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <AddNewServiceRequestHome setPageTitle={setPageTitle} /> :
    </>
  );
};

export { AddNewServiceRequest };
