import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation } from "react-router-dom";
import { DeletePopup } from "../../../partials/DeletePopup";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/store/store";
import { deleteSlaById } from "../../../../redux/features/SLA/slaDeleteSlice";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { showAlert } from "@4eplatform/shared/services/showAlert";

type ActionProps = {
  id: string;
  pageSize?: number;
  pageIndex?: number;
  setPageSize?: any;
  setPageIndex?: any;
};

export const Actions: FC<ActionProps> = ({
  id,
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
}) => {
  const intl = useIntl();
  let location = useLocation();
  const [showDelete, setshowDelete] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  let SLA = useAppSelector((state: RootState) => {
    return state?.sla?.items;
  });
  const handleDelete = () => {
    dispatch(deleteSlaById(id)).then((res: any) => {
      if (res?.payload?.statusEnum == 1) {
        showAlert(true, "DeletedSuccessfully", intl);
        if (SLA.length == 1) {
          setPageIndex((pageIndex as number) - 1);
        } else {
          setPageIndex((pageIndex as number) - 1);
        }
      }
    });
  };

  let cardTitle = location?.state?.cardTitle;
  let cardId = location?.state?.cardId;

  return (
    <div className="card-toolbar text-center">
      <div className="me-n3">
        <DropdownButton
          id={`dropdown-button-drop-${id}`}
          title={<i className="bi bi-three-dots fs-2"></i>}
          variant="light"
        >
          <Dropdown.Item
            as={Link}
            to={`/technical-support-service-level-agreement-details/technical-support-service-level-agreement-details-sla/${id}`}
            state={{ cardId, cardName: cardTitle }}
          >
            <i className="fa-solid fa-eye mx-2"></i>
            {intl.formatMessage({ id: "Show" })}
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to={`/technical-support-service-level-agreement-details/editTechnicalAgreement/${id}`}
            state={{ cardId, cardName: cardTitle }}
            className="text-primary"
          >
            <span className="svg-icon svg-icon-3 ms-2">
              <KTSVG path="/media/icons/duotune/general/gen087.svg" />
            </span>
            {intl.formatMessage({ id: "Edit" })}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setshowDelete(true)}
            className="text-danger"
          >
            <span className="svg-icon svg-icon-3 mx-2">
              <KTSVG path="/media/icons/duotune/general/gen088.svg" />
            </span>
            {intl.formatMessage({ id: "Delete" })}
          </Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="modal fade" id="Rega_modal_Delete" aria-hidden="true">
        <DeletePopup
          handleCloseDelete={() => setshowDelete(false)}
          showDelete={showDelete}
          id={id}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};
