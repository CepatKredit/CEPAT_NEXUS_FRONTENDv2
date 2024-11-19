import * as React from "react";
import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelec_ValidId({
  rendered,
  required,
  placeHolder,
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
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  let getItem = getAppDetails[fieldName] || "";

  const getValidIdSelect = useQuery({
    queryKey: ["getValidIdSelect"],
    queryFn: async () => {
      const result = await axios.get("/GroupGet/G27IT");
      return result.data.list;
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
          options={getValidIdSelect.data?.map((x) => ({
            value: x.id,
            label: x.name,
          }))}
          value={getAppDetails[fieldName] || undefined}
          disabled={disabled}
          size="large"
          placeholder={placeHolder}
          showSearch
          filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(e) => {
            onChange(e);
          }}
          //onBlur={(e) => { onBlur(e) }}
          readOnly={readOnly}
          status={required || required == undefined ? getStatus : false}
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
                ? `${placeHolder} Required`
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

export default LabeledSelec_ValidId;
