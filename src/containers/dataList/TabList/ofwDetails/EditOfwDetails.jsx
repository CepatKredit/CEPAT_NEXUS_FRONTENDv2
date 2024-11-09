import React, { useEffect, useState } from 'react';
import { Flex, notification, Checkbox, Input, Form } from 'antd';
import LabeledInput from '@components/marketing/LabeledInput';
import LabeledInput_Fullname from '@components/marketing/LabeledInput_UpperCase';
import LabeledCurrencyInput from '@components/marketing/LabeledCurrencyInput';
import LabeledSelect_Suffix from '@components/marketing/LabeledSelect_Suffix';
import DatePicker_BDate from '@components/marketing/DatePicker_BDate';
import LabeledSelect from '@components/marketing/LabeledSelect';
import SelectDatePicker from '@components/marketing/SelectDatePicker';
import LabeledInput_OfwContact from '@components/marketing/LabeledInput_OfwContact';
import LabeledInput_Email from '@components/marketing/LabeledInput_Email';
import {
    MaritalStatus, Residences, Gender, EducationalAttainment, JobCategory, JobTitle,
    EmploymentStatus, SpouseSourceIncome, Overseas, Religion, AllotChannel
} from '@utils/FixedData';
import LabeledSelect_Relationship from '@components/marketing/LabeledSelect_Relationship';
import LabeledInput_Numeric from '@components/marketing/LabeledInput_Numeric'
import SectionHeader from '@components/validation/SectionHeader';
import AddressGroup_Component from '@components/marketing/AddressGroup_Component';
import LabeledInput_LengthStay from '@components/marketing/LabeledInput_LengthStay';
import LabeledInput_Salary from '@components/marketing/LabeledInput_Salary';
import LabeledSelect_ValidId from '@components/marketing/LabeledSelect_ValidId';
import LabeledSelect_Country from '@components/marketing/LabeledSelect_Country';
import LabeledSelectAgency from '@components/marketing/LabeledSelectAgency';
import dayjs from 'dayjs';
import LabeledInput_NotRequired from '@components/marketing/LabeledInput_NotRequired';
import LabeledSelect_CollectionArea from '@components/marketing/LabeledSelect_CollectionArea';
import DatePicker_Deployment from '@components/marketing/DatePicker_Deployment';
import LabeledInput_ForeignCurrency from '@components/marketing/LabeledInput_ForeignCurrency';
import RelativesTable from '@containers/dataList/TabList/RelativesTable';
import { GET_LIST } from '@api/base-api/BaseApi';
import { getDependentsCount } from '@hooks/DependentsController';
import { useStore } from 'zustand';


function EditOfwDetails({ data, receive, presaddress, User, RelativesCount, BorrowerId, addCoborrower }) {
    const { Count } = useStore(getDependentsCount);
    const [isEdit, setEdit] = React.useState(false);
    const { TextArea } = Input;
    const [api, contextHolder] = notification.useNotification();
    const [relativesCount, setRelativesCount] = useState(0);
    const disableDate_deployment = React.useCallback((current) => {
        return current && current < dayjs().startOf('day');
    }, []);

    useEffect(() => {

        receive({ name: 'ofwdependents', value: Count - 1 });

    }, [Count]);

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const rendered = true;
    function generateYearOptions(maxYears) {
        const options = [];
        for (let i = 1; i <= maxYears; i++) {
            options.push({ label: i.toString(), value: i });
        }
        return options;
    }

    return (
        <div>


            {contextHolder}
            <Flex className="w-full  mt-5" justify="center" gap="small" wrap>


                <LabeledInput_Fullname
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>First Name <span className="text-red-500">*</span></>}
                    value={data.ofwfname}
                    placeHolder='First Name'
                    receive={(e) => receive({ name: 'ofwfname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}

                />
                <LabeledInput_NotRequired
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={'Middle Name'}
                    value={data.ofwmname}
                    placeHolder='Middle Name'
                    receive={(e) => receive({ name: 'ofwmname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                />
                <LabeledInput_Fullname
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Last Name <span className="text-red-500">*</span></>}
                    value={data.ofwlname}
                    placeHolder='Last Name'
                    receive={(e) => receive({ name: 'ofwlname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                <LabeledSelect_Suffix
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Suffix <span className="text-red-500">*</span></>}
                    placeHolder='Suffix'
                    value={data.ofwsuffix}
                    receive={(e) => receive({ name: 'ofwsuffix', value: e })}
                    disabled={isEdit}
                    showSearch
                    isEdit={isEdit}
                    rendered={rendered}
                />
                <DatePicker_BDate
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Birthdate <span className="text-red-500">*</span></>}
                    placeHolder='Birthdate Date'
                    receive={(e) => {
                        receive({ name: 'ofwbdate', value: e });
                        const age = calculateAge(e);
                        receive({ name: 'age', value: age });
                    }}
                    value={data.ofwbdate}
                    classification={'Age Restriction'}
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                {User === 'Credit' && (
                    <LabeledInput
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Age'}
                        value={calculateAge(data.ofwbdate)}
                        readOnly={true}
                        placeHolder='Age'
                        rendered={rendered}
                    />)}
                <LabeledSelect
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Gender <span className="text-red-500">*</span></>}
                    placeHolder='Gender'
                    value={data.ofwgender}
                    data={Gender()}
                    receive={(e) => receive({ name: 'ofwgender', value: e })}
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                <LabeledInput_OfwContact
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Mobile Number <span className="text-red-500">*</span></>}
                    placeHolder='Mobile Number'
                    data={data}
                    value={data.ofwmobile}
                    receive={(e) => receive({ name: 'ofwmobile', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_OfwContact
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Other Mobile Number'}
                        placeHolder='Other Mobile Number'
                        data={data}
                        value={data.ofwothermobile}
                        receive={(e) => receive({ name: 'ofwothermobile', value: e })}
                        category={'marketing'}
                        type='contact'
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}
                    />)}
                <LabeledInput_Email
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Email Address <span className="text-red-500">*</span></>}
                    placeHolder='Email Address'
                    value={data.ofwemail}
                    receive={(e) => receive({ name: 'ofwemail', value: e })}
                    category={'marketing'}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                {User === 'Credit' ? (
                    <div className="mt-5 w-[18.75rem] h-[3.875rem">
                        <label className="font-bold">Facebook Name / Profile <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className={`w-full p-2 border rounded-lg border-gray-300 ${!isEdit && data.ofwfblink && data.ofwfblink.startsWith('https://')
                                ? 'text-blue-500 underline'
                                : 'text-black'
                                }`}
                            placeholder="Facebook Name / Profile"
                            value={data.ofwfblink || ''}
                            readOnly={isEdit}
                            onClick={(e) => {
                                if (!isEdit && data.ofwfblink && data.ofwfblink.startsWith('https://')) {
                                    e.preventDefault();
                                    window.open(
                                        data.ofwfblink,
                                        '_blank'
                                    );
                                }
                            }}
                            onChange={(e) => {
                                if (!isEdit) {
                                    const inputValue = e.target.value.trim();
                                    const formattedValue = inputValue.startsWith('https://')
                                        ? inputValue
                                        : `https://www.facebook.com/${inputValue}`;
                                    receive({ name: 'ofwfblink', value: formattedValue });
                                }
                            }}
                        />
                    </div>
                ) : (
                    <LabeledInput
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeHolder='Facebook Name / Profile'
                        readOnly={isEdit}
                        value={data.ofwfblink || ''}
                        receive={(e) => {
                            const formattedValue = e.includes('https://') ? e : `https://www.facebook.com/${e}`;
                            receive({ name: 'ofwfblink', value: formattedValue });
                        }}
                        isEdit={isEdit}
                        rendered={rendered}
                    />
                )}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Group Chat (Name or URL) <span className="text-red-500">*</span></>}
                        placeHolder='Group Chat'
                        value={data.ofwgroupchat}
                        receive={(e) => receive({ name: 'ofwgroupchat', value: e })}
                        category={'marketing'}
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                    />)}
                {User === 'Credit' &&
                    (<LabeledSelect_Relationship
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Relationship to the Beneficiary <span className="text-red-500">*</span></>}
                        placeHolder='Relationship to the Beneficiary'
                        value={data.RelationshipBen}
                        receive={(e) => receive({ name: 'RelationshipBen', value: e })}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        showSearch
                    />)}
                {(User === 'Credit' && addCoborrower) && (
                    <LabeledSelect_Relationship
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Relationship to Additional <span className="text-red-500">*</span></>}
                        placeHolder='Relationship to Additional'
                        value={data.RelationshipAdd}
                        receive={(e) => receive({ name: 'RelationshipAdd', value: e })}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        showSearch
                    />)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label='font-bold'
                        label={<>Religion <span className="text-red-500">*</span></>}
                        placeHolder='Religion'
                        data={Religion()}
                        value={data.Religion}
                        receive={(e) => receive({ name: 'Religion', value: e })}
                        disabled={isEdit}
                        showSearch
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        data={Overseas()}
                        label={<>PEP <span className="text-red-500">*</span></>}
                        placeHolder='PEP'
                        readOnly={isEdit}
                        value={data.PEP}
                        receive={(e) => receive({ name: 'PEP', value: e })}
                        disabled={isEdit}
                        rendered={rendered}
                    />)}
                <LabeledSelect
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Marital Status <span className="text-red-500">*</span></>}
                    placeHolder='Marital Status'
                    disabled={isEdit}
                    value={data.ofwmstatus}
                    data={MaritalStatus()}
                    receive={(e) => receive({ name: 'ofwmstatus', value: e })}
                    rendered={rendered}
                />
                {User === 'Credit' && (data.ofwmstatus === 2 || data.ofwmstatus === 5 || data.ofwmstatus === 6) && (
                    <div className="mt-6 w-[18.75rem] h-[3.875rem] flex items-center">
                        <Checkbox
                            checked={data.MarriedPBCB}
                            onClick={() => {
                                receive({ name: 'MarriedPBCB', value: !data.MarriedPBCB });
                            }}
                            disabled={isEdit}
                        >
                            If the PB and CB are married to each other
                        </Checkbox>
                    </div>
                )}
                {(data.ofwmstatus === 2 || data.ofwmstatus === 5 || data.ofwmstatus === 6) && (
                    User !== 'LC' && (
                        <>
                            <LabeledInput_Fullname
                                className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                                className_label={'font-bold'}
                                label={<>Spouse Name <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Name'
                                readOnly={isEdit}
                                receive={(e) => receive({ name: 'ofwspouse', value: e })}
                                value={data.ofwspouse}
                                isEdit={isEdit}
                                rendered={rendered}
                                disabled={User === 'Credit' && data.MarriedPBCB}

                            />
                            <DatePicker_BDate
                                className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                                className_label={'font-bold'}
                                label={<>Spouse Birthdate <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Birthdate'
                                receive={(e) => receive({ name: 'ofwspousebdate', value: e })}
                                value={data.ofwspousebdate}
                                isEdit={isEdit}
                                rendered={rendered}
                                disabled={User === 'Credit' && data.MarriedPBCB}

                            />
                            {User === 'Credit' && (
                                <LabeledSelect
                                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                                    className_label={'font-bold'}
                                    label={<>Spouse Source of Income <span className="text-red-500">*</span></>}
                                    placeHolder='Spouse Source of Income'
                                    disabled={isEdit}
                                    value={data.SpSrcIncome}
                                    data={SpouseSourceIncome()}
                                    receive={(e) => receive({ name: 'SpSrcIncome', value: e })}
                                    rendered={rendered}
                                />)}
                            {User === 'Credit' && (
                                <LabeledInput_Salary
                                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                                    className_label={'font-bold'}
                                    label={<>Spouse Income <span className="text-red-500">*</span></>}
                                    placeHolder='Spouse Income'
                                    readOnly={isEdit}
                                    value={data.SpIncome}
                                    receive={(e) => receive({ name: 'SpIncome', value: e })}
                                    category={'direct'}
                                    rendered={rendered}
                                    triggered={data.MarriedPBCB}
                                />)}
                        </>
                    )
                )}

                <Form.Item
                    label="Dependents"
                    colon={false}
                 //   labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    className="w-[18.75rem] mt-4 font-bold"
                >
                    <Input
                        value={data.ofwdependents || '0'}
                        className="h-[2.5rem] border border-gray-300 rounded-lg mt-[-.3rem]"
                        readOnly
                        placeholder="No. of Dependents"
                    />
                </Form.Item>




                {/*
                    <LabeledInput
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        className_dsub={''}
                        label={"Dependents"}
                        value={data.ofwdependents || '0'}
                        receive={(e) => { receive({ name: 'ofwdependents', value: e }); }}
                        digits={2}
                        placeHolder={'No.of Dependents'}
                        readOnly={true}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}

                    />

                */}
                <div className="w-full mt-[2rem] mx-auto">
                    <RelativesTable BorrowerId={BorrowerId} onUpdateCount={(count) => setRelativesCount(count)} data={data}/>
                </div>

            </Flex>

            <div className="mt-[13rem]">
                <SectionHeader title="Present Address" />
            </div>
            <Flex className='w-full' justify='center' gap='small' wrap>

                <AddressGroup_Component
                    api={api}
                    data={data}
                    receive={(e) => receive(e)}
                    presaddress={(e) => presaddress(e)}
                    type={"present"}
                    disabled={isEdit}
                    category={"marketing"}
                    className_dmain={'mt-5 w-[16.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    vertical_algin={true}
                    rendered={rendered}
                />
                <LabeledSelect
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Type of Residences <span className="text-red-500">*</span></>}
                    placeHolder='Type of Residences'
                    disabled={isEdit}
                    receive={(e) => receive({ name: 'ofwresidences', value: e })}
                    data={Residences()}
                    category={'marketing'}
                    value={data.ofwresidences}
                    rendered={rendered}
                />
                {data.ofwresidences === 3 || data.ofwresidences === 2 ? (
                    <LabeledCurrencyInput
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>{data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}<span className="text-red-500"> *</span></>}
                        value={data.ofwrent}
                        receive={(e) => { receive({ name: 'ofwrent', value: e }) }}
                        category={'direct'}
                        placeHolder={data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                        rendered={rendered}
                    />
                ) : null}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_Fullname
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Landmark <span className="text-red-500">*</span></>}
                        placeHolder='Landmark'
                        isEdit={isEdit}
                        category={'marketing'}
                        readOnly={isEdit}
                        value={data.landmark}
                        rendered={rendered}
                        receive={(e) => receive({ name: 'landmark', value: e })}
                    />)}
                {User === 'Credit' && (
                    <LabeledInput_Fullname
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                        placeHolder='Remarks'
                        isEdit={isEdit}
                        category={'marketing'}
                        readOnly={isEdit}
                        rendered={rendered}
                        value={data.OfwPoBRemarks}
                        receive={(e) => receive({ name: 'OfwPoBRemarks', value: e })}
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_LengthStay
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Length of Stay <span className="text-red-500">*</span></>}
                        disabled={isEdit}
                        category={'marketing'}
                        value_year={data.ofwlosYear}
                        value_month={data.ofwlosMonth}
                        receiveY={(e) => receive({ name: 'ofwlosYear', value: e })}
                        receiveM={(e) => receive({ name: 'ofwlosMonth', value: e })}
                        rendered={rendered}
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledSelect_CollectionArea
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Collection Area'}
                        placeHolder='Collection Area'
                        category={'marketing'}
                        showSearch={true}
                        readOnly={isEdit}
                        value_prov={data.ofwPresProv}
                        value_mun={data.ofwPresMunicipality}
                        value={data.collectionarea}
                        get_presprov={data.ofwPresProv}
                        receive={(e) => receive({ name: 'collectionarea', value: e })}
                        rendered={rendered}
                        disabled={true}
                    />)}
            </Flex>
            {User === 'LC'
                ? (<></>)
                : (<SectionHeader title="Permanent Address" />)}
            <Flex className='w-full' justify='center' gap='small' wrap>
                {User === 'LC'
                    ? (<></>)
                    : (<AddressGroup_Component
                        api={api}
                        data={data}
                        receive={(e) => receive(e)}
                        presaddress={(e) => presaddress(e)}
                        type={"permanent"}
                        disabled={isEdit}
                        category={"marketing"}
                        className_dmain={'mt-5 w-[16.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        vertical_algin={true}
                        rendered={rendered}

                    />)}
            </Flex>
            {User === 'LC'
                ? (<></>)
                : (<SectionHeader title="Provincial Address" />)}
            <Flex className='w-full' justify='center' gap='small' wrap>
                {User === 'LC'
                    ? (<></>)
                    : (<AddressGroup_Component
                        api={api}
                        data={data}
                        receive={(e) => receive(e)}
                        presaddress={(e) => presaddress(e)}
                        type={"provincial"}
                        disabled={isEdit}
                        category={"marketing"}
                        className_dmain={'mt-5 w-[16.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        vertical_algin={true}
                        rendered={rendered}
                    />)}
            </Flex>
            {User === 'LC'
                ? (<></>)
                : (<SectionHeader title="Presented ID" />)}
            <Flex className='w-full' justify='center' gap='small' wrap>
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledSelect_ValidId
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Valid ID Type'}
                        placeHolder='Valid ID Type'
                        disabled={isEdit}
                        receive={(e) => receive({ name: 'ofwvalidid', value: e })}
                        category={'marketing'}
                        value={data.ofwvalidid}
                        rendered={rendered}
                        required={false}
                        showSearch
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'ID Number'}
                        placeHolder='ID type Number'
                        readOnly={isEdit}
                        receive={(e) => receive({ name: 'ofwidnumber', value: e })}
                        value={data.ofwidnumber}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}
                    />)}
            </Flex>
            <SectionHeader title="Employment Details" />
            <Flex className='w-full' justify='center' gap='small' wrap>
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledSelect_Country
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem] mt-[-0.1rem]'}
                        className_label={'font-bold'}
                        label={<>Country of Employment for OFW or Joining Port for SEAFARER <span className="text-red-500">*</span></>}
                        placeHolder='Country'
                        disabled={isEdit}
                        category={'marketing'}
                        value={data.ofwcountry}
                        receive={(e) => receive({ name: 'ofwcountry', value: e })}
                        rendered={rendered}
                    />)}
                {User === 'LC' ? (
                    <></>
                ) : (
                    User === 'Credit' ? (
                        <LabeledSelect
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Job Category <span className="text-red-500">*</span></>}
                            placeHolder='Job Category'
                            data={JobCategory()}
                            value={data.JobCategory}
                            receive={(e) => receive({ name: 'JobCategory', value: e })}
                            disabled={isEdit}
                            rendered={rendered}
                        />
                    ) : (
                        <LabeledInput_Fullname
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Job Title / Position <span className="text-red-500">*</span></>}
                            readOnly={isEdit}
                            category={'marketing'}
                            value={data.ofwjobtitle}
                            placeHolder='Job/Position'
                            receive={(e) => receive({ name: 'ofwjobtitle', value: e })}
                            rendered={rendered}
                        />))}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Position <span className="text-red-500">*</span></>}
                        placeHolder='Position'
                        data={JobTitle(data.JobCategory)}
                        value={data.ofwjobtitle}
                        receive={(e) => receive({ name: 'ofwjobtitle', value: e })}
                        disabled={isEdit}
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Employment Status <span className="text-red-500">*</span></>}
                        placeHolder='Employment Status'
                        data={EmploymentStatus()}
                        value={data.EmpStatus}
                        receive={(e) => receive({ name: 'EmpStatus', value: e })}
                        disabled={isEdit}
                        showSearch
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL' || data.loanProd === '0303-VA' || data.loanProd === '0303-VL') && (
                    <LabeledInput_Fullname
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Principal Employer <span className="text-red-500">*</span></>}
                        placeHolder='Principal Employer'
                        readOnly={isEdit}
                        value={data.PEmployer}
                        receive={(e) => receive({ name: 'PEmployer', value: e })}
                        rendered={rendered}
                    />)}
                {(User !== 'Credit' || (User === 'Credit' && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL' || data.loanProd === '0303-VA' || data.loanProd === '0303-VL'))) && (
                    User === 'LC'
                        ? (<></>)
                        : (<LabeledSelectAgency
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>{User === 'Credit' ? 'Agency' : 'Company/ Employer / Agency Name'} <span className="text-red-500"> *</span></>}
                            placeHolder={User === 'Credit' ? 'Agency Name' : 'Company/ Employer / Agency Name'}
                            showSearch
                            filterOption={(input, option) =>
                                option?.label?.toString().toLowerCase().includes(input.toLowerCase())}
                            disabled={isEdit}
                            readOnly={User === 'Credit' ? isEdit : false}
                            value={data.ofwcompany}
                            receive={(e) => receive({ name: 'ofwcompany', value: e })}
                            rendered={rendered}
                        />))}
                {User === 'Credit' && (
                    <LabeledInput_ForeignCurrency
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Salary in Foreign Currency <span className="text-red-500">*</span></>}
                        placeHolder='Foreign Salary'
                        data={data}
                        receive={(e) => receive({ name: 'FCurrency', value: e })}
                        receiveForeign={(e) => receive({ name: 'FSalary', value: e })}
                        receiveConvert={(e) => receive({ name: 'PSalary', value: e })}
                        receiveFCurValue={(e) => receive({ name: 'FCurValue', value: e })}
                        category={'marketing'}
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                    />)}
                {User !== 'Credit' && (<LabeledInput_Salary
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Salary <span className="text-red-500">*</span></>}
                    placeHolder='Salary'
                    readOnly={isEdit}
                    value={data.ofwsalary}
                    receive={(e) => receive({ name: 'ofwsalary', value: e })}
                    category={'direct'}
                    rendered={rendered}
                />)}
                {/*User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Agency Address'}
                            placeHolder='Agency Address'
                            readOnly={isEdit}
                            value={data.agencyaddress}
                            receive={(e) => receive({ name: 'agencyaddress', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'License Validity'}
                            placeHolder='License Validity'
                            readOnly={isEdit}
                            value={data.license}
                            receive={(e) => receive({ name: 'license', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Status'}
                            placeHolder='Status'
                            readOnly={isEdit}
                            value={data.ofwstatus}
                            receive={(e) => receive({ name: 'ofwstatus', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Contact Person'}
                            placeHolder='Contact Person'
                            readOnly={isEdit}
                            value={data.contactper}
                            receive={(e) => receive({ name: 'ofwstatus', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Designation'}
                            placeHolder='Designation'
                            readOnly={isEdit}
                            value={data.landmark}
                            receive={(e) => receive({ name: 'landmark', value: e })}
                        />)*/}
                {User === 'Credit' && (
                    <SelectDatePicker
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Contract Date <span className="text-red-500">*</span></>}
                        placeHolder='Contract Date'
                        receive={(e) => receive({ name: 'ContractDate', value: e })}
                        value={data.ContractDate}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (<>
                    <LabeledInput_Numeric
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Contract Duration <span className="text-red-500">*</span></>}
                        rendered={rendered}
                        receive={(e) => receive({ name: 'ContractDuration', value: e })}
                        value={data.ContractDuration}
                        placeHolder={'No. of Months'}
                        category={'marketing'}
                        digits={2}
                    />
                    {/*
                    <div className="relative mt-[2.7rem] w-[300px]">
                        <label className="absolute -top-5 bg-white px-1 text-sm font-bold text-gray-600">Contract Duration</label>
                        <LabeledSelect_DatePickerMonth
                            placeHolder={'Select Month'}
                            receive={(e) => receive({ name: 'ContractDuration', value: e })}
                            value={data.ContractDuration}
                            rendered={rendered}
                        />
                    </div>
                    */}
                </>)}
            </Flex>
            {User === 'Credit' && (
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6 flex justify-center items-center mt-8">
                        <Checkbox
                            disabled={isEdit}
                            checked={data.UnliContract}
                            onChange={() => {
                                receive({
                                    name: 'UnliContract',
                                    value: !data.UnliContract,
                                });
                            }} />
                        <label className="ml-2 font-bold">Unlimited Contract</label>
                    </div>
                </div>)}
            <Flex className='w-full' justify='center' gap='small' wrap>

                {(User === 'Credit' && (data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL')) && (
                    <DatePicker_Deployment
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label="font-bold"
                        className_dsub=""
                        label={<>Departure Date <span className="text-red-500">*</span></>}
                        value={data.ofwDeptDate}
                        receive={(e) => { receive({ name: 'ofwDeptDate', value: e }) }}
                        placeHolder="Departure Date"
                        disabledate={disableDate_deployment}
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={<>Years as OFW or Seafarer <span className="text-red-500">*</span></>}
                        placeHolder='Years as OFW or Seafarer'
                        disabled={isEdit}
                        category={'marketing'}
                        value={data.YrsOfwSeafarer}
                        receive={(e) => receive({ name: 'YrsOfwSeafarer', value: e })}
                        showSearch={true}
                        optionFilterProp="children"
                        filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        rendered={rendered}
                        data={generateYearOptions(50)}
                    />)}
                {User === 'Credit' && (data.loanProd === '0303-VA' || data.loanProd === '0303-VL') && (
                    <>
                        <LabeledInput_Fullname
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>Name of Vessel <span className="text-red-500">*</span></>}
                            placeHolder='Name of Vessel'
                            readOnly={isEdit}
                            value={data.VesselName}
                            receive={(e) => receive({ name: 'VesselName', value: e })}
                            category={'direct'}
                            rendered={rendered}
                        />
                        <LabeledInput_Fullname
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>IMO Vessel <span className="text-red-500">*</span></>}
                            placeHolder='IMO Vessel'
                            readOnly={isEdit}
                            value={data.VesselIMO}
                            receive={(e) => receive({ name: 'VesselIMO', value: e })}
                            category={'direct'}
                            rendered={rendered}
                        />
                        <LabeledInput
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>Type of Vessel <span className="text-red-500">*</span></>}
                            placeHolder='Type of Vessel'
                            readOnly={isEdit}
                            value={data.VesselType}
                            receive={(e) => receive({ name: 'VesselType', value: e })}
                            category={'direct'}
                            rendered={rendered}
                        />
                        {data.VesselName && data.VesselIMO && data.VesselType && (
                            <div className="mt-8">
                                <label className="font-bold block ">Information of the Vessel</label>
                                <TextArea
                                    className="w-[920px] h-[62px] p-1 border border-gray-300 rounded-md resize-none "
                                    value={data.VesselInfo}
                                    onChange={(e) => receive({ name: 'VesselInfo', value: e.target.value })}
                                    style={{
                                        resize: 'none',
                                    }}
                                //readOnly={!isEdit}
                                />
                            </div>
                        )}

                    </>
                )}
                {User === 'Credit' && data.loanProd === '0303-VA' && (
                    <LabeledInput_NotRequired
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Exact Location'}
                        placeHolder='Exact Location'
                        readOnly={isEdit}
                        value={data.ExactLocation}
                        receive={(e) => receive({ name: 'ExactLocation', value: e })}
                        category={'marketing'}
                    />)}
                {User === 'Credit' && data.loanProd === '0303-WA' && (
                    <LabeledInput_NotRequired
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Possible Vacation'}
                        placeHolder='Possible Vacation'
                        readOnly={isEdit}
                        value={data.PossVacation}
                        receive={(e) => receive({ name: 'PossVacation', value: e })}
                        category={'marketing'}
                    />)}
                {User === 'Credit' && (
                    <LabeledInput
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={<>Beneficiary or Allotment Name <span className="text-red-500">*</span></>}
                        placeHolder='Allotment Name'
                        readOnly={isEdit}
                        value={data.AllotName}
                        receive={(e) => receive({ name: 'AllotName', value: e })}
                        category={'direct'}
                        rendered={rendered}
                    />)}
                {/*User === 'Credit' &&  (
                            <LabeledSelect_Relationship
                                 className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                                className_label={'font-bold'}
                                label={'Relationship to the OFW'}
                                placeHolder='Relationship to the OFW '
                                value={data.ofwrelationship}
                                receive={(e) => receive({ name: 'ofwrelationship', value: e })}
                                category={'marketing'}
                                disabled={isEdit}
                                isEdit={isEdit}
                                rendered={rendered}
                            />)*/}
                {User === 'Credit' && (
                    <LabeledCurrencyInput
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label="font-bold"
                        value={data.AllotAmount}
                        receive={(e) => receive({ name: 'AllotAmount', value: e })}
                        label={<>Remittance or Allotment Amount <span className="text-red-500">*</span></>}
                        placeHolder={'Amount'}
                        category={'marketing'}
                        rendered={rendered}
                    />)}
                {/*User === 'Credit' && (
                    <LabeledInput
                         className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Remittance or Allotment Schedule '}
                        placeHolder='Schedule'
                        readOnly={isEdit}
                        value={data.ofwallotsched}
                        receive={(e) => receive({ name: 'ofwallotsched', value: e })}
                        category={'direct'}
                        rendered={rendered}
                    />)*/}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-2 w-[18.75rem] h-[3.875rem] pt-1'}
                        className_label={'font-bold'}
                        label={<>Remittance / Allotment Channel (Gcash, Bank) <span className="text-red-500">*</span></>}
                        placeHolder='Allotment Channel'
                        data={AllotChannel()}
                        value={data.AllotChannel}
                        receive={(e) => receive({ name: 'AllotChannel', value: e })}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                    />)}
            </Flex>
            {User === 'LC'
                ? (<></>)
                : (<SectionHeader title="Educational Background" />)}
            <Flex className='w-full' justify='center' gap='small' wrap>
                {(User === 'MARKETING' || (User === 'Credit' && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL'))) && (
                    <>
                        <LabeledSelect
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Highest Educational Attainment <span className="text-red-500">*</span></>}
                            placeHolder='Highest Educational Attainment'
                            disabled={isEdit}
                            data={EducationalAttainment()}
                            value={data.ofwHighestEdu}
                            receive={(e) => receive({ name: 'ofwHighestEdu', value: e })}
                            rendered={rendered}
                            showSearch={!isEdit}
                        />
                        <LabeledInput_NotRequired
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Course'}
                            placeHolder='Course'
                            disabled={isEdit}
                            value={data.ofwcourse}
                            receive={(e) => { receive({ name: 'ofwcourse', value: e }); }}
                            readOnly={isEdit}
                        /> </>)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_NotRequired
                        className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'School'}
                        placeHolder='School'
                        readOnly={isEdit}
                        value={data.ofwschool}
                        receive={(e) => receive({ name: 'ofwschool', value: e })}
                        category={'marketing'}
                    />)}
            </Flex>
        </div>
    );
}

export default EditOfwDetails;