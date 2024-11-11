import * as React from "react";
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { useSelectValidation } from "@hooks/ValidationSelectInputHook";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelectLoanProduct({
  label,
  value,
  receive,
  disabled,
  category,
  className_dmain,
  className_label,
  className_dsub,
  placeHolder,
  readOnly,
  rendered,
  showSearch,
}) {
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );

  const { getStatus, getIcon, onChange, onBlur } = useSelectValidation(
    getAppDetails.loanProd,
    rendered,
    (e) => updateAppDetails({ name: "loanProd", value: e })
  );

  const ProductSelect = useQuery({
    queryKey: ["getProductSelect"],
    queryFn: async () => {
      const result = await GET_LIST("/getListLoanProduct");
      return result.list;
    },
    refetchInterval: 5000,
    enabled: true,
    retryDelay: 1000,
  });

  //could be separated
  const options = ProductSelect.data?.map((x) => ({
    value: x.code,
    label: x.description,
  }));
  const suffixIcon = getIcon ? (
    getStatus === "error" ? (
      <ExclamationCircleFilled style={{ color: "#ff6767", fontSize: "12px" }} />
    ) : (
      <CheckCircleFilled style={{ color: "#00cc00", fontSize: "12px" }} />
    )
  ) : null;

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
          options={options}
          value={getAppDetails.loanProd || undefined}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          onClick={() => {
            ProductSelect.refetch();
          }}
          onChange={onChange}
          onBlur={onBlur}
          showSearch={showSearch}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          readOnly={readOnly}
          status={getStatus}
          style={{ width: "100%" }}
          suffixIcon={suffixIcon}
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

export default LabeledSelectLoanProduct;
