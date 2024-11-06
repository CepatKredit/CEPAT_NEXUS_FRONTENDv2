import { Input, Checkbox, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import LabeledSelect_AddressFields from '@components/marketing/LabeledSelect_AddressFields';
import LabeledInput_AddressStreet from '@components/marketing/LabeledInput_AddressStreet';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { warning } from 'framer-motion';
import LabeledTextArea_Street from './LabeledTextArea_Street';
function AddressContainer({rendered, api, data, receive, type, category, triggerValidation, disabled, presaddress, className_dmain, className_label, className_dsub, vertical_algin: vertical_align }) {
    let getStreet = type === 'present'
        ? data.ofwPresStreet
        : type === 'permanent'
            ? data.ofwPermStreet
            : type === 'beneficiary'
                ? data.benpresstreet
                : type === "provincial"
                    ? data.ofwprovStreet
                    : type === "coborrow"
                        ? data.coborrowStreet
                        : '';
    // Province List Query
const provinceList = useQuery({
    queryKey: ['ProvinceListQuery'],
    queryFn: async () => {
      const result = await axios.get('/getProvinceList');
      return result.data.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    enabled: true,
    retryDelay: 1000,
  });
  
  // Helper function to determine provCode
  const getProvCode = (type, data) => {
    if (type === "present") return data.ofwPresProv;
    if (type === "permanent") return data.ofwSameAdd ? data.ofwPresProv : data.ofwPermProv;
    if (type === "beneficiary") return data.bensameadd ? data.ofwPresProv : data.benpresprov;
    if (type === "provincial") return data.ofwProvSameAdd ? data.ofwPermProv : data.ofwprovProv;
    if (type === "coborrow") return data.coborrowSameAdd ? data.ofwPresProv : data.coborrowProv;
    return null;
  };
  
  // Municipalities from Province Code Query
  const getMunFromProvCode = useQuery({
    queryKey: ['getMunFromProvCode', getProvCode(type, data)],
    queryFn: async () => {
      const provCode = getProvCode(type, data);
      if (!provCode) return [];
      const result = await axios.get(`/getMuniArea/${provCode}`);
      return result.data.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    enabled:true, // Enable only when provCode is available
    retryDelay: 1000,
  });
  
  // Helper function to determine municipality code
  const getMunicipalityCode = (type, data) => {
    if (type === "present") return data.ofwPresMunicipality;
    if (type === "permanent") return data.ofwSameAdd ? data.ofwPresMunicipality : data.ofwPermMunicipality;
    if (type === "beneficiary") return data.bensameadd ? data.ofwPresMunicipality : data.benpresmunicipality;
    if (type === "provincial") return data.ofwProvSameAdd ? data.ofwPermMunicipality : data.ofwprovMunicipality;
    if (type === "coborrow") return data.coborrowSameAdd ? data.ofwPresMunicipality : data.coborrowMunicipality;
    return null;
  };
  
  // Barangay from Municipality Code Query
  const getBarangayFromMunCode = useQuery({
    queryKey: ['getBarangayFromMunCode', getMunicipalityCode(type, data)],
    queryFn: async () => {
      const munCode = getMunicipalityCode(type, data);
      if (!munCode) return [];
      const result = await axios.get(`/getbarangaylist/${munCode}`);
      return result.data.list;
    },
    refetchInterval: (data) => (data?.length === 0 ? 500 : false),
    enabled: true, // Enable only when municipality code is available
    retryDelay: 1000,
  });


    return (
        <>
       
            {type === 'permanent' ? (
                <div className='mb-[2%] mt-[2%]'>
                    <Checkbox
                        disabled={disabled ? true
                            : disabled == undefined ? true : false}
                        className='text-xs'
                        checked={data.ofwSameAdd}
                        onClick={() => {
                            const newSameAddValue = !data.ofwSameAdd;
                            if (newSameAddValue == 1 && (!data.ofwPresBarangay || !data.ofwPresStreet)) {
                                api['warning']({
                                    message: "Incomplete Present Address",
                                    description: "Please Complete the Present Address!",
                                });
                            } else {
                                receive({
                                    name: 'ofwSameAdd',
                                    value: newSameAddValue
                                });
                                presaddress({
                                    name: newSameAddValue ? 'ofwPerm' : 'ofwSameAdd',
                                    value: null
                                });
                            }
                        }}
                    >
                        <b>Please check if the Present Address is the same as the Permanent Address.</b>
                    </Checkbox>
                </div>)
                : type === 'beneficiary' ? (<div className='mb-[2%] mt-[2%]'>
                    <Checkbox
                        disabled={disabled ? true
                            : disabled == undefined ? true : false}
                        className='text-xs'
                        checked={data.bensameadd}
                        onClick={() => {
                            const newBenSameAddValue = !data.bensameadd;
 
                            // Update bensameadd using the receive function
                            if (newBenSameAddValue == 1 && (data.ofwPresStreet === '' || data.ofwPresBarangay === '')) {
                                api['warning']({
                                    message: "Incomplete Present Address",
                                    description: "Please Complete the Present Address of OFW!",
                                });
                            } else {
                                receive({
                                    name: 'bensameadd',
                                    value: newBenSameAddValue
                                });
                                if (!newBenSameAddValue) {
                                    presaddress({
                                        name: 'bensameadd',
                                        value: null
                                    });
                                } else {
                                    presaddress({
                                        name: 'benpres',
                                        value: null
                                    });
                                }
                            }
                        }}
                    >
                        <b>Please check if the Present Address is the same as the Present Address of OFW.</b>
                    </Checkbox>
                </div>)
                    : type === "provincial" ?
                        (<div className='mb-[2%] mt-[2%]'>
                            <Checkbox
                                disabled={disabled ? true
                                    : disabled == undefined ? true : false}
                                className='text-xs'
                                checked={data.ofwProvSameAdd}
                                onClick={() => {
                                    const newProvSameAddValue = !data.ofwProvSameAdd;
                                    if (newProvSameAddValue == 1 && (data.ofwPermStreet === '' || data.ofwPermBarangay === '')) {
                                        api['warning']({
                                            message: "Incomplete Permanent Address",
                                            description: "Please Complete the Permanent Address of OFW!",
                                        });
                                    } else {
                                        receive({
                                            name: 'ofwProvSameAdd',
                                            value: newProvSameAddValue
                                        });
                                        if (!newProvSameAddValue) {
                                            presaddress({
                                                name: 'ofwProvSameAdd',
                                                value: null
                                            });
                                        } else {
                                            presaddress({
                                                name: 'provpres',
                                                value: null
                                            });
                                        }
                                    }
                                }}
                            >
                                <b>Please check if the Provincial Address is the same as the Permanent Address of OFW.</b>
                            </Checkbox>
                        </div>)
                        : type === "coborrow"
                            ? (<div className='mb-[2%] mt-[2%]'>
                                <Checkbox
                                    disabled={disabled ? true
                                        : disabled == undefined ? true : false}
                                    className='text-xs'
                                    checked={data.coborrowSameAdd}
                                    onClick={() => {
                                        const coborrowSameAdd = !data.coborrowSameAdd;
                                        if (coborrowSameAdd == 1 && (data.ofwPresStreet === '' || data.ofwPresBarangay === '')) {
                                            api['warning']({
                                                message: "Incomplete Present Address",
                                                description: "Please Complete the Present Address of OFW!",
                                            });
                                        } else {
                                            receive({
                                                name: 'coborrowSameAdd',
                                                value: coborrowSameAdd
                                            });
                                            if (!coborrowSameAdd) {
                                                presaddress({
                                                    name: 'coborrowSameAdd',
                                                    value: null
                                                });
                                            } else {
                                                presaddress({
                                                    name: 'coborrowpres',
                                                    value: null
                                                });
                                            }
                                        }
                                    }}
                                >
                                    <b>Please check if the Co-Borrower Address is the same as the Present Address of OFW.</b>
                                </Checkbox>
                            </div>)
                            : null}
            <Space
                direction={!vertical_align ? 'vertical' : 'horizontal'}
                className={!vertical_align ? 'vertical-classname' : 'horizontal-classname'}
            >
                <LabeledSelect_AddressFields
                    className_dmain={className_dmain}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label={'Area / Province'}
                    placeHolder={'Select Area/Province'}
                    rendered = {rendered}
                    data={data}
                    type={type}
                    receive={(e) => {
                        // Existing logic to handle the change of province, municipality or barangay
                        receive({
                            name: type === "present" ? 'ofwPresProv'
                                : type === "permanent" ? 'ofwPermProv'
                                    : type === "beneficiary" ? 'benpresprov'
                                        : type === "provincial" ? 'ofwprovProv'
                                            : type === "coborrow" ? 'coborrowProv'
                                                : null,
                            value: e,
                        });
 
                        // Existing logic to handle the propagation of changes
                        presaddress({
                            name: type === "present" ? 'ofwPresProv'
                                : type === "permanent" ? 'ofwPermProv'
                                    : type === "beneficiary" ? 'benpresprov'
                                        : type === "provincial" ? 'ofwprovProv'
                                            : type === "coborrow" ? 'coborrowProv'
                                                : null,
                            value: e
                        });
                    }}
 
                    disabled={(type === 'permanent' ? (data.ofwSameAdd)
                        : type === 'beneficiary' ? (data.bensameadd)
                            : type === 'provincial' ? (data.ofwProvSameAdd)
                                : type === 'coborrow' ? (data.coborrowSameAdd)
                                    : null) ||
                        (disabled ? true
                            : disabled == undefined ? true : false)}
 
                    options={provinceList.data?.map(x => ({
                        value: x.provinceCode,
                        label: x.provinceDescription.toUpperCase(),
                    }))}
                    value={type === 'present' ? data.ofwPresProv
                        : type === 'permanent' ? (data.ofwPermProv)
                            : type === 'beneficiary' ? (data.benpresprov)
                                : type === 'provincial' ? (data.ofwprovProv)
                                    : type === 'coborrow' ? (data.coborrowProv)
                                        : null}
                />
                <LabeledSelect_AddressFields
                    className_dmain={className_dmain}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label={'City / Municipality'}
                    placeHolder={'Select City/Municipality'}
                    rendered={rendered}
                    data={data}
                    type={type}
                    receive={(e) => {
                        if (type === 'permanent' && data.ofwSameAdd) {
                            presaddress({
                                name: 'ofwSameAdd',
                                value: false
                            });
                        }
                        receive({
                            name: type === "present" ? 'ofwPresMunicipality'
                                : type === "permanent" ? 'ofwPermMunicipality'
                                    : type === "beneficiary" ? 'benpresmunicipality'
                                        : type === "provincial" ? 'ofwprovMunicipality'
                                            : type === "coborrow" ? 'coborrowMunicipality'
                                                : null,
                            value: e,
                        });
                        presaddress({
                            name: type === "present" ? 'ofwPresMunicipality'
                                : type === "permanent" ? 'ofwPermMunicipality'
                                    : type === "beneficiary" ? 'benpresmunicipality'
                                        : type === "provincial" ? 'ofwprovMunicipality'
                                            : type === "coborrow" ? 'coborrowMunicipality'
                                                : null,
                            value: e
                        })
 
                    }}
                    options={getMunFromProvCode.data?.map(x => ({
                        value: x.munCode,
                        label: x.munDesc.toUpperCase(),
                    }))}
                    disabled={(type === 'permanent' ? (data.ofwSameAdd)
                        : type === 'beneficiary' ? (data.bensameadd)
                            : type === 'provincial' ? (data.ofwProvSameAdd)
                                : type === 'coborrow' ? (data.coborrowSameAdd)
                                    : null) ||
                        (disabled ? true
                            : disabled == undefined ? true : false)}
 
                    value={type === 'present' ? data.ofwPresMunicipality
                        : type === 'permanent' ? (data.ofwPermMunicipality)
                            : type === 'beneficiary' ? (data.benpresmunicipality)
                                : type === 'provincial' ? (data.ofwprovMunicipality)
                                    : type === 'coborrow' ? (data.coborrowMunicipality)
 
                                        : null}
                />
                <LabeledSelect_AddressFields
                    className_dmain={className_dmain}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label={'Barangay'}
                    placeHolder={'Select Barangay'}
                    rendered = {rendered}
                    data={data}
                    type={type}
                    receive={(e) => {
                        if (type === 'permanent' && data.ofwSameAdd) {
                            presaddress({
                                name: 'ofwSameAdd',
                                value: false
                            });
                        }
                        receive({
                            name: type === "present" ? 'ofwPresBarangay'
                                : type === "permanent" ? 'ofwPermBarangay'
                                    : type === "beneficiary" ? 'benpresbarangay'
                                        : type === "provincial" ? 'ofwprovBarangay'
                                            : type === "coborrow" ? 'coborrowBarangay'
 
                                                : null,
                            value: e,
                        });
                        presaddress({
                            name: type === "present" ? 'ofwPresBarangay'
                                : type === "permanent" ? 'ofwPermBarangay'
                                    : type === "beneficiary" ? 'benpresbarangay'
                                        : type === "provincial" ? 'ofwprovBarangay'
                                            : type === "coborrow" ? 'coborrowBarangay'
 
                                                : null,
                            value: e
                        })
 
                    }}
                    options={getBarangayFromMunCode.data?.map(x => ({
                        value: x.code,
                        label: x.description.toUpperCase(),
                    }))}
                    disabled={(type === 'permanent' ? (data.ofwSameAdd)
                        : type === 'beneficiary' ? (data.bensameadd)
                            : type === 'provincial' ? (data.ofwProvSameAdd)
                                : type === 'coborrow' ? (data.coborrowSameAdd)
 
                                    : null) ||
                        (disabled ? true
                            : disabled == undefined ? true : false)}
 
                    value={type === 'present' ? data.ofwPresBarangay
                        : type === 'permanent' ? (data.ofwPermBarangay)
                            : type === 'beneficiary' ? (data.benpresbarangay)
                                : type === 'provincial' ? (data.ofwprovBarangay)
                                    : type === 'coborrow' ? (data.coborrowBarangay)
                                        : null} />
                {category === 'direct'
                    ? <LabeledTextArea_Street
                            type={type}
                            data={data}
                            rendered={rendered}
                            value={type === "present"
                                ? data.ofwPresStreet
                                : type === "permanent"
                                    ? data.ofwPermStreet
                                    : type === "beneficiary"
                                        ? data.benpresstreet
                                        : type === "provincial"
                                            ? data.ofwprovStreet
                                            : type === "coborrow"
                                                ? data.coborrowStreet
                                                : ''}
                            receive={(e)=>{
                                receive({
                                    name: type === "present"
                                        ? 'ofwPresStreet'
                                        : type === "permanent"
                                            ? 'ofwPermStreet'
                                            : type === "beneficiary"
                                                ? 'benpresstreet'
                                                : type === "provincial"
                                                    ? 'ofwprovStreet'
                                                    : type === "coborrow"
                                                        ? 'coborrowStreet'
                                                        : '',
                                    value: e,
                                });
                            }}
                            placeHolder={'Block / Unit / Street'}
                            label={'Block / Unit / Street'}
                            disabled={disabled}
                            className_dmain={className_dmain}
                            className_label={className_label}
                            className_dsub={className_dsub}
 
                        />
                    : category === 'marketing'
                        ? <LabeledInput_AddressStreet
                            label={'Street'}
                            data={data}
                            type={type}
                            className={className_dmain}
                            className_label={className_label}
                            rendered = {rendered}
                            placeHolder={'Input Street'}
                            receive={(e)=>{
                                receive({
                                    name: type === "present"
                                            ? 'ofwPresStreet'
                                            : type === "permanent"
                                                ? 'ofwPermStreet'
                                                : type === "beneficiary"
                                                    ? 'benpresstreet'
                                                    : type === "provincial"
                                                        ? 'ofwprovStreet'
                                                        : type === "coborrow"
                                                            ? 'coborrowStreet'
                                                            : '',
                                        value: e,
                                })
                            }}
                            
                            disabled={(type === 'permanent' ? (data.ofwSameAdd)
                                : type === 'beneficiary' ? (data.bensameadd)
                                    : type === 'provincial' ? (data.ofwProvSameAdd)
                                        : type === 'coborrow' ? (data.coborrowSameAdd)
 
                                            : null) ||
                                (disabled ? true
                                    : disabled == undefined ? true : false)}
                            
                            value={getStreet}
                            triggerValidation={triggerValidation}
 
                        />
                        : null}
 
            </Space>
 
 
        </>
    );
}
 
export default AddressContainer;