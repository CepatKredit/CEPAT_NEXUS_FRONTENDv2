import React, { useRef } from 'react';
import ViewApprovalAmount from './approvalAmount/ViewApprovalAmount';
import EditApprovalAmount from './approvalAmount/EditApprovalAmount';
import { Button, notification, ConfigProvider } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import AmountTable from './approvalAmount/AmountTable';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { GetData } from '@utils/UserData';
import StatusRemarks from './StatusRemarks';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { jwtDecode } from 'jwt-decode';


function ApprovalAmount({ getTab, classname, data, receive, User, creditisEdit, loading}) {
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
            ModUser: jwtDecode(token).USRID
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

    return (
        <div className={classname}>
            <StatusRemarks isEdit={!isEdit} User={User} data={data} />

            <div className={`w-full overflow-y-auto ${
            (!isEdit && User !== 'Credit') || (User === 'Credit' && !creditisEdit) 
                ? 'h-[30vh] sm:h-[35vh] md:h-[38vh] lg:h-[40vh] xl:h-[45vh] 2xl:h-[48vh] 3xl:h-[57vh]' 
                : 'h-[40vh] sm:h-[45vh] md:h-[48vh] lg:h-[50vh] xl:h-[55vh] 2xl:h-[58vh] 3xl:h-[65vh]'
        }`}>            
        {(User == 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                <ViewApprovalAmount loading={loading} data={data} User={User} />
            ) : (
                <EditApprovalAmount data={data} receive={receive} User={User} />
            )}
             {/*!isEdit && (
                <div className="w-[73rem] mb-[2rem] mt-[1rem] mx-auto">
                    <AmountTable data={data} receive={receive} User="Credit" creditisEdit={false} loading={false} />
                </div>
            )*/}
            </div>
            {contextHolder}
            {/*(*/GetData('ROLE').toString() === '60' &&
                /*['PRE-CHECK', 'FOR APPROVAL', 'RETURN TO CREDIT OFFICER'].includes(data?.loanAppStat)) &&*/ (
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
            <div className="w-full p-8 flex justify-center items-center h-[1rem] mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 
                            space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-3">
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
                                onClick={() => { toggleEditMode(); }}
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
                                    queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
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