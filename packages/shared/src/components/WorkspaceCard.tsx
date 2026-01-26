import { FC } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { setWorkspaceKey } from "@4eplatform/shared/index";

interface Iprop {
  id: any;
  name: string;
  dept: string;
  title: string;
  subTitle: string;
  count: string;
  lastUpdate: string;
  lastLogin: string;
  link: string;
  icon: any;
  subIcon: any;
  color: string;
  background: string;
  isShow: boolean;
  workspaceKey?: number;
  nameEn?: string;
  nameAr?: string;
}

const WorkspaceCard: FC<Iprop> = ({
  id,
  name,
  dept,
  title,
  subTitle,
  count,
  lastUpdate,
  lastLogin,
  link,
  icon,
  subIcon,
  color,
  background,
  isShow,
  workspaceKey,
  nameEn,
  nameAr,
}) => {
  const intl = useIntl();
  let navigate = useNavigate();
  const { PUBLIC_URL } = (window as any)._env_;

  return (
    <>
      {isShow && (
        <div id={id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div className="card h-100 pt-4 pb-5">
            <div className="d-flex flex-column px-8 py-4">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bolder text-dark fs-4">
                  {intl.formatMessage({ id: "Workspace" })}
                </span>
              </h3>
            </div>
            <div className="card-body d-flex flex-center flex-column p-5">
              <div className="symbol symbol-75px mb-2">
                <span
                  className={
                    "symbol-label " +
                    (background === "bg-light-warning"
                      ? "bg-light-warning"
                      : background === "bg-light-primary"
                      ? "bg-light-primary"
                      : background === "bg-light-info"
                      ? "bg-light-info"
                      : background === "bg-light-gblue"
                      ? "bg-light-gblue"
                      : background === "bg-light-success"
                      ? "bg-light-success"
                      : background === "bg-light-danger"
                      ? "bg-light-danger"
                      : "")
                  }
                >
                  <span
                    className={
                      "svg-icon svg-icon-4x " +
                      (color === "svg-icon-warning"
                        ? "svg-icon-warning"
                        : color === "svg-icon-primary"
                        ? "svg-icon-primary"
                        : color === "svg-icon-info"
                        ? "svg-icon-info"
                        : color === "svg-icon-gblue"
                        ? "svg-icon-gblue"
                        : color === "svg-icon-success"
                        ? "svg-icon-success"
                        : color === "svg-icon-danger"
                        ? "svg-icon-danger"
                        : "")
                    }
                  >
                    {icon}
                  </span>
                </span>
              </div>
              <Link
                to={link?.replace(PUBLIC_URL + "/", "")}
                onClick={() => {
                  setWorkspaceKey(workspaceKey);
                  navigate(link?.replace(PUBLIC_URL + "/", ""), {
                    state: {
                      cardId: id,
                      cardTitle: title,
                    },
                  });
                  localStorage.setItem(
                    "mainClassificationId",
                    "00000000-0000-0000-0000-000000000000"
                  );
                  localStorage.setItem(
                    "cardName",
                    JSON.stringify({ nameAr, nameEn })
                  );
                }}
                className="fs-3 text-gray-800 text-hover-gblue fw-bolder mb-0 mt-3"
              >
                {title}
              </Link>
              <div className="fw-bold text-gray-400 mb-12 mt-4 text-center">
                {subTitle}
              </div>
              <Link
                to={link?.replace(PUBLIC_URL + "/", "")}
                onClick={() => {
                  setWorkspaceKey(workspaceKey);
                  navigate(link?.replace(PUBLIC_URL + "/", ""), {
                    state: {
                      cardId: id,
                      cardTitle: title,
                    },
                  });
                  localStorage.setItem(
                    "cardName",
                    JSON.stringify({ nameAr, nameEn })
                  );
                  localStorage.setItem(
                    "mainClassificationId",
                    "00000000-0000-0000-0000-000000000000"
                  );
                }}
                className="btn btn-primary py-4 mx-8 w-200px"
              >
                {intl.formatMessage({ id: "ViewDetails" })}{" "}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { WorkspaceCard };
