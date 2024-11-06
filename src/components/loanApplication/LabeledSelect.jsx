import * as React from "react";
import { Select, Form } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { useSelectValidation } from "@hooks/ValidationSelectInputHook";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { getHCKFILoanCases } from "@utils/Validations";

function LabeledSelect({
  rendered,
  required,
  showSearch,
  placeHolder,
  data,
  label,
  value,
  receive,
  fieldName,
  disabled,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
}) {
  const { getAppDetails, updateAppDetails, handleLoanDetailCases } = React.useContext(LoanApplicationContext);

  // const fieldName = label === 'Loan Terms (in Months)' ? 'loanTerms' : 'hckfi';

  const handleChange = (e) => {
    if (fieldName === 'hckfi') {
      const { name, value } = getHCKFILoanCases(e, handleLoanDetailCases);

      // Use handleLoanDetailCases to update based on processed values
      handleLoanDetailCases({ name, value });
    } else {
      updateAppDetails({ name: fieldName, value: e });
    }
  };

  const { getStatus, getIcon, onChange, onBlur } = useSelectValidation(
    getAppDetails[fieldName], 
    rendered,
    handleChange
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
        <Select
          options={data?.map((x) => ({
            value: x.value,
            label: x.label,
          }))}
          value={getAppDetails[fieldName] || undefined}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          showSearch 
          filterOption={(input, option) => {
          const lowerCaseInput = input.toLowerCase();
          const optionLabel = option.label.toString().toLowerCase();                   
           return (
                  optionLabel.includes(lowerCaseInput) ||
                  option.value.toString().includes(input)
                 );
            }}   
          status={required || required == undefined ? getStatus : null}
          style={{ width: "100%" }}
          suffixIcon={
            required || required == undefined ? (
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
        {required || required == undefined ? (
          getStatus === "error" ? (
            <div className="text-xs text-red-500 pt-1 pl-2">
              {placeHolder !== "Please Select..."
                ? `This field is Required`
                : `Required`}
            </div>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default LabeledSelect;
