import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, Row, Col, Flex, notification, message } from 'antd';
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

function EditBeneficiaryDetails({ data, receive, presaddress, BorrowerId, Sepcoborrowfname, showCoBorrower, setShowCoBorrower, sepBenfname, User }) {
    const [isEdit, setEdit] = useState(false);
    const [triggerValidation, setTriggerValidation] = useState(false);
    const [getAge, setAge] = useState(Age(data.benbdate));
    const [showSaveButton, setShowSaveButton] = useState(true);
    const [api, contextHolder] = notification.useNotification();
    const token = localStorage.getItem('UTK')
    const queryClient = useQueryClient();
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
    let rendered_add = Sepcoborrowfname ? true : false;

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
             const result = await axios.post('/v1/POST/P43AACB', dataHolder);
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
            const result = await axios.post(`/v1/POST/P43DACB/${toDecrypt(localStorage.getItem('SIDC'))}`);
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

    useEffect(() => {
        if (data.benbdate) {
            setAge(Age(data.benbdate));
        }
    }, [data.benbdate]);

    const calculateAge = (birthdate) => {
        if (!birthdate) return '';
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDifference = today.getMonth() - birthDateObj.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };
    return (
        <div className='h-[65vh]'>
            {contextHolder}
            <SectionHeader title="Personal Information" />
            <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
                <LabeledInput_UpperCase
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>First Name <span className="text-red-500">*</span></>}
                    value={data.benfname}
                    placeHolder='First Name'
                    receive={(e) => receive({ name: 'benfname', value: e })}
                    readOnly={isEdit}
                    rendered={rendered}
                />
                <LabeledInput_NotRequired
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label='Middle Name'
                    value={data.benmname}
                    placeHolder='Middle Name'
                    receive={(e) => receive({ name: 'benmname', value: e })}
                    readOnly={isEdit}
                    rendered={rendered}
                />
                <LabeledInput_UpperCase
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>Last Name <span className="text-red-500">*</span></>}
                    value={data.benlname}
                    placeHolder='Last Name'
                    receive={(e) => receive({ name: 'benlname', value: e })}
                    readOnly={isEdit}
                    rendered={rendered}
                />
                <LabeledSelect_Suffix
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>Suffix <span className="text-red-500">*</span></>}
                    placeHolder='Suffix'
                    value={data.bensuffix}
                    receive={(e) => receive({ name: 'bensuffix', value: e })}
                    disabled={isEdit}
                    rendered={rendered}
                    showSearch
                />
                <DatePickerOpt
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    label={<>Birthdate <span className="text-red-500">*</span></>}
                    placeHolder='Enter Birthdate'
                    receive={(e) => {
                        receive({ name: 'benbdate', value: e });
                    }}
                    value={data.benbdate}
                    isEdit={isEdit}
                    rendered={rendered}
                    disabled={isEdit}
                    notValidMsg={'Birthdate Required'}
                    KeyName={'benbdate'}
                    category={'marketing'}
                />

                {User === 'Credit' && (
                    <LabeledInput
                        className_dmain="mt-5 w-[18.75rem] h-[3.875rem]"
                        className_label="font-bold"
                        label="Age"
                        value={getAge}
                        readOnly={true}
                        placeHolder="Age"
                        rendered={rendered}
                    />)}
                <LabeledSelect
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>Gender <span className="text-red-500">*</span></>}
                    placeHolder='Please select'
                    data={Gender()}
                    value={data.bengender}
                    receive={(e) => receive({ name: 'bengender', value: e })}
                    disabled={isEdit}
                    rendered={rendered}
                />
                <LabeledInput_Email
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    className_dsub={''}
                    label={<>Email Address <span className="text-red-500">*</span></>}
                    placeHolder='Email Address'
                    readOnly={isEdit}
                    value={data.benemail}
                    receive={(e) => { receive({ name: 'benemail', value: e }) }}
                    category={'marketing'}
                    rendered={rendered}
                />
                <LabeledInput_Contact
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    className_dsub={''}
                    label={<>Mobile Number <span className="text-red-500">*</span></>}
                    placeHolder='Mobile Number'
                    readOnly={isEdit}
                    value={data.benmobile}
                    receive={(e) => { receive({ name: 'benmobile', value: e }) }}
                    category={'marketing'}
                    rendered={rendered}
                />
                <LabeledInput_Contact
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    className_dsub={''}
                    label={'Other Mobile Number'}
                    placeHolder='Other Mobile Number'
                    readOnly={isEdit}
                    value={data.benothermobile}
                    receive={(e) => { receive({ name: 'benothermobile', value: e }) }}
                    category={'marketing'}
                    rendered={rendered}
                    required={false}
                />
                <LabeledInput_Numeric
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label='font-bold'
                    label={<>Dependents <span className="text-red-500">*</span></>}
                    digits={2}
                    placeHolder='No. of Dependents'
                    value={data.bendependents}
                    receive={(e) => receive({ name: 'bendependents', value: e })}
                    readOnly={isEdit}
                    rendered={rendered}
                />
                <LabeledSelect
                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                    className_label={'font-bold'}
                    className_dsub={''}
                    label={<>Marital Status <span className="text-red-500">*</span></>}
                    placeHolder='Marital Status'
                    disabled={isEdit}
                    //value={data.benmstatus}
                    value={data.benmstatus}
                    data={MaritalStatus()}
                    receive={(e) => { receive({ name: 'benmstatus', value: e }) }}
                    category={'marketing'}
                    showSearch
                    rendered={rendered}
                />
                {(data.benmstatus === 2 || data.benmstatus === 5 || data.benmstatus === 6) ? (
                    <>
                        <LabeledInput_Fullname
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            label={<>Spouse Name <span className="text-red-500">*</span></>}
                            placeHolder='Spouse Name'
                            readOnly={isEdit}
                            category={'marketing'}
                            receive={(e) => receive({ name: 'benspouse', value: e })}
                            value={data.benspouse}
                            rendered={rendered}
                            disabled={User === 'Credit' && data.MarriedPBCB}
                        />
                        <DatePickerOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Spouse Birthdate <span className="text-red-500">*</span></>}
                            placeHolder='Enter Birthdate'
                            receive={(e) => { receive({ name: 'benspousebdate', value: e }) }}

                            value={data.benspousebdate}
                            isEdit={isEdit}
                            rendered={rendered}
                            notValidMsg={'Birthdate Required'}
                            KeyName={'benspousebdate'}
                            category={'marketing'}
                            disabled={User === 'Credit' && data.MarriedPBCB}

                        />

                        {User === 'Credit' && (
                            <LabeledSelect
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>Spouse Source of Income <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Source of Income'
                                disabled={isEdit}
                                value={data.BenSpSrcIncome}
                                data={SpouseSourceIncome()}
                                receive={(e) => receive({ name: 'BenSpSrcIncome', value: e })}
                                rendered={rendered}
                            />)}
                        {User === 'Credit' && (
                            <LabeledInput_Salary
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>Spouse Income <span className="text-red-500">*</span></>}
                                placeHolder='Spouse Income'
                                readOnly={isEdit}
                                value={data.BenSpIncome}
                                receive={(e) => receive({ name: 'BenSpIncome', value: e })}
                                category={'direct'}
                                rendered={rendered}
                            />)}
                    </>
                ) : null}
                {User === 'Credit' ? (
                    <div className="mt-5 w-[18.75rem] h-[3.875rem">
                        <label className="font-bold">Facebook Name / Profile<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className={`w-full p-2 border rounded-lg border-gray-300 ${!isEdit && data.benfblink && data.benfblink.startsWith('https://')
                                ? 'text-blue-500 underline'
                                : 'text-black'
                                }`}
                            placeholder="Facebook Name / Profile"
                            value={data.benfblink || ''}
                            readOnly={isEdit}
                            onClick={(e) => {
                                if (!isEdit && data.benfblink && data.benfblink.startsWith('https://')) {
                                    e.preventDefault();
                                    window.open(
                                        data.benfblink,
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
                                    receive({ name: 'benfblink', value: formattedValue });
                                }
                            }}
                        />
                    </div>
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
                            receive({ name: 'benfblink', value: formattedValue });
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
                        receive={(e) => receive({ name: 'BenGrpChat', value: e })}
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
                        value={data.benrelationship}
                        receive={(e) => receive({ name: 'benrelationship', value: e })}
                        category={'marketing'}
                        disabled={isEdit}
                        isEdit={isEdit}
                        rendered={rendered}
                        showSearch
                    />)}
                {User === 'Credit' && (
                    <LabeledSelect
                        className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                        className_label='font-bold'
                        label={<>Source of Income <span className="text-red-500">*</span></>}
                        placeHolder='Please select'
                        data={SpouseSourceIncome()}
                        value={data.BenSrcIncome}
                        receive={(e) => receive({ name: 'BenSrcIncome', value: e })}
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
                        value={data.BenReligion}
                        receive={(e) => receive({ name: 'BenReligion', value: e })}
                        showSearch
                        disabled={isEdit}
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
                            value={data.BenFormerOFW}
                            receive={(e) => {
                                receive({ name: 'BenFormerOFW', value: e });
                                if (e === 1) {
                                    receive({ name: 'BenLastReturn', value: '' });
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
                                receive={(e) => receive({ name: 'BenLastReturn', value: e })}
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
                            label={<>Plans to Abroad <span className="text-red-500">*</span></>}
                            placeHolder='Please select'
                            data={Overseas()}
                            value={data.BenPlanAbroad}
                            receive={(e) => {
                                receive({ name: 'BenPlanAbroad', value: e });
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
                                receive={(e) => receive({ name: 'BenRemarks', value: e })}
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
                        receive={(e) => receive({ name: 'BenPEP', value: e })}
                        disabled={isEdit}
                        rendered={rendered}
                    />)}
            </Flex>
            <SectionHeader title="Present Address" />
            <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
                <AddressGroup_Component
                    data={data}
                    receive={(e) => { receive(e) }}
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
                    label={<>Type of Residences <span className="text-red-500">*</span></>}
                    placeHolder='Type Of Residences'
                    disabled={isEdit}
                    receive={(e) => { receive({ name: 'benresidences', value: e }) }}
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
                        receive={(e) => { receive({ name: 'BenRentAmount', value: e }) }}
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
                    receiveM={(e) => receive({ name: 'benstaymonths', value: e })}
                    receiveY={(e) => receive({ name: 'benstayyears', value: e })}
                    disabled={isEdit}
                    category="marketing"
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
                            value={data.BenLandMark}
                            receive={(e) => receive({ name: 'BenLandMark', value: e })}
                            rendered={rendered}
                        />
                        <LabeledInput_UpperCase
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                            placeHolder='Remarks'
                            readOnly={isEdit}
                            rendered={rendered}
                            value={data.BenPoBRemarks}
                            receive={(e) => receive({ name: 'BenPoBRemarks', value: e })}
                        />
                    </>
                )}
            </Flex>
            {!Sepcoborrowfname && (
                <center>
                    <div className="text-center mt-[2rem] mb-[0.25rem] w-[12.5rem]">
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
                                {!showCoBorrower ? 'Cancel' : 'Additional Co-Borrower'}
                            </Button>
                        </ConfigProvider>
                    </div>
                </center>
            )}
            {!showCoBorrower && (
                <>
                    <SectionHeader title="Additional Co-Borrower Info" />
                    <Flex className='w-full' justify='center' gap='small' wrap>
                        <LabeledInput_UpperCase
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>First Name <span className="text-red-500">*</span></>}
                            value={data.coborrowfname}
                            placeHolder='First Name'
                            receive={(e) => { receive({ name: 'coborrowfname', value: e }) }}
                            readOnly={isEdit}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledInput_NotRequired
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={'Middle Name'}
                            value={data.coborrowmname}
                            placeHolder='Middle Name'
                            receive={(e) => { receive({ name: 'coborrowmname', value: e }) }}
                            readOnly={isEdit}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledInput_UpperCase
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Last Name <span className="text-red-500">*</span></>}
                            value={data.coborrowlname}
                            placeHolder='Last Name'
                            receive={(e) => { receive({ name: 'coborrowlname', value: e }) }}
                            readOnly={isEdit}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledSelect_Suffix
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label="font-bold"
                            label={<>Suffix <span className="text-red-500">*</span></>}
                            placeHolder='Suffix'
                            value={data.coborrowsuffix}
                            receive={(e) => receive({ name: 'coborrowsuffix', value: e })}
                            disabled={isEdit}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                            showSearch
                        />

                        <DatePickerOpt
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Birthdate <span className="text-red-500">*</span></>}
                            placeHolder='Birthdate'
                            receive={(e) => {
                                receive({ name: 'coborrowbdate', value: e });
                                const age = calculateAge(e);
                                receive({ name: 'coborrowAge', value: age });
                            }}
                            value={data.coborrowbdate}
                            isEdit={isEdit}
                            rendered={rendered}
                            disabled={isEdit}
                            notValidMsg={'Birthdate Required'}
                            KeyName={'coborrowbdate'}
                            category={'marketing'}
                        />

                        {User === 'Credit' && (
                            <LabeledInput
                                className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                className_label={'font-bold'}
                                label={<>Age <span className="text-red-500">*</span></>}
                                value={calculateAge(data.coborrowbdate)}
                                readOnly={true}
                                placeHolder={'Age'}
                                rendered={rendered}
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
                            receive={(e) => { receive({ name: 'coborrowgender', value: e }) }}
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
                            receive={(e) => { receive({ name: 'coborrowemail', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledInput_Contact
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={<>Mobile Number <span className="text-red-500">*</span></>}
                            placeHolder='Mobile Number'
                            readOnly={isEdit}
                            value={data.coborrowmobile}
                            receive={(e) => { receive({ name: 'coborrowmobile', value: e }) }}
                            category={'marketing'}
                            triggerValidation={triggerValidation}
                            rendered={rendered}
                        />
                        <LabeledInput_Contact
                            className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                            className_label={'font-bold'}
                            className_dsub={''}
                            label={'Other Mobile Number'}
                            placeHolder='Other Mobile Number'
                            readOnly={isEdit}
                            value={data.coborrowothermobile}
                            receive={(e) => { receive({ name: 'coborrowothermobile', value: e }) }}
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
                            receive={(e) => { receive({ name: 'coborrowdependents', value: e }) }}
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
                            receive={(e) => { receive({ name: 'coborrowmstatus', value: e }) }}
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
                                    receive={(e) => receive({ name: 'coborrowspousename', value: e })}
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
                                    receive={(e) => { receive({ name: 'coborrowerspousebdate', value: e }) }}

                                    value={data.coborrowerspousebdate}
                                    isEdit={isEdit}
                                    rendered={rendered}
                                    disabled={isEdit}
                                    notValidMsg={'Birthdate Required'}
                                    KeyName={'coborrowerspousebdate'}
                                    category={'marketing'}
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
                                        receive={(e) => receive({ name: 'AcbSpSrcIncome', value: e })}
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
                                        receive={(e) => receive({ name: 'AcbSpIncome', value: e })}
                                        category={'direct'}
                                        rendered={rendered}
                                    />)}
                            </>
                        ) : null}
                        {User === 'Credit' ? (
                            <div className="mt-5 w-[18.75rem] h-[3.875rem">
                                <label className="font-bold">Facebook Name / Profile <span className="text-red-500">*</span>
                            </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded-lg border-gray-300 ${!isEdit && data.coborrowfblink && data.coborrowfblink.startsWith('https://')
                                        ? 'text-blue-500 underline'
                                        : 'text-black'
                                        }`}
                                    placeholder="Facebook Name / Profile"
                                    value={data.coborrowfblink || ''}
                                    readOnly={isEdit}
                                    onClick={(e) => {
                                        if (!isEdit && data.coborrowfblink && data.coborrowfblink.startsWith('https://')) {
                                            e.preventDefault();
                                            window.open(
                                                data.coborrowfblink,
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
                                            receive({ name: 'coborrowfblink', value: formattedValue });
                                        }
                                    }}
                                />
                            </div>
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
                                    receive({ name: 'coborrowfblink', value: formattedValue });
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
                                receive={(e) => receive({ name: 'AcbGrpChat', value: e })}
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
                                receive={(e) => receive({ name: 'AcbRelationship', value: e })}
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
                                receive={(e) => receive({ name: 'AcbSrcIncome', value: e })}
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
                                receive={(e) => receive({ name: 'AcbReligion', value: e })}
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
                                        receive({ name: 'AcbFormerOFW', value: e });
                                        if (e === 1) {
                                            receive({ name: 'AcbLastReturn', value: '' });
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
                                        receive={(e) => receive({ name: 'AcbLastReturn', value: e })}
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
                                    label={<>Plans to Abroad <span className="text-red-500">*</span></>}
                                    placeHolder='Please select'
                                    data={Overseas()}
                                    value={data.AcbPlanAbroad}
                                    receive={(e) => {
                                        receive({ name: 'AcbPlanAbroad', value: e });
                                        if (e === 1) {
                                            receive({ name: 'AcbRemarks', value: '' });
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
                                        receive={(e) => receive({ name: 'AcbRemarks', value: e })}

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
                                receive={(e) => receive({ name: 'AcbPEP', value: e })}
                                rendered={rendered}

                            />)}
                    </Flex>
                    <SectionHeader title="Present Address" />
                    <Flex className='w-full' justify='center' gap='small' wrap>
                        <AddressGroup_Component
                            data={data}
                            receive={(e) => { receive(e) }}
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
                            label={<>Type of Residences <span className="text-red-500">*</span></>}
                            placeHolder='Type Of Residences'
                            disabled={isEdit}
                            receive={(e) => { receive({ name: 'coborrowresidences', value: e }) }}
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
                                receive={(e) => { receive({ name: 'AcbRentAmount', value: e }) }}
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
                            receiveM={(e) => receive({ name: 'AcbStayMonths', value: e })}
                            receiveY={(e) => receive({ name: 'AcbStayYears', value: e })}
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
                                    receive={(e) => receive({ name: 'AcbLandMark', value: e })}
                                    rendered={rendered}
                                />
                                <LabeledInput_UpperCase
                                    className_dmain='mt-5 w-[18.75rem] h-[3.875rem]'
                                    className_label={'font-bold'}
                                    label={<>Proof of Billing Remarks <span className="text-red-500">*</span></>}
                                    placeHolder='Remarks'
                                    readOnly={isEdit}
                                    value={data.AcbPoBRemarks}
                                    receive={(e) => receive({ name: 'AcbPoBRemarks', value: e })}
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
