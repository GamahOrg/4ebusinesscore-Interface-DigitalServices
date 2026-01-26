import { FC } from "react";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";
import RequestDetailsForCanceling from "./components/RequestDetailsForCanceling";

const ApprovalsRequestDetailsForCancelingHome: FC = () => {
  let intl = useIntl();
  const breadcrumbItems = [
    {
      path: `/approvals-requests?tabName=CanceledRequests`,
      defaultName: intl.formatMessage({ id: "Incoming&OutgoingRequests" }),
      name: intl.formatMessage({ id: "Incoming&OutgoingRequests" }),
    },
    {
      path: "",
      defaultName: intl.formatMessage({ id: "RequestDetails" }),
      name: "",
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "RequestDetails" })}
        fixedTitle={true}
        extraTitle={""}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        translate={false}
      />
      <RequestDetailsForCanceling />
    </>
  );
};

export { ApprovalsRequestDetailsForCancelingHome };
