import { FC } from "react";
import { UserProfileRequestDetailsToolbar } from "./toolbar/UserProfileRequestsDetailsToolbar";
import RequestDetailsForSuggested from "./components/RequestDetailsForSuggested";

const UserProfileRequestDetailsForSuggested: FC = () => {
  return (
    <>
      <UserProfileRequestDetailsToolbar />
     <RequestDetailsForSuggested/> 
    </>
  );
};

export { UserProfileRequestDetailsForSuggested };
