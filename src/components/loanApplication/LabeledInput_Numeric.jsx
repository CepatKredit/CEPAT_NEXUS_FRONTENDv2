import * as React from "react";
import { Input } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput_Numeric({
  rendered,
  label,
  placeHolder,
  value,
  receive,
  category,
  readOnly,
  digits,
  disabled,
  className_dmain,
  className_label,
  className_dsub,
  fieldName
}) {
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const [getStatus, setStatus] = React.useState("");
  const [getIconType, setIconType] = React.useState(false);
  const [getItem, setItem] = React.useState(getAppDetails[fieldName] || "");
  function onChangeValue(e) {
    const inputValue = e.target.value;

    if (inputValue.length == 0) {
      setItem(inputValue);
      setStatus("error");
      setIconType("error");
      updateAppDetails({ name: fieldName, value: '' });
    } else if (
      inputValue.length !== digits + 1 &&
      /^[0-9]*$/.test(inputValue)
    ) {
      setItem(inputValue);
      setStatus("");
      setIconType("success");
      updateAppDetails({ name: fieldName, value: inputValue });
    } else if (inputValue.length == digits + 1) {
      setStatus("");
      setIconType("success");
    } else {
      setStatus("error");
      setIconType("error");
      updateAppDetails({ name: fieldName, value: '' });
    }
  }
  function onBlur() {
    if (!getItem || isNaN(getItem)) {
      setStatus("error");
      setIconType("error");
    } else {
      setStatus("");
      setIconType("success");
    }
  }

  React.useEffect(() => {
    if (rendered) {
      setIconType(false);
      onBlur();
    }
  }, []);

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
        autoComplete="new-password"
          disabled={disabled}
          readOnly={readOnly}
          value={getItem}
          onChange={onChangeValue}
          size="large"
          placeholder={placeHolder}
          // autoComplete="off"
          style={{ width: "100%" }}
          //onBlur={onBlur}
          status={getStatus}
          suffix={
            <span style={{ visibility: getIconType ? "visible" : "hidden" }}>
              {getStatus === "error" ? (
                <ExclamationCircleFilled
                  style={{ color: "#ff6767", fontSize: "12px" }}
                />
              ) : (
                <CheckCircleFilled
                  style={{ color: "#00cc00", fontSize: "12px" }}
                />
              )}
            </span>
          }
        />
        {getStatus === "error" ? (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {placeHolder !== "No. of Dependents"
              ? `${placeHolder} Required`
              : `${placeHolder} Required (Anything Between 0 and 99)`}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LabeledInput_Numeric;
