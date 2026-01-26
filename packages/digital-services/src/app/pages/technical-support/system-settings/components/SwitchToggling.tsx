import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import {
  getAllNotificationSettings,
  putNotificationSettings,
} from "../../../../redux/features/notifications/notificationsSlice";
import { TurnOnPopup } from "../popups/TurnOnPopup";
import { TurnOffPopup } from "../popups/TurnOffPopup";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { showAlert } from "@4eplatform/shared/services/showAlert";
interface SwitchTogglingProps {
  sendByMail: boolean;
  sendBySystem: boolean;
  id: string;
  setToggle: string;
}
const SwitchToggling: FC<SwitchTogglingProps> = ({
  sendByMail,
  sendBySystem,
  id,
  setToggle,
}) => {
  const intl = useIntl();
  const [isTurndeOn1, setIsTurndeOn1] = useState(
    setToggle === "mail" ? sendByMail : sendBySystem
  );
  const [showTurnOffModelA, setShowTurnOffModelA] = useState<boolean>(false);
  let [loading, setLoading] = useState(false);

  const [isClicked, setIsClicked] = useState(false);
  const [sendMail, setSendMail] = useState(sendByMail);
  const [sendSystem, setSendSystem] = useState(sendBySystem);

  const dispatch = useDispatch();

  const handleToggleCheckbox = async (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    showModalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    showModalSetter(true);
  };
  let pagination = useSelector((state: RootState) => {
    return state?.notifications?.pagination;
  });
  useEffect(() => {
    if (isClicked) {
      let data = {
          id,
          sendByMail: setToggle === "mail" ? !sendMail : sendByMail,
          sendBySystem: setToggle === "system" ? !sendSystem : sendBySystem,
      };

      if (setToggle === "mail") {
        setSendMail(!sendMail);
        setSendSystem(sendBySystem);
      } else {
        setSendSystem(!sendSystem);
        setSendMail(sendByMail);
      }
      setLoading(true);
      dispatch(putNotificationSettings(data) as any).then((res: any) => {
        setLoading(false);
        if (res?.payload?.message == "NotificationUpdatedSuccessfully") {
          setIsTurndeOn1(!isTurndeOn1);
          showAlert(true, "EditedSuccessfully", intl);
          dispatch(getAllNotificationSettings({
            PageNumber:pagination?.pageIndex ,
            PageSize: pagination?.pageSize,  
          }) as any);
        } else showAlert(false, res?.payload?.message,intl);
      });

      setIsClicked(false);
    }
  }, [isClicked]);
  return (
    <>
      <div className="form-check form-switch form-check-custom form-check-solid d-flex  justify-content-center ">
        <input
          className="form-check-input"
          type="checkbox"
          id="status1"
          name="status1"
          onChange={() => {
            handleToggleCheckbox(setIsTurndeOn1, setShowTurnOffModelA);
          }}
          checked={isTurndeOn1}
        />
      </div>
      {!isTurndeOn1 ? (
        <div className="modal fade" aria-hidden="true">
          <TurnOnPopup
            show={showTurnOffModelA}
            handleClose={() => setShowTurnOffModelA(false)}
            setIsClicked={() => setIsClicked(true)}
            loading={loading}
          />
        </div>
      ) : (
        <div className="modal fade" aria-hidden="true">
          <TurnOffPopup
            show={showTurnOffModelA}
            handleClose={() => setShowTurnOffModelA(false)}
            setIsClicked={() => setIsClicked(true)}
            loading={loading}
          />
        </div>
      )}
    </>
  );
};

export default SwitchToggling;
