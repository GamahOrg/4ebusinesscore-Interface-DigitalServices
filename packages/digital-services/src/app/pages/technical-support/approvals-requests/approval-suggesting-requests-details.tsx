import { FC } from "react";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import RequestDetailsForSuggesting from "./components/RequestDetailsForSuggesting";
import { useIntl } from "react-intl";

const ApprovalsRequestDetailsForSuggestingHome: FC = () => {
  let intl = useIntl();
  const breadcrumbItems = [
    {
      path: `/approvals-requests?tabName=SuggestedRequests`,
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
      <RequestDetailsForSuggesting />
    </>
  );
};

export { ApprovalsRequestDetailsForSuggestingHome };
