import * as React from "react";
import { Input } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput_Contact({
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
  required,
  fieldName,
}) {
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );

  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem] = React.useState(
    getAppDetails[fieldName] || "09"
  );

  function onChangeValue(e) {
    let newValue = e.target.value;

    if (/^[0-9]*$/.test(newValue)) {
      if (newValue.length <= 10) {
        if (!newValue.startsWith("09")) {
          newValue = "09" + newValue.slice(2);
        }
        setItem(newValue);
        updateAppDetails({ name: fieldName, value: null });
        setStatus("error");
        setIcon(true);
      } else if (newValue.length === 11) {
        setStatus("success");
        setIcon(true);
        updateAppDetails({ name: fieldName, value: newValue });
      }
    }
  }

  // function onBlur() {
  //   setIcon(true);
  //   if (getItem.length !== 11 || isNaN(getItem)) {
  //     setStatus("error");
  //   } else {
  //     setStatus("success");
  //     setIcon(true)
  //   }
  // }

  React.useEffect(() => {
    if (rendered) {
      setIcon(false);
      if (getAppDetails[fieldName]) {
        setStatus(""); 
        setIcon(true);
      } else {
        setStatus("error");
        setIcon(true); 
      }
    }
  }, [])

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
          value={getItem}
          onChange={onChangeValue}
          size="large"
          placeholder={placeHolder} 
          autoComplete="off"
          style={{ width: "100%" }}
          // onBlur={onBlur}
          status={required || required === undefined ? getStatus : false}
          maxLength={11}
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

export default LabeledInput_Contact;
