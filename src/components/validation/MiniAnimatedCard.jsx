import * as React from 'react'
import { Card, Tooltip } from 'antd'
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

import { TbUserScreen } from "react-icons/tb";
import { FaFileCircleExclamation } from "react-icons/fa6";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { FaFileShield } from "react-icons/fa6";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { FaPersonWalking } from "react-icons/fa6";
import { RxEnter } from "react-icons/rx";
import { MdLabelImportant } from "react-icons/md";
import { HiMiniQueueList } from "react-icons/hi2";
import { FaRegCreditCard } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { LuFileBox } from "react-icons/lu";
import { TbFileIsr } from "react-icons/tb";
import { PiKeyReturnBold } from "react-icons/pi";
import { MdOutlineSevereCold } from "react-icons/md";
import { MdPhoneCallback } from "react-icons/md";
import { BsPersonFillExclamation } from "react-icons/bs";
import { GiConfirmed } from "react-icons/gi";
import { FaFileSignature } from "react-icons/fa";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { FaThumbsDown } from "react-icons/fa";

function MiniAnimatedCard({ value, path }) {

    const colorList = ['#04a94d', '#29abe0', '#d9534f']
    const navigate = useNavigate()

    function Icon() {
        if (path.loc === '/cepat/declined') { return <FaThumbsDown style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/cancelled') { return <MdCancel style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/under-credit') { return <FaRegCreditCard style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/approved/trans-out') { return <RxExit style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/under-loan-processor') { return <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/lack-of-documents') { return <FaFileCircleExclamation style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/trans-in') { return <RxEnter style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/under-marketing') { return <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/initial-interview') { return <FaPersonWalkingDashedLineArrowRight style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/walk-in') { return <FaPersonWalking style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/complied/lack-of-documents') { return <FaFileCircleQuestion style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/screening') { return <TbUserScreen style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/reassessed/marketing') { return <TbFileIsr style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/return/loan-processor') { return <PiKeyReturnBold style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/for-docusign') { return <MdEditDocument style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/docusign') { return <MdEditDocument style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/tagged-for-release') { return <FaBoxOpen style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/for-disbursment') { return <FaRegMoneyBillAlt style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/on-waiver') { return <FaFileSignature style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/confirmation') { return <GiConfirmed style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/confirmed') { return <GiConfirmed style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/undecided') { return <BsPersonFillExclamation style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/released') { return <LuFileBox style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/screening-and-interview') { return <FaFileCircleQuestion style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/reassessed/credit-associate') { return <TbFileIsr style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/callback') { return <MdPhoneCallback style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/verification') { return <FaFileShield style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/pre-check') { return <FaFileSignature style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/for-approval') { return <IoMdCheckmarkCircleOutline style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/return/credit-associate') { return <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/queue-bucket') { return <HiMiniQueueList style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/return/credit-officer') { return <MdOutlineSevereCold style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/reassessed/credit-officer') { return <TbFileIsr style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else if (path.loc === '/cepat/trans-in/special-lane') { return <MdLabelImportant style={{ fontSize: '40px', color: '#ffffff' }} /> }
        else { }
    }

    return (
        <motion.div className='mx-1'
            whileHover={{ scale: [null, 1, .9] }}
            transition={{ duration: 0.3 }}>
            <Tooltip title={path.label} placement='bottom'>
                <Card className='w-[210px] h-[90px] cursor-pointer shadow-xl'
                    style={{ backgroundColor: colorList[1] }} onClick={() => {
                        navigate(path.loc)
                        localStorage.setItem('SP', path.loc)
                    }}>
                    <div className='float-left h-[20px] w-[50px]'>
                        <div className='flex flex-col justify-center items-center '>
                            {Icon()}
                        </div>
                    </div>
                    <div className='flex flex-col absolute text-right bottom-2 right-5'>
                        <p className='text-lg text-white font-bold'>{value}</p>
                        <p className='pt-[5px] text-[8px] text-white font-bold'>{path.label}</p>
                    </div>
                </Card>
            </Tooltip>
        </motion.div>
    )
}

export default MiniAnimatedCard