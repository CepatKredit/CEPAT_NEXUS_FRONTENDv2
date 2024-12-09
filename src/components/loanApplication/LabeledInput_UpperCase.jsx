import * as React from "react";
import { Input } from "antd";
import { toDecrypt, toUpperText } from "@utils/Converter";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { GetData } from "@utils/UserData";

function LabeledInput_UpperCase({
  rendered,
  required,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  type,
  fieldName,
  category,
  className_dmain,
  className_label,
  className_dsub,
}) {
  // let inputValue = value || '';
  const USRNAME = toDecrypt(localStorage.getItem("USRFN"));
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const inputRef = React.useRef(null);
  const cursorPosition = React.useRef(null); // Track cursor position

  React.useEffect(() => {
    setStatus(null)
    setIcon(false)
  }, [!getAppDetails.dataPrivacy])

  function onChange(e) {
    const { value, selectionStart, selectionEnd } = e.target;
    // Update cursor position
    cursorPosition.current = {
      start: selectionStart,
      end: selectionEnd,
    };
    const newValue = e.target.value.replace(/[^a-zA-Z\s]/g, "").slice(0, 80);
    const upperValue = newValue.toUpperCase();
    updateAppDetails({ name: fieldName, value: upperValue });

    if (upperValue) {
      setStatus("");
      setIcon(true);
    } else {
      setStatus("error");
      setIcon(true);
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(cursorOffset, cursorOffset);
      }
    }, 0);
  }

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
  }, []);

  React.useEffect(() => {
    if (inputRef && inputRef.current && cursorPosition.current) {
      inputRef.current.setSelectionRange(cursorPosition.current.start, cursorPosition.current.end);
    }
  }, [getAppDetails[fieldName]]);


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
          ref={inputRef}
          style={{ width: "100%" }}
          autoComplete="new-password"
          size="large"
          value={
            fieldName === "consultName" && GetData("ROLE")?.toString() === "20"
              ? USRNAME
              : getAppDetails[fieldName] || ""
          }
          placeholder={placeHolder}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          status={required || required === undefined ? getStatus : false}
          maxLength={label === "Loan Consultant Name" ? 150 : 80}
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

export default LabeledInput_UpperCase;
