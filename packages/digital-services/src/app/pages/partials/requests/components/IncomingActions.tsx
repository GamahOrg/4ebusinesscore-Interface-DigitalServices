import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AcceptPopup } from "../popups/AcceptPopup";
import { RejectPopup } from "../popups/RejectPopup";
import { useDispatch, useSelector } from "react-redux";
import { AcceptPopupForApprovals } from "../../../technical-support/approvals-requests/popups/AcceptPopupForApprovals";
import { RejectPopupForApprovals } from "../../../technical-support/approvals-requests/popups/RejectPopupForApprovals";

type ActionProps = {
  id: number;
  item: any;
  systemId?: any;
  location?: any;
  pageIndex?: number;
  pageSize?: number;
  callingAllRequests?: any;
};

export const IncomingActions: FC<ActionProps> = ({
  id,
  item,
  systemId,
  location,
  pageIndex,
  pageSize,
  callingAllRequests,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalRShow, setModalRShow] = useState<boolean>(false);

  let cardName = location?.state?.cardTitle;
  let cardId = location?.state?.cardId;

  return (
    <>
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle
          split
          variant="none"
          className=" p-0 text-center"
          id="dropdown-custom-2"
        >
          <i className="bi bi-three-dots fs-2" style={{ color: "#7e8299" }}></i>
        </Dropdown.Toggle>
        <Dropdown.Menu className="py-0">
          <a
            onClick={() => {
              navigate(
                systemId
                  ? `/approvals-requests/${item?.id}/details-for-incoming/${systemId}`
                  : location?.pathname === "/approvals-requests"
                    ? `/approvals-requests/${item?.id}/details-for-incoming`
                    : `/user-profile/requests/${item?.id}/details-for-incoming`
              ,{state: { cardId: cardId, cardTitle: cardName }})
            }}
            className="menu-link text-muted "
          >
            <Dropdown.Item as="button" className="m-0 py-2">
              <i className="fa-solid fa-eye mx-2"></i>
              {intl.formatMessage({ id: "ShowAndTakeAction" })}{" "}
            </Dropdown.Item>
          </a>
          <Dropdown.Item
            as="button"
            className="text-success bg-hover-success text-hover-white m-0 py-2"
            onClick={() => setModalShow(true)}
          >
            <i className="fa-solid fa-eye mx-2"></i>
            {intl.formatMessage({ id: "Accept" })}
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            className="text-danger bg-hover-danger text-hover-white m-0 py-2"
            onClick={() => setModalRShow(true)}
          >
            <i className="fa-solid fa-eye mx-2"></i>
            {intl.formatMessage({ id: "Reject" })}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {modalShow &&
        (systemId ? (
          <AcceptPopupForApprovals
            show={modalShow}
            handleClose={() => setModalShow(false)}
            id={item?.id}
            pageIndex={pageIndex}
            pageSize={pageSize}
            callingAllRequests={callingAllRequests}
          />
        ) : (
          <AcceptPopup
            show={modalShow}
            handleClose={() => setModalShow(false)}
            id={item?.id}
            tabName="incoming"
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        ))}

      {modalRShow &&
        (systemId ? (
          <RejectPopupForApprovals
            show={modalRShow}
            handleClose={() => setModalRShow(false)}
            id={item?.id}
            pageIndex={pageIndex}
            pageSize={pageSize}
            callingAllRequests={callingAllRequests}
          />
        ) : (
          <RejectPopup
            show={modalRShow}
            handleClose={() => setModalRShow(false)}
            id={item?.id}
            tabName="incoming"
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        ))}
    </>
  );
};
