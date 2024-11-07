import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { Radio } from "antd";
import React from "react";

function GenderRadioGroup({
  classname_main,
  className_label,
  className_dsub,
  direct,
  fieldName,
  rendered,
}) {
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem ] = React.useState("")

  React.useEffect(() => {
    if (rendered) {
      setIcon(false);
      if (getAppDetails[fieldName]) {
        setStatus(""); // Success
        setIcon(true);
      } else {
        setStatus("error"); // Error
        setIcon(true);
      }
    }
  }, []);

  const handleGenderChange = (e) => {
    let selectedValue = e.target.value 
    if (!selectedValue) {
      setStatus("error");
      setIcon(true);
      updateAppDetails({
        name: getAppDetails[fieldName],
        value: null,
      });
    } else {
      setStatus("");
      setIcon(true);
      setItem(selectedValue)
      console.log("GENDER SELECTED", selectedValue)
      updateAppDetails({
        name: getAppDetails[fieldName],
        value: selectedValue,
      });
    }
  };

  return (
    <div className={classname_main}>
      <label className={className_label}>
        Gender <span className="text-red-500">*</span>
      </label>
      <div className={className_dsub}>
        <Radio.Group
          onChange={handleGenderChange}
          value={getItem}
          disabled={!direct && !getAppDetails.dataPrivacy}
          className={getStatus === "error" ? "border border-red-500" : ""}
        >
          <Radio value={1}>Male</Radio>
          <Radio value={2}>Female</Radio>
        </Radio.Group>

        {getIcon &&
          (getStatus === "error" ? (
            <ExclamationCircleFilled
              style={{ color: "#ff6767", fontSize: "12px", marginLeft: "8px" }}
            />
          ) : (
            <CheckCircleFilled
              style={{ color: "#00cc00", fontSize: "12px", marginLeft: "8px" }}
            />
          ))}
        {getStatus === "error" && (
          <div className="text-xs text-red-500 pt-1 pl-2">
            Gender is required
          </div>
        )}
      </div>
    </div>
  );
}

export default GenderRadioGroup;
