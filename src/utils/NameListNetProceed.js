import { Suffix } from "./FixedData";

export function NameList(data) {
    let names = []

    const suffixes = Suffix().reduce((acc, curr) => ({ ...acc, [curr.value]: curr.label }), {});
    let OFW = { fname: data.ofwfname, lname: data.ofwlname, suffix: data.ofwsuffix }
    let BENE = { fname: data.benfname, lname: data.benlname, suffix: data.bensuffix }
    let ACB = { fname: data.coborrowfname, lname: data.coborrowlname, suffix: data.coborrowsuffix }
    names.push({
        name: `${OFW.fname} ${OFW.lname} ${OFW.suffix === 1 ? "": suffixes[OFW.suffix]}`,
        values: {
            firstName: OFW.fname,
            lastName: OFW.lname, 
            Suffix: OFW.suffix,
        },
        desc: 'Principal Borrower',
        emoji: 'PB'
    })
    if (BENE.fname !== '' || BENE.fname === undefined && BENE.lname !== '' || BENE.fname === undefined) {
        names.push({
            name: `${BENE.fname} ${BENE.lname} ${BENE.suffix === 1 ? "": suffixes[BENE.suffix]}`,
            values: {
                firstName: BENE.fname,
                lastName: BENE.lname, 
                Suffix: BENE.suffix,
        },
            desc: 'Co-Borrower',
            emoji: 'CB'
        })
    }
    if (ACB.fname !== '' || ACB.fname === undefined && ACB.lname !== '' || ACB.fname === undefined) {
        names.push({
            name: `${ACB.fname} ${ACB.lname} ${ACB.suffix === 1 ? "": suffixes[ACB.suffix]}`,
            values: {
            firstName: ACB.fname,
            lastName: ACB.lname, 
            Suffix: ACB.suffix,
        },
            desc: 'Additional Co-Borrower',
            emoji: 'ACB'
        })
    }
    return names
}