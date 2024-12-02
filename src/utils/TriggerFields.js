import React, { useMemo } from "react";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { debouncef } from "./Debounce";

function TriggerFields(ROLE) {
    const [getRendered, setRendered] = React.useState(false)
    const skipRender = React.useRef(1); //use this
    const { getAppDetails, updateAppDetails } = React.useContext(LoanApplicationContext)
    const delay_def = 500; //ms

    const latestValueRef = React.useRef(null);

    //DEBOUNCE UPDATE TO CONTEXT
    const debouncedReceive = useMemo(
        () =>
            debouncef((field, value, delay) => {
                if (latestValueRef.current !== value) { //Block the same values in delay
                    updateAppDetails({ name: field, value: value });
                    latestValueRef.current = value; // Update `latestValueRef` after applying the update
                }
            }), 
        [updateAppDetails]
    );

    React.useEffect(() => {
        return () => {
            debouncedReceive.cancel();
        };
    }, [debouncedReceive]);

    //MARITAL STATUS TO RELATIONSHIP
    function getRelationship(MARITAL_STATUS) {
        switch (MARITAL_STATUS) {
            case 2:
                return 37;
            case 5:
                return 24;
            case 6:
                return 9;
            default:
                return 0;
        }
    }
    //RELATIONSHIP TO MARITAL STATUS
    function getMaritalStatus(RELATIONSHIP) {
        console.log(RELATIONSHIP)
        switch (RELATIONSHIP) {
            case 37:
                return 2;
            case 24:
                return 5;
            case 9:
                return 6;
            default:
                return 0;
        }
    }

    //RELATIONSHIP TO RELATIONSHIP
    function getRelationshipConv(RELATIONSHIP, GENDER) {
        switch (RELATIONSHIP) {
            case 14: //Aunt
                return GENDER === 1 ? 17 : 16;
            case 18: //brother
                return 1 ? 18 : 19;
            case 12: //bro-in-law/sis-in-law
                return 12;
            case 24: //common-in-law spouse
                return 24;
            case 15: //couse
                return 15;
            case 26: //daugther
                return 20;
            case 11: //Pa/MA in law
                return 27;
            case 9: //fiance
                return 9;
            case 1: //friend
                return 1;
            case 28: //grandchild
                return 21;
            case 21: //grandparent
                return 28;
            case 36: //grandparent-in-law
                return 28;
            case 35: //half-siblings
                return 35;

            case 29: //legal guardian
                return 0;
            case 2: //neighbor
                return 2;
            case 17: //nephew
                return GENDER === 1 ? 13 : 14;
            case 16: //niece
                return GENDER === 1 ? 13 : 14;
            case 39: //officemate
                return 39;
            case 20: //parent
                return 0;
            case 19: //sister
                return 0;
            case 38: //son
                return 0;
            case 27: //Son-in-law / Daughter-in-la
                return 0;
            case 37: //spouse
                return 37;
            case 31: //step child
                return 0;
            case 30: //Step-grandparent
                return 28;
            case 32: //Step-parent
                return 0;
            case 34: //Step-sibling
                return 0;
            case 13: //uncle
                return GENDER === 1 ? 17 : 16
            default:
                return 0;
        }
    }

    function ClearFields(fields) {
        fields.forEach((key) => {
            if (getAppDetails.hasOwnProperty(key)) {
                updateAppDetails({ name: key, value: '' });
            }
        });
    }

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

    const relationshipBen = React.useMemo(() => getAppDetails.RelationshipBen, [getAppDetails.RelationshipBen]);
    React.useEffect(() => {
        if (!getRendered) return;
        if (relationshipBen !== '') {
            debouncedReceive('benrelationship', getRelationshipConv(getAppDetails.RelationshipBen, getAppDetails.ofwgender), delay_def); // Pass the custom delay
        }
    }, [relationshipBen])

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

    React.useEffect(() => { //need to enhance this, temporary only(problem in dev but not in deployment)
        if (!getRendered) return;
        if (getAppDetails.ofwjobtitle !== '' && !!getAppDetails.JobCategory) {
            updateAppDetails({ name: 'ofwjobtitle', value: '' });
        }
    }, [getAppDetails.JobCategory]);

    /*
    React.useEffect(() => {
        if (!getRendered) return;
        const updates = {
            ofwmstatus: getMaritalStatus(getAppDetails.RelationshipBen),
        }

        Object.entries(updates).forEach(([name, value]) => {
            updateAppDetails({ name, value });
        });

    }, [getAppDetails.RelationshipBen]) //OFW TO BENE*/

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
                BenSpIncome: getAppDetails.PSalary,
                benmstatus: getAppDetails.ofwmstatus,
                RelationshipBen: getRelationship(getAppDetails.ofwmstatus),
                benrelationship: getRelationship(getAppDetails.ofwmstatus),
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
                benrelationship: '',
                RelationshipBen: '',
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