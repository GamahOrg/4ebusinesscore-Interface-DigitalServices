import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams, useNavigate } from "react-router-dom";

const SystemSettingsSmartToolbarDetails: FC = () => {
  const intl = useIntl();
  const { workspaceName } = useParams();
  useState<string>("");
  const navigate = useNavigate();

  const [modifiedWorkspaceName, setModifiedWorkspaceName] =
    useState<string>("");
  const formatWorkspaceName = (word: string): string => {
    if (word.includes("workspace")) {
      let formattedWord = word
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

      if (formattedWord.endsWith("Workspace")) {
        formattedWord = formattedWord.slice(0, -9);
      }

      return formattedWord;
    } else {
      let formattedWord = word
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

      formattedWord = formattedWord.slice(0, -8);
      return formattedWord;
    }
  };


  useEffect(() => {
    if (workspaceName) {
    const newModifiedWorkspaceName = formatWorkspaceName(workspaceName);
    setModifiedWorkspaceName(newModifiedWorkspaceName);
    }
  }, [workspaceName]);

  return (
    <>
      <div className="toolbar py-5 py-lg-15" id="kt_toolbar">
        <div
          id="kt_toolbar_container"
          className="container-xxl d-flex flex-stack flex-wrap p-0"
        >
          <div className="page-title d-flex flex-column me-3">
            <h1 className="d-flex text-white fw-bolder my-1 fs-3">
              {intl.formatMessage({ id: "CardDetails" })}
            </h1>
            <ul className="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
              <li className="breadcrumb-item text-white opacity-75">
                <Link
                  to="/home-workspace"
                  className="text-white text-hover-primary"
                >
                  {intl.formatMessage({ id: "Home" })}
                </Link>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-white opacity-75 w-5px h-2px"></span>
              </li>
              {/* <li className="breadcrumb-item text-white opacity-75">
                <Link
                  to="/organization-performance-workspace"
                  className="text-white text-hover-primary"
                >
                  {intl.formatMessage({ id: "Workspace" })}
                </Link>
              </li> */}
              <li className="breadcrumb-item text-white opacity-75">
                {workspaceName?.includes("settings") ? (
                  // <>
                  //   <Link
                  //     to={`/${workspaceName.replace("settings", "workspace")}`}
                  //     className="text-white text-hover-primary"
                  //   >
                  //     {intl.formatMessage({ id: "Workspace" })}
                  //   </Link>
                  // </>
                  <>
                    <Link
                      // to={`/${workspaceName.replace("settings", "workspace")}`}
                      to={`/admin-panel-workspace`}
                      className="text-white text-hover-primary"
                    >
                      {intl.formatMessage({ id: "Workspace" })}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/${workspaceName}`}
                      className="text-white text-hover-primary"
                    >
                      {intl.formatMessage({ id: "Workspace" })}
                    </Link>
                  </>
                )}
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-white opacity-75 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-white opacity-75">
                {/* <Link
                  to="/organization-performance-system-settings"
                  className="text-white text-hover-primary"
                >
                  {intl.formatMessage({
                    id: "OpManagementSystemSettings",
                  })}
                </Link> */}
                <button
                  onClick={() => navigate(-1)}
                  className="btn text-white text-hover-primary p-0 m-0"
                  type="reset"
                >
                  <span className="text-white text-hover-primary fs-7">
                    {/* {intl.formatMessage({
                      id: "DigitalMediaManagementSystemSettings",

                    })} */}
                    {intl.formatMessage({
                      id: `${modifiedWorkspaceName}ManagementSystemSettings`,
                    })}
                  </span>
                </button>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-white opacity-75 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-white opacity-75 mx-2">
                <span className="text-white">
                  {intl.formatMessage({ id: "CardDetails" })}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export { SystemSettingsSmartToolbarDetails };
