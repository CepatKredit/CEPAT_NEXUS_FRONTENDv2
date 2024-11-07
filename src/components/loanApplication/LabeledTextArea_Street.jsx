import { Input, Select } from "antd";

import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";

import React from "react";
import { toUpperText } from "@utils/Converter";

function LabeledTextArea_Street({
  rendered,
  required,
  type,
  label,
  placeHolder,
  value,
  receive,
  disabled,
  readOnly,
  //   getAppDetails,
  data,
  options,
  className_dmain,
  className_dsub,
  className_label,
}) {
  const [getStatus, setStatus] = React.useState("");
  const [getIcon, setIcon] = React.useState(false);
  //const [getItem, setItem] = React.useState(value || '')
  let getItem = value ? value : "";

  function onChangeSelect(e) {
    let upper = e.target.value;
    getItem = toUpperText(upper); //uppercase
    if (!upper) {
      setStatus("error");
      setIcon(true);
      receive();
    } else {
      setStatus("");
      setIcon(true);
      receive(toUpperText(upper));
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

  // React.useEffect(() => {
  //   if (rendered) {
  //     onBlur();
  //   }
  // }, [
  //   data.ofwPresProv,
  //   data.ofwPermProv,
  //   data.benpresprov,
  //   data.ofwSameAdd,
  //   data.bensameadd,
  // ]); // Add dependencies here

  return (
    <div className={className_dmain}>
      <label className={className_label}>{label}</label>
      <div className={className_dsub}>
        <Input.TextArea
          showCount
          placeholder={placeHolder}
          maxLength={250}
          style={{
            height: 100,
            resize: "none",
          }}
          onChange={(e) => {
            onChangeSelect(e);
          }}
          autoComplete="off"
          disabled={
            (type === "permanent"
              ? data.ofwSameAdd
              : type === "beneficiary"
              ? data.bensameadd
              : type === "provincial"
              ? data.ofwProvSameAdd
              : type === "coborrow"
              ? data.coborrowSameAdd
              : null) ||
            (disabled ? true : disabled == undefined ? true : false)
          }
          value={getItem}
          status={getStatus}
          /*
                    suffixIcon={

                        getIcon === true

                            ? getStatus === 'error'

                                ? (<ExclamationCircleFilled style={{ color: '#ff6767', fontSize: '12px' }} />)

                                : (<CheckCircleFilled style={{ color: '#00cc00', fontSize: '12px' }} />)

                            : (<></>)

                    }
*/
        />

        {required || required == undefined ? (
          getStatus === "error" ? (
            <div className="text-xs text-red-500 pt-1 pl-2">
              {`${placeHolder} Required`}
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
}

export default LabeledTextArea_Street;
