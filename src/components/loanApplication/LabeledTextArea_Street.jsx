import { Input, Select } from "antd";

import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";

import React from "react";
import { toUpperText } from "@utils/Converter";

function LabeledTextArea_Street({
  rendered,
  required,
  type,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  //   getAppDetails,
  data,
  options,
  className_dmain,
  className_dsub,
  className_label,
}) {
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem] = React.useState(value || '')
  // let getItem = value ? value : "";
  const [hasMounted, setHasMounted] = React.useState(false);

  const onChangeSelect = (e) => {
    const upper = toUpperText(e.target.value); 
    setItem(upper);
    receive(upper);
    validateSelection(upper); 
  };

  const validateSelection = (selectedValue) => {
    if (!selectedValue) {
      setStatus("error"); 
      setIcon(true);
    } else {
      setStatus("");
      setIcon(true);
    }
  };

  const onBlur = () => {
    validateSelection(getItem);
  };

  React.useEffect(() => {
    if (hasMounted) {
      validateSelection(getItem);
    }
  }, [getItem]);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  React.useEffect(() => {
    if (rendered) {
      onBlur();
    }
  }, []);

  React.useEffect(() => {
    setItem(value || ""); 
  }, [value]); 


  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub} style={{ position: "relative" }}>
          <Input.TextArea
          autoComplete="new-password"
            showCount
            placeholder={placeHolder}
            maxLength={250}
            style={{
              height: 100,
              resize: "none",
            }}
            onChange={(e) => {
              onChangeSelect(e);
            }}
            onBlur={onBlur}
            // autoComplete="off"
            disabled={
              (type === "permanent"
                ? data.ofwSameAdd
                : type === "beneficiary"
                ? data.bensameadd
                : type === "provincial"
                ? data.ofwProvSameAdd
                : type === "coborrow"
                ? data.coborrowSameAdd
                : null) ||
              (disabled ? true : disabled == undefined ? true : false)
            }
            value={getItem}
            status={getStatus}          
          />
                  {getIcon && (
          <span style={{ position: "absolute", right: "10px", top: "2px" }}>
            {getStatus === "error" ? (
              <ExclamationCircleFilled style={{ color: "#ff6767", fontSize: "12px" }} />
            ) : (
              <CheckCircleFilled style={{ color: "#00cc00", fontSize: "12px" }} />
            )}
          </span>
        )}

          {required || required == undefined ? (
            getStatus === "error" ? (
              <div className="text-xs text-red-500 pt-1 pl-2">
                {`${placeHolder} Required`}
              </div>
            ) : null
          ) : null}
        </div>
      </div>
    );
  }

  export default LabeledTextArea_Street;
