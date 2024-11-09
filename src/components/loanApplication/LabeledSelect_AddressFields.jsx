import { Select } from "antd";

import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";

import React from "react";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelect_AddressFields({
  rendered,
  required,
  type,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  data,
  options,
  className_dmain,
  className_dsub,
  className_label,
}) {
  const [getStatus, setStatus] = React.useState("");

  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem] = React.useState(value || "");
  const [hasMounted, setHasMounted] = React.useState(false);

  function onChangeSelect(e) {
    setItem(e);
    receive(e);
    // getItem = e;
    if (!e) {
      setStatus("error");
      setIcon(true);
    } else {
      setStatus("");
      setIcon(true);
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

  React.useEffect(() => {
    if (rendered) {
      onBlur();
    }
  }, []);

  React.useEffect(() => {
    setItem(value); // Update local state with new value

    if (hasMounted) {
    if (!value) {
      setStatus("error");
      setIcon(true);
    } else {
      setStatus(""); // Clear status if there's a value
      setIcon(true);
    }
  }
  }, [value]);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub}>
        <Select
          style={{ width: "100%" }}
          size="large"
          placeholder={placeHolder}
          allowClear
          showSearch
          options={options}
          disabled={disabled}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          value={value || undefined}
          onChange={onChangeSelect}
          onBlur={onBlur}
          status={getStatus}
          suffixIcon={
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

export default LabeledSelect_AddressFields;
