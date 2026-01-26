import { FC } from "react";
import { UserProfileRequestDetailsToolbar } from "./toolbar/UserProfileRequestsDetailsToolbar";
import RequestDetailsForOutgoing from "./components/RequestDetailsForOutgoing";

const UserProfileRequestDetailsForOutgoing: FC = () => {
  return (
    <>
      <UserProfileRequestDetailsToolbar />
     <RequestDetailsForOutgoing/> 
    </>
  );
};

export { UserProfileRequestDetailsForOutgoing };
