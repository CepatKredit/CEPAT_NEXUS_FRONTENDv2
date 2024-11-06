import { Input, Checkbox, Flex } from 'antd';
import React, { useState, useEffect } from 'react';

import LabeledSelect_Province from '@components/trackApplication/LabeledSelect_Province';
import LabeledSelect_Municipality from '@components/trackApplication/LabeledSelect_Municipality';
import LabeledSelect_Barangay from '@components/trackApplication/LabeledSelect_Barangay';
import LabeledInput_AddressStreet from '@components/trackApplication/LabeledInput_AddressStreet';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ReturnText } from '@utils/Converter';

function AddressContainer({ data, receive, type, category, disabled, presaddress, className_dmain, className_label, className_dsub, vertical_algin: vertical_align }) {

    const provinceList = useQuery({
        queryKey: ['ProvinceListQuery'],
        queryFn: async () => {
            const result = await axios.get('/getProvinceList');
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    const getMunFromProvCode = useQuery({
        queryKey: ['getMunFromProvCode', type === "present" ? (data.ofwPresProv)
            : type === "permanent" ? (data.ofwPermProv)
                : type === "beneficiary" ? (data.benpresprov)
                    : type === "provincial" ? (data.ofwprovProv)
                        : type === "coborrow" ? (data.coborrowProv)
                            : null],
        queryFn: async () => {
            const provCode = type === "present" ? data.ofwPresProv
                : type === "permanent" && data.ofwSameAdd ? data.ofwPresProv
                    : type === "permanent" && !data.ofwSameAdd ? data.ofwPermProv
                        : type === "beneficiary" && data.bensameadd ? data.ofwPresProv
                            : type === "beneficiary" && !data.bensameadd ? data.benpresprov
                                : type === "provincial" && data.ofwProvSameAdd ? data.ofwPresProv
                                    : type === "provincial" && data.ofwProvSameAdd ? data.ofwprovProv
                                        : type === "coborrow" && data.ofwSameAdd ? data.ofwPresProv
                                            : type === "coborrow" && !data.ofwSameAdd ? data.coborrowProv
                                                : null;

            if (!provCode) return [];
            const result = await axios.get(`/getMuniArea/${provCode}`);
            return result.data.list;
        },
        refetchInterval: 15 * 1000,
        retryDelay: 1000,
    });

    const getBarangayFromProvCode = useQuery({
        queryKey: ['getBarangayFromMunCode', type === "present" ? (data.ofwPresMunicipality)
            : type === "permanent" ? (data.ofwPermMunicipality)
                : type === "beneficiary" ? (data.benpresmunicipality)
                    : type === "provincial" ? data.ofwprovMunicipality
                        : type === "coborrow" ? data.coborrowMunicipality

                            : null],
        queryFn: async () => {
            const munCode = type === "present" ? data.ofwPresMunicipality
                : type === "permanent" && data.ofwSameAdd ? data.ofwPresMunicipality
                    : type === "permanent" && !data.ofwSameAdd ? data.ofwPermMunicipality
                        : type === "beneficiary" && data.bensameadd ? data.ofwPresMunicipality
                            : type === "beneficiary" && !data.bensameadd ? data.benpresmunicipality
                                : type === "provincial" && data.ofwProvSameAdd ? data.ofwPresMunicipality
                                    : type === "provincial" && data.ofwProvSameAdd ? data.ofwprovMunicipality
                                        : type === "coborrow" && data.ofwProvSameAdd ? data.ofwPresMunicipality
                                            : type === "coborrow" && !data.ofwProvSameAdd ? data.coborrowMunicipality
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

            {type === 'permanent' ? (
                <div className='mb-[1%] mt-[1%]'>
                    <Checkbox
                        disabled={disabled ? true
                            : disabled == undefined ? true : false}
                        className='text-xs'
                        checked={data.ofwSameAdd}
                        onClick={() => {
                            const newSameAddValue = !data.ofwSameAdd;
                            receive({
                                name: 'ofwSameAdd',
                                value: newSameAddValue
                            });
                            if (!newSameAddValue) {
                                presaddress({
                                    name: 'ofwSameAdd',
                                    value: null
                                });
                            } else {
                                presaddress({
                                    name: 'ofwPerm',
                                    value: null
                                });
                            }
                        }}
                    >
                        <b>Please check if the Present Address is the same as the Permanent Address.</b>
                    </Checkbox>
                </div>)
                : type === 'beneficiary' ? (<div className='mb-[1%] mt-[1%]'>
                    <Checkbox
                        disabled={disabled ? true
                            : disabled == undefined ? true : false}
                        className='text-xs'
                        checked={data.bensameadd}
                        onClick={() => {
                            const newBenSameAddValue = !data.bensameadd;

                            // Update bensameadd using the receive function
                            receive({
                                name: 'bensameadd',
                                value: newBenSameAddValue
                            });

                            // Call presaddress based on the new value of bensameadd
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
                        }}
                    >
                        <b>Please check if the Present Address is the same as the Present Address of OFW.</b>
                    </Checkbox>
                </div>)
                    : type === "provincial" ?
                        (<div className='mb-[2%] mt-[5%]'>
                            <Checkbox
                                disabled={disabled ? true
                                    : disabled == undefined ? true : false}
                                className='text-xs'
                                checked={data.ofwProvSameAdd}
                                onClick={() => {
                                    const newProvSameAddValue = !data.ofwProvSameAdd;

                                    // Update bensameadd using the receive function
                                    receive({
                                        name: 'ofwProvSameAdd',
                                        value: newProvSameAddValue
                                    });

                                    // Call presaddress based on the new value of bensameadd
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
                                }}
                            >
                                <b>Please check if the Provincial Address is the same as the Present Address of OFW.</b>
                            </Checkbox>
                        </div>)
                        : type === "coborrow"
                            ? (<div className='mb-[2%] mt-[5%]'>
                                <Checkbox
                                    disabled={disabled ? true
                                        : disabled == undefined ? true : false}
                                    className='text-xs'
                                    checked={data.coborrowSameAdd}
                                    onClick={() => {
                                        const coborrowSameAdd = !data.coborrowSameAdd;
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
                                    }}
                                >
                                    <b>Please check if the Provincial Address is the same as the Present Address of OFW.</b>
                                </Checkbox>
                            </div>)
                            : null}
            <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
                <LabeledSelect_Province
                    className_dmain={className_dmain}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label={'Area / Province'}
                    placeHolder={'Select Area/Province'}
                    receive={(e) => {
                        receive({
                            name: type === "present" ? 'ofwPresProv'
                                : type === "permanent" ? 'ofwPermProv'
                                    : type === "beneficiary" ? 'benpresprov'
                                        : type === "provincial" ? 'ofwprovProv'
                                            : type === "coborrow" ? 'coborrowProv'
                                                : null,
                            value: e,
                        });
                        presaddress({
                            name: type === "present" ? 'ofwPresProv'
                                : type === "permanent" ? 'ofwPermProv'
                                    : type === "beneficiary" ? 'benpresprov'
                                        : type === "provincial" ? 'ofwprovProv'
                                            : type === "coborrow" ? 'coborrowProv'
                                                : null,
                            value: e
                        })
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
                        label: x.provinceDescription,
                    }))}
                    value={type === 'present' ? data.ofwPresProv
                        : type === 'permanent' ? (data.ofwPermProv)
                            : type === 'beneficiary' ? (data.benpresprov)
                                : type === 'provincial' ? (data.ofwprovProv)
                                    : type === 'coborrow' ? (data.coborrowProv)
                                        : null}
                />

                <LabeledSelect_Municipality
                    className_dmain={className_dmain}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label={'City / Municipality'}
                    placeHolder={'Select City/Municipality'}
                    receive={(e) => {
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
                        label: x.munDesc,
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

                <LabeledSelect_Barangay
                    className_dmain={className_dmain}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label={'Barangay'}
                    placeHolder={'Select Barangay'}
                    receive={(e) => {
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
                    options={getBarangayFromProvCode.data?.map(x => ({
                        value: x.code,
                        label: x.description,
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
                    ? <div className={className_dmain}>
                        <label className={className_label}>Block / Unit / Street</label>
                        <div className={className_dsub}>

                            <Input.TextArea
                                showCount
                                maxLength={250}
                                style={{
                                    height: 100,
                                    resize: 'none',
                                }}
                                onChange={(e) => {
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
                                        value: e.target.value.toUpperCase(),
                                    });
                                }}
                                disabled={(type === 'permanent' ? (data.ofwSameAdd)
                                    : type === 'beneficiary' ? (data.bensameadd)
                                        : type === 'provincial' ? (data.ofwProvSameAdd)
                                            : type === 'coborrow' ? (data.coborrowSameAdd)

                                                : null) ||
                                    (disabled ? true
                                        : disabled == undefined ? true : false)}

                                value={type === 'present'
                                    ? ReturnText(data.ofwPresStreet)
                                    : type === 'permanent'
                                        ? ReturnText(data.ofwPermStreet)
                                        : type === 'beneficiary'
                                            ? ReturnText(data.benpresstreet)
                                            : type === "provincial"
                                                ? ReturnText(data.ofwprovStreet)
                                                : type === "coborrow"
                                                    ? ReturnText(data.coborrowStreet)
                                                    : ''}
                            />
                        </div>
                    </div>
                    : category === 'marketing'
                        ? <LabeledInput_AddressStreet
                            label={'Street'}
                            className={className_dmain}
                            className_label={className_label}
                            style={{
                                height: 100,
                                resize: 'none',
                            }}
                            onChange={(e) => {
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
                                    value: e.target.value.toUpperCase(),
                                });
                            }}
                            disabled={(type === 'permanent' ? (data.ofwSameAdd)
                                : type === 'beneficiary' ? (data.bensameadd)
                                    : type === 'provincial' ? (data.ofwProvSameAdd)
                                        : type === 'coborrow' ? (data.coborrowSameAdd)

                                            : null) ||
                                (disabled ? true
                                    : disabled == undefined ? true : false)}

                            value={type === 'present'
                                ? ReturnText(data.ofwPresStreet)
                                : type === 'permanent'
                                    ? ReturnText(data.ofwPermStreet)
                                    : type === 'beneficiary'
                                        ? ReturnText(data.benpresstreet)
                                        : type === "provincial"
                                            ? ReturnText(data.ofwprovStreet)
                                            : type === "coborrow"
                                                ? ReturnText(data.coborrowStreet)
                                                : ''}

                        />
                        : null}

            </Flex>


        </>
    );
}

export default AddressContainer;
