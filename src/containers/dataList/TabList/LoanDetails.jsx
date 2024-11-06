import React, { useRef } from 'react';
import ViewLoanDetails from './loanDetails/ViewLoanDetails';
import EditLoanDetails from './loanDetails/EditLoanDetails';
import { FloatButton, notification, ConfigProvider,Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { mmddyy } from '@utils/Converter';
import { GetData } from '@utils/UserData';
import { GetBranchCode, GetPurposeId } from '@api/base-api/BaseApi';
import StatusRemarks from './StatusRemarks';
import { Hckfi } from '@utils/FixedData';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { jwtDecode } from 'jwt-decode';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';


function LoanDetails({getTab, classname, data, receive, User ,creditisEdit, loading }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const token = localStorage.getItem('UTK')
    const disabledStatuses = [
        'DECLINED', 'CANCELLED', 'SCREENING AND INTERVIEW', 'REASSESSED TO CREDIT ASSOCIATE',
        'FOR CALLBACK', 'FOR VERIFICATION', 'PRE-CHECK', 'FOR APPROVAL',
        'RETURN TO CREDIT ASSOCIATE', 'RETURN TO CREDIT OFFICER', 'REASSESSED TO CREDIT OFFICER',
        'APPROVED (TRANS-OUT)', 'RETURN TO LOANS PROCESSOR', 'FOR DOCUSIGN', 'OK FOR DOCUSIGN',
        'TAGGED FOR RELEASE', 'FOR DISBURSEMENT', 'ON WAIVER', 'CONFIRMATION', 'CONFIRMED', 
        'UNDECIDED', 'RELEASED', 'FOR CREDIT ASSESSEMENT', 'FOR RE-APPLICATION', 'PRE-APPROVAL'
    ];
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
                    updateData();
                }
            } else {
                if (Marketing_valid) {
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                } else {
                    updateData();
                }
            }
        } else {
            setEdit(true);
        }
    };

    function GetChannelId(command) {
        var getId = Hckfi().find(x => x.value === command || x.label === command).value;
        return getId;
    }

    async function updateData() {
        if (GetData('ROLE').toString() === '20') {
            const value = {
                LoanAppId: data.loanIdCode,
                Tab: 1,
                BorrowersCode: data.ofwBorrowersCode,
                Dpa: 1,
                Product: data.loanProd,
                BranchId: data.loanBranchId,
                Purpose: data.loanPurpose,
                LoanType: data.loanType,
                DepartureDate: data.ofwDeptDate ? mmddyy(data.ofwDeptDate) : '',
                Amount: parseFloat(data.loanAmount.toString().replaceAll(',', '')),
                Terms: data.loanTerms,
                Channel: data.channelId, //check
                Consultant: data.consultName,
                ConsultantNo: data.consultNumber,
                ConsultantProfile: data.consultantfblink,
                ReferredBy: 0,
                ModUser:jwtDecode(token).USRID
                
            };
            
            console.log('testtset',value)
            let result = await UpdateLoanDetails(value);
            if(result.data.status==="success"){
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                setEdit(!isEdit);
            }else{
                api['warning']({
                    message: 'Error: Failed to Update' ,
                    description: "Fail Connection",
                });
            }
    
        } else {
            //var BranchCode = await GetBranchCode(data.loanBranch);
            var PurposeId = await GetPurposeId(data.loanPurpose);
            const value = {
                LoanAppId: data.loanIdCode,
                Tab: 1,
                BorrowersCode: data.ofwBorrowersCode,
                Product: data.loanProd,
                DepartureDate: data.ofwDeptDate? data.ofwDeptDate:'',
                Purpose: data.loanPurpose,
                LoanType: data.loanType,
                BranchId: data.loanBranchId,
                Amount: parseFloat(data.loanAmount.toString().replaceAll(',', '')),
                Channel: data.channelId,
                Terms: data.loanTerms,
                Consultant: data.consultName,
                ConsultantNo: data.consultNumber,
                ConsultantProfile: data.consultantfblink,
                ModUser:jwtDecode(token).USRID

            };
            console.log('testtset',value)
            let result = await UpdateLoanDetails(value);
            if(result.data.status==="success"){
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                setEdit(!isEdit);
            }else{
                api['warning']({
                    message: 'Error: Failed to Update' ,
                    description: "Fail Connection",
                });
            }
            //queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
        }
    }

    return (
        <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
            <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center">
        <div className={classname}>            
              {User !== 'Credit' && User !== 'Lp' && (<div className="sticky top-0 z-[1000] bg-white">
                    <StatusRemarks isEdit={!isEdit} User={User} data={data} />
                </div>)}
                {(User == 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                    <ViewLoanDetails data={data} User={User} loading={loading} />
                ) : (
                    <EditLoanDetails data={data} receive={receive} User={User} />
                )}

                {contextHolder}
                {User !== 'Credit' && User !== 'Lp' && !disabledStatuses.includes(GetStatus) && (
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
                            onClick={() => setEdit(false)}
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
            </Spin>
            </ConfigProvider>
    );
}

export default LoanDetails;
