import React, { useRef } from 'react';
import ViewApprovalAmount from './approvalAmount/ViewApprovalAmount';
import EditApprovalAmount from './approvalAmount/EditApprovalAmount';
import { FloatButton, notification, ConfigProvider } from 'antd';
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
            {(User == 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                <ViewApprovalAmount loading={loading} data={data} User={User} />
            ) : (
                <EditApprovalAmount data={data} receive={receive} User={User} />
            )}
             {!isEdit && (
                <div className="w-[73rem] mb-[2rem] mt-[1rem] mx-auto">
                    <AmountTable data={data} receive={receive} User="Credit" creditisEdit={false} loading={false} />
                </div>
            )}

            {contextHolder}
            {/*(*/GetData('ROLE').toString() === '60' &&
                /*['PRE-CHECK', 'FOR APPROVAL', 'RETURN TO CREDIT OFFICER'].includes(data?.loanAppStat)) &&*/ (
                    <FloatButton.Group
                        shape="circle"
                        style={{ right: 24, bottom: 24 }}
                    >
                        {isEdit ? (
                            <>
                                <FloatButton
                                    className="bg-green-500"
                                    icon={<SaveOutlined className="text-[#3b0764]" />}
                                    tooltip="Save"
                                    onClick={() => { toggleEditMode(); }}
                                />
                                <FloatButton
                                    className="bg-red-500"
                                    icon={<CloseOutlined />}
                                    tooltip="Cancel"
                                    onClick={() => {
                                        setEdit(false);
                                        queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })

                                    }}
                                />
                            </>
                        ) : (
                            <FloatButton
                                className="bg-[#3b0764] text-white"
                                icon={<EditOutlined className="text-[#1ad819]" />}
                                tooltip="Edit"
                                onClick={toggleEditMode}
                            />
                        )}
                    </FloatButton.Group>
                )}
        </div>
    );
}

export default ApprovalAmount;