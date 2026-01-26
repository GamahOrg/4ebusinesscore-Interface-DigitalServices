import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { MainClassification, MainClassificationResponse } from "../../../../models/MainClassificationModel";

interface Props {
  selectedOptions: any;
  setSelectedOptions: any;
  selectedRoleIds: any;
  setSelectedRoleIds: any;
  options: MainClassification[]|undefined;
  placeholder?: string;
  defaultValuesRoles?: string[], 
}

const GroupsRolesChekboxDropDown: FC<Props> = ({
  selectedOptions,
  setSelectedOptions,
  selectedRoleIds,
  setSelectedRoleIds,
  options,
  placeholder = "Choose",
  defaultValuesRoles,
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleIsCheck = (option: { id: string; name: string; }) => {
    const optionName = intl?.locale.toLowerCase() === "ar" ? option.name : option.name;
    const optionId = option.id;
  
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
              <li key={index + option.id}>
                <div
                  className="w-100 btn btn-white d-flex justify-content-between form-check"
                  onClick={() => handleIsCheck({id:option.id,name:option.name,
                })}
                >
                  <label
                    className="form-check-label"
                    htmlFor={`Checkme${option.id}`}
                  >
                  {  option.name}
                  </label>
                  <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                    <input
                      className="form-check-input widget-9-check xCheckBg"
                      checked={selectedOptions.includes(   option.name)}
                      onChange={() => handleIsCheck(option)}
                      type="checkbox"
                      value= {  option.name }
                      id={`Checkme${option.id}`}
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

export default GroupsRolesChekboxDropDown;
