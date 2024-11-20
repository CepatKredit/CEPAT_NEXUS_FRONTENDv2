
import LabeledInput from '@components/global/LabeledInput'
import LabeledSelect from '@components/global/LabeledSelect'
import * as React from 'react'

import { ConfigProvider, Button,  notification } from 'antd'
import { GET_LIST } from '@api/base-api/BaseApi'
import {  useQuery, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { viewBarangayModal } from '@hooks/ModalAdminController'



function BarangayDetails({ option }) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('UTK');
    const setModalStatus = viewBarangayModal((state) => state.setStatus);
    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        Code: '',
        Description: '',
        Municipality: '',
        ProvinceDescription: '',
        RecUser: '',
        ZipCode: 0,
        IsNegative: 0
    });

    React.useEffect(() => {
        if (option !== 'NEW') {
            setData({
                ...getData,
                Code: option.code,
                Description: option.description,
                Municipality: option.municipality,
                Moduser: option.recUser,
                ProvinceDescription: option.provinceDescription,
                ZipCode: option.zipCode,
                IsNegative: option.isNegative === 0 ? 'POSITIVE' : 'NEGATIVE',
            });
        } else {
            setData({
                Code: '',
                Description: '',
                Municipality: '',
                RecUser: '',
                ZipCode: 0,
                IsNegative: 0

            });
        }
    }, [option]);

    const [getProvCode, setProvCode] = React.useState()
    const [getMunCode, setMunCode] = React.useState()
    const getProvinceSelect = useQuery({
        queryKey: ['getProvinceSelect'],
        queryFn: async () => {
            const result = await GET_LIST('/GroupGet/G8P')
            setProvCode(result.list)

            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    })

    function GetProvCode() {
        let dataHolder = getProvCode
        const ProvHolder = dataHolder.find((x) => x.provinceCode === getData.ProvinceDescription ||
            x.provinceDescription === getData.ProvinceDescription)
        return ProvHolder.provinceCode
    }

    const getMunFromProvCode = useQuery({
        queryKey: ['getMunFromProvCode'],
        queryFn: async () => {

            const result = await GET_LIST(`/GroupGet/G6MA/${GetProvCode()}`)
            setMunCode(result.list)
            return result.list
        },
        refetchInterval: 500,
        retryDelay: 1000,
    })

    function GetMunCode() {
        let dataHolder = getMunCode
        const MunHolder = dataHolder.find((x) => x.munCode === getData.Municipality ||
            x.munDesc === getData.Municipality)
        return MunHolder.munCode
    }

    async function brgyClickAdd() {
        const data =
        {
            Code: getData.Code,
            Description: getData.Description,
            Municipality: getData.Municipality,
            RecUser: jwtDecode(token).USRID,
            ZipCode: getData.ZipCode,
            IsNegative: getData.IsNegative === 'POSITIVE' ? 0 : 1
        }
        try {
            const result = await axios.post('/GroupPost/P53AB', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            })

            queryClient.invalidateQueries({ queryKey: ['BarangayListQuery'] }, { exact: true })
            setData({
                Code: '',
                Description: '',
                Municipality: '',
                RecUser: '',
                ZipCode: 0,
                IsNegative: 0
            })
        } catch (error) {

            api['error']({
                message: 'Something went wrong',
                description: error.message
            })
        }

    }

    async function brgyonClickUpd() {
        const data = {
            Code: getData.Code,
            Description: getData.Description,
            Municipality: GetMunCode(),
            ProvinceDescription: GetProvCode(),
            Moduser: jwtDecode(token).USRID,
            ZipCode: getData.ZipCode,
            IsNegative: getData.IsNegative === 'POSITIVE' ? 0 : 1

        }
        try {
            const result = await axios.post('/GroupPost/P54UB', data)
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            })

            setModalStatus(false)
            queryClient.invalidateQueries({ queryKey: ['BarangayListQuery'] }, { exact: true })
            setData({
                Code: '',
                Description: '',
                Municipality: '',
                ModUser: '',
                ZipCode: 0,
                IsNegative: 0
            })
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            })
        }
    }

    return (
        <>
            {contextHolder}
            <LabeledInput className={'w-[100%]'}
                label={'Barangay Code'}
                value={getData.Code}
                receive={(e) => { setData({ ...getData, Code: e }) }}
                readOnly={option === 'NEW' ? false : true}
            />

            <LabeledInput className={'w-[100%]'}
                label={'Barangay Name'}
                value={getData.Description}
                receive={(e) => { setData({ ...getData, Description: e }) }}
            />

            <LabeledSelect className={'w-[100%]'}
                label={'Province / Area'}
                value={getData.ProvinceDescription}
                receive={(e) => { setData({ ...getData, ProvinceDescription: e }) }}
                data={getProvinceSelect.data?.map((x) => ({
                    label: x.provinceDescription,
                    value: x.provinceDescription,

                }))}
            />


            <LabeledSelect className={'w-[100%]'}
                label={'Municipality'}
                value={getData.Municipality}
                receive={(e) => { setData({ ...getData, Municipality: e }) }}
                data={getMunFromProvCode.data?.map((x) => ({
                    label: x.munDesc,
                    value: x.munDesc,
                }))}
                readOnly={!getData.Province}


            />
            <LabeledInput className={'w-[100%]'} label={'ZipCode'}
                value={getData.ZipCode}
                receive={(e) => { setData({ ...getData, ZipCode: e }) }} />

            <LabeledSelect className={'w-[100%]'} label={'Status'}
                value={getData.IsNegative}
                receive={(e) => { setData({ ...getData, IsNegative: e }) }}

                data={[
                    {
                        label: 'POSITIVE',
                        value: 'POSITIVE'
                    },
                    {
                        label: 'NEGATIVE',
                        value: 'NEGATIVE'
                    }
                ]} />
            <center>
                {option === 'NEW' ? (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button className='bg-[#3b0764] mt-5 w-[100px]'

                            size='large' type='primary' onClick={brgyClickAdd}>Add</Button>
                    </ConfigProvider>
                ) : (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button
                            className='bg-[#3b0764] mt-5 w-[100px]'
                            size='large'
                            type='primary'
                            onClick={() => { brgyonClickUpd() }}
                        >
                            Update
                        </Button>

                    </ConfigProvider>
                )}
            </center>
        </>
    )
}

export default BarangayDetails



