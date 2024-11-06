import * as React from 'react'
import { Button } from 'antd'
function ReadMore({ updateRead }) {

    function OnClick() {
        updateRead(true)
    }

    return (
        <div>
            By checking this, I have read, understood, and agreed to the
            <span className='text-lime-700 hover:text-lime-500'>
            <a href="https://www.cepatkredit.com/privacy-policy" target="_blank"> Data Privacy Policy of Cepat Kredit</a>
            </span> ...
            <span className='px-2'>
                <Button size='small' onClick={OnClick}>Read More</Button>
            </span>
        </div>
    )
}

export default ReadMore