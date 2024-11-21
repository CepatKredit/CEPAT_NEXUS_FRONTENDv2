import React from "react";
import { GetData } from "./UserData";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function TriggerFields() {
    const [getRendered, setRendered] = React.useState(false)
    const skipRender = React.useRef(1); //use this
    const { getAppDetails, setAppDetails, populateClientDetails } = React.useContext(LoanApplicationContext)


    function ClearFields(fields) {
        const updatedDetails = fields.reduce((acc, key) => {
            if (getAppDetails.hasOwnProperty(key)) {
                acc[key] = '';
            }
            return acc;
        }, {});
        setAppDetails((prevDetails) => ({
            ...prevDetails,
            ...updatedDetails
        }));
    }
    /*
    React.useEffect(() => {
        if (getRendered) {
            if(getAppDetails.JobCategory){
                receive({
                    name: 'ofwjobtitle',
                    getAppDetails: '',
                })
            }
        } else {
            getRendered = true;
        }
    }, [getAppDetails.JobCategory])*/

    React.useEffect(() => {
        if (!getRendered) return;
        if (getAppDetails.loanProd === '0303-WA' || getAppDetails.loanProd === '0303-WL') {
            const ofwEducAtt = ['ofwHighestEdu', 'ofwcourse', 'PEmployer', 'ofwcompany']
            ClearFields(ofwEducAtt)
        } else if (getAppDetails.loanProd === '0303-VA' || getAppDetails.loanProd === '0303-VL') {
            const ofwReqVessel = ['VesselName', 'VesselType', 'VesselIMO', ...(getAppDetails.loanProd === '0303-VA' ? ['ExactLocation'] : [])];
            ClearFields(ofwReqVessel)
        } else if (getAppDetails.loanProd === '0303-WA') {
            const ofwPossVac = ['PossVacation']
            ClearFields(ofwPossVac)
        }

    }, [getAppDetails.loanProd])

    React.useEffect(() => {
        if (!getRendered) return;
        setAppDetails(prevDetails => ({
            ...prevDetails,
            ofwSameAdd: false,
            ofwPermProv: '',
            ofwPermMunicipality: '',
            ofwPermBarangay: '',
            ofwPermStreet: '',

            ofwProvSameAdd: false,
            ofwprovProv: '',
            ofwprovMunicipality: '',
            ofwprovBarangay: '',
            ofwprovStreet: '',
        }));

    }, [getAppDetails.ofwPresStreet]);

    React.useEffect(() => {
        if (!getRendered) return;
        if ((GetData('ROLE').toString() !== '50' && GetData('ROLE').toString() !== '60') && (getAppDetails.ofwmstatus != 2 || getAppDetails.ofwmstatus != 5 || getAppDetails.ofwmstatus != 6)) {
            setAppDetails(prev => ({
                ...prev,
                ofwspouse: '',
                ofwspousebdate: '',
                SpSrcIncome: '',
                SpIncome: '',
            }))
        }else{
            setAppDetails(prev => ({
                ...prev,
                MarriedPBCB: false,
            }))
        }

    }, [getAppDetails.ofwmstatus]);

    React.useEffect(() => {
        if (!getRendered) return;
        
        if ((GetData('ROLE').toString() !== '50' && GetData('ROLE').toString() !== '60') && (getAppDetails.benmstatus != 2 || getAppDetails.benmstatus != 5 || getAppDetails.benmstatus != 6)) {
            setAppDetails(prev => ({
                ...prev,
                benspouse: '',
                benspousebdate: '',
                BenSpSrcIncome: '',
                BenSpIncome: '',
            }))
        }else{ //additional logic if status is married,live in, 
            if(![2,5,6].includes(getAppDetails.ofwmstatus) &&  getAppDetails.MarriedPBCB){
                setAppDetails(prev => ({
                    ...prev,
                    MarriedPBCB: false,
                }))
            }
        }

    }, [getAppDetails.benmstatus]);

    React.useEffect(() => {
        if (!getRendered) return;
        if ((getAppDetails.coborrowmstatus != 2 || getAppDetails.coborrowmstatus != 5 || getAppDetails.coborrowmstatus != 6)) {
            setAppDetails(prev => ({
                ...prev,
                coborrowerspousebdate: '',
                coborrowspousename: '',
                AcbSpSrcIncome: '',
                AcbSpIncome: '',
     
            }))
        }

    }, [getAppDetails.coborrowmstatus]);



    React.useEffect(() => {
        if (!getRendered) return;
        if (getAppDetails.MarriedPBCB) {
            const spouseBenName = `${getAppDetails.benfname || ''} ${getAppDetails.benlname || ''}`.trim();
            const spouseOfwName = `${getAppDetails.ofwfname || ''} ${getAppDetails.ofwlname || ''}`.trim();
            setAppDetails(prevs => ({
                ...prevs,
                ofwspouse: spouseBenName,
                ofwspousebdate: getAppDetails.benbdate,
                SpSrcIncome: '',
                SpIncome: '',
                benspouse: spouseOfwName,
                benspousebdate: getAppDetails.ofwbdate,
                BenSpSrcIncome: 1,
                BenSpIncome: '',
                benmstatus: getAppDetails.ofwmstatus, 
            }))
        } else {
            setAppDetails(prev => ({
                ...prev,
                ofwspouse: '',
                ofwspousebdate: '',
                SpSrcIncome: '',
                SpIncome: '',

                benmstatus: '',
                benspouse: '',
                benspousebdate: '',
                BenSpSrcIncome: '',
                BenSpIncome: '',
                BenSrcIncome: '',
                BenIncome: '',
            }))
        }

    }, [getAppDetails.MarriedPBCB]);
    //Source of Income
    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;
        setAppDetails(prevDetails => ({
            ...prevDetails,
            BenSrcIncome: getAppDetails.SpSrcIncome
        }))
    }, [getAppDetails.SpSrcIncome])
    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;
        setAppDetails(prevDetails => ({
            ...prevDetails,
            SpSrcIncome: getAppDetails.BenSrcIncome
        }))
    }, [getAppDetails.BenSrcIncome])
    //Spouse Income
    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;
        setAppDetails(prevDetails => ({
            ...prevDetails,
            BenIncome: getAppDetails.SpIncome
        }))
    }, [getAppDetails.SpIncome])
    /*
    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;
        setAppDetails(prevDetails => ({
            ...prevDetails,
            SpIncome: getAppDetails.BenIncome
        }))
    }, [getAppDetails.BenIncome])*/

    React.useEffect(() => {
        if (getAppDetails.loanIdCode !== '') {
            if (skipRender.current != 1) {
                skipRender.current++;
            } else {
                setRendered(true);
            }
        }
    }, [getAppDetails.loanIdCode])
}
export default TriggerFields;