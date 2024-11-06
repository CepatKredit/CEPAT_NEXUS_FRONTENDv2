import * as React from 'react'
import { Modal } from 'antd'

function ZindexModal({ showModal, closeModal, modalWidth, modalTitle, contextHeight, contextInside }) {
    return (
        <Modal zIndex={9999}
            title={modalTitle}
            centered
            open={showModal}
            onCancel={closeModal}
            width={modalWidth}
            maskClosable={false}
            footer={false} >
            <div className={contextHeight}>
                {contextInside}
            </div>
        </Modal>
    )
}

export default ZindexModal