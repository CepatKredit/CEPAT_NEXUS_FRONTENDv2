import React, { useContext, useEffect, useState } from 'react';
import { Flex, notification, Checkbox, Input, Form, ConfigProvider } from 'antd';
import LabeledInput_OfwContact from '@components/marketing/LabeledInput_OfwContact';
import {
    MaritalStatus, Residences, Gender, EducationalAttainment, JobCategory, JobTitle,
    EmploymentStatus, SpouseSourceIncome, Overseas, Religion, AllotChannel
} from '@utils/FixedData';
import LabeledInput_Numeric from '@components/marketing/LabeledInput_Numeric'
import SectionHeader from '@components/validation/SectionHeader';
import AddressGroup_Component from '@components/marketing/AddressGroup_Component';
import LabeledInput_LengthStay from '@components/marketing/LabeledInput_LengthStay';
import LabeledSelectAgency from '@components/marketing/LabeledSelectAgency';
import dayjs from 'dayjs';
import LabeledSelect_CollectionArea from '@components/marketing/LabeledSelect_CollectionArea';
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
import { removeLinkFormat } from '@utils/Formatting';


function EditOfwDetails({ data, receive, presaddress, User, RelativesCount, BorrowerId, addCoborrower }) {
    const { Count } = useStore(getDependentsCount);
    const [isEdit, setEdit] = React.useState(false);
    const { TextArea } = Input;
    const [api, contextHolder] = notification.useNotification();
    const [relativesCount, setRelativesCount] = useState(0);
    const { getAppDetails, updateAppDetails, setBenDependents, showBenDependents } = useContext(LoanApplicationContext)
    /*
        useEffect(() => {
            if (getAppDetails.MarriedPBCB !== undefined || !getAppDetails.MarriedPBCB) {
                // Set the state of setBenDependents based on the value of MarriedPBCB
                setBenDependents(getAppDetails.MarriedPBCB === 0); // true if 0 (unchecked), false if 1 (checked)
            }
            //console.log('hahahahahaha', getAppDetails.MarriedPBCB)
        }, [getAppDetails.MarriedPBCB]);*/

    const disableDate_deployment = React.useCallback((current) => {
        return current && current < dayjs().startOf('day');
    }, []);

    const [getAge, setAge] = useState(getAppDetails.ofwbdate ? Age(getAppDetails.ofwbdate) : 0)

    const rendered = true;
    function generateYearOptions(maxYears) {
        const options = [];
        for (let i = 1; i <= maxYears; i++) {
            options.push({ label: i.toString(), value: i });
        }
        return options;
    }

    const handleDoubleClick = (() => {
        let clickCount = 0;
        return (e) => {
            if (!isEdit && getAppDetails.ofwfblink) {
                e.preventDefault();
                clickCount++;
                setTimeout(() => {
                    if (clickCount >= 2) {
                        window.open(`https://www.facebook.com/${getAppDetails.ofwfblink}`, '_blank');
                    }
                    clickCount = 0; // Reset click count after handling
                }, 300); // Adjust timeout for double-click detection
            }
        };
    })();
    useEffect(() => {
        if (getAppDetails.ofwresidences !== 3 || getAppDetails.ofwresidences !== 2) {
            updateAppDetails({ name: 'ofwrent', value: '0' });
        }
    }, [getAppDetails.ofwresidences]);

    const { GET_COUNTRY_LIST, GET_RELATIONSHIP_LIST, GET_OFW_SUFFIX, GET_SEABASED_JOBCATEGORY, GET_JOB_CATEGORY, GET_JOB_POSITION, GET_VALID_ID_LIST } = useDataContainer();

    const get_country_list = GET_COUNTRY_LIST?.map(x => ({ value: x.code, label: x.description, negative: x.isNegative, name: x.description })) || [];
    const GET_RELATIONSHIP = GET_RELATIONSHIP_LIST?.map(x => ({ value: x.code, label: x.description })) || [];
    //const JOB_CATEGORY = JobCategory()?.map(x => ({ value: x.value, label: typeof x.label === 'string' ? x.label.toUpperCase() : x.label }))
    const JOB_CATEGORY = GET_JOB_CATEGORY?.map(x => ({ label: x.name, value: x.code, })) || [];
    //const JOB_TITLE = JobTitle(getAppDetails.JobCategory) ? JobTitle(getAppDetails.JobCategory)?.map(x => ({ value: x.value, label: typeof x.label === 'string' ? x.label.toUpperCase() : x.label })) : [];
    const OFW_SUFFIX = GET_OFW_SUFFIX?.map(x => ({ label: x.description, value: x.code, })) || [];
    const JOB_SEABASED_CATEGORY = GET_SEABASED_JOBCATEGORY?.map(x => ({ label: x.name, value: x.code, })) || [];
    const JOB_POSITION = GET_JOB_POSITION?.map(x => ({ label: x.name, value: x.code, })) || [];
    const VALID_ID = GET_VALID_ID_LIST?.map(x => ({ label: x.name, value: x.id, })) || [];

    //Shortening For Disabling Fields
    let OFW_IS_PRIM = getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL'

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
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>First Name <span className="text-red-500">*</span></>}
                    value={getAppDetails.ofwfname}
                    placeHolder='First Name'
                    receive={(e) => updateAppDetails({ name: 'ofwfname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'ofwfname'}
                    format={'Default'}
                    group={'Uppercase'}
                    compname={'First Name'}
                    EmptyMsg={'First Name Required'}
                    InvalidMsg={'Invalid First Name'}
                />
                <InputOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={User === 'Credit' ? (<>Middle Name <span className="text-red-500">*</span></>) : 'Middle Name'}
                    value={getAppDetails.ofwmname}
                    placeHolder='Middle Name'
                    receive={(e) => updateAppDetails({ name: 'ofwmname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={false}

                    KeyName={'ofwmname'}
                    format={'Default'}
                    group={'Uppercase'}
                    compname={'Middle Name'}

                    InvalidMsg='Invalid Middle Name'
                    EmptyMsg='Middle Name Required'

                    required={User === 'Credit' ? true : false}

                //EmptyMsg={'First Name Required'}
                //InvalidMsg={'Invalid First Name'}
                />
                <InputOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Last Name <span className="text-red-500">*</span></>}
                    value={getAppDetails.ofwlname}
                    placeHolder='Last Name'
                    receive={(e) => updateAppDetails({ name: 'ofwlname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}

                    KeyName={'ofwlname'}
                    format={'Default'}
                    group={'Uppercase'}
                    compname={'Last Name'}

                    EmptyMsg={'Last Name Required'}
                    InvalidMsg={'Invalid Last Name'}
                />
                <SelectOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Suffix <span className="text-red-500">*</span></>}
                    value={getAppDetails.ofwsuffix}
                    rendered={rendered}
                    showSearch
                    receive={(e) => updateAppDetails({ name: 'ofwsuffix', value: e })}
                    options={OFW_SUFFIX}

                    EmptyMsg={'Suffix Required'}
                    InvalidMsg={'Invalid Suffix'}
                    KeyName={'ofwsuffix'}
                    group={'Default'}
                    compname={'Suffix'}

                />

                <DatePickerOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Birthdate <span className="text-red-500">*</span></>}
                    placeHolder='Enter Birthdate'
                    receive={(e) => {
                        updateAppDetails({ name: 'ofwbdate', value: e });
                        setAge(Age(e))
                    }}
                    value={getAppDetails.ofwbdate}
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}

                    EmptyMsg={'Birthdate Required'}
                    InvalidMsg={'Invalid Birthdate'}
                    KeyName={'ofwbdate'}
                    group={'AgeLimit20'}
                    compname={'Birthdate'}

                />
                {User === 'Credit' && (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={'Age'}
                        value={getAge ? getAge : 0}
                        placeHolder='select Birthdate'
                        receive={(e) => setAge(e || 0)}
                        category={'marketing'}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}
                        readOnly={true}

                        KeyName={'age'}
                        format={'Default'}
                        group={'Uppercase'}
                        compname={'Age'}

                    //EmptyMsg={'Age Required'}
                    //InvalidMsg={'Invalid Age'}
                    />
                )}
                <SelectOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Gender <span className="text-red-500">*</span></>}
                    value={getAppDetails.ofwgender}
                    rendered={rendered}
                    showSearch
                    receive={(e) => updateAppDetails({ name: 'ofwgender', value: e })}
                    options={Gender()}

                    EmptyMsg={'Gender Required'}
                    InvalidMsg={'Invalid Gender'}
                    KeyName={'ofwgender'}
                    group={'Default'}
                    compname={'Gender'}
                />

                <LabeledInput_OfwContact
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Mobile Number <span className="text-red-500">*</span></>}
                    placeHolder='Mobile Number'
                    data={getAppDetails}
                    value={getAppDetails.ofwmobile}
                    receive={(e) => updateAppDetails({ name: 'ofwmobile', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                />
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_OfwContact
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={'Other Mobile Number'}
                        placeHolder='Other Mobile Number'
                        data={getAppDetails}
                        value={getAppDetails.ofwothermobile}
                        receive={(e) => updateAppDetails({ name: 'ofwothermobile', value: e })}
                        category={'marketing'}
                        type='contact'
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}
                    />)}
                <InputOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Email Address <span className="text-red-500">*</span></>}
                    placeHolder='Email Address'
                    value={getAppDetails.ofwemail}
                    receive={(e) => updateAppDetails({ name: 'ofwemail', value: e })}
                    category={'marketing'}
                    isEdit={isEdit}
                    rendered={rendered}

                    KeyName={'ofwemail'}
                    format={'Default'}
                    group={'Email'}
                    compname={'Email'}

                    EmptyMsg={'Email Required'}
                    InvalidMsg={'Invalid Email'}

                />
                {User === 'Credit' ? (<>
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        className_component={`w-full p-2 border rounded-lg border-gray-300 ${!isEdit && getAppDetails.ofwfblink
                            ? 'text-blue-500 underline'
                            : 'text-black'
                            }`}
                        label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeholder="Facebook Name / Profile"
                        value={`https://www.facebook.com/${removeLinkFormat(getAppDetails.ofwfblink)}`}//just in case to remove existing data
                        receive={(e) => updateAppDetails({ name: 'ofwfblink', value: e.slice(25) })}
                        category={'marketing'}
                        rendered={rendered}
                        onClick={handleDoubleClick}

                        KeyName={'ofwfblink'}
                        format={'Http'}
                        group={'FBLink'}
                        compname={'Facebook Name / Profile'}

                        EmptyMsg={'Facebook Name / Profile Required'}
                        InvalidMsg={'Invalid Facebook Name / Profile'}
                    /></>

                ) : (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeHolder='Facebook Name / Profile'
                        isEdit={isEdit}
                        category={'marketing'}
                        readOnly={isEdit}
                        rendered={rendered}
                        value={removeLinkFormat(getAppDetails.ofwfblink)}
                        receive={(e) => {
                            const formattedValue = e.includes('https://www.facebook.com/') ? e : `https://www.facebook.com/${e}`;
                            updateAppDetails({ name: 'ofwfblink', value: formattedValue })
                        }}

                        KeyName={'ofwfblink'}
                        group={'Default'}
                        compname={'Facebook Name / Profile'}

                        InvalidMsg='Invalid Facebook Name/Profile'
                        EmptyMsg='Facebook Name/Profile Required'
                    />

                )}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Group Chat (Name or URL) <span className="text-red-500">*</span></>}
                        placeHolder='Group Chat'
                        value={getAppDetails.ofwgroupchat}
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
                        value={getAppDetails.benrelationship}
                        rendered={rendered}
                        placeHolder='Relationship to Additional'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'RelationshipAdd', value: e })}
                        options={GET_RELATIONSHIP}

                        EmptyMsg={'Relationship to Additional Required'}
                        InvalidMsg={'Invalid Relationship to Additional'}
                        KeyName={'RelationshipAdd'}
                        group={'Default'}
                        compname={'Relationship to Additional'}
                        showSearch
                    />

                )}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label='font-bold'
                        label={<>Religion <span className="text-red-500">*</span></>}
                        value={getAppDetails.Religion}
                        rendered={rendered}
                        placeHolder='Religion'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'Religion', value: e })}
                        options={Religion()}

                        EmptyMsg={'Religion Required'}
                        InvalidMsg={'Invalid Religion'}
                        KeyName={'Religion'}
                        group={'Default'}
                        compname={'Religion'}
                        showSearch
                    />

                )}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>PEP <span className="text-red-500">*</span></>}
                        value={getAppDetails.PEP}
                        rendered={rendered}
                        placeHolder='PEP'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'PEP', value: e })}
                        options={Overseas()}

                        EmptyMsg={'PEP Required'}
                        InvalidMsg={'Invalid PEP'}
                        KeyName={'PEP'}
                        group={'Default'}
                        compname={'PEP'}
                        showSearch
                    />

                )}
                <SelectOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Marital Status <span className="text-red-500">*</span></>}
                    value={getAppDetails.ofwmstatus}
                    rendered={rendered}
                    placeHolder='Marital Status'
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    receive={(e) => updateAppDetails({ name: 'ofwmstatus', value: e })}
                    options={MaritalStatus()}

                    EmptyMsg={'Marital Status Required'}
                    InvalidMsg={'Invalid Marital Status'}
                    KeyName={'ofwmstatus'}
                    group={'Default'}
                    compname={'Marital Status'}
                />

                {OFW_IS_PRIM ? (
                    User === 'Credit' || User === 'MARKETING') && (getAppDetails.ofwmstatus === 2 || getAppDetails.ofwmstatus === 5 || getAppDetails.ofwmstatus === 6) && (
                        <div className="mt-12 w-[18.75rem] h-[3.875rem] flex items-center">
                            <Checkbox
                                checked={getAppDetails.MarriedPBCB}
                                onClick={() => {
                                    const newValue = !getAppDetails.MarriedPBCB;
                                    updateAppDetails({ name: 'MarriedPBCB', value: !getAppDetails.MarriedPBCB });
                                    //setBenDependents(false); //Turning on will have conflicts in re-trigger in PBCB Trigger Fields
                                    //setBenDependents(!newValue); //Turning on will have conflicts in re-trigger in PBCB Trigger Fields
                                }}
                                disabled={isEdit}
                            >
                                If the PB and CB are married to each other
                            </Checkbox>
                        </div>
                    ) : (<></>)
                }
                {(getAppDetails.ofwmstatus === 2 || getAppDetails.ofwmstatus === 5 || getAppDetails.ofwmstatus === 6) && (
                    User !== 'LC' && (
                        <>
                            <InputOpt
                                className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                    } w-[18.75rem] h-[3.875rem]`}
                                className_label={'font-bold'}
                                label={<>Spouse Name <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Name'
                                readOnly={isEdit}
                                receive={(e) => updateAppDetails({ name: 'ofwspouse', value: e })}
                                value={getAppDetails.ofwspouse}
                                isEdit={isEdit}
                                rendered={rendered}
                                disabled={User === 'Credit' && OFW_IS_PRIM && getAppDetails.MarriedPBCB}
                                KeyName={'ofwspouse'}
                                group={'Uppercase'}
                                compname={'Spouse Name'}
                            />

                            <DatePickerOpt
                                className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                    } w-[18.75rem] h-[3.875rem]`}
                                className_label={'font-bold'}
                                label={<>Spouse Birthdate <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Birthdate'
                                receive={(e) => updateAppDetails({ name: 'ofwspousebdate', value: e })}
                                value={getAppDetails.ofwspousebdate}
                                isEdit={isEdit}
                                rendered={rendered}
                                disabled={User === 'Credit' && OFW_IS_PRIM && getAppDetails.MarriedPBCB}
                                category={'marketing'}

                                KeyName={'ofwspousebdate'}
                                EmptyMsg={'Birthdate Required'}
                                InvalidMsg={'Invalid Birthdate'}
                                group={'AgeLimit20'}
                                compname={'Birthdate'}
                            />
                            {User === 'Credit' && (
                                <SelectOpt
                                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                        } w-[18.75rem] h-[3.875rem]`}
                                    className_label={'font-bold'}
                                    label={<>Spouse Source of Income <span className="text-red-500">*</span></>}
                                    value={getAppDetails.SpSrcIncome}
                                    rendered={rendered}
                                    placeHolder='Spouse Source of Income'
                                    category={'marketing'}
                                    disabled={isEdit}
                                    isEdit={isEdit}
                                    receive={(e) => updateAppDetails({ name: 'SpSrcIncome', value: e })}
                                    options={SpouseSourceIncome()}

                                    EmptyMsg={'Spouse Source of Income Required'}
                                    InvalidMsg={'Invalid Spouse Source of Income'}
                                    KeyName={'SpSrcIncome'}
                                    group={'Default'}
                                    compname={'Spouse Source of Income'}
                                    required={false}
                                />)}
                            {User === 'Credit' && (
                                <InputOpt
                                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                        } w-[18.75rem] h-[3.875rem]`}
                                    className_label={'font-bold'}
                                    label={'Spouse Income'}
                                    placeHolder='Spouse Income'
                                    readOnly={isEdit}
                                    value={getAppDetails.SpIncome}
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
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Relationship to the Beneficiary <span className="text-red-500">*</span></>}
                        value={getAppDetails.RelationshipBen}
                        rendered={rendered}
                        placeHolder='Relationship to the Beneficiary'
                        category={'marketing'}
                        disabled={getAppDetails.MarriedPBCB}
                        showSearch
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'RelationshipBen', value: e })}
                        options={GET_RELATIONSHIP}

                        EmptyMsg={'Relationship to the Beneficiary Required'}
                        InvalidMsg={'Invalid Relationship to the Beneficiary'}
                        KeyName={'RelationshipBen'}
                        group={'Default'}
                        compname={'Relationship to the Beneficiary'}
                    />
                    )}
                {/*User !== 'LC' && (
                    <Form.Item
                        label="Dependents"
                        colon={false}
                        wrapperCol={{ span: 24 }}
                        className="w-[18.75rem] mt-4 font-bold"
                    >
                        <Input
                            value={getAppDetails.ofwdependents || '0'}
                            className="h-[2.5rem] border border-gray-300 rounded-lg mt-[-.3rem]"
                            disabled
                            placeholder="No. of Dependents"
                        />
                    </Form.Item>
                )*/}
                {/*User === 'LC'*/ true && (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' :'mt-10 '
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={"Dependents"}
                        placeHolder='Dependents'
                        readOnly={isEdit}
                        value={getAppDetails.ofwdependents || '0'}
                        receive={(e) => { updateAppDetails({ name: 'ofwdependents', value: e }); }}
                        category={'marketing'}
                        rendered={rendered}
                        KeyName={'ofwdependents'}
                        format={'2_Digit'}
                        group={'Default'}
                        compname={'Dependents'}
                        required={false}
                    />

                )}
                {User !== 'LC' && (
                    <div className="w-full mt-[2rem] mx-auto">
                        <RelativesTable BorrowerId={BorrowerId} onUpdateCount={(count) => setRelativesCount(count)} data={getAppDetails} isOfw={1} />
                    </div>
                )}

            </Flex>

            <div className={`${User === 'LC' ? 'mt-[2rem]' : 'mt-[13rem]'}`}>
                <SectionHeader title="Present Address" />
            </div>
            <Flex className='w-full' justify='center' gap='small' wrap>
                <AddressGroup_Component
                    api={api}
                    data={getAppDetails}
                    receive={(e) => updateAppDetails(e)}
                    presaddress={(e) => presaddress(e)}
                    type={"present"}
                    disabled={isEdit}
                    category={"marketing"}
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'}  w-full xs:w-[18.75rem] sm:w-[18.75rem] md:w-[18.75rem] lg:w-[18.75rem] xl:w-[18.75rem] ${User === 'Credit' || User === 'Lp' ? '2xl:w-[16.75rem]' : '2xl:w-[18.75rem]'} 3xl:w-[20.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    vertical_algin={true}
                    rendered={rendered}
                />
                <SelectOpt
                    className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                        } w-[18.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    label={<>Type of Residence <span className="text-red-500">*</span></>}
                    placeHolder='Type of Residence'
                    value={getAppDetails.ofwresidences}
                    rendered={rendered}
                    category={'marketing'}
                    showSearch
                    isEdit={isEdit}
                    receive={(e) => updateAppDetails({ name: 'ofwresidences', value: e })}
                    options={Residences()}

                    EmptyMsg={'Type of Residence Required'}
                    InvalidMsg={'Invalid Type of Residence'}
                    KeyName={'ofwresidences'}
                    group={'Default'}
                    compname={'Type of Residence'}
                />

                {getAppDetails.ofwresidences === 3 || getAppDetails.ofwresidences === 2 ? (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>{getAppDetails.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}<span className="text-red-500"> *</span></>}
                        value={getAppDetails.ofwrent}
                        receive={(e) => {
                            if (getAppDetails.ofwresidences === 3 || getAppDetails.ofwresidences === 2) {
                                updateAppDetails({ name: 'ofwrent', value: e });
                            }
                        }}
                        category={'direct'}
                        placeHolder={getAppDetails.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                        rendered={rendered}
                        KeyName={'ofwrent'}
                        format={'Currency'}
                        group={'Rent_Amort'}
                        compname={getAppDetails.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                        EmptyMsg={getAppDetails.ofwresidences === 3 ? 'Rent Amount Required' : 'Monthly Amortization Required'}
                        InvalidMsg={getAppDetails.ofwresidences === 3 ? 'Invalid Rent Amount' : 'Invalid Monthly Amortization'}
                    />
                ) : null}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
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
                        EmptyMsg='Landmark Required'
                        InvalidMsg='Invalid Landmark'

                    />)}
                {User === 'Credit' && (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                        placeHolder='Proof of Billing Remarks'
                        isEdit={isEdit}
                        category={'marketing'}
                        readOnly={isEdit}
                        rendered={rendered}
                        value={getAppDetails.OfwPoBRemarks}
                        receive={(e) => updateAppDetails({ name: 'OfwPoBRemarks', value: e })}

                        KeyName={'OfwPoBRemarks'}
                        group={'Uppercase'}
                        compname={'Proof of Billing Remarks'}
                        EmptyMsg='Proof of Billing Remarks Required'
                        InvalidMsg='Invalid Proof of Billing Remarks'
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledInput_LengthStay
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Length of Stay <span className="text-red-500">*</span></>}
                        disabled={isEdit}
                        category={'marketing'}
                        value_year={getAppDetails.ofwlosYear}
                        value_month={getAppDetails.ofwlosMonth}
                        receiveY={(e) => updateAppDetails({ name: 'ofwlosYear', value: e })}
                        receiveM={(e) => updateAppDetails({ name: 'ofwlosMonth', value: e })}
                        rendered={rendered}
                    />)}
                {User === 'LC'
                    ? (<></>)
                    : (<LabeledSelect_CollectionArea
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={'Collection Area'}
                        placeHolder='Collection Area'
                        category={'marketing'}
                        showSearch={true}
                        readOnly={isEdit}
                        value_prov={getAppDetails.ofwPresProv}
                        value_mun={getAppDetails.ofwPresMunicipality}
                        value={getAppDetails.collectionarea}
                        get_presprov={getAppDetails.ofwPresProv}
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
                        data={getAppDetails}
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
                        data={getAppDetails}
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
                    : (
                        <SelectOpt
                            className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'Valid ID Type'}
                            placeHolder='Valid ID Type'
                            value={getAppDetails.ofwvalidid}
                            rendered={rendered}
                            category={'marketing'}
                            showSearch
                            isEdit={isEdit}
                            receive={(e) => updateAppDetails({ name: 'ofwvalidid', value: e })}
                            options={VALID_ID}
                            required={false}


                            EmptyMsg={'Valid ID Type Required'}
                            InvalidMsg={'Invalid Valid ID Type'}
                            KeyName={'ofwvalidid'}
                            group={'Default'}
                            compname={'Valid ID Type'}
                        />
                    )}
                {User === 'LC'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={'ID Number'}
                        placeHolder='ID type Number'
                        readOnly={isEdit}
                        receive={(e) => updateAppDetails({ name: 'ofwidnumber', value: e })}
                        value={getAppDetails.ofwidnumber}
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
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10 2xl:mt-5 3xl:mt-5'} w-[18.75rem] h-[3.875rem] mt-[-0.1rem]`}
                        className_label={'font-bold'}
                        label={<>Country of Employment for OFW or Joining Port for SEAFARER <span className="text-red-500">*</span></>}
                        placeHolder='Country'
                        disabled={isEdit}
                        category={'marketing'}
                        value={getAppDetails.ofwcountry}
                        receive={(e) => updateAppDetails({ name: 'ofwcountry', value: e })}
                        rendered={rendered}
                        showSearch
                        options={get_country_list}

                        EmptyMsg={'Relationship to the Beneficiary Required'}
                        InvalidMsg={'Invalid Relationship to the Beneficiary'}
                        KeyName={'ofwcountry'}
                        group={'WithNegative'}
                        compname={'Relationship to the Beneficiary'}
                    />)}
                {User === 'LC' ? (
                    <></>
                ) : (
                    User === 'Credit' ? (

                        <SelectOpt
                            className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={<>Job Category <span className="text-red-500">*</span></>}
                            value={getAppDetails.JobCategory}
                            rendered={rendered}
                            placeHolder='Job Category'
                            category={'marketing'}
                            disabled={isEdit}
                            isEdit={isEdit}
                            receive={(e) => updateAppDetails({ name: 'JobCategory', value: e })}
                            options={getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-VA' ? JOB_SEABASED_CATEGORY : JOB_CATEGORY}
                            showSearch

                            EmptyMsg={'Job Category Required'}
                            InvalidMsg={'Invalid Job Category'}
                            KeyName={'JobCategory'}
                            group={'Default'}
                            compname={'Job Category'}
                        />
                    ) : (
                        <InputOpt
                            className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={<>Job Title / Position <span className="text-red-500">*</span></>}
                            placeHolder='ID type Number'
                            readOnly={isEdit}
                            receive={(e) => updateAppDetails({ name: 'ofwjobtitle', value: e })}
                            value={getAppDetails.ofwjobtitle}
                            isEdit={isEdit}
                            rendered={rendered}
                            required={false}

                            KeyName={'ofwjobtitle'}
                            group={'Uppercase'}
                            compname={'Job Title / Position'}
                        />
                    ))}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Position <span className="text-red-500">*</span></>}
                        value={getAppDetails.ofwjobtitle}
                        rendered={rendered}
                        placeHolder='Position'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'ofwjobtitle', value: e })}
                        options={JOB_POSITION}
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
                    <SelectOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Employment Status <span className="text-red-500">*</span></>}
                        value={getAppDetails.EmpStatus}
                        rendered={rendered}
                        placeHolder='Position'
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'EmpStatus', value: e })}
                        options={EmploymentStatus()}
                        notValidMsg={'Position Required'}
                        KeyName={'EmpStatus'}
                        group={'Default'}
                        showSearch

                        EmptyMsg={'Position Required'}
                        InvalidMsg={'Invalid Position'}
                        compname={'Position'}
                    />
                )}
                {User === 'Credit' && (getAppDetails.loanProd === '0303-WA' || getAppDetails.loanProd === '0303-WL' || getAppDetails.loanProd === '0303-VA' || getAppDetails.loanProd === '0303-VL') && (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Principal Employer <span className="text-red-500">*</span></>}
                        placeHolder='Principal Employer'
                        readOnly={isEdit}
                        value={getAppDetails.PEmployer}
                        receive={(e) => updateAppDetails({ name: 'PEmployer', value: e })}
                        rendered={rendered}

                        KeyName={'PEmployer'}
                        group={'Uppercase'}
                        compname={'Principal Employer'}
                    />)}
                {(User !== 'Credit' || (User === 'Credit' && (getAppDetails.loanProd === '0303-WA' || getAppDetails.loanProd === '0303-WL' || getAppDetails.loanProd === '0303-VA' || getAppDetails.loanProd === '0303-VL'))) && (
                    User === 'LC'
                        ? (<></>)
                        : (
                            <LabeledSelectAgency
                                className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                    } w-[18.75rem] h-[3.875rem]`}
                                className_label={'font-bold'}
                                label={<>{User === 'Credit' ? 'Agency' : 'Company/ Employer / Agency Name'} <span className="text-red-500"> *</span></>}
                                placeHolder={User === 'Credit' ? 'Agency Name' : 'Company/ Employer / Agency Name'}
                                showSearch
                                filterOption={(input, option) =>
                                    option?.label?.toString().toLowerCase().includes(input.toLowerCase())}
                                disabled={isEdit}
                                readOnly={User === 'Credit' ? isEdit : false}
                                value={getAppDetails.ofwcompany}
                                receive={(e) => updateAppDetails({ name: 'ofwcompany', value: e })}
                                rendered={rendered}
                            />))}
                {User === 'Credit' && (
                    <LabeledInput_ForeignCurrency
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Salary in Foreign Currency <span className="text-red-500">*</span></>}
                        placeHolder='Foreign Salary'
                        data={getAppDetails}
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
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Salary <span className="text-red-500">*</span></>}
                        placeHolder='Salary'
                        readOnly={isEdit}
                        value={getAppDetails.ofwsalary}
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
        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10' 
                        } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'Agency Address'}
                            placeHolder='Agency Address'
                            readOnly={isEdit}
                            value={data.agencyaddress}
                            receive={(e) => receive({ name: 'agencyaddress', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10' 
                        } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'License Validity'}
                            placeHolder='License Validity'
                            readOnly={isEdit}
                            value={data.license}
                            receive={(e) => receive({ name: 'license', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10' 
                        } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'Status'}
                            placeHolder='Status'
                            readOnly={isEdit}
                            value={data.ofwstatus}
                            receive={(e) => receive({ name: 'ofwstatus', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10' 
                        } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'Contact Person'}
                            placeHolder='Contact Person'
                            readOnly={isEdit}
                            value={data.contactper}
                            receive={(e) => receive({ name: 'ofwstatus', value: e })}
                        />)}
                    {User === 'Credit' && (
                        <LabeledInput
        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10' 
                        } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'Designation'}
                            placeHolder='Designation'
                            readOnly={isEdit}
                            value={data.landmark}
                            receive={(e) => receive({ name: 'landmark', value: e })}
                        />)*/}
                {User === 'Credit' && (
                    <DatePickerOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Contract Date <span className="text-red-500">*</span></>}
                        placeHolder='Contract Date'
                        receive={(e) => updateAppDetails({ name: 'ContractDate', value: e })}
                        value={getAppDetails.ContractDate}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}

                        KeyName={'ContractDate'}
                        group={'Default'}
                        compname={'Contract Date'}
                        EmptyMsg={'Contract Date Required'}
                        InvalidMsg={'Invalid Contract Date'}

                    />)}
                {User === 'Credit' && (<>
                    <LabeledInput_Numeric
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={<>Contract Duration <span className="text-red-500">*</span></>}
                        rendered={rendered}
                        receive={(e) => updateAppDetails({ name: 'ContractDuration', value: e })}
                        value={getAppDetails.ContractDuration}
                        placeHolder={'No. of Months'}
                        category={'marketing'}
                        digits={2}
                    />

                </>)}
            </Flex>
            {(User === 'Credit' && (getAppDetails.loanProd !== '0303-VA' && getAppDetails.loanProd !== '0303-VL')) && (
                <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6 flex justify-center items-center mt-8">
                        <Checkbox
                            disabled={isEdit}
                            checked={getAppDetails.UnliContract}
                            onChange={() => {
                                updateAppDetails({
                                    name: 'UnliContract',
                                    value: !getAppDetails.UnliContract,
                                });
                            }} />
                        <label className="ml-2 font-bold">Unlimited Contract</label>
                    </div>
                </div>)}
            <Flex className='w-full' justify='center' gap='small' wrap>

                {(User === 'Credit' && (getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL')) && (
                    <DatePickerOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={<>OFW Departure Date <span className="text-red-500">*</span></>}
                        value={getAppDetails.ofwDeptDate}
                        receive={(e) => { updateAppDetails({ name: 'ofwDeptDate', value: e }) }}
                        //disabled={!isEdit && !(getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL')}
                        placeHolder="Departure Date"
                        disabledate={disableDate_deployment}
                        rendered={rendered}

                        KeyName={'ofwDeptDate'}
                        EmptyMsg={'OFW Departure Date Required'}
                        InvalidMsg={'Invalid OFW Departure Date'}
                        group={'TodayOnward'}
                        compname={'OFW Departure Date'}
                    />)}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={<>Years as OFW or Seafarer <span className="text-red-500">*</span></>}
                        placeHolder='Years as OFW or Seafarer'
                        value={getAppDetails.YrsOfwSeafarer}
                        rendered={rendered}
                        category={'marketing'}
                        showSearch
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'YrsOfwSeafarer', value: e })}
                        options={generateYearOptions(50)}

                        EmptyMsg={'Years as OFW or Seafarer Required'}
                        InvalidMsg={'Invalid Years as OFW or Seafarer'}
                        KeyName={'YrsOfwSeafarer'}
                        group={'Default'}
                        compname={'Years as OFW or Seafarer'}
                    />
                )}
                {User === 'Credit' && (getAppDetails.loanProd === '0303-VA' || getAppDetails.loanProd === '0303-VL') && (
                    <>
                        <InputOpt
                            className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                            className_label={'font-bold'}
                            label={<>Name of Vessel <span className="text-red-500">*</span></>}
                            placeHolder='Name of Vessel'
                            readOnly={isEdit}
                            value={getAppDetails.VesselName}
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
                            value={getAppDetails.VesselIMO}
                            receive={(e) => updateAppDetails({ name: 'VesselIMO', value: e })}
                            category={'direct'}
                            rendered={rendered}

                            KeyName={'VesselIMO'}
                            group={'Uppercase'}
                            compname={'IMO Vessel'}
                        />
                        {getAppDetails.VesselIMO && (
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
                                        value={getAppDetails.VesselInfo}
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
                            value={getAppDetails.VesselType}
                            receive={(e) => updateAppDetails({ name: 'VesselType', value: e })}
                            category={'direct'}
                            rendered={rendered}

                            KeyName={'VesselType'}
                            group={'Uppercase'}
                            compname={'Type of Vessel'}
                        />

                    </>
                )}
                {User === 'Credit' && getAppDetails.loanProd === '0303-VA' && (
                    <InputOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Exact Location'}
                        placeHolder='Exact Location'
                        readOnly={isEdit}
                        value={getAppDetails.ExactLocation}
                        receive={(e) => updateAppDetails({ name: 'ExactLocation', value: e })}
                        category={'marketing'}
                        required={false}

                        KeyName={'ExactLocation'}
                        group={'Uppercase'}
                        compname={'Exact Location'}
                    />)}
                {User === 'Credit' && getAppDetails.loanProd === '0303-WA' && (
                    <InputOpt
                        className_dmain={'mt-8 w-[18.75rem] h-[3.875rem] pt-[.2rem]'}
                        className_label={'font-bold'}
                        label={'Possible Vacation'}
                        placeHolder='Possible Vacation'
                        readOnly={isEdit}
                        value={getAppDetails.PossVacation}
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
                        value={getAppDetails.AllotName}
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
                        value={getAppDetails.AllotAmount}
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
                    <SelectOpt
                        className_dmain={'mt-2 w-[18.75rem] h-[3.875rem] pt-1'}
                        className_label={'font-bold'}
                        label={<>Remittance / Allotment Channel (Gcash, Bank) <span className="text-red-500">*</span></>}
                        placeHolder='Allotment Channel'
                        value={getAppDetails.AllotChannel}
                        rendered={rendered}
                        category={'marketing'}
                        showSearch
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'AllotChannel', value: e })}
                        options={AllotChannel()}

                        EmptyMsg={'Allotment Channel Required'}
                        InvalidMsg={'Invalid Allotment Channel'}
                        KeyName={'AllotChannel'}
                        group={'Default'}
                        compname={'Allotment Channel'}
                    />

                )}
            </Flex>
            {User === 'LC'
                ? (<></>)
                : (<SectionHeader title="Educational Background" />)}
            <Flex className='w-full' justify='center' gap='small' wrap>
                {(User === 'MARKETING' || (User === 'Credit' && (getAppDetails.loanProd === '0303-WA' || getAppDetails.loanProd === '0303-WL'))) && (
                    <>
                        <SelectOpt
                            className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={<>Highest Educational Attainment <span className="text-red-500">*</span></>}
                            placeHolder='Highest Educational Attainment'
                            value={getAppDetails.ofwHighestEdu}
                            rendered={rendered}
                            category={'marketing'}
                            showSearch
                            isEdit={isEdit}
                            receive={(e) => updateAppDetails({ name: 'ofwHighestEdu', value: e })}
                            options={EducationalAttainment()}

                            EmptyMsg={'Highest Educational Attainment Required'}
                            InvalidMsg={'Invalid Highest Educational Attainment'}
                            KeyName={'ofwHighestEdu'}
                            group={'Default'}
                            compname={'Highest Educational Attainment'}
                        />

                        <InputOpt
                            className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                                } w-[18.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            label={'Course'}
                            placeHolder='Course'
                            disabled={isEdit}
                            value={getAppDetails.ofwcourse}
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
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        label={'School'}
                        placeHolder='School'
                        readOnly={isEdit}
                        value={getAppDetails.ofwschool}
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