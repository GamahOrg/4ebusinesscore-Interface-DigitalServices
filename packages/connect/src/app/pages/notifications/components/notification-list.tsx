import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { useAppDispatch } from "../../../store/store";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "../../../features/notifiactionsSlice";
import { setNotification, setWorkspaceKey } from "@4eplatform/shared/index";
import { SystemLang } from "@4eplatform/shared/assets/Lang";
import { Actions } from "./Actions";

interface INotificationList {
  notification: any;
  incomingRequests?: any;
  setIncomingRequests?: any;
  pageSize?: number;
  pageIndex?: number;
}

export const NotificationList: FC<INotificationList> = ({
  notification,
  incomingRequests,
  setIncomingRequests,
  pageIndex,
  pageSize,
}) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const deleteHandler = async () => {
    dispatch(deleteNotification(notification?.id) as any).then((res: any) => {
      if (res?.payload?.statusEnum === 1) {
        window.dispatchEvent(new Event("notificationDeleted"));
        dispatch(getNotifications({ pageIndex, pageSize }) as any);
        showAlert(true, "DeletedSuccessfully", intl);
        return true;
      }
    });
  };

  const navigationHandler = () => {
    if (!notification?.readed) {
      dispatch(markNotificationAsRead(notification?.id) as any);
      setNotification(notification?.id);
    }
    localStorage.setItem(
      "subSystemId",
      notification?.subsystemid?.toLowerCase() as string
    );
    localStorage.setItem("ClassificationName", "null");
    localStorage.setItem("isSubSystem", "true");
    setWorkspaceKey(notification?.workspaceKeyTo);
    let updatedUrl = "";
    let incomingRequestIds = incomingRequests?.map((request: any) => {
      return request?.id;
    });
    if (notification?.actionUrl?.includes("details-for-incoming")) {
      let regex = /([0-9a-fA-F\-]{36})/;
      const requestId = notification?.actionUrl?.match(regex)[1];
      if (!incomingRequestIds?.includes(requestId)) {
        updatedUrl = notification?.actionUrl?.replace("incoming", "archive");
        // navigate(updatedUrl, { state: { cardTitle: notification?.cardname } });
        localStorage.setItem(
          "cardName",
          JSON.stringify({
            nameAr: notification?.cardname,
            nameEn: notification?.cardname,
          })
        );
        window.location.href =
          (window as any)._env_?.REACT_APP_Base_Url + updatedUrl;
      } else {
        // navigate(notification?.actionUrl, {
        //   state: { cardTitle: notification?.cardname },
        // });
        localStorage.setItem(
          "cardName",
          JSON.stringify({
            nameAr: notification?.cardname,
            nameEn: notification?.cardname,
          })
        );
        window.location.href =
          (window as any)._env_?.REACT_APP_Base_Url + notification?.actionUrl;
      }
    } else {
      // navigate(notification?.actionUrl, {
      //   state: { cardTitle: notification?.cardname },
      // });
      localStorage.setItem(
        "cardName",
        JSON.stringify({
          nameAr: notification?.cardname,
          nameEn: notification?.cardname,
        })
      );
      window.location.href =
        (window as any)._env_?.REACT_APP_Base_Url + notification?.actionUrl;
    }
  };
  return (
    <>
      <td className="min-w-150px">
        <span
          onClick={() => {
            navigationHandler();
          }}
          className="text-dark fw-bolder cursor-pointer text-hover-primary mb-1 fs-7"
        >
          {/* {intl.formatMessage({ id: "TechnicalSupportFeedbacks" })} */}
          {SystemLang() == "ar"
            ? notification?.noteNameAR
            : notification?.noteNameEn}
        </span>
      </td>
      <td className="text-center min-w-150px">
        <span
          onClick={() => {
            navigationHandler();
          }}
          className="cursor-pointer text-dark fw-bolder text-hover-primary mb-1 fs-7"
        >
          {SystemLang() == "ar" ? notification?.title : notification?.titleEn}
        </span>
      </td>

      <td className="text-center min-w-150px">
        <span className="text-dark fw-bolder text-hover-primary mb-1 fs-7">
          {moment(notification.createdOn).format("YYYY-MM-DD")}
        </span>
      </td>

      <td className="text-center min-w-150px">
        <Actions
          id={notification?.id}
          notification={notification}
          isDelete={true}
          deleteHandler={deleteHandler}
          navigationHandler={() => navigationHandler()}
          show={{ isShow: true, link: notification?.actionUrl }}
          edit={{ isEdit: false, link: "#" }}
        />
      </td>
    </>
  );
};
