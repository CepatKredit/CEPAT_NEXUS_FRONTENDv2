import LabeledInput from '@components/global/LabeledInput'
import LabeledTextArea from '@components/global/LabeledTextArea'
import * as React from 'react'
import { ConfigProvider, Button, notification } from 'antd'
import LabeledNumericInput from '@components/global/LabeledNumericInput'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { viewCreateNewBranchModal } from '@hooks/ModalAdminController';


function NewBranch() {
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification();
    const queryClient = useQueryClient()
    const [getData, setData] = React.useState({
        Code: 0,
        Name: '',
        Address: '',
        Description: '',
        Status: 1,


    })
    const setAddModalStatus = viewCreateNewBranchModal((state) => state.setStatus)

    async function onClickAddBranch(e) {
        e.preventDefault();
        const getver = {
            Code: getData.Code,
            Name: getData.Name,
            Address: getData.Address,
            Description: getData.Description,
            Status: getData.Status,
            RecUser: jwtDecode(token).USRID,
            RecDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        }
        await axios.post('/GroupPost/P58AB', getver)
            .then(result => {
                if (result.data.status === 'success') {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    });
                    setAddModalStatus(false)
                } else {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    });
                }
            
            })
            .catch(error => {
                console.log(error)
                
            })
        queryClient.invalidateQueries({ queryKey: ['BranchList'] }, { exact: true })

    }

    return (
        <>
            {contextHolder}

            <LabeledNumericInput className={'w-[100%]'} label={'Branch Code'}
                value={getData.Code || ''}
                receive={(e) => {
                    setData({
                        ...getData,
                        Code: e
                    })
                }} />
            <LabeledInput className={'w-[100%]'} label={'Branch Name'}
                value={getData.Name}
                receive={(e) => {
                    setData({
                        ...getData,
                        Name: e
                    })
                }} />
            <LabeledTextArea className={'w-[100%'} label={'Address'}
                value={getData.Address}
                receive={(e) => {
                    setData({
                        ...getData,
                        Address: e
                    })
                }} />
            <LabeledTextArea className={'w-[100%'} label={'Description'}
                value={getData.Description}
                receive={(e) => {
                    setData({
                        ...getData,
                        Description: e
                    })
                }} />
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-5 w-[100px]'
                        size='large' onClick={onClickAddBranch} type='primary'>Add</Button>
                </ConfigProvider>
            </center>
        </>
    )
}

export default NewBranch