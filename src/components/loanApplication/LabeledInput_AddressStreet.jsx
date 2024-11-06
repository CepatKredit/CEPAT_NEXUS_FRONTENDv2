import * as React from "react";
import { Input } from "antd";
import { toUpperText } from "@utils/Converter";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledInput_AddressStreet({
  // getAppDetails,
  type,
  required,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  className_label,
  className,
}) {
    const { getAppDetails } = React.useContext(LoanApplicationContext)
  let inputValue = value || "";
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  function onChange(e) {
    let newValue = e.target.value;
    const letterAndSpaceValue = newValue.slice(0, 250);
    setIcon(false);
    const upperValue = toUpperText(letterAndSpaceValue);
    inputValue = upperValue; // Set uppercase input

    // Real-time validation
    if (letterAndSpaceValue) {
      setStatus(""); // Set checkmark icon when input is valid
      setIcon(true); // Automatically close tooltip when input is valid
      receive(upperValue);
    } else {
      setStatus("error"); // Set error status when input is empty
      setIcon(true); // Keep tooltip visible when input is empty
      receive();
    }
  }
  //Fix here
  const didMountRef = React.useRef(false);
  React.useEffect(() => {
    if (didMountRef.current) {
      setIcon(false);
      if (!value) {
        setStatus("error"); // Set error status when input is empty
        setIcon(true); // Keep tooltip visible when input is empty
      } else {
        setStatus(""); // Set checkmark icon when input is valid
        setIcon(true); // Automatically close tooltip when input is valid
      }
    } else {
      didMountRef.current = true;
    }
  }, [
    type == "present"
      ? (getAppDetails.ofwPresProv, getAppDetails.ofwPresBarangay, getAppDetails.ofwPresMunicipality)
      : type == "permanent"
      ? (getAppDetails.ofwPermProv, getAppDetails.ofwPermBarangay, getAppDetails.ofwPermMunicipality)
      : type == "beneficiary"
      ? (getAppDetails.benpresprov, getAppDetails.benpresbarangay, getAppDetails.benpresmunicipality)
      : null,
  ]);

  return (
    <div className={className}>
      <div>
        <label className={className_label}>{label}</label>
      </div>
      <div>
        <Input
          style={{
            resize: "none",
          }}
          size="large"
          value={inputValue}
          placeholder={placeHolder}
          onChange={(e) => {
            onChange(e);
          }}
          disabled={disabled}
          readOnly={readOnly}
          status={required || required === undefined ? getStatus : false}
          maxLength={250}
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

export default LabeledInput_AddressStreet;
