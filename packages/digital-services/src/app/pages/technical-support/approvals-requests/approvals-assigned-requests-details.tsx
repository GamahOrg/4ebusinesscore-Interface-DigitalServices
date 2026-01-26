import { FC } from "react";
import RequestDetailsForAssigning from "./components/RequestDetailsForAssigning";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

const ApprovalsRequestDetailsForAssignedHome: FC = () => {
  let intl = useIntl();
  const breadcrumbItems = [
    {
      path: `/approvals-requests?tabName=AssignedRequests`,
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
      <RequestDetailsForAssigning />
    </>
  );
};

export { ApprovalsRequestDetailsForAssignedHome };
