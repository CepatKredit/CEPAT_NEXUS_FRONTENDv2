import * as React from 'react'
import { Breadcrumb, Tooltip } from 'antd'
import { toDecrypt, toEncrypt, toUpperText } from '@utils/Converter';
import { useNavigate } from "react-router-dom";

import { AiOutlineDashboard } from "react-icons/ai";
import { TbUserScreen } from "react-icons/tb";

function PathLocation() {

    const navigate = useNavigate()
    const container = toDecrypt(localStorage.getItem('PTH')).split('/')
    let pathControl = []
    let pathHolder = '/cepat'

    function pathList() {
        container.map((x, i) => {
            if (container.length - 1 === i) {
                pathControl.push({
                    title: toUpperText(x.split('-').join(' ')),
                })
            }
            else {
                pathHolder += `${x}/`
                pathControl.push({
                    title: <Tooltip placement='top' title={toUpperText(x.split('-').join(' '))}>
                        <div key={i} onClick={() => {
                            navigate(pathReturn(x))
                            removePathFromIndex(i + 1)
                        }}><a>{iconHolder(x)}</a></div>
                    </Tooltip>,
                })
            }
        })
        return pathControl.slice(1)
    }

    function removePathFromIndex(index) {
        if (index < pathControl.length) {
            pathControl.splice(index, pathControl.length - index)
        }
    }

    function iconHolder(title) {
        if (title === 'dashboard') {
            return <AiOutlineDashboard style={{ fontSize: '20px' }} />
        }
        else if (title === 'for-screening-list') {
            return <TbUserScreen style={{ fontSize: '20px' }} />
        }
    }

    function pathReturn(path) {
        if (path === 'dashboard') {
            return '/cepat/dashboard'
        }
        else if (path === 'for-screening-list') {
            return '/cepat/dashboard/for-screening-list'
        }
    }

    return (
        <>
            <Breadcrumb className='font-bold' items={pathList()} />
        </>
    )
}

export default PathLocation