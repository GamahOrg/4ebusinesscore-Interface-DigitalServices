import React, { FC, useState } from "react";
import { useIntl } from "react-intl";

interface Props {
  selectedOptions: any;
  setSelectedOptions: any;
  selectedIds: any;
  setSelectedIds: any;
  options: any;
  placeholder?: string;
}

const CheckBoxDropDownWithSelectAll: FC<Props> = ({
  selectedOptions,
  setSelectedOptions,
  selectedIds,
  setSelectedIds,
  options,
  placeholder = "Choose",
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleIsCheck = (option: { id: number | string; name: string }) => {
    const optionName = option.name;
    const optionId = option.id;

    if (optionName === intl.formatMessage({ id: "All" })) {
      if (selectedOptions.includes(optionName)) {
        // Deselect all options
        setSelectedOptions([]);
        setSelectedIds([]);
      } else {
        // Select all options
        const allOptionNames = options?.map((opt: any) => opt.name);
        const allOptionIds = options?.map((opt: any) => opt.id);
        setSelectedOptions(allOptionNames);
        setSelectedIds(allOptionIds);
      }
    } else {
      if (selectedOptions.includes(optionName)) {
        const updatedOptions = selectedOptions.filter(
          (value: string) => value !== optionName
        );
        const updatedIds = selectedIds.filter((id: number | string) => id !== optionId);
        setSelectedOptions([...updatedOptions]);
        setSelectedIds([...updatedIds]);
      } else {
        setSelectedOptions([...selectedOptions, optionName]);
        setSelectedIds([...selectedIds, optionId]);
      }
    }
  };

  return (
    <>
      <div className="position-relative" style={{ zIndex: 100 }}>
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
            className="list-unstyled border card custom-scrollbar border-1px p-0 border-radius position-absolute w-100 "
            style={{ zIndex: 9999, maxHeight: "100px", overflowY: "auto",  
            }}
          >
            {options?.map((option: { id: number | string; name: string }) => (
              <li key={option.id}>
                <div
                  className="w-100 btn btn-light d-flex justify-content-between form-check"
                  onClick={() => handleIsCheck(option)}
                >
                  <label
                    className="form-check-label"
                    htmlFor={`Checkme${option.id}`}
                  >
                    {option.name}
                  </label>
                  <div className="form-check form-check-success form-check-sm form-check-custom form-check-solid form-check-md">
                    <input
                      className="form-check-input widget-9-check xCheckBg"
                      checked={selectedOptions.includes(option.name)}
                      onChange={() => handleIsCheck(option)}
                      type="checkbox"
                      value={option.name}
                      id={`Checkme${option.id}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isOpen ? (
        <div
          className={"position-absolute w-100 h-100 top-0 left-0 "}
          style={{ zIndex: 10 }}
          onClick={() => {
            setIsOpen(false);
          }}
        ></div>
      ) : (
        ""
      )}
    </>
  );
};

export default CheckBoxDropDownWithSelectAll;
