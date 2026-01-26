import { FC } from "react";
import { UserProfileRequestDetailsToolbar } from "./toolbar/UserProfileRequestsDetailsToolbar";
import RequestDetailsForAssigning from "./components/RequestDetailsForAssigning";

const UserProfileRequestDetailsForAssign: FC = () => {
  return (
    <>
      <UserProfileRequestDetailsToolbar />
     <RequestDetailsForAssigning/> 
    </>
  );
};

export { UserProfileRequestDetailsForAssign};
