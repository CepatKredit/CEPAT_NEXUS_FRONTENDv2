import * as React from "react";

import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelect_Country({
  rendered,
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
  fieldName,    
}) {
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  let getItem = value;

  const getCountrySelect = useQuery({
    queryKey: ["getCountrySelect"],
    queryFn: async () => {
      const result = await GET_LIST("/OFWDetails/getCountry");
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  function onChange(e) {
    updateAppDetails({ name: fieldName, value: e });

    getItem = e;
    if (!e) {
      setStatus("error");
      setIcon(true);
    } else {
      setStatus("");
      setIcon(true);
    }
  }

  const onBlur = () => {
    setIcon(true);
    if (!getAppDetails[fieldName]) {
      setStatus("error");
    } else {
      setStatus("");
    }
  };
  
  React.useEffect(() => {
    if (rendered) {
      setIcon(false);
      onBlur();
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
        <Select
          placeholder={placeHolder}
          options={getCountrySelect.data?.map((x) => ({
            value: x.code,
            label: x.description,
          }))}
          value={getAppDetails[fieldName] || undefined}
          disabled={disabled}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          size="large"
          onClick={() => getCountrySelect.refetch()}
          onChange={(e) => {
            onChange(e);
          }}
          //onBlur={(e) => { onBlur(e) }}
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
            {placeHolder !== "Please Select..."
              ? `${placeHolder} Required`
              : `Required`}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default LabeledSelect_Country;
