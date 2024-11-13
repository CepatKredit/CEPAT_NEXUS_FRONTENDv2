import React, { useRef } from 'react';
import ViewLoanDetails from './loanDetails/ViewLoanDetails';
import EditLoanDetails from './loanDetails/EditLoanDetails';
import { Button, notification, ConfigProvider, Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mmddyy } from '@utils/Converter';
import { GetData } from '@utils/UserData';
import { GetBranchCode, GetPurposeId } from '@api/base-api/BaseApi';
import StatusRemarks from './StatusRemarks';
import { Hckfi } from '@utils/FixedData';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { jwtDecode } from 'jwt-decode';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';


function LoanDetails({ getTab, classname, data, receive, User, creditisEdit }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const token = localStorage.getItem('UTK')
    function DISABLE_STATUS(LOCATION) {
         if (GetData('ROLE').toString() === '70') {
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
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
    const didMountRef = useRef(false);
    React.useEffect(() => {
        if (didMountRef.current) {
            setEdit(false)
        } else {
            didMountRef.current = true;
        }
    }, [getTab]);

    const Lc_valid = !data.loanProd || ((data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') && !data.ofwDeptDate)
        || !data.loanPurpose || !data.loanType || !data.loanAmount || !data.loanTerms;

    const Marketing_valid = !data.loanProd || ((data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') && !data.ofwDeptDate)
        || !data.loanPurpose || !data.loanType || !data.loanBranch || !data.loanAmount || !data.channel || !data.loanTerms;

    const toggleEditMode = async () => {
        if (isEdit) {
            if (GetData('ROLE') === 9) {
                if (Lc_valid) {
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                } else {
                    onClickSaveData.mutate();
                }
            } else {
                if (false) {
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                } else {
                    onClickSaveData.mutate();
                }
            }
        } else {
            setEdit(true);
        }
    };

    const onClickSaveData = useMutation({
        mutationFn: async () => {
            if (GetData('ROLE').toString() === '20') {
                const value = {
                    LoanAppId: data.loanIdCode,
                    Tab: 1,
                    BorrowersCode: data.ofwBorrowersCode,
                    Dpa: 1,
                    Product: data.loanProd || null,
                    BranchId: data.loanBranchId || null,
                    Purpose: data.loanPurpose || null,
                    LoanType: data.loanType || null,
                    DepartureDate: data.ofwDeptDate ? mmddyy(data.ofwDeptDate) : '',
                    Amount: data.loanAmount ? parseFloat(data.loanAmount.toString().replaceAll(',', '')) : 0.00,
                    Terms: data.loanTerms || null,
                    Channel: data.channelId || null, //check
                    Consultant: data.consultName || '',
                    ConsultantNo: data.consultNumber || '',
                    ConsultantProfile: data.consultantfblink || '',
                    // ReferredBy: null,
                    ModUser: jwtDecode(token).USRID
                };

                console.log('testtset', value)
                let result = await UpdateLoanDetails(value);
                if (result.data.status === "success") {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                    setEdit(!isEdit);
                } else {
                    api['warning']({
                        message: 'Error: Failed to Update',
                        description: "Fail Connection",
                    });
                }

            } else {
                //var BranchCode = await GetBranchCode(data.loanBranch);
                //var PurposeId = await GetPurposeId(data.loanPurpose);
                const value = {
                    LoanAppId: data.loanIdCode,
                    Tab: 1,
                    BorrowersCode: data.ofwBorrowersCode,
                    Product: data.loanProd || null,
                    DepartureDate: data.ofwDeptDate ? mmddyy(data.ofwDeptDate) : '',
                    Purpose: data.loanPurpose || null,
                    LoanType: data.loanType || null,
                    BranchId: data.loanBranchId || null,
                    Amount: data.loanAmount ? parseFloat(data.loanAmount.toString().replaceAll(',', '')) : 0.00,
                    Channel: data.channelId || null,
                    Terms: data.loanTerms || null,
                    Consultant: data.consultName || '',
                    ConsultantNo: data.consultNumber || '',
                    ConsultantProfile: data.consultantfblink || '',
                    ModUser: jwtDecode(token).USRID

                };
                console.log('testtset', value)
                let result = await UpdateLoanDetails(value);
                if (result.data.status === "success") {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                    setEdit(!isEdit);
                } else {
                    api['warning']({
                        message: 'Error: Failed to Update',
                        description: "Fail Connection",
                    });
                }
                //queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
            }
        }
    })

    function GetChannelId(command) {
        var getId = Hckfi().find(x => x.value === command || x.label === command).value;
        return getId;
    }

    return (<>
        {contextHolder}
        <div className={classname}>
            {User !== 'Credit' && User !== 'Lp' && (
                <StatusRemarks isEdit={!isEdit} User={User} data={data} />
            )}
            <div
                className={`w-full ${(User === 'MARKETING' || User === 'LC') ?
                        (isEdit ?
                            'xs:h-[42vh] sm:h-[44vh] md:h-[46vh] lg:h-[48vh] xl:h-[49vh] 2xl:h-[58vh] 3xl:h-[64vh] overflow-y-auto'
                            :
                            'xs:h-[42vh] sm:h-[44vh] md:h-[46vh] lg:h-[70vh] xl:h-[49vh] 2xl:h-[48vh] 3xl:h-[56vh] overflow-y-auto'
                        ) : ''}`}>
                {(User === 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                    <ViewLoanDetails data={data} User={User} />
                ) : (
                    <EditLoanDetails data={data} receive={receive} User={User} />
                )}
            </div>
            {User !== 'Credit' && User !== 'Lp' && !DISABLE_STATUS(localStorage.getItem('SP')) && (
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
                    <div className=" w-full flex  justify-center items-center pt-10 mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-3">
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
                                        onClick={toggleEditMode}
                                        size="large"
                                        className="-mt-5"
                                        loading={onClickSaveData.isPending}
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
                                        onClick={() => setEdit(false)}
                                        size="large"
                                        className="-mt-5"
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
                                    className="-mt-5"
                                >
                                    EDIT
                                </Button>
                            </ConfigProvider>
                        )}
                    </div>
                </ConfigProvider>
            )}
        </div>
    </>);
}

export default LoanDetails;
