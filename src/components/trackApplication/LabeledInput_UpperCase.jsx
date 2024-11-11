import * as React from "react";
import { Input, Form, Tooltip } from "antd";
import { toUpperText } from "@utils/Converter";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput({
  required,
  label,
  placeHolder,
  value,
  receive,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
  fieldName
}) {
    
const { updateAppDetails } = React.useContext(LoanApplicationContext)
  const [inputValue, setInputValue] = React.useState(value || undefined);
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);

  function onChange(e) {
    let newValue = e.target.value;
    setIcon(false);

    const upperValue = toUpperText(newValue);
    setInputValue(upperValue);
    updateAppDetails({ name: fieldName, value: upperValue });

    if (newValue) {
      setStatus("");
      setIcon(true);
      receive(upperValue);
    } else {
      setStatus("error");
      setIcon(true);
      receive();
    }
  }

  function onBlur() {
    setIcon(true);
    if (!inputValue) {
      setStatus("error");
    } else {
      setStatus("");
    }
  }

  return (
    <div className={className_dmain}>
      {category === "marketing" ? (
        <div>
          <label className={className_label}>{label}</label>
        </div>
      ) : category === "direct" ? (
        <label className={className_label}>{label}</label>
      ) : null}

      <div className={className_dsub}>
        <Input
          className={`w-full ${readOnly ? "bg-[#f5f5f5]" : "bg-[#ffffff]"}`}
          size="large"
          value={inputValue}
          placeholder={placeHolder}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          status={
            !readOnly && (required || required === undefined)
              ? getStatus
              : false
          }
          suffix={
            !readOnly && (required || required === undefined) ? (
              getIcon === true ? (
                getStatus === "error" ? (
                  <ExclamationCircleFilled
                    style={{ color: "#ff6767", fontSize: "12px" }}
                  />
                ) : (
                  <CheckCircleFilled
                    style={{ color: "#00cc00", fontSize: "12px" }}
                  />
                )
              ) : (
                <></>
              )
            ) : (
              <></>
            )
          }
        />
        {!readOnly &&
        (required || required === undefined) &&
        getStatus === "error" ? (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {placeHolder + " Required"}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LabeledInput;
