import * as React from 'react'
import { Image, Empty, Tooltip, Space } from 'antd'
import {
    EditOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    UndoOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';
import { viewPDFView, viewModalDocxEdit, viewPDFViewer } from '@hooks/ModalController';
import ZindexModal from '@components/uploadDocx/ZindexModal';
import EditImgInfo from './EditImgInfo';
import EditPdfInfo from './EditPdfInfo';
import ViewPdf from './pdfToolbar/ViewPdf';
import { toUpperText } from '@utils/Converter';
import { v4 as uuidv4 } from 'uuid';

function FileLoader({ key, files, Display,FileListName,isClient }) {

    const getModalStatus = viewModalDocxEdit((state) => state.modalStatus)
    const setModalStatus = viewModalDocxEdit((state) => state.setStatus)

    const getPDFStatus = viewPDFViewer((state) => state.modalStatus)
    const setPDFStatus = viewPDFViewer((state) => state.setStatus)
    const setData = viewPDFViewer((state) => state.StoreData)

    const { modalStatus, setStatus, storeData } = viewPDFView()

    let refresher = uuidv4()

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

    return (
        <div className='flex flex-wrap' key={key}>
            <EditPdfInfo showModal={getPDFStatus} closeModal={() => { setPDFStatus(false) }} toolBar={'Default'} data={getFileData} FileListName={FileListName} isClient={isClient}/>
            <ViewPdf showModal={modalStatus} closeModal={() => { setStatus(false) }} />
            <ZindexModal showModal={getModalStatus} closeModal={() => { setModalStatus(false) }}
                modalWidth={'400px'} modalTitle={'Edit Document'} contextHeight={isClient === 'USER'? 'h-[320px]' : 'h-[200px]'} contextInside={(<>
                    <EditImgInfo data={getFileData} FileListName={FileListName} Display={isClient} />
                </>)} />
            {
                FileList('') === 'EMPTY'
                    ? (<div className='w-[100vw] h-[30vh] flex items-center justify-center'>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>)
                    : (<>
                        {
                            FileList('IMG').map((x, i) => (
                                <div className='mr-[.5rem]'>
                                    <Image.PreviewGroup key={i} items={FileList('IMG-LIST')}
                                        preview={{
                                            toolbarRender: (
                                                _,
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
                                                },
                                            ) => (
                                                <Space size={20} className="toolbar-wrapper">
                                                    {
                                                        Display === 'USER'
                                                            ? (<Tooltip placement='top' title='Edit'>
                                                                <EditOutlined style={{ fontSize: '20px' }} onClick={() => {
                                                                    setFileData(x)
                                                                    setModalStatus(true)
                                                                }}
                                                                />
                                                            </Tooltip>)
                                                            : (<></>)
                                                    }
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
                                        if (Display === 'USER') {
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