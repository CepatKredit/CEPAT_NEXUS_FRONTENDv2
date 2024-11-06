    import React, { useState, useEffect } from 'react';
    import { Checkbox, Divider } from 'antd';
    import AddressGroup_Component from '@components/loanApplication/AddressGroup_Component'
    import LabeledNumericInput from '@components/loanApplication/LabeledNumericInput';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
    function AddressInfo({ofwrendered, api, data, receive, presaddress, direct }) {
        const classname_main = 'flex flex-col sm:flex-row mt-2 w-full sm:w-[500px] h-auto sm:h-[60px]';
        const className_label = 'mb-2 sm:mb-0 sm:mr-4 w-full sm:w-[200px]';
        const className_dsub = 'w-full sm:w-[400px]';
        const { getAppDetails } = React.useContext(LoanApplicationContext)

        return (
            <>
        
                <h2 className='mb-[2%] mt-[5%]' ><b>PRESENT ADDRESS</b></h2>
                <AddressGroup_Component
                    rendered={ofwrendered}

                    data={data}
                    // receive={(e) => { receive(e) }}
                    // presaddress={(e) => { presaddress(e) }}
                    type={"present"}
                    category={"direct"}
                    className_dmain={classname_main}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    vertical_align={false}
                    disabled={!direct&&!getAppDetails.dataPrivacy}
                />
                {!direct? null : (
                <h2 className='mb-[2%] mt-[13%]'><b>PERMANENT ADDRESS</b></h2>
                )}
                {!direct? null : (
    
                <AddressGroup_Component
                    data={data}
                    rendered = {ofwrendered}
                    // api={api}
                    // receive={(e) => { receive(e) }}
                    type="permanent"
                    category={"direct"}
                    // presaddress={(e) => { presaddress(e) }}
                    className_dmain={classname_main}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    vertical_align={false}
                    disabled={false}
    
                />) }
            
            
            </>
        );
    }
    
    export default AddressInfo;