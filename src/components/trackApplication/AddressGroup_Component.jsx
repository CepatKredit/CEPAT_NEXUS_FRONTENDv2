import { Input, Checkbox, Flex } from "antd";
import React, { useState, useEffect } from "react";

import LabeledSelect_Province from "@components/trackApplication/LabeledSelect_Province";
import LabeledSelect_Municipality from "@components/trackApplication/LabeledSelect_Municipality";
import LabeledSelect_Barangay from "@components/trackApplication/LabeledSelect_Barangay";
import LabeledInput_AddressStreet from "@components/trackApplication/LabeledInput_AddressStreet";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ReturnText } from "@utils/Converter";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function AddressContainer({
  data,
  receive,
  type,
  category,
  disabled,
  presaddress,
  className_dmain,
  className_label,
  className_dsub,
  vertical_algin: vertical_align,
}) {
  const { api, updateAppDetails, handleAddressCases } = React.useContext(LoanApplicationContext);
  const provinceList = useQuery({
    queryKey: ["ProvinceListQuery"],
    queryFn: async () => {
      const result = await axios.get("/getProvinceList");
      return result.data.list;
    },
    refetchInterval: (data) => {
      data?.length === 0 ? 500 : false;
    },
    enabled: true,
    retryDelay: 1000,
  });

  const getMunFromProvCode = useQuery({
    queryKey: [
      "getMunFromProvCode",
      type === "present"
        ? data.ofwPresProv
        : type === "permanent"
        ? data.ofwPermProv
        : type === "beneficiary"
        ? data.benpresprov
        : type === "provincial"
        ? data.ofwprovProv
        : type === "coborrow"
        ? data.coborrowProv
        : null,
    ],
    queryFn: async () => {
      const provCode =
        type === "present"
          ? data.ofwPresProv
          : type === "permanent" && data.ofwSameAdd
          ? data.ofwPresProv
          : type === "permanent" && !data.ofwSameAdd
          ? data.ofwPermProv
          : type === "beneficiary" && data.bensameadd
          ? data.ofwPresProv
          : type === "beneficiary" && !data.bensameadd
          ? data.benpresprov
          : type === "provincial" && data.ofwProvSameAdd
          ? data.ofwPresProv
          : type === "provincial" && data.ofwProvSameAdd
          ? data.ofwprovProv
          : type === "coborrow" && data.ofwSameAdd
          ? data.ofwPresProv
          : type === "coborrow" && !data.ofwSameAdd
          ? data.coborrowProv
          : null;

      if (!provCode) return [];
      const result = await axios.get(`/getMuniArea/${provCode}`);
      return result.data.list;
    },
    refetchInterval: 15 * 1000,
    retryDelay: 1000,
  });

  const getBarangayFromProvCode = useQuery({
    queryKey: [
      "getBarangayFromMunCode",
      type === "present"
        ? data.ofwPresMunicipality
        : type === "permanent"
        ? data.ofwPermMunicipality
        : type === "beneficiary"
        ? data.benpresmunicipality
        : type === "provincial"
        ? data.ofwprovMunicipality
        : type === "coborrow"
        ? data.coborrowMunicipality
        : null,
    ],
    queryFn: async () => {
      const munCode =
        type === "present"
          ? data.ofwPresMunicipality
          : type === "permanent" && data.ofwSameAdd
          ? data.ofwPresMunicipality
          : type === "permanent" && !data.ofwSameAdd
          ? data.ofwPermMunicipality
          : type === "beneficiary" && data.bensameadd
          ? data.ofwPresMunicipality
          : type === "beneficiary" && !data.bensameadd
          ? data.benpresmunicipality
          : type === "provincial" && data.ofwProvSameAdd
          ? data.ofwPresMunicipality
          : type === "provincial" && data.ofwProvSameAdd
          ? data.ofwprovMunicipality
          : type === "coborrow" && data.ofwProvSameAdd
          ? data.ofwPresMunicipality
          : type === "coborrow" && !data.ofwProvSameAdd
          ? data.coborrowMunicipality
          : null;
      if (!munCode) return [];
      const result = await axios.get(`/getbarangaylist/${munCode}`);
      return result.data.list;
    },
    refetchInterval: 15 * 1000,
    retryDelay: 1000,
  });

  return (
    <>
      {type === "permanent" ? (
        <div className="mb-[1%] mt-[1%]">
          <Checkbox
            disabled={disabled ? true : disabled == undefined ? true : false}
            className="text-xs"
            checked={data.ofwSameAdd}
            onClick={() => {
              const newSameAddValue = !data.ofwSameAdd;
              if (
                newSameAddValue == 1 &&
                (!data.ofwPresBarangay || !data.ofwPresStreet)
              ) {
                // api["warning"]({
                //   message: "Incomplete Present Address",
                //   description: "Please Complete the Present Address!",
                // });
                api.warning({
                  message: "Incomplete Present Address",
                  description: "Please Complete the Present Address!",
                });
              } else {
                // receive({
                //   name: "ofwSameAdd",
                //   value: newSameAddValue,
                // }); 
                updateAppDetails({ name: "ofwSameAdd", value: newSameAddValue });
                handleAddressCases({
                  name: newSameAddValue ? "ofwPerm" : "ofwSameAdd",
                  value: null,
                }, type);
              }
            }}
          >
            <b>
              Please check if the Present Address is the same as the Permanent
              Address.
            </b>
          </Checkbox>
        </div>
      ) : type === "beneficiary" ? (
        <div className="mb-[1%] mt-[1%]">
          <Checkbox
            disabled={disabled ? true : disabled == undefined ? true : false}
            className="text-xs"
            checked={data.bensameadd}
            onClick={() => {
              const newBenSameAddValue = !data.bensameadd;

              // Update bensameadd using the receive function
              if (
                newBenSameAddValue == 1 &&
                (data.ofwPresStreet === "" || data.ofwPresBarangay === "")
              ) {
                // api["warning"]({
                //   message: "Incomplete Present Address",
                //   description: "Please Complete the Present Address of OFW!",
                // });
                api.warning({
                  message: "Incomplete Present Address",
                  description: "Please Complete the Present Address of OFW!",
                });
              } else {
                updateAppDetails({
                  name: "bensameadd",
                  value: newBenSameAddValue,
                });
                if (!newBenSameAddValue) {
                  handleAddressCases({
                    name: "bensameadd",
                    value: null,
                  }, type);
                } else {
                  handleAddressCases({
                    name: "benpres",
                    value: null,
                  }, type);
                }
              }
            }}
          >
            <b>
              Please check if the Present Address is the same as the Present
              Address of OFW.
            </b>
          </Checkbox>
        </div>
      ) : type === "provincial" ? (
        <div className="mb-[2%] mt-[5%]">
          <Checkbox
            disabled={disabled ? true : disabled == undefined ? true : false}
            className="text-xs"
            checked={data.ofwProvSameAdd}
            onClick={() => {
              const newProvSameAddValue = !data.ofwProvSameAdd;
              if (
                newProvSameAddValue == 1 &&
                (data.ofwPresStreet === "" || data.ofwPresBarangay === "")
              ) {
                api.warning({
                  message: "Incomplete Present Address",
                  description: "Please Complete the Present Address of OFW!",
                });
              } else {
                updateAppDetails({
                  name: "ofwProvSameAdd",
                  value: newProvSameAddValue,
                });
                if (!newProvSameAddValue) {
                  handleAddressCases({
                    name: "ofwProvSameAdd",
                    value: null,
                  }, type);
                } else {
                  handleAddressCases({
                    name: "provpres",
                    value: null,
                  }, type);
                }
              }
            }}
          >
            <b>
              Please check if the Provincial Address is the same as the Present
              Address of OFW.
            </b>
          </Checkbox>
        </div>
      ) : type === "coborrow" ? (
        <div className="mb-[2%] mt-[5%]">
          <Checkbox
            disabled={disabled ? true : disabled == undefined ? true : false}
            className="text-xs"
            checked={data.coborrowSameAdd}
            onClick={() => {
              const coborrowSameAdd = !data.coborrowSameAdd;
              if (
                coborrowSameAdd == 1 &&
                (data.ofwPresStreet === "" || data.ofwPresBarangay === "")
              ) {
                api.warning({
                  message: "Incomplete Present Address",
                  description: "Please Complete the Present Address of OFW!",
                });
              } else {
                updateAppDetails({
                  name: "coborrowSameAdd",
                  value: coborrowSameAdd,
                });
                if (!coborrowSameAdd) {
                  handleAddressCases({
                    name: "coborrowSameAdd",
                    value: null,
                  }, type);
                } else {
                  handleAddressCases({
                    name: "coborrowpres",
                    value: null,
                  }, type);
                }
              }
            }}
          >
            <b>
              Please check if the Provincial Address is the same as the Present
              Address of OFW.
            </b>
          </Checkbox>
        </div>
      ) : null}
      <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
        <LabeledSelect_Province
          className_dmain={className_dmain}
          className_label={className_label}
          className_dsub={className_dsub}
          label={"Area / Province"}
          placeHolder={"Select Area/Province"}
          receive={(e) => {
            // Existing logic to handle the change of province, municipality or barangay
            updateAppDetails({
              name:
                type === "present"
                  ? "ofwPresProv"
                  : type === "permanent"
                  ? "ofwPermProv"
                  : type === "beneficiary"
                  ? "benpresprov"
                  : type === "provincial"
                  ? "ofwprovProv"
                  : type === "coborrow"
                  ? "coborrowProv"
                  : null,
              value: e,
            });

            // Existing logic to handle the propagation of changes
            handleAddressCases({
              name:
                type === "present"
                  ? "ofwPresProv"
                  : type === "permanent"
                  ? "ofwPermProv"
                  : type === "beneficiary"
                  ? "benpresprov"
                  : type === "provincial"
                  ? "ofwprovProv"
                  : type === "coborrow"
                  ? "coborrowProv"
                  : null,
              value: e,
            }, type);
          }}
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
          options={provinceList.data?.map((x) => ({
            value: x.provinceCode,
            label: x.provinceDescription,
          }))}
          value={
            type === "present"
              ? data.ofwPresProv
              : type === "permanent"
              ? data.ofwPermProv
              : type === "beneficiary"
              ? data.benpresprov
              : type === "provincial"
              ? data.ofwprovProv
              : type === "coborrow"
              ? data.coborrowProv
              : null
          }
        />

        <LabeledSelect_Municipality
          className_dmain={className_dmain}
          className_label={className_label}
          className_dsub={className_dsub}
          label={"City / Municipality"}
          placeHolder={"Select City/Municipality"}
          receive={(e) => {
            if (type === "permanent" && data.ofwSameAdd) {
              handleAddressCases({
                name: "ofwSameAdd",
                value: false,
              }, type);
            }
            updateAppDetails({
              name:
                type === "present"
                  ? "ofwPresMunicipality"
                  : type === "permanent"
                  ? "ofwPermMunicipality"
                  : type === "beneficiary"
                  ? "benpresmunicipality"
                  : type === "provincial"
                  ? "ofwprovMunicipality"
                  : type === "coborrow"
                  ? "coborrowMunicipality"
                  : null,
              value: e,
            });
            handleAddressCases({
              name:
                type === "present"
                  ? "ofwPresMunicipality"
                  : type === "permanent"
                  ? "ofwPermMunicipality"
                  : type === "beneficiary"
                  ? "benpresmunicipality"
                  : type === "provincial"
                  ? "ofwprovMunicipality"
                  : type === "coborrow"
                  ? "coborrowMunicipality"
                  : null,
              value: e,
            }, type);
          }}
          options={getMunFromProvCode.data?.map((x) => ({
            value: x.munCode,
            label: x.munDesc,
          }))}
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
          value={
            type === "present"
              ? data.ofwPresMunicipality
              : type === "permanent"
              ? data.ofwPermMunicipality
              : type === "beneficiary"
              ? data.benpresmunicipality
              : type === "provincial"
              ? data.ofwprovMunicipality
              : type === "coborrow"
              ? data.coborrowMunicipality
              : null
          }
        />

        <LabeledSelect_Barangay
          className_dmain={className_dmain}
          className_label={className_label}
          className_dsub={className_dsub}
          label={"Barangay"}
          placeHolder={"Select Barangay"}
          receive={(e) => {
            if (type === "permanent" && data.ofwSameAdd) {
              handleAddressCases({
                name: "ofwSameAdd",
                value: false,
              }, type);
            }
            updateAppDetails({
              name:
                type === "present"
                  ? "ofwPresBarangay"
                  : type === "permanent"
                  ? "ofwPermBarangay"
                  : type === "beneficiary"
                  ? "benpresbarangay"
                  : type === "provincial"
                  ? "ofwprovBarangay"
                  : type === "coborrow"
                  ? "coborrowBarangay"
                  : null,
              value: e,
            });
            handleAddressCases({
              name:
                type === "present"
                  ? "ofwPresBarangay"
                  : type === "permanent"
                  ? "ofwPermBarangay"
                  : type === "beneficiary"
                  ? "benpresbarangay"
                  : type === "provincial"
                  ? "ofwprovBarangay"
                  : type === "coborrow"
                  ? "coborrowBarangay"
                  : null,
              value: e,
            }, type);
          }}
          options={getBarangayFromProvCode.data?.map((x) => ({
            value: x.code,
            label: x.description,
          }))}
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
          value={
            type === "present"
              ? data.ofwPresBarangay
              : type === "permanent"
              ? data.ofwPermBarangay
              : type === "beneficiary"
              ? data.benpresbarangay
              : type === "provincial"
              ? data.ofwprovBarangay
              : type === "coborrow"
              ? data.coborrowBarangay
              : null
          }
        />
        {category === "direct" ? (
          <div className={className_dmain}>
            <label className={className_label}>Block / Unit / Street</label>
            <div className={className_dsub}>
              <Input.TextArea
                showCount
                maxLength={250}
                style={{
                  height: 100,
                  resize: "none",
                }}
                onChange={(e) => {
                  updateAppDetails({
                    name:
                      type === "present"
                        ? "ofwPresStreet"
                        : type === "permanent"
                        ? "ofwPermStreet"
                        : type === "beneficiary"
                        ? "benpresstreet"
                        : type === "provincial"
                        ? "ofwprovStreet"
                        : type === "coborrow"
                        ? "coborrowStreet"
                        : "",
                    value: e.target.value.toUpperCase(),
                  });
                }}
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
                value={
                  type === "present"
                    ? ReturnText(data.ofwPresStreet)
                    : type === "permanent"
                    ? ReturnText(data.ofwPermStreet)
                    : type === "beneficiary"
                    ? ReturnText(data.benpresstreet)
                    : type === "provincial"
                    ? ReturnText(data.ofwprovStreet)
                    : type === "coborrow"
                    ? ReturnText(data.coborrowStreet)
                    : ""
                }
              />
            </div>
          </div>
        ) : category === "marketing" ? (
          <LabeledInput_AddressStreet
            label={"Street"}
            className={className_dmain}
            className_label={className_label}
            style={{
              height: 100,
              resize: "none",
            }}
            onChange={(e) => {
              updateAppDetails({
                name:
                  type === "present"
                    ? "ofwPresStreet"
                    : type === "permanent"
                    ? "ofwPermStreet"
                    : type === "beneficiary"
                    ? "benpresstreet"
                    : type === "provincial"
                    ? "ofwprovStreet"
                    : type === "coborrow"
                    ? "coborrowStreet"
                    : "",
                value: e.target.value.toUpperCase(),
              });
            }}
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
            value={
              type === "present"
                ? ReturnText(data.ofwPresStreet)
                : type === "permanent"
                ? ReturnText(data.ofwPermStreet)
                : type === "beneficiary"
                ? ReturnText(data.benpresstreet)
                : type === "provincial"
                ? ReturnText(data.ofwprovStreet)
                : type === "coborrow"
                ? ReturnText(data.coborrowStreet)
                : ""
            }
          />
        ) : null}
      </Flex>
    </>
  );
}

export default AddressContainer;
