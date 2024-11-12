import React, { useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Descriptions, Checkbox } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { mmddyy, ReturnText } from '@utils/Converter';
import { Gender, MaritalStatus, Residences, EducationalAttainment, Overseas, SpouseSourceIncome, Religion, AllotChannel, JobTitle, JobCategory } from '@utils/FixedData';
import { useDataContainer } from '@context/PreLoad';

function ViewOfwDetails({ data, User, RelativesCount, receive }) {
    useEffect(() => {
        if (User != 'LC' && (data.ofwdependents !== RelativesCount)) {
            receive({ name: 'ofwdependents', value: RelativesCount });
        }
    }, [RelativesCount, data.ofwdependents]);

    const { data: relationshipOptions } = useQuery({
        queryKey: ['getRelationship'],
        queryFn: async () => {
            const result = await GET_LIST('/getListRelationship');
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        enabled: true,
        retryDelay: 1000,
    });

    const { data: suffixOption } = useQuery({
        queryKey: ['getSuffix'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/GetSuffix');
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        enabled: true,
        retryDelay: 1000,
    });

    const { data: IDtypeOption } = useQuery({
        queryKey: ['getValidIdSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/getIDtype');
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        enabled: true,
        retryDelay: 1000,
    });
    const { GET_COUNTRY_LIST, GET_CURRENCY_LIST } = useDataContainer();

    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    function formatToTwoDecimalPlaces(num) {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    }
    function calculateAge(birthDate) {
        if (!birthDate) return '';
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    }



    const items = [
        { key: '1', label: <span className={`font-semibold ${data.ofwfname ? 'text-black' : 'text-orange-500'}`}>First Name</span>, children: data.ofwfname || '' },
        { key: '2', label: <span className="font-semibold text-black">Middle Name</span>, children: data.ofwmname || '' },
        { key: '3', label: <span className={`font-semibold ${data.ofwlname ? 'text-black' : 'text-orange-500'}`}>Last Name</span>, children: data.ofwlname || '' },
        { key: '4', label: <span className={`font-semibold ${data.ofwsuffix ? 'text-black' : 'text-orange-500'}`}>Suffix</span>, children: suffixOption?.find(suffix => suffix.code === data.ofwsuffix)?.description || '' },
        { key: '5', label: <span className={`font-semibold ${data.ofwbdate ? 'text-black' : 'text-orange-500'}`}>Birthdate</span>, children: data.ofwbdate ? mmddyy(data.ofwbdate, 'MM-DD-YYYY') : '' },
        (User === 'Credit' || User === 'Lp') && { key: '6', label: <span className={`font-semibold ${data.ofwbdate ? 'text-black' : 'text-orange-500'}`}>Age</span>, children: data.ofwbdate ? calculateAge(data.ofwbdate) : '' },
        { key: '7', label: <span className={`font-semibold ${data.ofwgender ? 'text-black' : 'text-orange-500'}`}>Gender</span>, children: Gender().find(gender => gender.value === data.ofwgender)?.label || '' },
        { key: '8', label: <span className={`font-semibold ${data.ofwmobile ? 'text-black' : 'text-orange-500'}`}>Mobile Number</span>, children: data.ofwmobile ? data.ofwmobile.replace('/', '-') : '' },

        User !== 'LC' && { key: '9', label: <span className="font-semibold text-black">Other Mobile Number</span>, children: data.ofwothermobile || '' },
        { key: '10', label: <span className={`font-semibold ${data.ofwemail ? 'text-black' : 'text-orange-500'}`}>Email Address</span>, children: data.ofwemail || '' },
        { key: '11', label: <span className={`font-semibold ${data.ofwfblink ? 'text-black' : 'text-orange-500'}`}>Facebook Name / Profile</span>, children: ReturnText(data.ofwfblink) || '' },
        User !== 'LC' && { key: '12', label: <span className={`font-semibold ${data.ofwgroupchat ? 'text-black' : 'text-orange-500'}`}>Group Chat</span>, children: data.ofwgroupchat || '' },
        (User === 'Credit' || User === 'Lp') && { key: '13', label: <span className={`font-semibold ${data.RelationshipBen ? 'text-black' : 'text-orange-500'}`}>Relationship to Beneficiary</span>, children: relationshipOptions?.find(relationship => relationship.code === data.RelationshipBen)?.description || '' },
        (User === 'Credit' || User === 'Lp') && data.sepcoborrowfname && { key: '14', label: <span className={`font-semibold ${data.RelationshipAdd ? 'text-black' : 'text-orange-500'}`}>Relationship to Additional Co Borrower</span>, children: relationshipOptions?.find(relationship => relationship.code === data.RelationshipAdd)?.description || '' },
        (User === 'Credit' || User === 'Lp') && { key: '15', label: <span className={`font-semibold ${data.Religion ? 'text-black' : 'text-orange-500'}`}>Religion</span>, children: Religion().find(ofwReligion => ofwReligion.value === data.Religion)?.label || '' },
        (User === 'Credit' || User === 'Lp') && { key: '16', label: <span className={`font-semibold ${data.PEP ? 'text-black' : 'text-orange-500'}`}>PEP</span>, children: Overseas().find(ofwPEP => ofwPEP.value === data.PEP)?.label || '' },
        { key: '17', label: <span className="font-semibold text-black">Dependents</span>, children: data.ofwdependents !== undefined ? data.ofwdependents : '' },
        { key: '18', label: <span className={`font-semibold ${data.ofwmstatus ? 'text-black' : 'text-orange-500'}`}>Marital Status</span>, children: MaritalStatus().find(status => status.value === data.ofwmstatus)?.label || '' },
        { key: '23', label: <span className={`font-semibold ${data.ofwresidences ? 'text-black' : 'text-orange-500'}`}>Type of Residences</span>, children: Residences().find(residence => residence.value === data.ofwresidences)?.label || '' },
    ];

    if (data.ofwresidences === 3) {
        items.push({
            key: '24',
            label: <span className={`font-semibold ${data.ofwrent ? 'text-black' : 'text-orange-500'}`}>Rent Amount</span>,
            children: data.ofwrent ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.ofwrent.toString().replaceAll(',',''))) : '',
        });
    } else if (data.ofwresidences === 2) {
        items.push({
            key: '24',
            label: <span className={`font-semibold ${data.ofwrent ? 'text-black' : 'text-orange-500'}`}>Monthly Amortization</span>,
            children: data.ofwrent ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.ofwrent.toString().replaceAll(',',''))) : '',
        });
    }
    if (data.ofwmstatus === 2 || data.ofwmstatus === 5 || data.ofwmstatus === 6) {
        items.push(
            User !== 'LC' && { key: '19', label: <span className={`font-semibold ${data.ofwspouse ? 'text-black' : 'text-orange-500'}`}>Spouse Name</span>, children: data.ofwspouse || '' },
            User !== 'LC' && { key: '20', label: <span className={`font-semibold ${data.ofwspousebdate ? 'text-black' : 'text-orange-500'}`}>Spouse Birthdate</span>, children: data.ofwspousebdate ? mmddyy(data.ofwspousebdate) : '' },
            (User === 'Credit' || User === 'Lp') && { key: '21', label: <span className={`font-semibold ${data.SpSrcIncome ? 'text-black' : 'text-orange-500'}`}>Spouse Source of Income</span>, children: SpouseSourceIncome().find(status => status.value === data.SpSrcIncome)?.label || '' },
            (User === 'Credit' || User === 'Lp') && { key: '22', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Spouse Income</span>, children: formatNumberWithCommas(formatToTwoDecimalPlaces(data.SpIncome)).toString() },
        );
    }

    const addressItems = [
        { key: '25', label: <span className={`font-semibold ${data.ofwPresProvname ? 'text-black' : 'text-orange-500'}`}>Present Area/Province</span>, children: data.ofwPresProvname || '' },
        { key: '26', label: <span className={`font-semibold ${data.ofwPresMunicipalityname ? 'text-black' : 'text-orange-500'}`}>Present City/Municipality</span>, children: data.ofwPresMunicipalityname || '' },
        { key: '27', label: <span className={`font-semibold ${data.ofwPresBarangayname ? 'text-black' : 'text-orange-500'}`}>Present Barangay</span>, children: data.ofwPresBarangayname || '' },
        { key: '28', label: <span className={`font-semibold ${data.ofwPresStreet ? 'text-black' : 'text-orange-500'}`}>Present Street</span>, children: data.ofwPresStreet || '' },
        User !== 'LC' && { key: '29', label: <span className={`font-semibold ${data.landmark ? 'text-black' : 'text-orange-500'}`}>Landmark</span>, children: data.landmark || '' },
        (User === 'Credit' || User === 'Lp') && { key: '30', label: <span className={`font-semibold ${data.OfwPoBRemarks ? 'text-black' : 'text-orange-500'}`}>Proof of Billing Remarks</span>, children: data.OfwPoBRemarks || '' },
        User !== 'LC' && { key: '31', label: (<span className={`font-semibold ${data.ofwlosMonth || data.ofwlosYear ? 'text-black' : 'text-orange-500'}`}> Length of Stay </span>), children: `${ data.ofwlosYear > 0 ? `${data.ofwlosYear} Year(s)` :`` } ${(data.ofwlosYear > 0 && data.ofwlosMonth >= 1 ) ? ' / ' : ``} ${data.ofwlosMonth > 0 ? `${data.ofwlosMonth} Month(s)` : ``}` },
        User !== 'LC' && { key: '32', label: <span className={`font-semibold ${data.collectionareaname ? 'text-black' : 'text-orange-500'}`}>Collection Area</span>, children: data.collectionareaname || '' },
        User !== 'LC' && { key: '33', label: <span className={`font-semibold ${data.ofwPermProvname ? 'text-black' : 'text-orange-500'}`}>Permanent Area/Province</span>, children: data.ofwPermProvname || '' },
        User !== 'LC' && { key: '34', label: <span className={`font-semibold ${data.ofwPermMunicipalityname ? 'text-black' : 'text-orange-500'}`}>Permanent City/Municipality</span>, children: data.ofwPermMunicipalityname || '' },
        User !== 'LC' && { key: '35', label: <span className={`font-semibold ${data.ofwPermBarangayname ? 'text-black' : 'text-orange-500'}`}>Permanent Barangay</span>, children: data.ofwPermBarangayname || '' },
        User !== 'LC' && { key: '36', label: <span className={`font-semibold ${data.ofwPermStreet ? 'text-black' : 'text-orange-500'}`}>Permanent Street</span>, children: data.ofwPermStreet || '' },
        User !== 'LC' && { key: '37', label: <span className={`font-semibold ${data.ofwprovProvname ? 'text-black' : 'text-orange-500'}`}>Provincial Area/Province</span>, children: data.ofwprovProvname || '' },
        User !== 'LC' && { key: '38', label: <span className={`font-semibold ${data.ofwprovMunicipalityname ? 'text-black' : 'text-orange-500'}`}>Provincial City/Municipality</span>, children: data.ofwprovMunicipalityname || '' },
        User !== 'LC' && { key: '39', label: <span className={`font-semibold ${data.ofwprovBarangayname ? 'text-black' : 'text-orange-500'}`}>Provincial Barangay</span>, children: data.ofwprovBarangayname || '' },
        User !== 'LC' && { key: '40', label: <span className={`font-semibold ${data.ofwprovStreet ? 'text-black' : 'text-orange-500'}`}>Provincial Street</span>, children: data.ofwprovStreet || '' },
    ];

    const idItems = [
        User !== 'LC' && { key: '41', label: <span className="font-semibold text-black">Valid ID Type</span>, children: IDtypeOption?.find(idtype => idtype.id === data.ofwvalidid)?.name || '' },
        User !== 'LC' && { key: '42', label: <span className="font-semibold text-black">ID Number</span>, children: data.ofwidnumber || '' },
        User !== 'LC' && { key: '43', label: <span className={`font-semibold ${data.ofwcountry ? 'text-black' : 'text-orange-500'}`}>Country of Employment</span>, children: GET_COUNTRY_LIST?.find(country => country.code === data.ofwcountry || country.label === data.ofwcountry)?.description || '' },
        User !== 'LC' && {
            key: '44', label: (<span className={`font-semibold ${data.ofwjobtitle ? 'text-black' : 'text-orange-500'}`}>{(User === 'Credit' || User === 'Lp') ? 'Job Category' : 'Job Title / Position'}</span>),
            children: (User === 'Credit' || User === 'Lp') ? JobCategory()?.find(jobcategory => jobcategory.value === data.JobCategory)?.label || '' : data.ofwjobtitle || ''
        },
        (User === 'Credit' || User === 'Lp') && { key: '45', label: (<span className={`font-semibold ${data.ofwjobtitle ? 'text-black' : 'text-orange-500'}`}>Position</span>), children: JobTitle(data.JobCategory)?.find(ofwjobtitle => ofwjobtitle.value === data.ofwjobtitle)?.label || '' },
        (User === 'Credit' || User === 'Lp') && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL') && { key: '46', label: <span className={`font-semibold ${data.PEmployer ? 'text-black' : 'text-orange-500'}`}>Principal Employer</span>, children: data.PEmployer || '' },
        (User !== 'LC' && ((User !== 'Credit' && User !== 'Lp') || ((User === 'Credit' || User === 'Lp') && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL')))) && {
            key: '47', label: <span className={`font-semibold ${data.ofwcompany ? 'text-black' : 'text-orange-500'}`}>
                {(User === 'Credit' || User === 'Lp') ? 'Agency' : 'Company/Employer/Agency Name'}</span>, children: data.ofwcompany || ''
        },
        // User === 'Credit' && { key: '45', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Agency Address</span>, children: data.agencyaddress || '' },
        // User === 'Credit' && { key: '46', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>License Validity</span>, children: data.license || '' },
        // User === 'Credit' && { key: '47', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Status</span>, children: data.ofwstatus || '' },
        // User === 'Credit' && { key: '48', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Contact Person</span>, children: data.ofwstatus || '' },
        // User === 'Credit' && { key: '49', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Designation</span>, children: data.designation || '' },
        (User === 'Credit' || User === 'Lp') && { key: '47', label: <span className={`font-semibold ${data.FCurrency ? 'text-black' : 'text-orange-500'}`}>Foreign Currency</span>, children: data.FCurrency ? `${GET_CURRENCY_LIST?.find(idtype => idtype.currencyCode === data.FCurrency)?.currencyName}` : '' },
        (User === 'Credit' || User === 'Lp') && { key: '48', label: <span className={`font-semibold ${data.FSalary ? 'text-black' : 'text-orange-500'}`}>Salary in Foreign Currency </span>, children: data.FSalary ? `${formatNumberWithCommas(formatToTwoDecimalPlaces(data.FSalary.toString()))} ${data.FCurrency}` : '' },
        User !== 'Credit' && { key: '71', label: <span className={`font-semibold ${data.ofwsalary ? 'text-black' : 'text-orange-500'}`}>Salary</span>, children: `${formatNumberWithCommas(formatToTwoDecimalPlaces(data.ofwsalary)).toString()}` || '' },
        User === 'Credit' && { key: '72', label: <span className={`font-semibold ${data.PSalary ? 'text-black' : 'text-orange-500'}`}>Salary in Peso</span>, children: data.PSalary ? `\u20B1 ${formatNumberWithCommas(formatToTwoDecimalPlaces(data.PSalary)).toString()}` : '' },
        (User === 'Credit' || User === 'Lp') && { key: '52', label: <span className={`font-semibold ${data.ContractDuration ? 'text-black' : 'text-orange-500'}`}>Contract Duration</span>, children: data.ContractDuration ? data.ContractDuration : '' },
        (User === 'Credit' || User === 'Lp') && (data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') && { key: '53', label: <span className={`font-semibold ${data.ofwDeptDate ? 'text-black' : 'text-orange-500'}`}>Departure Date</span>, children: data.ofwDeptDate ? mmddyy(data.ofwDeptDate) : '' },
        (User === 'Credit' || User === 'Lp') && { key: '54', label: <span className={`font-semibold ${data.YrsOfwSeafarer ? 'text-black' : 'text-orange-500'}`}>Years as OFW or Seafarer</span>, children: data.YrsOfwSeafarer || '' },
        (User === 'Credit' || User === 'Lp') && { key: '55', label: <span className={`font-semibold ${data.AllotName ? 'text-black' : 'text-orange-500'}`}>Beneficiary or Allotment Name</span>, children: data.AllotName || '' },
        //User === 'Credit' && { key: '60', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Relationship to the OFW</span>, children: data.landmark || '' },
        (User === 'Credit' || User === 'Lp') && { key: '56', label: <span className={`font-semibold ${data.AllotAmount ? 'text-black' : 'text-orange-500'}`}>Remittance or Allotment Amount</span>, children: data.AllotAmount || '' },
        //User === 'Credit' && { key: '55', label: <span className={`font-semibold ${data.SpIncome ? 'text-black' : 'text-orange-500'}`}>Remittance or Allotment Schedule</span>, children: data.ofwallotsched || '' },
        (User === 'Credit' || User === 'Lp') && { key: '57', label: <span className={`font-semibold ${data.AllotChannel ? 'text-black' : 'text-orange-500'} w-[11rem]`}>Remittance / Allotment Channel (Gcash, Bank etc)</span>, children: AllotChannel().find(AllotChannel => AllotChannel.value === data.AllotChannel)?.label || '' },
        (User === 'Credit' || User === 'Lp') && { key: '58', label: <span className="font-semibold text-black w-[8rem]">Unlimited Contract</span>, children: (<Checkbox checked={data.UnliContract}></Checkbox>) },
        (User === 'Credit' || User === 'Lp') && data.PossVacation && { key: '65', label: <span className="font-semibold text-black">Possible Vacation</span>, children: data.PossVacation }
    ];

    const eduItems = [];
    if (User === 'MARKETING' || ((User === 'Credit' || User === 'Lp') && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL'))) {
        if (User !== 'LC') {
            eduItems.push(
                { key: '59', label: <span className={`font-semibold ${data.ofwHighestEdu ? 'text-black' : 'text-orange-500'} w-[8rem]`}>Highest Educational Attainment</span>, children: EducationalAttainment().find(Edu => Edu.value === data.ofwHighestEdu)?.label || '' },
                { key: '60', label: <span className="font-semibold text-black">Course</span>, children: data.ofwcourse || '' },
                { key: '61', label: <span className="font-semibold text-black">School</span>, children: data.ofwschool || '' }
            );
        }
    }

    const vesselItems = [
        (User === 'Credit' || User === 'Lp') && { key: '62', label: <span className={`font-semibold ${data.VesselName ? 'text-black' : 'text-orange-500'}`}>Name of Vessel</span>, children: data.VesselName || '' },
        (User === 'Credit' || User === 'Lp') && { key: '63', label: <span className={`font-semibold ${data.VesselType ? 'text-black' : 'text-orange-500'}`}>Type of Vessel</span>, children: data.VesselType || '' },
        (User === 'Credit' || User === 'Lp') && { key: '64', label: <span className="font-semibold text-black">Exact Location</span>, children: data.ExactLocation || '' },
        (User === 'Credit' || User === 'Lp') && { key: '66', label: <span className={`font-semibold ${data.VesselIMO ? 'text-black' : 'text-orange-500'}`}>IMO Vessel</span>, children: data.VesselIMO || '' },
        (User === 'Credit' || User === 'Lp') && { key: '67', label: <span className="font-semibold text-black">Information of the Vessel</span>, children: data.VesselInfo || '' },

    ];

    const filteredVesselItems = vesselItems.filter(field => field.children && field.children !== '');

    return (
        <div className="w-full mx-auto mt-1 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-white rounded-xl shadow-lg">
            <Descriptions title={<div className="text-center">
                <h2 className="text-2xl font-bold">OFW Information</h2>
                <div className="mt-2 flex justify-center">
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(`${data.ofwfname} ${data.ofwmname} ${data.ofwlname}`)}`} target="_blank" rel="noopener noreferrer" > <FcGoogle className="text-3xl" /></a>
                </div>
            </div>}
                column={User === 'LC' ? { md: 2, lg: 3, xl: 4 } : { md: 1, lg: 2, xl: 3 }}
                layout="horizontal">
                {items.filter((item) => item).map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Descriptions title={<h2 className="text-2xl font-bold text-center mt-10">Address Information</h2>} column={User === 'LC' ? { md: 2, lg: 3, xl: 4 } : { md: 1, lg: 2, xl: 3 }}>
                {addressItems.filter(item => item).map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>

            <Descriptions title={<h2 className="text-2xl font-bold text-center mt-10">Other Information</h2>} column={User === 'LC' ? { md: 2, lg: 3, xl: 4 } : { md: 1, lg: 2, xl: 3 }}>
                {idItems.filter(item => item).map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            {(User === 'Credit' || User === 'Lp') && filteredVesselItems.length > 0 && (
                <Descriptions title={<h2 className="text-2xl font-bold text-center mt-5">Vessel Details</h2>} column={User === 'LC' ? { md: 2, lg: 3, xl: 4 } : { md: 1, lg: 2, xl: 3 }}>
                    {filteredVesselItems.map(item => (
                        <Descriptions.Item key={item.key} label={item.label}>
                            {item.children}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}
            {(User === 'MARKETING' || ((User === 'Credit' || User === 'Lp') && (data.loanProd === '0303-WA' || data.loanProd === '0303-WL'))) && eduItems.length > 0 && (
                <Descriptions title={<h2 className="text-2xl font-bold text-center mt-10">Education Information</h2>} column={User === 'LC' ? { md: 2, lg: 3, xl: 4 } : { md: 1, lg: 2, xl: 3 }}>
                    {eduItems.map(item => (
                        <Descriptions.Item key={item.key} label={item.label}>
                            {item.children}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            )}
        </div>
    );
}

export default ViewOfwDetails;

