import * as React from "react";
import { Input } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput({
  required,
  label,
  placeHolder,
  value,
  receive,
  category,
  readOnly,
  type,
  disabled,
  className_dmain,
  className_label,
  className_dsub,
  fieldName
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  let getItem = value || "";
  function onChange(e) {
    let newValue = e.target.value;
    setIcon(false);
    getItem = newValue;

    if (newValue) {
      setStatus("");
      setIcon(true);
      updateAppDetails({ name: fieldName, value: newValue })
    } else {
      setStatus("error");
      setIcon(true);
      updateAppDetails({ name: fieldName, value: null })
    }
  }
  function onBlur() {
    setIcon(true);
    if (!getItem) {
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
          disabled={disabled}
          className={`w-full ${readOnly ? "bg-[#f5f5f5]" : "bg-[#ffffff]"}`}
          readOnly={readOnly}
          value={getItem}
          onChange={(e) => {
            onChange(e);
          }}
          size="large"
          placeholder={placeHolder}
          autoComplete="off"
          style={{ width: "100%" }}
          onBlur={(e) => {
            onBlur(e);
          }}
          status={
            !readOnly && (required || required == undefined) ? getStatus : false
          }
          suffix={
            !readOnly && (required || required == undefined) ? (
              <span style={{ visibility: getIcon ? "visible" : "hidden" }}>
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
            ) : (
              <></>
            )
          }
        />
        {!readOnly && (required || required == undefined) ? (
          getStatus === "error" ? (
            <div className="text-xs text-red-500 pt-1 pl-2">
              {placeHolder !== "FB Profile"
                ? `${placeHolder} Required`
                : `${placeHolder} Required (e.g. http://www.facebook.com/jdelacruz)`}
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

export default LabeledInput;
