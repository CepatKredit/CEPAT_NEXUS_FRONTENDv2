import * as React from 'react'
import { Modal } from 'antd'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import LimitedToolbar from './LimitedToolbar'
import { viewPDFView } from '@hooks/ModalController';
import { base64toBlob } from '@utils/Converter'

function ViewPdf({ showModal, closeModal, Display }) {

    const getPDFData = viewPDFView((state) => state.dataHolder)

    return (
        <Modal
            zIndex={9999}
            title={'View PDF'}
            centered
            open={showModal}
            onCancel={closeModal}
            width={'90%'}
            maskClosable={false}
            footer={false} >
            <div className='h-[80vh] overflow-y-auto'>
                <LimitedToolbar file={
                    Display === 'USER'
                        ? base64toBlob(getPDFData)
                        : getPDFData
                } />
            </div>
        </Modal>
    )
}

export default ViewPdf