import React from 'react';
import { Button, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ApproveDeletePn = ({ onApprove, onDecline, GetData }) => {
    if (GetData('ROLE').toString() !== '100') {
        return null; 
    }

    const handleApprove = () => {
        onApprove();
        notification.success({
            message: 'PN Number Deletion Approved',
            description: `PN number for CEO has been approved for deletion.`,
            placement: 'topRight',
        });
    };

    const handleDecline = () => {
        onDecline();
        notification.error({
            message: 'PN Number Deletion Declined',
            description: `PN number for CEO has been declined.`,
            placement: 'topRight',
        });
    };

    return (
        <div className="flex space-x-4">
            <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleApprove}
                className="bg-green-500"
            >
                Approve
            </Button>
            <Button
                type="danger"
                icon={<CloseCircleOutlined />}
                onClick={handleDecline}
                className="bg-red-500"
            >
                Decline
            </Button>
        </div>
    );
};

export default ApproveDeletePn;
