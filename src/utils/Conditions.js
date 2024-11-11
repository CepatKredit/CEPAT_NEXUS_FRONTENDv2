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
    else if (container === '/ckfi/credit-assessment' ) { number = '350' }
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