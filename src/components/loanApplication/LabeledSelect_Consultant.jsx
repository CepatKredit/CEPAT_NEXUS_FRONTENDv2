import * as React from "react";
import { Select, Input, ConfigProvider } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelect_Consultant({
  rendered,
  required,
  placeHolder,
  className,
  label,
  data,
  value,
  receive,
  disabled,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
  fieldName
}) {
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );

  const [status, setStatus] = React.useState("");
  const [icon, setIcon] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(getAppDetails[fieldName] || '');

  React.useEffect(() => {
    setStatus(null)
    setIcon(false)
    setSelectedValue("")
  }, [!getAppDetails.dataPrivacy])

  const { data: consultantData } = useQuery({
    queryKey: ["getLoanConsultant"],
    queryFn: async () => {
      const result = await GET_LIST("/v1/GET/G21LC");
      return result.list;
    },
    refetchInterval: 30 * 1000,
    retryDelay: 1000,
  });

  function GetConsultant() {
    var data = consultantData?.find((x) => {
      if (x.fullName === selectedValue || x.id === selectedValue) {
        return x.fullName;
      }
    });
    return data;
  }

  function onChange(e) {
    setSelectedValue(e);
    updateAppDetails({ name: fieldName, value: e });

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
    if (!selectedValue) {
      setStatus("error");
    } else {
      setStatus("");
    }
  }
  React.useEffect(() => {
    onBlur();
  }, []);

  return (
    <div className={className_dmain}>
      <div>
        <label className={className_label}>{label}</label>
      </div>
      <div className={className_dsub}>
        <Select
          options={
            consultantData
              ? consultantData.map((x) => ({
                  value: x.id,
                  label: x.fullName,
                }))
              : []
          }
          value={selectedValue || undefined}
          style={{ width: "100%" }}
          size="large"
          disabled={disabled}
          placeholder={placeHolder}
          //showSearch={showSearch}
          onChange={onChange}
          //onBlur={onBlur}
          allowClear
          status={
            !disabled && (required || required === undefined)
              ? status
              : undefined
          }
          suffixIcon={
            !disabled && (required || required === undefined) ? (
              icon ? (
                status === "error" ? (
                  <ExclamationCircleFilled
                    style={{ color: "#ff6767", fontSize: "12px" }}
                  />
                ) : (
                  <CheckCircleFilled
                    style={{ color: "#00cc00", fontSize: "12px" }}
                  />
                )
              ) : null
            ) : null
          }
        />
        {!disabled &&
        (required || required === undefined) &&
        status === "error" ? (
          <div className="text-xs text-red-500 pt-1 pl-2">
            {placeHolder + " Required"}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LabeledSelect_Consultant;
