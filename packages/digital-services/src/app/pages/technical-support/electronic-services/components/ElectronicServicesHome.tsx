import { KTSVG } from "@4eplatform/gateway/src/app/helpers";
import { FC, useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { SystemPaginationWith4Multiple } from "@4eplatform/shared/components/SystemPaginationWith4Multiple";
import { AppDispatch } from "@4eplatform/connect/src/app/store/store";
import { GetSubsytemSettingsMainClassificationAgg } from "../../../../redux/features/mainClassification/subsytemSettingsMainClassificationSlice";
import { getColorClass } from "@4eplatform/shared/functions/getColor";
import { showAlert } from "@4eplatform/shared/services/showAlert";
import Spinner from "react-bootstrap/esm/Spinner";

type ElectronicProps = {
  selectedSolution: any;
  selectedValue: any;
  setSelectedValue: any;
  defaultOption: any;
  setDefaultOption: any;
  selectedOption: any;
  setSelectedOption: any;
};
const ElectronicServicesHome: FC<ElectronicProps> = ({
  selectedSolution,
  selectedValue,
  setSelectedValue,
  defaultOption,
  setDefaultOption,
  selectedOption,
  setSelectedOption,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<any>(32);
  const [pageIndex, setPageIndex] = useState<any>(1);

  const [filteredChildSystems, setFilteredChildSystems] = useState<any[]>([]);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = {
      pageSize: searchTerm ? 10000 : pageSize,
      pageNumber: searchTerm ? 1 : pageIndex,
      isHome: true,
    };
    if (searchTerm) {
      setPageIndex(1);
    }
    setLoading(true);
    dispatch(GetSubsytemSettingsMainClassificationAgg(params)).then(() => {
      setLoading(false);
    });
  }, [dispatch, pageSize, pageIndex, searchTerm]);

  const systemTree = useSelector(
    (state: any) =>
      state?.subsytemSettingsMainClassificationAggSlice?.items ?? [],
  );

  useEffect(() => {
    const allChildSystems =
      systemTree?.[0]?.allSubsytemSettingsMainClassifications ?? [];

    const filtered = allChildSystems?.filter((childSys: any) => {
      const childNameEn = childSys?.nameEn?.toLowerCase() || "";
      const childNameAr = childSys?.nameAr?.toLowerCase() || "";
      const childmainNameAr = childSys?.mainNameAr?.toLowerCase() || "";
      const childmainNameEn = childSys?.mainNameEn?.toLowerCase() || "";
      return (
        childNameEn?.includes(searchTerm) ||
        childNameAr?.includes(searchTerm) ||
        childmainNameAr?.includes(searchTerm) ||
        childmainNameEn?.includes(searchTerm)
      );
    });
    setFilteredChildSystems(filtered);
  }, [searchTerm, systemTree, selectedValue]);

  const handleChange = (selectedOption: any) => {
    setSelectedValue(selectedOption);
    setSelectedOption(selectedOption);
  };

  const options = systemTree?.reduce(
    (acc: any[], sysTree: any, index: number) => {
      const shouldIncludeFirst = index === 0 && sysTree?.isHide;
      const shouldIncludeRest = !sysTree?.isHide;

      if (shouldIncludeFirst || shouldIncludeRest) {
        acc.push({
          value: sysTree?.id,
          label: intl.locale === "ar" ? sysTree?.nameAr : sysTree?.nameEn,
        });
      }
      return acc;
    },
    [],
  );

  useEffect(() => {
    if (options?.length > 0 && !selectedSolution) {
      const firstOption = options[0];
      setSelectedValue(firstOption);
      setDefaultOption(firstOption);
      setSelectedOption(firstOption);
    }
  }, [systemTree]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value?.toLowerCase());
  };

  const totalPages = Math.ceil(systemTree?.[0]?.count / pageSize) || 0;
  const totalItems = systemTree?.[0]?.count || 0;

  const renderCard = (selectedSystem: any) => {
    return (
      <>
        <div
          className="card shadow-sm p-5 text-gray-800 border electronic-card d-flex justify-contnet-center bg-hover-light-primary"
          style={{ minHeight: "200px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div
              className={`p-2 w-20 text-center d-flex justify-content-center align-items-center bg-${getColorClass(
                selectedSystem?.color,
              )} rounded-2 mb-3`}
            >
              <span
                className="svg-icon svg-icon-4x text-white"
                dangerouslySetInnerHTML={{ __html: selectedSystem?.icon }}
              ></span>
            </div>
            <div
              style={{ fontSize: "12px" }}
              className={`mb-3 text-${getColorClass(
                selectedSystem?.color,
              )} fw-bolder`}
            >
              {intl.locale === "ar"
                ? selectedSystem?.subsytemMainLookupNameAr === "تم الاطلاق"
                  ? ""
                  : selectedSystem?.subsytemMainLookupNameAr
                : selectedSystem?.subsytemMainLookupNameEn === "Launched"
                ? ""
                : selectedSystem?.subsytemMainLookupNameEn}
            </div>
          </div>

          <p className="fw-bolder fs-5 mb-3">
            {intl?.locale === "ar"
              ? selectedSystem?.nameAr
              : selectedSystem?.nameEn}
          </p>
          <p className="text-primary">
            {intl?.locale === "ar"
              ? selectedSystem?.mainNameAr
              : selectedSystem?.mainNameEn}
          </p>
          <p className="text-muted spe-desc text-wrap">
            {intl.locale == "ar"
              ? selectedSystem?.description
              : selectedSystem?.descriptionEn}
          </p>
        </div>
      </>
    );
  };

  const renderSystemsClassifications = useCallback(
    (sys: any) => {
      const combineSystems = sys?.subSystems?.concat(sys?.mainclassiffications);
      const allSystems =
        sys?.allSubsytemSettingsMainClassifications || combineSystems;

      if (sys?.id === selectedValue?.value) {
        return allSystems?.map((selectedSys: any) =>
          selectedSys?.subsytemMainLookupNameAr !== "قريبا .. الإطلاق" &&
          selectedSys?.subsytemMainLookupNameEn !== "Coming Soon" &&
          selectedSys?.subsytemMainLookupNameAr !== "تحت التطوير" &&
          selectedSys?.subsytemMainLookupNameEn !== "Under development" ? (
            selectedSys?.isExternal ? (
              selectedSys?.isExternalComponent && selectedSys?.isSinglSignOn ? (
                <div
                  key={selectedSys?.subSystemId}
                  className="col-xl-3 col-md-4 col-12"
                  onClick={() => {
                    localStorage.setItem(
                      "mainClassificationId",
                      selectedSys?.mainClassificationId !==
                        "00000000-0000-0000-0000-000000000000"
                        ? selectedSys?.mainClassificationId
                        : "00000000-0000-0000-0000-000000000000",
                    );
                    localStorage.setItem("DigitalServices", "true");
                    localStorage.setItem(
                      "ClassificationName",
                      !selectedSys?.isSubSystem
                        ? intl.locale === "ar"
                          ? selectedSys?.nameAr
                          : selectedSys?.nameEn
                        : null,
                    );
                    localStorage.setItem(
                      "isSubSystem",
                      selectedSys?.isSubSystem,
                    );
                    localStorage.setItem(
                      "subSystemId",
                      selectedSys?.isComponent
                        ? selectedSys?.parentId
                        : selectedSys?.subSystemId,
                    );
                    localStorage.setItem(
                      "workspaceKey",
                      selectedSys?.workspaceKey,
                    );
                    localStorage.setItem(
                      "cardName",
                      JSON.stringify({
                        nameAr: selectedSys?.nameAr,
                        nameEn: selectedSys?.nameEn,
                      }),
                    );
                    window.location.href = (window as any)._env_
                      ?.REACT_APP_Base_Workspace_Url as any;
                  }}
                >
                  {renderCard(selectedSys)}
                </div>
              ) : selectedSys?.isExternal &&
                selectedSys?.isExternalComponent ? (
                <div
                  key={selectedSys?.subSystemId}
                  className="col-xl-3 col-md-4 col-12"
                  onClick={() => {
                    localStorage.setItem(
                      "mainClassificationId",
                      selectedSys?.mainClassificationId !==
                        "00000000-0000-0000-0000-000000000000"
                        ? selectedSys?.mainClassificationId
                        : "00000000-0000-0000-0000-000000000000",
                    );
                    localStorage.setItem(
                      "ClassificationName",
                      intl.locale === "ar"
                        ? selectedSys?.nameAr
                        : selectedSys?.nameEn,
                    );
                    localStorage.setItem(
                      "cardName",
                      JSON.stringify({
                        nameAr: selectedSys?.nameAr,
                        nameEn: selectedSys?.nameEn,
                      }),
                    );
                    localStorage.setItem(
                      "subSystemId",
                      selectedSys?.subSystemId,
                    );
                    window.location.href =
                      (window as any)._env_?.REACT_APP_Base_Url +
                      selectedSys?.url;
                  }}
                >
                  {renderCard(selectedSys)}
                </div>
              ) : (
                <div
                  key={selectedSys?.subSystemId}
                  className="col-xl-3 col-md-4 col-12"
                  onClick={() => {
                    const url = selectedSys?.url?.startsWith("http")
                      ? selectedSys.url
                      : `http://${selectedSys.url}`;

                    window.open(url, "_self");
                  }}
                >
                  {renderCard(selectedSys)}
                </div>
              )
            ) : selectedSys?.havePermession ? (
              <div
                key={selectedSys?.subSystemId}
                className="col-xl-3 col-md-4 col-12"
                onClick={() => {
                  localStorage.setItem(
                    "mainClassificationId",
                    selectedSys?.mainClassificationId !==
                      "00000000-0000-0000-0000-000000000000"
                      ? selectedSys?.mainClassificationId
                      : "00000000-0000-0000-0000-000000000000",
                  );
                  localStorage.setItem("DigitalServices", "true");
                  localStorage.setItem(
                    "ClassificationName",
                    !selectedSys?.isSubSystem
                      ? intl.locale === "ar"
                        ? selectedSys?.nameAr
                        : selectedSys?.nameEn
                      : null,
                  );
                  localStorage.setItem("isSubSystem", selectedSys?.isSubSystem);
                  localStorage.setItem(
                    "subSystemId",
                    selectedSys?.isComponent
                      ? selectedSys?.parentId
                      : selectedSys?.subSystemId,
                  );
                  localStorage.setItem(
                    "workspaceKey",
                    selectedSys?.workspaceKey,
                  );
                  localStorage.setItem(
                    "cardName",
                    JSON.stringify({
                      nameAr: selectedSys?.nameAr,
                      nameEn: selectedSys?.nameEn,
                    }),
                  );
                  if (selectedSys?.isComponent) {
                    window.location.href =
                      (window as any)._env_?.REACT_APP_Base_Url +
                      selectedSys?.url;
                  } else {
                    window.location.href = (window as any)._env_
                      ?.REACT_APP_Base_Workspace_Url as any;
                  }
                }}
              >
                {renderCard(selectedSys)}
              </div>
            ) : (
              <div
                key={selectedSys?.subSystemId}
                className="col-xl-3 col-md-4 col-12"
              >
                <div onClick={() => showAlert(true, "SorryNoPermission", intl)}>
                  {renderCard(selectedSys)}
                </div>
              </div>
            )
          ) : selectedSys?.mainClassificationId ===
            "00000000-0000-0000-0000-000000000000" ? (
            <div
              key={selectedSys?.subSystemId}
              className="col-xl-3 col-md-4 col-12 my-4 "
              onClick={() => {
                localStorage.setItem(
                  "mainClassificationId",
                  selectedSys?.mainClassificationId !=
                    "00000000-0000-0000-0000-000000000000"
                    ? selectedSys?.mainClassificationId
                    : "00000000-0000-0000-0000-000000000000",
                );
                localStorage.setItem(
                  "subsystemId",
                  selectedSys?.isComponent
                    ? selectedSys?.parentId
                    : selectedSys?.subSystemId ||
                        selectedSys?.mainClassificationId,
                );
                localStorage.setItem("workspaceKey", selectedSys?.workspaceKey);
                localStorage.setItem(
                  "cardName",
                  JSON.stringify({
                    nameAr: selectedSys?.nameAr,
                    nameEn: selectedSys?.nameEn,
                  }),
                );
                window.location.href = selectedSys?.url;
              }}
            >
              {renderCard(selectedSys)}
            </div>
          ) : (
            <div
              key={selectedSys?.subSystemId}
              className="col-xl-3 col-md-4 col-12"
            >
              <div onClick={() => showAlert(true, "SorryNoPermission", intl)}>
                {renderCard(selectedSys)}
              </div>
            </div>
          ),
        );
      } else if (searchTerm) {
        return sys?.subsytemMainLookupNameAr !== "قريبا .. الإطلاق" &&
          sys?.subsytemMainLookupNameEn !== "Coming Soon" &&
          sys?.subsytemMainLookupNameAr !== "تحت التطوير" &&
          sys?.subsytemMainLookupNameEn !== "Under development" ? (
          sys?.isExternal ? (
            <div key={sys?.subSystemId} className="col-xl-3 col-md-4 col-12">
              <div
                onClick={() => {
                  sys?.url && window.open(sys.url, "_blank");
                }}
                style={{ cursor: "pointer" }}
              >
                {renderCard(sys)}
              </div>
            </div>
          ) : sys?.havePermession ? (
            <div
              key={sys?.subSystemId}
              className="col-xl-3 col-md-4 col-12"
              onClick={() => {
                localStorage.setItem(
                  "mainClassificationId",
                  sys?.mainClassificationId,
                );
                localStorage.setItem("DigitalServices", "true");
                localStorage.setItem(
                  "ClassificationName",
                  !sys?.isSubSystem
                    ? intl.locale === "ar"
                      ? sys?.nameAr
                      : sys?.nameEn
                    : null,
                );
                localStorage.setItem(
                  "cardName",
                  JSON.stringify({
                    nameAr: sys?.nameAr,
                    nameEn: sys?.nameEn,
                  }),
                );
                localStorage.setItem("isSubSystem", sys?.isSubSystem);
                localStorage.setItem(
                  "subSystemId",
                  sys?.isComponent ? sys?.parentId : sys?.subSystemId,
                );
                localStorage.setItem("workspaceKey", sys?.workspaceKey);
                if (sys?.isComponent) {
                  window.location.href =
                    (window as any)._env_?.REACT_APP_Base_Url + sys?.url;
                } else {
                  window.location.href = (window as any)._env_
                    ?.REACT_APP_Base_Workspace_Url as any;
                }
              }}
            >
              {renderCard(sys)}
            </div>
          ) : (
            <div key={sys?.subSystemId} className="col-xl-3 col-md-4 col-12">
              <div onClick={() => showAlert(true, "SorryNoPermission", intl)}>
                {renderCard(sys)}
              </div>
            </div>
          )
        ) : sys?.mainClassificationId ==
          "00000000-0000-0000-0000-000000000000" ? (
          <div
            className="col-xl-3 col-md-4 col-12 my-4 "
            key={sys?.subSystemId}
          >
            <div
              onClick={() => {
                localStorage.setItem(
                  "mainClassificationId",
                  sys?.mainClassificationId !==
                    "00000000-0000-0000-0000-000000000000"
                    ? sys?.mainClassificationId
                    : "00000000-0000-0000-0000-000000000000",
                );
                localStorage.setItem(
                  "cardName",
                  JSON.stringify({
                    nameAr: sys?.nameAr,
                    nameEn: sys?.nameEn,
                  }),
                );
                localStorage.setItem(
                  "subSystemId",
                  sys?.isComponent
                    ? sys?.parentId
                    : sys?.subSystemId || sys?.mainClassificationId,
                );
                window.location.href =
                  (window as any)._env_?.REACT_APP_Base_Url + sys?.url;
              }}
            >
              {renderCard(sys)}
            </div>
          </div>
        ) : (
          <div key={sys?.subSystemId} className="col-xl-3 col-md-4 col-12">
            <div onClick={() => showAlert(true, "SorryNoPermission", intl)}>
              {renderCard(sys)}
            </div>
          </div>
        );
      }

      return null;
    },
    [selectedValue, intl],
  );
  const isDarkTheme = localStorage.getItem("Theme") === "dark";

  let selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDarkTheme ? "#1e1e2f" : "#ffffff",
      borderColor: state.isFocused
        ? "#5e9eff"
        : isDarkTheme
        ? "#3a3a4d"
        : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #5e9eff" : "none",
      "&:hover": {
        borderColor: "#5e9eff",
      },
      color: isDarkTheme ? "#ffffff" : "#000000",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDarkTheme ? "#ffffff" : "#000000",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDarkTheme ? "#a2adb5" : "#6c757d",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDarkTheme ? "#2c2c3a" : "#ffffff",
      zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused
        ? isDarkTheme
          ? "#3a3a4d"
          : "#e6f0ff"
        : "transparent",
      color: isDarkTheme ? "#ffffff" : "#000000",
      "&:active": {
        backgroundColor: "#5e9eff",
      },
    }),
    input: (base: any) => ({
      ...base,
      color: isDarkTheme ? "#ffffff" : "#000000",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: isDarkTheme ? "#a2adb5" : "#000000",
      "&:hover": {
        color: isDarkTheme ? "#ffffff" : "#000000",
      },
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: isDarkTheme ? "#444" : "#ccc",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "200px",
      padding: 0,
    }),
  };
  return (
    <>
      <div className="card mb-8 p-4">
        <div className="d-flex justify-content-between p-5 align-items-center row">
          <div className="position-relative col-12 col-sm-8 col-md-9 ">
            <span className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
              <KTSVG path="/media/icons/duotune/general/gen065.svg" />
            </span>
            <input
              type="text"
              className="form-control form-control-solid ps-10"
              name="search"
              placeholder={intl.formatMessage({ id: "TypeYourSearchHere" })}
              onChange={handleSearch}
            />
          </div>
          <div className="position-relative col-4 col-sm-8 col-md-3 ">
            <Select
              isMulti={false}
              name="systems"
              options={options}
              className="basic-select electronic-Services-Category-Select"
              classNamePrefix="select"
              value={selectedOption}
              onChange={handleChange}
              placeholder={intl.formatMessage({ id: "Category" })}
              styles={selectStyles}
            />
          </div>
        </div>

        <div
          className="card-body d-flex flex-column p-5 pt-2 my-3"
          style={{ minHeight: "300px" }}
        >
          {loading ? (
            <div className="d-flex gap-4 justify-content-center align-items-center py-4">
              {intl.formatMessage({ id: "DataIsLoaded..." })}
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <div className="row g-5 g-xl-8 DefaultIconSize">
                {!searchTerm
                  ? systemTree?.map((sys: any) =>
                      renderSystemsClassifications(sys),
                    )
                  : filteredChildSystems?.map((sys: any) =>
                      renderSystemsClassifications(sys),
                    )}
              </div>
              {systemTree?.[0]?.id === selectedValue?.value ? (
                <>
                  {!searchTerm && systemTree?.[0]?.count > 0 ? (
                    <SystemPaginationWith4Multiple
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      setPageIndex={setPageIndex}
                      setPageSize={setPageSize}
                      totalPages={totalPages}
                      totalItems={totalItems}
                    />
                  ) : (
                    ""
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ElectronicServicesHome;
