import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { Descriptions } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import { Gender, MaritalStatus, Residences,Overseas,SpouseSourceIncome ,Religion } from '@utils/FixedData';
import { mmddyy } from '@utils/Converter';

function ViewBeneficiaryDetails({ data, Sepcoborrowfname, User}) {
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
    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function formatToTwoDecimalPlaces(num) {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    }
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
   
    // Beneficiary Information
    const beneficiaryItems = [
        { key: '1', label: <span className={`font-semibold ${data.benfname ? 'text-black' : 'text-orange-500'}`}>First Name</span>, children: data.benfname || '' },
        { key: '2', label: <span className='font-semibold text-black'>Middle Name</span>, children: data.benmname || '' },
        { key: '3', label: <span className={`font-semibold ${data.benlname ? 'text-black' : 'text-orange-500'}`}>Last Name</span>, children: data.benlname || '' },
        { key: '4', label: <span className={`font-semibold ${data.bensuffix ? 'text-black' : 'text-orange-500'}`}>Suffix</span>, children: suffixOption?.find(suffix => suffix.code === data.bensuffix)?.description || '' },
        { key: '5', label: <span className={`font-semibold ${data.benbdate ? 'text-black' : 'text-orange-500'}`}>Birthdate</span>, children: data.benbdate ? mmddyy(data.benbdate, 'MM-DD-YYYY') : '' },
        (User === 'Credit' || User === 'Lp') && { key: '5', label: <span className={`font-semibold ${data.benbdate ? 'text-black' : 'text-orange-500'}`}>Age</span>, children: data.benbdate ? calculateAge(data.benbdate) : ''},
        { key: '6', label: <span className={`font-semibold ${data.bengender ? 'text-black' : 'text-orange-500'}`}>Gender</span>, children: Gender().find(gender => gender.value === data.bengender)?.label || '' },
        { key: '7', label: <span className={`font-semibold ${data.benemail ? 'text-black' : 'text-orange-500'}`}>Email Address</span>, children: data.benemail || '' },
        { key: '8', label: <span className={`font-semibold ${data.benmobile ? 'text-black' : 'text-orange-500'}`}>Mobile Number</span>, children: data.benmobile || '' },
        { key: '9', label: <span className='font-semibold text-black'>Other Number</span>, children: data.benothermobile || '' },
        { key: '10', label: <span className={`font-semibold ${data.benfblink ? 'text-black' : 'text-orange-500'}`}>Facebook Name / Profile</span>, children: data.benfblink || '' },
        (User === 'Credit' || User === 'Lp') && { key: '11', label: <span className={`font-semibold ${data.BenGrpChat ? 'text-black' : 'text-orange-500'}`}>Group Chat</span>, children: data.BenGrpChat || '' },
         User !== 'LC' && { key: '12', label: <span className={`font-semibold ${data.benrelationship ? 'text-black' : 'text-orange-500'}`}>Relationship to OFW</span>, children: relationshipOptions?.find(relationship => relationship.code === data.benrelationship)?.description || '' },
         (User === 'Credit' || User === 'Lp') && { key: '13', label: <span className={`font-semibold ${data.BenSrcIncome ? 'text-black' : 'text-orange-500'}`}>Source of Income</span>, children:SpouseSourceIncome().find(BenSrcIncome => BenSrcIncome.value === data.BenSrcIncome)?.label || '' },
         (User === 'Credit' || User === 'Lp') && { key: '14', label: <span className={`font-semibold ${data.BenReligion ? 'text-black' : 'text-orange-500'}`}>Religion</span>,  children: Religion().find(x => x.value === data.BenReligion)?.label || '' },
         (User === 'Credit' || User === 'Lp') && { key: '15', label: <span className={`font-semibold ${data.BenFormerOFW ? 'text-black' : 'text-orange-500'}`}>Former OFW (Overseas Filipino Worker)</span>, children: Overseas().find(BenFormerOFW => BenFormerOFW.value === data.BenFormerOFW)?.label || '' },
         data.BenFormerOFW === 1 && (User === 'Credit' || User === 'Lp') && {key: '16', label: <span className={`font-semibold ${data.BenLastReturn ? 'text-black' : 'text-orange-500'}`}>When was your last return home?</span>, children: data.BenLastReturn || ''},
         (User === 'Credit' || User === 'Lp') && { key: '17', label: <span className={`font-semibold ${data.BenPlanAbroad ? 'text-black' : 'text-orange-500'}`}>Plans to Abroad</span>, children: Overseas().find(BenPlanAbroad => BenPlanAbroad.value === data.BenPlanAbroad)?.label || '' },
         data.BenPlanAbroad === 1 && (User === 'Credit' || User === 'Lp') && {key: '18', label: <span className='font-semibold text-black'>Remarks</span>, children: data.BenRemarks || ''},
         (User === 'Credit' || User === 'Lp') && { key: '19', label: <span className={`font-semibold ${data.BenPEP ? 'text-black' : 'text-orange-500'}`}>PEP</span>, children: Overseas().find(BenPEP => BenPEP.value === data.BenPEP)?.label || '' },
        { key: '20', label: <span className={`font-semibold ${data.bendependents ? 'text-black' : 'text-orange-500'}`}>Dependents</span>, children: data.bendependents || '' },
        { key: '21', label: <span className={`font-semibold ${data.benmstatus ? 'text-black' : 'text-orange-500'}`}>Marital Status</span>, children: MaritalStatus().find(status => status.value === data.benmstatus)?.label || '' },
    ].filter(Boolean);

    const beneficiaryAddressItems = [
        { key: '26', label: <span className={`font-semibold ${data.benpresprovname ? 'text-black' : 'text-orange-500'}`}>Present Area/Province</span>, children: data.benpresprovname || '' },
        { key: '27', label: <span className={`font-semibold ${data.benpresmunicipalityname ? 'text-black' : 'text-orange-500'}`}>Present City/Municipality</span>, children: data.benpresmunicipalityname || '' },
        { key: '28', label: <span className={`font-semibold ${data.benpresbarangayname ? 'text-black' : 'text-orange-500'}`}>Present Barangay</span>, children: data.benpresbarangayname || '' },
        { key: '29', label: <span className={`font-semibold ${data.benpresstreet ? 'text-black' : 'text-orange-500'}`}>Present Street</span>, children: data.benpresstreet || '' },
        { key: '30', label: (<span className={`font-semibold ${data.benstaymonths || data.benstayyears ? 'text-black' : 'text-orange-500'}`}> Length of Stay</span> ),children: `${data.benstayyears ? `${data.benstayyears} years` : ''}${ data.benstaymonths || data.benstaymonths === 0 ? ` / ${data.benstaymonths} months` : ''}`},
        { key: '31', label: <span className={`font-semibold ${data.benresidences ? 'text-black' : 'text-orange-500'}`}>Type of Residences</span>, children: Residences().find(residence => residence.value === data.benresidences)?.label || '' },
        (User === 'Credit' || User === 'Lp') && { key: '33', label: <span className={`font-semibold ${data.BenLandMark ? 'text-black' : 'text-orange-500'}`}>Landmark</span>, children: data.BenLandMark || '' },
        (User === 'Credit' || User === 'Lp') && { key: '34', label: <span className={`font-semibold ${data.BenPoBRemarks ? 'text-black' : 'text-orange-500'}`}>Proof of Billing Remarks</span>, children: data.BenPoBRemarks || '' },     
    ].filter(Boolean);

    if (data.benresidences === 3) {
        beneficiaryAddressItems.push({
            key: '32',
            label: <span className={`font-semibold ${data.BenRentAmount ? 'text-black' : 'text-orange-500'}`}>Rent Amount</span>,
            children: data.BenRentAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.BenRentAmount)) : '',
        });
    } else if (data.benresidences === 2) {
        beneficiaryAddressItems.push({
            key: '32',
            label: <span className={`font-semibold ${data.BenRentAmount ? 'text-black' : 'text-orange-500'}`}>Monthly Amortization</span>,
            children: data.BenRentAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.BenRentAmount)) : '',
        });
    }
    if (data.benmstatus === 2 || data.benmstatus === 5 || data.benmstatus === 6) {
        beneficiaryItems.push(
            { key: '22', label: <span className={`font-semibold ${data.benspouse ? 'text-black' : 'text-orange-500'}`}>Spouse Name</span>, children: data.benspouse || '' },
            { key: '23', label: <span className={`font-semibold ${data.benspousebdate ? 'text-black' : 'text-orange-500'}`}>Spouse Birthdate</span>, children: data.benspousebdate ? mmddyy(data.benspousebdate, 'MM-DD-YYYY') : '' },
            (User === 'Credit' || User === 'Lp') && { key: '24', label: <span className={`font-semibold ${data.BenSpSrcIncome ? 'text-black' : 'text-orange-500'}`}>Spouse Source of Income</span>, children: SpouseSourceIncome().find(status => status.value === data.BenSpSrcIncome)?.label || '' },
            (User === 'Credit' || User === 'Lp') && { key: '25', label: <span className={`font-semibold ${data.BenSpIncome ? 'text-black' : 'text-orange-500'}`}>Spouse Income</span>, children: formatNumberWithCommas(formatToTwoDecimalPlaces(data.BenSpIncome)).toString() },
        );
    }

    // Co-Borrower Information
    const coBorrowerItems = [
        { key: '1', label: <span className='font-semibold text-black'>First Name</span>, children: data.coborrowfname || '' },
        { key: '2', label: <span className='font-semibold text-black'>Middle Name</span>, children: data.coborrowmname || '' },
        { key: '3', label: <span className='font-semibold text-black'>Last Name</span>, children: data.coborrowlname || '' },
        { key: '4', label: <span className='font-semibold text-black'>Suffix</span>, children: suffixOption?.find(suffix => suffix.code === data.coborrowsuffix)?.description || '' },
        { key: '5', label: <span className='font-semibold text-black'>Birthdate</span>, children: data.coborrowbdate ? mmddyy(data.coborrowbdate, 'MM-DD-YYYY') : '' },
        (User === 'Credit' || User === 'Lp') && { key: '6', label: <span className="font-semibold text-black">Age</span>, children: data.coborrowbdate ? calculateAge(data.coborrowbdate) : ''},
        { key: '7', label: <span className='font-semibold text-black'>Gender</span>, children: Gender().find(gender => gender.value === data.coborrowgender)?.label || '' },
        { key: '8', label: <span className='font-semibold text-black'>Mobile Number</span>, children: data.coborrowmobile ? data.coborrowmobile.replace('/','-') : '' },
        { key: '9', label: <span className='font-semibold text-black'>Other Mobile Number</span>, children: data.coborrowothermobile? data.coborrowothermobile.replace('/','-') : '' },
        { key: '10', label: <span className='font-semibold text-black'>Email Address</span>, children: data.coborrowemail || '' },
        { key: '11', label: <span className='font-semibold text-black'>Facebook Name / Profile</span>, children: data.coborrowfblink || '' },
        (User === 'Credit' || User === 'Lp') && { key: '12', label: <span className="font-semibold text-black">Group Chat</span>, children: data.AcbGrpChat || '' },
        User !== 'LC' && { key: '13', label: <span className="font-semibold text-black">Relationship to OFW</span>, children: relationshipOptions?.find(relationship => relationship.code === data.AcbRelationship)?.description || '' },
        (User === 'Credit' || User === 'Lp') && { key: '14', label: <span className='font-semibold text-black'>Source of Income</span>, children: SpouseSourceIncome().find(AcbSrcIncome => AcbSrcIncome.value === data.AcbSrcIncome)?.label || '' },
        (User === 'Credit' || User === 'Lp') && { key: '15', label: <span className='font-semibold text-black'>Religion</span>, children: Religion().find(AcbReligion => AcbReligion.value === data.AcbReligion)?.label || '' },
        (User === 'Credit' || User === 'Lp') && { key: '16', label: <span className='font-semibold text-black'>Former OFW (Overseas Filipino Worker)</span>, children: Overseas().find(AcbFormerOFW => AcbFormerOFW.value === data.AcbFormerOFW)?.label || '' },
        data.AcbFormerOFW === 1 && (User === 'Credit' || User === 'Lp') && {key: '17', label: <span className='font-semibold text-black'>When was your last return home?</span>, children: data.AcbLastReturn || ''},
        (User === 'Credit' || User === 'Lp') && { key: '18', label: <span className='font-semibold text-black'>Plans to Abroad</span>, children: Overseas().find(AcbPlanAbroad => AcbPlanAbroad.value === data.AcbPlanAbroad)?.label || '' },
        data.AcbPlanAbroad === 1 && (User === 'Credit' || User === 'Lp') && {key: '19', label: <span className='font-semibold text-black'>Remarks</span>, children: data.AcbRemarks || ''},
        (User === 'Credit' || User === 'Lp') && { key: '20', label: <span className='font-semibold text-black'>PEP</span>, children: Overseas().find(AcbPEP => AcbPEP.value === data.AcbPEP)?.label || '' },
        { key: '21', label: <span className='font-semibold text-black'>Dependents</span>, children: data.coborrowdependents || '' },
        { key: '22', label: <span className='font-semibold text-black'>Marital Status</span>, children: MaritalStatus().find(status => status.value === data.coborrowmstatus)?.label || '' }
    ].filter(Boolean);

    if (data.coborrowmstatus === 2 || data.coborrowmstatus === 5 || data.coborrowmstatus === 6) {
        coBorrowerItems.push(
            { key: '23', label: <span className='font-semibold text-black'>Spouse Name</span>, children: data.coborrowspousename || '' },
            { key: '24', label: <span className='font-semibold text-black'>Spouse Birthdate</span>, children: data.coborrowerspousebdate ? mmddyy(data.coborrowerspousebdate, 'MM-DD-YYYY') : '' },
            (User === 'Credit' || User === 'Lp') && { key: '25', label: <span className="font-semibold text-black">Spouse Source of Income</span>, children: SpouseSourceIncome().find(AcbSpSrcIncome => AcbSpSrcIncome.value === data.AcbSpSrcIncome)?.label || '' },
            (User === 'Credit' || User === 'Lp') && { key: '26', label: <span className="font-semibold text-black">Spouse Income</span>, children: formatNumberWithCommas(formatToTwoDecimalPlaces(data.AcbSpIncome)).toString() },
        );
    }

    const coBorrowerAddressItems = [
        { key: '27', label: <span className='font-semibold text-black'>Present Area/Province</span>, children: data.coborrowProvname|| '' },
        { key: '28', label: <span className='font-semibold text-black'>Present City/Municipality</span>, children: data.coborrowMunicipalityname || '' },
        { key: '29', label: <span className='font-semibold text-black'>Present Barangay</span>, children: data.coborrowBarangayname || '' },
        { key: '30', label: <span className='font-semibold text-black'>Present Street</span>, children: data.coborrowStreet || '' },
        { key: '31', label: (<span className='font-semibold text-black'> Length of Stay</span> ),children: `${data.AcbStayYears ? `${data.AcbStayYears} years` : ''}${ data.AcbStayMonths || data.AcbStayMonths === 0 ? ` / ${data.AcbStayMonths} months` : ''}`},
        (User === 'Credit' || User === 'Lp') && { key: '32', label: <span className='font-semibold text-black'>Landmark</span>, children: data.AcbLandMark || '' },
        (User === 'Credit' || User === 'Lp') && { key: '33', label: <span className='font-semibold text-black'>Proof of Billing Remarks</span>, children: data.AcbPoBRemarks || '' },
        { key: '34', label: <span className='font-semibold text-black'>Type of Residences</span>, children: Residences().find(residence => residence.value === data.coborrowresidences)?.label || '' },
        data.coborrowresidences === 3 && { key: '35', label: <span className='font-semibold text-black'>Rent Amount</span>, children: formatNumberWithCommas(formatToTwoDecimalPlaces(data.AcbRentAmount)).toString() },

    ];

    const filteredCoBorrowerItems = coBorrowerItems.filter(field => field.children && field.children !== '');
    const filteredCoBorrowerAddressItems = coBorrowerAddressItems.filter(field => field.children && field.children !== '');

    return (
        <div className="w-full mx-auto mt-1 mb-20 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-white rounded-xl shadow-lg">
            <Descriptions title={<div className="text-center"><h2 className="text-2xl font-bold">Beneficiary Information</h2>
                <div className="mt-2 flex justify-center">
                <a href={`https://www.google.com/search?q=${encodeURIComponent(`${data.benfname} ${data.benmname} ${data.benlname}`)}`} target="_blank" rel="noopener noreferrer"><FcGoogle className="text-3xl" /></a></div></div>}
                column={{ xs: 1, sm: 2, lg: 3 }}
                layout="horizontal" >
                {beneficiaryItems.map((item, i) => (
                    <Descriptions.Item key={i + 1} label={item.label}>
                        {item.children}
                    </Descriptions.Item>))}
            </Descriptions>
            <Descriptions title={<h2 className="text-2xl font-bold text-center mt-5">Beneficiary Address Information</h2>} column={3}>
            {   beneficiaryAddressItems.map((item, i) => (
                    <Descriptions.Item key={i + 1} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            {filteredCoBorrowerItems.length > 0 && (
                <>
                    <Descriptions title={<div className="text-center"><h2 className="text-2xl font-bold mt-5">Co-borrow Information</h2>
                        <div className="mt-2 flex justify-center">
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(`${data.coborrowfname} ${data.coborrowmname} ${data.coborrowlname}`)}`} target="_blank" rel="noopener noreferrer"><FcGoogle className="text-3xl" /></a></div></div>}
                        column={{ xs: 1, sm: 2, lg: 3 }}
                        layout="horizontal" >
                            {filteredCoBorrowerItems.map((item, i) => (
                                <Descriptions.Item key={i + 1} label={item.label}>
                                    {item.children}
                                </Descriptions.Item>
                            ))}
                    </Descriptions>

                    {filteredCoBorrowerAddressItems.length > 0 && (
                        <Descriptions title={<h2 className="text-2xl font-bold text-center mt-5">Co-Borrower Address Information</h2>} column={3}>
                            {filteredCoBorrowerAddressItems.map((item, i) => (
                                <Descriptions.Item key={i + 1} label={item.label}>
                                    {item.children}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    )}
                </>
            )}
        </div>
    );
}

export default ViewBeneficiaryDetails;
