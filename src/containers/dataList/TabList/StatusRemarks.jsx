import { Space, Input, ConfigProvider, Spin } from 'antd';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function StatusRemarks({ isEdit, User, data, setUrgentApp }) {
    const {SET_LOADING_INTERNAL} = React.useContext(LoanApplicationContext);
    const { TextArea } = Input;
    const { SetStatus } = ApplicationStatus()

    React.useEffect(() => {
        SET_LOADING_INTERNAL('UploadDocs', true);
        getRemarks.refetch()
    }, [data?.loanIdCode]);

    const getRemarks = useQuery({
        queryKey: ['getRemarks', data?.loanIdCode],
        queryFn: async () => {
            const result = await axios.get(`/getRemarks/${data?.loanIdCode}`);
            SetStatus(result.data.list[0].status)
            console.log(localStorage.getItem('activeTab'));
            if (localStorage.getItem('activeTab') === 'last-update-by')
                setUrgentApp(result.data.list[0].urgentApp)
            SET_LOADING_INTERNAL('StatusRemarks', false);
            return result.data.list[0];
        },
        enabled: true,
        retryDelay: 1000,
    });


    function getStatusBackgroundColor(status) {

        switch (status) {
            case 'RECEIVED':
                return 'bg-[#29274c] text-white';
            case 'COMPLIED-LACK OF DOCUMENTS':
                return 'bg-[#FF8C00] text-white';
            case 'FOR WALK-IN':
                return 'bg-[#3bceac] text-white';
            case 'FOR INITIAL INTERVIEW':
                return 'bg-[#532b88] text-white';
            case 'REASSESSED TO MARKETING':
                return 'bg-[#DB7093] text-white';
            case 'LACK OF DOCUMENTS':
                return 'bg-[#8B4513] text-white';
            case 'FOR CREDIT ASSESSEMENT':
                return 'bg-[#006d77] text-white';
            case 'CREDIT ASSESSEMENT SPECIAL LANE':
                return 'bg-[#B8860B] text-white';
            case 'FOR VERIFICATION':
                return 'bg-[#003566] text-white';
            case 'FOR APPROVAL':
                return 'bg-[#2d6a4f] text-white';
            case 'APPROVED (TRANS-OUT)':
                return 'bg-[#6d597a] text-white';
            case 'UNDER LOAN PROCESSOR':
                return 'bg-[#2f2f2f] text-white';
            case 'FOR DOCUSIGN':
                return 'bg-[#008080] text-white';
            case 'TAGGED FOR RELEASE':
                return 'bg-[#FFD700] text-white';
            case 'FOR DISBURSEMENT':
                return 'bg-[#32CD32] text-white';
            case 'RELEASED':
                return 'bg-[#FF7F50] text-white';
            case 'CANCELLED':
                return 'bg-[#1c1c1c] text-white';
            case 'DECLINED':
                return 'bg-[#FF0000] text-white';
            case 'FOR RE-APPLICATION':
                return 'bg-[#708090] text-white';
            case 'RETURN TO CREDIT OFFICER':
                return 'bg-[#3d5a80] text-white';
            case 'RETURN TO CREDIT ASSOCIATE':
                return 'bg-[#3d5a7f] text-white';
            case 'REASSESSED TO CREDIT ASSOCIATE':
                return 'bg-[#3d5a7f] text-white';
            case 'REASSESSED TO CREDIT OFFICER':
                return 'bg-[#7b68ee] text-white';
            case 'RETURN TO LOANS PROCESSOR':
                return 'bg-[#ff7f50] text-white';
            case 'OK FOR DOCUSIGN':
                return 'bg-[#20b2aa] text-white';
            case 'ON WAIVER':
                return 'bg-[#ffd700] text-white';
            case 'CONFIRMATION':
                return 'bg-[#228b22] text-white';
            case 'CONFIRMED':
                return 'bg-[#32cd32] text-white';
            case 'UNDECIDED':
                return 'bg-[#f08080] text-white';
            case 'PRE-CHECK':
                return 'bg-[#4a4e69] text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    }

    return (
        <div className={isEdit ? 'h-[5rem]' : ''}>
            <div className="w-full mx-auto">
                <Space className="w-full flex justify-center">
                    {isEdit && User !== 'LC' && (
                        <div className="top-5 left-10 lg:left-4 mb-3">
                            <div className={`inline-flex font-bold items-center px-10 py-2 rounded-full ${getStatusBackgroundColor(getRemarks.data?.status)}`}>
                                {getRemarks.data?.status}
                            </div>
                        </div>
                    )}
                    {isEdit && User !== 'LC' && (
                        <div className="flex justify-center w-full md:w-[40rem] mx-auto mb-5 space-x-4">
                            <div className="w-full">
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