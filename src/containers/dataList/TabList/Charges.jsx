import * as React from 'react'
import { Space, Input, Radio, Select } from 'antd'
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import StatusRemarks from './StatusRemarks';

function Charges({ data, User }) {
    const [isEdit, setEdit] = React.useState(false);
    const loanProducts = useQuery({
        queryKey: ['getProductSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/getListLoanProduct');
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        enabled: true,
        retryDelay: 1000,
    });

    function LoanProdDescription() {
        if (!loanProducts.data) {
            return ''; // Return empty if data is not available
        }
        const ProductHolder = loanProducts.data.find(
            (x) => x.code === getCharges.ProductLoan || x.description === getCharges.ProductLoan
        );
        return ProductHolder ? ProductHolder.description : getCharges.ProductLoan; // Return description or code if not found
    }


    const [getCharges, setCharges] = React.useState({
        ProductLoan: '',
        PFR: '',
        InterestRate: '',
        CFRF: '',
        Terms: '',
        GracePeriod: '',
        ApprovedAmount: '' || 100,
        ChargeType: '',
        ProcessingFee: '',
        CRF: '',
        Notatial: 300.00,
        PNDST: '',
        ServiceFee: '',
        DocuSign: '' || 300.00,
        IBFTFee: '' || 300.00,
        Others: 500,
        TotalCharges: '',
        PNValue: '',
        NetProceeds: '',
        MonthlyAmortization: ''
    })

    React.useEffect(() => {
        //console.log('Loan Typeeeeeee:', data.loanTerms );
        setCharges({ ...getCharges, ProductLoan: data.loanProd })
    }, [data]);

    React.useEffect(() => {
        if (data && data) {
            let defaultPFR = '';
            let defaultCFRF = '';
            let defaultInterestRate = '';

            //PFR
            if (data.loanType === 1) {
                defaultPFR = '0.055';
            } else if (data.loanType === 2) {
                defaultPFR = '0.045';
            }

            //PFR if DH
            if (['0303-DH', '0303-DHW'].includes(data.loanProd)) {
                defaultPFR = '0.055';
            }

            // CFRF
            if (data.loanType === 1) {
                defaultCFRF = '0.025';
            } else if (data.loanType === 2) {
                defaultCFRF = '0.02';
            }

            //PFR if CFRF
            if (['0303-DH', '0303-DHW'].includes(data.loanProd)) {
                defaultCFRF = '0.03';
            }

            // temporary value of interestrate
            if (!getCharges.InterestRate) {
                defaultInterestRate = '0.025';
            }


            const approvedAmount = parseFloat(getCharges.ApprovedAmount) || 0;
            const PFR = parseFloat(defaultPFR) || 0;
            const CFRF = parseFloat(defaultCFRF) || 0;
            const terms = parseFloat(getCharges.Terms) || data?.loanTerms;

            // ProcessingFee default value
            const processingFee = (PFR * approvedAmount).toFixed(2);
            // CRF default value
            const crf = (CFRF * approvedAmount).toFixed(2);
            // PNDST default value
            const pndst = ((approvedAmount / 200) * (terms / 12) * 1.5).toFixed(2);

            // Condition for ServiceFee default value
            let serviceFee = '';
            const gracePeriod = getCharges.GracePeriod;
            if (gracePeriod === 2) {
                serviceFee = (terms * 25 + 100).toFixed(2);
            } else if (gracePeriod === 1) {
                serviceFee = ((terms - 1) * 25 + 100).toFixed(2);
            }

            // Others 
            const others = parseFloat(getCharges.Others) || 0;
            // default value ng TotalCharges
            const totalCharges = (parseFloat(processingFee) + others).toFixed(2);

            //set
            setCharges((prevCharges) => ({
                ...prevCharges,
                PFR: prevCharges.PFR || defaultPFR,
                CFRF: prevCharges.CFRF || defaultCFRF,
                InterestRate: prevCharges.InterestRate || defaultInterestRate,
                ProcessingFee: processingFee,
                CRF: crf,
                PNDST: pndst,
                ServiceFee: serviceFee,
                TotalCharges: totalCharges,
            }));

            // default value ng PNValue
            let pnValue = 0;
            const interestRate = parseFloat(getCharges.InterestRate) || 0;
            const ibftFee = parseFloat(getCharges.IBFTFee) || 0;
            if (getCharges.ChargeType === 1) {
                pnValue = (approvedAmount * terms * interestRate) + approvedAmount;
            } else if (getCharges.ChargeType === 2) {
                const baseAmount = approvedAmount + parseFloat(processingFee) - ibftFee;
                pnValue = (baseAmount * terms * interestRate) + baseAmount;
            }

            // default value ng netProceed
            let netProceeds = 0;
            if (getCharges.ChargeType === 1) {
                netProceeds = approvedAmount + parseFloat(totalCharges);
            } else if (getCharges.ChargeType === 2) {
                netProceeds = approvedAmount + parseFloat(others);
            }

            // Computation for monthly amortization
            let monthlyAmortization = 0;
            if (getCharges.ChargeType === 1 && getCharges.GracePeriod === 2) {
                monthlyAmortization = (approvedAmount * terms * interestRate) + (approvedAmount / terms);
            } else if (getCharges.ChargeType === 1 && getCharges.GracePeriod === 1) {
                monthlyAmortization = (approvedAmount * terms * interestRate) + (approvedAmount / terms) - 1;
            } else if (getCharges.ChargeType === 2 && getCharges.GracePeriod === 2) {
                const baseAmount = approvedAmount + parseFloat(processingFee) - ibftFee;
                monthlyAmortization = (baseAmount * terms * interestRate) + (baseAmount / terms);
            } else if (getCharges.ChargeType === 2 && getCharges.GracePeriod === 1) {
                const baseAmount = approvedAmount + parseFloat(processingFee) - ibftFee;
                monthlyAmortization = (baseAmount * terms * interestRate) + (baseAmount / terms) - 1;
            }

            // set
            setCharges((prevCharges) => ({
                ...prevCharges,
                PNValue: pnValue.toFixed(2),
                NetProceeds: netProceeds.toFixed(2),
                MonthlyAmortization: monthlyAmortization.toFixed(2),
            }));
        }
    }, [data, getCharges.ApprovedAmount, getCharges.Terms, getCharges.GracePeriod, getCharges.Others, getCharges.ChargeType, getCharges.IBFTFee, getCharges.PFR]);


    const handleTermChange = (value) => {
        setCharges((prevCharges) => ({
            ...prevCharges,
            Terms: value,
        }));
    };


    const generateTermOptions = () => {
        const options = [];
        for (let i = 3; i <= 24; i++) {
            options.push(
                <Select.Option key={i} value={i}>
                    {i}
                </Select.Option>
            );
        }
        return options;
    };



    return (
        <>
            <div className="sticky top-0 z-[1000] bg-white">
                <StatusRemarks isEdit={!isEdit} User={User} data={data} />
            </div>
            <div className='h-[58vh] overflow-y-auto'>
                <div className='w-[80vw]'>
                    <div className='flex justify-center items-center pt-[4rem]'>

                        <div className='flex flex-col justify-center items-center w-[60vw]'>
                            <div className='font-semibold text-xl pb-4'>Other Charges</div>


                            <Space>
                                <div className="w-[10rem]">Loan Product</div>
                                <div className="w-[15rem]">
                                    <Input readOnly value={LoanProdDescription()} />
                                </div>
                            </Space>

                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Processing Fee Rate</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.PFR}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, PFR: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.PFR || 0);
                                            setCharges({ ...getCharges, PFR: formattedValue });
                                        }}
                                    />

                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Interest Rate</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.InterestRate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, InterestRate: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.InterestRate || 0);
                                            setCharges({ ...getCharges, InterestRate: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Credit Risk Fee Rate</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.CFRF}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, CFRF: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.CFRF || 0);
                                            setCharges({ ...getCharges, CFRF: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Terms</div>
                                <div className='w-[15rem]'>
                                    <Select
                                        className='w-[15rem]'
                                        value={getCharges.Terms || data.loanTerms}
                                        onChange={handleTermChange}
                                        placeholder="Select terms"
                                    >
                                        {generateTermOptions()}
                                    </Select>
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Grace Period</div>
                                <div className='w-[15rem]'>
                                    <Radio.Group
                                        onChange={(e) => setCharges({ ...getCharges, GracePeriod: e.target.value })}
                                        value={getCharges.GracePeriod}
                                    >
                                        <Radio value={1}>Yes</Radio>
                                        <Radio value={2}>No</Radio>

                                    </Radio.Group>
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Approved Amount</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.ApprovedAmount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, ApprovedAmount: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.ApprovedAmount || 0);
                                            setCharges({ ...getCharges, ApprovedAmount: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <div className='font-semibold text-xl pb-4 pt-4'>Loan Charges</div>

                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Charges Type</div>
                                <div className='w-[15rem]'>
                                    <Radio.Group
                                        onChange={(e) => setCharges({ ...getCharges, ChargeType: e.target.value })}
                                        value={getCharges.ChargeType}
                                    >
                                        <Radio value={1}>LTP</Radio>
                                        <Radio value={2}>Amortized</Radio>

                                    </Radio.Group>
                                </div>
                            </Space>



                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Processing Fee</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.ProcessingFee} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>CRF</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.CRF} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Notarial</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={parseFloat(getCharges.Notatial).toFixed(2)} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>PN DST</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.PNDST} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Service Fee</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.ServiceFee} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>DocuSign</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.DocuSign}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, DocuSign: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.DocuSign || 0).toFixed(2);
                                            setCharges({ ...getCharges, DocuSign: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>IBFT Fee</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.IBFTFee}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, IBFTFee: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.IBFTFee || 0).toFixed(2);
                                            setCharges({ ...getCharges, IBFTFee: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Others</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getCharges.Others}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            setCharges({ ...getCharges, Others: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getCharges.Others || 0).toFixed(2);
                                            setCharges({ ...getCharges, Others: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>

                            <Space className='pt-6'>
                                <div className='w-[10rem]'>Total Charges</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.TotalCharges} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>PN Value</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.PNValue} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Net Proceeds</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.NetProceeds} />
                                </div>
                            </Space>
                            <Space className='pt-2'>
                                <div className='w-[10rem]'>Monthly Amortization</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getCharges.MonthlyAmortization} />
                                </div>
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Charges