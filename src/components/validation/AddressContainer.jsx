import { Input, Checkbox, Space } from 'antd';

import LabeledSelect_Province from '@components/loanApplication/LabeledSelect_Province';
import LabeledSelect_Municipality from '@components/loanApplication/LabeledSelect_Municipality';
import LabeledSelect_Barangay from '@components/loanApplication/LabeledSelect_Barangay';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import LabeledSelect from '@components/global/LabeledSelect';

function AddressContainer({ data, receive, title,type }) {

    const provinceList = useQuery({
        queryKey: ['ProvinceListQuery'],
        queryFn: async () => {
            const result = await axios.get('/GET/G23PL');
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
                    :null],
        queryFn: async () => {
            const provCode = type === "present" ? data.ofwPresProv
                : type === "permanent" && data.ofwSameAdd ? data.ofwPresProv
                    : type === "permanent" && !data.ofwSameAdd ? data.ofwPermProv
                        : type === "beneficiary" && data.bensameadd ? data.ofwPresProv
                            : type === "beneficiary" && !data.bensameadd ? data.benpresprov
                                : null;

            if (!provCode) return [];
            const result = await axios.get(`/GET/G6MA/${provCode}`);
            return result.data.list;
        },
        refetchInterval: 15 * 1000,
        retryDelay: 1000,
    });

    const getBarangayFromProvCode = useQuery({
        queryKey: ['getBarangayFromMunCode', type === "present" ? (data.ofwPresMunicipality)
            : type === "permanent" ? (data.ofwPermMunicipality)
                : type === "beneficiary" ? (data.benpresmunicipality)
            :null],
        queryFn: async () => {
            const munCode = type === "present" ? data.ofwPresMunicipality
                : type === "permanent" && data.ofwSameAdd ? data.ofwPresMunicipality
                    : type === "permanent" && !data.ofwSameAdd ? data.ofwPermMunicipality
                        : type === "beneficiary" && data.bensameadd ? data.ofwPresMunicipality
                            : type === "beneficiary" && !data.bensameadd ? data.benpresmunicipality
                                : null;
            if (!munCode) return [];
            const result = await axios.get(`/GET/G7BL/${munCode}`);
            return result.data.list;
        },
        refetchInterval: 15 * 1000,
        retryDelay: 1000,
    });

    return (
        <>

            {type === 'permanent' ? (
                <div className='mb-[2%] mt-[5%]'>
                    <Checkbox
                        className='text-xs'
                        checked={data.ofwSameAdd}
                        onClick={() => {
                            receive({
                                name: 'ofwSameAdd',
                                value: !data.ofwSameAdd
                            });
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
                            alert(data.loanAmount)
                            receive({
                                name: 'bensameadd',
                                value: !data.bensameadd
                            });
                        }}
                    >
                        <b>Please check if the Present Address is the same as the Present Address of OFW.</b>
                    </Checkbox>
                </div>)
                    : null}

            <Space>
                <LabeledSelect

                    label={'Province'}
                    placeHolder={'Select Province'}
                    receive={(e) => {
                         receive({
                            name: type === "present" ? 'ofwPresProv'
                                : type === "permanent" ? 'ofwPermProv'
                                    : type === "beneficiary" ? 'benpresprov'
                                        : null,
                            value: e,
                        });
                    }}
                    options={provinceList.data?.map(x => ({
                        value: x.provinceCode,
                        label: x.provinceDescription,
                    }))}
                    value={type === 'present' ? data.ofwPresProv
                        : type === 'permanent' ? (data.ofwSameAdd ? data.ofwPresProv : data.ofwPermProv)
                            : type === 'beneficiary' ? (data.bensameadd ? data.ofwPresProv : data.benpresprov)
                                : null}
                />

                <LabeledSelect
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
                    }}
                    options={getMunFromProvCode.data?.map(x => ({
                        value: x.munCode,
                        label: x.munDesc,
                    }))}
                    value={type === 'present' ? data.ofwPresMunicipality
                        : type === 'permanent' ? (data.ofwSameAdd ? data.ofwPresMunicipality : data.ofwPermMunicipality)
                            : type === 'beneficiary' ? (data.bensameadd ? data.ofwPresMunicipality : data.benpresmunicipality)
                                : null}
                />

                <LabeledSelect
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
                    }}
                    options={getBarangayFromProvCode.data?.map(x => ({
                        value: x.code,
                        label: x.description,
                    }))}
                    value={type === 'present' ? data.ofwPresBarangay
                        : type === 'permanent' ? (data.ofwSameAdd ? data.ofwPresBarangay : data.ofwPermBarangay)
                            : type === 'beneficiary' ? (data.bensameadd ? data.ofwPresBarangay : data.benpresbarangay)
                                : null}                />

                <div className='flex flex-rows mt-2 w-[600px]'>
                    <label className='mt-[7px] w-[200px]'>Block / Unit / Street</label>
                    <div className='mx-[2%] w-[400px]'>
                        <Input
                            showCount
                            
                            receive={(e) => {
                                receive({
                                    name: type === "present" ? 'ofwPresStreet'
                                        : type === "permanent" ? 'ofwPermStreet'
                                            : type === "beneficiary" ? 'benpresstreet'
                                                : null,
                                    value: e,
                                });
                            }}
                            value={type === 'present' ? data.ofwPresStreet
                                : type === 'permanent' ? (data.ofwSameAdd ? data.ofwPresStreet : data.ofwPermStreet)
                                    : type === 'beneficiary' ? (data.bensameadd ? data.ofwPresStreet : data.benpresstreet)
                                        : null} 
                           
                        />
                    </div>
                </div>
            </Space>
        </>
    );
}

export default AddressContainer;
