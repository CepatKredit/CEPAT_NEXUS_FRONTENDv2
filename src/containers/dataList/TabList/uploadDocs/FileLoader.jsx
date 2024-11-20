import * as React from 'react'
import { Image, Empty, Tooltip, Space, Input, Select, Radio, Button, ConfigProvider, notification } from 'antd'
import {
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { viewPDFView, viewModalDocxEdit, viewPDFViewer } from '@hooks/ModalController';
import ZindexModal from '@components/uploadDocx/ZindexModal';
import EditImgInfo from './EditImgInfo';
import EditPdfInfo from './EditPdfInfo';
import ViewPdf from './pdfToolbar/ViewPdf';
import { toUpperText } from '@utils/Converter';
import axios from 'axios';

function FileLoader({ key, files, Display, FileListName, isClient }) {

    const getModalStatus = viewModalDocxEdit((state) => state.modalStatus)
    const setModalStatus = viewModalDocxEdit((state) => state.setStatus)

    const getPDFStatus = viewPDFViewer((state) => state.modalStatus)
    const setPDFStatus = viewPDFViewer((state) => state.setStatus)
    const setData = viewPDFViewer((state) => state.StoreData)

    const { modalStatus, setStatus, storeData } = viewPDFView()

    function FileList(command) {

        let img = []
        let img_files = []
        let pdf = []

        files?.map((x) => {
            if (x.extension === '.pdf') {
                pdf.push(x)
            }
            else {
                img.push(x)
                img_files.push(x.file)
            }
        })

        if (files.length === 0) {
            return 'EMPTY';
        }
        else {
            switch (toUpperText(command)) {
                case 'PDF':
                    return pdf;
                case 'IMG-LIST':
                    return img_files;
                default:
                    return img;
            }
        }
    }

    const [getFileData, setFileData] = React.useState()

    const queryClient = useQueryClient()
    const [api, contextHolder] = notification.useNotification();
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
        FileListName?.map((x) => {
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

    const [getPointer, serPointer] = React.useState('')

    React.useEffect(() => {
        setValue({
            ...getValue,
            remarks: getFileData?.remarks,
            status: getFileData?.docStatus,
            docId: getFileData?.docsId,
            fileName: GetDocName(getFileData?.docsId, 'NAME')
        })
    }, [getPointer])
    const token = localStorage.getItem('UTK');
    async function onClickSave() {
        onClickSaveImg.mutate();
    }

    const onClickSaveImg = useMutation({
        mutationFn: async () => {
            const dataContainer = {
                DocsID: GetDocName(getValue.fileName, 'ID'),
                DocsFileName: `${getValue.fileName} - ${randomNumber(100000, 999999)}`,
                Remarks: getValue.remarks,
                ModUser: jwtDecode(token).USRID,
                DocStatus: parseInt(getValue.status),
                LAI: getFileData?.loanAppId,
                Id: getFileData?.id,
                PRODID: 'FILE'
            }
            await axios.post('/updateFileStatus', dataContainer)
            .then((result) => {
                queryClient.invalidateQueries({ queryKey: ['DocListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['FileListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['ReleaseDocListQuery'] }, { exact: true })
                queryClient.invalidateQueries({ queryKey: ['ReleaseFileListQuery'] }, { exact: true })
                setFileData(FileList('IMG')[parseInt(getPointer) - 1]);
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
    })

    return (
        <div className='flex flex-wrap' key={key}>
            {contextHolder}
            <EditPdfInfo showModal={getPDFStatus} closeModal={() => { setPDFStatus(false) }} toolBar={'Default'} data={getFileData} FileListName={FileListName} isClient={isClient} />
            <ViewPdf showModal={modalStatus} closeModal={() => { setStatus(false) }} />
            <ZindexModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }}
                modalWidth={'400px'} modalTitle={'Edit Document'} contextHeight={isClient === 'USER' ? 'h-[320px]' : 'h-[200px]'} contextInside={(<>
                    <EditImgInfo data={getFileData} FileListName={FileListName} Display={isClient} className='z-50' />
                </>)} />
            {
                FileList('') === 'EMPTY'
                    ? (<div className='w-[100vw] h-[30vh] flex items-center justify-center'>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>)
                    : (<>
                        {
                            FileList('IMG').map((x, i) => (
                                <div className='mr-[.5rem]' key={i}>
                                    <Image.PreviewGroup key={i} items={FileList('IMG-LIST')}
                                        preview={{
                                            countRender: (counter) => { serPointer(counter.toString()); setFileData(FileList('IMG')[counter - 1]); },
                                            toolbarRender: (_,
                                                {
                                                    transform: { scale },
                                                    actions: {
                                                        onFlipY,
                                                        onFlipX,
                                                        onRotateLeft,
                                                        onRotateRight,
                                                        onZoomOut,
                                                        onZoomIn,
                                                        onReset,
                                                    },
                                                }
                                            ) => (
                                                <div className='flex flex-col p-4 rounded-lg bg-stone-100 shadow-2xl ring-2 ring-stone-600 ring-offset-0 z-50'>
                                                    <center>
                                                        <div className='invert text-base font-semibold pb-1'>{`${getPointer.toString()} / ${FileList('IMG').length.toString()}`}</div>
                                                        <Space size={20} className="toolbar-wrapper invert">
                                                            <Tooltip placement='top' title='Flip Bottom'>
                                                                <SwapOutlined style={{ fontSize: '20px' }} rotate={90} onClick={onFlipY} />
                                                            </Tooltip>
                                                            <Tooltip placement='top' title='Flip Right'>
                                                                <SwapOutlined style={{ fontSize: '20px' }} onClick={onFlipX} />
                                                            </Tooltip>
                                                            <Tooltip placement='top' title='Rotate Left'>
                                                                <RotateLeftOutlined style={{ fontSize: '20px' }} onClick={onRotateLeft} />
                                                            </Tooltip>
                                                            <Tooltip placement='top' title='Rotate Right'>
                                                                <RotateRightOutlined style={{ fontSize: '20px' }} onClick={onRotateRight} />
                                                            </Tooltip>
                                                            <Tooltip placement='top' title='Zoom Out'>
                                                                <ZoomOutOutlined style={{ fontSize: '20px' }} disabled={scale === 1} onClick={onZoomOut} />
                                                            </Tooltip>
                                                            <Tooltip placement='top' title='Zoom In'>
                                                                <ZoomInOutlined style={{ fontSize: '20px' }} disabled={scale === 50} onClick={onZoomIn} />
                                                            </Tooltip>
                                                            <Tooltip placement='top' title='Reset'>
                                                                <UndoOutlined style={{ fontSize: '20px' }} onClick={onReset} />
                                                            </Tooltip>
                                                        </Space>
                                                    </center>
                                                    <div className='flex flex-row'>
                                                        {isClient === 'USER' ? (<div className='flex flex-col mr-2'>
                                                            <div className='mt-2 w-[15rem]'>
                                                                <div>
                                                                    <label className='invert'>Select File Type</label>
                                                                </div>
                                                                <div>
                                                                    <Select style={{ width: '100%', zIndex: 100 }}
                                                                        size='large'
                                                                        placeholder={'Please Select...'}
                                                                        allowClear
                                                                        showSearch
                                                                        value={getValue.fileName || undefined}
                                                                        onChange={(e) => { setValue({ ...getValue, fileName: e }) }}
                                                                        options={FilenameContainer().map((x) => ({ value: x.docsType, label: x.docsType }))}
                                                                       // optionRender={(option) => (<span className='font-semibold '>     {option.data.value}   </span>)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Radio.Group value={getValue.status} onChange={(e) => { setValue({ ...getValue, status: e.target.value }) }} className='w-full mt-4'>
                                                                <Radio value={1}><span className='contrast-200'>Enable</span></Radio>
                                                                <Radio value={2}><span className='invert-0'>Disable</span></Radio>
                                                            </Radio.Group>
                                                        </div>) : (<></>)}
                                                        <div className='mt-2 w-[25rem]'>
                                                            <div>
                                                                <label className='invert'>Remarks</label>
                                                            </div>
                                                            <div>
                                                                <Input.TextArea style={{ width: '100%', height: 90, resize: 'none' }}
                                                                    size='large'
                                                                    value={getValue.remarks}
                                                                    onChange={(e) => { setValue({ ...getValue, remarks: e.target.value }) }}
                                                                    allowClear
                                                                    maxLength={250}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <center>
                                                        <ConfigProvider theme={{ token: { colorPrimary: '#166534' } }}>
                                                            <Button className='mt-2 bg-[#166534] w-[10rem]' type='primary'
                                                                onClick={() => { onClickSave() }} icon={<SaveOutlined />} loading={onClickSaveImg.isPending} >Save</Button>
                                                        </ConfigProvider>
                                                    </center>
                                                </div>
                                            ),
                                        }}>
                                        <Tooltip placement='top' title={<div>
                                            <span>Remarks: {x.remarks}</span><br />
                                            <span>Date: {x.recDate}</span><br />
                                        </div>}>
                                            <Image className='rounded-md' key={i} height={'8rem'} width={'8rem'} src={FileList('IMG-LIST')[i]} />
                                        </Tooltip>
                                    </Image.PreviewGroup>
                                </div>
                            ))
                        }
                        {
                            FileList('PDF').map((x, i) => (<Tooltip placement='top' title={<div>
                                <span>Remarks: {x.remarks}</span><br />
                                <span>Date: {x.recDate}</span><br />
                            </div>}>
                                <div key={i + 1} className='h-[8rem] w-[8rem] rounded-md bg-[#3b0764] hover:bg-[#6b21a8] 
                        text-white font-medium text-center flex justify-center items-center cursor-pointer mr-[.5rem]'
                                    onClick={() => {
                                        setFileData(x)
                                        if (isClient === 'USER') {
                                            setData(x.file)
                                            setPDFStatus(true)
                                        }
                                        else {
                                            storeData(x.file)
                                            setStatus(true)
                                        }
                                    }}>
                                    <div className='text-[1.5rem]'>PDF</div>
                                </div>
                            </Tooltip>))
                        }
                    </>)
            }

        </div >
    )
}

export default FileLoader