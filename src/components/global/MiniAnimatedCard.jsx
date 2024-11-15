import * as React from 'react'
import { useDataContainer } from '@context/PreLoad';
import { CHECK_TILE_NAME } from '@utils/Conditions';
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
import { BiRedo } from 'react-icons/bi';
import { BiSolidCreditCardAlt } from "react-icons/bi";
import { AiOutlineRollback } from "react-icons/ai";
import { MdOutlineAssignmentReturn } from "react-icons/md";
import { MdOutlineAssessment } from "react-icons/md";
import { GiReceiveMoney } from "react-icons/gi";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { AiOutlineSignature } from "react-icons/ai";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { LuDatabaseBackup } from "react-icons/lu";


function MiniAnimatedCard({ path }) {

    const { GET_DATA_COUNTER } = useDataContainer()
    const colorList = ['#283618', 
        '#29274c', '#FF8C00', '#3bceac', '#532b88','#DB7093',
        '#8B4513', '#006d77', '#ff5400', '#003566', 
        '#B8860B', '#b5179e', '#4a4e69', '#80b918','#3d5a80',
        '#7B68EE', '#2d6a4f', '#6d597a', '#720026','#ff0054',
        '#20B2AA', '#2196f3', '#FFD700', '#d4af37','#32CD32',
        '#c77dff', '#cd5c5c', '#006400', '#FF7F50','#1c1c1c',
        '#FF0000', '#708090']
    const navigate = useNavigate()
    function Data() {
        if (path.loc === '/ckfi/under-marketing') {
            let value = {
                icon: <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[0]
            }
            return value
        }
        else if (path.loc === '/ckfi/received') {
            let value = {
                icon: <IoMdCheckmarkCircleOutline style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[1]
            }
            return value
        }
        else if (path.loc === '/ckfi/lack-of-documents/complied') {
            let value = {
                icon: <FaFileCircleQuestion style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[2]
            }
            return value
        }
        else if (path.loc === '/ckfi/walk-in') {
            let value = {
                icon: <FaPersonWalking style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[3]
            }
            return value
        }
        else if (path.loc === '/ckfi/initial-interview') {
            let value = {
                icon: <FaPersonWalkingDashedLineArrowRight style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[4]
            }
            return value
        }
        else if (path.loc === '/ckfi/reassessed/marketing') {
            let value = {
                icon: <TbArrowBackUpDouble  style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[5]
            }
            return value
        }
        else if (path.loc === '/ckfi/lack-of-documents') {
            let value = {
                icon: <FaFileCircleExclamation style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[6]
            }
            return value
        }
        else if (path.loc === '/ckfi/credit-list') {
            let value = {
                icon: <FaRegCreditCard style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[7]
            }
            return value
        }
        else if (path.loc === '/ckfi/under-credit') {
            let value = {
                icon: <BiSolidCreditCardAlt style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[10]
            }
            return value
        }
        else if (path.loc === '/ckfi/approved') {
            let value = {
                icon: <RxExit style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[11]
            }
            return value
        }
        else if (path.loc === '/ckfi/special-lane') {
            let value = {
                icon: <MdLabelImportant style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[8]
            }
            return value
        }
        else if (path.loc === '/ckfi/assessement/credit') {
            let value = {
                icon: <MdOutlineAssessment style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[9]
            }
            return value
        }
        else if (path.loc === '/ckfi/queue-bucket') {
            let value = {
                icon: <HiMiniQueueList style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[12]
            }
            return value
        }
        else if (path.loc === '/ckfi/for-verification') {
            let value = {
                icon: <FaFileShield style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[13]
            }
            return value
        }
        else if (path.loc === '/ckfi/pre-check') {
            let value = {
                icon: <FaFileSignature style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[14]
            }
            return value
        }

        //RETURNED FROM MARKETING
        else if (path.loc === '/ckfi/returned/marketing') {
            let value = {
                icon: <MdOutlineAssignmentReturn  style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[15]
            }
            return value
        }

        else if (path.loc === '/ckfi/returned/credit-associate') {
            let value = {
                icon: <AiOutlineRollback style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[16]
            }
            return value
        }

        //REASSESSED TO CREDIT ASSOCIATE
        else if (path.loc === '/ckfi/reassessed/credit-associate') {
            let value = {
                icon: <TbFileIsr style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[17]
            }
            return value
        }

        else if (path.loc === '/ckfi/returned/credit-officer') {
            let value = {
                icon: <MdOutlineSevereCold style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[18]
            }
            return value
        }
        else if (path.loc === '/ckfi/reassessed/credit-officer') {
            let value = {
                icon: <LuDatabaseBackup style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[19]
            }
            return value
        }
        else if (path.loc === '/ckfi/for-approval') {
            let value = {
                icon: <MdApproval style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[20]
            }
            return value
        }
        else if (path.loc === '/ckfi/on-waiver') {
            let value = {
                icon: <AiOutlineSignature  style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[21]
            }
            return value
        }
        else if (path.loc === '/ckfi/under-lp') {
            let value = {
                icon: <GiReceiveMoney  style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[22]
            }
            return value
        }
        else if (path.loc === '/ckfi/confirmation') {
            let value = {
                icon: <MdOutlineConfirmationNumber style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[23]
            }
            return value
        }
        else if (path.loc === '/ckfi/confirmed') {
            let value = {
                icon: <GiConfirmed style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[24]
            }
            return value
        }
        else if (path.loc === '/ckfi/for-docusign') {
            let value = {
                icon: <MdEditDocument style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[25]
            }
            return value
        }
        else if (path.loc === '/ckfi/for-disbursement') {
            let value = {
                icon: <FaRegMoneyBillAlt style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[26]
            }
            return value
        }
        else if (path.loc === '/ckfi/released') {
            let value = {
                icon: <LuFileBox style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[27]
            }
            return value
        }
        else if (path.loc === '/ckfi/undecided') {
            let value = {
                icon: <BsPersonFillExclamation style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[28]
            }
            return value
        }
        else if (path.loc === '/ckfi/cancelled') {
            let value = {
                icon: <MdCancel style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[29]
            }
            return value
        }
        else if (path.loc === '/ckfi/declined') {
            let value = {
                icon: <FaThumbsDown style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[30]
            }
            return value
        }
        else {
            let value = {
                icon: <BiRedo style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[31]
            }
            return value
        }
    }

    function LOAD_COUNT() {
        let count = '0'
        GET_DATA_COUNTER?.filter((x) => x.status.includes(CHECK_TILE_NAME(path.loc))).map((x) => { count = x.statusCount.toString(); })
        return count
    }

    return (
        <motion.div className='mx-1'
            whileHover={{ scale: [null, 1, .9] }}
            transition={{ duration: 0.3 }}>
            <Tooltip title={path.label} placement='bottom'>
                <Card className='w-[210px] h-[90px] cursor-pointer shadow-xl'
                    style={{ backgroundColor: Data().color }} onClick={() => {
                        if (path.loc === '/ckfi/credit-assessment/special-lane') {
                            navigate('/ckfi/credit-assessment')
                            localStorage.setItem('SP', '/ckfi/credit-assessment')
                        }
                        else {
                            navigate(path.loc)
                            localStorage.setItem('SP', path.loc)
                        }
                    }}>
                    <div className='float-left h-[20px] w-[50px]'>
                        <div className='flex flex-col justify-center items-center '>
                            {Data().icon}
                        </div>
                    </div>
                    <div className='flex flex-col absolute text-right bottom-2 right-5'>
                        <p className='text-lg text-white font-bold'>{LOAD_COUNT()}</p>
                        <p className='pt-[5px] text-[8px] text-white font-bold'>{path.label}</p>
                    </div>
                </Card>
            </Tooltip>
        </motion.div>
    )
}

export default MiniAnimatedCard