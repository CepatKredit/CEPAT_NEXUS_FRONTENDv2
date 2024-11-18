import { Space, Input, ConfigProvider, Spin } from 'antd';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function StatusRemarks({ isEdit, User, data, setUrgentApp }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const { TextArea } = Input;
    const { SetStatus } = ApplicationStatus()

    React.useEffect(() => {
        SET_LOADING_INTERNAL('UploadDocs', true);
        getRemarks.refetch()
    }, [data?.loanIdCode]);

    const getRemarks = useQuery({
        queryKey: ['getRemarks', data?.loanIdCode],
        queryFn: async () => {
            try {
                const result = await axios.get(`/v1/GET/G37R/${data?.loanIdCode}`);
                SetStatus(result.data.list[0].status)
                console.log(localStorage.getItem('activeTab'));
                if (localStorage.getItem('activeTab') === 'last-update-by')
                    setUrgentApp(result.data.list[0].urgentApp)
                SET_LOADING_INTERNAL('StatusRemarks', false);
                return result.data.list[0];
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('StatusRemarks', false); // Stop loading on error
            }
            return null;
        },
        enabled: true,
        retryDelay: 1000,
    });


    function getStatusBackgroundColor(status) {
        switch (status) {
            case 'RECEIVED':
                return 'bg-[#29274c] text-white';
            case 'COMPLIED-LACK OF DOCUMENTS':
                return 'bg-[#ff8c00] text-white';
            case 'FOR WALK-IN':
                return 'bg-[#3bceac] text-white';
            case 'FOR INITIAL INTERVIEW':
                return 'bg-[#532b88] text-white';
            case 'REASSESSED TO MARKETING':
                return 'bg-[#DB7093] text-white';
            case 'LACK OF DOCUMENTS':
                return 'bg-[#8B4513] text-white';
            case 'FOR CREDIT ASSESSMENT':
                return 'bg-[#006d77] text-white';
            case 'SPECIAL LANE':
                return 'bg-[#ff5400] text-white';
            case 'FOR VERIFICATION':
                return 'bg-[#80b918] text-white';
            case 'FOR APPROVAL':
                return 'bg-[#20b2aa] text-white';
            case 'APPROVED (TRANS-OUT)':
                return 'bg-[#b5179e] text-white';
            case 'UNDER LOAN PROCESSOR':
                return 'bg-[#ffd700] text-white';
            case 'FOR DOCUSIGN':
                return 'bg-[#c77dff] text-white';
            case 'RETURNED FROM MARKETING':
                return 'bg-[#7b68ee] text-white';
            case 'FOR DISBURSEMENT':
                return 'bg-[#cd5c5c] text-white';
            case 'RELEASED':
                return 'bg-[#006400] text-white';
            case 'CANCELLED':
                return 'bg-[#1c1c1c] text-white';
            case 'DECLINED':
                return 'bg-[#FF0000] text-white';
            case 'FOR RE-APPLICATION':
                return 'bg-[#708090] text-white';
            case 'RETURN TO CREDIT OFFICER':
                return 'bg-[#720026] text-white';
            case 'RETURN TO CREDIT ASSOCIATE':
                return 'bg-[#2d6a4f] text-white';
            case 'REASSESSED TO CREDIT ASSOCIATE':
                return 'bg-[#6d597a] text-white';
            case 'REASSESSED TO CREDIT OFFICER':
                return 'bg-[#ff0054] text-white';
            case 'RETURN TO LOANS PROCESSOR':
                return 'bg-[#ff7f50] text-white';
            case 'OK FOR DOCUSIGN':
                return 'bg-[#20B2AA] text-white';
            case 'ON WAIVER':
                return 'bg-[#2196f3] text-white';
            case 'CONFIRMATION':
                return 'bg-[#d3ae37] text-white';
            case 'CONFIRMED':
                return 'bg-[#32cd32] text-white';
            case 'UNDECIDED':
                return 'bg-[#ff7f50] text-white';
            case 'PRE-CHECK':
                return 'bg-[#3d5a80] text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    }

    return (
        <div className={isEdit ? 'h-[5rem]' : ''}>
            <div className="w-full mx-auto">
                <Space className="w-full flex justify-center">
                {isEdit && User !== 'LC' && (
                        <div className="relative mb-3 flex justify-start xs:left-1 sm:left-1 md:left-1 lg:right-3">
                            <div 
                                className={`inline-flex font-bold items-center 
                                            px-6 xs:px-5 sm:px-4 md:px-6 lg:px-6 xl:px-8 2xl:px-10
                                            py-1 xs:py-1 sm:py-1 md:py-2 lg:py-2 xl:py-2
                                            rounded-full text-center ${getStatusBackgroundColor(getRemarks.data?.status)}`}
                            >
                                {getRemarks.data?.status}
                            </div>
                        </div>
                    )}
                    {isEdit && User !== 'LC' && (
                        <div className="flex justify-center w-full xs:w-[10rem] sm:w-[15rem] md:w-[25rem] lg:w-[30rem] xl:w-[35rem] 2xl:w-[45rem] 3xl:w-[55rem] mx-auto mb-5 space-x-4">
                            <div className="w-full xs:w-[10rem] sm:w-[25rem] md:w-[30rem] lg:w-[32rem] xl:w-[35rem] 2xl:w-[45rem] 3xl:w-[55rem] ">
                                <label className="font-bold">Internal Remarks</label>
                                <TextArea
                                    className="w-full h-[40px] p-2 border border-gray-300 rounded-md resize-none"
                                    value={getRemarks.data?.remarksIn}
                                    style={{
                                        height: 50,
                                        resize: 'none',
                                    }}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                    {isEdit && User === 'LC' && (
                        <div className="flex justify-center w-full md:w-[50rem] mx-auto mb-5 space-x-4">
                            <div className="w-full">
                                <label className="font-bold">External Remarks</label>
                                <TextArea
                                    className="w-full h-[40px] p-2 border border-gray-300 rounded-md resize-none"
                                    value={getRemarks.data?.remarksEx}
                                    style={{
                                        height: 50,
                                        resize: 'none',
                                    }}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                </Space>
            </div>
        </div>
    );
}

export default StatusRemarks;