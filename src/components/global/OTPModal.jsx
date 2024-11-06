import * as React from 'react'
import { Modal } from 'antd'

function OTPModal({ showModal,closeModal, modalWidth, contextHeight, contextInside }) {
    return (
        <Modal
            centered
            open={showModal}
            width={modalWidth}
            onCancel={closeModal}
            maskClosable={false}
            footer={false} >
            <div className={contextHeight}>
                {contextInside}
            </div>
        </Modal>
    )
}

export default OTPModal