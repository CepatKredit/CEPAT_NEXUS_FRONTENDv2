import React from 'react';
import { Flex } from 'antd';
import LabeledInput from '@components/marketing/LabeledInput';
import LabeledInput_Contact from '@components/marketing/LabeledInput_Contact';
import DatePicker_Deployment from '@components/marketing/DatePicker_Deployment';
import LabeledCurrencyInput from '@components/marketing/LabeledCurrencyInput';
import LabeledSelectLoanProduct from '@components/marketing/LabeledSelectLoanProduct';
import LabeledSelectLoanPurpose from '@components/marketing/LabeledSelectLoanPurpose';
import LabeledSelect from '@components/marketing/LabeledSelect';
import LabeledSelect_Consultant from '@components/marketing/LabeledSelect_Consultant';
import { LoanType, Hckfi, LoanTerms } from '@utils/FixedData';
import dayjs from 'dayjs';
import LabeledInput_NotRequired from '@components/marketing/LabeledInput_NotRequired';
import { GetData } from '@utils/UserData';
import { useDataContainer } from '@context/PreLoad';
function EditLoanDetails({ data, receive,User }) {
    const [isEdit, setEdit] = React.useState(false);
    const isFirstRender = React.useRef(true);
    const rendered = true;

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; 
            return; 
        }
        receive({name:'ofwDeptDate', value: '' })
    },[data.loanProd])
    const disableDate_deployment = React.useCallback((current) => {
        return current && current < dayjs().startOf('day');
    }, []);
 
//Preload Selects
const {GET_LOAN_PRODUCT_LIST} = useDataContainer();
const get_loan_product_list = GET_LOAN_PRODUCT_LIST?.map(x => ({ value: x.code, label: x.description })) || [];


    return (
        <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
                    {User === 'LC'
                        ? (<></>)
                        : ( <LabeledInput
                            className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                            className_label="font-bold"
                            label="Loan Application ID"
                            value={data.loanAppCode}
                            readOnly={true}
                            receive={(e) => receive({ name: 'loanIdCode', value: e })}

                        />)}
                    { User === 'LC'
                        ? (<></>)
                        : (<LabeledInput
                            className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                            className_label="font-bold"
                            label="Date of Application"
                            value={data.loanCreated}
                            readOnly={true}
                            receive={(e) => receive({ name: 'loanCreated', value: e })}
                        />)}
                     { /* User === 'LC'
                        ? (<></>)
                        : ( <LabeledInput
                            className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}

                            className_label="font-bold"
                            label="Loan Application Status"
                            value={data.loanAppStat}
                            readOnly={true}
                            receive={(e) => receive({ name: 'loanAppStat', value: e })}
                        />)*/ }
                    <LabeledSelectLoanProduct
                        className_dmain="mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]"
                        className_label="font-bold"
                        label={<>Loan Product <span className="text-red-500">*</span></>}
                        value={data.loanProd}
                        rendered={rendered}
                        showSearch
                        receive={(e) => receive({ name: 'loanProd', value: e })}
                        options={get_loan_product_list}
                    />
                        {User !== 'Credit' && (data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') ? (
                    <DatePicker_Deployment
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        className_dsub=""
                        label={<>OFW Departure Date <span className="text-red-500">*</span></>}
                        value={data.ofwDeptDate}
                        receive={(e) => {receive({ name: 'ofwDeptDate', value: e })}}
                        disabled={!isEdit && !(data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL')}
                        placeHolder="Departure Date"
                        disabledate={disableDate_deployment}
                        rendered = {rendered}
                    />
                        ) : null}
                    {User !== 'LC' && (
                    <LabeledInput
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.loanBranch}
                        receive={(e) => receive({ name: 'loanBranch', value: e })}
                        label={User === 'Credit' ? 'Loan Branch' : 'Assigned Branch'}
                        readOnly
                        category={User !== 'Credit' ? 'MARKETING' : undefined}
                        mod={User !== 'Credit' && GetData('ROLE').toString() === '20'}
                        rendered={rendered}
                    />
                )}
                    <LabeledSelect
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        label={<>Loan Application Type <span className="text-red-500">*</span></>}
                        value={data.loanType}
                        data={LoanType(true)}
                        receive={(e) => receive({ name: 'loanType', value: e })}
                        rendered = {rendered}
                    />
                    {User === 'Credit' && data.loanType === 2 && (
                    <LabeledCurrencyInput
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.PrevAmount}
                        receive={(e) => receive({ name: 'PrevAmount', value: e })}
                        label={<>Previous Approved Amount <span className="text-red-500">*</span></>}
                        placeHolder={'Previous Amount'}
                        category={'marketing'}
                        rendered={rendered}
                    />)}
                    <LabeledSelectLoanPurpose
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.loanPurpose}
                        receive={(e) => receive({ name: 'loanPurpose', value: e })}
                        label={<>Purpose <span className="text-red-500">*</span></>}
                        showSearch
                        rendered = {rendered}
                    />
                    <LabeledCurrencyInput
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.loanAmount}
                        receive={(e) => receive({ name: 'loanAmount', value: e })}
                        label={<>{User === 'Credit' ? 'Applied Loan Amount' : 'Loan Amount'} <span className="text-red-500">*</span></>}                        
                        category={'marketing'}
                        rendered = {rendered}
                    />
                    {User === 'Credit' ? (
                        <LabeledInput
                            className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                            className_label="font-bold"
                            label={<>Applied Loan Terms <span className="text-red-500">*</span></>}
                            value={data.loanTerms}
                            receive={(e) => receive({ name: 'loanTerms', value: e })}
                            placeholder="Enter Loan Terms"
                            readOnly={true} 
                            rendered={rendered}
                        />
                    ) : (
                        <LabeledSelect
                            className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}

                            className_label="font-bold"
                            label={<>Loan Terms (in Months) <span className="text-red-500">*</span></>}
                            value={data.loanTerms}
                            data={LoanTerms(24)}
                            receive={(e) => receive({ name: 'loanTerms', value: e })}
                            rendered={rendered}
                        />)}
                    {User === 'Credit' && (
                    <LabeledCurrencyInput
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.CRAApprvRec}
                        receive={(e) => receive({ name: 'CRAApprvRec', value: e })}
                        label={<>CRA Recommendation <span className="text-red-500">*</span></>}
                        placeHolder={"CRA Recommendation"}
                        category={'marketing'}
                        rendered={rendered}
                    />)}
                     {User === 'LC' 
                    ? (<></>) 
                    : (<LabeledSelect
                        className_dmain={'mt-4 w-[300px] h-[5rem] pt-2'}
                        className_label="font-bold"
                        label={<>How did you know about Cepat Kredit Financing? <span className="text-red-500">*</span></>}
                        value={data.channelId}
                        data={Hckfi()}
                        receive={(e) => receive({ name: 'channelId', value: e })}
                        showSearch 
                        rendered={rendered}
                    />)}
                    {data.channelId==10?(<>
                        <LabeledSelect_Consultant
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.consultName}
                        receive={(e) => receive({ name: 'consultName', value: e })}
                        label={<>Loan Consultant <span className="text-red-500">*</span></>}
                        placeHolder={"Loan Consultant"}
                        disabled={User == 'LC'? true: false}
                        showSearch
                        rendered = {rendered}
                    />
                    { User === 'LC' || User === 'Credit'
                            ? (<></>)
                            : (<LabeledInput_Contact
                                className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                                className_label="font-bold"
                                value={data.consultNumber}
                                receive={(e) => receive({ name: 'consultNumber', value: e })}
                                label={'Loan Consultant No.'}
                                type='contact'
                                required={false}
                                rendered = {rendered}
                            />)}
                    { User === 'MARKETING'
                    ? (<></>)
                    : (<LabeledInput
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        value={data.consultantfblink}
                        receive={(e) => receive({ name: 'consultantfblink', value: e })}
                        label={<>Consultant Facebook Name / Profile <span className="text-red-500">*</span></>}
                        placeHolder= "Facebook Name / Profile"
                        rendered = {rendered} 
                        required={false}
                    />)}
                    </>):(<></>)}
                    {User === 'Credit' && (
                    <LabeledInput_NotRequired
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}

                        className_label="font-bold"
                        value={data.CRARemarks}
                        receive={(e) => receive({ name: 'CRARemarks', value: e })}
                        label="CRA Remarks "
                        placeHolder= "Remarks "
                        rendered = {rendered}    
                    />)}
        </Flex>
    );
}
 
export default EditLoanDetails;