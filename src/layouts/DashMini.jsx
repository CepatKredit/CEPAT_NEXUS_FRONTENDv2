import MiniAnimatedCard from '@components/global/MiniAnimatedCard';
import { toDecrypt } from '@utils/Converter';
import { PathName } from '@utils/Conditions';
import * as React from 'react'

function DashMini() {

    function pathList() {
        let path = []

        toDecrypt(localStorage.getItem('UPTH')).split(',').map((x) => {
            if (x === '/ckfi/manage-users' || x === '/ckfi/manage-branch' || x === '/ckfi/manage-country' ||
                x === '/ckfi/manage-city-municipality' || x === '/ckfi/manage-agency' || x === '/ckfi/manage-barangay' ||
                x === '/ckfi/dashboard' || x === '/ckfi/endorsement'
            ) { }
            else {
                path.push({
                    loc: x,
                    label: PathName(x).toUpperCase()
                })
            }
        })
        return path
    }

    return (
        <div className='flex flex-row hidden md:flex'>
            {pathList()?.map((x, i) => (<MiniAnimatedCard key={i} path={x} />))}
        </div>
    )
}

export default DashMini