import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllDelegationFromUserByUserId } from "../../../../redux/features/delegation-slices/delegationSlice";
import EmployeeAssignRequestPath from "./EmployeeAssignRequestPath";
import SpecializedAssigneeRequestPath from "./SpecializedAssigneeRequestPath";
import ManagementsAssigneeRequestPath from "./ManagementsAssigneeRequestPath";

function AssigneeRequestPath({ item, requestTimeline }: any) {
  const dispatch = useDispatch();
  let [delegatedUserIds, setDelegatedUserIds] = useState<any>({});

  useEffect(() => {
    const body = {
      id: item?.actionTakerUserId?.toLowerCase(),
      myParams: {
        pageNumber: "1",
        pageSize: "100000",
      },
    };
    dispatch(getAllDelegationFromUserByUserId(body) as any).then((res: any) => {
      setDelegatedUserIds((prev: any) => {
        return {
          ...prev,
          [item?.actionTakerUserId?.toLowerCase()]: res?.payload?.result,
        };
      });
    });
  }, [item?.actionTakerUserId?.toLowerCase()]);
  
  return (
    <>
      {item?.actionTakerType == 0 ? (
        <>
          <EmployeeAssignRequestPath
            {...{
              delegatedUserIds,
              requestTimeline,
              item,
            }}
          />
        </>
      ) : item?.actionTakerType == 3 ? (
        <>
          <SpecializedAssigneeRequestPath
            {...{
              delegatedUserIds,
              requestTimeline,
              item,
            }}
          />
        </>
      ) : (
        <>
          <ManagementsAssigneeRequestPath
            {...{
              delegatedUserIds,
              requestTimeline,
              item,
            }}
          />
        </>
      )}
    </>
  );
}

export default AssigneeRequestPath;
