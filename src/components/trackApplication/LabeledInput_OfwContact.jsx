import * as React from "react";
import { Input, Select } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { CallCodes } from "@utils/FixedData";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput_OfwContact({
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
  fieldName
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getPref, setPref] = React.useState(
    typeof value === "string" ? value.split("/")[0] : ""
  );
  const [getItem, setItem] = React.useState(
    typeof value === "string" ? value.split("/")[1] : ""
  );

  function onPrefChange(value) {
    setPref(value);
    if (value) {
      if (getItem) {
        updateAppDetails({ name: fieldName, value: value + "/" + getItem })
        setStatus("");
        setIcon(true);
      } else {
        receive();
        setStatus("error");
        setIcon(true);
      }
    } else {
        updateAppDetails({ name: fieldName, value: null })
      setStatus("error");
      setIcon(true);
    }
  }

  function onChange(e) {
    const newValue = e.target.value;
    if (newValue.length == 0) {
      setItem(newValue);
      setStatus("error");
      setIcon(true);
      updateAppDetails({ name: fieldName, value: null })
    } else if (/^[0-9]*$/.test(newValue)) {
      setItem(newValue);
      setIcon(false);
      if (getPref) {
        setStatus("");
        setIcon(true);
        updateAppDetails({ name: fieldName, value: getPref + "/" + newValue })
      } else {
        setStatus("error");
        setIcon(true);
        updateAppDetails({ name: fieldName, value: null })
      }
    }
  }

  function onBlur() {
    setIcon(true);
    if (!getItem) {
      setStatus("error"); // Set error status when input is invalid
    } else {
      setStatus("");
    }
  }
  React.useEffect(() => {
    if (rendered) {
      if (getPref) {
        if (getItem) {
          updateAppDetails({ name: fieldName, value: getPref + "/" + newValue })
          setStatus("");
          setIcon(true);
        } else {
            updateAppDetails({ name: fieldName, value: null })
          setStatus("error");
          setIcon(true);
        }
      } else {
        updateAppDetails({ name: fieldName, value: null });
        setStatus("error");
        setIcon(true);
      }
    }
  }, []);

  const prefix = (
    <Select
      options={CallCodes()?.map((x) => ({
        value: x.value,
        label: x.label,
      }))}
      value={getPref || undefined}
      onChange={(value) => onPrefChange(value)}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.label && option.label.toLowerCase().includes(input.toLowerCase())
      }
      showSearch
      style={{ width: "140px" }}
      dropdownStyle={{ width: "250px" }} // Adjusts the dropdown width
      placeholder={"Country Code"}
    />
  );

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
          addonBefore={prefix}
          disabled={disabled}
          readOnly={readOnly}
          value={getItem}
          onChange={onChange}
          size="large"
          placeholder={placeHolder}
          maxLength={20}
          autoComplete="off"
          style={{ width: "100%" }}
          onBlur={onBlur}
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

export default LabeledInput_OfwContact;
