import React, { useContext, useEffect, useState } from 'react';
import { Flex, notification, Checkbox, Input, Form, ConfigProvider } from 'antd';
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
import { getDependentsCount } from '@hooks/DependentsController';
import { useStore } from 'zustand';
import DatePickerOpt from '@components/optimized/DatePickerOpt';
import { useDataContainer } from '@context/PreLoad';
import SelectOpt from '@components/optimized/SelectOpt';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import InputOpt from '@components/optimized/InputOpt';
import { Age } from '@utils/Calculations';


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

    const [getAge, setAge] = useState(data.ofwbdate)

    const rendered = true;
    function generateYearOptions(maxYears) {
        const options = [];
        for (let i = 1; i <= maxYears; i++) {
            options.push({ label: i.toString(), value: i });
        }
        return options;
    }

    const { GET_COUNTRY_LIST, GET_RELATIONSHIP_LIST } = useDataContainer();
    const get_country_list = GET_COUNTRY_LIST?.map(x => ({ value: x.code, label: x.description, negative: x.isNegative, name: x.description })) || [];
    const GET_RELATIONSHIP = GET_RELATIONSHIP_LIST?.map(x => ({ value: x.code, label: x.description })) || [];
    const { getAppDetails, updateAppDetails, queryDetails } = useContext(LoanApplicationContext)
    const JOB_CATEGORY = JobCategory()?.map(x => ({ value: x.value, label: typeof x.label === 'string' ? x.label.toUpperCase() : x.label }))
    const JOB_TITLE = JobTitle(data.JobCategory) ? JobTitle(data.JobCategory)?.map(x => ({ value: x.value, label: typeof x.label === 'string' ? x.label.toUpperCase() : x.label })) : [];

    return (
        <div>
            {(User === 'MARKETING' || User === 'LC') && (
                <SectionHeader title="Personal Information" />
            )}

            {User !== 'MARKETING' && User !== 'LC' && (
               <SectionHeader
               title={
                 ["0303-DHW", "0303-VL", "0303-WL"].includes(getAppDetails.loanProd) ? (
                   <>
                     Principal Borrower
                     <br />
                     <span className="text-sm">(OFW Details)</span>
                   </>
                 ) : (
                   <>
                     Co-Borrower
                     <br />
                     <span className="text-sm">(OFW Details)</span>
                   </>
                 )
               }
             />
            )}


            {contextHolder}
            <Flex className="w-full  mt-5 xs1:mt-2 2xl:mt-5" justify="center" gap="small" wrap>

                <InputOpt
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>First Name <span className="text-red-500">*</span></>}
                    value={data.ofwfname}
                    placeHolder='First Name'
                    receive={(e) => updateAppDetails({ name: 'ofwfname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'ofwfname'}
                    group={'Uppercase'}
                    compname={'First Name'}
                />
                <InputOpt
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={'Middle Name'}
                    value={data.ofwmname}
                    placeHolder='Middle Name'
                    receive={(e) => updateAppDetails({ name: 'ofwmname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={false}
                    required={false}
                    KeyName={'ofwmname'}
                    group={'Uppercase'}
                    compname={'Middle Name'}
                />
                <InputOpt
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Last Name <span className="text-red-500">*</span></>}
                    value={data.ofwlname}
                    placeHolder='Last Name'
                    receive={(e) => updateAppDetails({ name: 'ofwlname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'ofwlname'}
                    group={'Uppercase'}
                    compname={'Last Name'}
                />
                <LabeledSelect_Suffix
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Suffix <span className="text-red-500">*</span></>}
                    placeHolder='Suffix'
                    value={data.ofwsuffix}
                    receive={(e) => updateAppDetails({ name: 'ofwsuffix', value: e })}
                    disabled={isEdit}
                    showSearch
                    isEdit={isEdit}
                    rendered={rendered}
                />
                <DatePickerOpt
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Birthdate <span className="text-red-500">*</span></>}
                    placeHolder='Enter Birthdate'
                    receive={(e) => {
                        updateAppDetails({ name: 'ofwbdate', value: e });
                        setAge(Age(e))
                        //receive({ name: 'age', value: calculateAge(e) });
                    }}
                    value={data.ofwbdate}
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'ofwbdate'}
                    notValidMsg={'Birthdate Required'}
                />
                {User === 'Credit' && (
                    <LabeledInput //create default input field for display
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Age'}
                        receive={(e) => updateAppDetails({ name: 'ofwage', value: e })}
                        value={getAge ? getAge : 0}
                        readOnly={true}
                        placeHolder='Age'
                        rendered={rendered}
                    />)}

                <LabeledSelect
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Gender <span className="text-red-500">*</span></>}
                    placeHolder='Gender'
                    value={data.ofwgender}
                    data={Gender()}
                    receive={(e) => updateAppDetails({ name: 'ofwgender', value: e })}
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                <LabeledInput_OfwContact
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Mobile Number <span className="text-red-500">*</span></>}
                    placeHolder='Mobile Number'
                    data={data}
                    value={data.ofwmobile}
                    receive={(e) => updateAppDetails({ name: 'ofwmobile', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_OfwContact
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Other Mobile Number'}
                        placeHolder='Other Mobile Number'
                        data={data}
                        value={data.ofwothermobile}
                        receive={(e) => updateAppDetails({ name: 'ofwothermobile', value: e })}
                        category={'marketing'}
                        type='contact'
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}
                    />)}
                <InputOpt
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Email Address <span className="text-red-500">*</span></>}
                    placeHolder='Email Address'
                    value={data.ofwemail}
                    receive={(e) => updateAppDetails({ name: 'ofwemail', value: e })}
                    category={'marketing'}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'ofwemail'}
                    group={'Email'}
                    compname={'Email Address'}

                />
                {User === 'Credit' ? (
                    <div className="mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem">
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
                                    updateAppDetails({ name: 'ofwfblink', value: formattedValue });
                                }
                            }}
                        />
                    </div>
                ) : (
                    <LabeledInput
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeHolder='Facebook Name / Profile'
                        readOnly={isEdit}
                        value={data.ofwfblink || ''}
                        receive={(e) => {
                            const formattedValue = e.includes('https://') ? e : `https://www.facebook.com/${e}`;
                            updateAppDetails({ name: 'ofwfblink', value: formattedValue });
                        }}
                        isEdit={isEdit}
                        rendered={rendered}
                    />
                )}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Group Chat (Name or URL) <span className="text-red-500">*</span></>}
                        placeHolder='Group Chat'
                        value={data.ofwgroupchat}
                        receive={(e) => updateAppDetails({ name: 'ofwgroupchat', value: e })}
                        category={'marketing'}
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        KeyName={'ofwgroupchat'}
                        group={'Default'}
                        compname={'Group Chat'}

                    />)}
                {(User === 'Credit' && addCoborrower) && (
                    <SelectOpt
                        className_dmain='mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Relationship to Additional <span className="text-red-500">*</span></>}
                        value={data.benrelationship}
                        rendered={rendered}
                        placeHolder='Relationship to Additional'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'RelationshipAdd', value: e })}
                        options={GET_RELATIONSHIP}
                        notValidMsg={'Relationship to Additional Required'}
                        KeyName={'RelationshipAdd'}
                        group={'Default'}
                    />

                )}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label='font-bold'
                        label={<>Religion <span className="text-red-500">*</span></>}
                        placeHolder='Religion'
                        data={Religion()}
                        value={data.Religion}
                        receive={(e) => updateAppDetails({ name: 'Religion', value: e })}
                        disabled={isEdit}
                        showSearch
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        data={Overseas()}
                        label={<>PEP <span className="text-red-500">*</span></>}
                        placeHolder='PEP'
                        readOnly={isEdit}
                        value={data.PEP}
                        receive={(e) => updateAppDetails({ name: 'PEP', value: e })}
                        disabled={isEdit}
                        rendered={rendered}
                    />)}
                <LabeledSelect
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Marital Status <span className="text-red-500">*</span></>}
                    placeHolder='Marital Status'
                    disabled={isEdit}
                    value={data.ofwmstatus}
                    data={MaritalStatus()}
                    receive={(e) => updateAppDetails({ name: 'ofwmstatus', value: e })}
                    rendered={rendered}
                />

                {(User === 'Credit' || User === 'MARKETING') && (data.ofwmstatus === 2 || data.ofwmstatus === 5 || data.ofwmstatus === 6) && (
                    <div className="mt-6 w-[18.75rem] h-[3.875rem] flex items-center">
                        <Checkbox
                            checked={data.MarriedPBCB}
                            onClick={() => {
                                updateAppDetails({ name: 'MarriedPBCB', value: !data.MarriedPBCB });
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
                            <InputOpt
                                className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                                className_label={'font-bold'}
                                label={<>Spouse Name <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Name'
                                readOnly={isEdit}
                                receive={(e) => updateAppDetails({ name: 'ofwspouse', value: e })}
                                value={data.ofwspouse}
                                isEdit={isEdit}
                                rendered={rendered}
                                disabled={User === 'Credit' && data.MarriedPBCB}
                                KeyName={'ofwspouse'}
                                group={'Uppercase'}
                                compname={'Spouse Name'}
                            />

                            <DatePickerOpt
                                className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                                className_label={'font-bold'}
                                label={<>Spouse Birthdate <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Birthdate'
                                receive={(e) => updateAppDetails({ name: 'ofwspousebdate', value: e })}
                                value={data.ofwspousebdate}
                                isEdit={isEdit}
                                rendered={rendered}
                                disabled={User === 'Credit' && data.MarriedPBCB}
                                notValidMsg={'Spouse Birthdate Required'}
                                KeyName={'ofwspousebdate'}
                                category={'marketing'}
                            />
                            {User === 'Credit' && (
                                <LabeledSelect
                                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                                    className_label={'font-bold'}
                                    label={<>Spouse Source of Income <span className="text-red-500">*</span></>}
                                    placeHolder='Spouse Source of Income'
                                    disabled={isEdit}
                                    value={data.SpSrcIncome}
                                    data={SpouseSourceIncome()}
                                    receive={(e) => updateAppDetails({ name: 'SpSrcIncome', value: e })}
                                    rendered={rendered}
                                />)}
                            {User === 'Credit' && (
                                <InputOpt
                                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                                    className_label={'font-bold'}
                                    label={<>Spouse Income <span className="text-red-500">*</span></>}
                                    placeHolder='Spouse Income'
                                    readOnly={isEdit}
                                    value={data.SpIncome}
                                    receive={(e) => updateAppDetails({ name: 'SpIncome', value: e })}
                                    category={'marketing'}
                                    rendered={rendered}
                                    KeyName={'SpIncome'}
                                    format={'Currency'}
                                    group={'Rent_Amort'}
                                    compname={'Spouse Income'}
                                />)}
                        </>
                    )
                )}
                {User === 'Credit' &&
                    (<SelectOpt
                        className_dmain='mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Relationship to the Beneficiary <span className="text-red-500">*</span></>}
                        value={data.RelationshipBen}
                        rendered={rendered}
                        placeHolder='Relationship to the Beneficiary'
                        category={'marketing'}
                        disabled={data.MarriedPBCB}
                        showSearch
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'RelationshipBen', value: e })}
                        options={GET_RELATIONSHIP}
                        notValidMsg={'Relationship to Beneficiary Required'}
                        KeyName={'RelationshipBen'}
                        group={'Default'}
                    />
                    )}
                {User !== 'LC' && (
                    <Form.Item
                        label="Dependents"
                        colon={false}
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
                )}
                {User === 'LC' && (
                    <LabeledInput
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        className_dsub={''}
                        label={"Dependents"}
                        value={data.ofwdependents || '0'}
                        receive={(e) => { updateAppDetails({ name: 'ofwdependents', value: e }); }}
                        digits={2}
                        placeHolder={'No.of Dependents'}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}
                    />
                )}
                {User !== 'LC' && (
                    <div className="w-full mt-[2rem] mx-auto">
                        <RelativesTable BorrowerId={BorrowerId} onUpdateCount={(count) => setRelativesCount(count)} data={data} isOfw={1} />
                    </div>
                )}

            </Flex>

            <div className={`${User === 'LC' ? 'mt-[2rem]' : 'mt-[13rem]'}`}>
                <SectionHeader title="Present Address" />
            </div>
            <Flex className='w-full' justify='center' gap='small' wrap>
                <AddressGroup_Component
                    api={api}
                    data={data}
                    receive={(e) => updateAppDetails(e)}
                    presaddress={(e) => presaddress(e)}
                    type={"present"}
                    disabled={isEdit}
                    category={"marketing"}
                    className_dmain={`mt-5 xs1:mt-2 2xl:mt-5 xs1:mt-2 2xl:mt-5 xs1:mt-2 2xl:mt-5 w-full xs:w-[18.75rem] sm:w-[18.75rem] md:w-[18.75rem] lg:w-[18.75rem] xl:w-[18.75rem] ${(User === 'Credit' || User === 'Lp') ? '2xl:w-[16.75rem]' : '2xl:w-[18.75rem]'
                        } 3xl:w-[20.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    vertical_algin={true}
                    rendered={rendered}
                />
                <LabeledSelect
                    className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Type of Residence <span className="text-red-500">*</span></>}
                    placeHolder='Type of Residence'
                    disabled={isEdit}
                    receive={(e) => updateAppDetails({ name: 'ofwresidences', value: e })}
                    data={Residences()}
                    category={'marketing'}
                    value={data.ofwresidences}
                    rendered={rendered}
                />
                {data.ofwresidences === 3 || data.ofwresidences === 2 ? (
                    <InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>{data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}<span className="text-red-500"> *</span></>}
                        value={data.ofwrent}
                        receive={(e) => { updateAppDetails({ name: 'ofwrent', value: e }) }}
                        category={'direct'}
                        placeHolder={data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                        rendered={rendered}

                        KeyName={'ofwrent'}
                        format={'Currency'}
                        group={'Rent_Amort'}
                        compname={data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                    />
                ) : null}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Landmark <span className="text-red-500">*</span></>}
                        placeHolder='Landmark'
                        isEdit={isEdit}
                        category={'marketing'}
                        readOnly={isEdit}
                        value={getAppDetails.landmark}
                        rendered={rendered}
                        receive={(e) => updateAppDetails({ name: 'landmark', value: e })}

                        KeyName={'landmark'}
                        group={'Uppercase'}
                        compname={'Landmark'}
                    />)}
                {User === 'Credit' && (
                    <InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                        placeHolder='Remarks'
                        isEdit={isEdit}
                        category={'marketing'}
                        readOnly={isEdit}
                        rendered={rendered}
                        value={data.OfwPoBRemarks}
                        receive={(e) => updateAppDetails({ name: 'OfwPoBRemarks', value: e })}

                        KeyName={'OfwPoBRemarks'}
                        group={'Uppercase'}
                        compname={'Proof of Billing Remarks'}
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_LengthStay
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Length of Stay <span className="text-red-500">*</span></>}
                        disabled={isEdit}
                        category={'marketing'}
                        value_year={data.ofwlosYear}
                        value_month={data.ofwlosMonth}
                        receiveY={(e) => updateAppDetails({ name: 'ofwlosYear', value: e })}
                        receiveM={(e) => updateAppDetails({ name: 'ofwlosMonth', value: e })}
                        rendered={rendered}
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledSelect_CollectionArea
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
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
                        receive={(e) => updateAppDetails({ name: 'collectionarea', value: e })}
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
                        receive={(e) => updateAppDetails(e)}
                        presaddress={(e) => presaddress(e)}
                        type={"permanent"}
                        disabled={isEdit}
                        category={"marketing"}
                        className_dmain={`mt-5 xs1:mt-2 2xl:mt-5 w-full xs:w-[8.75rem] sm:w-[8.75rem] md:w-[10.75rem] lg:w-[12.75rem] xl:w-[14.75rem] ${(User === 'Credit' || User === 'Lp') ? '2xl:w-[16.75rem]' : '2xl:w-[18.75rem]'
                            } 3xl:w-[20.75rem] h-[3.875rem]`}
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
                        receive={(e) => updateAppDetails(e)}
                        presaddress={(e) => presaddress(e)}
                        type={"provincial"}
                        disabled={isEdit}
                        category={"marketing"}
                        className_dmain={`mt-5 xs1:mt-2 2xl:mt-5 w-full xs:w-[8.75rem] sm:w-[8.75rem] md:w-[10.75rem] lg:w-[12.75rem] xl:w-[14.75rem] ${(User === 'Credit' || User === 'Lp') ? '2xl:w-[16.75rem]' : '2xl:w-[18.75rem]'
                            } 3xl:w-[20.75rem] h-[3.875rem]`}
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
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'Valid ID Type'}
                        placeHolder='Valid ID Type'
                        disabled={isEdit}
                        receive={(e) => updateAppDetails({ name: 'ofwvalidid', value: e })}
                        category={'marketing'}
                        value={data.ofwvalidid}
                        rendered={rendered}
                        required={false}
                        showSearch
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'ID Number'}
                        placeHolder='ID type Number'
                        readOnly={isEdit}
                        receive={(e) => updateAppDetails({ name: 'ofwidnumber', value: e })}
                        value={data.ofwidnumber}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}

                        KeyName={'ofwidnumber'}
                        group={'Uppercase'}
                        compname={'ID Number'}
                    />)}
            </Flex>
            <SectionHeader title="Employment Details" />
            <Flex className='w-full' justify='center' gap='small' wrap>
                {User === 'LC'
                    ? (<></>)
                    : (<SelectOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem] mt-[-0.1rem]'}
                        className_label={'font-bold'}
                        label={<>Country of Employment for OFW or Joining Port for SEAFARER <span className="text-red-500">*</span></>}
                        placeHolder='Country'
                        disabled={isEdit}
                        category={'marketing'}
                        value={data.ofwcountry}
                        receive={(e) => updateAppDetails({ name: 'ofwcountry', value: e })}
                        rendered={rendered}
                        showSearch
                        options={get_country_list}
                        KeyName={'ofwcountry'}
                        notValidMsg={'Country Required'}
                    />)}
                {User === 'LC' ? (
                    <></>
                ) : (
                    User === 'Credit' ? (

                        <SelectOpt
                            className_dmain='mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            label={<>Job Category <span className="text-red-500">*</span></>}
                            value={data.JobCategory}
                            rendered={rendered}
                            placeHolder='Job Category'
                            category={'marketing'}
                            disabled={isEdit}
                            isEdit={isEdit}
                            receive={(e) => updateAppDetails({ name: 'JobCategory', value: e })}
                            options={JOB_CATEGORY}
                            notValidMsg={'Job Category Required'}
                            KeyName={'JobCategory'}
                            group={'Default'}
                            showSearch
                        />
                    ) : (
                        <LabeledInput_Fullname
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Job Title / Position <span className="text-red-500">*</span></>}
                            readOnly={isEdit}
                            category={'marketing'}
                            value={data.ofwjobtitle}
                            placeHolder='Job/Position'
                            receive={(e) => updateAppDetails({ name: 'ofwjobtitle', value: e })}
                            rendered={rendered}
                        />))}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain='mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Position <span className="text-red-500">*</span></>}
                        value={data.ofwjobtitle}
                        rendered={rendered}
                        placeHolder='Position'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'ofwjobtitle', value: e })}
                        options={JOB_TITLE}
                        notValidMsg={'Position Required'}
                        KeyName={'ofwjobtitle'}
                        group={'Default'}
                        showSearch

                        EmptyMsg={'Position Required'}
                        InvalidMsg={'Invalid Position'}
                        compname={'Position'}
                    />
                )}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Employment Status <span className="text-red-500">*</span></>}
                        placeHolder='Employment Status'
                        data={EmploymentStatus()}
                        value={data.EmpStatus}
                        receive={(e) => updateAppDetails({ name: 'EmpStatus', value: e })}
                        disabled={isEdit}
                        showSearch
                        rendered={rendered}
                    />)}
                {User === 'Credit' && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL' || data.loanProd === '0303-VA' || data.loanProd === '0303-VL') && (
                    <InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Principal Employer <span className="text-red-500">*</span></>}
                        placeHolder='Principal Employer'
                        readOnly={isEdit}
                        value={data.PEmployer}
                        receive={(e) => updateAppDetails({ name: 'PEmployer', value: e })}
                        rendered={rendered}

                        KeyName={'PEmployer'}
                        group={'Uppercase'}
                        compname={'Principal Employer'}
                    />)}
                {(User !== 'Credit' || (User === 'Credit' && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL' || data.loanProd === '0303-VA' || data.loanProd === '0303-VL'))) && (
                    User === 'LC'
                        ? (<></>)
                        : (<LabeledSelectAgency
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>{User === 'Credit' ? 'Agency' : 'Company/ Employer / Agency Name'} <span className="text-red-500"> *</span></>}
                            placeHolder={User === 'Credit' ? 'Agency Name' : 'Company/ Employer / Agency Name'}
                            showSearch
                            filterOption={(input, option) =>
                                option?.label?.toString().toLowerCase().includes(input.toLowerCase())}
                            disabled={isEdit}
                            readOnly={User === 'Credit' ? isEdit : false}
                            value={data.ofwcompany}
                            receive={(e) => updateAppDetails({ name: 'ofwcompany', value: e })}
                            rendered={rendered}
                        />))}
                {User === 'Credit' && (
                    <LabeledInput_ForeignCurrency
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Salary in Foreign Currency <span className="text-red-500">*</span></>}
                        placeHolder='Foreign Salary'
                        data={data}
                        receive={(e) => updateAppDetails({ name: 'FCurrency', value: e })}
                        receiveForeign={(e) => updateAppDetails({ name: 'FSalary', value: e })}
                        receiveConvert={(e) => updateAppDetails({ name: 'PSalary', value: e })}
                        receiveFCurValue={(e) => updateAppDetails({ name: 'FCurValue', value: e })}
                        category={'marketing'}
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                    />)}
                {User !== 'Credit' &&
                    (<InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Salary <span className="text-red-500">*</span></>}
                        placeHolder='Salary'
                        readOnly={isEdit}
                        value={data.ofwsalary}
                        receive={(e) => updateAppDetails({ name: 'ofwsalary', value: e })}
                        category={'direct'}
                        rendered={rendered}

                        KeyName={'ofwsalary'}
                        group={'Income'}
                        compname={'Salary'}
                        format='Currency'
                    />)}
                {/*User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Agency Address'}
                            placeHolder='Agency Address'
                            readOnly={isEdit}
                            value={data.agencyaddress}
                            receive={(e) => receive({ name: 'agencyaddress', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'License Validity'}
                            placeHolder='License Validity'
                            readOnly={isEdit}
                            value={data.license}
                            receive={(e) => receive({ name: 'license', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Status'}
                            placeHolder='Status'
                            readOnly={isEdit}
                            value={data.ofwstatus}
                            receive={(e) => receive({ name: 'ofwstatus', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Contact Person'}
                            placeHolder='Contact Person'
                            readOnly={isEdit}
                            value={data.contactper}
                            receive={(e) => receive({ name: 'ofwstatus', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Designation'}
                            placeHolder='Designation'
                            readOnly={isEdit}
                            value={data.landmark}
                            receive={(e) => receive({ name: 'landmark', value: e })}
                        />)*/}
                {User === 'Credit' && (
                    <DatePickerOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Contract Date <span className="text-red-500">*</span></>}
                        placeHolder='Contract Date'
                        receive={(e) => updateAppDetails({ name: 'ContractDate', value: e })}
                        value={data.ContractDate}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        notValidMsg={'Contract Date Required'}
                        KeyName={'ContractDate'}
                    // disabledate={disableDate_deployment}

                    />)}
                {User === 'Credit' && (<>
                    <LabeledInput_Numeric
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={<>Contract Duration <span className="text-red-500">*</span></>}
                        rendered={rendered}
                        receive={(e) => updateAppDetails({ name: 'ContractDuration', value: e })}
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
                                updateAppDetails({
                                    name: 'UnliContract',
                                    value: !data.UnliContract,
                                });
                            }} />
                        <label className="ml-2 font-bold">Unlimited Contract</label>
                    </div>
                </div>)}
            <Flex className='w-full' justify='center' gap='small' wrap>

                {(User === 'Credit' && (data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL')) && (
                    <DatePickerOpt
                        KeyName={'ofwDeptDate'}
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={<>OFW Departure Date <span className="text-red-500">*</span></>}
                        value={data.ofwDeptDate}
                        receive={(e) => { updateAppDetails({ name: 'ofwDeptDate', value: e }) }}
                        //disabled={!isEdit && !(getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL')}
                        placeHolder="Departure Date"
                        disabledate={disableDate_deployment}
                        rendered={rendered}
                        notValidMsg={'Departure Date Required'}
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
                        receive={(e) => updateAppDetails({ name: 'YrsOfwSeafarer', value: e })}
                        showSearch={true}
                        optionFilterProp="children"
                        filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        rendered={rendered}
                        data={generateYearOptions(50)}
                    />)}
                {User === 'Credit' && (data.loanProd === '0303-VA' || data.loanProd === '0303-VL') && (
                    <>
                        <InputOpt
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>Name of Vessel <span className="text-red-500">*</span></>}
                            placeHolder='Name of Vessel'
                            readOnly={isEdit}
                            value={data.VesselName}
                            receive={(e) => updateAppDetails({ name: 'VesselName', value: e })}
                            category={'direct'}
                            rendered={rendered}

                            KeyName={'VesselName'}
                            group={'Uppercase'}
                            compname={'Name of Vessel'}
                        />
                        <InputOpt
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>IMO Vessel <span className="text-red-500">*</span></>}
                            placeHolder='IMO Vessel'
                            readOnly={isEdit}
                            value={data.VesselIMO}
                            receive={(e) => updateAppDetails({ name: 'VesselIMO', value: e })}
                            category={'direct'}
                            rendered={rendered}

                            KeyName={'VesselIMO'}
                            group={'Uppercase'}
                            compname={'IMO Vessel'}
                        />
                        {data.VesselIMO && (
                            <div className="mt-8">
                                <label className="font-bold block">Information of the Vessel</label>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Input: {
                                                controlHeight: 100,
                                            },
                                        },
                                    }}
                                >
                                    <TextArea
                                        className="w-[920px] h-[70vh] p-1 border border-gray-300 rounded-md resize-none"
                                        value={data.VesselInfo}
                                        onChange={(e) => updateAppDetails({ name: 'VesselInfo', value: e.target.value })}
                                        style={{
                                            resize: 'none',
                                        }}
                                    // readOnly={!isEdit}
                                    />
                                </ConfigProvider>
                            </div>
                        )}
                        <InputOpt
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>Type of Vessel <span className="text-red-500">*</span></>}
                            placeHolder='Type of Vessel'
                            readOnly={isEdit}
                            value={data.VesselType}
                            receive={(e) => updateAppDetails({ name: 'VesselType', value: e })}
                            category={'direct'}
                            rendered={rendered}

                            KeyName={'VesselType'}
                            group={'Uppercase'}
                            compname={'Type of Vessel'}
                        />

                    </>
                )}
                {User === 'Credit' && data.loanProd === '0303-VA' && (
                    <InputOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Exact Location'}
                        placeHolder='Exact Location'
                        readOnly={isEdit}
                        value={data.ExactLocation}
                        receive={(e) => updateAppDetails({ name: 'ExactLocation', value: e })}
                        category={'marketing'}
                        required={false}

                        KeyName={'ExactLocation'}
                        group={'Uppercase'}
                        compname={'Exact Location'}
                    />)}
                {User === 'Credit' && data.loanProd === '0303-WA' && (
                    <InputOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Possible Vacation'}
                        placeHolder='Possible Vacation'
                        readOnly={isEdit}
                        value={data.PossVacation}
                        receive={(e) => updateAppDetails({ name: 'PossVacation', value: e })}
                        category={'marketing'}
                        required={false}

                        KeyName={'PossVacation'}
                        group={'Uppercase'}
                        compname={'Possible Location'}
                    />)}
                {User === 'Credit' && (
                    <InputOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={<>Beneficiary or Allotment Name <span className="text-red-500">*</span></>}
                        placeHolder='Allotment Name'
                        readOnly={isEdit}
                        value={data.AllotName}
                        receive={(e) => updateAppDetails({ name: 'AllotName', value: e })}
                        category={'direct'}
                        rendered={rendered}

                        KeyName={'AllotName'}
                        group={'Uppercase'}
                        compname={'Beneficiary or Allotment Name'}
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
                    <InputOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label="font-bold"
                        value={data.AllotAmount}
                        receive={(e) => updateAppDetails({ name: 'AllotAmount', value: e })}
                        label={<>Remittance or Allotment Amount <span className="text-red-500">*</span></>}
                        placeHolder={'Amount'}
                        category={'marketing'}
                        rendered={rendered}

                        format='Currency'
                        KeyName={'AllotAmount'}
                        group={'Allotment'}
                        compname={'Remittance/Allotment Amount'}
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
                        receive={(e) => updateAppDetails({ name: 'AllotChannel', value: e })}
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
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Highest Educational Attainment <span className="text-red-500">*</span></>}
                            placeHolder='Highest Educational Attainment'
                            disabled={isEdit}
                            data={EducationalAttainment()}
                            value={data.ofwHighestEdu}
                            receive={(e) => updateAppDetails({ name: 'ofwHighestEdu', value: e })}
                            rendered={rendered}
                            showSearch={!isEdit}
                        />
                        <InputOpt
                            className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={'Course'}
                            placeHolder='Course'
                            disabled={isEdit}
                            value={data.ofwcourse}
                            receive={(e) => { updateAppDetails({ name: 'ofwcourse', value: e }); }}
                            readOnly={isEdit}
                            required={false}

                            KeyName={'ofwcourse'}
                            group={'Uppercase'}
                            compname={'Course'}
                        /> </>)}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={'mt-5 xs1:mt-2 2xl:mt-5 w-[18.75rem] h-[3.875rem]'}
                        className_label={'font-bold'}
                        label={'School'}
                        placeHolder='School'
                        readOnly={isEdit}
                        value={data.ofwschool}
                        receive={(e) => updateAppDetails({ name: 'ofwschool', value: e })}
                        category={'marketing'}
                        required={false}

                        KeyName={'ofwschool'}
                        group={'Uppercase'}
                        compname={'School'}
                    />)}
            </Flex>
        </div>
    );
}

export default EditOfwDetails;