import * as React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function DatePicker_Deployment({
  rendered,
  disabledate,
  placeHolder,
  label,
  value,
  receive,
  disabled,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  let getItem = value ? dayjs(value) : "";

  function selectedDate(date) {
    // Immediately update the item state first
    getItem = date;
    if (!dayjs().isBefore(date, "day") && !dayjs().isSame(dayjs(date), "day")) {
      // If the selected date is in the past or today, set error state
      setStatus("error");
      setIcon(true);
      updateAppDetails({
        name: "loanDateDep",
        value: null,
      });
    } else {
      // Valid date selection
      setStatus("");
      setIcon(true);
      updateAppDetails({
        name: "loanDateDep",
        value: dayjs(date).format("MM-DD-YYYY"),
      });
    }
  }
  const isDateTimeValid = (dateStr) => {
    return dayjs(dateStr).isValid();
  };

  React.useEffect(() => {
    if (rendered) {
      if (
        !dayjs().isBefore(dayjs(value), "day") &&
        !dayjs().isSame(dayjs(value), "day")
      ) {
        setStatus("error");
        setIcon(true);
      } else {
        setStatus("");
        setIcon(true);
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
        <DatePicker
          allowClear
          disabledDate={disabledate}
          value={getItem && isDateTimeValid(getItem) ? getItem : null}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          onChange={(e) => {
            selectedDate(e);
          }}
          //onBlur={(e) => { 'Birth'.includes(label) ? onBlur_bdate(e) : onBlur_deploy(e) }}
          readOnly={readOnly}
          status={getStatus}
          style={{ width: "100%" }}
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
          format={"MM-DD-YYYY"}
        />
        {getStatus === "error" ? (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {`${label} Required (MM-DD-YYYY)`}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default DatePicker_Deployment;
