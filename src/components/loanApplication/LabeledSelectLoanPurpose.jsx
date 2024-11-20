import * as React from "react";
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { useSelectValidation } from "@hooks/ValidationSelectInputHook";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelectLoanPurpose({
  rendered,
  label,
  value,
  placeHolder,
  showSearch,
  disabled,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
}) {

const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext)
const { getStatus, getIcon, onChange, onBlur } = useSelectValidation(getAppDetails.loanPurpose, rendered, (e) => updateAppDetails( {name: "loanPurpose",
        value: e,
      }));

  const data = useQuery({
    queryKey: ["getLoanPurpose"],
    queryFn: async () => {
      const result = await GET_LIST("/api/v1/GET/G20LP");
      console.log("HELLO ", result)
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
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
          value={getAppDetails.loanPurpose || undefined}
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
          showSearch={showSearch}
          filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
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
