import { FC } from "react";
import { useIntl } from "react-intl";
import SwitchToggling from "./SwitchToggling";

interface INewsList {
  id: string;
  workspaceNameAR: string;
  workspaceNameEn: string;
  sendByMail: boolean;
  sendBySystem: boolean;
  notificationStatus: string;
  notificationStatusAr?: string;
}
export const NotificationsList: FC<{
  notification: INewsList;
  index: number;
}> = ({ notification, index }) => {
  const {
    id,
    workspaceNameAR,
    workspaceNameEn,
    sendByMail,
    sendBySystem,
    notificationStatus,
    notificationStatusAr,
  } = notification;
  const intl = useIntl();

  return (
    <>
      <td>
        <div
          className="text-primary fw-bolder text-hover-primary mb-1 fs-6"
          onClick={(event) => event.preventDefault()}
        >
          {index + 1}
        </div>
      </td>

      <td>
        <div className="d-flex align-items-center">
          <div className="d-flex justify-content-start flex-column">
            <a
              onClick={(event) => event.preventDefault()}
              className="text-dark fw-bolder mb-1 fs-6"
            >
              {intl.locale === "ar" ? workspaceNameAR : workspaceNameEn}
            </a>
          </div>
        </div>
      </td>

      <td className="text-center">
        <div className="text-dark fw-bolder  d-block mb-1 fs-6">
          {intl.locale === "ar" ? notificationStatusAr : notificationStatus}
        </div>
      </td>
      <td className="text-center">
        <SwitchToggling
          sendByMail={sendByMail}
          sendBySystem={sendBySystem}
          id={id}
          setToggle="mail"
        />
      </td>

      <td className="text-center">
        <SwitchToggling
          sendBySystem={sendBySystem}
          sendByMail={sendByMail}
          id={id}
          setToggle="system"
        />
      </td>
    </>
  );
};
