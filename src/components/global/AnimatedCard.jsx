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
import { LuDatabaseBackup } from "react-icons/lu";
import { MdOutlineAssignmentReturn } from "react-icons/md";


function AnimatedCard({ path }) {

    const { GET_DATA_COUNTER } = useDataContainer()
    const colorList = ['#283618', 
        '#29274c', '#FF8C00', '#3bceac', '#532b88','#DB7093',
        '#8B4513', '#006d77', '#B8860B', '#b5179e',
        '#ff5400', '#003566', '#4a4e69', '#80b918','#3d5a80',
        '#7B68EE', '#2d6a4f', '#6d597a', '#720026','#ff0054',
        '#20B2AA', '#2196f3', '#FFD700', '#d4af37','#32CD32',
        '#c77dff', '#cd5c5c', '#006400', '#FF7F50','#1c1c1c',
        '#FF0000', '#708090']
    let name = ''
    const navigate = useNavigate()

    function Data() {
        if (path === '/ckfi/under-marketing') {
            name = 'UNDER MARKETING'
            let value = {
                icon: <LuClipboardCheck className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[0]
            }
            return value
        }

        else if (path === '/ckfi/received') {
            name = 'RECEIVED'
            let value = {
                icon: <IoMdCheckmarkCircleOutline className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[1]
            }
            return value
        }
        else if (path === '/ckfi/lack-of-documents/complied') {
            name = 'COMPLIED - LACK OF DOCUMENTS'
            let value = {
                icon: <FaFileCircleQuestion className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[2]
            }
            return value
        }
        else if (path === '/ckfi/walk-in') {
            name = 'FOR WALK-IN'
            let value = {
                icon: <FaPersonWalking className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[3]
            }
            return value
        }
        else if (path === '/ckfi/initial-interview') {
            name = 'FOR INITIAL INTERVIEW'
            let value = {
                icon: <FaPersonWalkingDashedLineArrowRight className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[4]
            }
            return value
        }
        else if (path === '/ckfi/reassessed/marketing') {
            name = 'REASSESSED TO MARKETING'
            let value = {
                icon: <TbArrowBackUpDouble  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[5]
            }
            return value
        }
        else if (path === '/ckfi/lack-of-documents') {
            name = 'LACK OF DOCUMENTS'
            let value = {
                icon: <FaFileCircleExclamation className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[6]
            }
            return value
        }
        else if (path === '/ckfi/credit-list') {
            name = 'CREDIT ASSESSMENT LIST'
            let value = {
                icon: <FaRegCreditCard className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[7]
            }
            return value
        }
        else if (path === '/ckfi/under-credit') {
            name = 'UNDER CREDIT'
            let value = {
                icon: <BiSolidCreditCardAlt className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[8]
            }
            return value
        }
        else if (path === '/ckfi/approved') {
            name = 'APPROVED (TRANS-OUT)'
            let value = {
                icon: <RxExit className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[9]
            }
            return value
        }
        else if (path === '/ckfi/special-lane') {
            name = 'SPECIAL LANE'
            let value = {
                icon: <MdLabelImportant className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white" />,
                color: colorList[10]
            }
            return value
        }
        else if (path === '/ckfi/assessement/credit') {
            name = 'FOR CREDIT ASSESSEMENT'
            let value = {
                icon: <MdOutlineAssessment className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[11]
            }
            return value
        }
        else if (path === '/ckfi/queue-bucket') {
            name = 'QUEUE BUCKET'
            let value = {
                icon: <HiMiniQueueList className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[12]
            }
            return value
        }
        else if (path === '/ckfi/for-verification') {
            name = 'FOR VERIFICATION'
            let value = {
                icon: <FaFileShield className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[13]
            }
            return value
        }
        else if (path === '/ckfi/pre-check') {
            name = 'PRE-CHECK'
            let value = {
                icon: <FaFileSignature className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[14]
            }
            return value
        }

        //CHANGE ICON
        else if (path === '/ckfi/returned/marketing') {
            name = 'RETURNED FROM MARKETING'
            let value = {
                icon: <MdOutlineAssignmentReturn  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[15]
            }
            return value
        }

        else if (path === '/ckfi/returned/credit-associate') {
            name = 'RETURNED FROM CREDIT ASSOCIATE'
            let value = {
                icon: <AiOutlineRollback  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[16]
            }
            return value
        }

        //CHANGE ICON
        else if (path === '/ckfi/reassessed/credit-associate') {
            name = 'REASSESSED TO CREDIT ASSOCIATE'
            let value = {
                icon: <TbFileIsr className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[17]
            }
            return value
        }

        else if (path === '/ckfi/returned/credit-officer') {
            name = 'RETURNED FROM CREDIT OFFICER'
            let value = {
                icon: <MdOutlineSevereCold className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[18]
            }
            return value
        }
        else if (path === '/ckfi/reassessed/credit-officer') {
            name = 'REASSESSED TO CREDIT OFFICER'
            let value = {
                icon: <LuDatabaseBackup  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[19]
            }
            return value
        }
        else if (path === '/ckfi/for-approval') {
            name = 'FOR APPROVAL'
            let value = {
                icon: <MdApproval className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[20]
            }
            return value
        }
        else if (path === '/ckfi/on-waiver') {
            name = 'ON WAIVER'
            let value = {
                icon: <AiOutlineSignature  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[21]
            }
            return value
        }
        else if (path === '/ckfi/under-lp') {
            name = 'UNDER LP'
            let value = {
                icon: <GiReceiveMoney  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[22]
            }
            return value
        }
        else if (path === '/ckfi/confirmation') {
            name = 'CONFIRMATION'
            let value = {
                icon: <MdOutlineConfirmationNumber  className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[23]
            }
            return value
        }
        else if (path === '/ckfi/confirmed') {
            name = 'CONFIRMED'
            let value = {
                icon: <GiConfirmed className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[24]
            }
            return value
        }
        else if (path === '/ckfi/for-docusign') {
            name = 'FOR DOCUSIGN'
            let value = {
                icon: <MdEditDocument className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[25]
            }
            return value
        }
        else if (path === '/ckfi/for-disbursement') {
            name = 'FOR DISBURSEMENT'
            let value = {
                icon: <FaRegMoneyBillAlt className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[26]
            }
            return value
        }
        else if (path === '/ckfi/released') {
            name = 'RELEASED'
            let value = {
                icon: <LuFileBox className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[27]
            }
            return value
        }
        else if (path === '/ckfi/undecided') {
            name = 'UNDECIDED'
            let value = {
                icon: <BsPersonFillExclamation className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[28]
            }
            return value
        }
        else if (path === '/ckfi/cancelled') {
            name = 'CANCELLED'
            let value = {
                icon: <MdCancel className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[29]
            }
            return value
        }
        else if (path === '/ckfi/declined') {
            name = 'DECLINED'
            let value = {
                icon: <FaThumbsDown className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
                color: colorList[30]
            }
            return value
        }
        else {
            name = 'FOR RE-APPLICATION'
            let value = {
                icon: <BiRedo className="text-4xl xs1:text-[40px] xs:text-[40px] sm:text-[40px] md:text-5xl lg:text-6xl xl:text-[80px] text-white"  />,
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
            <Card className='w-[350px] xs1:w-[130px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] 2xl:w-[350px] 3xl:w-[400px] 
            h-[160px] xs1:h-[60px] xs2:h-[70px] xs:h-[130px] sm:h-[100px] md:h-[120px] lg:h-[130px] xl:h-[135px] 2xl:h-[160px] cursor-pointer shadow-xl'
                style={{ backgroundColor: Data().color }} onClick={() => {
                    navigate(path)
                    localStorage.setItem('SP', path)
                }}>
                <div className='float-left xs1:float-right md:float-left h-[100px] w-[100px]'>
                    <div className='flex flex-col justify-center items-center mt-[15px] xs1:mt-[-12px] md:mt-[15px]'>
                        {Data().icon}
                    </div>
                </div>
                <div className='flex flex-col absolute right-5 text-right bottom-5 right-5'>
                    <p className='text-4xl xs1:text-xs xs:text-xs sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-4xl text-white font-bold'>{LOAD_COUNT()}</p>
                    <p className='mt-[5px] text-md xs1:text-[8px] xs:text-[7px] sm:text-sm md:text-sm lg:text-md xl:text-md 2xl:text-md text-white font-bold'>{name}</p>
                </div>
            </Card>
        </motion.div>
    )
}

export default AnimatedCard