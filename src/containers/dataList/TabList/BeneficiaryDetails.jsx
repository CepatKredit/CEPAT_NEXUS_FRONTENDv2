import React, { useRef, useState } from 'react';
import ViewBeneficiaryDetails from './beneficiaryDetails/ViewBeneficiaryDetails';
import EditBeneficiaryDetails from './beneficiaryDetails/EditBeneficiaryDetails';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { FloatButton, ConfigProvider, Button, notification, Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import StatusRemarks from './StatusRemarks';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import { mmddyy } from '@utils/Converter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { GetData } from '@utils/UserData';
import RelativesTable from './RelativesTable';
import { GET_LIST } from '@api/base-api/BaseApi';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function BeneficiaryDetails({ getTab, classname, data, receive, presaddress, User, creditisEdit, BorrowerId, sepcoborrowfname, sepBenfname, setAddCoborrow, loading, isEditCRAM }) {
    const { getAppDetails, setShowSaveButtonContext } = React.useContext(LoanApplicationContext)
    const [api, contextHolder] = notification.useNotification()
    const [isEdit, setEdit] = useState(false);
    const { GetStatus } = ApplicationStatus();
    const [showCoBorrower, setShowCoBorrower] = useState(true);
    const didMountRef = useRef(false);
    const token = localStorage.getItem('UTK')
    const queryClient = useQueryClient();

    React.useEffect(() => {
        setShowSaveButtonContext(showCoBorrower);
    }, [showCoBorrower, setShowSaveButtonContext]);


    const [relativesCount, setRelativesCount] = React.useState(0);
    const fetchRelativesAndUpdateCount = () => {

        if (BorrowerId) {
            GET_LIST(`/GET/G35R/${BorrowerId}`).then((result) => {
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

  /*  React.useEffect(() => {
        console.log('pupupuupup', getAppDetails.MarriedPBCB)
    }, [getAppDetails])*/


    const handleUpdateRelativesCount = (count) => {
        const relativescount = count - 1;
        setRelativesCount(relativescount);
        // console.log('Updated Relatives Count (adjusted):', relativescount);
    };



    const valid_addcoborrow = !data.coborrowfname || data.coborrowfname.trim() === "" ||
        !data.coborrowlname || data.coborrowlname.trim() === "" ||
        !data.coborrowbdate || !data.coborrowsuffix || !data.coborrowgender /*||
        !data.coborrowmstatus || !data.coborrowdependents || !data.coborrowfblink ||
        !data.coborrowemail || !data.coborrowmobile ||
        ((data.coborrowmstatus === 2 || data.coborrowmstatus === 5 || data.coborrowmstatus === 6) && (!data.coborrowspousename || !data.coborrowerspousebdate))*/

    const benReq = [
        'benfname',
        'benlname',
        'bensuffix',
        'benbdate',
        'bengender',
        'bendependents',
        'benfblink',
        'benemail',
        'benmobile',
        'benmstatus',
        'benrelationship',
        'benresidences',
        'benstayyears',
        'benstaymonths',
        'benpresprov',
        'benpresmunicipality',
        'benpresbarangay',
        'benpresstreet'
    ];

    const additionalReq = (data.benmstatus === 2 || data.benmstatus === 5 || data.benmstatus === 6) ?
        ['benspouse', 'benspousebdate'] : [];

    const Required = () => {
        return [...benReq, ...additionalReq].some(field => {
            //console.log(`field: ${field}, data:`, data[field]);
            const condition = data[field] === undefined || data[field] === '' || data[field] === false;
            //console.log(`result field ${field}:`, condition);
            return condition;
        });
    };

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
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            if (LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }

    React.useEffect(() => {
        if (didMountRef.current) {
            setEdit(false)
        } else {
            didMountRef.current = true;
        }
    }, [getTab]);

    //For CREDIT: If Failed on other Roles, Add logic for specific role here tnx
    if (User === 'Credit') {
        React.useEffect(() => {
            setAddCoborrow(showCoBorrower);
             console.log('Check Acb', showCoBorrower);
        }, [showCoBorrower]);
    }
    const toggleEditMode = async () => {
        if (isEdit) {
            //console.log(!showCoBorrower, !Required())
            /* if ((!showCoBorrower && !valid_addcoborrow && !Required()) || (showCoBorrower && !Required())) {
                 await updateData();
             } else {
                 api['warning']({
                     message: 'Please complete all required fields.',
                     description: 'Please complete all required details.',
                 });
             }*/
            if ((!showCoBorrower && !valid_addcoborrow) || (showCoBorrower)) {
                //await updateData();
                onClickSaveData.mutate();
            } else {
                api['warning']({
                    message: 'Incomplete Additional Co-Borrower Info',
                    description: 'Please Input the Basic Info of Additional Co-Borrower',
                });

            }
        } else {
            setEdit(true);
        }
    };
    const onClickSaveData = useMutation({
        mutationFn: async () => {
            const value = {
                LoanAppId: data.loanIdCode,
                Tab: 3,
                //...(!!data.benfname && !!data.benlname && !!data.bensuffix? )
                BorrowersCode: data.ofwBorrowersCode,
                BenFirstName: data.benfname || '',
                BenMiddleName: data.benmname || '',
                BenLastName: data.benlname || '',
                BenSuffix: data.bensuffix || 0,
                BenBirthday: data.benbdate ? mmddyy(data.benbdate) : '',
                BenGender: data.bengender || null,
                BenDependent: data.bendependents ? parseInt(data.bendependents) : 0,
                BenFbProfile: data.benfblink || '',
                BenEmail: data.benemail || '',
                BenMobileNo: data.benmobile || '',
                BenMobileNo2: data.benothermobile || '',
                BenCivilStatus: data.benmstatus || 0,
                BenSpouseName: data.benspouse || '',
                BenSpouseBirthday: data.benspousebdate ? mmddyy(data.benspousebdate) : '',
                BenRelationship: data.benrelationship || 0,

                BenOwnership: data.benresidences || 0,
                BenStayYears: data.benstayyears || 0,
                BenStayMonths: data.benstaymonths || 0,
                BenProvinceId: data.benpresprov || '',
                BenMunicipalityId: data.benpresmunicipality || '',
                BenBarangayId: data.benpresbarangay || '',
                BenAddress1: data.benpresstreet || '',
                BenRentAmount: data.BenRentAmount ? parseFloat(data.BenRentAmount.toString().replaceAll(',', '')) : 0.00,
                ModUser: jwtDecode(token).USRID,

                ...(!!sepcoborrowfname ? {
                    AcbFirstName: data.coborrowfname || '',
                    AcbMiddleName: data.coborrowmname || '',
                    AcbLastName: data.coborrowlname || '',
                    AcbSuffix: data.coborrowsuffix || 0,
                    AcbBirthday: data.coborrowbdate ? mmddyy(data.coborrowbdate) : '',
                    AcbGender: data.coborrowgender || null,
                    AcbCivilStatus: data.coborrowmstatus || null,
                    AcbDependent: data.coborrowdependents || 0,
                    AcbEmail: data.coborrowemail || '',
                    AcbMobileNo: data.coborrowmobile || '',
                    AcbMobileNo2: data.coborrowothermobile || '',
                    AcbFbProfile: data.coborrowfblink || '',
                    AcbSpouseName: data.coborrowspousename || '',
                    AcbSpouseBirthday: data.coborrowerspousebdate ? mmddyy(data.coborrowerspousebdate) : '',
                    AcbOwnership: data.coborrowresidences || 0,
                    AcbAddress1: data.coborrowStreet || '',
                    AcbBarangay: data.coborrowBarangay || '',
                    AcbMunicipality: data.coborrowMunicipality || '',
                    AcbProvince: data.coborrowProv || '',
                    AcbStayMonths: data.AcbStayMonths || 0,
                    AcbStayYears: data.AcbStayYears || 0,
                    AcbRentAmount: data.AcbRentAmount ? parseFloat(data.AcbRentAmount.toString().replaceAll(',', '')) : 0.00,

                } : {})

            };

            const dataHolder = {
                BorrowersCode: BorrowerId,
                Tab: 3,
                AcbFirstName: data.coborrowfname || '',
                AcbMiddleName: data.coborrowmname || '',
                AcbLastName: data.coborrowlname || '',
                AcbSuffix: data.coborrowsuffix || 0,
                AcbBirthday: data.coborrowbdate ? mmddyy(data.coborrowbdate) : '',
                AcbGender: data.coborrowgender,
                AcbCivilStatus: data.coborrowmstatus || 0,
                AcbDependent: data.coborrowdependents || 0,
                AcbEmail: data.coborrowemail || '',
                AcbMobileNo: data.coborrowmobile || '',
                AcbMobileNo2: data.coborrowothermobile || '',
                AcbFbProfile: data.coborrowfblink || '',
                AcbSpouseName: data.coborrowspousename || '',
                AcbSpouseBirthday: data.coborrowerspousebdate ? mmddyy(data.coborrowerspousebdate) : '',
                AcbRelationship: data.AcbRelationship || null,
                AcbOwnership: data.coborrowresidences || 0,
                AcbAddress1: data.coborrowStreet || '',
                AcbBarangayId: data.coborrowBarangay || '',
                AcbMunicipalityId: data.coborrowMunicipality || '',
                AcbProvinceId: data.coborrowProv || '',
                AcbStayMonths: data.AcbStayMonths || 0,
                AcbStayYears: data.AcbStayYears || 0,
                RecUser: jwtDecode(token).USRID
            };

            if (!sepcoborrowfname && !showCoBorrower) { //if no add coborrow and showaddcoborrow is true
                //start ben- update, add- insert
                console.log('Update and Insert')
                try {
                    const result = await UpdateLoanDetails(value);
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    const result2 = await axios.post('/POST/P43AACB', dataHolder);
                    api[result2.data.status]({
                        message: result2.data.message,
                        description: result2.data.description
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                    setEdit(!isEdit);
                } catch (error) {
                    console.log('Front End: ', error)
                    api['warning']({
                        message: 'Error: Failed API',
                        description: "Failed to Connect into API",
                    });
                }

            } else if ((!!sepcoborrowfname && !showCoBorrower) || (!sepcoborrowfname && showCoBorrower)) { // if add coborrow exists
                //start ben- update, add- update
                console.log('Update All')
                try {
                    const result = await UpdateLoanDetails(value);
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                    setEdit(!isEdit);
                } catch (error) {
                    console.log('Front End: ', error)
                    api['warning']({
                        message: 'Error: Failed API',
                        description: "Failed to Connect into API",
                    });
                }
            }
        }
    })

    return (<>
        {contextHolder}
        <div className={classname}>
            {User !== 'Credit' && User !== 'Lp' && (
                <StatusRemarks isEdit={!isEdit} User={User} data={data} />
            )}
            <div className={`w-full mt-4 ${(User === 'MARKETING' || User === 'LC') ?
                (isEdit ?
                    'xs:h-[42vh] sm:h-[44vh] md:h-[46vh] lg:h-[48vh] xl:h-[49vh] 2xl:h-[56vh] 3xl:h-[62vh] overflow-y-auto'
                    :
                    'xs:h-[42vh] sm:h-[44vh] md:h-[46vh] lg:h-[48vh] xl:h-[49vh] 2xl:h-[46vh] 3xl:h-[54vh] overflow-y-auto'
                ) : ''}`}>
                {(User == 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                    <ViewBeneficiaryDetails data={data} receive={receive} BorrowerId={BorrowerId} Sepcoborrowfname={sepcoborrowfname} User={User} IsOfw={2} />
                ) : (
                    <EditBeneficiaryDetails data={data} receive={receive} BorrowerId={BorrowerId} presaddress={presaddress} Sepcoborrowfname={sepcoborrowfname}
                        showCoBorrower={showCoBorrower} setShowCoBorrower={setShowCoBorrower} sepBenfname={sepBenfname} User={User} />
                )}
            

                {getAppDetails?.MarriedPBCB !== 1 && (
                    !isEditCRAM && !isEdit && !creditisEdit && User !== 'LC' ? (
                        <div className='w-full px-2'>
                            <RelativesTable
                                BorrowerId={BorrowerId}
                                User={User}
                                onUpdateCount={handleUpdateRelativesCount}
                                data={data}
                                isOfw={2}
                            />
                        </div>
                    ) : null
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
                    <div className=" w-full bg-white pt-10 flex 
                                    justify-center items-center mb-2 xs:mb-1 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 2xl:mb-5 3xl:mb-6 
                                     space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-3 ">
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
                                            queryClient.invalidateQueries({ queryKey: ['ClientDataListQuery'] }, { exact: true })
                                            setEdit(false)
                                        }}
                                        disabled={onClickSaveData.isPending}
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
                                >EDIT
                                </Button>
                            </ConfigProvider>
                        )}
                    </div>
                </ConfigProvider>
            )}
        </div>
    </>);
}

export default BeneficiaryDetails;