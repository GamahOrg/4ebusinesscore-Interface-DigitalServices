import { FC, Fragment } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
export interface Items {
  key: string;
  value: string;
  translated?: boolean;
}
export interface Iprop {
  list: Items[];
  actions?: any;
}
const GenericToolbar: FC<Iprop> = ({ list, actions }) => {
  const intl = useIntl();

  return (
    <div className="toolbar py-5 py-lg-15" id="kt_toolbar">
      <div
        id="kt_toolbar_container"
        className="container d-flex flex-stack px-1 flex-wrap"
      >
        <div className="page-title d-flex flex-column">
          <h1 className="d-flex text-white fw-bolder my-1 fs-3 mb-5">
            {list[list?.length - 1]?.translated
              ? list[list?.length - 1]?.key
              : intl.formatMessage({
                  id: list[list?.length - 1]?.key || "",
                  defaultMessage: list[list?.length - 1]?.key || "",
                })}
          </h1>

          <ul className="breadcrumb breadcrumb-separatorless fw-bold fs-7">
            <li className="breadcrumb-item text-white opacity-75">
              <div className="text-white">
                {intl.formatMessage({ id: "Home" })}
              </div>
            </li>
            {list.length > 0
              ? list.map((item, index: number) => {
                  return (
                    <Fragment key={index}>
                      <li className="breadcrumb-item">
                        <span className="bullet bg-white opacity-75 w-5px h-2px"></span>
                      </li>

                      {list?.length !== index + 1 ? (
                        <li className="breadcrumb-item text-white opacity-75">
                          <Link
                            to={
                              item?.key === "JudgmentAdministration"
                                ? `/judgements-managements`
                                : item?.value
                            }
                            className="text-white text-hover-primary"
                          >
                            {item?.translated
                              ? item?.key
                              : intl.formatMessage({
                                  id: item?.key || "",
                                  defaultMessage: item?.key || "",
                                })}
                          </Link>
                        </li>
                      ) : (
                        <li className="breadcrumb-item text-white opacity-75">
                          {item?.translated
                            ? item?.key
                            : intl.formatMessage({
                                id: item?.key || "",
                                defaultMessage: item?.key || "",
                              })}{" "}
                        </li>
                      )}
                    </Fragment>
                  );
                })
              : ""}
          </ul>
        </div>
        <div className="d-flex align-items-center gap-3 py-3 py-md-1">
          {actions}
        </div>
      </div>
    </div>
  );
};

export { GenericToolbar };
