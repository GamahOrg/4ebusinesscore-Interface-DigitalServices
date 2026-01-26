import React, { FC } from "react";
import { useIntl } from "react-intl";
import { UserProfileRequestsToolbar } from "./toolbar/UserProfileRequestsToolbar";
import { UserProfileCard } from "../../UserProfileCard";
import RequestsTableForArchive from "./components/RequestsTableForArchive";

const UserProfileArchivedRequests: FC = () => {
  const intl = useIntl();
  return (
    <>
      <UserProfileRequestsToolbar />
      <UserProfileCard ActiveNav={intl.formatMessage({ id: "ArchivedRequests" })} />
      <RequestsTableForArchive/>
    </>
  );
};

export { UserProfileArchivedRequests };
