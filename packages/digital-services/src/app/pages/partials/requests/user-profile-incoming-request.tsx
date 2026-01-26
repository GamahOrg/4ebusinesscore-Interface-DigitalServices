import { FC } from "react";
import { UserProfileRequestDetailsToolbar } from "./toolbar/UserProfileRequestsDetailsToolbar";
import RequestDetailsForIncoming from "./components/RequestDetailsForIncoming";
const UserProfileRequestDetailsForIncoming: FC = () => {
  return (
    <>
      <UserProfileRequestDetailsToolbar />
      <RequestDetailsForIncoming />
    </>
  );
};

export { UserProfileRequestDetailsForIncoming };
