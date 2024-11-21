import React from "react";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

function TriggerFields(ROLE) {
    const [getRendered, setRendered] = React.useState(false)
    const skipRender = React.useRef(1); //use this
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext)


    function ClearFields(fields) {
        fields.forEach((key) => {
            if (getAppDetails.hasOwnProperty(key)) {
                updateAppDetails({ name: key, value: '' });
            }
        });
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

        const updates = {
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
        };

        Object.entries(updates).forEach(([name, value]) => {
            updateAppDetails({ name, value });
        });
    }, [getAppDetails.ofwPresStreet]);

    React.useEffect(() => {
        if (!getRendered) return;

        const isInvalidRole = (ROLE === 'CREDIT');
        const isInvalidStatus = ![2, 5, 6].includes(getAppDetails.ofwmstatus);

        if (isInvalidRole && isInvalidStatus) {
            const updates = {
                ofwspouse: '',
                ofwspousebdate: '',
                SpSrcIncome: '',
                SpIncome: '',
            };

            Object.entries(updates).forEach(([name, value]) => {
                updateAppDetails({ name, value });
            });
        } else {
            updateAppDetails({ name: 'MarriedPBCB', value: false });
        }
    }, [getAppDetails.ofwmstatus]);

    React.useEffect(() => {
        if (!getRendered) return;

        const isInvalidRole = (ROLE === 'CREDIT');
        const isInvalidStatus = ![2, 5, 6].includes(getAppDetails.benmstatus);
        const isMarriedInvalidStatus = ![2, 5, 6].includes(getAppDetails.ofwmstatus) && getAppDetails.MarriedPBCB;

        if (isInvalidRole && isInvalidStatus) {
            const updates = {
                benspouse: '',
                benspousebdate: '',
                BenSpSrcIncome: '',
                BenSpIncome: '',
            };

            Object.entries(updates).forEach(([name, value]) => {
                updateAppDetails({ name, value });
            });
        } else if (isMarriedInvalidStatus) {
            updateAppDetails({ name: 'MarriedPBCB', value: false });
        }
    }, [getAppDetails.benmstatus]);


    React.useEffect(() => {
        if (!getRendered) return;

        const isInvalidStatus = ![2, 5, 6].includes(getAppDetails.coborrowmstatus);

        if (isInvalidStatus) {
            const updates = {
                coborrowerspousebdate: '',
                coborrowspousename: '',
                AcbSpSrcIncome: '',
                AcbSpIncome: '',
            };

            Object.entries(updates).forEach(([name, value]) => {
                updateAppDetails({ name, value });
            });
        }
    }, [getAppDetails.coborrowmstatus]);




    React.useEffect(() => {
        if (!getRendered) return;

        if (getAppDetails.MarriedPBCB) {
            const spouseBenName = `${getAppDetails.benfname || ''} ${getAppDetails.benlname || ''}`.trim();
            const spouseOfwName = `${getAppDetails.ofwfname || ''} ${getAppDetails.ofwlname || ''}`.trim();
            
            const updates = {
                ofwspouse: spouseBenName,
                ofwspousebdate: getAppDetails.benbdate,
                SpSrcIncome: '',
                SpIncome: '',
                benspouse: spouseOfwName,
                benspousebdate: getAppDetails.ofwbdate,
                BenSpSrcIncome: 1,
                BenSpIncome: '',
                benmstatus: getAppDetails.ofwmstatus,
            };

            Object.entries(updates).forEach(([name, value]) => {
                updateAppDetails({ name, value });
            });
        } else {
            const updates = {
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
            };

            Object.entries(updates).forEach(([name, value]) => {
                updateAppDetails({ name, value });
            });
        }
    }, [getAppDetails.MarriedPBCB]);

    // Source of Income
    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;

        updateAppDetails({
            name: 'BenSrcIncome',
            value: getAppDetails.SpSrcIncome,
        });
    }, [getAppDetails.SpSrcIncome]);

    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;

        updateAppDetails({
            name: 'SpSrcIncome',
            value: getAppDetails.BenSrcIncome,
        });
    }, [getAppDetails.BenSrcIncome]);

    // Spouse Income
    React.useEffect(() => {
        if (!getRendered || !getAppDetails.MarriedPBCB) return;

        updateAppDetails({
            name: 'BenIncome',
            value: getAppDetails.SpIncome,
        });
    }, [getAppDetails.SpIncome]);

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