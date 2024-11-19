import LabeledInput from '@components/global/LabeledInput'
import LabeledTextArea from '@components/global/LabeledTextArea'
import * as React from 'react'
import { ConfigProvider, Button, notification } from 'antd'
import { viewEditBranchModal } from '@hooks/ModalAdminController';
import { useQueryClient } from '@tanstack/react-query';
import LabeledSelect from '@components/global/LabeledSelect'
import { BranchStatus } from '@utils/FixedData'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';



function EditBranch() {
    const [api, contextHolder] = notification.useNotification();
    const token = localStorage.getItem('UTK');

    const queryClient = useQueryClient()
    const getDataList = viewEditBranchModal((state) => state.dataCollection)
    const [getData, setData] = React.useState({
        Code: '',
        Name: '',
        Address: '',
        Description: '',
        Status: '',
    })

    React.useEffect(() => {
        setData({
            ...getData,
            Code: getDataList.code,
            Name: getDataList.name,
            Address: getDataList.address,
            Description: getDataList.description,
            Status: getDataList.status,
        })
        
    }, [getDataList])

    const setEditModalStatus = viewEditBranchModal((state) => state.setStatus)
    async function onClickUpdateBranch(e) {
        e.preventDefault();
        const revData = {
            Code: getData.Code,
            Name: getData.Name,
            Address: getData.Address,
            Description: getData.Description,
            Status: getData.Status,
            ModUser: jwtDecode(token).USRID,
            ModDate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        };
        console.log(revData)
        await axios.post('/GroupPost/P59UB', revData)
            .then(result => {

                if (result.data.status === 'success') {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    });
                    setEditModalStatus(false)
                } else {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description
                    });
                }
            })
            .catch(error => {
                api['error']({
                    message: 'Failed to update branch info',
                    description: error.message
                });
                console.log(error)
            })
       
        queryClient.invalidateQueries({ queryKey: ['BranchList'] }, { exact: true })

    }






    return (
        <>
            {contextHolder}

            <LabeledInput className={'w-[100%]'} label={'Branch Name'} value={getData.Name}
                receive={(e) => { setData({ ...getData, Name: e }) }} />
            <LabeledTextArea className={'w-[100%]'} label={'Address'} value={getData.Address}
                receive={(e) => { setData({ ...getData, Address: e }) }} />
            <LabeledTextArea className={'w-[100%]'} label={'Description'} value={getData.Description}
                receive={(e) => { setData({ ...getData, Description: e }) }} />
            <LabeledSelect className={'w-[100%]'} label={'Status'} data={BranchStatus()} value={getData.Status }
                receive={(e) => { setData({ ...getData, Status: e }) }} />
            <center>
                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Button className='bg-[#3b0764] mt-5 w-[100px]' onClick={onClickUpdateBranch}
                        size='large' type='primary'>Update</Button>
                </ConfigProvider>
            </center>
        </>
    )
}

export default EditBranch