import LabeledInput from '@components/global/LabeledInput'
import LabeledSelect from '@components/global/LabeledSelect'
import * as React from 'react'

import { ConfigProvider, Button, notification } from 'antd'
import moment from 'moment'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST, POST_DATA } from '@api/base-api/BaseApi'
import { viewCountryModal } from '@hooks/ModalAdminController';
import axios from 'axios';


function CountryDetails({ option }) {

    const queryClient = useQueryClient()
    const setModalStatus = viewCountryModal((state) => state.setStatus)
    const [api, contextHolder] = notification.useNotification();
    const [getData, setData] = React.useState({
        Code: '',
        Description: '',
        RecUser: '00000000-0000-0000-0000-000000000000',
        RecDate:  moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        ModUser: '00000000-0000-0000-0000-000000000000',
        ModDate:  moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        IntrntionlSubGrp: '',
        IntrntionGrp: '',
        IsNegative: ''
    })

    React.useEffect(() => {
        if (option != 'NEW') {
            setData({
                ...getData,
                Code: option.countryCode,
                Description: option.countryDesc,
                IntrntionlSubGrp: option.intSubGroupDesc,
                IntrntionGrp: option.intGroupDesc,
                IsNegative: option.isNegative === 0 ? 'POSITIVE' : 'NEGATIVE',
            })
        }
        else {
            setData({
                Code: '',
                Description: '',
                RecUser: '00000000-0000-0000-0000-000000000000',
                RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                ModUser: '00000000-0000-0000-0000-000000000000',
                ModDate:  moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                IntrntionlSubGrp: '',
                IntrntionGrp: '',
                IsNegative: ''
            })
        }
    }, [option])

    const IntSubGroupListQuery = useQuery({
        queryKey: ['IntSubGroupList'],
        queryFn: async () => {
            const result = await GET_LIST('/GET/G14ISG')
            return result.list.result
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    })


    async function SelectedSub(e) {
        const dataHolder = { Code: e }
        var data = await POST_DATA('/GroupPost/P63GIG', dataHolder)
        setData({
            ...getData,
            IntrntionlSubGrp: e,
            IntrntionGrp: data.list[0].intGroupDesc
        })
    }


    async function onClickAdd() {
        const data = {
            Code: getData.Code,
            Description: getData.Description,
            RecUser: '91edbc18-d44f-4ba5-0f0f-08dca53a63a0',
            RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
            IntrntionlSubGrp: getData.IntrntionlSubGrp,
            IsNegative: getData.IsNegative === 'POSITIVE' ? 0 : 1
        }
        
        await axios.post('/GroupPost/P64AC', data)
            .then(result => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })

                queryClient.invalidateQueries({ queryKey: ['CountryListQuery'] }, { exact: true })
                setData({
                    Code: '',
                    Description: '',
                    RecUser: '91edbc18-d44f-4ba5-0f0f-08dca53a63a0',
                    RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    ModUser: '91edbc18-d44f-4ba5-0f0f-08dca53a63a0',
                    ModDate:  moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    IntrntionlSubGrp: '',
                    IntrntionGrp: '',
                    IsNegative: ''
                })
            })
            .catch(error => {
                console.log(error)
                api['error']({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    }

    async function onClickUpdate() {
        const data = {
            Code: getData.Code,
            Description: getData.Description,
            ModUser: '91edbc18-d44f-4ba5-0f0f-08dca53a63a0',
            ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
            IntrntionlSubGrp: getData.IntrntionlSubGrp,
            IsNegative: getData.IsNegative === 'POSITIVE' ? 0 : 1
        }

        await axios.post('/GroupPost/P65UC', data)
            .then(result => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
                setModalStatus(false)
                setData({
                    Code: '',
                    Description: '',
                    RecUser: '91edbc18-d44f-4ba5-0f0f-08dca53a63a0',
                    RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    ModUser: '91edbc18-d44f-4ba5-0f0f-08dca53a63a0',
                    ModDate:  moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    IntrntionlSubGrp: '',
                    IntrntionGrp: '',
                    IsNegative: ''
                })
            })
            .catch(error => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.description
                })
            })

    }

    return (
        <>
            {contextHolder}
            <LabeledInput className={'w-[100%]'} label={'Country Code'} value={getData.Code}
                receive={(e) => { setData({ ...getData, Code: e }) }} readOnly={option != 'NEW' ? true : false} />
            <LabeledInput className={'w-[100%]'} label={'Country Name'} value={getData.Description}
                receive={(e) => { setData({ ...getData, Description: e }) }} />
            <LabeledSelect className={'w-[100%]'} label={'International Sub-Group'} value={getData.IntrntionlSubGrp}

                receive={(e) => { SelectedSub(e) }}

                data={IntSubGroupListQuery.data?.map((x) => ({
                    value: x.code,
                    label: x.description,
                }))} />
            <LabeledInput className={'w-[100%]'} label={'Continent'} value={getData.IntrntionGrp} readOnly={true} />
            <LabeledSelect className={'w-[100%]'} label={'Status'} value={getData.IsNegative}
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
                {
                    option === 'NEW'
                        ? (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button className='bg-[#3b0764] mt-5 w-[100px]' onClick={onClickAdd}
                                disabled={!getData.Code || !getData.Description || !getData.IntrntionlSubGrp || !getData.IsNegative}
                                size='large' type='primary'>Add</Button>
                        </ConfigProvider>)
                        : (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button className='bg-[#3b0764] mt-5 w-[100px]' onClick={onClickUpdate}
                                disabled={!getData.Code || !getData.Description || !getData.IntrntionlSubGrp || !getData.IsNegative}
                                size='large' type='primary'>Update</Button>
                        </ConfigProvider>)
                }
            </center>
        </>
    )
}

export default CountryDetails