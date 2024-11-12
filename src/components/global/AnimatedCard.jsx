import * as React from 'react'
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd'
import { motion } from 'framer-motion'
import { useDataContainer } from '@context/PreLoad';
import { CHECK_TILE_NAME } from '@utils/Conditions';
import { TbUserScreen } from 'react-icons/tb';
import { FaFileCircleExclamation } from 'react-icons/fa6';
import { FaFileCircleQuestion } from 'react-icons/fa6';
import { LuClipboardCheck } from 'react-icons/lu';
import { FaFileShield } from 'react-icons/fa6';
import { FaPersonWalkingDashedLineArrowRight } from 'react-icons/fa6';
import { FaPersonWalking } from 'react-icons/fa6';
import { RxEnter } from 'react-icons/rx';
import { MdLabelImportant } from 'react-icons/md';
import { HiMiniQueueList } from 'react-icons/hi2';
import { FaRegCreditCard } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RxExit } from 'react-icons/rx';
import { LuFileBox } from 'react-icons/lu';
import { TbFileIsr } from 'react-icons/tb';
import { PiKeyReturnBold } from 'react-icons/pi';
import { MdOutlineSevereCold } from 'react-icons/md';
import { MdPhoneCallback } from 'react-icons/md';
import { BsPersonFillExclamation } from 'react-icons/bs';
import { GiConfirmed } from 'react-icons/gi';
import { FaFileSignature } from 'react-icons/fa';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa';
import { MdEditDocument } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';
import { FaThumbsDown } from 'react-icons/fa';
import { BiRedo } from 'react-icons/bi';
import { BiSolidCreditCardAlt } from "react-icons/bi";
import { AiOutlineRollback } from "react-icons/ai";
import { MdOutlineAssessment } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { AiOutlineSignature } from "react-icons/ai";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { FcDataBackup } from "react-icons/fc";
import { MdOutlineAssignmentReturn } from "react-icons/md";


function AnimatedCard({ path }) {

    const { GET_DATA_COUNTER } = useDataContainer()
    const colorList = ['#283618', 
        '#29274c', '#FF8C00', '#3bceac', '#532b88','#DB7093',
        '#8B4513', '#006d77', '#B8860B', '#b5179e',
        '#ff5400', '#003566', '#4a4e69', '#80b918','#3d5a80',
        '#7B68EE', '#2d6a4f', '#6d597a', '#720026','#ff0054',
        '#20B2AA', '#2196f3', '#FFD700', '#E3B6B1','#32CD32',
        '#c77dff', '#cd5c5c', '#006400', '#FF7F50','#1c1c1c',
        '#FF0000', '#708090']
    let name = ''
    const navigate = useNavigate()

    function Data() {
        if (path === '/ckfi/under-marketing') {
            name = 'UNDER MARKETING'
            let value = {
                icon: <LuClipboardCheck style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[0]
            }
            return value
        }

        else if (path === '/ckfi/received') {
            name = 'RECEIVED'
            let value = {
                icon: <IoMdCheckmarkCircleOutline style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[1]
            }
            return value
        }
        else if (path === '/ckfi/lack-of-documents/complied') {
            name = 'COMPLIED - LACK OF DOCUMENTS'
            let value = {
                icon: <FaFileCircleQuestion style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[2]
            }
            return value
        }
        else if (path === '/ckfi/walk-in') {
            name = 'FOR WALK-IN'
            let value = {
                icon: <FaPersonWalking style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[3]
            }
            return value
        }
        else if (path === '/ckfi/initial-interview') {
            name = 'FOR INITIAL INTERVIEW'
            let value = {
                icon: <FaPersonWalkingDashedLineArrowRight style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[4]
            }
            return value
        }
        else if (path === '/ckfi/reassessed/marketing') {
            name = 'REASSESSED TO MARKETING'
            let value = {
                icon: <TbArrowBackUpDouble  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[5]
            }
            return value
        }
        else if (path === '/ckfi/lack-of-documents') {
            name = 'LACK OF DOCUMENTS'
            let value = {
                icon: <FaFileCircleExclamation style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[6]
            }
            return value
        }
        else if (path === '/ckfi/credit-list') {
            name = 'CREDIT ASSESSMENT LIST'
            let value = {
                icon: <FaRegCreditCard style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[7]
            }
            return value
        }
        else if (path === '/ckfi/under-credit') {
            name = 'UNDER CREDIT'
            let value = {
                icon: <BiSolidCreditCardAlt style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[8]
            }
            return value
        }
        else if (path === '/ckfi/approved') {
            name = 'APPROVED (TRANS-OUT)'
            let value = {
                icon: <RxExit style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[9]
            }
            return value
        }
        else if (path === '/ckfi/special-lane') {
            name = 'SPECIAL LANE'
            let value = {
                icon: <MdLabelImportant style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[10]
            }
            return value
        }
        else if (path === '/ckfi/assessement/credit') {
            name = 'FOR CREDIT ASSESSEMENT'
            let value = {
                icon: <MdOutlineAssessment style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[11]
            }
            return value
        }
        else if (path === '/ckfi/queue-bucket') {
            name = 'QUEUE BUCKET'
            let value = {
                icon: <HiMiniQueueList style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[12]
            }
            return value
        }
        else if (path === '/ckfi/for-verification') {
            name = 'FOR VERIFICATION'
            let value = {
                icon: <FaFileShield style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[13]
            }
            return value
        }
        else if (path === '/ckfi/pre-check') {
            name = 'PRE-CHECK'
            let value = {
                icon: <FaFileSignature style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[14]
            }
            return value
        }

        //CHANGE ICON
        else if (path === '/ckfi/returned/marketing') {
            name = 'RETURNED FROM MARKETING'
            let value = {
                icon: <MdOutlineAssignmentReturn  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[15]
            }
            return value
        }

        else if (path === '/ckfi/returned/credit-associate') {
            name = 'RETURNED FROM CREDIT ASSOCIATE'
            let value = {
                icon: <AiOutlineRollback  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[16]
            }
            return value
        }

        //CHANGE ICON
        else if (path === '/ckfi/reassessed/credit-associate') {
            name = 'REASSESSED TO CREDIT ASSOCIATE'
            let value = {
                icon: <TbFileIsr style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[17]
            }
            return value
        }

        else if (path === '/ckfi/returned/credit-officer') {
            name = 'RETURNED FROM CREDIT OFFICER'
            let value = {
                icon: <MdOutlineSevereCold style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[18]
            }
            return value
        }
        else if (path === '/ckfi/reassessed/credit-officer') {
            name = 'REASSESSED TO CREDIT OFFICER'
            let value = {
                icon: <FcDataBackup  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[19]
            }
            return value
        }
        else if (path === '/ckfi/for-approval') {
            name = 'FOR APPROVAL'
            let value = {
                icon: <MdApproval style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[20]
            }
            return value
        }
        else if (path === '/ckfi/on-waiver') {
            name = 'ON WAIVER'
            let value = {
                icon: <AiOutlineSignature  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[21]
            }
            return value
        }
        else if (path === '/ckfi/under-lp') {
            name = 'UNDER LP'
            let value = {
                icon: <GiReceiveMoney  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[22]
            }
            return value
        }
        else if (path === '/ckfi/confirmation') {
            name = 'CONFIRMATION'
            let value = {
                icon: <MdOutlineConfirmationNumber  style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[23]
            }
            return value
        }
        else if (path === '/ckfi/confirmed') {
            name = 'CONFIRMED'
            let value = {
                icon: <GiConfirmed style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[24]
            }
            return value
        }
        else if (path === '/ckfi/for-docusign') {
            name = 'FOR DOCUSIGN'
            let value = {
                icon: <MdEditDocument style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[25]
            }
            return value
        }
        else if (path === '/ckfi/for-disbursement') {
            name = 'FOR DISBURSEMENT'
            let value = {
                icon: <FaRegMoneyBillAlt style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[26]
            }
            return value
        }
        else if (path === '/ckfi/released') {
            name = 'RELEASED'
            let value = {
                icon: <LuFileBox style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[27]
            }
            return value
        }
        else if (path === '/ckfi/undecided') {
            name = 'UNDECIDED'
            let value = {
                icon: <BsPersonFillExclamation style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[28]
            }
            return value
        }
        else if (path === '/ckfi/cancelled') {
            name = 'CANCELLED'
            let value = {
                icon: <MdCancel style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[29]
            }
            return value
        }
        else if (path === '/ckfi/declined') {
            name = 'DECLINED'
            let value = {
                icon: <FaThumbsDown style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[30]
            }
            return value
        }
        else {
            name = 'FOR RE-APPLICATION'
            let value = {
                icon: <BiRedo style={{ fontSize: '80px', color: '#ffffff' }} />,
                color: colorList[31]
            }
            return value
        }
    }

    function LOAD_COUNT() {
        let count = '0'
        GET_DATA_COUNTER?.filter((x) => x.status.includes(CHECK_TILE_NAME(path))).map((x) => { count = x.statusCount.toString(); })
        return count
    }

    return (
        <motion.div
            whileHover={{ scale: [null, 1, .9] }}
            transition={{ duration: 0.3 }}>
            <Card className='w-[350px] h-[160px] cursor-pointer shadow-xl'
                style={{ backgroundColor: Data().color }} onClick={() => {
                    navigate(path)
                    localStorage.setItem('SP', path)
                }}>
                <div className='float-left h-[100px] w-[100px]'>
                    <div className='flex flex-col justify-center items-center mt-[15px]'>
                        {Data().icon}
                    </div>
                </div>
                <div className='flex flex-col absolute right-5 text-right bottom-5 right-5'>
                    <p className='text-4xl text-white font-bold'>{LOAD_COUNT()}</p>
                    <p className='mt-[5px] text-md text-white font-bold'>{name}</p>
                </div>
            </Card>
        </motion.div>
    )
}

export default AnimatedCard