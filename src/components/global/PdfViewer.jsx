import * as React from 'react'
import { Modal } from 'antd'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'


function PdfViewer({ showModal, closeModal, pdfFile }) {
    const newplugin = defaultLayoutPlugin()
    return (
        <Modal
            title={'View PDF'}
            centered
            open={showModal}
            onCancel={closeModal}
            width={'90%'}
            maskClosable={false}
            footer={false} >
            <div className='h-[600px] overflow-y-auto'>
                <div className='pdf-container h-[100%]'>
                    <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
                        <Viewer fileUrl={pdfFile} plugins={[newplugin]} />
                    </Worker>
                </div>
            </div>
        </Modal>
    )
}

export default PdfViewer