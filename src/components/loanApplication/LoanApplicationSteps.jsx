import BeneficiaryDetails from "@containers/loanApplication/BeneficiaryDetails";
import LoanDetails from "@containers/loanApplication/LoanDetails";
import OfwDetails from "@containers/loanApplication/OfwDetails";
import { LoanApplicationContext } from "@context/LoanApplicationContext";

import {
  getBeneficiaryAddressUpdatedFields,
  getLoanDetailUpdatedFields,
  getOfwAddressUpdatedFields,
} from "@utils/Validations";

import { Typography } from "antd";
import { useContext } from "react";

const { Title } = Typography;

export const getLoanApplicationSteps = (props) => {
  const {
    loanrendered,
    setloanrendered,
    ofwrendered,
    setofwrendered,
    benrendered,
    setbenrendered,
    api,
    stepperView
  } = props;

  const { direct, getAppDetails, setAppDetails } = useContext(
    LoanApplicationContext
  );

  console.log("Sa Stepper>>>", direct);

  const steps = [
    {
      key: 0,
      title: <Title level={5}>Loan Details</Title>,
      content: (
        <LoanDetails
          loanrendered={loanrendered}
          setloanrendered={setloanrendered}
          direct={direct}
        />
      ),
    },
    {
      key: 1,
      title: <Title level={5}>OFW Details</Title>,
      content: (
        <OfwDetails
          ofwrendered={ofwrendered}
          setofwrendered={setofwrendered}
          direct={direct}
          stepperView={stepperView}
        />
      ),
    },
  ];

  if (direct) {
    steps.push({
      key: 2,
      title: <Title level={5}>Beneficiary Details</Title>,
      content: (
        <BeneficiaryDetails
          benrendered={benrendered}
          setbenrendered={setbenrendered}
          api={api}
          data={getAppDetails}
          direct={direct}
          stepperView={stepperView}
        />
      ),
    });
  }

  return steps;
};
