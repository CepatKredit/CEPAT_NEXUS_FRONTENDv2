import * as React from 'react'
import { Button } from 'antd'

function ReadLess({ updateRead }) {

    function OnClick() {
        updateRead(false)
    }

    return (
        <div className='mt-1'>
            By checking this, I have read, understood, and agreed to the
            <span className='text-lime-700 hover:text-lime-500'>
            <a href="https://www.cepatkredit.com/privacy-policy" target="_blank"> Data Privacy Policy of Cepat Kredit</a>
            </span><br />
            All information and data we obtain during the loan application process will be used solely in the credit process. Information and data provided are kept secure and submitted only to the assigned departments for proper handling.
            <br /> <br />
            Distribution and provision of information and data are required in the process of the loan application for verification, validation, and confirmation of data. We apply this to our borrowers, subcontractors, service providers, loan consultants, and the authorities regulated by Philippine law.
            <br /> <br />
            In the event of a request for information, we will notify the client in advance through means including but not limited to email, phone call, and text, and the client may respond or object to the said notice. If we do not receive a response from the client within three (3) days from the date of notification, then we will assume that the client has no objection and thereby consents to the request for information.
            <br /> <br />
            Client's information and data are stored securely in the system, and we constantly perform maintenance in our systems to ensure that it exceeds the current security standard. I have read, understood, and agree with the privacy policy of Cepat Kredit Financing Inc.
            <div className='mt-2'>
                <Button size='small' onClick={OnClick}>Read Less</Button>
            </div>
        </div>
    )
}

export default ReadLess