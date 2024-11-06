import * as React from 'react'
import { AiFillDashboard } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa";
import { FaGlobeAsia } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { toDecrypt } from '@utils/Converter'
import { GetData } from '@utils/UserData';
import { DollarOutlined } from '@ant-design/icons';

function SideNavRoutes() {
    let PageAccess = []
    PageAccess.push({
        key: '/ckfi/dashboard',
        icon: <AiFillDashboard style={{ fontSize: '18px' }} />,
        label: 'Dashboard',
    })

    if (GetData('ROLE').toString() === '20' || GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40') {
        PageAccess.push({
            key: '/ckfi/endorsement',
            icon: <AiFillDashboard style={{ fontSize: '18px' }} />,
            label: 'Endorsement',
        })
    }

    if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '60') {
        PageAccess.push({
            key: '/ckfi/manage-currency',
            icon: <DollarOutlined style={{ fontSize: '18px' }} />,
            label: 'Manage Currency',
        })
    }

    toDecrypt(localStorage.getItem('UPTH')).split(',').map((x) => {
        if (x === '/ckfi/manage-users') { PageAccess.push({ key: x, label: 'Manage Users', icon: <FaUsers style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-branch') { PageAccess.push({ key: x, label: 'Manage Branch', icon: <FaCodeBranch style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-country') { PageAccess.push({ key: x, label: 'Manage Country', icon: <FaGlobeAsia style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-city-municipality') { PageAccess.push({ key: x, label: 'Manage City / Municipalities', icon: <FaCity style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-agency') { PageAccess.push({ key: x, icon: <FaBuildingUser style={{ fontSize: '18px' }} />, label: 'Manage Agency', }) }
        else if (x === '/ckfi/manage-barangay') { PageAccess.push({ key: x, label: 'Manage Barangay', icon: <FaCity style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/endorsement') { PageAccess.push({ key: x, label: 'Endorsement', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/under-marketing') { PageAccess.push({ key: x, label: 'Under Marketing', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/received') { PageAccess.push({ key: x, label: 'Received', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/lack-of-documents/complied') { PageAccess.push({ key: x, label: 'Complied - Lack Of Documents', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/walk-in') { PageAccess.push({ key: x, label: 'For Walk-In', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-initial-interview') { PageAccess.push({ key: x, label: 'For Initial Interview', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/reassessed-to-marketing') { PageAccess.push({ key: x, label: 'Reassessed To Marketing', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/lack-of-documents') { PageAccess.push({ key: x, label: 'Lack Of Documents', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/credit-assessment-list') { PageAccess.push({ key: x, label: 'Credit Assessment List', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/credit-assessment/special-lane') { PageAccess.push({ key: x, label: 'Special Lane', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/credit-assessment') { PageAccess.push({ key: x, label: 'For Credit Assessement', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/under-credit') { PageAccess.push({ key: x, label: 'Under Credit', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/queue-bucket') { PageAccess.push({ key: x, label: 'Queue Bucket', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-verification') { PageAccess.push({ key: x, label: 'For Verification', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/pre-check') { PageAccess.push({ key: x, label: 'Pre-Check', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        //else if (x === '/ckfi/return/marketing') { PageAccess.push({ key: x, label: 'Return From Marketing', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/return/credit-associate') { PageAccess.push({ key: x, label: 'Return From Credit Associate', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/return/credit-officer') { PageAccess.push({ key: x, label: 'Return From Credit Officer', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/reassessed/credit-officer') { PageAccess.push({ key: x, label: 'Reassessed From Credit Officer', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/pre-approval') { PageAccess.push({ key: x, label: 'Pre Approval', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-approval') { PageAccess.push({ key: x, label: 'For Approval', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/approved') { PageAccess.push({ key: x, label: 'Approved (Trans-Out)', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/under-loan-processor') { PageAccess.push({ key: x, label: 'Under Lp', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-docusign') { PageAccess.push({ key: x, label: 'For Docusign', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/ok/for-docusign') { PageAccess.push({ key: x, label: 'Ok For Docusign', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/tagged-for-release') { PageAccess.push({ key: x, label: 'Tagged For Release', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/on-waiver') { PageAccess.push({ key: x, label: 'On Waiver', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/confirmation') { PageAccess.push({ key: x, label: 'Confirmation', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/confirmed') { PageAccess.push({ key: x, label: 'Confirmed', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/undecided') { PageAccess.push({ key: x, label: 'Undecided', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-disbursement') { PageAccess.push({ key: x, label: 'For Disbursement', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/bank-generation') { PageAccess.push({ key: x, label: 'Bank Generation', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/released') { PageAccess.push({ key: x, label: 'Released', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/return/loan-processor') { PageAccess.push({ key: x, label: 'Return From Loans Processor', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/cancelled') { PageAccess.push({ key: x, label: 'Cancelled', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/declined') { PageAccess.push({ key: x, label: 'Declined', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
        else { PageAccess.push({ key: x, label: 'For Re-Application', icon: <AiFillDashboard style={{ fontSize: '18px' }} />, }) }
    })
    return PageAccess;
}


export default SideNavRoutes