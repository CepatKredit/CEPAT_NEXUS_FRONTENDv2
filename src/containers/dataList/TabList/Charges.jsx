import * as React from 'react'
import { Space, Input, Radio, Select, Row, Col, notification, Button, ConfigProvider } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import SectionHeader from '@components/validation/SectionHeader';
import axios from 'axios';
import { toDecrypt } from '@utils/Converter';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function Charges({ LoanAppId, data, User, }) {
    const { getAppDetails, setAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);
    const [api, contextHolder] = notification.useNotification();
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
        if (!getAppDetails?.loanProd) {
            return ''; // Return empty if data is not available
        }
        const ProductHolder = loanProducts.data?.find(
            (x) => x.code === getAppDetails?.loanProd || x.description === getAppDetails?.loanProd
        );
        return ProductHolder ? `${ProductHolder.description}` : getAppDetails?.loanProd;
    }


        React.useEffect(() => {

            if (!getAppDetails?.ApprvAmount) {
                setAppDetails((prevState) => ({
                    ...prevState,
                    ApprvAmount: 0, // Default value for ApprvAmount
                }));
            }
            // Set temporary default values for PFR, CFRF, and InterestRate based on loanType and loanProd
            if (
                !getAppDetails?.PFR &&
                !getAppDetails?.CFRF &&
                !getAppDetails?.InterestRate &&
                !getAppDetails?.DocuSign &&
                !getAppDetails?.IBFTFee &&
                !getAppDetails?.Notarial
            ) {
                let defaultPFR = '';
                let defaultCFRF = '';
                let defaultInterestRate = '';
                let defaultDocuSign = 300;  // Default value for DocuSign
                let defaultIBFTFee = 300;   // Default value for IBFTFee
                let defaultNotarial = 300;

                // Default value for PFR based on loanType
                if (data.loanType === 1) {
                    defaultPFR = 5.50; // Default PFR for loanType 1
                } else if (data.loanType === 2) {
                    defaultPFR = 4.5; // Default PFR for loanType 2
                }

                // Additional condition for PFR if loanProd is DH or DHW
                if (['0303-DH', '0303-DHW'].includes(getAppDetails?.loanProd)) {
                    defaultPFR = 5.5; // Set PFR for DH or DHW loanProd
                }


                // Set default value for CFRF based on loanType
                if (data.loanType === 1) {
                    defaultCFRF = 2.50; // Default CFRF for loanType 1
                } else if (data.loanType === 2) {
                    defaultCFRF = 2; // Default CFRF for loanType 2
                }

                // Additional condition for CFRF if loanProd is DH or DHW
                if (['0303-DH', '0303-DHW'].includes(getAppDetails?.loanProd)) {
                    defaultCFRF = 3; // Set CFRF for DH or DHW loanProd
                }

                // Set default value for InterestRate if not already set
                if (!getAppDetails.InterestRate) {
                    defaultInterestRate = 2.50; // Default InterestRate
                }


                // Set PFR, CFRF, and InterestRate values in the state
                setAppDetails((prevState) => ({
                    ...prevState,
                    PFR: defaultPFR, // Set temporary PFR value
                    CFRF: defaultCFRF, // Set temporary CFRF value
                    InterestRate: defaultInterestRate, // Set temporary InterestRate value
                    DocuSign: defaultDocuSign,  // Set temporary DocuSign value
                    IBFTFee: defaultIBFTFee,
                    Notarial: defaultNotarial,
                }));
            }

            // Compute processingFee based on the approvedAmount and PFR
            const approvedAmount = parseFloat(getAppDetails.ApprvAmount);
            const PFR = getAppDetails.PFR; // Use PFR from the state or defaultPFR
            const CFRF = getAppDetails?.CFRF;
            const terms = parseFloat(getAppDetails.loanTerms);
            const gracePeriod = getAppDetails.GracePeriod;
            const others = parseFloat(getAppDetails.Others);
            const chargetype = getAppDetails.ChargeType;

            const processingFee = ((parseFloat(PFR) / 100) * approvedAmount).toFixed(2);
            const crf = ((parseFloat(CFRF) / 100) * approvedAmount).toFixed(2);
            const pndst = ((approvedAmount / 200) * (terms / 12) * 1.5).toFixed(2);




            let serviceFee = '';
            if (gracePeriod === 2) {
                serviceFee = (terms * 25 + 100).toFixed(2);
            } else if (gracePeriod === 1) {
                serviceFee = ((terms - 1) * 25 + 100).toFixed(2);
            } else {
                serviceFee = '0.00'; // Default value if no valid grace period
            }

            const totalCharges = others > 0
                ? (parseFloat(processingFee) + parseFloat(others)).toFixed(2)
                : "0.00";

            // Default value for PNValue calculation
            let pnValue = 0;
            const interestRate = parseFloat(getAppDetails.InterestRate) || 0;
            const ibftFee = parseFloat(getAppDetails.IBFTFee);

            if (chargetype === 1) {
                pnValue = (approvedAmount * terms * (interestRate / 100)) + approvedAmount;
            } else if (chargetype === 2) {
                const baseAmount = approvedAmount + parseFloat(processingFee) - ibftFee;
                pnValue = (baseAmount * terms * (interestRate / 100)) + baseAmount;
            }

            // Compute netProceeds based on ChargeType
            let netProceeds = 0;

            if (chargetype === 1) {
                netProceeds = parseFloat(totalCharges) > 0
                    ? approvedAmount + parseFloat(totalCharges)
                    : approvedAmount; // If TotalCharges is 0, only use ApprovedAmount
            } else if (chargetype === 2) {
                netProceeds = parseFloat(others) > 0
                    ? approvedAmount + parseFloat(others)
                    : approvedAmount; // If Others is 0, only use ApprovedAmount
            }


            // Computation for monthly amortization
            let monthlyAmortization = 0;
            if (chargetype === 1 && gracePeriod === 2) {
                monthlyAmortization = (approvedAmount * terms * (interestRate / 100)) + (approvedAmount / terms);
            } else if (chargetype === 1 && gracePeriod === 1) {
                monthlyAmortization = (approvedAmount * terms * (interestRate / 100)) + (approvedAmount / terms) - 1;
            } else if (chargetype === 2 && gracePeriod === 2) {
                const baseAmount = approvedAmount + parseFloat(processingFee) - ibftFee;
                monthlyAmortization = (baseAmount * terms * (interestRate / 100)) + (baseAmount / terms);
            } else if (chargetype === 2 && gracePeriod === 1) {
                const baseAmount = approvedAmount + parseFloat(processingFee) - ibftFee;
                monthlyAmortization = (baseAmount * terms * (interestRate / 100)) + (baseAmount / terms) - 1;
            }



            // Optionally, you can set the processingFee in the state as well
            setAppDetails((prevState) => ({
                ...prevState,
                ProcessingFee: processingFee, // Set computed processingFee
                CRF: crf,
                PNDST: pndst,
                ServiceFee: serviceFee,
                TotalCharges: totalCharges,
                PNValue: pnValue.toFixed(2),
                NetProceeds: netProceeds.toFixed(2),
                MonthlyAmortization: monthlyAmortization.toFixed(2),
            }));
        }, [data.loanType, getAppDetails.ChargeType, getAppDetails.Others, getAppDetails.GracePeriod, getAppDetails.Terms, getAppDetails?.loanProd, getAppDetails?.PFR, getAppDetails?.CFRF, getAppDetails?.InterestRate, getAppDetails?.ApprvAmount, getAppDetails.PFR, getAppDetails.CFRF]);



    const getChargesQuery = useQuery({
        queryKey: ['getChargesQuery'],
        queryFn: async () => {
            try {
                //console.log('LOanappid ito..', LoanAppId)
                const result = await GET_LIST(`/getChargesLPA/${LoanAppId}`)
                console.log('chargesssss', result);
                setAppDetails(prevDetails => ({
                    ...prevDetails,
                    PFR: result.list[0]?.processingFeeRate,
                    InterestRate: result.list[0]?.interestRate,
                    CFRF: result.list[0]?.creditRiskFeeRate,
                    GracePeriod: result.list[0]?.gracePeriod,
                    ChargeType: result.list[0]?.chargesType,
                    ProcessingFee: result.list[0]?.processingFee,
                    CRF: result.list[0]?.crf,
                    Notarial: result.list[0]?.notarial,
                    PNDST: result.list[0]?.pnDst,
                    ServiceFee: result.list[0]?.serviceFee,
                    DocuSign: result.list[0]?.docuSign,
                    IBFTFee: result.list[0]?.ibftFee,
                    Others: result.list[0]?.others,
                    TotalCharges: result.list[0]?.totalCharges,
                    PNValue: result.list[0]?.pnValue,
                    NetProceeds: result.list[0]?.netProceeds,
                    MonthlyAmortization: result.list[0]?.monthlyAmortization,

                }))
                return result.list;
            } catch (error) {
                console.log(error)
            }
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    });

    React.useEffect(() => {
        getChargesQuery.refetch();
    }, [LoanAppId])


    const handleSubmit = async () => {
        onClickSaveData.mutate();
    };



    // Define the onChange function for the Terms dropdown
    const handleTermChange = (value) => {
        // Simply update the loan terms without any condition checks
        updateAppDetails({ name: 'loanTerms', value });
        setAppDetails((prevState) => ({
            ...prevState,
            Terms: value, // Update the state with the selected term
        }));
    };

    // Function to generate options for the terms dropdown (always 3 to 24)
    const generateTermOptions = () => {
        const options = [];

        // Add options from 3 to 24
        for (let i = 3; i <= 24; i++) {
            options.push(<Select.Option key={i} value={i}>{i}</Select.Option>);
        }

        return options;
    };

    return (
        <>
            {contextHolder}
            <div className='h-[58vh]'>
                <div className='w-[76vw] mx-auto pt-4 ml-[6rem]'>
                    <div className='ml-[-8rem]'>
                        <SectionHeader title="Charges" />
                    </div>
                    <Row gutter={16} className='font-bold text-xl pb-4'>
                        <Col span={12} className='text-center '>Nexus data</Col>
                        <Col span={12} className='text-center'>Expected data from Sofia</Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Space className="w-full mb-5 mt-5 justify-center items-center">
                                <div className='w-[10rem] text-center ml-[7rem]'>Other Charges</div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[10rem]">Loan Product</div>
                                <div className="w-[15rem]">
                                    <Input readOnly value={LoanProdDescription()} />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Processing Fee Rate</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getAppDetails.PFR}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            updateAppDetails({ name: 'PFR', value: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getAppDetails.PFR || 0);
                                            setAppDetails({ ...getAppDetails, PFR: formattedValue });
                                        }}
                                        addonAfter="%"
                                    />

                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Interest Rate</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getAppDetails.InterestRate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            updateAppDetails({ name: 'InterestRate', value: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getAppDetails.InterestRate || 0);
                                            setAppDetails({ ...getAppDetails, InterestRate: formattedValue });
                                        }}
                                        addonAfter="%"
                                    />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Credit Risk Fee Rate</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getAppDetails.CFRF}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            updateAppDetails({ name: 'CFRF', value: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getAppDetails.CFRF || 0);
                                            setAppDetails({ ...getAppDetails, CFRF: formattedValue });
                                        }}
                                        addonAfter="%"
                                    />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Terms</div>
                                <div className='w-[15rem]'>
                                    <Select
                                        className='w-[15rem]'
                                        value={getAppDetails.loanTerms}  // Ensure it's always based on getAppDetails.loanTerms
                                        onChange={handleTermChange}
                                        placeholder="Select terms"
                                    >
                                        {generateTermOptions()}
                                    </Select>
                                </div>
                            </Space>
                            <Space className="w-full mb-2 mt-2 justify-center items-center">
                                <div className='w-[10rem]'>Grace Period<span className="text-red-500">*</span></div>
                                <div className='w-[15rem]'>
                                    <Radio.Group
                                        onChange={(e) => {
                                            updateAppDetails({ name: 'GracePeriod', value: e.target.value });
                                            setAppDetails((prevState) => ({
                                                ...prevState,
                                                GracePeriod: e.target.value, // Update local state as well
                                            }));
                                        }}
                                        value={getAppDetails.GracePeriod}
                                    >
                                        <Radio value={1}>Yes</Radio>
                                        <Radio value={2}>No</Radio>
                                    </Radio.Group>
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Amount Finance</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={parseFloat(getAppDetails.ApprvAmount).toFixed(2)}
                                    /* onChange={(e) => {
                                         const value = e.target.value;
                                         const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                         setCharges({ ...getCharges, ApprovedAmount: formattedValue });
                                     }}
                                     onBlur={() => {
                                         const formattedValue = parseFloat(getCharges.ApprovedAmount);
                                         setCharges({ ...getCharges, ApprovedAmount: formattedValue });
                                     }}*/
                                    />
                                </div>
                            </Space>
                            {/* ialgay dito ang label ng Loan Charges*/}
                            <Space className="w-full mb-5 mt-5 justify-center items-center">
                                <div className='w-[10rem] text-center ml-[7rem]'>Loan Charges</div>
                            </Space>

                            <Space className="w-full mb-2 mt-2 justify-center items-center">
                                <div className='w-[10rem]'>Charges Type<span className="text-red-500">*</span></div>
                                <div className='w-[15rem]'>
                                    <Radio.Group
                                        onChange={(e) => {
                                            updateAppDetails({ name: 'ChargeType', value: e.target.value });
                                            setAppDetails((prevState) => ({
                                                ...prevState,
                                                ChargeType: e.target.value, // Update local state as well
                                            }));
                                        }}
                                        value={getAppDetails.ChargeType}
                                    >
                                        <Radio value={1}>LTP</Radio>
                                        <Radio value={2}>Amortized</Radio>
                                    </Radio.Group>
                                </div>
                            </Space>



                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>Processing Fee</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={parseFloat(getAppDetails.ProcessingFee).toFixed(2)}
                                        onChange={(e) => updateAppDetails({ name: 'ProcessingFee', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>CRF</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={parseFloat(getAppDetails.CRF).toFixed(2)}
                                        onChange={(e) => updateAppDetails({ name: 'CRF', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Notarial</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={parseFloat(getAppDetails.Notarial).toFixed(2)} onChange={(e) => updateAppDetails({ name: 'Notarial', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>PN DST</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={parseFloat(getAppDetails.PNDST).toFixed(2)} onChange={(e) =>
                                        updateAppDetails({ name: 'PNDST', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>Service Fee</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={parseFloat(getAppDetails.ServiceFee).toFixed(2)}
                                        onChange={(e) => updateAppDetails({ name: 'ServiceFee', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Docusign</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getAppDetails.DocuSign}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            updateAppDetails({ name: 'DocuSign', value: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getAppDetails.DocuSign || 0).toFixed(2);
                                            setAppDetails({ ...getAppDetails, DocuSign: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>IBFT Fee</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getAppDetails.IBFTFee}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            updateAppDetails({ name: 'IBFTFee', value: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getAppDetails.IBFTFee || 0).toFixed(2);
                                            setAppDetails({ ...getAppDetails, IBFTFee: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem]'>Others</div>
                                <div className='w-[15rem]'>
                                    <Input
                                        value={getAppDetails.Others}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                            updateAppDetails({ name: 'Others', value: formattedValue });
                                            setAppDetails({ ...getAppDetails, Others: formattedValue });
                                        }}
                                        onBlur={() => {
                                            const formattedValue = parseFloat(getAppDetails.Others || 0).toFixed(2);
                                            setAppDetails({ ...getAppDetails, Others: formattedValue });
                                        }}
                                    />
                                </div>
                            </Space>

                            <Space className='pt-6 w-full mb-2 justify-center items-center'>
                                <div className='w-[10rem] '>Total Charges</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getAppDetails.TotalCharges}
                                        onChange={(e) => updateAppDetails({ name: 'TotalCharges', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>PN Value</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getAppDetails.PNValue}
                                        onChange={(e) => updateAppDetails({ name: 'PNValue', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>Net Proceeds</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getAppDetails.NetProceeds} onChange={(e) => updateAppDetails({ name: 'NetProceeds', value: e.target.value })} />
                                </div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className='w-[10rem] '>Monthly Amortization</div>
                                <div className='w-[15rem]'>
                                    <Input readOnly value={getAppDetails.MonthlyAmortization} onChange={(e) => updateAppDetails({ name: 'MonthlyAmortization', value: e.target.value })} />
                                </div>
                            </Space>
                        </Col>

                        <Col span={12}>
                            <Space className="w-full mb-5 mt-5 justify-center items-center ml-[-3rem]">
                                <div className='w-[10rem] text-center ml-[7rem]'>Other Charges</div>
                            </Space>
                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input readOnly value={LoanProdDescription()} />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.PFR}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.InterestRate}
                                        readOnly
                                    />
                                </div>
                            </Space>


                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.CFRF}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input

                                        value={getAppDetails.Terms || data.loanTerms}
                                        readOnly

                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.GracePeriod === 1 ? 'Yes' : getAppDetails.GracePeriod === 2 ? 'No' : ''}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails?.ApprvAmount}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-5 mt-5 justify-center items-center ml-[-3rem]">
                                <div className='w-[10rem] text-center ml-[7rem]'>Loan Charges</div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.ChargeType === 1 ? 'LTP' : getAppDetails.ChargeType === 2 ? 'Amortized' : ''}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.ProcessingFee}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.CRF}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.Notarial}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.PNDST}
                                        readOnly
                                    />
                                </div>
                            </Space>


                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.ServiceFee}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.DocuSign}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.IBFTFee}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.Others}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="pt-6 w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.TotalCharges}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.PNValue}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.NetProceeds}
                                        readOnly
                                    />
                                </div>
                            </Space>

                            <Space className="w-full mb-2 justify-center items-center">
                                <div className="w-[15rem]">
                                    <Input
                                        value={getAppDetails.MonthlyAmortization}
                                        readOnly
                                    />
                                </div>
                            </Space>






                        </Col>

                    </Row>

                </div>
            </div >
        </>
    )
}

export default Charges