import { Select } from "antd";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";
import React from "react";
import { debounce } from "@utils/Debounce";

function LabeledSelect_AddressFields({
  rendered,
  required,
  type,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  data,
  options,
  className_dmain,
  className_dsub,
  className_label,
}) {
    
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  const [getItem, setItem] = React.useState(value || "");
  const [hasMounted, setHasMounted] = React.useState(false);

  // Debounce the value change to avoid updating state on every keystroke
  const debouncedReceive = React.useCallback(
    debounce((newValue) => {
      receive(newValue);
    }, 300),
    [receive]
  );

//   let getItem = value || "";
  function onChangeSelect(e) {
    setItem(e);
    debouncedReceive(e);
    // getItem = e;
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
      onBlur();
    }
  }, []);

  React.useEffect(() => {
    setItem(value); // Update local state with new value

    if (hasMounted) {
    if (!value) {
      setStatus("error");
      setIcon(true);
    } else {
      setStatus(""); // Clear status if there's a value
      setIcon(true);
    }
  }
  }, [value]);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

//   React.useEffect(() => {
//     if (rendered) {
//       onBlur();
//     }
//   }, []);

//   const getProvince = () => {
//     switch (type) {
//       case "present":
//         return data.ofwPresProv;
//       case "permanent":
//         return data.ofwPermProv;
//       case "beneficiary":
//         return data.benpresprov;
//       case "provincial":
//         return data.ofwprovProv;
//       case "coborrow":
//         return data.coborrowProv;
//       default:
//         return null;
//     }
//   };

//   const getMunicipality = () => {
//     switch (type) {
//       case "present":
//         return data.ofwPresMunicipality;
//       case "permanent":
//         return data.ofwPermMunicipality;
//       case "beneficiary":
//         return data.benpresmunicipality;
//       case "provincial":
//         return data.ofwprovMunicipality;
//       case "coborrow":
//         return data.coborrowMunicipality;
//       default:
//         return null;
//     }
//   };

//   const getBarangay = () => {
//     switch (type) {
//       case "present":
//         return data.ofwPresBarangay;
//       case "permanent":
//         return data.ofwPermBarangay;
//       case "beneficiary":
//         return data.benpresbarangay;
//       case "provincial":
//         return data.ofwprovBarangay;
//       case "coborrow":
//         return data.coborrowBarangay;
//       default:
//         return null;
//     }
//   };

//   React.useEffect(() => {
//     if (!rendered) return;
//     const isValid = (label) => {
//       switch (label) {
//         case "Area / Province":
//           return !!getProvince();
//         case "City / Municipality":
//           return !!getMunicipality();
//         case "Barangay":
//           return !!getBarangay();
//         default:
//           return true;
//       }
//     };

//     setIcon(true);

//     if (!isValid(label)) {
//       setStatus("error");
//     } else {
//       setStatus("");
//     }
//   }, [
//     data.ofwSameAdd,
//     data.bensameadd,
//     data.ofwProvSameAdd,
//     data.ofwPresProv,
//     data.ofwPermProv,
//     data.benpresprov,
//     data.ofwPresBarangay,
//     data.ofwPermBarangay,
//     data.benpresbarangay,
//     data.ofwPresMunicipality,
//     data.ofwPermMunicipality,
//     data.benpresmunicipality,
//     data.ofwPresStreet,
//     data.ofwPermStreet,
//     data.benpresStreet,
//     data.ofwprovProv,
//     data.ofwprovMunicipality,
//     data.ofwprovBarangay,
//     data.coborrowProv,
//     data.coborrowMunicipality,
//     data.coborrowBarangay,
//     data.coborrowStreet,
//   ]);

  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub}>
        <Select
          style={{ width: "100%" }}
          size="large"
          placeholder={placeHolder}
          allowClear
          showSearch
          options={options}
          disabled={disabled}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          value={value || undefined}
          onChange={onChangeSelect}
          onBlur={onBlur}
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

        {required || required == undefined ? (
          getStatus === "error" ? (
            <div className="text-xs text-red-500 pt-1 pl-2">
              {placeHolder !== "FB Profile"
                ? `${placeHolder} Required`
                : `${placeHolder} Required (e.g. http://www.facebook.com/jdelacruz)`}
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

export default LabeledSelect_AddressFields;
