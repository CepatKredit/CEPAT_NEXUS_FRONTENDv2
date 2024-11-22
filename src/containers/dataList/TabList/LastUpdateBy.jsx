import LabeledTextArea from '@components/marketing/LabeledTextArea';
import * as React from 'react';
import { Button, Space, ConfigProvider, Input, Select, DatePicker, notification, Checkbox } from 'antd';
import dayjs from 'dayjs';
import { useParams, useNavigate, useLocation, redirect } from 'react-router-dom';
import LabeledSelects from '@components/validation/LabeledSelect';
import StatusRemarks from './StatusRemarks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { mmddyy, toDecrypt, yymmdd } from '@utils/Converter';
import { GET_DATA, GET_LIST } from '@api/base-api/BaseApi';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GetData } from '@utils/UserData';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { RequestTypeDropdown } from '@utils/FixedData';
import { STATUS_LIST } from '@api/lastUpdateBy/ChangeStatus';
import { SET_PATH_LOCATION } from '@utils/Conditions';
import { useDataContainer } from '@context/PreLoad';

function LastUpdateBy({ isEdit, User, data }) {
    const queryClient = useQueryClient()
    const { GetStatus } = ApplicationStatus()
    const { SET_REFRESH_TILE_COUNTER } = useDataContainer()
    const [api, contextHolder] = notification.useNotification();
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [isDisableUpdateBtn, setDisableUpdateBtn] = React.useState(false);
    const [deletePN, setDeletePN] = React.useState(false);
    const [ispreApproval, setpreApproval] = React.useState(false);
    const [isFFCCChecked, setFFCCChecked] = React.useState(false);
    const [isCRAFChecked, setCRAFChecked] = React.useState(false);
    const [isKaiserChecked, setKaiserChecked] = React.useState(false);
    const [isVideoCallChecked, setVideoCallChecked] = React.useState(false);
    const [isShareLocationChecked, setShareLocationChecked] = React.useState(false);
    const [isAgencyVerificationChecked, setAgencyVerificationChecked] = React.useState(false);
    const [isUrgentApp, setUrgentApp] = React.useState();

    const { id, tabs } = useParams();
    const navigate = useNavigate();

    const approvedMessage = `CONGRATULATIONS! YOUR LOAN APPLICATION HAS BEEN APPROVED. PLEASE WAIT FOR A CALL FROM OUR TEAM TO FINALIZE THE PROCESS AND DISCUSS HOW YOU WILL RECEIVE THE LOAN PROCEEDS.`;
    const declinedMessage = "AFTER CAREFUL EVALUATION, WE REGRET TO INFORM YOU THAT THE LOAN APPLICATION SUBMITTED TO US HAS NOT BEEN APPROVED AT THIS TIME. PLEASE RE-APPLY AGAIN IN A FEW MONTHS.";
    const disbursementMessage = `WE ARE PLEASED TO INFORM YOU THAT YOUR LOAN APPLICATION HAS BEEN SUCCESSFULLY PROCESSED AND IS NOW READY FOR DISBURSEMENT. 
PLEASE REVIEW THE FOLLOWING DETAILS:

LOAN AMOUNT: ${data.ApprvAmount ? formatNumberWithCommas(formatToTwoDecimalPlaces(String(data.ApprvAmount).replaceAll(',', ''))) : ''}
DISBURSEMENT DATE: [INSERT DISBURSEMENT DATE HERE]
BANK ACCOUNT: [INSERT BANK ACCOUNT DETAILS HERE]
ADDITIONAL INSTRUCTIONS: [INSERT ADDITIONAL INSTRUCTIONS HERE]
NET PROCEEDS: [INSERT NET PROCEEDS HERE]

IF YOU HAVE ANY QUESTIONS OR REQUIRE FURTHER ASSISTANCE, PLEASE DO NOT HESITATE TO CONTACT US.`;
    const releasedMessage = `WE ARE PLEASED TO INFORM YOU THAT YOUR LOAN HAS BEEN SUCCESSFULLY RELEASED. THE FUNDS HAVE BEEN DISBURSED TO YOUR DESIGNATED ACCOUNT. 
PLEASE FIND THE DETAILS BELOW:

LOAN AMOUNT: [RELEASED LOAN AMOUNT]
DISBURSEMENT DATE: [DATE OF RELEASE]
BANK ACCOUNT: [BANK ACCOUNT DETAILS]
TRANSACTION REFERENCE: [REFERENCE NUMBER, IF APPLICABLE]

IF YOU HAVE ANY QUESTIONS OR NEED FURTHER ASSISTANCE, PLEASE FEEL FREE TO CONTACT US.
`;
    const ROLE = GetData('ROLE') ? GetData('ROLE') : "" ;

    const handleUrgentApp = (key) => {
        setUrgentApp(key);
    }

    function formatNumberWithCommas(x) {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatToTwoDecimalPlaces(x) {
        return parseFloat(x).toFixed(2);
    }

    const { data: suffixOption } = useQuery({
        queryKey: ['getSuffix'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/GetSuffix');
            return result.list;
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        enabled: true,
        retryDelay: 1000,
    });

    const getFullName = (firstName, middleName, lastName, suffixCode) => {
        const suffixDescription = suffixOption?.find((suffix) => suffix.code === suffixCode)?.description || '';
        let fullName = `${firstName || ''} ${middleName || ''} ${lastName || ''}`;
        if (suffixDescription) {
            fullName += ` ${suffixDescription}`;
        }
        return fullName.trim();
    };
    
    const getRemarks = useQuery({
        queryKey: ['getRemarks'],
        queryFn: async () => {
            const result = await axios.get(`/getRemarks/${data?.loanIdCode}`);
            return result.data.list[0];
        },
        enabled: true,
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        retryDelay: 1000,
    });

    const [getUpdate, setUpdate] = React.useState({
        Status: '',
        RemarksIn: '',
        RemarksEx: '',
        principalBorrower: '',
        coBorrower: '',
        additionalCoBorrower: '',
        UrgentApp: 0,
        SoaDate: undefined
    });

    React.useEffect(() => {
        StatusList.refetch()
    }, [localStorage.getItem('SIDC')])

    const token = localStorage.getItem('UTK');
    const StatusList = useQuery({
        queryKey: ['StatusList'],
        queryFn: async () => {
            const result = await STATUS_LIST(jwtDecode(token).USRID, toDecrypt(localStorage.getItem('SIDC')));
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    })

    function GetStatusCode() {
        let code = StatusList.data?.find((x) => x.statusId === getUpdate.Status || x.status === getUpdate.Status).statusId
        return code
    }

    function isDateTimeValid(dateStr) {
        return !isNaN(new Date(dateStr));
    }

    async function onClickUpdate() {

        if ((getUpdate.Status === 'PRE-CHECK' || getUpdate.Status === 'FOR APPROVAL') &&
            (!ispreApproval ||
                !isFFCCChecked ||
                !isCRAFChecked ||
                !isKaiserChecked ||
                !isVideoCallChecked ||
                !isShareLocationChecked ||
                !isAgencyVerificationChecked)
        ) {
            api['info']({
                message: 'Notification',
                description: (
                    <span>
                        All checkboxes are required to be checked before proceeding to "FOR APPROVAL."
                    </span>
                ),
            });

            return;
        }

        onClickUpdateStatus.mutate();

    }

    const onClickUpdateStatus = useMutation({
        mutationFn: async () => {
            if (getUpdate.Status === 'DECLINED') {
                setUpdate({ ...getUpdate, RemarksEx: declinedMessage });
            } else if (getUpdate.Status === 'APPROVED (TRANS-OUT)') {
                setUpdate({ ...getUpdate, RemarksEx: approvedMessage });
            } else if (getUpdate.Status === 'FOR DISBURSEMENT') {
                setUpdate({ ...getUpdate, RemarksEx: disbursementMessage });
            } else if (getUpdate.Status === 'RELEASED') {
                setUpdate({ ...getUpdate, RemarksEx: releasedMessage });
            }

            if (getUpdate.Status === 'PRE-CHECK' || getUpdate.Status === 'FOR APPROVAL') {
                //console.log('ito ang checkboxes update update', getUpdate.Status)
                const checkListData = {
                    loanAppId: toDecrypt(localStorage.getItem('SIDC')),
                    status: getUpdate.Status === 'PRE-CHECK' ? 21 : 7,
                    statusMasterlist: ispreApproval ? 1 : 0,
                    statusFfcc: isFFCCChecked ? 1 : 0,
                    statusCraf: isCRAFChecked ? 1 : 0,
                    statusKaiser: isKaiserChecked ? 1 : 0,
                    statusVideoCall: isVideoCallChecked ? 1 : 0,
                    statusShareLocation: isShareLocationChecked ? 1 : 0,
                    statusAgencyVerification: isAgencyVerificationChecked ? 1 : 0,
                    modUser: jwtDecode(token).USRID,

                    LAN: id,
                    UrgentApp: getUpdate.UrgentApp,
                    RemarksIn: getUpdate.RemarksIn,
                    RemarksEx: getUpdate.RemarksEx,
                    SoaDate: yymmdd(getUpdate.SoaDate),
                };

                try {
                    await axios.post('/updateCheckListForApproval', checkListData);
                    api['success']({
                        message: 'Application Status',
                        description: 'Status updated',
                    });
                } catch (error) {
                    console.error('Something Wrong', error);
                    api['error']({
                        message: 'Error',
                        description: 'Failed to update Please try again.',
                    });
                    return;
                }
            } else {

                const dataContainer = [
                    {
                        LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
                        LAN: id,
                        Status: GetStatusCode(),
                        RemarksIn: getUpdate.RemarksIn,
                        RemarksEx: getUpdate.RemarksEx,
                        ModUser: jwtDecode(token).USRID
                    },
                    {
                        LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
                        LAN: id,
                        Status: GetStatusCode(),
                        UrgentApp: getUpdate.UrgentApp || 0,
                        RemarksIn: getUpdate.RemarksIn,
                        RemarksEx: getUpdate.RemarksEx,
                        ModUser: jwtDecode(token).USRID
                    },
                    {
                        LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
                        LAN: id,
                        Status: GetStatusCode(),
                        UrgentApp: getUpdate.UrgentApp || 0,
                        RemarksIn: getUpdate.RemarksIn,
                        RemarksEx: getUpdate.RemarksEx,
                        SoaDate: yymmdd(getUpdate.SoaDate),
                        ModUser: jwtDecode(token).USRID
                    }
                ];

                if (getUpdate.UrgentApp === 2 && getUpdate.DepartureDate) {
                    const departureUpdateResponse = await axios.post('/updateDepartDate', {
                        LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
                        DepartureDate: dayjs(getUpdate.DepartureDate).format('MM-DD-YYYY')
                    });

                    if (departureUpdateResponse.data.status === 'error') {
                        api['error']({
                            message: 'Error',
                            description: 'Failed to update departure date. Please try again.'
                        });
                        return;
                    }
                }
                let PN_CHECK = 0
                if (getUpdate.Status === 'FOR DISBURSEMENT') {
                    await axios.post('/getPNNumber', dataContainer[0])
                        .then((result) => { PN_CHECK = 0 })
                        .catch((error) => { PN_CHECK = 1 })
                }

                if (PN_CHECK === 0) {
                    try {
                        const result = await axios.post('/updateApplicationStatus',
                            getUpdate.UrgentApp !== undefined && getUpdate.SoaDate !== undefined
                                ? dataContainer[2]
                                : getUpdate.UrgentApp !== undefined && getUpdate.SoaDate === undefined
                                    ? dataContainer[1]
                                    : dataContainer[0]
                        );
                        SET_PATH_LOCATION(getUpdate.Status)
                        SET_REFRESH_TILE_COUNTER(1)
                        StatusList.refetch();
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        });
                        queryClient.invalidateQueries({ queryKey: ['getRemarks', data?.loanIdCode] }, { exact: true });
                        localStorage.setItem('activeTab', 'deduplication')
                        if((getUpdate.Status === 'SCREENING' || getUpdate.Status === 'FOR CALLBACK' || 
                                getUpdate.Status === 'INTERVIEW')) {
                            console.log("Dumaan ditoooooo")
                            localStorage.setItem('SP', '/ckfi/ckfi/queue-bucket')
                            navigate(`/${localStorage.getItem('SP')}/${data.loanAppCode}/deduplication`);
                        } else {
                            navigate(`${localStorage.getItem('SP')}/${data.loanAppCode}/deduplication`);
                        }
                        // navigate(`${localStorage.getItem('SP')}/${data.loanAppCode}/deduplication`);
                        console.log("INSIDE ", `${localStorage.getItem('SP')}/${id}/${localStorage.getItem("activeTab")}`, "TAB", tabs);
                        setIsDisabled(DISABLE_STATUS(localStorage.getItem('SP')));
                        if (deletePN) {
                            await onClickDeleteXTable();
                        }

                    }
                    catch (error) {
                        console.log(error);
                        api['error']({
                            message: 'Something went wrong',
                            description: error.message
                        });
                    }
                }
                else {
                    api['warning']({
                        message: 'No PN Number from SOFIA',
                        description: 'Unable to change status to FOR DISBURSEMENT, please generate PN Number to proceed.'
                    });
                }
            }
        }
    })


    React.useEffect(() => {
        if (['CANCELLED', 'REASSESSED TO CREDIT OFFICER', 'DECLINED', 'ON WAIVER'].includes(getUpdate.Status) && !getUpdate.RemarksIn) {
            setDisableUpdateBtn(true);
        } else if (getUpdate.Status === 'ON WAIVER' && GetData('ROLE').toString() === '90' && !getUpdate.OnWaiverDropdown) {
            setDisableUpdateBtn(true);
        } else {
            setDisableUpdateBtn(false);
        }
    }, [getUpdate.Status, getUpdate.RemarksIn, getUpdate.OnWaiverDropdown]);

    function DISABLE_STATUS(LOCATION) {
        if (GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40') {
            if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/approved'
                || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled'
                || LOCATION === '/ckfi/declined' || LOCATION === '/ckfi/for-re-application' || LOCATION === '/ckfi/assessement/credit') {
                console.log('MA')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
            {
                if (LOCATION === '/ckfi/for-approval' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('CRA')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '60') {
            if (LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/queue-bucket' || LOCATION === '/ckfi/under-lp'
                || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '70') {
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            if (LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }

    React.useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['getRemarks', data?.loanIdCode] }, { exact: true })
        setIsDisabled(DISABLE_STATUS(localStorage.getItem('SP')));

        if (getUpdate.Status === 'DECLINED') {
            setUpdate({ ...getUpdate, RemarksEx: declinedMessage });
        } else if (getUpdate.Status === 'APPROVED (TRANS-OUT)') {
            setUpdate({ ...getUpdate, RemarksEx: approvedMessage });
        } else if (getUpdate.Status === 'FOR DISBURSEMENT') {
            setUpdate({ ...getUpdate, RemarksEx: disbursementMessage });
        } else if (getUpdate.Status === 'RELEASED') {
            setUpdate({ ...getUpdate, RemarksEx: releasedMessage });
        }

    }, [GetStatus, getUpdate.Status]);
    const onClickDeleteXTable = async () => {
        try {
            const result = await axios.post(`/XTableDelete/${data.loanIdCode}`);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });

            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }
    };
    React.useEffect(() => {
        const statusMappings = {
            statusMasterlist: setpreApproval,
            statusFfcc: setFFCCChecked,
            statusCraf: setCRAFChecked,
            statusKaiser: setKaiserChecked,
            statusVideoCall: setVideoCallChecked,
            statusShareLocation: setShareLocationChecked,
            statusAgencyVerification: setAgencyVerificationChecked
        };

        Object.entries(statusMappings).forEach(([key, setter]) => {
            if (data[key] === 1) setter(true);
        });
    }, [data.statusCraf, data.loanAppStat]);
    const shouldDisplayRequestType = data.loanAppStat === 'ON WAIVER' || getUpdate.Status === 'ON WAIVER'


    function getRequesttype() {
        const requestTypeHolder = RequestTypeDropdown().LPrequestType?.find(
            (x) => x.value?.toString() === getUpdate?.UrgentApp?.toString()
        );
        return requestTypeHolder ? requestTypeHolder.value : null;
    }

    React.useEffect(() =>
    {
        setUpdate({ ...getUpdate, UrgentApp: isUrgentApp });
       // console.log('kkkkkkkkkkkkkkkkkkk', getRequesttype())
    },[isUrgentApp])



    return (
        <div>
            {contextHolder}
            <div className='h-[55vh]'>
                <div className="sticky top-0 z-10 bg-white">
                    <StatusRemarks isEdit={isEdit} User={User} data={data} setUrgentApp={setUrgentApp} />
                </div>
                <center>
                    <div className='pt-[1.5rem] font-bold text-2xl'>
                        Update Status
                    </div>
                    <div className='h-[45vh]  w-[65vw]'>
                        <LabeledSelects
                            className={'mt-5 w-[46.5rem]'}
                            data={StatusList.data?.map((x) => ({
                                value: x.status,
                                label: x.status,
                            }))}
                            value={getUpdate.Status}
                            label={'Select Loan Status'}
                            receive={(e) => { setUpdate({ ...getUpdate, Status: e }); }}
                            disabled={isDisabled}
                        />
                        <Space>
                            <LabeledTextArea
                                className={'mt-2 w-[23.5rem]'}
                                label={'Internal Remarks'}
                                value={getRemarks.getUpdate?.RemarksIn}
                                receive={(e) => {
                                    setUpdate({ ...getUpdate, RemarksIn: e })
                                }}
                                disabled={isDisabled}
                            />
                            {(GetData('ROLE').toString() === '60' ||
                                !(["FOR CALLBACK", "VERIFICATION", "PRE-CHECK", "FOR APPROVAL", "REASSESSED TO MARKETING"].includes(getUpdate.Status))) && (
                                    <LabeledTextArea
                                        className={'mt-2 w-[23.5rem]'}
                                        label={'External Remarks'}
                                        value={
                                            getUpdate.Status === 'DECLINED' ? declinedMessage :
                                                getUpdate.Status === 'APPROVED (TRANS-OUT)' ? approvedMessage :
                                                    getUpdate.Status === 'FOR DISBURSEMENT' ? (getUpdate.RemarksEx || disbursementMessage) :
                                                        getUpdate.Status === 'RELEASED' ? (getUpdate.RemarksEx || releasedMessage) :
                                                            getRemarks.getUpdate?.RemarksEx
                                        }
                                        receive={(e) => { setUpdate({ ...getUpdate, RemarksEx: e }) }}
                                        disabled={isDisabled}
                                    />
                                )}
                        </Space>

                        {['CONFIRMATION'].includes(getUpdate.Status) && GetData('ROLE').toString() === '80' && (
                            <div className='pt-4 flex justify-start ml-[10rem]'>
                                <Checkbox
                                    className='font-bold'
                                    checked={deletePN}
                                    onChange={(e) => setDeletePN(e.target.checked)}
                                >
                                    Delete PN Number
                                </Checkbox>
                            </div>
                        )}


                        {((
                            (getUpdate.Status === 'FOR APPROVAL' || getUpdate.Status === 'PRE-CHECK') &&
                            (['50', '55'].includes(GetData('ROLE').toString()))) ||

                            ((data.loanAppStat === 'FOR APPROVAL' || data.loanAppStat === 'PRE-CHECK') &&
                                GetData('ROLE').toString() === '60')) && (

                                <div className="grid grid-cols-7 mt-8">
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={ispreApproval}
                                            onChange={(e) => setpreApproval(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">Masterlist- Name</label>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={isFFCCChecked}
                                            onChange={(e) => setFFCCChecked(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">FFCC</label>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={isCRAFChecked}
                                            onChange={(e) => setCRAFChecked(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">CRAF</label>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={isKaiserChecked}
                                            onChange={(e) => setKaiserChecked(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">KAISER</label>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={isVideoCallChecked}
                                            onChange={(e) => setVideoCallChecked(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">Video Call- LB/SB</label>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={isShareLocationChecked}
                                            onChange={(e) => setShareLocationChecked(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">Share Location</label>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            className="font-bold"
                                            checked={isAgencyVerificationChecked}
                                            onChange={(e) => setAgencyVerificationChecked(e.target.checked)}
                                            disabled={GetData('ROLE').toString() === '60'}
                                        />
                                        <label className="ml-2">Agency Verification: if Applicable</label>
                                    </div>
                                </div>
                            )}
                        {shouldDisplayRequestType && (
                            <div className="mt-8 w-[46.5rem]">
                                <label className="font-bold mb-2 block">Request Type</label>
                                <Select
                                    className="w-full h-10 mt-[-1rem]"
                                    allowClear
                                    options={RequestTypeDropdown().LPrequestType.map(x => ({
                                        value: x.value,
                                        label: x.label
                                    }))}
                                    value={getRequesttype()} // Dapat tugma ang `value` dito sa `UrgentApp`
                                    onChange={(e) => {
                                        console.log('Selected value:', e); // Debugging
                                        setUpdate({ ...getUpdate, UrgentApp: e });
                                      //  setUrgentApp(e); // Siguraduhin ito rin ay naa-update
                                    }}
                                    disabled={data.loanAppStat === 'ON WAIVER' || isDisabled}
                                />
                            </div>

                        )}



                        {getUpdate.Status === 'FOR CREDIT ASSESSMENT'
                            ? (
                                <div className='pt-2'>
                                    <Space>
                                        <div className='w-[23.5rem]'>
                                            <div>
                                                <label className='font-bold'>Principal Borrower Full Name</label>
                                            </div>
                                            <div>
                                                <Input readOnly className="w-full" size="large" value={getFullName(data.ofwfname, data.ofwmname, data.ofwlname, data.ofwsuffix)} />
                                            </div>
                                        </div>
                                        <div className='w-[23.5rem]'>
                                            <div>
                                                <label className='font-bold'>Co-Borrower Full Name</label>
                                            </div>
                                            <div>
                                                <Input readOnly className='w-full' size='large' value={getFullName(data.benfname, data.benmname, data.benlname, data.bensuffix)} />
                                            </div>
                                        </div>
                                    </Space>
                                    <Space>
                                        <div className='w-[23.5rem]'>
                                            <div>
                                                <label className='font-bold'>Additional Co-Borrower Full Name</label>
                                            </div>
                                            <div>
                                                <Input readOnly className='w-full' size='large' value={getFullName(data.coborrowfname, data.coborrowmname, data.coborrowlname, data.coborrowsuffix)} />
                                            </div>
                                        </div>
                                        <div className='w-[23.5rem]'>
                                            <div>
                                                <label className='font-bold'>For Urgent Application, Please select Reason</label>
                                            </div>
                                            <div>
                                                <Select
                                                    className='w-full'
                                                    size='large'
                                                    allowClear
                                                    options={RequestTypeDropdown(data.loanProd).MArequestType}
                                                    value={getUpdate.UrgentApp}
                                                    onChange={(e) => { setUpdate({ ...getUpdate, UrgentApp: e }) }}
                                                    disabled={isDisabled}
                                                />
                                            </div>
                                        </div>
                                    </Space>
                                    {getUpdate.UrgentApp === 2 && (
                                        <div className='pt-2'>
                                            <div className='w-[23.5rem]'>
                                                <div>
                                                    <label className='font-bold'>Departure Date</label>
                                                </div>
                                                <div>
                                                    <DatePicker
                                                        className='w-full'
                                                        format={'MM-DD-YYYY'}
                                                        allowClear
                                                        value={isDateTimeValid(data.ofwDeptDate) ? dayjs(data.ofwDeptDate) : undefined}
                                                        size='large'
                                                        onChange={(date) => {
                                                        }}
                                                        disabled={true}
                                                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (<></>)}
                        <center>
                            <div className='pt-[2rem]'>
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                    <Button
                                        onClick={() => { 
                                            onClickUpdate();
                                         }}
                                        className='bg-[#3b0764] w-[8rem]'
                                        type='primary'
                                        disabled={isDisabled || isDisableUpdateBtn}
                                        loading={onClickUpdateStatus.isPending}
                                    > Update
                                    </Button>
                                </ConfigProvider>
                            </div>
                        </center>
                    </div>
                </center>
            </div>
        </div>
    );
}

export default LastUpdateBy;