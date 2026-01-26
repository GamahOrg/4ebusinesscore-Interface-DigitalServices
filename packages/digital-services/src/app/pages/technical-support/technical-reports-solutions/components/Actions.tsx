import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { DeletePopup } from "../popup/DeletePopup";
import { useDispatch } from "react-redux";
import { deleteResolver } from "../../../../redux/features/Resolver/deleteResolverSlice";
import { ButtonGroup } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { getResolverComponent } from "../../../../redux/features/Resolver/getAllResolveSlice";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import { RootState, useAppSelector } from "../../../../redux/store/store";

type ActionProps = {
  id: string;
  userRoleId?: any;
  userLoggedIn?: any;
};

export const Actions: FC<ActionProps> = ({ id, userRoleId, userLoggedIn }) => {
  const intl = useIntl();
  const [showDelete, setshowDelete] = useState<boolean>(false);
  const dispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();

  let pagination = useAppSelector((state: RootState) => {
    return state?.getAllResolver?.pagination;
  });

  const handleDelete = () => {
    dispatch(deleteResolver(id) as any).then((res:any) => {
      let itemsCountPerPage = pagination.totalItems- pagination.pageSize*(pagination.totalPages-1)
      const params: any = {
        pageSize: pagination.pageSize,
        pageNumber: itemsCountPerPage !==1?pagination.pageIndex:pagination.pageIndex-1,
        name: searchParams.get("term")||undefined,
      };

      if(res?.payload?.statusEnum == 1){
        showAlert(true ,"DeletedSuccessfully" , intl )
        dispatch(getResolverComponent(params) as any);
      }else{
        showAlert(false , "AnErrorOccured" , intl)
      }
    });
  };

  
  let location = useLocation()
  let params = useParams();
  let cardTitle = location?.state?.cardTitle || location?.state?.serviceName
  let cardId = location?.state?.cardId
  const mainClassificationIdLocation = params?.classificationId || location?.state?.extraState

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
          <Dropdown.Item as="button">
            <Link
              to={`/technical-reports-solutions/${id}/details`}
              className="menu-link px-3 text-muted "
              state={{mainClassificationId: mainClassificationIdLocation, cardId, cardTitle }}
            >
              <i className="fa-solid fa-eye mx-2"></i>
              {intl.formatMessage({ id: "Show" })}{" "}
            </Link>
          </Dropdown.Item>
          {userLoggedIn?.roles?.filter((role: any) =>
            userRoleId.includes(role.roleId)
          ).length > 0 ? (
            <>
              <Dropdown.Item as="button">
                <Link
                  to={`/technical-reports-solutions/${id}/edit-solution`}
                  className="menu-link px-3 text-primary"
                  state={{mainClassificationId: mainClassificationIdLocation, cardId, cardTitle}}
                >
                  <span className="svg-icon svg-icon-3 mx-2">
                    <KTSVG path="/media/icons/duotune/general/gen087.svg" />
                  </span>{" "}
                  {intl.formatMessage({ id: "Edit" })}
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as="button">
                <span
                  className="menu-link px-3 text-danger"
                  onClick={() => {
                    setshowDelete(true);
                  }}
                >
                  <span className="svg-icon svg-icon-3 mx-2">
                    <KTSVG path="/media/icons/duotune/general/gen088.svg" />
                  </span>{" "}
                  {intl.formatMessage({ id: "Delete" })}
                </span>
              </Dropdown.Item>
            </>
          ) : (
            ""
          )}
        </Dropdown.Menu>
      </Dropdown>
      {showDelete ? (
        <div className="modal fade" aria-hidden="true">
          <DeletePopup
            handleCloseDelete={() => setshowDelete(false)}
            showDelete={showDelete}
            id={id}
            handleDelete={()=>handleDelete()}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
