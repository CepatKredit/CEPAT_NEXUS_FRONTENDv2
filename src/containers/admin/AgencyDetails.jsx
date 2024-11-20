import LabeledInput from '@components/global/LabeledInput';
import LabeledSelect from '@components/global/LabeledSelect';
import LabeledTextArea from '@components/global/LabeledTextArea';
import * as React from 'react';
import { ConfigProvider, Button, Space, notification } from 'antd';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { useQueryClient } from '@tanstack/react-query';
import { viewAgencyModal } from '@hooks/ModalAdminController';
import axios from 'axios';

function AgencyDetails({ option }) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('UTK');
    const setModalStatus = viewAgencyModal((state) => state.setStatus);
    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        Name: '',
        AddressId: '',
        LicenseNo: '',
        ContactPerson: '',
        ContactNumber: '',
        Designation: '',
        Status: '',
        AgencyStatus: '',
        Remarks: '',
        RecUser: '00000000-0000-0000-0000-000000000000',
        RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        ModUser: '00000000-0000-0000-0000-000000000000',
        ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    });

    React.useEffect(() => {
        if (option !== 'NEW') {
            setData((prevData) => ({
                ...prevData,
                Name: option.name,
                AddressId: option.address,
                LicenseNo: option.licenseNo,
                ContactPerson: option.contactPerson,
                ContactNumber: option.contactNumber,
                Designation: option.designation,
                Status: option.status === 1 ? 'ENABLE' : 'DISABLE',
                AgencyStatus: option.agencyStatus === 0 ? 'POSITIVE' : 'NEGATIVE',
                Remarks: option.remarks
            }));
        } else {
            setData({
                Name: '',
                AddressId: '',
                LicenseNo: '',
                ContactPerson: '',
                ContactNumber: '',
                Designation: '',
                Status: 0,
                AgencyStatus: 0,
                Remarks: '',
                RecUser: '00000000-0000-0000-0000-000000000000',
                RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                ModUser: '00000000-0000-0000-0000-000000000000',
                ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            });
        }
    }, [option]);

    const handleInputChange = (field, value) => {
        setData({
            ...getData,
            [field]: value
        });
    };

    const validateContactNumber = (number) => {
        return number.startsWith('09') && number.length === 11;
    };

    const handleValidationError = (message) => {
        api['error']({
            message: 'Validation Error',
            description: message
        });
    };

    async function onClickAdd() {
        if (!validateContactNumber(getData.ContactNumber)) {
            handleValidationError('Contact number must start with "09" and be exactly 11 digits long.');
            return;
        }

        const data = {
            Name: getData.Name,
            AddressId: getData.AddressId,
            LicenseNo: getData.LicenseNo,
            ContactPerson: getData.ContactPerson,
            ContactNumber: getData.ContactNumber,
            Designation: getData.Designation,
            Status: 1,//getData.Status === 'ENABLE' ? 1 : 0,
            AgencyStatus: 1,//getData.AgencyStatus === 'POSITIVE' ? 0 : 1,
            Remarks: getData.Remarks,
            RecUser: jwtDecode(token).USRID,
            RecDate: getData.RecDate,
            ModUser: jwtDecode(token).USRID,
            ModDate: getData.ModDate
        };

        console.log(data);
        await axios.post('/api/POST/P44AA', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                });

                queryClient.invalidateQueries({ queryKey: ['AgencyListQuery'] }, { exact: true });
                setData({
                    Name: '',
                    AddressId: '',
                    LicenseNo: '',
                    ContactPerson: '',
                    ContactNumber: '',
                    Designation: '',
                    Status: '',
                    AgencyStatus: '',
                    Remarks: '',
                    RecUser: jwtDecode(token).USRID,
                    RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    ModUser: jwtDecode(token).USRID,
                    ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                });
            })
            .catch((error) => {
                console.log(error);
                api['error']({
                    message: 'Something went wrong',
                    description: error.response?.data?.title || error.message
                });
            });
    }

    async function onClickUpdate() {
        if (!validateContactNumber(getData.ContactNumber)) {
            handleValidationError('Contact number must start with "09" and be exactly 11 digits long.');
            return;
        }

        const data = {
            Id: option.id,
            Name: getData.Name,
            AddressId: getData.AddressId,
            LicenseNo: getData.LicenseNo,
            ContactPerson: getData.ContactPerson,
            ContactNumber: getData.ContactNumber,
            Designation: getData.Designation,
            Status: getData.Status === 'ENABLE' ? 1 : 0,
            AgencyStatus: getData.AgencyStatus === 'POSITIVE' ? 0 : 1,
            Remarks: getData.Remarks,
            ModUser: jwtDecode(token).USRID
        };

        try {
            const result = await axios.post('/api/POST/P45UA', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });

            setModalStatus(false);
            queryClient.invalidateQueries({ queryKey: ['AgencyListQuery'] }, { exact: true });
            setData({
                Name: '',
                AddressId: '',
                LicenseNo: '',
                ContactPerson: '',
                ContactNumber: '',
                Designation: '',
                Status: '',
                AgencyStatus: '',
                Remarks: '',
                RecUser: jwtDecode(token).USRID,
                RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                ModUser: jwtDecode(token).USRID,
                ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            });
        } catch (error) {
            console.log(error);
            api['error']({
                message: 'Something went wrong',
                description: error.response?.data?.title || error.message
            });
        }
    }

    return (
        <>
            {contextHolder}
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <LabeledInput
                    className={'w-[400px]'}
                    label={'Agency Name'}
                    value={getData.Name}
                    receive={(e) => handleInputChange('Name', e)}
                />
                <LabeledInput
                    className={'w-[400px]'}
                    label={'Agency Address'}
                    value={getData.AddressId}
                    receive={(e) => handleInputChange('AddressId', e)}
                />
                <Space>
                    <LabeledInput
                        className={'w-[200px]'}
                        label={'Agency License'}
                        value={getData.LicenseNo}
                        receive={(e) => handleInputChange('LicenseNo', e)}
                    />
                    <LabeledInput
                        className={'w-[190px]'}
                        label={'Agency Contact Person'}
                        value={getData.ContactPerson}
                        receive={(e) => handleInputChange('ContactPerson', e)}
                    />
                </Space>
                <Space>
                    <LabeledInput
                        className={'w-[200px]'}
                        label={'Contact Number'}
                        value={getData.ContactNumber}
                        receive={(e) => handleInputChange('ContactNumber', e)}
                    />
                    <LabeledInput
                        className={'w-[190px]'}
                        label={'Designation'}
                        value={getData.Designation}
                        receive={(e) => handleInputChange('Designation', e)}
                    />
                </Space>
                <Space>
                    <LabeledSelect
                        className={'w-[200px]'}
                        label={'Status'}
                        value={getData.Status}
                        receive={(e) => handleInputChange('Status', e)}
                        data={[
                            { label: 'Enable', value: 'ENABLE' },
                            { label: 'Disable', value: 'DISABLE' }
                        ]}
                    />
                    <LabeledSelect
                        className={'w-[190px]'}
                        label={'Agency Status'}
                        value={getData.AgencyStatus}
                        receive={(e) => handleInputChange('AgencyStatus', e)}
                        data={[
                            { label: 'Positive', value: 'POSITIVE' },
                            { label: 'Negative', value: 'NEGATIVE' }
                        ]}
                    />
                </Space>
                <LabeledTextArea
                    className={'w-[400px]'}
                    label={'Remarks'}
                    value={getData.Remarks}
                    receive={(e) => handleInputChange('Remarks', e)}
                />
                <center>
                    {option === 'NEW' ? (
                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button className='bg-[#3b0764] mt-5 w-[100px]'
                                size='large' type='primary' onClick={onClickAdd}>Add</Button>
                        </ConfigProvider>
                    ) : (
                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button className='bg-[#3b0764] mt-5 w-[100px]'
                                size='large' type='primary' onClick={onClickUpdate}>Update</Button>
                        </ConfigProvider>
                    )}
                </center>
            </Space>
        </>
    );
}

export default AgencyDetails;
