import createInitialAppDetails from "@utils/IntialValues";
import { getBeneficiaryAddressUpdatedFields, getLoanDetailUpdatedFields, getOfwAddressUpdatedFields } from "@utils/Validations";
import React from "react";
import { notification } from 'antd'

export const LoanApplicationContext = React.createContext();

export const LoanApplicationProvider = ({ children, direct }) => {
  const [getAppDetails, setAppDetails] = React.useState(
    createInitialAppDetails(direct)
  );

  const [api, contextHolder] = notification.useNotification();

  const updateAppDetails = (e) => {
    if (!e || !e.name) return;
    setAppDetails((prevDetails) => ({
      ...prevDetails,
      [e.name]: e.value,
    }));
  };
//   const updateAppDetails = (e) => {
//     if (!e || !e.name) return;
//     setAppDetails((prevDetails) => {
//         const updatedDetails = { ...prevDetails, [e.name]: e.value };
//         return updatedDetails;
//     });
// };  

  const handleLoanDetailCases = (e) => {
    setAppDetails((prevDetails) => ({
      ...prevDetails,
      ...getLoanDetailUpdatedFields(e),
      [e.name]: e.value,
    }));
  };

  const handleAddressCases = (e, type) => {
    if (type === "beneficiary") {
      // Call the beneficiary address handler
      setAppDetails((prevDetails) => ({
        ...prevDetails,
        ...getBeneficiaryAddressUpdatedFields(e, getAppDetails),
        [e.name]: e.value,
      }));
    } else {
      // Call the OFW/present/permanent address handler
      setAppDetails((prevDetails) => ({
        ...prevDetails,
        ...getOfwAddressUpdatedFields(e, getAppDetails),
        [e.name]: e.value,
      }));
    }
  };

  const resetAppDetails = () => {

    setAppDetails(createInitialAppDetails(direct));
    localStorage.removeItem('CLID');
  };

  return (
    <LoanApplicationContext.Provider
      value={{
        getAppDetails,
        setAppDetails,
        direct,
        updateAppDetails,
        handleLoanDetailCases,
        api,
        handleAddressCases,
        resetAppDetails,
      }}
    >
      {contextHolder}
      {children}
    </LoanApplicationContext.Provider>
  );
};
