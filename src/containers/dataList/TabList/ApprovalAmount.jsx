import React, { useRef, useState, useEffect } from 'react';
import ViewApprovalAmount from './approvalAmount/ViewApprovalAmount';
import EditApprovalAmount from './approvalAmount/EditApprovalAmount';
import { Button, notification, ConfigProvider } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { GetData } from '@utils/UserData';
import StatusRemarks from './StatusRemarks';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { jwtDecode } from 'jwt-decode';
import Charges from './Charges';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { mmddyy } from '@utils/Converter';
import dayjs, { Dayjs } from 'dayjs';
import { GET_LIST } from '@api/base-api/BaseApi';


function ApprovalAmount({ getTab, classname, data, receive, User, creditisEdit, loading }) {
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext);
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const token = localStorage.getItem('UTK')

    const didMountRef = useRef(false);
    React.useEffect(() => {
        if (didMountRef.current) {
            setEdit(false)
        } else {
            didMountRef.current = true;
        }
    }, [getTab]);

    const [isEligibleToApprove, setIsEligibleToApprove] = useState(false);
    const fetchEligibility = async () => {
        try {
            const id = jwtDecode(token).USRID;
            console.log('LAI', data.loanIdCode)
            console.log('User', jwtDecode(token).USRID)
            const result = await GET_LIST(`/getApprovedDataList/${data.loanIdCode}/${id}`);
            console.log('test', result)
            setIsEligibleToApprove(result.list[0].isEligible);
        } catch (error) {
            console.error('Error fetching approval eligibility:', error);
        }
    };

    useEffect(() => {
        if (token && data.loanIdCode !== '') {
            fetchEligibility();
        }
    }, [data.loanIdCode, token]);

    const ApprvAmount_valid = !data.ApprovAmount || !data.approvTerms || !data.ApprvInterestRate || !data.MonthlyAmort || !data.TotalExposure;

    const toggleEditMode = async () => {
        if (isEdit) {
            if (!ApprvAmount_valid) {
                api['warning']({
                    message: 'Incomplete Details',
                    description: 'Please complete all required details.',
                });
            } else {
                updateData();
            }
        } else {
            setEdit(true);
        }
    };

    async function updateData() {
        const value = {
            LoanAppId: data.loanIdCode,
            Tab: 1,
            BorrowersCode: data.ofwBorrowersCode,
            ApprvAmount: data.ApprvAmount ? parseFloat(data.ApprvAmount.toString().replaceAll(',', '')) : 0.00,
            ApprvInterestRate: data.ApprvInterestRate.toString(),
            ApprvTerms: data.ApprvTerms,
            MonthlyAmort: data.MonthlyAmort ? parseFloat(data.MonthlyAmort.toString().replaceAll(',', '')) : 0.00,
            OtherExposure: data.OtherExposure ? parseFloat(data.OtherExposure.toString().replaceAll(',', '')) : 0.00,
            TotalExposure: data.TotalExposure ? parseFloat(data.TotalExposure.toString().replaceAll(',', '')) : 0.00,
            CRORemarks: data.CRORemarks,
            ModUser: jwtDecode(token).USRID,
        }
        console.log('TEST_APPRV_AMOUNT', value)
        let result = await UpdateLoanDetails(value);
        if (result.data.status === "success") {
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });
            setEdit(!isEdit);
        } else {
            api['warning']({
                message: 'Error: Failed to Update',
                description: "Fail Connection",
            });
        }
        queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })

    }
    const onClickApprove = async () => {
        try {
            const value = {
                LoanAppId: data.loanIdCode,
                UserId: jwtDecode(token).USRID,
                isEligible: 1,
                Tab: 5,
                CremanBy: jwtDecode(token).USRID,
            };

            let result = await UpdateLoanDetails(value);

            if (result.data.status === "success") {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
            } else {
                api['warning']({
                    message: 'Error: Failed to Update',
                    description: "Fail Connection",
                });
            }
        } catch (error) {
            api.error({
                message: 'Error',
                description: 'Something went wrong while updating. Please try again.',
            });
        }

        queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
    };


    const onClickSaveData = useMutation({
        mutationFn: async () => {
            try {
                if (
                    parseFloat(getAppDetails.CFRF) === 0 ||
                    parseFloat(getAppDetails.InterestRate) === 0 ||
                    parseFloat(getAppDetails.DocuSign) === 0 ||
                    parseFloat(getAppDetails.IBFTFee) === 0 ||
                    parseFloat(getAppDetails.GracePeriod) === 0 ||
                    parseFloat(getAppDetails.ChargeType) === 0 ||
                    parseFloat(getAppDetails.TotalCharges) === 0 ||
                    parseFloat(getAppDetails.PNValue) === 0 ||
                    parseFloat(getAppDetails.NetProceeds) === 0 ||
                    parseFloat(getAppDetails.MonthlyAmort) === 0
                ) {
                    api.warning({
                        message: 'Notification',
                        description: 'Please fill all the required fields',
                    });
                }
                else {
                    const payload = {
                        LoanAppId: getAppDetails.loanIdCode,
                        ProcessingFeeRate: parseFloat(getAppDetails.PFR),
                        InterestRate: parseFloat(getAppDetails.InterestRate),
                        CreditRiskFeeRate: parseFloat(getAppDetails.CFRF),
                        GracePeriod: getAppDetails.GracePeriod,
                        ChargesType: getAppDetails.ChargeType,
                        ProcessingFee: parseFloat(getAppDetails.ProcessingFee),
                        Crf: parseFloat(getAppDetails.CRF),
                        Notarial: parseFloat(getAppDetails.Notarial),
                        PnDst: parseFloat(getAppDetails.PNDST),
                        ServiceFee: parseFloat(getAppDetails.ServiceFee),
                        DocuSign: parseFloat(getAppDetails.DocuSign),
                        IbftFee: parseFloat(getAppDetails.IBFTFee),
                        Others: parseFloat(getAppDetails.Others),
                        TotalCharges: parseFloat(getAppDetails.TotalCharges),
                        PnValue: parseFloat(getAppDetails.PNValue),
                        NetProceeds: parseFloat(getAppDetails.NetProceeds),
                        MonthlyAmortization: parseFloat(getAppDetails.MonthlyAmortization),
                        LoggedUser: jwtDecode(token).USRID,
                    };

                    await axios.post('POST/P143AC/', payload);
                    console.log('payloadssss', payload);
                    api.success({
                        message: 'Success',
                        description: 'Charges Updated successfully!',
                    });
                }
            } catch (error) {
                api.error({
                    message: 'Error',
                    description: 'An error occurred while updating charges.',
                });
            }
        },
    });

    const handleSubmit = async () => {
        onClickSaveData.mutate();
    };

    function DISABLE_STATUS(LOCATION) {
        if (GetData('ROLE').toString() === '60') {
            if (LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/queue-bucket' || LOCATION === '/ckfi/on-waiver'
                || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/for-verification'
                || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '70') {
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            console.log('LPO')
            if (LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }
    //const shouldHideApproveButton = data.CremanBy && data.CremanDate;

    return (
        <div className={classname}>
            <StatusRemarks isEdit={!isEdit} User={User} data={data} />

            <div
                className={`w-full overflow-y-auto ${((GetData('ROLE') === '70' || GetData('ROLE') === '80') ?
                        'h-[30vh] sm:h-[35vh] md:h-[38vh] lg:h-[40vh] xl:h-[45vh] 2xl:h-[45vh] 3xl:h-[65vh]' :
                        ((!isEdit && User !== 'Credit') || (User === 'Credit' && !creditisEdit)
                            ? 'h-[30vh] sm:h-[35vh] md:h-[38vh] lg:h-[40vh] xl:h-[45vh] 2xl:h-[40vh] 3xl:h-[35vh]'
                            : 'h-[40vh] sm:h-[45vh] md:h-[48vh] lg:h-[50vh] xl:h-[55vh] 2xl:h-[51vh] 3xl:h-[55vh]')
                    )
                    }`}
            >
                {(User == 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                    <ViewApprovalAmount loading={loading} data={data} User={User} />
                ) : (
                    <EditApprovalAmount data={data} receive={receive} User={User} />
                )}
                {GetData('ROLE') === '70' || GetData('ROLE') === '80' ? (
                    <Charges data={data} LoanAppId={getAppDetails?.loanIdCode} />
                ) : null}
            </div>
            {contextHolder}

            <div className="w-full flex justify-center items-center mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-1 3xl:mb-6 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-1">
                {GetData('ROLE') === '70' || GetData('ROLE') === '80' ? (
                    !['CONFIRMED', 'DECLINED', 'CANCELLED'].includes(data.loanAppStat) && (
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#2b972d',
                                    colorPrimaryHover: '#34b330',
                                },
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                size="large"
                                loading={onClickSaveData.isPending}
                                icon={<SaveOutlined />}
                            >
                                Save Charges
                            </Button>
                        </ConfigProvider>)
                ) : null}
            </div>

            <div className="w-full p-5 flex justify-center items-center h-[1rem] mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-3">
                {GetData('ROLE') !== '70' && GetData('ROLE') !== '80' && !isEdit && !isEligibleToApprove && (
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#28a745',
                                colorPrimaryHover: '#218838',
                            },
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={onClickApprove}
                            icon={<CheckCircleOutlined />}
                            size="large"
                        >
                            Approve
                        </Button>
                    </ConfigProvider>
                )}
            </div>


            {(GetData('ROLE').toString() === '60' || GetData('ROLE').toString() === '100' &&
                ['PRE-CHECK', 'FOR APPROVAL', 'RETURN TO CREDIT OFFICER'].includes(data?.loanAppStat)) && !DISABLE_STATUS(localStorage.getItem('SP')) && (
                    <ConfigProvider
                        theme={{
                            token: {
                                fontSize: 14,
                                borderRadius: 8,
                                fontWeightStrong: 600,
                                colorText: '#ffffff',
                            },
                        }}
                    >
                        <div className="w-full p-4 flex justify-center items-center h-[1rem] mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-3">
                            {isEdit ? (
                                <>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#2b972d',
                                                colorPrimaryHover: '#34b330',
                                            },
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            onClick={() => {
                                                toggleEditMode();
                                            }}
                                            size="large"
                                        >
                                            SAVE
                                        </Button>
                                    </ConfigProvider>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#dc3545',
                                                colorPrimaryHover: '#f0aab1',
                                            },
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            icon={<CloseOutlined />}
                                            onClick={() => {
                                                setEdit(false);
                                                queryClient.invalidateQueries(
                                                    { queryKey: ['ClientDataListQuery'] },
                                                    { exact: true }
                                                );
                                            }}
                                            size="large"
                                        >
                                            CANCEL
                                        </Button>
                                    </ConfigProvider>
                                </>
                            ) : (
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#3b0764',
                                            colorPrimaryHover: '#6b21a8',
                                        },
                                    }}
                                >
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={toggleEditMode}
                                        size="large"
                                    >
                                        EDIT
                                    </Button>
                                </ConfigProvider>
                            )}
                        </div>
                    </ConfigProvider>
                )}
        </div>
    );
}

export default ApprovalAmount;