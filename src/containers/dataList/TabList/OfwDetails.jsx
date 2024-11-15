import React, { useRef, useState } from 'react';
import { Button, notification, Descriptions, ConfigProvider, Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ViewOfwDetails from './ofwDetails/ViewOfwDetails';
import EditOfwDetails from './ofwDetails/EditOfwDetails';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi';
import RelativesTable from './RelativesTable';
import axios from 'axios';
import { GetData } from '@utils/UserData';
import { GetBranchCode, GetPurposeId } from '@api/base-api/BaseApi';
import { Hckfi } from '@utils/FixedData';
import { mmddyy } from '@utils/Converter';
import StatusRemarks from './StatusRemarks';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { jwtDecode } from 'jwt-decode';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';


function OfwDetails({ getTab, classname, data, receive, presaddress, User, BorrowerId, creditisEdit, isEditCRAM }) {
    const [isEdit, setEdit] = useState(false);
    const { GetStatus } = ApplicationStatus();
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient();
    const token = localStorage.getItem('UTK')

    const [relativesCount, setRelativesCount] = React.useState(0);
    const fetchRelativesAndUpdateCount = () => {

        if (BorrowerId) {
            GET_LIST(`/getRelatives/${BorrowerId}`).then((result) => {
                if (result?.list) {
                    const relativescount = result.list.length;
                    setRelativesCount(relativescount);
                    // console.log('Relatives count updated:', relativescount);
                }
            });
        }
    };

    React.useEffect(() => {
        fetchRelativesAndUpdateCount()
    }, [BorrowerId])
    //Use to revert the edit mode can be add Confirmation Message or As is. 
    const didMountRef = useRef(false);
    React.useEffect(() => {
        if (didMountRef.current) {
            setEdit(false)
        } else {
            didMountRef.current = true;
        }
    }, [getTab]);

    const handleUpdateRelativesCount = (count) => {
        const relativescount = count - 1;
        setRelativesCount(relativescount);
        // console.log('Updated Relatives Count (adjusted):', relativescount);
    };

    const Lc_valid = !data.ofwfname || data.ofwfname.trim() == "" || !data.ofwlname || data.ofwlname.trim() == "" || !data.ofwbdate || !data.ofwgender ||
        !data.ofwmobile || !data.ofwfblink || !data.ofwdependents || !data.ofwmstatus ||
        !data.ofwPresProv || !data.ofwPresMunicipality || !data.ofwPresBarangay ||
        !data.ofwPresStreet || !data.ofwresidences || ((data.ofwresidences === 3) && !data.ofwrent) ||
        !data.ofwsalary;

    const Marketing_valid =
        ((data.ofwmstatus === 2 || data.ofwmstatus === 5 || data.ofwmstatus === 6) && (!data.ofwspousebdate || !data.ofwspouse)) ||
        !data.ofwPresProv || !data.ofwPresMunicipality || !data.ofwPresBarangay || !data.ofwPresStreet || !data.ofwresidences ||
        ((data.ofwresidences === 3) && !data.ofwrent) || !data.collectionarea || !data.ofwPermProv ||
        !data.ofwPermMunicipality || !data.ofwPermBarangay || !data.ofwPermStreet || !data.ofwcountry ||
        !data.ofwjobtitle || !data.ofwcompany || !data.ofwsalary || !data.ofwHighestEdu || !data.ofwlosMonth || !data.ofwlosYear ||
        !data.ofwprovStreet || !data.ofwprovBarangay || !data.ofwprovMunicipality || !data.ofwprovProv;

    const toggleEditMode = async () => {
        if (isEdit) {
            if (GetData('ROLE').toString() === '20') {
                if (Lc_valid) {
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                }
                else { onClickSaveData.mutate(); }
            }
            else {
                if (false) { // inlcude marketing valid?
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                }
                else { onClickSaveData.mutate(); }
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
                    Tab: 2,
                    BorrowersCode: data.ofwBorrowersCode,
                    FirstName: data.ofwfname,
                    MiddleName: data.ofwmname,
                    LastName: data.ofwlname,
                    Suffix: data.ofwsuffix,
                    Birthday: mmddyy(data.ofwbdate),
                    Gender: data.ofwgender,
                    CivilStatus: data.ofwmstatus,
                    Dependent: data.ofwdependents ? parseInt(data.ofwdependents) : 0,
                    Email: data.ofwemail,
                    MobileNo: data.ofwmobile,
                    FBProfile: data.ofwfblink,
                    Salary: parseFloat(data.ofwsalary.toString().replaceAll(',', '')),
                    Ownership: data.ofwresidences,
                    RentAmount: data.ofwrent ? parseFloat(data.ofwrent.toString().replaceAll(',', '')) : 0,
                    ProvinceId: data.ofwPresProv,
                    MunicipalityId: data.ofwPresMunicipality,
                    BarangayId: data.ofwPresBarangay,
                    Address1: data.ofwPresStreet,
                    ModUser: jwtDecode(token).USRID
    
                };
                console.log('testtset', value)
                let result = await UpdateLoanDetails(value);
                if (result.data.status === "success") {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true })
                    setEdit(!isEdit);
                } else {
                    api['warning']({
                        message: 'Error: Failed to Update',
                        description: "Fail Connection",
                    });
                }
            }
            else {
                const value = {
                    LoanAppId: data.loanIdCode,
                    Tab: 2,
                    BorrowersCode: data.ofwBorrowersCode,
                    FirstName: data.ofwfname || '',
                    MiddleName: data.ofwmname || '',
                    LastName: data.ofwlname || '',
                    Suffix: data.ofwsuffix || null,
                    Birthday: data.ofwbdate ? mmddyy(data.ofwbdate) : '',
                    Gender: data.ofwgender || null,
                    MobileNo: data.ofwmobile || '',
                    MobileNo2: data.ofwothermobile || '',
                    Email: data.ofwemail || '',
                    FbProfile: data.ofwfblink || '',
                    GroupChat: data.ofwgroupchat || '',
    
    
                    CivilStatus: data.ofwmstatus || null,
                    SpouseName: data.ofwspouse || '',
                    SpouseBirthday: data.ofwspousebdate ? mmddyy(data.ofwspousebdate) : '',
                    Dependent: data.ofwdependents || null,
                    ProvinceId: data.ofwPresProv || '',
                    MunicipalityId: data.ofwPresMunicipality || '',
                    BarangayId: data.ofwPresBarangay || '',
                    Address1: data.ofwPresStreet || '',
                    Ownership: data.ofwresidences || null,
                    RentAmount: data.ofwrent ? parseFloat(data.ofwrent.toString().replaceAll(',', '')) : 0,
                    Landmark: data.landmark || '',
                    StayYears: data.ofwlosMonth || 0,
                    StayMonths: data.ofwlosYear || 0,
                    CollectionArea: data.collectionarea || '',
    
                    //set
                    IsCurrPerm: data.ofwSameAdd ? 1 : 0,
                    IsPermProv: data.ofwProvSameAdd ? 1 : 0,
    
                    PerProvinceId: data.ofwPermProv || '',
                    PerMunicipalityId: data.ofwPermMunicipality || '',
                    PerBarangayId: data.ofwPermBarangay || '',
                    PerAddress1: data.ofwPermStreet || '',
    
                    ProAddress1: data.ofwprovStreet || '',
                    ProBarangayId: data.ofwprovBarangay || '',
                    ProMunicipalityId: data.ofwprovMunicipality || '',
                    ProProvinceId: data.ofwprovProv || '',
    
                    ValidId: data.ofwvalidid ? parseInt(data.ofwvalidid) : null,
                    ValidIdNo: data.ofwidnumber || '',
    
                    Country: data.ofwcountry || '',
                    JobTitle: data.ofwjobtitle || '',
                    Employer: data.ofwcompany || null,
                    Salary: data.ofwsalary ? parseFloat(data.ofwsalary.toString().replaceAll(',', '')) : 0.00,
    
                    EducationLevel: data.ofwHighestEdu || null,
                    School: data.ofwschool || '',
                    Course: data.ofwcourse || '',
                    ModUser: jwtDecode(token).USRID
    
                };
    
                console.log('testtset', value)
                let result = await UpdateLoanDetails(value);
                if (result.data.status === "success") {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true })
                    setEdit(!isEdit);
                }
                else if (result.data.status === "info") {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true })
                    setEdit(!isEdit);
                } else {
                    api['warning']({
                        message: 'Error: Failed to Update',
                        description: "Fail Connection",
                    });
                }
            }
        }
    })

    function GetChannelId(command) {
        var getId = Hckfi().find(x => x.value === command || x.label === command).value;
        return getId
    }

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
        else if (GetData('ROLE').toString() === '20') {
            {
                if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/for-approval' 
                    || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/for-re-application'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('LC')
                    return true
                }
                else { return false }
            }
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
                console.log('CRO')
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

    return (
        <>
            {contextHolder}
            <div className={classname}>
                {User !== 'Credit' && User !== 'Lp' && (
                        <StatusRemarks isEdit={!isEdit} User={User} data={data} />
                )}
                    <div className={`w-full mt-4 ${
                    (User === 'MARKETING' || User === 'LC') ? 
                        (isEdit ? 
                            'xs:h-[42vh] sm:h-[44vh] md:h-[46vh] lg:h-[48vh] xl:h-[49vh] 2xl:h-[55vh] 3xl:h-[61vh] overflow-y-auto' 
                            : 
                            'xs:h-[42vh] sm:h-[44vh] md:h-[46vh] lg:h-[48vh] xl:h-[49vh] 2xl:h-[45vh] 3xl:h-[53vh] overflow-y-auto'
                        )  : ''}`}>      
                {(User === 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                    <ViewOfwDetails data={data} User={User} RelativesCount={relativesCount} receive={receive} />
                ) : (
                    <EditOfwDetails presaddress={presaddress} BorrowerId={BorrowerId} data={data} receive={receive} User={User} RelativesCount={relativesCount} />
                )}

                {!isEditCRAM && !isEdit && User !== 'LC' ? (
                    <div className='w-full px-2'>
                        <RelativesTable BorrowerId={BorrowerId} onUpdateCount={handleUpdateRelativesCount} User={User} data={data} />
                    </div>
                ) : null}
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
                        <div className=" w-full  pt-10 flex justify-center items-center mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-3">
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
                                            onClick={() => {
                                                queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true });
                                                setEdit(false)
                                            }}
                                            size="large"
                                            className="-mt-5"
                                            disabled={onClickSaveData.isPending}
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
        </>
    );
}

export default OfwDetails;