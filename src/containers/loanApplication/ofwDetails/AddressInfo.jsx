import React, { useState, useEffect } from 'react';
import { Checkbox, Divider } from 'antd';
import AddressGroup_Component from '@components/loanApplication/AddressGroup_Component'
import LabeledNumericInput from '@components/loanApplication/LabeledNumericInput';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
function AddressInfo({ ofwrendered, api, data, receive, presaddress, direct }) {
    const classname_main =
        "flex flex-col xs1:flex-col 2xl:flex-row mt-2 xs1:mt-3 2xl:mt-2 w-full xs1:w-[200px] xs2:w-[250px] xs:w-[280px] sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] 3xl:w-[500px] h-auto  xs1:h-auto 2xl:h-[60px]";
    const className_label = "mb-2 xs1:mb-0 xs:mr-4 w-full xs1:w-[200px]  xs2:w-[300px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[300px] 3xl:w-[500px]";
    const className_dsub = "w-full xs1:w-[200px] xs2:w-[250px] xs:w-[280px] sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] 3xl:w-[500px]";
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
                disabled={!direct && !getAppDetails.dataPrivacy}
            />
            {!direct ? null : (
                <h2 className='mb-[2%] mt-[13%]'><b>PERMANENT ADDRESS</b></h2>
            )}
            {!direct ? null : (

                <AddressGroup_Component
                    data={data}
                    rendered={ofwrendered}
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

                />)}


        </>
    );
}

export default AddressInfo;