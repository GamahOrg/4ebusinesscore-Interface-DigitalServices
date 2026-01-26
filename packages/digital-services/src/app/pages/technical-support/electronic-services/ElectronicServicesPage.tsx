import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";
import ElectronicServicesHome from "./components/ElectronicServicesHome";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ElectronicServicesPage() {
  const intl = useIntl();
  let location = useLocation();
  let selectedSolution = location.state?.selectedSolution || {
    value: JSON.parse(localStorage.getItem("selectedSolution") as string)
      ?.value,
    label:
      intl.locale == "ar"
        ? JSON.parse(localStorage.getItem("selectedSolution") as string)
            ?.labelAr
        : JSON.parse(localStorage.getItem("selectedSolution") as string)
            ?.labelEn,
  };
  null;
  const [selectedValue, setSelectedValue] = useState<any>(
    selectedSolution || null
  );
  const [defaultOption, setDefaultOption] = useState<any>(
    selectedSolution || null
  );
  const [selectedOption, setSelectedOption] = useState<any>(
    selectedSolution || null
  );

  useEffect(() => {
    if (selectedSolution) {
      setSelectedValue(selectedSolution);
      setDefaultOption(selectedSolution);
      setSelectedOption(selectedSolution);
    }
  }, []);
  window.addEventListener("selectedSolution", () => {
    setSelectedValue(selectedSolution);
    setDefaultOption(selectedSolution);
    setSelectedOption(selectedSolution);
  });

  const breadcrumbItems = [
    {
      path: "",
      defaultName: "",
      name: selectedValue
        ? selectedValue.label
        : `${intl.formatMessage({
            id: "ElectronicServices",
          })}`,
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={"ElectronicServices"}
        extraTitle={
          selectedValue
            ? selectedValue.label
            : `${intl.formatMessage({
                id: "ElectronicServices",
              })}`
        }
        breadcrumbItems={breadcrumbItems}
        showWorkspace={false}
        translate={false}
      />
      <ElectronicServicesHome
        selectedSolution={selectedSolution}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        defaultOption={defaultOption}
        setDefaultOption={setDefaultOption}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    </>
  );
}

export default ElectronicServicesPage;
