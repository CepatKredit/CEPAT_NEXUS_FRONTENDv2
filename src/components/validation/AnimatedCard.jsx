import * as React from 'react'
import { useNavigate } from "react-router-dom";
import { Card } from 'antd'
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

function AnimatedCard({ value, path }) {


    let name = ''
    const colorList = ['#04a94d', '#29abe0', '#d9534f']
    const navigate = useNavigate()

    function Icon() {
        if (path === '/cepat/declined') {
            name = 'DECLINED'
            return <FaThumbsDown style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/cancelled') {
            name = 'CANCELLED'
            return <MdCancel style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/under-credit') {
            name = 'UNDER CRD'
            return <FaRegCreditCard style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/approved/trans-out') {
            name = 'APPROVED (TRANS-OUT)'
            return <RxExit style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/under-loan-processor') {
            name = 'UNDER LP'
            return <LuClipboardCheck style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/lack-of-documents') {
            name = 'LACK OF DOCUMENTS'
            return <FaFileCircleExclamation style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/trans-in') {
            name = 'OK TO PROCESS (TRANS-IN)'
            return <RxEnter style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/under-marketing') {
            name = 'UNDER MKTG'
            return <LuClipboardCheck style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/initial-interview') {
            name = 'FOR INITIAL INTERVIEW'
            return <FaPersonWalkingDashedLineArrowRight style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/walk-in') {
            name = 'FOR WALK-IN'
            return <FaPersonWalking style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/complied/lack-of-documents') {
            name = 'COMPLIED - LACK OF DOCUMENTS'
            return <FaFileCircleQuestion style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/screening') {
            name = 'FOR SCREENING'
            return <TbUserScreen style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/reassessed/marketing') {
            name = 'REASSESSED TO MARKETING'
            return <TbFileIsr style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/return/loan-processor') {
            name = 'RETURN TO LOAN PROCESSOR'
            return <PiKeyReturnBold style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/for-docusign') {
            name = 'FOR DOCUSIGN'
            return <MdEditDocument style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/docusign') {
            name = 'OK FOR DOCUSIGN'
            return <MdEditDocument style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/tagged-for-release') {
            name = 'TAGGED FOR RELEASE'
            return <FaBoxOpen style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/for-disbursment') {
            name = 'FOR DISBURSEMENT'
            return <FaRegMoneyBillAlt style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/on-waiver') {
            name = 'ON WAIVER'
            return <FaFileSignature style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/confirmation') {
            name = 'CONFIRMATION'
            return <GiConfirmed style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/confirmed') {
            name = 'CONFIRMED'
            return <GiConfirmed style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/undecided') {
            name = 'UNDECIDED'
            return <BsPersonFillExclamation style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/released') {
            name = 'RELEASED'
            return <LuFileBox style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/screening-and-interview') {
            name = 'SCREENING AND INTERVIEW'
            return <FaFileCircleQuestion style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/reassessed/credit-associate') {
            name = 'REASSESSED TO CREDIT ASSOCIATE'
            return <TbFileIsr style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/callback') {
            name = 'FOR CALLBACK'
            return <MdPhoneCallback style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/verification') {
            name = 'FOR VERIFICATION'
            return <FaFileShield style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/pre-check') {
            name = 'PRE-CHECK'
            return <FaFileSignature style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/for-approval') {
            name = 'FOR APPROVAL'
            return <IoMdCheckmarkCircleOutline style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/return/credit-associate') {
            name = 'RETURN TO CREDIT ASSOCIATE'
            return <LuClipboardCheck style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/queue-bucket') {
            name = 'QUEUE BUCKET'
            return <HiMiniQueueList style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/return/credit-officer') {
            name = 'RETURN TO CREDIT OFFICER'
            return <MdOutlineSevereCold style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/reassessed/credit-officer') {
            name = 'REASSESSED TO CREDIT OFFICER'
            return <TbFileIsr style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else if (path === '/cepat/trans-in/special-lane') {
            name = 'OK TO PROCESS - SPECIAL LANE (TRANS-IN)'
            return <MdLabelImportant style={{ fontSize: '80px', color: '#ffffff' }} />
        }
        else {

        }
    }

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random()
            * (max - min + 1)) + min;
    };

    return (
        <motion.div
            whileHover={{ scale: [null, 1, .9] }}
            transition={{ duration: 0.3 }}>
            <Card className='w-[350px] h-[160px] cursor-pointer shadow-xl'
                style={{ backgroundColor: colorList[0] }} onClick={() => {
                    navigate(path)
                    localStorage.setItem('SP', path)
                }}>
                <div className='float-left h-[100px] w-[100px]'>
                    <div className='flex flex-col justify-center items-center mt-[15px]'>
                        {Icon()}
                    </div>
                </div>
                <div className='flex flex-col absolute right-5 text-right bottom-5 right-5'>
                    <p className='text-4xl text-white font-bold'>{value}</p>
                    <p className='mt-[5px] text-md text-white font-bold'>{name}</p>
                </div>
            </Card>
        </motion.div>
    )
}

export default AnimatedCard