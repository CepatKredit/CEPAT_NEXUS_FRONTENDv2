import * as React from "react";
import { Input, Form, Tooltip } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput({
  rendered,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  type,
  category,
  className_dmain,
  className_label,
  className_dsub,
  fieldName,
  required
}) {
  const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);

  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  function onChange(e) {
    const newValue = e.target.value;
    newValue.match(isValidEmail)
    updateAppDetails({ name: fieldName, value: newValue });

    // Real-time validation
    if (newValue && newValue.match(isValidEmail)) {
      setStatus("");
      setIcon(true);
    } else {
      setStatus("error");
      setIcon(true);
    }
  }

  // function onBlur() {
  //   // Trigger validation on blur
  //   if (!inputValue || !inputValue.match(isValidEmail)) {
  //     setStatus("error");
  //     setIconType("error");
  //   } else {
  //     setStatus("");
  //     setIconType("success");
  //   }
  // }

  React.useEffect(() => {
    if (rendered) {
      setIcon(false);
      if (getAppDetails[fieldName]) {
        setStatus(""); // Set checkmark icon when input is valid
        setIcon(true); // Automatically close tooltip when input is valid
      } else {
        setStatus("error"); // Set error status when input is empty
        setIcon(true); // Keep tooltip visible when input is empty
      }
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
          disabled={disabled}
          readOnly={readOnly}
          value={getAppDetails[fieldName] || ""}
          onChange={onChange}
          size="large"
          placeholder={placeHolder}
          autoComplete="off"
          style={{ width: "100%" }}
          maxLength={100}
          status={required || required === undefined ? getStatus : false}
          suffix={
            required || required === undefined ? (
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
        {required || required === undefined ? (
          getStatus === "error" ? (
            <div className="text-xs text-red-500 pt-1 pl-2">
              {placeHolder + " Required"}
            </div>
          ) : (
            <></>
          )
        ) : null}
      </div>
    </div>
  );
}

export default LabeledInput;
