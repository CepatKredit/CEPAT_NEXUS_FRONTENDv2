import LabeledInput from "@components/loanApplication/LabeledInput";
import { Divider, Checkbox, notification } from "antd";
import LabeledSelect_ValidId from "@components/loanApplication/LabeledSelect_ValidId";
import LabeledSelect_Country from "@components/loanApplication/LabeledSelect_Country";
import LabeledInput_UpperCase from "@components/loanApplication/LabeledInput_UpperCase";
import React from "react";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import SelectOpt from "@components/optimized/SelectOpt";
import { useDataContainer } from "@context/PreLoad";

function OtherInfo({ ofwrendered, data, receive }) {
  const classname_main =
    "flex flex-col sm:flex-row mt-2 w-full sm:w-[500px] h-auto sm:h-[60px]";
  const className_label = "mb-2 sm:mb-0 sm:mr-4 w-full sm:w-[200px]";
  const className_dsub = "w-full sm:w-[400px]";
  const { getAppDetails } = React.useContext(LoanApplicationContext);
  const { GET_VALID_ID_LIST, GET_COUNTRY_LIST } = useDataContainer();

  return (
    <>
      <h2>
        <b>PRESENTED ID DETAILS</b>
      </h2>
      <p className="text-xs text-red-500 mb-[2%]">(Optional)</p>
      <div id="ID Details" className="mb-[2%]">
        <LabeledSelect_ValidId
                    className_dmain={classname_main}
                    className_label={className_label}
                    className_dsub={className_dsub}
                    label='Valid ID'
                    // receive={(e) => {
                    //     receive({
                    //         name: 'ofwvalidid',
                    //         value: e
                    //     });
                    // }}
                    fieldName="ofwvalidid"
                    category='direct'
                    // value={data.ofwvalidid}
                    placeHolder='Valid ID'
                    required={false}
                    grendered= {ofwrendered}
                    showSearch
                />
        {/* <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Valid ID</>}
          value={getAppDetails.ofwvalidid}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Valid ID"}
          required={false}
          showSearch
          notValidMsg={""}
          KeyName={"ofwvalidid"}
          receive={(e) => {
            updateAppDetails({
              name: "ofwvalidid",
              value: e,
            });
          }}
          options={GET_VALID_ID_LIST.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          rendered={ofwrendered}
        /> */}
        <LabeledInput
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label="ID Number"
          fieldName="ofwidnumber"
          category="direct"
          placeHolder="ID Number"
          // value={data.ofwidnumber}
          required={false}
          rendered={ofwrendered}
        />
      </div>
      <Divider />
      <h2 className="mb-[2%] mt-[5%]">
        <b>EMPLOYMENT DETAILS</b>
      </h2>

      <LabeledSelect_Country
        className_dmain={classname_main}
        className_label={"text-sm " + className_label}
        className_dsub={className_dsub}
        label={
          <>
            Country of Employment for OFW or Joining Port for SEAFARER{" "}
            <span className="text-red-500">*</span>
          </>
        }
        category="direct"
        // value={data.ofwcountry}
        // receive={(e) => {
        //     receive({
        //         name: 'ofwcountry',
        //         value: e
        //     });
        // }}
        fieldName="ofwcountry"
        placeHolder="Country of Employment"
        rendered={ofwrendered}
      />

      {/* <SelectOpt
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Country of Employment for OFW or Joining Port for SEAFARER
            <span className="text-red-500">*</span>
          </>
        }
        value={getAppDetails.ofwcountry}
        disabled={!getAppDetails.dataPrivacy}
        placeHolder={"Country"}
        required={false}
        showSearch
        notValidMsg={"Country is required."}
        KeyName={"ofwcountry"}
        receive={(e) => {
          updateAppDetails({
            name: "ofwcountry",
            value: e,
          });
        }}
        options={GET_COUNTRY_LIST.map((item) => ({
          label: item.description,
          value: item.code,
        }))}
        rendered={ofwrendered}
      /> */}
      <LabeledInput_UpperCase
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Job Title / Position <span className="text-red-500">*</span>
          </>
        }
        category="direct"
        fieldName="ofwjobtitle"
        disabled={
          (getAppDetails.loanProd === "0303-DH" ||
            getAppDetails.loanProd === "0303-DHW") &&
          getAppDetails.ofwjobtitle === "DOMESTIC HELPER"
        }
        placeHolder="Job Title/Position"
        rendered={ofwrendered}
      />
      <LabeledInput_UpperCase
        className_dmain={classname_main}
        className_label={"text-sm " + className_label}
        className_dsub={className_dsub}
        label={
          <>
            Company/ Employer / Agency Name
            <span className="text-red-500">*</span>
          </>
        }
        category="direct"
        fieldName="ofwcompany"
        placeHolder="Company/Employer/Agency Name"
        rendered={ofwrendered}
      />
    </>
  );
}

export default OtherInfo;
