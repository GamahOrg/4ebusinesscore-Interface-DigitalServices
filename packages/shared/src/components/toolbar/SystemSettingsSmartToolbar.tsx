import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

export const SystemSettingsSmartToolbar: FC = () => {
  const intl = useIntl();
  const { workspaceName } = useParams();
  const [modifiedWorkspaceName, setModifiedWorkspaceName] =
    useState<string>("");

  const navigate = useNavigate();
  const location = useLocation()

  // const formatWorkspaceName = (word: string): string => {
  //   // Split the word by dashes, capitalize each word, and join them back
  //   return word
  //     .split("-")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join("")
  //     .slice(-10);
  //   // .replace(/-Workspace$/, "");
  // };

  const formatWorkspaceName = (word: string): string => {
    // Split the word by dashes, capitalize each word, and join them back
    if (word.includes("workspace")) {
      let formattedWord = word
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

      // Slice off "-workspace" suffix
      if (formattedWord.endsWith("Workspace")) {
        formattedWord = formattedWord.slice(0, -9); // Slice off the last 10 characters ("-Workspace")
      }

      return formattedWord;
    } else {
      let formattedWord = word
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

      // Slice off "-workspace" suffix
      formattedWord = formattedWord.slice(0, -8); // Slice off the last 10 characters ("-Workspace")
      return formattedWord;
    }
  };
  // Example usage:
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
              {location?.pathname == "/technical-support-system-settings/technical-support-workspace"?
                location?.state?.cardTitle :  
                intl.formatMessage({
                  id: `${modifiedWorkspaceName}SystemSettings`,
                })
              }
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
                  to="/pmo-workspace"
                  className="text-white text-hover-primary"
                >
                  {intl.formatMessage({ id: "Workspace" })}
                </Link>
              </li> */}
              {workspaceName?.includes("settings") ? (
                <>
                  <li className="breadcrumb-item text-white opacity-75">
                    <Link
                      // to="/knowledge-workspace"
                      to={`/admin-panel-workspace`}
                      className="text-white text-hover-primary"
                    >
                      <span className="text-white text-hover-primary">
                        {intl.formatMessage({ id: "Workspace" })}
                      </span>
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <span className="bullet bg-white opacity-75 w-5px h-2px"></span>
                  </li>
                  <li className="breadcrumb-item text-white opacity-75">
                    {/* <Link
                      // to="/knowledge-workspace"
                      to={`/${workspaceName}`}
                      className="text-white text-hover-primary"
                    >
                      <span className="text-white text-hover-primary">
                        {intl.formatMessage({ id: "ViewAllCards" })}
                      </span>
                    </Link> */}
                    <button
                      // to="/knowledge-workspace"
                      // to={`/${workspaceName}`}
                      // className="text-white text-hover-primary"
                      className="btn text-white text-hover-primary p-0 m-0 "
                      onClick={() => navigate(-1)}
                    >
                      <span className="text-white text-hover-primary fs-7">
                        {intl.formatMessage({ id: "ViewAllCards" })}
                      </span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="breadcrumb-item text-white opacity-75">
                  {/* <Link
                    // to="/knowledge-workspace"
                    to={`/${workspaceName}`}
                    className="text-white text-hover-primary"
                  >
                    <span className="text-white text-hover-primary">
                      {intl.formatMessage({ id: "Workspace" })}
                    </span>
                  </Link> */}
                  <button
                    // to="/knowledge-workspace"
                    className="btn text-white text-hover-primary p-0 m-0 "
                    type="reset"
                    // className="btn btn-secondary px-15 me-5"
                    onClick={() => navigate(-1)}
                  >
                    <span className="text-white text-hover-primary fs-7">
                      {intl.formatMessage({ id: "Workspace" })}
                    </span>
                  </button>
                </li>
              )}
              <li className="breadcrumb-item mx-2">
                <span className="bullet bg-white opacity-75 w-5px h-2px"></span>
              </li>
              {/* <span className="breadcrumb-item text-white opacity-75 mx-2 ">
                {intl.formatMessage({ id: "PmoSystemSettings" })}
              </span> */}

              <li className="breadcrumb-item text-white opacity-75">
                <span className="text-white ">
                  {/* {intl.formatMessage({
                      id: "DigitalMediaManagementSystemSettings",

                    })} */}
                    {location?.pathname == "/technical-support-system-settings/technical-support-workspace"?
                      location?.state?.cardTitle :
                      intl.formatMessage({
                        id: `${modifiedWorkspaceName}SystemSettings`,
                      })
                    }
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
