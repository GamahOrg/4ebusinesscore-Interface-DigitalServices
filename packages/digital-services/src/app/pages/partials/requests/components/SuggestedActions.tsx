import { FC } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ButtonGroup, Dropdown } from "react-bootstrap";

type ActionProps = {
  id: number;
  item: any;
  systemId?: any;
  location?: any;
};

export const SuggestedActions: FC<ActionProps> = ({ id, item, systemId, location }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  let cardName = location?.state?.cardTitle;
  let cardId = location?.state?.cardId;

  "/approvals-requests/:id/details-for-suggesting/:systemId?"
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
        <Dropdown.Menu>
          <a
            onClick={() => {
              navigate(
                systemId ? 
                  `/approvals-requests/${item?.id}/details-for-suggesting/${systemId}`
                : location?.pathname === "/approvals-requests" ? `/approvals-requests/${item?.id}/details-for-suggesting` :
                `/user-profile/requests/${item?.id}/details-for-suggested`,
                {
                  state: { cardId: cardId, cardTitle: cardName,}
                }
              );
            }}
            className="menu-link text-muted "
          >
            <Dropdown.Item as="button">
              <i className="fa-solid fa-eye mx-2"></i>
              {intl.formatMessage({ id: "Show" })}{" "}
            </Dropdown.Item>
          </a>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
