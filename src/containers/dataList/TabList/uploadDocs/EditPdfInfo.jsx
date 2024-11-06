import * as React from 'react'
import { Modal, Button, ConfigProvider, notification, Input } from 'antd'
import { SaveOutlined } from '@ant-design/icons';
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import DefaultToolbar from './pdfToolbar/DefaultToolbar'
import LimitedToolbar from './pdfToolbar/LimitedToolbar'
import LabeledSelect from '@components/global/LabeledSelect'
import { viewPDFViewer } from '@hooks/ModalController';
import axios from 'axios';
import { toUpperText } from '@utils/Converter';
import { jwtDecode } from 'jwt-decode';
import { useQueryClient } from '@tanstack/react-query';

function EditPdfInfo({ showModal, closeModal, toolBar, data, isClient }) {

    const queryClient = useQueryClient()
    const { GetData, setStatus } = viewPDFViewer()
    const [api, contextHolder] = notification.useNotification();
    const [getValue, setValue] = React.useState({
        remarks: '',
        status: ''
    })

    React.useEffect(() => {
        setValue({
            ...getValue,
            remarks: data?.remarks,
            status: data?.docStatus
        })
    }, [data])

    const token = localStorage.getItem('UTK');
    async function onClickSave() {
        const dataContainer = {
            DocsID: data?.docsId,
            DocsFileName: data?.docsFileName,
            Remarks: getValue.remarks,
            ModUser: jwtDecode(token).USRID,
            DocStatus: parseInt(getValue.status),
            LAI: data?.loanAppId,
            Id: data?.id,
            PRODID: 'FILE'
        }

        await axios.post('/updateFileStatus', dataContainer)
            .then((result) => {
                setStatus(false)
                queryClient.invalidateQueries({ queryKey: ['DocListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['FileListQuery'] }, { exact: true })
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={'View PDF'}
                centered
                open={showModal}
                onCancel={closeModal}
                width={'90%'}
                maskClosable={false}
                footer={false} >
                <div className='h-[80vh] overflow-y-auto'>
                    <div className='flex flex-wrap gap-1'>
                        {isClient === 'USER' && (<LabeledSelect className={'mt-2 w-[300px]'} label={'Select Loan Status'}
                            value={parseInt(getValue.status) === 1 ? 'ENABLE' : 'ARCHIVE'}
                            receive={(e) => {
                                e === 'ENABLE'
                                    ? setValue({ ...getValue, status: 1 })
                                    : setValue({ ...getValue, status: 0 })
                            }}
                            data={[
                                { label: 'ENABLE', value: 'ENABLE' },
                                { label: 'ARCHIVE', value: 'ARCHIVE ' }
                            ]} />)}
                        
                        <div className='mt-2 w-[50rem]'>
                            <div>
                                <label className='font-bold'>Remarks</label>
                            </div>
                            <div>
                                <Input.TextArea style={{ width: '100%', height: 40, resize: 'none' }}
                                    value={getValue?.remarks} onChange={(e) => { setValue({ ...getValue, remarks: toUpperText(e.target.value) }) }} />
                            </div>
                        </div>
                        <ConfigProvider theme={{ token: { colorPrimary: '#166534' } }}>
                            <Button className='mt-7 bg-[#166534]' type='primary'
                                size='large' icon={<SaveOutlined />} onClick={() => { onClickSave() }}>Save</Button>
                        </ConfigProvider>
                    </div>
                    <div className='pdf-container mt-[1%] h-[85%]'>
                        {
                            toolBar === 'Default'
                                ? (<DefaultToolbar file={GetData} />)
                                : (<LimitedToolbar file={GetData} />)
                        }
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default EditPdfInfo