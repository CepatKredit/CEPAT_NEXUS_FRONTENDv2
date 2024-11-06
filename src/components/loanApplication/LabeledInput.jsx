import * as React from "react";
import { Input } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput({
  rendered,
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
  fieldName,
}) {
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem] = React.useState(getAppDetails[fieldName] || "");

  function onChange(e) {
    let newValue = e.target.value;
    setIcon(false);
    setItem(newValue);

    if (newValue) {
      setStatus("");
      setIcon(true);
    //   receive(newValue);
      updateAppDetails({ name: fieldName, value: newValue });
    } else {
      setStatus("error");
      setIcon(true);
      updateAppDetails({ name: fieldName, value: "" });
    }
  }
  function onBlur() {
    // Automatically close tooltip on blur
    setIcon(true);
    if (!getItem) {
      setStatus("error"); // Set error status when input is invalid
    } else {
      setStatus("");
    }
  }

  React.useEffect(() => {
    if (rendered) {
      setIcon(false);
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
          disabled={disabled}
          readOnly={readOnly}
          value={getItem}
          onChange={onChange}
          size="large"
          placeholder={placeHolder}
          autoComplete="off"
          style={{ width: "100%" }}
          maxLength={label === "Facebook Profile/Name" ? 150 : 80}
          //onBlur={(e) => { onBlur(e) }}
          status={required || required == undefined ? getStatus : false}
          suffix={
            required || required == undefined ? (
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
        {required || required == undefined ? (
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
