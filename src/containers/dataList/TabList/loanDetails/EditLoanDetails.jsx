import React from 'react';
import { Flex } from 'antd';
import { LoanType, Hckfi, LoanTerms } from '@utils/FixedData';
import { GetData } from '@utils/UserData';
import { useDataContainer } from '@context/PreLoad';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import SelectOpt from '@components/optimized/SelectOpt';
import InputOpt from '@components/optimized/InputOpt';
import DatePickerOpt from '@components/optimized/DatePickerOpt';
import { disableDate_deployment } from '@utils/Formatting';
function EditLoanDetails({ data, receive, User }) {
    const [isEdit, setEdit] = React.useState(false);
    const isFirstRender = React.useRef(true);
    const rendered = true;
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext)

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        updateAppDetails({ name: 'ofwDeptDate', value: '' })
    }, [getAppDetails.loanProd])

    //Preload Selects////
    const {
        GET_LOAN_PRODUCT_LIST,
        GET_BRANCH_LIST,
        GET_LOAN_PURPOSE_LIST,
        GET_LOAN_CONSULTANT } = useDataContainer();
    //Custom Options//////
    function branchFilter(mod) {
        let fb = [{ value: 11, label: 'Facebook/Online' }]
        if (!mod) { fb = [] }
        GET_BRANCH_LIST?.map((x) => { fb.push({ value: x.code, label: x.name, }) })
        return fb
    }
    const get_loan_consultant_list = GET_LOAN_CONSULTANT?.map((x) => ({ value: x.id, label: x.fullName })) || [];
    const get_loan_product_list = GET_LOAN_PRODUCT_LIST?.map(x => ({ value: x.code, label: x.description })) || [];
    const get_loan_purpose_list = GET_LOAN_PURPOSE_LIST?.map(x => ({ value: x.id, label: x.purpose })) || [];
    function loanTerms(terms) {
        return LoanTerms(terms)?.map(x => ({ value: x.value, label: `${x.label.toString().toUpperCase()} Terms` })) || [];
    }
    function HCKFI_Option() {
        return Hckfi()?.map(x => ({ value: x.value, label: x.label })) || [];
    }
    ////////////////////
    return (
        <Flex className="w-full  mt-5" justify="center" gap="small" wrap>
            {User === 'LC'
                ? (<></>)
                : (
                    <InputOpt
                        className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label="font-bold"
                        label="Loan Application ID"
                        value={getAppDetails.loanAppCode}
                        placeHolder='Loading Loan Application ID...'
                        receive={(e) => updateAppDetails({ name: 'loanAppCode', value: e })}
                        category={'marketing'}
                        readOnly={true}
                        rendered={false}
                        KeyName={'loanAppCode'}
                        group={'Default'}
                        compname={'Loan Application ID'}
                        required={false}
                    />
                )}
            {User === 'LC'
                ? (<></>)
                : (<InputOpt
                    className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                    className_label="font-bold"
                    label="Date of Application"
                    value={getAppDetails.loanCreated}
                    placeHolder='Loading Date of Application...'
                    receive={(e) => updateAppDetails({ name: 'loanCreated', value: e })}
                    category={'marketing'}
                    readOnly={true}
                    rendered={false}
                    KeyName={'loanAppCode'}
                    group={'Default'}
                    compname={'Loan Application ID'}
                    required={false}
                />)}
            <SelectOpt
                className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                className_label="font-bold"
                value={getAppDetails.loanBranchId}
                receive={(e) => updateAppDetails({ name: 'loanBranchId', value: e })}
                label={User === 'Credit' ? 'Loan Branch' : 'Assigned Branch'}
                category={User !== 'Credit' ? 'MARKETING' : undefined}
                options={branchFilter((User === 'LC' ?false:true)) }
                rendered={rendered}
                disabled={User !== 'LC' || getAppDetails.loanBranchId === 11}

                KeyName={'loanBranchId'}
                EmptyMsg={'Loan Branch Required'}
                InvalidMsg={'Invalid Loan Branch'}
                group={''}
                compname={'Loan Branch'}
            />
            <SelectOpt
                className_dmain="mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]"
                className_label="font-bold"
                label={<>Loan Product <span className="text-red-500">*</span></>}
                value={getAppDetails.loanProd}
                rendered={rendered}
                showSearch
                receive={(e) => updateAppDetails({ name: 'loanProd', value: e })}
                options={get_loan_product_list}

                EmptyMsg={'Loan Product Required'}
                InvalidMsg={'Invalid Loan Product'}
                KeyName={'loanProd'}
                group={'Default'}
                compname={'Loan Product'}
            />
            {(User !== 'Credit' && (getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL')) && (
                <DatePickerOpt
                    className_dmain="mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]"
                    className_label={'font-bold'}
                    label={<>OFW Departure Date <span className="text-red-500">*</span></>}
                    value={getAppDetails.ofwDeptDate}
                    receive={(e) => { updateAppDetails({ name: 'ofwDeptDate', value: e }) }}
                    //disabled={!isEdit && !(getAppDetails.loanProd === '0303-DHW' || getAppDetails.loanProd === '0303-VL' || getAppDetails.loanProd === '0303-WL')}
                    placeHolder="Departure Date"
                    disabledate={disableDate_deployment}
                    rendered={rendered}

                    EmptyMsg={'Departure Date Required'}
                    InvalidMsg={'Invalid Departure Date'}
                    KeyName={'ofwDeptDate'}
                    group={'TodayOnward'}
                    compname={'Departure Date'}

                />)}
            <SelectOpt
                className_dmain="mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]"
                className_label="font-bold"
                label={<>Loan Application Type <span className="text-red-500">*</span></>}
                value={getAppDetails.loanType}
                rendered={rendered}
                showSearch
                receive={(e) => updateAppDetails({ name: 'loanType', value: e })}
                options={LoanType(true)}

                EmptyMsg={'Loan Product Required'}
                InvalidMsg={'Invalid Loan Product'}
                KeyName={'loanType'}
                group={'Default'}
                compname={'Loan Product'}
            />

            {User === 'Credit' && getAppDetails.loanType === 2 && (
                <InputOpt
                    className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                    className_label="font-bold"
                    label={<>Previous Approved Amount <span className="text-red-500">*</span></>}
                    placeHolder='Previous Approved Amount'
                    readOnly={isEdit}
                    value={getAppDetails.PrevAmount}
                    receive={(e) => updateAppDetails({ name: 'PrevAmount', value: e })}
                    category={'marketing'}
                    rendered={rendered}
                    KeyName={'PrevAmount'}
                    format={'Currency'}
                    group={'Income'}
                    compname={'Previous Approved Amount'}

                    EmptyMsg={'Previous Approved Amount Required'}
                    InvalidMsg={'Invalid Previous Approved Amount(min. 25,000)'}

                />)}
            <SelectOpt
                className_dmain="mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]"
                className_label="font-bold"
                label={<>Purpose <span className="text-red-500">*</span></>}
                placeHolder={'Purpose'}
                value={getAppDetails.loanPurpose}
                rendered={rendered}
                showSearch
                receive={(e) => updateAppDetails({ name: 'loanPurpose', value: e })}
                options={get_loan_purpose_list}

                EmptyMsg={'Loan Purpose Required'}
                InvalidMsg={'Invalid Loan Purpose'}
                KeyName={'loanPurpose'}
                group={'Default'}
                compname={'Loan Purpose'}
            />
            <InputOpt
                className_dmain={'mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                className_label="font-bold"
                label={<>{User === 'Credit' ? 'Applied Loan Amount' : 'Loan Amount'} <span className="text-red-500">*</span></>}
                placeHolder={User === 'Credit' ? 'Applied Loan Amount' : 'Loan Amount'}
                readOnly={isEdit}
                value={getAppDetails.loanAmount}
                receive={(e) => updateAppDetails({ name: 'loanAmount', value: e })}
                category={'marketing'}
                rendered={rendered}
                KeyName={'loanAmount'}
                format={'Currency'}
                group={'Amount-30,000'}
                compname={User === 'Credit' ? 'Applied Loan Amount' : 'Loan Amount'}

                EmptyMsg={`${User === 'Credit' ? 'Applied Loan Amount' : 'Loan Amount'} Required`}
                InvalidMsg={`Invalid ${User === 'Credit' ? 'Applied Loan Amount' : 'Loan Amount'} (min. 30,000)`}

            />

            <SelectOpt
                className_dmain={'mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                className_label="font-bold"
                label={<>Applied Loan Terms <span className="text-red-500">*</span></>}
                placeholder="Enter Loan Terms"
                disabled={User === 'Credit' ? true : false}
                value={getAppDetails.loanTerms}
                receive={(e) => updateAppDetails({ name: 'loanTerms', value: e })}
                category={'marketing'}
                options={loanTerms(24)}
                rendered={rendered}
                KeyName={'loanTerms'}
                group={'Default'}
                compname={'Loan Terms'}

                EmptyMsg={'Loan Terms Required'}
                InvalidMsg={'Invalid Loan Terms'}
            />

            {User === 'Credit' && (
                <InputOpt
                    className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                    className_label={"font-bold"}
                    label={<>CRA Recommendation <span className="text-red-500">*</span></>}
                    placeHolder={"CRA Recommendation"}
                    readOnly={isEdit}
                    value={getAppDetails.CRAApprvRec}
                    receive={(e) => updateAppDetails({ name: 'CRAApprvRec', value: e })}
                    category={'marketing'}
                    rendered={rendered}
                    KeyName={'CRAApprvRec'}
                    format={'Currency'}
                    group={'Amount-30,000'}
                    compname={'CRA Recommendation'}

                    EmptyMsg={'CRA Recommendation Required'}
                    InvalidMsg={`Invalid CRA Recommendation`}
                />
            )}
            {User === 'LC'
                ? (<></>)
                : (
                    <SelectOpt
                        className_dmain={'mt-4 w-[300px] h-[5rem] pt-2'}
                        className_label="font-bold"
                        label={<>How did you know about Cepat Kredit Financing? <span className="text-red-500">*</span></>}
                        placeholder="Select"
                        value={getAppDetails.channelId}
                        receive={(e) => updateAppDetails({ name: 'channelId', value: e })}
                        category={'marketing'}
                        options={HCKFI_Option()}
                        rendered={rendered}
                        KeyName={'channelId'}
                        group={'Default'}
                        compname={'hckfi'}
                        showSearch

                        EmptyMsg={'How did you know about Cepat Kredit Financing Required'}
                        InvalidMsg={'Invalid How did you know about Cepat Kredit Financing'}
                    />
                )}
            {getAppDetails.channelId == 10 ? (<>
                <SelectOpt
                    className_dmain={'mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                    className_label="font-bold"
                    label={<>Loan Consultant <span className="text-red-500">*</span></>}
                    placeHolder={"Loan Consultant"}
                    value={getAppDetails.consultName}
                    receive={(e) => updateAppDetails({ name: 'consultName', value: e })}
                    category={'marketing'}
                    disabled={User == 'LC' ? true : false}
                    options={get_loan_consultant_list}
                    rendered={rendered}
                    KeyName={'consultName'}
                    group={'Default'}
                    compname={'Loan Consultant'}
                    showSearch

                    EmptyMsg={'Loan Consultant Required'}
                    InvalidMsg={'Invalid Loan Consultant'}
                />

                {User !== 'LC' || User === 'Credit'
                    ? (<></>)
                    : (<>
                        <InputOpt
                            className_dmain={'mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                            className_label="font-bold"
                            label={'Loan Consultant No.'}
                            readOnly={isEdit}
                            value={getAppDetails.consultNumber}
                            receive={(e) => updateAppDetails({ name: 'consultNumber', value: e })}
                            category={'marketing'}
                            rendered={rendered}
                            KeyName={'consultNumber'}
                            format={'+639'}
                            group={'ContactNo'}
                            compname={'Loan Consultant No.'}
                            required={false}
                        />
                    </>)}
                {User === 'MARKETING'
                    ? (<></>)
                    : (<InputOpt
                        className_dmain={'mt-10 xs1:mt-2 2xl:mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                        className_label={"font-bold"}
                        label={"Consultant Facebook Name / Profile"}
                        placeHolder="Facebook Name / Profile"
                        readOnly={isEdit}
                        value={getAppDetails.consultantfblink}
                        receive={(e) => updateAppDetails({ name: 'consultantfblink', value: e })}
                        category={'marketing'}
                        rendered={rendered}
                        KeyName={'consultantfblink'}
                        group={'Uppercase'}
                        compname={'Facebook Name / Profile'}
                        required={false}

                    />
                    )}
            </>) : (<></>)}
            {User === 'Credit' && (
                <InputOpt
                    className_dmain={'mt-10 w-[18.75rem] h-[4rem] pt-[0.4rem]'}
                    className_label={"font-bold"}
                    label="CRA Remarks "
                    placeHolder="Remarks "
                    readOnly={isEdit}
                    value={getAppDetails.CRARemarks}
                    receive={(e) => updateAppDetails({ name: 'CRARemarks', value: e })}
                    category={'marketing'}
                    rendered={rendered}
                    KeyName={'CRARemarks'}
                    group={'Uppercase'}
                    compname={'CRA Remarks'}
                    required={false}

                />
            )}
        </Flex>
    );
}

export default EditLoanDetails;