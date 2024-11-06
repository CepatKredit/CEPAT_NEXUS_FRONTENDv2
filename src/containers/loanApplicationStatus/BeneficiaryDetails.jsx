import * as React from 'react';
import { Descriptions, Button, notification } from 'antd';
import { Suffix, Gender, MaritalStatus, Residences } from '@utils/FixedData';
import LabeledInput_UpperCase from '@components/trackApplication/LabeledInput_UpperCase';
import LabeledSelect from '@components/trackApplication/LabeledSelect';
import DatePicker_BDate from '@components/trackApplication/DatePicker_BDate';
import LabeledInput_Email from '@components/trackApplication/LabeledInput_Email';
import LabeledInput_Contact from '@components/trackApplication/LabeledInput_Contact';
import AddressGroup_Component from '@components/trackApplication/AddressGroup_Component';
import SectionHeader from '@components/validation/SectionHeader';
import LabeledSelect_Relationship from '@components/trackApplication/LabeledSelect_Relationship';
import LabeledSelect_Suffix from '@components/trackApplication/LabeledSelect_Suffix';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST, GetBranchCode, GetPurposeId } from '@api/base-api/BaseApi';
import axios from 'axios';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import LabeledInput_NotRequired from '@components/trackApplication/LabeledInput_NotRequired';

function BeneficiaryDetails({ data, receive, presaddress }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();

    const { data: suffixOption } = useQuery({
        queryKey: ['getSuffix'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/GetSuffix');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });
    const { data: relationshipOptions, isLoading } = useQuery({
        queryKey: ['getRelationship'],
        queryFn: async () => {
            const result = await GET_LIST('/getListRelationship');
            return result.list;
        },
        refetchInterval: 30 * 1000,
        retryDelay: 1000,
    });

    const items = [
        {
            key: '1',
            label: <span className="font-semibold text-black">First Name</span>,
            children: data.benfname || '',
        },
        {
            key: '2',
            label: <span className="font-semibold text-black">Middle Name</span>,
            children: data.benmname || '',
        },
        {
            key: '3',
            label: <span className="font-semibold text-black">Last Name</span>,
            children: data.benlname || '',
        },
        {
            key: '4',
            label: <span className="font-semibold text-black">Suffix</span>,
            children: suffixOption?.find(suffix => suffix.code === data.bensuffix)?.description || '',
        },
        {
            key: '5',
            label: <span className="font-semibold text-black">Birthdate</span>,
            children: data.benbdate || '',
        },
        {
            key: '6',
            label: <span className="font-semibold text-black">Gender</span>,
            children: Gender().find(gender => gender.value === data.bengender)?.label || '',
        },
        {
            key: '7',
            label: <span className="font-semibold text-black w-[5rem]">Relationship to the OFW</span>,
            children: relationshipOptions?.find(relationship => relationship.code === data.benrelationship)?.description || '',
        },
        {
            key: '8',
            label: <span className="font-semibold text-black">Mobile Number</span>,
            children: data.benmobile || '',
        },
        {
            key: '9',
            label: <span className="font-semibold text-black">Email Address</span>,
            children: data.benemail || '',
        },
        {
            key: '10',
            label: <span className="font-semibold text-black">Marital Status</span>,
            children: MaritalStatus().find(status => status.value === data.benmstatus)?.label || '',
        },
        {
            key: '11',
            label: <span className="font-semibold text-black">Present Area/Province</span>,
            children: data.benpresprovname || '',
        },
        {
            key: '12',
            label: <span className="font-semibold text-black">Present City/Municipality</span>,
            children: data.benpresmunicipalityname || '',
        },
        {
            key: '13',
            label: <span className="font-semibold text-black">Present Barangay</span>,
            children: data.benpresbarangayname || '',
        },
        {
            key: '14',
            label: <span className="font-semibold text-black">Present Street</span>,
            children: data.benpresstreet || '',
        },
    ];

    const queryClient = useQueryClient()
    async function updateData() {
        const value = {
            LoanAppId: data.loanIdCode,
            Tab: 3,
            BorrowersCode: data.borrowersCode,
            BenFirstName: data.benfname,
            BenMiddleName: data.benmname,
            BenLastName: data.benlname,
            BenSuffix: data.bensuffix,
            BenBirthday: data.benbdate,
            BenGender: data.bengender,
            BenCivilStatus: data.benmstatus,
            BenEmail: data.benemail,
            BenMobileNo: data.benmobile,
            BenRelationship: data.benrelationship,
            BenProvinceId: data.benpresprov,
            BenMunicipalityId: data.benpresmunicipality,
            BenBarangayId: data.benpresbarangay,
            BenAddress1: data.benpresstreet,
            ModUser: data.borrowersCode
        }

        console.log('testtset',value)
        let result = await UpdateLoanDetails(value);
        if(result.data.status==="success"){
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });
            queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true })
            setEdit(!isEdit);
        }else{
            api['warning']({
                message: 'Error: Failed to Update' ,
                description: "Fail Connection",
            });
        }
    }

    return (<>
        {contextHolder}
        {
            isEdit
                ?
                (<div className="h-full">
                    <div className="flex flex-col items-center justify-center h-full">
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
                            <LabeledInput_UpperCase
                                className_dmain="w-full h-[3rem] mt-3"
                                className_label="font-bold"
                                label="First Name"
                                value={data.benfname}
                                placeHolder="First Name"
                                receive={(e) => receive({ name: 'benfname', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_NotRequired
                                className_dmain="w-full h-[3rem] mt-3"
                                className_label="font-bold"
                                label="Middle Name"
                                value={data.benmname}
                                placeHolder="Middle Name"
                                receive={(e) => receive({ name: 'benmname', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_UpperCase
                                className_dmain="w-full h-[3rem] mt-3"
                                className_label="font-bold"
                                label="Last Name"
                                value={data.benlname}
                                placeHolder="Last Name"
                                receive={(e) => receive({ name: 'benlname', value: e })}
                                category="marketing"
                            />
                            <LabeledSelect_Suffix
                                className_dmain="w-full h-[3rem] mt-3"
                                className_label="font-bold"
                                label="Suffix"
                                placeHolder="Suffix"
                                value={data.bensuffix}
                                receive={(e) => receive({ name: 'bensuffix', value: e })}
                            />
                            <DatePicker_BDate
                                className_dmain="w-full h-[3rem] mt-8"
                                className_label="font-bold"
                                label="Birthdate"
                                placeHolder="Birthdate"
                                receive={(e) => receive({ name: 'benbdate', value: e })}
                                value={data.benbdate}
                                category="marketing"
                            />
                            <LabeledSelect
                                className_dmain="w-full h-[3rem] mt-8"
                                className_label="font-bold"
                                label="Gender"
                                placeHolder="Please Select"
                                value={data.bengender}
                                data={Gender()}
                                receive={(e) => receive({ name: 'bengender', value: e })}
                                category="marketing"
                            />
                            <LabeledSelect_Relationship
                                className_dmain="w-full h-[3rem] mt-8"
                                className_label={'font-bold'}
                                label={'Relationship to the OFW'}
                                placeHolder='Relationship to the OFW'
                                value={data.benrelationship}
                                receive={(e) => receive({ name: 'benrelationship', value: e })}
                                category={'marketing'}
                            />
                            <LabeledInput_Email
                                className_dmain="w-full h-[3rem] mt-8"
                                className_label="font-bold"
                                label="Email Address"
                                placeHolder="Email Address"
                                value={data.benemail}
                                receive={(e) => receive({ name: 'benemail', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_Contact
                                label="Mobile Number"
                                placeHolder="Mobile Number"
                                value={data.benmobile}
                                receive={(e) => receive({ name: 'benmobile', value: e })}
                                category="marketing"
                                className_dmain="w-full h-[3rem] mt-8"
                                className_label="font-bold"
                            />
                            <LabeledSelect
                                className_dmain="w-full h-[3rem] mt-8"
                                className_label="font-bold"
                                label="Marital Status"
                                placeHolder="Marital Status"
                                value={data.benmstatus}
                                data={MaritalStatus()}
                                receive={(e) => receive({ name: 'benmstatus', value: e })}
                                category="marketing"
                            />
                        </div>
                        <SectionHeader title="Present Address" />
                        <AddressGroup_Component
                            data={data}
                            receive={(e) => receive(e)}
                            presaddress={(e) => presaddress(e)}
                            type="beneficiary"
                            disabled={!isEdit}
                            className_dsub="w-full h-[3.5rem]"
                            category="marketing"
                            className_dmain="mt-[1.25rem] w-full h-[3.875rem] sm:w-[12rem] md:w-[14rem] lg:w-[15rem] xl:w-[16rem]"
                            className_label="font-bold"
                            vertical_algin={true}
                        />
                    </div>
                </div>)
                : (<>
                    <Descriptions className="mt-6" column={{ md: 2, lg: 3, xl: 4 }} items={items} />
                    </>)
        }
        <div className="flex justify-center space-x-4 mb-2 mt-6">
            {isEdit ? (
                <>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => { updateData() }}
                    >
                        Save
                    </Button>
                    <Button
                        type="default"
                        onClick={() => { setEdit(!isEdit) }}
                    >
                        Cancel
                    </Button>
                </>
            ) : (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => { setEdit(!isEdit) }}
                    disabled={data.loanStatus !== 'RECEIVED'}
                >
                    Edit
                </Button>
            )}
        </div>
    </>
    );
}

export default BeneficiaryDetails;