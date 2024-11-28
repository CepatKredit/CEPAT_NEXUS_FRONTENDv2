import LabeledSelect from '@components/global/LabeledSelect'
import * as  React from 'react'
import { Button, ConfigProvider, notification } from 'antd'
import { SaveOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import LabeledTextArea from '@components/global/LabeledTextArea';
import axios from 'axios';
import { viewModalDocxEdit } from '@hooks/ModalController';
import { useQueryClient } from '@tanstack/react-query';
import { toDecrypt } from '@utils/Converter';
import { useCookies } from 'react-cookie';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function EditImgInfo({ data, FileListName, Display, ModUser }) {

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
    const { getAppDetails } = React.useContext(LoanApplicationContext)
    const [getValue, setValue] = React.useState({
        remarks: '',
        status: '',
        docId: '',
        fileName: ''
    })
    function FilenameContainer() {
        let container = FileListName
        const filtered = container.reduce((data, current) => {
            if (!data.find((item) => item.docsType === current.docsType)) { data.push(current) } return data
        }, [])
        return filtered
    }
    function GetDocName(data, command) {
        let display = { id: '', docsType: '' }
        FileListName.map((x) => {
            if (x.id === data || x.docsType === data) { display = { id: x.id, docsType: x.docsType } }
        })
        switch (command) {
            case 'ID':
                return display.id;
            default:
                return display.docsType;
        }
    }
    function randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    React.useEffect(() => {
        setValue({
            ...getValue,
            remarks: data?.remarks,
            status: data?.docStatus,
            docId: data?.docsId,
            fileName: GetDocName(data?.docsId, 'NAME')
        })
    }, [data])

    // const [cookies] = useCookies(['SESSION_ID']);
    // const cookieToken = cookies.SESSION_ID;
    const token = localStorage.getItem('UTK'); 
    const setModalStatus = viewModalDocxEdit((state) => state.setStatus)

    async function onClickSave() {
        const dataContainer = {
            DocsID: GetDocName(getValue.fileName, 'ID'),
            DocsFileName: `${getValue.fileName} - ${randomNumber(100000, 999999)}`,
            Remarks: getValue.remarks,
            ModUser: ModUser,
            DocStatus: parseInt(getValue.status),
            LAI: data?.loanAppId,
            Id: data?.id,
            PRODID: 'FILE'
        }

        await axios.post('/POST/P68FS', dataContainer)
            .then((result) => {
                setModalStatus(false)
                queryClient.invalidateQueries({ queryKey: ['DocListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['FileListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['ReleaseDocListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['ReleaseFileListQuery'] }, { exact: true })
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

    console.log("MODUSER", ModUser)

    return (
        <div className='h-[100%]'>
            {contextHolder}
            <div className='mx-[7%]'>
            {Display === 'USER' &&(<LabeledSelect className={'mt-2 w-[300px]'} label={'Select File Type'}
                    value={getValue.fileName || undefined}
                    receive={(e) => { setValue({ ...getValue, fileName: e }) }}
                    data={FilenameContainer().map((x) => ({ value: x.docsType, label: x.docsType }))} />)}
                <LabeledTextArea value={getValue.remarks} className={'mt-2 w-[300px]'} label={'Remarks'} receive={(e) => { setValue({ ...getValue, remarks: e }) }} />
                {Display === 'USER' && (<LabeledSelect className={'mt-2 w-[300px]'} label={'Select Loan Status'}
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
            </div>
            <div className='float-right mt-[5%]'>
                <ConfigProvider theme={{ token: { colorPrimary: '#166534' } }}>
                    <Button className='float-right bg-[#166534]' type='primary'
                        onClick={() => { onClickSave() }} icon={<SaveOutlined />}>Save</Button>
                </ConfigProvider>
            </div>
        </div>
    )
}

export default EditImgInfo