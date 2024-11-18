import * as React from "react";
import { Select, ConfigProvider, Input } from "antd";
import { useQuery } from "@tanstack/react-query";
import { GET_LIST } from "@api/base-api/BaseApi";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function LabeledSelect_Relationship({
  showSearch,
  required,
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
  fieldName
}) {
    const { updateAppDetails } = React.useContext(LoanApplicationContext)
  const [status, setStatus] = React.useState("");
  const [icon, setIcon] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  const { data: relationshipOptions, isLoading } = useQuery({
    queryKey: ["getRelationship"],
    queryFn: async () => {
      const result = await GET_LIST("/v1/GET/G33RR");
      return result.list;
    },
    refetchInterval: 30 * 1000,
    retryDelay: 1000,
  });

  function onChange(value) {
    setSelectedValue(value);
    // receive(value);
    updateAppDetails({ name: fieldName, value: value })

    if (!value) {
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

  return (
    <div className={className_dmain}>
      <div>
        <label className={className_label}>{label}</label>
      </div>
      <div className={className_dsub}>
        {disabled ? (
          <Input
            readOnly={disabled}
            className={`w-full ${disabled ? "bg-[#f5f5f5]" : "bg-[#ffffff]"}`}
            value={
              !selectedValue
                ? ""
                : selectedValue === 14
                ? "Aunt"
                : selectedValue === 18
                ? "Brother"
                : selectedValue === 12
                ? "Brother-in-law / Sister-in-law"
                : selectedValue === 24
                ? "Common-Law-Spouse"
                : selectedValue === 15
                ? "Cousin"
                : selectedValue === 26
                ? "Daughter"
                : selectedValue === 11
                ? "Father-in-law / Mother-in-law"
                : selectedValue === 9
                ? "Fiancé / Live-in-partner"
                : selectedValue === 28
                ? "Grandchild"
                : selectedValue === 21
                ? "Grandparent"
                : selectedValue === 36
                ? "Grandparent-in-law"
                : selectedValue === 35
                ? "Half-siblings"
                : selectedValue === 29
                ? "Legal Guardian"
                : selectedValue === 17
                ? "Nephew"
                : selectedValue === 16
                ? "Niece"
                : selectedValue === 20
                ? "Parent"
                : selectedValue === 19
                ? "Sister"
                : selectedValue === 27
                ? "Son-in-law / Daughter-in-law"
                : selectedValue === 37
                ? "Spouse"
                : selectedValue === 31
                ? "Step-child"
                : selectedValue === 30
                ? "Step-grandparent"
                : selectedValue === 32
                ? "Step-parent"
                : selectedValue === 34
                ? "Step-sibling"
                : "Uncle"
            }
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
              options={
                relationshipOptions
                  ? relationshipOptions.map((x) => ({
                      label: x.description,
                      value: x.code,
                    }))
                  : []
              }
              value={selectedValue || undefined}
              className="w-full text-left"
              size="large"
              disabled={disabled}
              placeholder={placeHolder}
              showSearch={showSearch}
              onChange={onChange}
              onBlur={onBlur}
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
          </ConfigProvider>
        )}
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

export default LabeledSelect_Relationship;
