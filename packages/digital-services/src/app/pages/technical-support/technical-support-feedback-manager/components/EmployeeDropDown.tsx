import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { Tech } from "../../../../models/get-report/GetAllTechnicaByMainIdMolde";
interface Props {
  selectedOptions: any;
  setSelectedOptions: any;
  selectedRoleIds: any;
  setSelectedRoleIds: any;
  options: Tech[]|undefined;
  placeholder?: string;
  defaultValuesRoles?: string[], // Add the defaultValuesRoles prop
}

const EmployeeDropDown: FC<Props> = ({
  selectedOptions,
  setSelectedOptions,
  selectedRoleIds,
  setSelectedRoleIds,
  options,
  placeholder = "Choose",
  defaultValuesRoles, // Add the defaultValuesRoles prop
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleIsCheck = (option: { technicianId: string; fullName:string }) => {
    const optionName =  option?.fullName;
    const optionId = option?.technicianId;
  
    if (selectedOptions.includes(optionName)) {
      const updatedOptions = selectedOptions.filter(
        (value: string) => value !== optionName
      );
      const updatedRoleIds = selectedRoleIds.filter(
        (id: string) => id !== optionId
      );
  
      setSelectedOptions([...updatedOptions]);
      setSelectedRoleIds([...updatedRoleIds]);
    } else {
      setSelectedOptions([...selectedOptions, optionName]);
      setSelectedRoleIds([...selectedRoleIds, optionId]);
    }
  };
  return (
    <>
      <div className="position-relative">
        <button
          className="btn btn-light w-100 d-flex justify-content-start flex-wrap btn-dropdwon"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0
            ? selectedOptions.join(" - ")
            : intl.formatMessage({ id: placeholder })}
        </button>
        {isOpen && (
          <ul
            className="list-unstyled border border-1px p-0 border-radius position-absolute w-100 bg-white"
            style={{ zIndex: 9999 }}
          >
            {options?.map((option,index) => (
              <li key={index + option.technicianId}>
                <div
                  className="w-100 btn btn-white d-flex justify-content-between form-check"
                  onClick={() => handleIsCheck({technicianId:option.technicianId,fullName:option.fullName
                })}
                >
                  <label
                    className="form-check-label"
                    htmlFor={`Checkme${option.technicianId}`}
                  >
                  { intl?.locale.toLowerCase() === "ar" ? option.fullName : option.fullName}
                  </label>
                  <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                    <input
                      className="form-check-input widget-9-check xCheckBg"
                      checked={selectedOptions.includes(  option.fullName)}
                      onChange={() => handleIsCheck(option)}
                      type="checkbox"
                      value= { intl?.locale.toLowerCase() === "ar" ? option.fullName : option.fullName}
                      id={`Checkme${option.technicianId}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default EmployeeDropDown;
