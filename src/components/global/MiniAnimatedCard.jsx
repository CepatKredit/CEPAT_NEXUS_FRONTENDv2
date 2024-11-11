import * as React from 'react'
import { useDataContainer } from '@context/PreLoad';
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

function MiniAnimatedCard({ path }) {

    const { GET_DATA_COUNTER } = useDataContainer()
    const colorList = ['#283618', '#29274c', '#FF8C00', '#3bceac', '#532b88',
        '#DB7093', '#8B4513', '#006d77', '#B8860B', '#008B8B',
        '#293241', '#00a6fb', '#003566', '#4a4e69', '#0f4c5c',
        '#3d5a80', '#7B68EE', '#2d6a4f', '#6d597a', '#2f2f2f',
        '#008080', '#20B2AA', '#90EE90', '#FFD700', '#228B22',
        '#32CD32', '#F08080', '#2E8B57', '#006400', '#FF7F50',
        '#1c1c1c', '#FF0000', '#708090']
    const navigate = useNavigate()
    function Data() {
        if (path.loc === '/ckfi/under-marketing') {
            let value = {
                icon: <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[0],
                count: GET_DATA_COUNTER[28].statusCount.toString() //UNDER MARKETING
            }
            return value
        }
        else if (path.loc === '/ckfi/received') {
            let value = {
                icon: <IoMdCheckmarkCircleOutline style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[1],
                count: GET_DATA_COUNTER[27].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/lack-of-documents/complied') {
            let value = {
                icon: <FaFileCircleQuestion style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[2],
                count: GET_DATA_COUNTER[26].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/walk-in') {
            let value = {
                icon: <FaPersonWalking style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[3],
                count: GET_DATA_COUNTER[25].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/for-initial-interview') {
            let value = {
                icon: <FaPersonWalkingDashedLineArrowRight style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[4],
                count: GET_DATA_COUNTER[24].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/reassessed-to-marketing') {
            let value = {
                icon: <TbFileIsr style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[5],
                count: GET_DATA_COUNTER[28].statusCount.toString() //REASSESSED TO MARKETING
            }
            return value
        }
        else if (path.loc === '/ckfi/lack-of-documents') {
            let value = {
                icon: <FaFileCircleExclamation style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[6],
                count: GET_DATA_COUNTER[22].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/credit-assessment-list') {
            let value = {
                icon: <FaRegCreditCard style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[7],
                count: GET_DATA_COUNTER[23].statusCount.toString() //CREDIT ASSESSMENT MIX SPECIAL AND NORMAL
            }
            return value
        }
        else if (path.loc === '/ckfi/credit-assessment/special-lane') {
            let value = {
                icon: <MdLabelImportant style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[8],
                count: GET_DATA_COUNTER[23].statusCount.toString() //CREDIT ASSESSMENT SPECIAL
            } 
            return value
        }
        else if (path.loc === '/ckfi/credit-assessment') {
            let value = {
                icon: <RxEnter style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[9],
                count: GET_DATA_COUNTER[23].statusCount.toString() //CREDIT ASSESSMENT NORMAL
            }
            return value
        }
        else if (path.loc === '/ckfi/under-credit') {
            let value = {
                icon: <FaRegCreditCard style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[10],
                count: GET_DATA_COUNTER[23].statusCount.toString() //UNDER CREDIT
            }
            return value
        }
        else if (path.loc === '/ckfi/queue-bucket') {
            let value = {
                icon: <HiMiniQueueList style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[11],
                count: GET_DATA_COUNTER[28].statusCount.toString() // QUEUE BUCKET
            }
            return value
        }
        else if (path.loc === '/ckfi/for-verification') {
            let value = {
                icon: <FaFileShield style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[12],
                count: GET_DATA_COUNTER[5].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/pre-check') {
            let value = {
                icon: <FaFileSignature style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[13],
                count: GET_DATA_COUNTER[6].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/return/credit-associate') {
            let value = {
                icon: <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[14],
                count: GET_DATA_COUNTER[3].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/return/credit-officer') {
            let value = {
                icon: <MdOutlineSevereCold style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[15],
                count: GET_DATA_COUNTER[9].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/reassessed/credit-officer') {
            let value = {
                icon: <TbFileIsr style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[16],
                count: GET_DATA_COUNTER[10].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/for-approval') {
            let value = {
                icon: <IoMdCheckmarkCircleOutline style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[17],
                count: GET_DATA_COUNTER[7].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/approved') {
            let value = {
                icon: <RxExit style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[18],
                count: GET_DATA_COUNTER[11].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/under-loan-processor') {
            let value = {
                icon: <LuClipboardCheck style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[19],
                count: GET_DATA_COUNTER[12].statusCount.toString() // UNDER LOAN PROCESSOR
            }
            return value
        }
        else if (path.loc === '/ckfi/for-docusign') {
            let value = {
                icon: <MdEditDocument style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[20],
                count: GET_DATA_COUNTER[13].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/ok/for-docusign') {
            let value = {
                icon: <MdEditDocument style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[21],
                count: GET_DATA_COUNTER[14].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/tagged-for-release') {
            let value = {
                icon: <FaBoxOpen style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[22],
                count: GET_DATA_COUNTER[15].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/on-waiver') {
            let value = {
                icon: <FaFileSignature style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[23],
                count: GET_DATA_COUNTER[17].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/confirmation') {
            let value = {
                icon: <GiConfirmed style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[24],
                count: GET_DATA_COUNTER[18].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/confirmed') {
            let value = {
                icon: <GiConfirmed style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[25],
                count: GET_DATA_COUNTER[19].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/undecided') {
            let value = {
                icon: <BsPersonFillExclamation style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[26],
                count: GET_DATA_COUNTER[20].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/for-disbursement') {
            let value = {
                icon: <FaRegMoneyBillAlt style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[27],
                count: GET_DATA_COUNTER[16].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/released') {
            let value = {
                icon: <LuFileBox style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[28],
                count: GET_DATA_COUNTER[21].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/return/loan-processor') {
            let value = {
                icon: <PiKeyReturnBold style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[29],
                count: GET_DATA_COUNTER[12].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/cancelled') {
            let value = {
                icon: <MdCancel style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[30],
                count: GET_DATA_COUNTER[1].statusCount.toString()
            }
            return value
        }
        else if (path.loc === '/ckfi/declined') {
            let value = {
                icon: <FaThumbsDown style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[31],
                count: GET_DATA_COUNTER[0].statusCount.toString()
            }
            return value
        }
        else {
            let value = {
                icon: <BiRedo style={{ fontSize: '40px', color: '#ffffff' }} />,
                color: colorList[32],
                count: GET_DATA_COUNTER[29].statusCount.toString()
            }
            return value
        }
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
                        <p className='text-lg text-white font-bold'>{Data().count}</p>
                        <p className='pt-[5px] text-[8px] text-white font-bold'>{path.label}</p>
                    </div>
                </Card>
            </Tooltip>
        </motion.div>
    )
}

export default MiniAnimatedCard