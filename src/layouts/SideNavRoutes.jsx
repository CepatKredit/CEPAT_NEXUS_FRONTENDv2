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
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaFileCircleQuestion } from 'react-icons/fa6';
import { LuClipboardCheck } from 'react-icons/lu';
import { FaPersonWalking } from 'react-icons/fa6';
import { FaPersonWalkingDashedLineArrowRight } from 'react-icons/fa6';
import { TbFileIsr } from 'react-icons/tb';
import { FaFileCircleExclamation } from 'react-icons/fa6';
import { FaRegCreditCard } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import { MdLabelImportant } from 'react-icons/md';
import { RxEnter } from 'react-icons/rx';
import { HiMiniQueueList } from 'react-icons/hi2';
import { FaFileShield } from 'react-icons/fa6';
import { FaFileSignature } from 'react-icons/fa';
import { MdOutlineSevereCold } from 'react-icons/md';
import { GiConfirmed } from 'react-icons/gi';
import { MdEditDocument } from 'react-icons/md';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { BsPersonFillExclamation } from 'react-icons/bs';
import { MdCancel } from 'react-icons/md';
import { FaThumbsDown } from 'react-icons/fa';
import { BiRedo } from 'react-icons/bi';
import { BankOutlined } from '@ant-design/icons';
import { LuFileBox } from 'react-icons/lu';
import { BiSolidCreditCardAlt } from "react-icons/bi";
import { FaHandshake } from "react-icons/fa";
import { AiOutlineRollback } from "react-icons/ai";
import { MdOutlineAssessment } from "react-icons/md";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { AiOutlineSignature } from "react-icons/ai";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { LuDatabaseBackup } from "react-icons/lu";


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
            icon: <FaHandshake  style={{ fontSize: '18px' }} />,
            label: 'Endorsement',
        })
    }

    if (GetData('ROLE')?.toString() === '50' || GetData('ROLE')?.toString() === '55' || GetData('ROLE')?.toString() === '60') {
        PageAccess.push({
            key: '/ckfi/manage-currency',
            icon: <DollarOutlined style={{ fontSize: '18px' }} />,
            label: 'Manage Currency',
        })
    }

    toDecrypt(localStorage.getItem('UPTH'))?.split(',').map((x) => {
        if (x === '/ckfi/searches') {
            return;
        }
        if (x === '/ckfi/manage-users') { PageAccess.push({ key: x, label: 'Manage Users', icon: <FaUsers style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-branch') { PageAccess.push({ key: x, label: 'Manage Branch', icon: <FaCodeBranch style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-country') { PageAccess.push({ key: x, label: 'Manage Country', icon: <FaGlobeAsia style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-city-municipality') { PageAccess.push({ key: x, label: 'Manage City / Municipalities', icon: <FaCity style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/manage-agency') { PageAccess.push({ key: x, icon: <FaBuildingUser style={{ fontSize: '18px' }} />, label: 'Manage Agency', }) }
        else if (x === '/ckfi/manage-barangay') { PageAccess.push({ key: x, label: 'Manage Barangay', icon: <FaCity style={{ fontSize: '18px' }} />, }) }

        else if (x === '/ckfi/received') { PageAccess.push({ key: x, label: 'Received', icon: <IoMdCheckmarkCircleOutline style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/under-marketing') { PageAccess.push({ key: x, label: 'Under Marketing', icon: <LuClipboardCheck style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/lack-of-documents/complied') { PageAccess.push({ key: x, label: 'Complied - Lack Of Documents', icon: <FaFileCircleQuestion style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/walk-in') { PageAccess.push({ key: x, label: 'For Walk-In', icon: <FaPersonWalking style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/initial-interview') { PageAccess.push({ key: x, label: 'For Initial Interview', icon: <FaPersonWalkingDashedLineArrowRight style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/reassessed/marketing') { PageAccess.push({ key: x, label: 'Reassessed To Marketing', icon: <TbArrowBackUpDouble  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/lack-of-documents') { PageAccess.push({ key: x, label: 'Lack Of Documents', icon: <FaFileCircleExclamation style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/credit-list') { PageAccess.push({ key: x, label: 'Credit Assessment List', icon: <FaRegCreditCard style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/under-credit') { PageAccess.push({ key: x, label: 'Under Credit', icon: <BiSolidCreditCardAlt style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/approved') { PageAccess.push({ key: x, label: 'Approved (Trans-Out)', icon: <RxExit style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/special-lane') { PageAccess.push({ key: x, label: 'Special Lane', icon: <MdLabelImportant style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/assessement/credit') { PageAccess.push({ key: x, label: 'For Credit Assessement', icon: <MdOutlineAssessment style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/queue-bucket') { PageAccess.push({ key: x, label: 'Queue Bucket', icon: <HiMiniQueueList style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-verification') { PageAccess.push({ key: x, label: 'For Verification', icon: <FaFileShield style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/pre-check') { PageAccess.push({ key: x, label: 'Pre-Check', icon: <FaFileSignature style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/returned/marketing') { PageAccess.push({ key: x, label: 'Returned From Marketing', icon: <MdOutlineAssignmentReturn  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/returned/credit-associate') { PageAccess.push({ key: x, label: 'Returned From Credit Associate', icon: <AiOutlineRollback  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/reassessed/credit-associate') { PageAccess.push({ key: x, label: 'Reassessed To Credit Associate', icon: <TbFileIsr style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/returned/credit-officer') { PageAccess.push({ key: x, label: 'Returned From Credit Officer', icon: <MdOutlineSevereCold style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/reassessed/credit-officer') { PageAccess.push({ key: x, label: 'Reassessed To Credit Officer', icon: <LuDatabaseBackup  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-approval') { PageAccess.push({ key: x, label: 'For Approval', icon: <MdApproval  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/on-waiver') { PageAccess.push({ key: x, label: 'On Waiver', icon: <AiOutlineSignature  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/approved') { PageAccess.push({ key: x, label: 'Approved (Trans-Out)', icon: <RxExit style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/under-lp') { PageAccess.push({ key: x, label: 'Under Lp', icon: <GiReceiveMoney  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/confirmation') { PageAccess.push({ key: x, label: 'Confirmation', icon: <MdOutlineConfirmationNumber style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/confirmed') { PageAccess.push({ key: x, label: 'Confirmed', icon: <GiConfirmed style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-docusign') { PageAccess.push({ key: x, label: 'For Docusign', icon: <MdEditDocument style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/for-disbursement') { PageAccess.push({ key: x, label: 'For Disbursement', icon: <FaRegMoneyBillAlt style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/bank-generation') { PageAccess.push({ key: x, label: 'Bank Generation', icon: <BankOutlined style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/released') { PageAccess.push({ key: x, label: 'Released', icon: <LuFileBox style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/returned/credit-officer') { PageAccess.push({ key: x, label: 'Returned From Credit Officer', icon: <MdOutlineSevereCold style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/reassessed/credit-officer') { PageAccess.push({ key: x, label: 'Reassessed To Credit Officer', icon: <LuDatabaseBackup  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/on-waiver') { PageAccess.push({ key: x, label: 'On Waiver', icon: <AiOutlineSignature  style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/undecided') { PageAccess.push({ key: x, label: 'Undecided', icon: <BsPersonFillExclamation style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/cancelled') { PageAccess.push({ key: x, label: 'Cancelled', icon: <MdCancel style={{ fontSize: '18px' }} />, }) }
        else if (x === '/ckfi/declined') { PageAccess.push({ key: x, label: 'Declined', icon: <FaThumbsDown style={{ fontSize: '18px' }} />, }) }
        else { PageAccess.push({ key: x, label: 'For Re-Application', icon: <BiRedo style={{ fontSize: '18px' }} />, }) }
    })
    return PageAccess;
}


export default SideNavRoutes