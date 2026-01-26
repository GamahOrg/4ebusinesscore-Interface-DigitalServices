import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

type ActionProps = {
  id: Number;
};

export const EmployeeActions: FC<ActionProps> = ({ id }) => {
  const intl = useIntl();
  const [redirectShow, setRedirectShow] = useState<boolean>(false);

  return (
    <>
      <div className="card-toolbar text-center">
        <div>
          <button
            className="btn btn-sm btn-icon btn-light"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
          >
            <i className="bi bi-three-dots fs-2"></i>
          </button>
          <div
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-135px py-3"
            data-kt-menu="true"
          >
            <div className="menu-item">
              <Link
                to={`/technical-support-feedbacks-manager/${id}/details`}
                className="menu-link px-3 text-muted "
              >
                <i className="fa-solid fa-eye mx-3"></i>
                {intl.formatMessage({ id: "Show" })}{" "}
              </Link>
            </div>

            <div className="menu-item">
              <Link to="#" className="menu-link px-3 text-success">
                <i className="bi bi-plus-lg mx-3"></i>
                {intl.formatMessage({ id: "Add" })}
              </Link>
            </div>
            <div className="menu-item">
              <a
                className="menu-link px-3 text-primary"
                onClick={() => setRedirectShow(true)}
              >
                <i className="bi bi-repeat mx-3"></i>
                {intl.formatMessage({ id: "Redirect" })}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" aria-hidden="true">
      </div>
    </>
  );
};
