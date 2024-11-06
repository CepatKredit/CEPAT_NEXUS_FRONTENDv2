import LabeledInput from '@components/global/LabeledInput';
import LabeledSelect from '@components/global/LabeledSelect';
import * as React from 'react';
import { ConfigProvider, Button, notification } from 'antd';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { viewCityyModal } from '@hooks/ModalAdminController';
import axios from 'axios';

function CityDetails({ option }) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('UTK');
    const setModalStatus = viewCityyModal((state) => state.setStatus);
    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        Code: '',
        Description: '',
        Province: '',
        TagCity: '',
        RecUser: '00000000-0000-0000-0000-000000000000',
        RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        ModUser: '00000000-0000-0000-0000-000000000000',
        ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        IsNegative: ''
    });

    React.useEffect(() => {
        if (option !== 'NEW') {
            setData((prevData) => ({
                ...prevData,
                Code: option.municipalityCode,
                Description: option.municipalityDescription,
                Province: option.provinceCode,
                TagCity: option.TagCity === 1 ? 'Yes' : 'No',
                IsNegative: option.isNegative === 0 ? 'POSITIVE' : 'NEGATIVE',
            }));
        } else {
            setData({
                Code: '',
                Description: '',
                Province: '',
                TagCity: '',
                RecUser: '00000000-0000-0000-0000-000000000000',
                RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                ModUser: '00000000-0000-0000-0000-000000000000',
                ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                IsNegative: ''
            });
        }
    }, [option]);

    const provinceList = useQuery({
        queryKey: ['ProvinceListQuery'],
        queryFn: async () => {
            const result = await axios.get('/getProvinceList');
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    async function onClickAdd() {
        const data = {
            Code: getData.Code,
            Description: getData.Description,
            Province: getData.Province,
            TagCity: getData.TagCity === 'Yes' ? 1 : 0,
            RecUser: jwtDecode(token).USRID,
            IsNegative: getData.IsNegative === 'POSITIVE' ? 0 : 1
        };

        try {
            const result = await axios.post('/addMunicipality', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });

            queryClient.invalidateQueries({ queryKey: ['MunicipalityListQuery'] }, { exact: true });
            setData({
                Code: '',
                Description: '',
                Province: '',
                TagCity: '',
                RecUser: jwtDecode(token).USRID,
                RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                ModUser: jwtDecode(token).USRID,
                ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                IsNegative: ''
            });
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
        }
    }

    async function onClickUpdate() {
        const data = {
            Code: getData.Code,
            Description: getData.Description,
            Province: getData.Province,
            TagCity: getData.TagCity === 'Yes' ? 1 : 0,
            ModUser: jwtDecode(token).USRID,
            IsNegative: getData.IsNegative === 'POSITIVE' ? 0 : 1
        };

        try {
            const result = await axios.post('/editMunicipality', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });

            setModalStatus(false);
            queryClient.invalidateQueries({ queryKey: ['MunicipalityListQuery'] }, { exact: true });
            setData({
                Code: '',
                Description: '',
                Province: '',
                TagCity: '',
                RecUser: jwtDecode(token).USRID,
                RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                ModUser: jwtDecode(token).USRID,
                ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                IsNegative: ''
            });
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
        }
    }

    return (
        <>
            {contextHolder}
            <LabeledInput
                className='w-[100%]'
                label='Municipality Code'
                value={getData.Code}
                receive={(e) => { setData({ ...getData, Code: e }) }}
                readOnly={option === 'NEW' ? false : true}
            />

            <LabeledInput
                className='w-[100%]'
                label='City / Municipality Description'
                value={getData.Description}
                receive={(e) => { setData({ ...getData, Description: e }) }}
            />

            <LabeledSelect
                className='w-[100%]'
                label='Province List'
                value={getData.Province}
                receive={(e) => { setData({ ...getData, Province: e }) }}
                data={provinceList.data?.map((x) => ({
                    value: x.provinceCode,
                    label: x.provinceDescription,
                }))}

            />
            <LabeledSelect
                className='w-[100%]'
                label='Tag City'
                value={getData.TagCity}
                receive={(e) => { setData({ ...getData, TagCity: e }) }}
                data={[
                    { label: 'Yes', value: 'Yes' },
                    { label: 'No', value: 'No' }
                ]}
            />
            <LabeledSelect
                className='w-[100%]'
                label='Status'
                value={getData.IsNegative}
                receive={(e) => { setData({ ...getData, IsNegative: e }) }}
                data={[
                    { label: 'POSITIVE', value: 'POSITIVE' },
                    { label: 'NEGATIVE', value: 'NEGATIVE' }
                ]}
            />
            <center>
                {option === 'NEW'
                    ? (
                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button
                                className='bg-[#3b0764] mt-5 w-[100px]'
                                size='large'
                                type='primary'
                                onClick={onClickAdd}
                            >
                                Add
                            </Button>
                        </ConfigProvider>
                    ) : (
                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button
                                className='bg-[#3b0764] mt-5 w-[100px]'
                                size='large'
                                type='primary'
                                onClick={onClickUpdate}
                            >
                                Update
                            </Button>
                        </ConfigProvider>
                    )}
            </center>
        </>
    );
}

export default CityDetails;
