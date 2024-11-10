import './index.css'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_URL
axios.defaults.withCredentials = true
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PortalLogin from '@pages/PortalLogin';
import LoanApplication from '@pages/LoanApplication';
import Page403 from '@pages/error/Page403';
import Page404 from '@pages/error/Page404';
import ResetPassword from '@pages/ResetPassword';
import UnlockAccount from '@pages/UnlockAccount';
import Home from '@layouts/SideNav';
import Dashboard from '@pages/Dashboard';
import ManageUsers from '@pages/admin/ManageUsers';
import ManageBranch from '@pages/admin/ManageBranch';
import ManageCountry from '@pages/admin/ManageCountry';
import ManageCityMunicipalities from '@pages/admin/ManageCityMunicipalities';
import ManageAgency from '@pages/admin/ManageAgency';
import ManageBarangay from '@pages/admin/ManageBarangay';
import DataList from '@pages/DataList';
import Endorsement from '@pages/Endorsement';
import LoanApplicationInfo from '@containers/dataList/LoanApplicationInfo';
import LoanApplicationStatus from '@pages/LoanApplicationStatus';
import Tester from '@pages/Test/Tester';

import { LoanApplicationProvider } from '@context/LoanApplicationContext';
import ManageCurrency from '@pages/ManageCurrency';
import DataList_AssignToCra from '@pages/DataList_AssignToCra';
import BankGeneration from '@pages/accounting/BankGeneration';
import ForDisbursement from '@pages/accounting/ForDisbursement';
import BatchList from '@pages/accounting/bankGeneration/BatchList';

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <PortalLogin />
        },
        {
            path: '/test',
            element: <Tester />
        },
        {
            path: '/track',
            element: <LoanApplicationStatus />
        },
        {
            path: '/loan-application',
            element: <LoanApplication />
        },
        {
            path: '/reset-password/:id',
            element: <ResetPassword />
        },
        {
            path: '/unlock-account/:id',
            element: <UnlockAccount />
        },
        {
            path: '*',
            element: <Page404 />
        },
        {
            path: '/unauthorized',
            element: <Page403 />
        },
        {
            path: '/ckfi',
            element: <Home />,
            children: [
                { path: '/ckfi/dashboard', element: <Dashboard />, },
                { path: ':path/:add/:id/:tabs', element: <LoanApplicationInfo />, },
                { path: ':path/:id/:tabs', element: <LoanApplicationInfo />, },
                { path: '/ckfi/endorsement', element: <Endorsement />, },
                /* IT DEPARTMENT CONTROL */
                { path: '/ckfi/manage-users', element: <ManageUsers />, },
                { path: '/ckfi/manage-branch', element: <ManageBranch />, },
                { path: '/ckfi/manage-country', element: <ManageCountry />, },
                { path: '/ckfi/manage-city-municipality', element: <ManageCityMunicipalities />, },
                { path: '/ckfi/manage-barangay', element: <ManageBarangay />, },
                { path: '/ckfi/manage-agency', element: <ManageAgency />, },
                /* INTERNAL AND EXTERNAL USERS CONTROL */
                { path: '/ckfi/endorsement', element: <Endorsement /> },
                { path: '/ckfi/under-marketing', element: <DataList /> },
                { path: '/ckfi/received', element: <DataList /> },
                { path: '/ckfi/lack-of-documents/complied', element: <DataList /> },
                { path: '/ckfi/walk-in', element: <DataList /> },
                { path: '/ckfi/initial-interview', element: <DataList /> },
                { path: '/ckfi/reassessed/marketing', element: <DataList /> },
                { path: '/ckfi/lack-of-documents', element: <DataList /> },
                { path: '/ckfi/credit-list', element: <DataList /> },
                { path: '/ckfi/under-credit', element: <DataList /> },
                { path: '/ckfi/approved', element: <DataList /> },
                { path: '/ckfi/manage-currency', element: <ManageCurrency /> },
                { path: '/ckfi/special-lane', element: <DataList /> },
                { path: '/ckfi/assessement/credit', element: <DataList_AssignToCra /> },
                { path: '/ckfi/queue-bucket', element: <DataList_AssignToCra /> },
                { path: '/ckfi/for-verification', element: <DataList_AssignToCra /> },
                { path: '/ckfi/pre-check', element: <DataList_AssignToCra /> },
                { path: '/ckfi/returned/marketing', element: <DataList /> },
                { path: '/ckfi/returned/credit-associate', element: <DataList_AssignToCra /> },
                { path: '/ckfi/reassessed/credit-associate', element: <DataList_AssignToCra /> },
                { path: '/ckfi/returned/credit-officer', element: <DataList_AssignToCra /> },
                { path: '/ckfi/reassessed/credit-officer', element: <DataList_AssignToCra /> },
                { path: '/ckfi/for-approval', element: <DataList_AssignToCra /> },
                { path: '/ckfi/on-waiver', element: <DataList /> },
                { path: '/ckfi/approved', element: <DataList /> },
                { path: '/ckfi/under-lp', element: <DataList /> },
                { path: '/ckfi/confirmation', element: <DataList /> },
                { path: '/ckfi/confirmed', element: <DataList /> },
                { path: '/ckfi/for-docusign', element: <DataList /> },
                { path: '/ckfi/for-disbursement', element: <ForDisbursement /> },
                { path: '/ckfi/bank-generation', element: <BatchList /> },
                { path: '/ckfi/released', element: <DataList /> },
                { path: '/ckfi/returned/credit-officer', element: <DataList /> },
                { path: '/ckfi/reassessed/credit-officer', element: <DataList /> },
                { path: '/ckfi/on-waiver', element: <DataList /> },
                { path: '/ckfi/undecided', element: <DataList /> },
                { path: '/ckfi/cancelled', element: <DataList /> },
                { path: '/ckfi/declined', element: <DataList /> },
                { path: '/ckfi/for-re-application', element: <DataList /> },

                /*{ path: '/ckfi/endorsement', element: <Endorsement /> },
                { path: '/ckfi/under-marketing', element: <DataList /> },
                { path: '/ckfi/received', element: <DataList /> },
                { path: '/ckfi/lack-of-documents/complied', element: <DataList /> },
                { path: '/ckfi/walk-in', element: <DataList /> },
                { path: '/ckfi/for-initial-interview', element: <DataList /> },
                { path: '/ckfi/reassessed-to-marketing', element: <DataList /> },
                { path: '/ckfi/lack-of-documents', element: <DataList /> },
                { path: '/ckfi/credit-assessment-list', element: <DataList /> },
                { path: '/ckfi/credit-assessment/special-lane', element: <DataList /> },
                { path: '/ckfi/credit-assessment', element: <DataList_AssignToCra /> },
                { path: '/ckfi/under-credit', element: <DataList /> },
                { path: '/ckfi/queue-bucket', element: <DataList_AssignToCra /> },
                { path: '/ckfi/for-verification', element: <DataList_AssignToCra /> },
                { path: '/ckfi/pre-check', element: <DataList_AssignToCra /> },
                { path: '/ckfi/return/credit-associate', element:  <DataList_AssignToCra /> },
                { path: '/ckfi/return/credit-officer', element:  <DataList_AssignToCra /> },
                { path: '/ckfi/reassessed/credit-officer', element: <DataList_AssignToCra /> },
                { path: '/ckfi/pre-approval', element:  <DataList_AssignToCra /> },
                { path: '/ckfi/for-approval', element:  <DataList_AssignToCra /> },
                { path: '/ckfi/approved', element: <DataList /> },
                { path: '/ckfi/under-loan-processor', element: <DataList /> },
                { path: '/ckfi/for-docusign', element: <DataList /> },
                { path: '/ckfi/ok/for-docusign', element: <DataList /> },
                { path: '/ckfi/tagged-for-release', element: <DataList /> },
                { path: '/ckfi/on-waiver', element: <DataList /> },
                { path: '/ckfi/confirmation', element: <DataList /> },
                { path: '/ckfi/confirmed', element: <DataList /> },
                { path: '/ckfi/undecided', element: <DataList /> },
                { path: '/ckfi/released', element: <DataList /> },
                { path: '/ckfi/return/loan-processor', element: <DataList /> },
                { path: '/ckfi/cancelled', element: <DataList /> },
                { path: '/ckfi/declined', element: <DataList /> },
                { path: '/ckfi/re-application', element: <DataList /> },
                { path: '/ckfi/manage-currency', element: <ManageCurrency /> },
                { path: '/ckfi/for-disbursement', element: <ForDisbursement /> },
                { path: '/ckfi/bank-generation', element: <BatchList /> },
                { path: '/ckfi/for-disbursement', element: <DataList /> },*/
            ]
        }
    ])
    return (
        <LoanApplicationProvider direct={true}>   
        <RouterProvider router={router} />
        </LoanApplicationProvider>   
    );
}

export default App;