import * as React from "react";
import PersonalInfo from "./ofwDetails/PersonalInfo";
import AddressInfo from "./ofwDetails/AddressInfo";
import OtherInfo from "./ofwDetails/OtherInfo";
import { Divider } from "antd";
import LabeledInput_Salary from "@components/loanApplication/LabeledInput_Salary";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import LabeledCurrencyInput from "@components/loanApplication/LabeledCurrencyInput";

function OfwDetails({
  ofwrendered,
  setofwrendered,
  direct,
  stepperView
}) {
  const { getAppDetails } = React.useContext(LoanApplicationContext);
  const classname_main =
    "flex flex-col sm:flex-row mt-2 w-full sm:w-[500px] h-auto sm:h-[60px]";
  const className_label = "mb-2 sm:mb-0 sm:mr-4 w-full sm:w-[200px]";
  const className_dsub = "w-full sm:w-[400px]";
  React.useEffect(() => {
    setofwrendered(true);
  }, [setofwrendered]); // Added setloanrendered to the dependency array

  return (
    <div className="flex flex-col justify-center mt-[2%]">
      <div ref={stepperView}></div>
      <div className="flex flex-col justify-center items-center w-[850px]">
        {!direct ? (
          <>
            <Divider></Divider>
            <h2 ref={stepperView} className="mb-[2%] text-xl">
              <b>OFW DETAILS</b>
            </h2>
          </>
        ) : (
          <></>
        )}
        <PersonalInfo
          ofwrendered={ofwrendered}
          direct={direct}

        />
        <AddressInfo
          ofwrendered={ofwrendered}
          data={getAppDetails}
          direct={direct}
          // receive={(e) => {
          //   receive(e);
          // }}
          // presaddress={(e) => {
          //   presaddress(e);
          // }}
        />
        <Divider className="mt-[10%]"></Divider>
        {direct ? (
          <OtherInfo
            ofwrendered={ofwrendered}
            // direct={direct}
            // data={data}
            // receive={(e) => {
            //   receive(e);
            // }}
          />
        ) : null}

        <LabeledCurrencyInput
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Salary Amount <span className="text-red-500">*</span></>}
          fieldName="ofwsalary"
          // value={getAppDetails.ofwsalary}
          disabled={!direct && !getAppDetails.dataPrivacy}
          // receive={(e) => {
          //   receive({
          //     name: "ofwsalary",
          //     value: e,
          //   });
          // }}
          category={"direct"}
          placeHolder={"Salary Amount"}
          rendered={ofwrendered}
        />
      </div>
    </div>
  );

}

export default OfwDetails;
