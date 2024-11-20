import * as React from "react";
import { Select, Form, Tooltip } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelect_Relationship({
  rendered,
  showSearch,
  placeHolder,
  label,
  value,
  disabled,
  readOnly,
  category,
  className_dmain,
  className_label,
  className_dsub,
  fieldName,
}) {
    const {getAppDetails, updateAppDetails} = React.useContext(LoanApplicationContext)
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem] = React.useState(getAppDetails[fieldName] || "")
//   let getItem = value;

  const getRelationship = useQuery({
    queryKey: ["getRelationship"],
    queryFn: async () => {
      const result = await GET_LIST("/GET/G33RRp");
      return result.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  function onChange(e) {

    setItem(e)
    if (!e) {
      setStatus("error");
      setIcon(true);
    } else {
      setStatus("");
      setIcon(true);
      updateAppDetails({ name: fieldName, value: e })
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

  React.useEffect(() => {
    if (rendered) {
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
          style={{ width: "100%" }}
          options={
            getRelationship.data
              ? getRelationship.data.map((x) => ({
                  label: x.description,
                  value: x.code,
                }))
              : []
          }
          value={getAppDetails[fieldName] || undefined}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(e) => {
            onChange(e);
          }}
          onBlur={(e) => {
            onBlur(e);
          }}
          readOnly={readOnly}
          status={getStatus}
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

export default LabeledSelect_Relationship;
