import { LoanApplicationContext } from "@context/LoanApplicationContext";
import {
  generateLoanDataDirect,
  generateLoanDataLc,
} from "@utils/InsertValues";
import createInitialAppDetails from "@utils/IntialValues";
import React, { useContext } from "react";

export const useAppDetailsEffects = (getAppDetails, setAppDetails) => {
  React.useEffect(() => {
    setAppDetails((prevDetails) => {
      let updatedFields = { loanDateDep: "" };
      if (
        getAppDetails.loanProd === "0303-DH" ||
        getAppDetails.loanProd === "0303-DHW"
      ) {
        updatedFields.ofwjobtitle = "DOMESTIC HELPER";
      } else {
        updatedFields.ofwjobtitle = "";
      }
      return { ...prevDetails, ...updatedFields };
    });
  }, [getAppDetails.loanProd]);

  React.useEffect(() => {
    setAppDetails((prevDetails) => ({
      ...prevDetails,
      ofwSameAdd: false,
      bensameadd: false,
      ofwPermProv: "",
      ofwPermMunicipality: "",
      ofwPermBarangay: "",
      ofwPermStreet: "",
      benpresprov: "",
      benpresmunicipality: "",
      benpresbarangay: "",
      benpresstreet: "",
    }));
  }, [getAppDetails.ofwPresStreet]);
};

export const useDirectLoan = (setDetails, setLoadings, setIsModalOpen) => {
  const { getAppDetails  } = React.useContext(LoanApplicationContext);

  const directLoan = (direct) => {
      const data = direct ? generateLoanDataDirect(getAppDetails) : generateLoanDataLc(getAppDetails)
      setDetails(data);
      setLoadings(true);
      setIsModalOpen(true);
  };

return { directLoan };
};

