import React, { useState, useEffect, useContext } from 'react';
import { Button, ConfigProvider, Row, Col, Flex, notification, message, Form, Input, Checkbox } from 'antd';
import LabeledInput_Fullname from '@components/marketing/LabeledInput_UpperCase';
import LabeledInput_UpperCase from '@components/marketing/LabeledInput_UpperCase';
import LabeledInput from '@components/marketing/LabeledInput';
import LabeledInput_NotRequired from '@components/marketing/LabeledInput_NotRequired';
import LabeledSelect from '@components/marketing/LabeledSelect';
import DatePicker_BDate from '@components/marketing/DatePicker_BDate';
import LabeledInput_Email from '@components/marketing/LabeledInput_Email';
import LabeledInput_Contact from '@components/marketing/LabeledInput_Contact';
import LabeledSelect_Suffix from '@components/marketing/LabeledSelect_Suffix';
import LabeledInput_Numeric from '@components/marketing/LabeledInput_Numeric';
import AddressGroup_Component from '@components/marketing/AddressGroup_Component';
import LabeledInput_LengthStay from '@components/marketing/LabeledInput_LengthStay';
import LabeledSelect_Relationship from '@components/marketing/LabeledSelect_Relationship';
import LabeledInput_Salary from '@components/marketing/LabeledInput_Salary';
import SectionHeader from '@components/validation/SectionHeader';
import { Gender, MaritalStatus, Residences, Suffix, mmddyy, SpouseSourceIncome, Overseas, Religion } from '@utils/FixedData';
import axios from 'axios';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { toDecrypt } from '@utils/Converter';
import LabeledCurrencyInput from '@components/marketing/LabeledCurrencyInput';
import DatePickerOpt from '@components/optimized/DatePickerOpt';
import { Age } from '@utils/Calculations';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import InputOpt from '@components/optimized/InputOpt';
import SelectOpt from '@components/optimized/SelectOpt';
import { useDataContainer } from '@context/PreLoad';
import RelativesTable from '@containers/dataList/TabList/RelativesTable';
import { getDependentsCount } from '@hooks/DependentsController';
import { useStore } from 'zustand';
import { CheckDateValid } from '@utils/Validations';
import { removeLinkFormat } from '@utils/Formatting';


function EditBeneficiaryDetails({ data, receive, presaddress, BorrowerId, Sepcoborrowfname, showCoBorrower, setShowCoBorrower, sepBenfname, User }) {
    const [isEdit, setEdit] = useState(false);
    const [triggerValidation, setTriggerValidation] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const token = localStorage.getItem('UTK')
    const queryClient = useQueryClient();
    const { getAppDetails, updateAppDetails } = useContext(LoanApplicationContext)

    const [relativesCount, setRelativesCount] = useState(0);

    const { Count } = useStore(getDependentsCount);

    useEffect(() => {
        receive({ name: 'bendependents', value: Count - 1 });
    }, [Count]);

    useEffect(() => {
        if (Sepcoborrowfname) {
            setShowSaveButton(false);
            setShowCoBorrower(false);
        } else {
            setShowCoBorrower(true)
            setShowSaveButton(true);
        }
    }, [Sepcoborrowfname]);

    let rendered = sepBenfname ? true : false;
    const [getAcbAge, setAcbAge] = useState(CheckDateValid(getAppDetails.coborrowbdate) ? Age(getAppDetails.coborrowbdate) : 0)
    const [getBenAge, setBenAge] = useState(CheckDateValid(getAppDetails.benbdate) ? Age(getAppDetails.benbdate) : 0);

    //Preload Selects   
    const { GET_RELATIONSHIP_LIST, GET_OFW_SUFFIX } = useDataContainer();
    const GET_RELATIONSHIP = GET_RELATIONSHIP_LIST?.map(x => ({ value: x.code, label: x.description })) || [];
    const OFW_SUFFIX = GET_OFW_SUFFIX?.map(x => ({ label: x.description, value: x.code, })) || [];

    const handleDoubleClick = (() => {
        let clickCount = 0;
        return (borrower) => (e) => {
            if (!isEdit && ((borrower === 'Ben' && getAppDetails.benfblink) || (borrower === 'Acb' && getAppDetails.coborrowfblink))) {
                e.preventDefault();
                clickCount++;
                setTimeout(() => {
                    if (clickCount >= 2) {
                        window.open(`https://www.facebook.com/${borrower === 'Ben' ? getAppDetails.benfblink : getAppDetails.coborrowfblink}`, '_blank');
                    }
                    clickCount = 0; // Reset click count after handling
                }, 300); // Adjust timeout for double-click detection
            }
        };
    })();

    /*
        const handleDoubleClicks = ((borrower) => {
            let clickCount = 0;
            return (e) => {
                if (!isEdit && (
                    (borrower === 'Ben' && getAppDetails.benfblink && getAppDetails.benfblink.startsWith('https://')) ||
                    (borrower === 'Acb' && getAppDetails.coborrowfblink && getAppDetails.coborrowfblink.startsWith('https://'))
                )) {
                    e.preventDefault();
                    clickCount++;
                    setTimeout(() => {
                        if (clickCount >= 2) {
                            const url = borrower === 'Ben' ? getAppDetails.benfblink : getAppDetails.coborrowfblink;
                            window.open(url, '_blank');
                        }
                        clickCount = 0; // Reset click count after handling
                    }, 300); // Adjust timeout for double-click detection
                }
            };
        })();*/

    /*const handleAddCoborrower = async () => {
         setTriggerValidation(true);
         const isSpouseRequired = (data.coborrowmstatus === 2 || data.coborrowmstatus === 5 || data.coborrowmstatus === 6);
         if (!data.coborrowfname || data.coborrowfname.trim() === "" ||
             !data.coborrowmname || data.coborrowmname.trim() === "" ||
             !data.coborrowlname || data.coborrowlname.trim() === "" ||
             !data.coborrowbdate || !data.coborrowsuffix || !data.coborrowgender ||
             !data.coborrowmstatus || !data.coborrowdependents || !data.coborrowfblink ||
             !data.coborrowemail || !data.coborrowmobile || !data.coborrowothermobile ||
             (isSpouseRequired && (!data.coborrowspousename || !data.coborrowerspousebdate))
         ) {
             api['warning']({
                 message: 'Incomplete Details',
                 description: 'Please complete all required details.',
             });
             return;
         }
         const dataHolder = {
             BorrowersCode: BorrowerId,
             AcbFirstName: data.coborrowfname,
             AcbMiddleName: data.coborrowmname,
             AcbLastName: data.coborrowlname,
             AcbSuffix: data.coborrowsuffix || 0,
             AcbBirthday: mmddyy(data.coborrowbdate),
             AcbGender: data.coborrowgender,
             AcbCivilStatus: data.coborrowmstatus,
             AcbDependent: data.coborrowdependents || 0,
             AcbEmail: data.coborrowemail,
             AcbMobileNo: data.coborrowmobile,
             AcbMobileNo2: data.coborrowothermobile || '',
             AcbFbProfile: data.coborrowfblink,
             AcbSpouseName: data.coborrowspousename || '',
             AcbSpouseBirthday: mmddyy(data.coborrowerspousebdate),
             AcbOwnership: data.coborrowresidences,
             AcbAddress1: data.coborrowStreet || '',
             AcbBarangayId: data.coborrowBarangay || '',
             AcbMunicipalityId: data.coborrowMunicipality || '',
             AcbProvinceId: data.coborrowProv || '',
             AcbStayMonths: data.AcbStayMonths,
             AcbStayYears: data.AcbStayYears,
             RecUser: jwtDecode(token).USRID
         };
 
         console.log("Co-Borrower data holder:", dataHolder);
         try {
             const result = await axios.post('/addAdditionalCoborrower', dataHolder);
             api[result.data.status]({
                 message: result.data.message,
                 description: result.data.description
             });
 
             if (result.data.status === 'success') {
                 queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
                 setTriggerValidation(false);
                 setShowCoBorrower(false);  
             }
         } catch (error) {
             api['error']({
                 message: 'Something went wrong',
                 description: error.message
             });
             console.log(error)
         }
     };*/
    const handleDeleteCoborrower = async () => {
        try {
            const result = await axios.post(`/POST/P43DACB/${toDecrypt(localStorage.getItem('SIDC'))}`);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
                setShowCoBorrower(true);
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }
    };

    return (
        <div className='h-[65vh]'>
            {contextHolder}
            {(User === 'MARKETING' || User === 'LC') && (
                <SectionHeader title="Personal Information" />
            )}

            {User !== 'MARKETING' && User !== 'LC' && (
                <SectionHeader
                    title={
                        ["0303-DHW", "0303-VL", "0303-WL"].includes(getAppDetails.loanProd) ? (
                            <>
                                Co-Borrower
                                <br />
                                <span className="text-sm">(Beneficiary Details)</span>
                            </>
                        ) : (
                            <>
                                Principal Borrower
                                <br />
                                <span className="text-sm">(Beneficiary Details)</span>
                            </>
                        )
                    }
                />
            )}


            <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
                <InputOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>First Name <span className="text-red-500">*</span></>}
                    value={data.benfname}
                    placeHolder='First Name'
                    receive={(e) => updateAppDetails({ name: 'benfname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'benfname'}
                    group={'Uppercase'}
                    compname={'First Name'}
                />

                <InputOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label="Middle Name"
                    value={data.benmname}
                    placeHolder='Middle Name'
                    receive={(e) => updateAppDetails({ name: 'benmname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'benmname'}
                    group={'Uppercase'}
                    compname={'Middle Name'}
                    required={false}
                />

                <InputOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>Last Name <span className="text-red-500">*</span></>}
                    value={data.benlname}
                    placeHolder='Last Name'
                    receive={(e) => updateAppDetails({ name: 'benlname', value: e })}
                    category={'marketing'}
                    readOnly={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'benlname'}
                    group={'Uppercase'}
                    compname={'Last Name'}
                />
                <SelectOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>Suffix <span className="text-red-500">*</span></>}
                    value={getAppDetails.bensuffix}
                    rendered={rendered}
                    showSearch
                    receive={(e) => updateAppDetails({ name: 'bensuffix', value: e })}
                    options={OFW_SUFFIX}

                    EmptyMsg={'Suffix Required'}
                    InvalidMsg={'Invalid Suffix'}
                    KeyName={'bensuffix'}
                    group={'Default'}
                    compname={'Suffix'}

                />
                <DatePickerOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    className_dsub={''}
                    label={<>Birthdate <span className="text-red-500">*</span></>}
                    placeHolder='Enter Birthdate'
                    receive={(e) => {
                        receive({ name: 'benbdate', value: e });
                        setBenAge(Age(e))
                    }}
                    value={getAppDetails.benbdate}
                    category={'marketing'}
                    disabled={isEdit}
                    isEdit={isEdit}
                    rendered={rendered}

                    EmptyMsg={'Birthdate Required'}
                    InvalidMsg={'Invalid Birthdate'}
                    KeyName={'benbdate'}
                    group={'AgeLimit20'}
                    compname={'Birthdate'}

                />

                {User === 'Credit' && (
                    <InputOpt
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        className_dsub={''}
                        label={'Age'}
                        value={getBenAge ? getBenAge : 0}
                        placeHolder='Select Birthdate'
                        receive={(e) => setBenAge(e ? e : 0)}
                        category={'marketing'}
                        readOnly={true}
                        isEdit={isEdit}
                        rendered={rendered}
                        required={false}

                        KeyName={'age'}
                        format={'Default'}
                        group={'Uppercase'}
                        compname={'Age'}

                    //EmptyMsg={'Age Required'}
                    //InvalidMsg={'Invalid Age'}
                    />
                )}

                <SelectOpt
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Gender <span className="text-red-500">*</span></>}
                    value={getAppDetails.bengender}
                    rendered={rendered}
                    placeHolder={'Select Gender'}
                    showSearch
                    receive={(e) => updateAppDetails({ name: 'bengender', value: e })}
                    options={Gender()}

                    EmptyMsg={'Gender Required'}
                    InvalidMsg={'Invalid Gender'}
                    KeyName={'bengender'}
                    group={'Default'}
                    compname={'Gender'}

                />


                <InputOpt
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Email Address <span className="text-red-500">*</span></>}
                    placeHolder='Email Address'
                    value={data.benemail}
                    receive={(e) => updateAppDetails({ name: 'benemail', value: e })}
                    category={'marketing'}
                    isEdit={isEdit}
                    rendered={rendered}
                    KeyName={'benemail'}
                    group={'Email'}
                    compname={'Email Address'}

                />

                <InputOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label="font-bold"
                    label={<>Mobile Number <span className="text-red-500">*</span></>}
                    readOnly={isEdit}
                    value={getAppDetails.benmobile}
                    receive={(e) => updateAppDetails({ name: 'benmobile', value: e })}
                    category={'marketing'}
                    rendered={rendered}
                    placeHolder={'Enter Mobile No.'}
                    KeyName={'benmobile'}
                    format={'+639'}
                    group={'ContactNo'}
                    compname={'Contact No.'}

                    EmptyMsg={'Mobile No. Required'}
                    InvalidMsg={'Invalid Mobile No.'}
                />

                <InputOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label="font-bold"
                    label={<>Other Mobile Number <span className="text-red-500">*</span></>}
                    readOnly={isEdit}
                    value={getAppDetails.benothermobile}
                    receive={(e) => updateAppDetails({ name: 'benothermobile', value: e })}
                    category={'marketing'}
                    rendered={rendered}
                    placeHolder={'Enter Other Mobile No.'}
                    KeyName={'benothermobile'}
                    format={'+639'}
                    group={'ContactNo'}
                    compname={'Contact No.'}

                    EmptyMsg={'Mobile No. Required'}
                    InvalidMsg={'Invalid Mobile No.'}
                />

                <SelectOpt
                    className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                    className_label={'font-bold'}
                    label={<>Marital Status <span className="text-red-500">*</span></>}
                    value={getAppDetails.benmstatus}
                    rendered={rendered}
                    placeHolder='Marital Status'
                    showSearch
                    receive={(e) => updateAppDetails({ name: 'benmstatus', value: e })}
                    options={MaritalStatus()}

                    EmptyMsg={'Marital Status Required'}
                    InvalidMsg={'Invalid Marital Status'}
                    KeyName={'benmstatus'}
                    group={'Default'}
                    compname={'Marital Status'}

                />
                {getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL' ? (
                    <></>) :
                    (User === 'Credit' || User === 'MARKETING') && (getAppDetails.benmstatus === 2 || getAppDetails.benmstatus === 5 || getAppDetails.benmstatus === 6) && (
                        <div className="mt-6 w-[18.75rem] h-[3.875rem] flex items-center">
                            <Checkbox
                                checked={getAppDetails.MarriedPBCB}
                                onClick={() => {
                                    updateAppDetails({ name: 'MarriedPBCB', value: !getAppDetails.MarriedPBCB });
                                }}
                                disabled={isEdit}
                            >
                                If the PB and CB are married to each other
                            </Checkbox>
                        </div>
                    )};


                {(data.benmstatus === 2 || data.benmstatus === 5 || data.benmstatus === 6) ? (
                    <>
                        <InputOpt
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Spouse Name <span className="text-red-500">*</span></>}
                            placeHolder='Spouse Name'
                            readOnly={isEdit}
                            receive={(e) => updateAppDetails({ name: 'benspouse', value: e })}
                            value={data.benspouse}
                            isEdit={isEdit}
                            rendered={rendered}
                            disabled={User === 'Credit' && data.MarriedPBCB}
                            KeyName={'benspouse'}
                            group={'Uppercase'}
                            compname={'Spouse Name'}
                            EmptyMsg={'Spouse Name Required'}
                            InvalidMsg={'Invalid Spouse Name'}
                        />

                        <DatePickerOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Spouse Birthdate <span className="text-red-500">*</span></>}
                            placeHolder='Enter Birthdate'
                            receive={(e) => { updateAppDetails({ name: 'benspousebdate', value: e }) }}
                            disabled={User === 'Credit' && data.MarriedPBCB}

                            value={data.benspousebdate}
                            isEdit={isEdit}
                            rendered={rendered}

                            KeyName={'benspousebdate'}
                            group={'AgeLimit20'}
                            compname={'Spouse Birthdate'}
                            EmptyMsg={'Spouse Birthdate Required'}
                            InvalidMsg={'Invalid Spouse Birthdate'}
                        />

                        {User === 'Credit' && (
                            <SelectOpt
                                className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                                className_label={'font-bold'}
                                label={<>Spouse Source of Income <span className="text-red-500">*</span></>}
                                value={getAppDetails.BenSpSrcIncome}
                                rendered={rendered}
                                placeHolder='Spouse Source of Income'
                                showSearch
                                receive={(e) => updateAppDetails({ name: 'BenSpSrcIncome', value: e })}
                                options={SpouseSourceIncome()}

                                EmptyMsg={'Spouse Source of Income Required'}
                                InvalidMsg={'Invalid Spouse Source of Income'}
                                KeyName={'BenSpSrcIncome'}
                                group={'Default'}
                                compname={'Spouse Source of Income'}

                            />
                        )}
                        {User === 'Credit' && (
                            <InputOpt
                                className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                                className_label={'font-bold'}
                                label={<>Spouse Income <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Income'
                                readOnly={isEdit}
                                value={data.BenSpIncome}
                                receive={(e) => updateAppDetails({ name: 'BenSpIncome', value: e })}
                                category={'direct'}
                                rendered={rendered}
                                KeyName={'BenSpIncome'}
                                format={'Currency'}
                                group={'Income'}
                                compname={'Spouse Income'}
                                disabled={User === 'Credit' && data.MarriedPBCB}
                            />
                        )}
                    </>
                ) : null}
                {User === 'Credit' ? (
                    <InputOpt
                        className_dmain={`${User === 'LC' ? 'mt-5 xs1:mt-2 2xl:mt-5' : 'mt-10'
                            } w-[18.75rem] h-[3.875rem]`}
                        className_label={'font-bold'}
                        className_component={`w-full p-2 border rounded-lg border-gray-300 ${!isEdit && getAppDetails.benfblink
                            ? 'text-blue-500 underline'
                            : 'text-black'
                            }`}
                        label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeholder="Facebook Name / Profile"
                        value={`https://www.facebook.com/${removeLinkFormat(getAppDetails.benfblink)}`}//just in case to remove existing data
                        receive={(e) => updateAppDetails({ name: 'benfblink', value: e.slice(25) })}
                        category={'marketing'}
                        rendered={rendered}
                        onClick={handleDoubleClick('Ben')}

                        KeyName={'benfblink'}
                        format={'Http'}
                        group={'FBLink'}
                        compname={'Facebook Name / Profile'}

                        EmptyMsg={'Facebook Name / Profile Required'}
                        InvalidMsg={'Invalid Facebook Name / Profile'}
                    />

                ) : (
                    <LabeledInput
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeHolder='Facebook Name / Profile'
                        readOnly={isEdit}
                        value={data.benfblink || ''}
                        receive={(e) => {
                            const formattedValue = e.includes('https://') ? e : `https://www.facebook.com/${e}`;
                            updateAppDetails({ name: 'benfblink', value: formattedValue });
                        }}
                        isEdit={isEdit}
                        rendered={rendered}
                    />
                )}
                {/*User === 'Credit' && (
                    <LabeledInput
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Group Chat (Name or URL) <span className="text-red-500">*</span></>}
                        placeHolder='Group Chat'
                        value={data.BenGrpChat}
                        receive={(e) => updateAppDetails({ name: 'BenGrpChat', value: e })}
                        category={'marketing'}
                        readOnly={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                    />)*/}
                {User === 'LC'
                    ? (<></>)
                    : (
                        <SelectOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            label={<>Relationship to the OFW <span className="text-red-500">*</span></>}
                            value={data.benrelationship}
                            rendered={rendered}
                            placeHolder='Relationship to the OFW'
                            category={'marketing'}
                            disabled={data.MarriedPBCB}
                            isEdit={isEdit}
                            receive={(e) => updateAppDetails({ name: 'benrelationship', value: e })}
                            options={GET_RELATIONSHIP}
                            showSearch

                            EmptyMsg={'Relationship to the OFW Required'}
                            InvalidMsg={'Invalid Relationship to the OFW'}
                            KeyName={'benrelationship'}
                            group={'Default'}
                            compname={'Relationship to the OFW'}
                        />
                    )}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Source of Income <span className="text-red-500">*</span></>}
                        value={data.BenSrcIncome}
                        rendered={rendered}
                        placeHolder='Source of Income'
                        category={'marketing'}
                        disabled={data.MarriedPBCB}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'BenSrcIncome', value: e })}
                        options={SpouseSourceIncome()}
                        showSearch

                        EmptyMsg={'Source of Income Required'}
                        InvalidMsg={'Invalid Source of Income'}
                        KeyName={'BenSrcIncome'}
                        group={'Default'}
                        compname={'Source of Income'}
                    />

                )}
                {User === 'Credit' && (
                    <SelectOpt
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>Religion <span className="text-red-500">*</span></>}
                        value={data.BenReligion}
                        rendered={rendered}
                        placeHolder='Select Religion'
                        category={'marketing'}
                        disabled={data.MarriedPBCB}
                        isEdit={isEdit}
                        receive={(e) => updateAppDetails({ name: 'BenReligion', value: e })}
                        options={Religion()}
                        showSearch

                        EmptyMsg={'Religion Required'}
                        InvalidMsg={'Invalid Religion'}
                        KeyName={'BenReligion'}
                        group={'Default'}
                        compname={'Religion'}
                    />
                )}
                {User === 'Credit' && (
                    <>
                        <LabeledSelect
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label='font-bold'
                            label={<>Former OFW (Overseas Filipino Worker) <span className="text-red-500">*</span></>}
                            placeHolder='Please select'
                            data={Overseas()}
                            value={data.BenFormerOFW}
                            receive={(e) => {
                                updateAppDetails({ name: 'BenFormerOFW', value: e });
                                if (e === 1) {
                                    updateAppDetails({ name: 'BenLastReturn', value: '' });
                                }
                            }}
                            disabled={isEdit}
                            rendered={rendered}
                        />
                        {data.BenFormerOFW === 1 && (
                            <LabeledInput
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>When was your last return home? <span className="text-red-500">*</span></>}
                                placeHolder='When was your last return home'
                                value={data.BenLastReturn}
                                receive={(e) => updateAppDetails({ name: 'BenLastReturn', value: e })}
                                category={'marketing'}
                                readOnly={isEdit}
                                isEdit={isEdit}
                                rendered={rendered}
                            />)}</>)}
                {User === 'Credit' && (
                    <>
                        <LabeledSelect
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label='font-bold'
                            label={<>Plans to go Abroad <span className="text-red-500">*</span></>}
                            placeHolder='Please select'
                            data={Overseas()}
                            value={data.BenPlanAbroad}
                            receive={(e) => {
                                updateAppDetails({ name: 'BenPlanAbroad', value: e });
                            }}
                            disabled={isEdit}
                            rendered={rendered}
                        />
                        {data.BenPlanAbroad === 1 && (
                            <LabeledInput_NotRequired
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={'Remarks'}
                                placeHolder='Remarks'
                                readOnly={isEdit}
                                value={data.BenRemarks}
                                receive={(e) => updateAppDetails({ name: 'BenRemarks', value: e })}
                            />)}</>)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        data={Overseas()}
                        label={<>PEP <span className="text-red-500">*</span></>}
                        placeHolder='PEP'
                        readOnly={isEdit}
                        value={data.BenPEP}
                        receive={(e) => updateAppDetails({ name: 'BenPEP', value: e })}
                        disabled={isEdit}
                        rendered={rendered}
                    />)}


                {User !== 'LC' && (
                    <Form.Item
                        label="Dependents"
                        colon={false}
                        wrapperCol={{ span: 24 }}
                        className="w-[18.75rem] mt-4 font-bold"
                    >
                        <Input
                            value={data.bendependents || '0'}
                            className="h-[2.5rem] border border-gray-300 rounded-lg mt-[-.3rem]"
                            readOnly
                            placeholder="No. of Dependents"
                        />
                    </Form.Item>
                )}

                {User === 'LC' && (
                    <LabeledInput_Numeric
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label='font-bold'
                        label={<>Dependents <span className="text-red-500">*</span></>}
                        digits={2}
                        placeHolder='No. of Dependents'
                        value={data.bendependents}
                        receive={(e) => updateAppDetails({ name: 'bendependents', value: e })}
                        readOnly={isEdit}
                        rendered={rendered}
                    />
                )}
                {/* dito ibabato ang check galing context upang gamitin sa condition na pag display ng relativetavle na once 1 ang makuha sa context ididisplay nya ito realtime then pag naman 0 hindi */}
                {getAppDetails?.MarriedPBCB !== 1 && (User !== 'LC' && (
                    <div className="w-full mt-[2rem] mx-auto">
                        <RelativesTable BorrowerId={BorrowerId} onUpdateCount={(count) => setRelativesCount(count)} data={data} isOfw={2} />
                    </div>
                ))}

            </Flex>
            <SectionHeader title="Present Address" />
            <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
                <AddressGroup_Component
                    data={data}
                    receive={(e) => { updateAppDetails(e) }}
                    presaddress={(e) => { presaddress(e) }}
                    type={"beneficiary"}
                    category={"marketing"}
                    className_dmain={`mt-5 w-full xs:w-[8.75rem] sm:w-[8.75rem] md:w-[10.75rem] lg:w-[12.75rem] xl:w-[14.75rem] ${(User === 'Credit' || User === 'Lp') ? '2xl:w-[16.75rem]' : '2xl:w-[18.75rem]'
                        } 3xl:w-[20.75rem] h-[3.875rem]`}
                    className_label={'font-bold'}
                    className_dsub={''}
                    vertical_algin={true}
                    disabled={false}
                    rendered={rendered}
                />
                <LabeledSelect
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    className_dsub={''}
                    label={<>Type of Residence <span className="text-red-500">*</span></>}
                    placeHolder='Type Of Residence'
                    disabled={isEdit}
                    receive={(e) => { updateAppDetails({ name: 'benresidences', value: e }) }}
                    data={Residences()}
                    category={'marketing'}
                    value={data.benresidences}
                    rendered={rendered}
                />
                {data.benresidences === 3 || data.benresidences === 2 ? (
                    <LabeledCurrencyInput
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label={'font-bold'}
                        label={<>{data.benresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}<span className="text-red-500"> *</span> </>}
                        value={data.BenRentAmount}
                        receive={(e) => { updateAppDetails({ name: 'BenRentAmount', value: e }) }}
                        category={'direct'}
                        placeHolder={data.benresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                        rendered={rendered}
                    />
                ) : null}
                <LabeledInput_LengthStay
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label="font-bold"
                    label={<>Length of Stay <span className="text-red-500">*</span></>}
                    value_month={data.benstaymonths}
                    value_year={data.benstayyears}
                    receiveM={(e) => updateAppDetails({ name: 'benstaymonths', value: e })}
                    receiveY={(e) => updateAppDetails({ name: 'benstayyears', value: e })}
                    disabled={isEdit}
                    category="marketing"
                    rendered={rendered}
                />
                {User === 'Credit' && (
                    <>

                        <InputOpt
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Landmark <span className="text-red-500">*</span></>}
                            placeHolder='Landmark'
                            isEdit={isEdit}
                            category={'marketing'}
                            readOnly={isEdit}
                            value={data.BenLandMark}
                            rendered={rendered}
                            receive={(e) => updateAppDetails({ name: 'BenLandMark', value: e })}

                            KeyName={'BenLandMark'}
                            group={'Uppercase'}
                            compname={'Landmark'}
                        />

                        <InputOpt
                            className_dmain={'mt-5 w-[18.75rem] h-[3.875rem]'}
                            className_label={'font-bold'}
                            label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                            placeHolder='Remarks'
                            isEdit={isEdit}
                            category={'marketing'}
                            readOnly={isEdit}
                            rendered={rendered}
                            value={data.BenPoBRemarks}
                            receive={(e) => updateAppDetails({ name: 'BenPoBRemarks', value: e })}

                            KeyName={'BenPoBRemarks'}
                            group={'Uppercase'}
                            compname={'Proof of Billing Remarks'}
                        />

                    </>
                )}
            </Flex>
            {!Sepcoborrowfname && (
                <center>
                    <div className="text-center mt-[2rem] mb-[0.25rem] w-[15rem]">
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: !showCoBorrower ? '#e14040' : '#6b21a8',
                                    colorPrimaryHover: !showCoBorrower ? '#fd7774' : '#3b0764',
                                },
                            }}
                        >
                            <Button
                                className="w-full"
                                onClick={() => setShowCoBorrower(!showCoBorrower)}
                                size="large"
                                type="primary"
                            >
                                {!showCoBorrower ? 'Remove Additional Co-borrower' : 'Additional Co-Borrower'}
                            </Button>
                        </ConfigProvider>
                    </div>
                </center>
            )}
            {!showCoBorrower && (
                <>
                    <SectionHeader title="Additional Co-Borrower Info" />
                    <Flex className='w-full' justify='center' gap='small' wrap>

                        <InputOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>First Name <span className="text-red-500">*</span></>}
                            placeHolder='First Name'
                            readOnly={isEdit}
                            value={getAppDetails.coborrowfname}
                            receive={(e) => updateAppDetails({ name: 'coborrowfname', value: e })}
                            category={'marketing'}
                            rendered={rendered}
                            KeyName={'coborrowfname'}
                            group={'Uppercase'}
                            compname={'First Name'}

                            EmptyMsg={'First Name Required'}
                            InvalidMsg={'Invalid First Name'}

                        />
                        <InputOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={'Middle Name'}
                            placeHolder='Middle Name'
                            readOnly={isEdit}
                            value={getAppDetails.coborrowmname}
                            receive={(e) => updateAppDetails({ name: 'coborrowmname', value: e })}
                            category={'marketing'}
                            rendered={rendered}
                            KeyName={'coborrowmname'}
                            group={'Uppercase'}
                            compname={'Middle Name'}

                            EmptyMsg={'Middle Name Required'}
                            InvalidMsg={'Invalid Middle Name'}
                            required={false}
                        />
                        <InputOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Last Name <span className="text-red-500">*</span></>}
                            placeHolder='Last Name'
                            readOnly={isEdit}
                            value={getAppDetails.coborrowlname}
                            receive={(e) => updateAppDetails({ name: 'coborrowlname', value: e })}
                            category={'marketing'}
                            rendered={rendered}
                            KeyName={'coborrowlname'}
                            group={'Uppercase'}
                            compname={'Last Name'}

                            EmptyMsg={'Last Name Required'}
                            InvalidMsg={'Invalid Last Name'}

                        />

                        <SelectOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Suffix <span className="text-red-500">*</span></>}
                            value={getAppDetails.coborrowsuffix}
                            rendered={rendered}
                            showSearch
                            receive={(e) => updateAppDetails({ name: 'coborrowsuffix', value: e })}
                            options={OFW_SUFFIX}

                            EmptyMsg={'Suffix Required'}
                            InvalidMsg={'Invalid Suffix'}
                            KeyName={'coborrowsuffix'}
                            group={'Default'}
                            compname={'Suffix'}

                        />

                        <DatePickerOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Birthdate <span className="text-red-500">*</span></>}
                            placeHolder='Enter Birthdate'
                            receive={(e) => {
                                receive({ name: 'coborrowbdate', value: e });
                                setAcbAge(Age(e))
                            }}
                            value={getAppDetails.coborrowbdate}
                            category={'marketing'}
                            disabled={isEdit}
                            isEdit={isEdit}
                            rendered={rendered}

                            EmptyMsg={'Birthdate Required'}
                            InvalidMsg={'Invalid Birthdate'}
                            KeyName={'coborrowbdate'}
                            group={'AgeLimit20'}
                            compname={'Birthdate'}

                        />

                        {User === 'Credit' && (
                            <InputOpt
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                className_dsub={''}
                                label={'Age'}
                                value={getAcbAge ? getAcbAge : 0}
                                placeHolder='Select Birthdate'
                                receive={(e) => setAcbAge(e ? e : 0)}
                                category={'marketing'}
                                readOnly={true}
                                isEdit={isEdit}
                                rendered={rendered}
                                required={false}

                                KeyName={'ofwlname'}
                                format={'Default'}
                                group={'Uppercase'}
                                compname={'Last Name'}

                            //EmptyMsg={'Age Required'}
                            //InvalidMsg={'Invalid Age'}
                            />)}
                        <LabeledSelect
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Gender <span className="text-red-500">*</span></>}
                            placeHolder='Gender'
                            disabled={isEdit}
                            value={data.coborrowgender}
                            data={Gender()}
                            receive={(e) => { updateAppDetails({ name: 'coborrowgender', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledInput_Email
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Email Address <span className="text-red-500">*</span></>}
                            placeHolder='Email Address'
                            readOnly={isEdit}
                            value={data.coborrowemail}
                            receive={(e) => { updateAppDetails({ name: 'coborrowemail', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        {/* <LabeledInput_Contact
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Mobile Number <span className="text-red-500">*</span></>}
                            placeHolder='Mobile Number'
                            readOnly={isEdit}
                            value={data.coborrowmobile}
                            receive={(e) => { updateAppDetails({ name: 'coborrowmobile', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />*/}

                        <InputOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label="font-bold"
                            label={<>Mobile Number <span className="text-red-500">*</span></>}
                            readOnly={isEdit}
                            value={getAppDetails.coborrowmobile}
                            receive={(e) => updateAppDetails({ name: 'coborrowmobile', value: e })}
                            category={'marketing'}
                            rendered={rendered}
                            KeyName={'coborrowmobile'}
                            format={'+639'}
                            group={'ContactNo'}
                            compname={'Contact No.'}

                            EmptyMsg={'Mobile No. Required'}
                            InvalidMsg={'Invalid Mobile No.'}
                        />

                        <LabeledInput_Contact
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={'Other Mobile Number'}
                            placeHolder='Other Mobile Number'
                            readOnly={isEdit}
                            value={data.coborrowothermobile}
                            receive={(e) => { updateAppDetails({ name: 'coborrowothermobile', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            required={false}
                        />
                        <LabeledInput_Numeric
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Dependents <span className="text-red-500">*</span></>}
                            readOnly={isEdit}
                            value={data.coborrowdependents}
                            receive={(e) => { updateAppDetails({ name: 'coborrowdependents', value: e }) }}
                            digits={2}
                            placeHolder={'No. of Dependents'}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledSelect
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Marital Status <span className="text-red-500">*</span></>}
                            placeHolder='Marital Status'
                            disabled={isEdit}
                            value={data.coborrowmstatus}
                            data={MaritalStatus()}
                            receive={(e) => { updateAppDetails({ name: 'coborrowmstatus', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            showSearch
                            rendered={rendered}
                        />
                        {(data.coborrowmstatus === 2 || data.coborrowmstatus === 5 || data.coborrowmstatus === 6) ? (
                            <>
                                <LabeledInput_Fullname
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label={'font-bold'}
                                    label={<>Spouse Name <span className="text-red-500">*</span></>}
                                    placeHolder='Spouse Name'
                                    readOnly={isEdit}
                                    category={'marketing'}
                                    receive={(e) => updateAppDetails({ name: 'coborrowspousename', value: e })}
                                    value={data.coborrowspousename}
                                    triggerValidation={triggerValidation}
                                    rendered={rendered}
                                />

                                <DatePickerOpt
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label={'font-bold'}
                                    className_dsub={''}
                                    label={<>Spouse Birthdate <span className="text-red-500">*</span></>}
                                    placeHolder='Birthdate'
                                    receive={(e) => { updateAppDetails({ name: 'coborrowerspousebdate', value: e }) }}

                                    value={data.coborrowerspousebdate}
                                    isEdit={isEdit}
                                    rendered={rendered}
                                    disabled={isEdit}
                                    notValidMsg={'Birthdate Required'}
                                    category={'marketing'}

                                    EmptyMsg={'Birthdate Required'}
                                    InvalidMsg={'Invalid Birthdate'}
                                    KeyName={'coborrowerspousebdate'}
                                    group={'AgeLimit20'}
                                    compname={'Spouse Birthdate'}
                                />

                                {User === 'Credit' && (
                                    <LabeledSelect
                                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                        className_label={'font-bold'}
                                        label={<>Spouse Source of Income <span className="text-red-500">*</span></>}
                                        placeHolder='Spouse Source of Income'
                                        disabled={isEdit}
                                        value={data.AcbSpSrcIncome}
                                        data={SpouseSourceIncome()}
                                        receive={(e) => updateAppDetails({ name: 'AcbSpSrcIncome', value: e })}
                                        rendered={rendered}
                                    />)}
                                {User === 'Credit' && (
                                    <LabeledInput_Salary
                                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                        className_label={'font-bold'}
                                        label={<>Spouse Income <span className="text-red-500">*</span></>}
                                        placeHolder='Spouse Income'
                                        readOnly={isEdit}
                                        value={data.AcbSpIncome}
                                        receive={(e) => updateAppDetails({ name: 'AcbSpIncome', value: e })}
                                        category={'direct'}
                                        rendered={rendered}
                                    />)}
                            </>
                        ) : null}
                        {User === 'Credit' ? (
                            <InputOpt
                                className_dmain={`mt-5 w-[18.75rem] h-[3.875rem]`}
                                className_label={'font-bold'}
                                className_component={`w-full p-2 border rounded-lg border-gray-300 ${!isEdit && data.coborrowfblink && data.coborrowfblink.startsWith('https://')
                                    ? 'text-blue-500 underline'
                                    : 'text-black'
                                    }`}
                                label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                                placeholder="Facebook Name / Profile"
                                value={getAppDetails.coborrowfblink}
                                receive={(e) => updateAppDetails({ name: 'coborrowfblink', value: e })}
                                category={'marketing'}
                                rendered={rendered}
                                onClick={handleDoubleClick('Ben')}

                                KeyName={'coborrowfblink'}
                                format={'Http'}
                                group={'FBLink'}
                                compname={'Facebook Name / Profile'}

                                EmptyMsg={'Facebook Name / Profile Required'}
                                InvalidMsg={'Invalid Facebook Name / Profile'}
                            />
                        ) : (

                            <LabeledInput
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>Facebook Name / Profile <span className="text-red-500">*</span></>}
                                placeHolder='Facebook Name / Profile'
                                readOnly={isEdit}
                                value={data.coborrowfblink || ''}
                                receive={(e) => {
                                    const formattedValue = e.includes('https://') ? e : `https://www.facebook.com/${e}`;
                                    updateAppDetails({ name: 'coborrowfblink', value: formattedValue });
                                }}
                                isEdit={isEdit}
                                rendered={rendered}
                            />
                        )}
                        {/*User === 'Credit' && (
                            <LabeledInput
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={'Group Chat (Name or URL)'}
                                placeHolder='Group Chat'
                                value={data.AcbGrpChat}
                                receive={(e) => updateAppDetails({ name: 'AcbGrpChat', value: e })}
                                category={'marketing'}
                                readOnly={isEdit}
                                isEdit={isEdit}
                                rendered={rendered}
                            />)*/}
                        {User === 'LC'
                            ? (<></>)
                            : (<LabeledSelect_Relationship
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>Relationship to the OFW <span className="text-red-500">*</span></>}
                                placeHolder='Relationship to the OFW'
                                value={data.AcbRelationship}
                                receive={(e) => updateAppDetails({ name: 'AcbRelationship', value: e })}
                                category={'marketing'}
                                disabled={isEdit}
                                isEdit={isEdit}
                                rendered={rendered}
                            />)}
                        {User === 'Credit' && (
                            <LabeledSelect
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label='font-bold'
                                label={<>Source of Income <span className="text-red-500">*</span></>}
                                placeHolder='Please select'
                                data={SpouseSourceIncome()}
                                value={data.AcbSrcIncome}
                                receive={(e) => updateAppDetails({ name: 'AcbSrcIncome', value: e })}
                                disabled={isEdit}
                                rendered={rendered}
                            />)}
                        {User === 'Credit' && (
                            <LabeledSelect
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label='font-bold'
                                label={<>Religion <span className="text-red-500">*</span></>}
                                placeHolder='Please select'
                                data={Religion()}
                                value={data.AcbReligion}
                                receive={(e) => updateAppDetails({ name: 'AcbReligion', value: e })}
                                disabled={isEdit}
                                showSearch
                                rendered={rendered}
                            />)}
                        {User === 'Credit' && (
                            <>
                                <LabeledSelect
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label='font-bold'
                                    label={<>Former OFW (Overseas Filipino Worker) <span className="text-red-500">*</span></>}
                                    placeHolder='Please select'
                                    data={Overseas()}
                                    value={data.AcbFormerOFW}
                                    receive={(e) => {
                                        updateAppDetails({ name: 'AcbFormerOFW', value: e });
                                        if (e === 1) {
                                            updateAppDetails({ name: 'AcbLastReturn', value: '' });
                                        }
                                    }}
                                    disabled={isEdit}
                                    rendered={rendered}
                                />
                                {data.AcbFormerOFW === 1 && (
                                    <LabeledInput
                                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                        className_label={'font-bold'}
                                        label={<>When was your last return home? <span className="text-red-500">*</span></>}
                                        placeHolder='When was your last return home'
                                        value={data.AcbLastReturn}
                                        receive={(e) => updateAppDetails({ name: 'AcbLastReturn', value: e })}
                                        category={'marketing'}
                                        readOnly={isEdit}
                                        isEdit={isEdit}
                                        rendered={rendered}
                                    />)}</>)}
                        {User === 'Credit' && (
                            <>
                                <LabeledSelect
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label='font-bold'
                                    label={<>Plans to go Abroad <span className="text-red-500">*</span></>}
                                    placeHolder='Please select'
                                    data={Overseas()}
                                    value={data.AcbPlanAbroad}
                                    receive={(e) => {
                                        updateAppDetails({ name: 'AcbPlanAbroad', value: e });
                                        if (e === 1) {
                                            updateAppDetails({ name: 'AcbRemarks', value: '' });
                                        }
                                    }}
                                    disabled={isEdit}
                                    rendered={rendered}
                                />
                                {data.AcbPlanAbroad === 1 && (
                                    <LabeledInput_NotRequired
                                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                        className_label={'font-bold'}
                                        label={'Remarks'}
                                        placeHolder='Remarks'
                                        readOnly={isEdit}
                                        value={data.AcbRemarks}
                                        receive={(e) => updateAppDetails({ name: 'AcbRemarks', value: e })}

                                    />)}</>)}
                        {User === 'Credit' && (
                            <LabeledSelect
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                data={Overseas()}
                                label={<>PEP <span className="text-red-500">*</span></>}
                                placeHolder='PEP'
                                readOnly={isEdit}
                                value={data.AcbPEP}
                                receive={(e) => updateAppDetails({ name: 'AcbPEP', value: e })}
                                rendered={rendered}

                            />)}
                    </Flex>
                    <SectionHeader title="Present Address" />
                    <Flex className='w-full' justify='center' gap='small' wrap>
                        <AddressGroup_Component
                            data={data}
                            receive={(e) => { updateAppDetails(e) }}
                            presaddress={(e) => { presaddress(e) }}
                            type={"coborrow"}
                            category={"marketing"}
                            className_dmain={`mt-5 w-full xs:w-[8.75rem] sm:w-[8.75rem] md:w-[10.75rem] lg:w-[12.75rem] xl:w-[14.75rem] ${(User === 'Credit' || User === 'Lp') ? '2xl:w-[16.75rem]' : '2xl:w-[18.75rem]'
                                } 3xl:w-[20.75rem] h-[3.875rem]`}
                            className_label={'font-bold'}
                            className_dsub={''}
                            vertical_algin={true}
                            disabled={false}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledSelect
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Type of Residence <span className="text-red-500">*</span></>}
                            placeHolder='Type Of Residence'
                            disabled={isEdit}
                            receive={(e) => { updateAppDetails({ name: 'coborrowresidences', value: e }) }}
                            data={Residences()}
                            category={'marketing'}
                            value={data.coborrowresidences}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        {data.coborrowresidences === 3 || data.coborrowresidences === 2 ? (
                            <LabeledCurrencyInput
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>
                                    {`${data.coborrowresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'} `}
                                    <span className="text-red-500">*</span>
                                </>}
                                value={data.AcbRentAmount}
                                receive={(e) => { updateAppDetails({ name: 'AcbRentAmount', value: e }) }}
                                category={'direct'}
                                placeHolder={data.coborrowresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                                rendered={rendered}
                            />
                        ) : null}

                        <LabeledInput_LengthStay
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label="font-bold"
                            label={<>Length of Stay <span className="text-red-500">*</span></>}
                            value_month={data.AcbStayMonths}
                            value_year={data.AcbStayYears}
                            receiveM={(e) => updateAppDetails({ name: 'AcbStayMonths', value: e })}
                            receiveY={(e) => updateAppDetails({ name: 'AcbStayYears', value: e })}
                            disabled={isEdit}
                            category="marketing"
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        {User === 'Credit' && (
                            <>
                                <LabeledInput_UpperCase
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label={'font-bold'}
                                    label={<>Landmark <span className="text-red-500">*</span></>}
                                    placeHolder='Landmark'
                                    readOnly={isEdit}
                                    value={data.AcbLandMark}
                                    receive={(e) => updateAppDetails({ name: 'AcbLandMark', value: e })}
                                    rendered={rendered}
                                />
                                <LabeledInput_UpperCase
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label={'font-bold'}
                                    label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                                    placeHolder='Remarks'
                                    readOnly={isEdit}
                                    value={data.AcbPoBRemarks}
                                    receive={(e) => updateAppDetails({ name: 'AcbPoBRemarks', value: e })}
                                    rendered={rendered}
                                />
                            </>
                        )}
                    </Flex>
                    {/*showSaveButton && (
                        <center>
                            <div className="text-center mt-4 mb-4 w-[200px]">
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                    <Button
                                        onClick={handleAddCoborrower}
                                        className="bg-[#3ba0764] w-full"
                                        size='large'
                                        type='primary'
                                    >
                                        Add Co-Borrower
                                    </Button>
                                </ConfigProvider>
                            </div>
                        </center>
                    )*/}
                    {!showSaveButton && (
                        <center>
                            <div className="text-center mt-4 mb-4 w-[12.5rem]">
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#6b21a8',
                                        },
                                        components: {
                                            Button: {
                                                colorPrimary: '#e14040',
                                                colorPrimaryHover: '#fd7774',
                                            },
                                        },
                                    }}
                                >
                                    <Button
                                        onClick={handleDeleteCoborrower}
                                        className="w-full"
                                        size="large"
                                        type="primary"
                                    >
                                        Delete Co-Borrower
                                    </Button>
                                </ConfigProvider>
                            </div>
                        </center>
                    )}
                </>
            )}
        </div>
    );
}

export default EditBeneficiaryDetails;
