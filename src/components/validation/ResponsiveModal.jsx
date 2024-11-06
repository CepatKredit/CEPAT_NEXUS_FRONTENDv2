import * as React from 'react'
import { Modal } from 'antd'

function ResponsiveModal({ showModal, closeModal, modalWidth, modalTitle, contextHeight, contextInside }) {
    return (
        <Modal
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

export default ResponsiveModal