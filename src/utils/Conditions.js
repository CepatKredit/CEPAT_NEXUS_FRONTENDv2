export const PathName = (container) => {
    let name = ''

    if (container === '/ckfi/under-marketing') { name = 'Under Marketing' }
    else if (container === '/ckfi/received') { name = 'Received' }
    else if (container === '/ckfi/lack-of-documents/complied') { name = 'Complied - Lack Of Documents' }
    else if (container === '/ckfi/walk-in') { name = 'For Walk-In' }
    else if (container === '/ckfi/for-initial-interview') { name = 'For Initial Interview' }
    else if (container === '/ckfi/reassessed-to-marketing') { name = 'Reassessed To Marketing' }
    else if (container === '/ckfi/lack-of-documents') { name = 'Lack Of Documents' }
    else if (container === '/ckfi/credit-assessment-list') { name = 'Credit Assessment List' }
    else if (container === '/ckfi/credit-assessment/special-lane') { name = 'Special Lane' }
    else if (container === '/ckfi/credit-assessment') { name = 'For Credit Assessement' }
    else if (container === '/ckfi/under-credit') { name = 'Under Credit' }
    else if (container === '/ckfi/queue-bucket') { name = 'Queue Bucket' }
    else if (container === '/ckfi/for-verification') { name = 'For Verification' }
    else if (container === '/ckfi/pre-check') { name = 'Pre-Check' }
    //else if (container === '/ckfi/return/marketing') { name = 'Return from Marketing' }
    else if (container === '/ckfi/return/credit-associate') { name = 'Return from Credit Associate' }
    else if (container === '/ckfi/return/credit-officer') { name = 'Return from Credit Officer' }
    else if (container === '/ckfi/reassessed/credit-officer') { name = 'Reassessed To Credit Officer' }
    else if (container === '/ckfi/pre-approval') { name = 'Pre Approval' }
    else if (container === '/ckfi/for-approval') { name = 'For Approval' }
    else if (container === '/ckfi/approved') { name = 'Approved (Trans-Out)' }
    else if (container === '/ckfi/under-loan-processor') { name = 'Under Lp' }
    else if (container === '/ckfi/for-docusign') { name = 'For Docusign' }
    else if (container === '/ckfi/ok/for-docusign') { name = 'Ok For Docusign' }
    else if (container === '/ckfi/tagged-for-release') { name = 'Tagged For Release' }
    else if (container === '/ckfi/on-waiver') { name = 'On Waiver' }
    else if (container === '/ckfi/confirmation') { name = 'Confirmation' }
    else if (container === '/ckfi/confirmed') { name = 'Confirmed' }
    else if (container === '/ckfi/undecided') { name = 'Undecided' }
    else if (container === '/ckfi/for-disbursement') { name = 'For Disbursement' }
    else if (container === '/ckfi/bank-generation') { name = 'Bank Generation' }
    else if (container === '/ckfi/released') { name = 'Released' }
    else if (container === '/ckfi/return/loan-processor') { name = 'Return from Loans Processor' }
    else if (container === '/ckfi/cancelled') { name = 'Cancelled' }
    else if (container === '/ckfi/declined') { name = 'Declined' }
    else { name = 'For Re-Application' }

    return name
}

export const TileNumber = (container) => {
    let number = '0'
    if (container === '/ckfi/under-marketing') { number = '125' }
    else if (container === '/ckfi/received') { number = '150' }
    else if (container === '/ckfi/lack-of-documents/complied') { number = '175' }
    else if (container === '/ckfi/walk-in') { number = '200' }
    else if (container === '/ckfi/for-initial-interview') { number = '225' }
    else if (container === '/ckfi/reassessed-to-marketing') { number = '250' }
    else if (container === '/ckfi/lack-of-documents') { number = '275' }
    else if (container === '/ckfi/credit-assessment-list') { number = '300' }
    else if (container === '/ckfi/credit-assessment/special-lane') { number = '325' }
    else if (container === '/ckfi/credit-assessment') { number = '350' }
    else if (container === '/ckfi/under-credit') { number = '375' }
    else if (container === '/ckfi/queue-bucket') { number = '400' }
    else if (container === '/ckfi/for-verification') { number = '425' }
    else if (container === '/ckfi/pre-check') { number = '450' }
    //else if (container === '/ckfi/return/marketing') { number = '465' }
    else if (container === '/ckfi/return/credit-associate') { number = '475' }
    else if (container === '/ckfi/return/credit-officer') { number = '500' }
    else if (container === '/ckfi/reassessed/credit-officer') { number = '525' }
    else if (container === '/ckfi/pre-approval') { number = '540' }
    else if (container === '/ckfi/for-approval') { number = '550' }
    else if (container === '/ckfi/approved') { number = '575' }
    else if (container === '/ckfi/under-loan-processor') { number = '600' }
    else if (container === '/ckfi/for-docusign') { number = '625' }
    else if (container === '/ckfi/ok/for-docusign') { number = '650' }
    else if (container === '/ckfi/tagged-for-release') { number = '675' }
    else if (container === '/ckfi/on-waiver') { number = '700' }
    else if (container === '/ckfi/confirmation') { number = '725' }
    else if (container === '/ckfi/confirmed') { number = '750' }
    else if (container === '/ckfi/undecided') { number = '775' }
    else if (container === '/ckfi/for-disbursement') { number = '800' }
    else if (container === '/ckfi/bank-generation') { number = '810' }
    else if (container === '/ckfi/released') { number = '825' }
    else if (container === '/ckfi/return/loan-processor') { number = '850' }
    else if (container === '/ckfi/cancelled') { number = '875' }
    else if (container === '/ckfi/declined') { number = '900' }
    else { number = '925' }

    return number
}

export const SET_PATH_LOCATION = (SELECTED_STATUS) => {
    if (SELECTED_STATUS === 'DECLINED') { localStorage.setItem('SP', '/ckfi/declined'); }
    else if (SELECTED_STATUS === 'CANCELLED') { localStorage.setItem('SP', '/ckfi/cancelled'); }

    else if (SELECTED_STATUS === 'LACK OF DOCUMENTS') { localStorage.setItem('SP', '/ckfi/lack-of-documents'); }
    else if (SELECTED_STATUS === 'FOR CREDIT ASSESSEMENT') { localStorage.setItem('SP', '/ckfi/credit-assessment-list'); }
    else if (SELECTED_STATUS === 'FOR INITIAL INTERVIEW') { localStorage.setItem('SP', '/ckfi/for-initial-interview'); }
    else if (SELECTED_STATUS === 'FOR WALK-IN') { localStorage.setItem('SP', '/ckfi/walk-in'); }
    else if (SELECTED_STATUS === 'COMPLIED - LACK OF DOCUMENTS') { localStorage.setItem('SP', '/ckfi/complied/lack-of-documents'); }
    else if (SELECTED_STATUS === 'RECEIVED') { localStorage.setItem('SP', '/ckfi/received'); }
    else if (SELECTED_STATUS === 'REASSESSED TO CREDIT ASSOCIATE') { localStorage.setItem('SP', '/ckfi/return/credit-associate'); }
    else if (SELECTED_STATUS === 'RETURN TO CREDIT OFFICER') { localStorage.setItem('SP', '/ckfi/return/credit-officer'); }
    else if (SELECTED_STATUS === 'ON WAIVER') { localStorage.setItem('SP', '/ckfi/on-waiver'); }

    else if (SELECTED_STATUS === 'SCREENING') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
    else if (SELECTED_STATUS === 'INTERVIEW') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
    else if (SELECTED_STATUS === 'FOR CALLBACK') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
    else if (SELECTED_STATUS === 'FOR VERIFICATION') { localStorage.setItem('SP', '/ckfi/for-verification'); }
    else if (SELECTED_STATUS === 'PRE-CHECK') { localStorage.setItem('SP', '/ckfi/pre-check'); }
    else if (SELECTED_STATUS === 'FOR APPROVAL') { localStorage.setItem('SP', '/ckfi/for-approval'); }
    else if (SELECTED_STATUS === 'REASSESSED TO MARKETING') { localStorage.setItem('SP', '/ckfi/reassessed/marketing'); }
    else if (SELECTED_STATUS === 'PRE-APPROVAL') { localStorage.setItem('SP', '/ckfi/reassessed/credit-officer'); }
    else if (SELECTED_STATUS === 'APPROVED (TRANS-OUT)') { localStorage.setItem('SP', '/ckfi/trans-in'); }

    else if (SELECTED_STATUS === 'RETURN TO LOAN PROCESSOR') { localStorage.setItem('SP', '/ckfi/return/loan-processor'); }
    else if (SELECTED_STATUS === 'FOR DOCUSIGN') { localStorage.setItem('SP', '/ckfi/for-docusign'); }
    else if (SELECTED_STATUS === 'OK FOR DOCUSIGN') { localStorage.setItem('SP', '/ckfi/ok/for-docusign'); }
    else if (SELECTED_STATUS === 'TAGGED FOR RELEASE') { localStorage.setItem('SP', '/ckfi/tagged-for-release'); }
    else if (SELECTED_STATUS === 'FOR DISBURSMENT') { localStorage.setItem('SP', '/ckfi/for-disbursement'); }

    else if (SELECTED_STATUS === 'RELEASED') { localStorage.setItem('SP', '/ckfi/released'); }
    else if (SELECTED_STATUS === 'CONFIRMATION') { localStorage.setItem('SP', '/ckfi/confirmation'); }
    else if (SELECTED_STATUS === 'CONFIRMED') { localStorage.setItem('SP', '/ckfi/confirmed'); }
    else { localStorage.setItem('SP', '/ckfi/undecided'); }
}

export const CHECK_TILE_NAME = (path) => {
    let name = ''
    if (path === '/ckfi/under-marketing') { name = 'UNDER MARKETING' }
    else if (path === '/ckfi/received') { name = 'RECEIVED' }
    else if (path === '/ckfi/lack-of-documents/complied') { name = 'COMPLIED - LACK OF DOCUMENTS' }
    else if (path === '/ckfi/walk-in') { name = 'FOR WALK-IN' }
    else if (path === '/ckfi/for-initial-interview') { name = 'FOR INITIAL INTERVIEW' }
    else if (path === '/ckfi/reassessed-to-marketing') { name = 'REASSESSED TO MARKETING' }
    else if (path === '/ckfi/lack-of-documents') { name = 'LACK OF DOCUMENTS' }
    else if (path === '/ckfi/credit-assessment-list') { name = 'CREDIT ASSESSMENT LIST' }
    else if (path === '/ckfi/credit-assessment/special-lane') { name = 'SPECIAL LANE' }
    else if (path === '/ckfi/credit-assessment') { name = 'FOR CREDIT ASSESSEMENT' }
    else if (path === '/ckfi/under-credit') { name = 'UNDER CREDIT' }
    else if (path === '/ckfi/queue-bucket') { name = 'QUEUE BUCKET' }
    else if (path === '/ckfi/for-verification') { name = 'FOR VERIFICATION' }
    else if (path === '/ckfi/pre-check') { name = 'PRE-CHECK' }
    else if (path === '/ckfi/return/credit-associate') { name = 'RETURN TO CREDIT ASSOCIATE' }
    else if (path === '/ckfi/return/credit-officer') { name = 'RETURN TO CREDIT OFFICER' }
    else if (path === '/ckfi/reassessed/credit-officer') { name = 'REASSESSED TO CREDIT OFFICER' }
    else if (path === '/ckfi/pre-approval') { name = 'PRE APPROVAL' }
    else if (path === '/ckfi/for-approval') { name = 'FOR APPROVAL' }
    else if (path === '/ckfi/approved') { name = 'APPROVED (TRANS-OUT)' }
    else if (path === '/ckfi/under-loan-processor') { name = 'UNDER LP' }
    else if (path === '/ckfi/for-docusign') { name = 'FOR DOCUSIGN' }
    else if (path === '/ckfi/ok/for-docusign') { name = 'OK FOR DOCUSIGN' }
    else if (path === '/ckfi/tagged-for-release') { name = 'TAGGED FOR RELEASE' }
    else if (path === '/ckfi/on-waiver') { name = 'ON WAIVER' }
    else if (path === '/ckfi/confirmation') { name = 'CONFIRMATION' }
    else if (path === '/ckfi/confirmed') { name = 'CONFIRMED' }
    else if (path === '/ckfi/undecided') { name = 'UNDECIDED' }
    else if (path === '/ckfi/for-disbursement') { name = 'FOR DISBURSEMENT' }
    else if (path === '/ckfi/released') { name = 'RELEASED' }
    else if (path === '/ckfi/return/loan-processor') { name = 'RETURN TO LOANS PROCESSOR' }
    else if (path === '/ckfi/cancelled') { name = 'CANCELLED' }
    else if (path === '/ckfi/declined') { name = 'DECLINED' }
    else { name = 'FOR RE-APPLICATION' }
    return name
}

