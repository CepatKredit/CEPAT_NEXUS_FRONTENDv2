import { Input, Checkbox, Space } from 'antd';
import React, { useState, useEffect } from 'react';

import LabeledSelect_Province from '@components/loanApplication/LabeledSelect_Province';
import LabeledSelect_Municipality from '@components/loanApplication/LabeledSelect_Municipality';
import LabeledSelect_Barangay from '@components/loanApplication/LabeledSelect_Barangay';
import LabeledSelect_AddressFields from '@components/loanApplication/LabeledSelect_AddressFields';
import LabeledInput_AddressStreet from '@components/loanApplication/LabeledInput_AddressStreet';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

function AddressContainer({ data, receive, title, type, category, isEdit, presaddress, className_Fields, street_PlaceHolder, className_dmain, className_label, className_dsub, alignment }) {

    const provinceList = useQuery({
        queryKey: ['ProvinceListQuery'],
        queryFn: async () => {
            const result = await axios.get('/v1/GET/G23PL');
            return result.data.list;
        },
        refetchInterval: 15 * 1000,
        retryDelay: 1000,
    });

    const getMunFromProvCode = useQuery({
        queryKey: ['getMunFromProvCode', type === "present" ? (data.ofwPresProv)
            : type === "permanent" ? (data.ofwPermProv)
                : type === "beneficiary" ? (data.benpresprov)
                    : null],
        queryFn: async () => {
            const provCode = type === "present" ? data.ofwPresProv
                : type === "permanent" && data.ofwSameAdd ? data.ofwPresProv
                    : type === "permanent" && !data.ofwSameAdd ? data.ofwPermProv
                        : type === "beneficiary" && data.bensameadd ? data.ofwPresProv
                            : type === "beneficiary" && !data.bensameadd ? data.benpresprov
                                : null;

            if (!provCode) return [];
            const result = await axios.get(`/v1/GET/G6MA/${provCode}`);
            return result.data.list;
        },
        refetchInterval: 15 * 1000,
        retryDelay: 1000,
    });

    const getBarangayFromProvCode = useQuery({
        queryKey: ['getBarangayFromMunCode', type === "present" ? (data.ofwPresMunicipality)
            : type === "permanent" ? (data.ofwPermMunicipality)
                : type === "beneficiary" ? (data.benpresmunicipality)
                    : null],
        queryFn: async () => {
            const munCode = type === "present" ? data.ofwPresMunicipality
                : type === "permanent" && data.ofwSameAdd ? data.ofwPresMunicipality
                    : type === "permanent" && !data.ofwSameAdd ? data.ofwPermMunicipality
                        : type === "beneficiary" && data.bensameadd ? data.ofwPresMunicipality
                            : type === "beneficiary" && !data.bensameadd ? data.benpresmunicipality
                                : null;
            if (!munCode) return [];
            const result = await axios.get(`/v1/GET/G7BL/${munCode}`);
            return result.data.list;
        },
        refetchInterval: 15 * 1000,
        retryDelay: 1000,
    });

    return (
        <>
            <h2 className='mb-[2%] mt-[5%]'><b>{title}</b></h2>

            {type === 'permanent' ? (
                <div className='mb-[2%] mt-[5%]'>
                    <Checkbox
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
                : type === 'beneficiary' ? (<div className='mb-[2%] mt-[5%]'>
                    <Checkbox
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
                    : null}
            <Space
                direction={!alignment ? 'vertical' : 'horizontal'}
                className={!alignment ? 'vertical-classname' : 'horizontal-classname'}
            >
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
                                        : null,
                            value: e,
                        });
                        presaddress({
                            name: type === "present" ? 'ofwPresProv'
                                : type === "permanent" ? 'ofwPermProv'
                                    : type === "beneficiary" ? 'benpresprov'
                                        : null,
                            value: e
                        })
                    }}

                    disabled={type === 'permanent' ? (data.ofwSameAdd)
                        : type === 'beneficiary' ? (data.bensameadd)
                            : null}

                    options={provinceList.data?.map(x => ({
                        value: x.provinceCode,
                        label: x.provinceDescription,
                    }))}
                    value={type === 'present' ? data.ofwPresProv
                        : type === 'permanent' ? (data.ofwPermProv)
                            : type === 'beneficiary' ? (data.benpresprov)
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
                                        : null,
                            value: e,
                        });
                        presaddress({
                            name: type === "present" ? 'ofwPresMunicipality'
                                : type === "permanent" ? 'ofwPermMunicipality'
                                    : type === "beneficiary" ? 'benpresmunicipality'
                                        : null,
                            value: e
                        })

                    }}
                    options={getMunFromProvCode.data?.map(x => ({
                        value: x.munCode,
                        label: x.munDesc,
                    }))}
                    disabled={type === 'permanent' ? (data.ofwSameAdd)
                        : type === 'beneficiary' ? (data.bensameadd)
                            : null}
                    value={type === 'present' ? data.ofwPresMunicipality
                        : type === 'permanent' ? (data.ofwPermMunicipality)
                            : type === 'beneficiary' ? (data.benpresmunicipality)
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
                                        : null,
                            value: e,
                        });
                        presaddress({
                            name: type === "present" ? 'ofwPresBarangay'
                                : type === "permanent" ? 'ofwPermBarangay'
                                    : type === "beneficiary" ? 'benpresbarangay'
                                        : null,
                            value: e
                        })

                    }}
                    options={getBarangayFromProvCode.data?.map(x => ({
                        value: x.code,
                        label: x.description,
                    }))}
                    disabled={type === 'permanent' ? (data.ofwSameAdd)
                        : type === 'beneficiary' ? (data.bensameadd)
                            : null}
                    value={type === 'present' ? data.ofwPresBarangay
                        : type === 'permanent' ? (data.ofwPermBarangay)
                            : type === 'beneficiary' ? (data.benpresbarangay)
                                : null} />

                <div className='flex flex-rows mt-2 w-[600px]'>
                    <label className='mt-[7px] w-[200px]'>Block / Unit / Street</label>
                    <div className='mx-[2%] w-[400px]'>
                        <Input.TextArea
                            autoComplete='new-password'
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
                                                : '',
                                    value: e.target.value.toUpperCase(),
                                });
                            }}
                            disabled={type === 'permanent' ? (data.ofwSameAdd)
                                : type === 'beneficiary' ? (data.bensameadd)
                                    : null}
                            value={type === 'present'
                                ? data.ofwPresStreet
                                : type === 'permanent'
                                    ? data.ofwPermStreet
                                    : type === 'beneficiary'
                                        ? data.benpresstreet
                                        : ''}
                        />
                    </div>
                </div>
            </Space>
            {/*
                // For Horizontal Design/Style //
                : (<Space>
                    <LabeledSelect_AddressFields
                        className={className_Fields}
                        label={'Area'}
                        disabled={isEdit}
                        placeHolder={'Select Province'}
                        receive={(e) => {
                            receive({
                                name: type === "present" ? 'ofwPresProv'
                                    : type === "permanent" ? 'ofwPermProv'
                                        : type === "beneficiary" ? 'benpresprov'
                                            : null,
                                value: e,
                            });
                            presaddress({
                                name: type === "present" ? 'ofwPresProv'
                                    : type === "permanent" ? 'ofwPermProv'
                                        : type === "beneficiary" ? 'benpresprov'
                                            : null,
                                value: e
                            })
                        }}
                        
                        disabled={type === 'permanent' ? (data.ofwSameAdd)
                            : type === 'beneficiary' ? (data.bensameadd)
                                : null}
                        
                        options={provinceList.data?.map(x => ({
                            value: x.provinceCode,
                            label: x.provinceDescription,
                        }))}
                        value={type === 'present' ? data.ofwPresProv
                            : type === 'permanent' ? (data.ofwPermProv)
                                : type === 'beneficiary' ? (data.benpresprov)
                                    : null}
                    />

                    <LabeledSelect_AddressFields
                        className={className_Fields}
                        label={'City / Municipality'}
                        placeHolder={'Select City/Municipality'}
                        receive={(e) => {
                            receive({
                                name: type === "present" ? 'ofwPresMunicipality'
                                    : type === "permanent" ? 'ofwPermMunicipality'
                                        : type === "beneficiary" ? 'benpresmunicipality'
                                            : null,
                                value: e,
                            });
                            presaddress({
                                name: type === "present" ? 'ofwPresMunicipality'
                                    : type === "permanent" ? 'ofwPermMunicipality'
                                        : type === "beneficiary" ? 'benpresmunicipality'
                                            : null,
                                value: e
                            })

                        }}
                        options={getMunFromProvCode.data?.map(x => ({
                            value: x.munCode,
                            label: x.munDesc,
                        }))}
                        disabled={type === 'permanent' ? (data.ofwSameAdd)
                            : type === 'beneficiary' ? (data.bensameadd)
                                : null}
                        value={type === 'present' ? data.ofwPresMunicipality
                            : type === 'permanent' ? (data.ofwPermMunicipality)
                                : type === 'beneficiary' ? (data.benpresmunicipality)
                                    : null}
                    />

                    <LabeledSelect_AddressFields
                        className={className_Fields}
                        label={'Street'}
                        placeHolder={'Select Barangay'}
                        receive={(e) => {
                            receive({
                                name: type === "present" ? 'ofwPresBarangay'
                                    : type === "permanent" ? 'ofwPermBarangay'
                                        : type === "beneficiary" ? 'benpresbarangay'
                                            : null,
                                value: e,
                            });
                            presaddress({
                                name: type === "present" ? 'ofwPresBarangay'
                                    : type === "permanent" ? 'ofwPermBarangay'
                                        : type === "beneficiary" ? 'benpresbarangay'
                                            : null,
                                value: e
                            })

                        }}
                        options={getBarangayFromProvCode.data?.map(x => ({
                            value: x.code,
                            label: x.description,
                        }))}
                        disabled={type === 'permanent' ? (data.ofwSameAdd)
                            : type === 'beneficiary' ? (data.bensameadd)
                                : null}
                        value={type === 'present' ? data.ofwPresBarangay
                            : type === 'permanent' ? (data.ofwPermBarangay)
                                : type === 'beneficiary' ? (data.benpresbarangay)
                                    : null} />

                    <LabeledInput_AddressStreet
                        className={className_Fields}
                        label={'Street'}
                        placeHolder={ street_PlaceHolder}
                        onChange={(e) => {
                            receive({
                                name: type === "present"
                                    ? 'ofwPresStreet'
                                    : type === "permanent"
                                        ? 'ofwPermStreet'
                                        : type === "beneficiary"
                                            ? 'benpresstreet'
                                            : '',
                                value: e.target.value.toUpperCase(),
                            });
                        }}
                        disabled={type === 'permanent' ? (data.ofwSameAdd)
                            : type === 'beneficiary' ? (data.bensameadd)
                                : null}
                        value={type === 'present'
                            ? data.ofwPresStreet
                            : type === 'permanent'
                                ? data.ofwPermStreet
                                : type === 'beneficiary'
                                    ? data.benpresstreet
                                    : ''}
                    />
                        
                </Space>) */}

        </>
    );
}

export default AddressContainer;
