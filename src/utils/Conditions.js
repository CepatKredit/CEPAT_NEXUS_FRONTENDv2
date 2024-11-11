export const PathName = (container) => {
    let name = ''

    if (container === '/ckfi/under-marketing') { name = 'Under Marketing' }
    else if (container === '/ckfi/received') { name = 'Received' }
    else if (container === '/ckfi/lack-of-documents/complied') { name = 'Complied - Lack Of Documents' }
    else if (container === '/ckfi/walk-in') { name = 'For Walk-In' }
    else if (container === '/ckfi/initial-interview') { name = 'For Initial Interview' }
    else if (container === '/ckfi/reassessed/marketing') { name = 'Reassessed To Marketing' }
    else if (container === '/ckfi/lack-of-documents') { name = 'Lack Of Documents' }
    else if (container === '/ckfi/credit-list') { name = 'Credit Assessment List' }
    else if (container === '/ckfi/under-credit') { name = 'Under Credit' }
    else if (container === '/ckfi/approved') { name = 'Approved (Trans-Out)' }
    else if (container === '/ckfi/special-lane') { name = 'Special Lane' }
    else if (container === '/ckfi/assessement/credit') { name = 'For Credit Assessement' }
    else if (container === '/ckfi/queue-bucket') { name = 'Queue Bucket' }
    else if (container === '/ckfi/for-verification') { name = 'For Verification' }
    else if (container === '/ckfi/pre-check') { name = 'Pre-Check' }
    else if (container === '/ckfi/returned/marketing') { name = 'Returned From Marketing' }
    else if (container === '/ckfi/returned/credit-associate') { name = 'Returned From Credit Associate' }
    else if (container === '/ckfi/reassessed/credit-associate') { name = 'Reassessed To Credit Associate' }
    else if (container === '/ckfi/returned/credit-officer') { name = 'Returned From Credit Officer' }
    else if (container === '/ckfi/reassessed/credit-officer') { name = 'Reassessed To Credit Officer' }
    else if (container === '/ckfi/for-approval') { name = 'For Approval' }
    else if (container === '/ckfi/on-waiver') { name = 'On Waiver' }
    else if (container === '/ckfi/approved') { name = 'Approved (Trans-Out)' }
    else if (container === '/ckfi/under-lp') { name = 'Under Lp' }
    else if (container === '/ckfi/confirmation') { name = 'Confirmation' }
    else if (container === '/ckfi/confirmed') { name = 'Confirmed' }
    else if (container === '/ckfi/for-docusign') { name = 'For Docusign' }
    else if (container === '/ckfi/for-disbursement') { name = 'For Disbursement' }
    else if (container === '/ckfi/bank-generation') { name = 'Bank Generation' }
    else if (container === '/ckfi/released') { name = 'Released' }
    else if (container === '/ckfi/returned/credit-officer') { name = 'Returned From Credit Officer' }
    else if (container === '/ckfi/reassessed/credit-officer') { name = 'Reassessed To Credit Officer' }
    else if (container === '/ckfi/undecided') { name = 'Undecided' }
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
    else if (container === '/ckfi/initial-interview') { number = '225' }
    else if (container === '/ckfi/reassessed/marketing') { number = '250' }
    else if (container === '/ckfi/lack-of-documents') { number = '275' }
    else if (container === '/ckfi/credit-list') { number = '300' }
    else if (container === '/ckfi/under-credit') { number = '325' }
    else if (container === '/ckfi/approved') { number = '350' }
    else if (container === '/ckfi/special-lane') { number = '375' }
    else if (container === '/ckfi/assessement/credit') { number = '400' }
    else if (container === '/ckfi/queue-bucket') { number = '425' }
    else if (container === '/ckfi/for-verification') { number = '450' }
    else if (container === '/ckfi/pre-check') { number = '475' }
    else if (container === '/ckfi/returned/marketing') { number = '500' }
    else if (container === '/ckfi/returned/credit-associate') { number = '525' }
    else if (container === '/ckfi/reassessed/credit-associate') { number = '550' }
    else if (container === '/ckfi/returned/credit-officer') { number = '575' }
    else if (container === '/ckfi/reassessed/credit-officer') { number = '600' }
    else if (container === '/ckfi/for-approval') { number = '625' }
    else if (container === '/ckfi/on-waiver') { number = '650' }
    else if (container === '/ckfi/approved') { number = '350' }
    else if (container === '/ckfi/under-lp') { number = '675' }
    else if (container === '/ckfi/confirmation') { number = '700' }
    else if (container === '/ckfi/confirmed') { number = '725' }
    else if (container === '/ckfi/for-docusign') { number = '750' }
    else if (container === '/ckfi/for-disbursement') { number = '775' }
    else if (container === '/ckfi/released') { number = '800' }
    else if (container === '/ckfi/returned/credit-officer') { number = '575' }
    else if (container === '/ckfi/reassessed/credit-officer') { number = '600' }
    else if (container === '/ckfi/on-waiver') { number = '650' }
    else if (container === '/ckfi/undecided') { number = '825' }
    else if (container === '/ckfi/cancelled') { number = '850' }
    else if (container === '/ckfi/declined') { number = '875' }
    else { number = '900' }
    return number
}

export const SET_PATH_LOCATION = (SELECTED_STATUS) => {
    if (SELECTED_STATUS === 'RECEIVED') { localStorage.setItem('SP', '/ckfi/received'); }
    else if (SELECTED_STATUS === 'COMPLIED - LACK OF DOCUMENTS') { localStorage.setItem('SP', '/ckfi/lack-of-documents/complied'); }
    else if (SELECTED_STATUS === 'FOR WALK-IN') { localStorage.setItem('SP', '/ckfi/walk-in'); }
    else if (SELECTED_STATUS === 'FOR INITIAL INTERVIEW') { localStorage.setItem('SP', '/ckfi/initial-interview'); }
    else if (SELECTED_STATUS === 'REASSESSED TO MARKETING') { localStorage.setItem('SP', '/ckfi/reassessed/marketing'); }
    else if (SELECTED_STATUS === 'LACK OF DOCUMENTS') { localStorage.setItem('SP', '/ckfi/lack-of-documents'); }
    else if (SELECTED_STATUS === 'CREDIT ASSESSMENT LIST') { localStorage.setItem('SP', '/ckfi/credit-list'); }
    else if (SELECTED_STATUS === 'UNDER CREDIT') { localStorage.setItem('SP', '/ckfi/under-credit'); }
    else if (SELECTED_STATUS === 'APPROVED (TRANS-OUT)') { localStorage.setItem('SP', '/ckfi/approved'); }
    else if (SELECTED_STATUS === 'SPECIAL LANE') { localStorage.setItem('SP', '/ckfi/special-lane'); }
    else if (SELECTED_STATUS === 'FOR CREDIT ASSESSEMENT') { localStorage.setItem('SP', '/ckfi/assessement/credit'); }
    else if (SELECTED_STATUS === 'QUEUE BUCKET') { localStorage.setItem('SP', '/ckfi/queue-bucket'); }
    else if (SELECTED_STATUS === 'FOR VERIFICATION') { localStorage.setItem('SP', '/ckfi/for-verification'); }
    else if (SELECTED_STATUS === 'PRE-CHECK') { localStorage.setItem('SP', '/ckfi/pre-check'); }
    else if (SELECTED_STATUS === 'RETURNED FROM MARKETING') { localStorage.setItem('SP', '/ckfi/returned/marketing'); }
    else if (SELECTED_STATUS === 'RETURNED FROM CREDIT ASSOCIATE') { localStorage.setItem('SP', '/ckfi/returned/credit-associate'); }
    else if (SELECTED_STATUS === 'REASSESSED TO CREDIT ASSOCIATE') { localStorage.setItem('SP', '/ckfi/reassessed/credit-associate'); }
    else if (SELECTED_STATUS === 'RETURNED FROM CREDIT OFFICER') { localStorage.setItem('SP', '/ckfi/returned/credit-officer'); }
    else if (SELECTED_STATUS === 'REASSESSED TO CREDIT OFFICER') { localStorage.setItem('SP', '/ckfi/reassessed/credit-officer'); }
    else if (SELECTED_STATUS === 'FOR APPROVAL') { localStorage.setItem('SP', '/ckfi/for-approval'); }
    else if (SELECTED_STATUS === 'ON WAIVER') { localStorage.setItem('SP', '/ckfi/on-waiver'); }
    else if (SELECTED_STATUS === 'APPROVED (TRANS-OUT)') { localStorage.setItem('SP', '/ckfi/approved'); }
    else if (SELECTED_STATUS === 'UNDER LP') { localStorage.setItem('SP', '/ckfi/under-lp'); }
    else if (SELECTED_STATUS === 'CONFIRMATION') { localStorage.setItem('SP', '/ckfi/confirmation'); }
    else if (SELECTED_STATUS === 'CONFIRMED') { localStorage.setItem('SP', '/ckfi/confirmed'); }
    else if (SELECTED_STATUS === 'FOR DOCUSIGN') { localStorage.setItem('SP', '/ckfi/for-docusign'); }
    else if (SELECTED_STATUS === 'FOR DISBURSEMENT') { localStorage.setItem('SP', '/ckfi/for-disbursement'); }
    else if (SELECTED_STATUS === 'RELEASED') { localStorage.setItem('SP', '/ckfi/released'); }
    else if (SELECTED_STATUS === 'RETURNED FROM CREDIT OFFICER') { localStorage.setItem('SP', '/ckfi/returned/credit-officer'); }
    else if (SELECTED_STATUS === 'REASSESSED TO CREDIT OFFICER') { localStorage.setItem('SP', '/ckfi/reassessed/credit-officer'); }
    else if (SELECTED_STATUS === 'ON WAIVER') { localStorage.setItem('SP', '/ckfi/on-waiver'); }
    else if (SELECTED_STATUS === 'UNDECIDED') { localStorage.setItem('SP', '/ckfi/undecided'); }
    else if (SELECTED_STATUS === 'CANCELLED') { localStorage.setItem('SP', '/ckfi/cancelled'); }
    else if (SELECTED_STATUS === 'DECLINED') { localStorage.setItem('SP', '/ckfi/declined'); }
    else { localStorage.setItem('SP', '/ckfi/for-re-application'); }
}

export const CHECK_TILE_NAME = (path) => {
    let name = ''
    if (path === '/ckfi/under-marketing') { name = 'UNDER MARKETING' }
    else if (path === '/ckfi/received') { name = 'RECEIVED' }
    else if (path === '/ckfi/lack-of-documents/complied') { name = 'COMPLIED - LACK OF DOCUMENTS' }
    else if (path === '/ckfi/walk-in') { name = 'FOR WALK-IN' }
    else if (path === '/ckfi/initial-interview') { name = 'FOR INITIAL INTERVIEW' }
    else if (path === '/ckfi/reassessed/marketing') { name = 'REASSESSED TO MARKETING' }
    else if (path === '/ckfi/lack-of-documents') { name = 'LACK OF DOCUMENTS' }
    else if (path === '/ckfi/credit-list') { name = 'CREDIT ASSESSMENT LIST' }
    else if (path === '/ckfi/under-credit') { name = 'UNDER CREDIT' }
    else if (path === '/ckfi/approved') { name = 'APPROVED (TRANS-OUT)' }
    else if (path === '/ckfi/special-lane') { name = 'SPECIAL LANE' }
    else if (path === '/ckfi/assessement/credit') { name = 'FOR CREDIT ASSESSEMENT' }
    else if (path === '/ckfi/queue-bucket') { name = 'QUEUE BUCKET' }
    else if (path === '/ckfi/for-verification') { name = 'FOR VERIFICATION' }
    else if (path === '/ckfi/pre-check') { name = 'PRE-CHECK' }
    else if (path === '/ckfi/returned/marketing') { name = 'RETURNED FROM MARKETING' }
    else if (path === '/ckfi/returned/credit-associate') { name = 'RETURNED FROM CREDIT ASSOCIATE' }
    else if (path === '/ckfi/reassessed/credit-associate') { name = 'REASSESSED TO CREDIT ASSOCIATE' }
    else if (path === '/ckfi/returned/credit-officer') { name = 'RETURNED FROM CREDIT OFFICER' }
    else if (path === '/ckfi/reassessed/credit-officer') { name = 'REASSESSED TO CREDIT OFFICER' }
    else if (path === '/ckfi/for-approval') { name = 'FOR APPROVAL' }
    else if (path === '/ckfi/on-waiver') { name = 'ON WAIVER' }
    else if (path === '/ckfi/approved') { name = 'APPROVED (TRANS-OUT)' }
    else if (path === '/ckfi/under-lp') { name = 'UNDER LP' }
    else if (path === '/ckfi/confirmation') { name = 'CONFIRMATION' }
    else if (path === '/ckfi/confirmed') { name = 'CONFIRMED' }
    else if (path === '/ckfi/for-docusign') { name = 'FOR DOCUSIGN' }
    else if (path === '/ckfi/for-disbursement') { name = 'FOR DISBURSEMENT' }
    else if (path === '/ckfi/released') { name = 'RELEASED' }
    else if (path === '/ckfi/returned/credit-officer') { name = 'RETURNED FROM CREDIT OFFICER' }
    else if (path === '/ckfi/reassessed/credit-officer') { name = 'REASSESSED TO CREDIT OFFICER' }
    else if (path === '/ckfi/on-waiver') { name = 'ON WAIVER' }
    else if (path === '/ckfi/undecided') { name = 'UNDECIDED' }
    else if (path === '/ckfi/cancelled') { name = 'CANCELLED' }
    else if (path === '/ckfi/declined') { name = 'DECLINED' }
    else { name = 'FOR RE-APPLICATION' }
    return name
}