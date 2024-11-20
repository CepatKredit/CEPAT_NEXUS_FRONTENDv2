import * as React from "react";
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelectLoanPurpose({
  error_status,
  label,
  value,
  placeHolder,
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
  let getItem = value;

  function onChange(e) {
    getItem = e;
    setIcon(false);

    if (!e) {
      setStatus("error");
      setIcon(true);
    } else {
      setStatus("");
      setIcon(true);
      updateAppDetails({ name: "loanPurpose", value: e })
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

  const data = useQuery({
    queryKey: ["getLoanPurpose"],
    queryFn: async () => {
      const result = await GET_LIST("/api/GET/G20LP");
      return result.list;
    },
    refetchInterval: 30 * 1000,
    retryDelay: 1000,
  });

  return (
    <div className={className_dmain}>
      {category === "marketing" && (
        <div>
          <label className={className_label}>{label}</label>
        </div>
      )}
      {category === "direct" && (
        <label className={className_label}>{label}</label>
      )}
      <div className={className_dsub}>
        <Select
          options={data.data?.map((x) => ({ value: x.id, label: x.purpose }))}
          value={value || undefined}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          onChange={(e) => {
            onChange(e);
          }}
          onBlur={(e) => {
            onBlur(e);
          }}
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
        />
        {getStatus === "error" ? (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {placeHolder + " Required"}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default LabeledSelectLoanPurpose;
