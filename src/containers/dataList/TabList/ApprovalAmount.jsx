import React, { useRef } from 'react';
import ViewApprovalAmount from './approvalAmount/ViewApprovalAmount';
import EditApprovalAmount from './approvalAmount/EditApprovalAmount';
import { Button, notification, ConfigProvider } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
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
    {(User === 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
        <ViewApprovalAmount loading={loading} data={data} User={User} />
    ) : (
        <EditApprovalAmount data={data} receive={receive} User={User} />
    )}

    {contextHolder}
     {/*(*/GetData('ROLE').toString() === '60' &&
                /*['PRE-CHECK', 'FOR APPROVAL', 'RETURN TO CREDIT OFFICER'].includes(data?.loanAppStat)) &&*/ (
                    <div className="flex justify-center items-center mt-8">
                    {isEdit ? (
                    <>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={toggleEditMode}
                            className="bg-green-500 border-none mr-4"
                            style={{ color: '#3b0764' }}
                        >
                            Save
                        </Button>
                        <Button
                            type="default"
                            icon={<CloseOutlined />}
                            onClick={() => {
                                setEdit(false);
                                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
                            }}
                            className="bg-red-500 text-white border-none"
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={toggleEditMode}
                        className="bg-[#3b0764] text-white border-none"
                        style={{ color: '#1ad819' }}
                    >
                        Edit
                    </Button>
                )}
            </div>
        )}
</div>
    );
}

export default ApprovalAmount;