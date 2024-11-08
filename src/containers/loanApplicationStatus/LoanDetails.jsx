import * as React from 'react';
import { Descriptions, Button, notification } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import LabeledSelectLoanProduct from '@components/trackApplication/LabeledSelectLoanProduct';
import LabeledCurrencyInput from '@components/trackApplication/LabeledCurrencyInput';
import LabeledInput_Numeric from '@components/trackApplication/LabeledInput_Numeric';
import LabeledSelectLoanPurpose from '@components/trackApplication/LabeledSelectLoanPurpose';
import LabeledSelect_Branch from '@components/trackApplication/LabeledSelect_Branch';
import DatePicker_Deployment from '@components/trackApplication/DatePicker_Deployment';
import LabeledSelect from '@components/trackApplication/LabeledSelect';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST, GetLoanPurpose, POST_DATA } from '@api/base-api/BaseApi';
import dayjs from 'dayjs';
import { loanterm } from '@utils/FixedData';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { mmddyy } from '@utils/Converter';

function LoanDetails({ data, receive, loancases }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();

    const disableDate_deployment = React.useCallback((current) => {
        // Disable past dates including today
        return current && current < dayjs().startOf('day');
    }, []);

    const loanProducts = useQuery({
        queryKey: ['getProductSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/getListLoanProduct');
            console.log(result.list)
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    const loanPurpose = useQuery({
        queryKey: ['LoanPurposeQuery'],
        queryFn: async () => {
            const result = await GET_LIST('/getLoanPurpose');
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    const items = [
        {
            key: '1',
            label: <span className='font-semibold text-black'>Loan Product</span>,
            children: loanProducts.data?.find(x => x.code === data.loanProd)?.description || '',
        },
        ...(data.loanDateDep && ['0303-DHW', '0303-VL', '0303-WL'].includes(data.loanProd) ? [{
            key: '2',
            label: <span className='font-semibold text-black'>OFW Departure Date</span>,
            children: mmddyy(data.loanDateDep) || '',
        }] : []),
        {
            key: '3',
            label: <span className='font-semibold text-black'>Loan Purpose</span>,
            children: loanPurpose.data?.find(x => x.id === data.loanPurpose || x.purpose === data.loanPurpose)?.purpose || '',
        },
        {
            key: '4',
            label: <span className='font-semibold text-black'>Branch</span>,
            children: data.loanBranch || '',
        },

    ];
    const loan = [
        {
            key: 'spacer1',
            children: '',
        },
        {
            key: '5',
            label: <span className="font-semibold text-black">Loan Amount</span>,
            children: data.loanAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.loanAmount.replaceAll(',', ''))) : '',
        },
        {
            key: '6',
            label: <span className="font-semibold text-black">Approved Loan Amount</span>,
            children: data.ApprvAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.ApprvAmount).replaceAll(',', ''))) : '',
        },
        {
            key: 'spacer2', 
            children: '',
        },
        {
            key: 'spacer3',
            children: '',
        },
        {
            key: '7',
            label: <span className='font-semibold text-black'>Loan Terms (Months)</span>,
            children: data.loanTerms || '',
        },
        {
            key: '8',
            label: <span className='font-semibold text-black'>Approved Loan Terms (Months)</span>,
            children: data.ApprvTerms ? data.ApprvTerms : '',
        },

    ];

    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.')
    }
    function formatToTwoDecimalPlaces(num) {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    }

    const queryClient = useQueryClient()
    async function updateData() {

        const value = {
            LoanAppId: data.loanIdCode,
            Tab: 1,
            BorrowersCode: data.borrowersCode,
            Product: data.loanProd,
            DepartureDate: data.loanDateDep? mmddyy(data.loanDateDep):'',
            Purpose:  data.loanPurpose,
            BranchId: parseInt(data.loanBranch),
            Amount: parseFloat(data.loanAmount.toString().replaceAll(',', '')),
            Channel: data.hckfi,
            Terms: data.loanTerms,
            Consultant: data.consultant,
            ConsultantNo: data.consultNumber,
            ConsultantProfile: data.consultProfile,
            ModUser: data.borrowersCode,
        };
        const value2 = {
            LoanAppId: data.loanIdCode,
            Tab: 2,
            BorrowersCode: data.borrowersCode,
            JobTitle: data.ofwjobtitle || '',
        }
        console.log('testtset',value)
        const [resLoan, resOFW] = await Promise.all([UpdateLoanDetails(value), UpdateLoanDetails(value2)]);
        if (resLoan.data.status === "success" && resOFW.data.status === "success") {
            api[resLoan.data.status]({
                message: resLoan.data.message,
                description: resLoan.data.description,
            });
        }else{
            api[resLoan.data.status]({
                message: resLoan.data.message,
                description: resLoan.data.description,
            });
        }
        queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true })
            setEdit(!isEdit);
           
       
       
        //queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
    }

    const toggleEditMode = () => {
        setEdit(!isEdit);
    };

    return (
        <div className="h-full relative">
            {contextHolder}
            {/* Read-only View */}
            {!isEdit && (
                <>
                    <Descriptions className="mt-6" size="small" column={{ md: 2, lg: 3, xl: 4 }} items={items} />
                    <Descriptions className="mt-6" size="small" column={{ md: 2, lg: 3, xl: 4 }} items={loan} />
                </>
            )}

            {/* Editable Form View */}
            {isEdit && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
                <LabeledSelectLoanProduct
                    className_dmain="w-full h-[3rem] mt-4"
                    className_label="font-bold"
                    className_dsub=""
                    label="Loan Product"
                    placeHolder="Loan Product"
                    value={data.loanProd}
                    options={loanProducts}
                    receive={(e) => {
                        receive({ name: 'loanProd', value: e });
                    }}
                    category="marketing"
                />
            
                {data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL' ? (
                    <DatePicker_Deployment
                        className_dmain="w-full h-[3rem] mt-4"
                        className_label="font-bold"
                        className_dsub=""
                        label="OFW Departure Date"
                        value={data.loanDateDep}
                        receive={(e) => { receive({ name: 'loanDateDep', value: e }); }}
                        disabled={!isEdit}
                        category="marketing"
                        placeHolder="MM-DD-YYYY"
                        disabledate={disableDate_deployment}
                    />
                ) : null}
            
                <LabeledSelectLoanPurpose
                    className_dmain="w-full h-[3rem] mt-4"
                    className_label="font-bold"
                    className_dsub=""
                    category="marketing"
                    value={data.loanPurpose}
                    receive={(e) => { receive({ name: 'loanPurpose', value: e }); }}
                    label="Loan Purpose"
                    placeHolder="Purpose"
                />
            
                <LabeledSelect_Branch
                    mod={true}
                    className_dmain="w-full h-[3rem] mt-4"
                    className_label="font-bold"
                    value={data.loanBranch}
                    receive={(e) => receive({ name: 'loanBranch', value: e })}
                    label="Assigned Branch"
                    category="marketing"
                    placeHolder={'Branch'}
                />
            
                <LabeledCurrencyInput
                    className_dmain="w-full h-[3rem] mt-4"
                    className_label="font-bold"
                    className_dsub=""
                    label="Loan Amount"
                    placeHolder="Loan Amount"
                    value={data.loanAmount}
                    receive={(e) => { receive({ name: 'loanAmount', value: e }); }}
                    category="marketing"
                />
            
                <LabeledSelect
                    className_dmain="w-full h-[3rem] mt-4"
                    className_label="font-bold"
                    className_dsub=""
                    label="Loan Term (in Months)"
                    placeHolder="Select Loan Term"
                    value={data.loanTerms}
                    data={loanterm()}  
                    receive={(e) => {
                        receive({
                            name: 'loanTerms',
                            value: e
                        });
                    }}
                    category="marketing"
                />
            </div>
            )}
            <div className="flex justify-center space-x-4 mb-2 mt-6">
                {isEdit ? (
                    <>
                        {/* Save Button */}
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => { updateData() }}>
                            Save
                        </Button>

                        {/* Cancel Button */}
                        <Button
                            type="default"
                            onClick={() => {queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true }) 
                            setEdit(false)}}  >
                            Cancel
                        </Button>
                    </>
                ) : (
                    /* Edit Button when not in edit mode */
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => { toggleEditMode() }}
                        disabled={data.loanStatus !== 'RECEIVED'}  >
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
}

export default LoanDetails;