import { FC } from "react";
import RequestDetailsForOutgoing from "./components/RequestDetailsForOutgoing";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const ApprovalsRequestDetailsForOutgoingHome: FC = () => {
  let intl = useIntl();
  const breadcrumbItems = [
    {
      path: `/approvals-requests?tabName=OutgoingRequests`,
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
      <RequestDetailsForOutgoing />
    </>
  );
};

export { ApprovalsRequestDetailsForOutgoingHome };
