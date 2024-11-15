import * as React from "react";
import { Select, ConfigProvider, Input } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelect({
  required,
  showSearch,
  placeHolder,
  label,
  data,
  value,
  receive,
  readOnly,
  disabled,
  category,
  className_dmain,
  className_label,
  className_dsub,
  fieldName,
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  let getItem = value;

  function onChange(e) {
    getItem = e;
    if (!e) {
        updateAppDetails({ name: fieldName, value: null })
      setStatus("error");
      setIcon(true);
    } else {
        updateAppDetails({ name: fieldName, value: e })
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

  const selected = data?.find((sel) => sel.value === getItem)?.label || "";

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
        {disabled ? (
          <Input
            readOnly={disabled}
            className={`w-full ${disabled ? "bg-[#f5f5f5]" : "bg-[#ffffff]"}`}
            value={selected}
            size="large"
            placeholder={placeHolder}
            autoComplete="off"
            style={{ width: "100%" }}
          />
        ) : (
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  colorBgContainer: disabled ? "#f5f5f5" : "#ffffff",
                },
              },
            }}
          >
            <Select
              options={data?.map((x) => ({
                value: x.value,
                label: x.label,
              }))}
              disabled={disabled}
              value={getItem || undefined}
              className="w-full text-left"
              size="large"
              placeholder={placeHolder}
              onChange={(e) => {
                onChange(e);
              }}
              onBlur={(e) => {
                onBlur(e);
              }}
              showSearch={showSearch}
              status={
                !disabled && (required || required == undefined)
                  ? getStatus
                  : null
              }
              style={{ width: "100%" }}
              suffixIcon={
                !disabled && (required || required == undefined) ? (
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
            {!disabled && (required || required == undefined) ? (
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
          </ConfigProvider>
        )}
      </div>
    </div>
  );
}

export default LabeledSelect;
