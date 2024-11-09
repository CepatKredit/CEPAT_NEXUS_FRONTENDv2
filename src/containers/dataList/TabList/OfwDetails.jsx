import React, { useRef, useState } from 'react';
import { Button, notification, Descriptions, ConfigProvider, Spin } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ViewOfwDetails from './ofwDetails/ViewOfwDetails';
import EditOfwDetails from './ofwDetails/EditOfwDetails';
import { useQueryClient } from '@tanstack/react-query';
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

function OfwDetails({ getTab, classname, data, receive, presaddress, User, BorrowerId, creditisEdit, isEditCRAM }) {
    const [isEdit, setEdit] = useState(false);
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
                else { updateData(); }
            }
            else {
                if (false) { // inlcude marketing valid?
                    api['warning']({
                        message: 'Incomplete Details',
                        description: 'Please complete all required details.',
                    });
                }
                else { updateData(); }
            }
        } else {
            setEdit(true);
        }
    };

    function GetChannelId(command) {
        var getId = Hckfi().find(x => x.value === command || x.label === command).value;
        return getId
    }



    async function updateData() {

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
                BirthDay: data.ofwbdate ? mmddyy(data.ofwbdate) : '',
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



    return (
        <>
            <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center">
                    {contextHolder}
                    <div className={classname}>
                        {User !== 'Credit' && User !== 'Lp' && (
                            <div className="sticky top-0 z-[1000] bg-white">
                                <StatusRemarks isEdit={!isEdit} User={User} data={data} />
                            </div>
                        )}
                        {(User === 'Credit' && !creditisEdit) || (User !== 'Credit' && !isEdit) ? (
                            <ViewOfwDetails data={data} User={User} RelativesCount={relativesCount} receive={receive} loading={loading} />
                        ) : (
                            <EditOfwDetails presaddress={presaddress} BorrowerId={BorrowerId} data={data} receive={receive} User={User} RelativesCount={relativesCount} />
                        )}

                        {!isEditCRAM && !isEdit && User !== 'LC' ? (
                            <div className="w-full mb-[10rem] mx-auto">
                                <RelativesTable BorrowerId={BorrowerId} onUpdateCount={handleUpdateRelativesCount} User={User} />
                            </div>
                        ) : null}

                        {User !== 'Credit' && User !== 'Lp' && (
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
                                <div className="sticky bottom-0 z-50 bg-white p-4 flex justify-center items-center  mb-2 xs:mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14 3xl:mb-16 4xl:mb-20 space-x-2 xs:space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 xl:space-x-6 2xl:space-x-8">
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
                    </Spin>
                    </ConfigProvider>
                </>
                );
}

export default OfwDetails;