import { Radio, notification, Checkbox, Input, ConfigProvider } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import LabeledInput_Fullname from "@components/loanApplication/LabeledInput_UpperCase";
import LabeledSelect from "@components/loanApplication/LabeledSelect";
import LabeledInput_Email from "@components/loanApplication/LabeledInput_Email";
import LabeledInput_OfwContact from "@components/loanApplication/LabeledInput_OfwContact";
import LabeledInput from "@components/loanApplication/LabeledInput";
import DatePicker_BDate from "@components/loanApplication/DatePicker_BDate";
import { Suffix, MaritalStatus, Residences } from "@utils/FixedData";
import LabeledInput_Numeric from "@components/loanApplication/LabeledInput_Numeric";
import LabeledSelect_Suffix from "@components/loanApplication/LabeledSelect_Suffix";
import LabeledCurrencyInput from "@components/loanApplication/LabeledCurrencyInput";
import React from "react";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { toUpperText } from "@utils/Converter";
import GenderRadioGroup from "@components/loanApplication/GenderRadioGroup";

dayjs.extend(customParseFormat);

function PersonalInfo({ ofwrendered, receive, presaddress, direct }) {
  const { getAppDetails, handleAddressCases, updateAppDetails } =
    React.useContext(LoanApplicationContext);
  const classname_main =
    "flex flex-col sm:flex-row mt-2 w-full sm:w-[500px] h-auto sm:h-[60px]";
  const className_label = "mb-2 sm:mb-0 sm:mr-4 w-full sm:w-[200px]";
  const className_dsub = "w-full sm:w-[400px]";
  const [getRentRender, setRentRender] = React.useState(ofwrendered);

  return (
    <>
      <h2 className="mb-[2%]">
        <b>PERSONAL INFO</b>
      </h2>
      <LabeledInput_Fullname
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            First Name <span className="text-red-500">*</span>
          </>
        }
        // value={getAppDetails.ofwfname}
        fieldName="ofwfname"
        placeHolder="First Name"
        // receive={(e) => {
        //     receive({
        //         name: 'ofwfname',
        //         value: e
        //     })
        // }}

        category={"direct"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
      />
      <div className={`${classname_main} flex items-center space-x-2`}>
        <label className="mb-5 sm:mb-5 sm:mr-4 w-full sm:w-[200px]">
          Middle Name
        </label>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                controlHeight: 42,
              },
            },
          }}
        >
          <div className="relative flex items-center w-full sm:w-[420px] mb-5">
            <Input
              className="w-full"
              fieldName="ofwmname"
              placeholder={
                getAppDetails.withOfwMName ? "No Middle Name" : "Middle Name"
              }
              onChange={(e) => {
                updateAppDetails({
                  name: "ofwmname",
                  value: toUpperText(e.target.value),
                });
              }}
              value={getAppDetails["ofwmname"]}
              disabled={
                getAppDetails.withOfwMName || !getAppDetails.dataPrivacy
              }
              addonAfter={
                <Checkbox
                  checked={getAppDetails.withOfwMName}
                  onClick={() => {
                    updateAppDetails({
                      name: "withOfwMName",
                      fieldName: "withOfwMName",
                      value: !getAppDetails.withOfwMName,
                    });
                    handleAddressCases({
                      name: "resetmname",
                      fieldName: "resetmname",
                      value: "",
                    });
                  }}
                  className="text-xs"
                  disabled={!getAppDetails.dataPrivacy}
                >
                  No Middle Name
                </Checkbox>
              }
            />
          </div>
        </ConfigProvider>
      </div>
      <LabeledInput_Fullname
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Last Name <span className="text-red-500">*</span>
          </>
        }
        // value={getAppDetails.ofwlname}
        fieldName="ofwlname"
        placeHolder="Last Name"
        // receive={(e) => {
        //     receive({
        //         name: 'ofwlname',
        //         value: e
        //     })
        // }}
        category={"direct"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
      />
      <LabeledSelect_Suffix
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Suffix <span className="text-red-500">*</span>
          </>
        }
        fieldName="ofwsuffix"
        // value={getAppDetails.ofwsuffix}
        // receive={(e) => {
        //     receive({
        //         name: 'ofwsuffix',
        //         value: e
        //     })
        // }}

        category={"direct"}
        placeHolder={"Suffix"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
        showSearch
      />
      <DatePicker_BDate
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        fieldName="ofwbdate"
        label={
          <>
            Birth Date <span className="text-red-500">*</span>
          </>
        }
        // receive={(e) => {
        //     receive({
        //         name: 'ofwbdate',
        //         value: dayjs(e, 'MM-DD-YYYY')
        //     })
        // }}
        // value={getAppDetails.ofwbdate}

        category={"direct"}
        placeHolder={"MM-DD-YYYY"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
      />
      {/* <div className={classname_main}>
                <label className={className_label}>Gender<span className="text-red-500"> *</span></label>
                <div className={className_dsub} >
                    <Radio.Group 
                    onChange={(e) => {
                        updateAppDetails({
                            name: 'ofwgender',
                            value: e.target.value
                        });
                    }} value={getAppDetails.ofwgender}
                        disabled={!direct && !getAppDetails.dataPrivacy}
                    >
                        <Radio value={1}>Male</Radio>
                        <Radio value={2}>Female</Radio>
                    </Radio.Group>
                </div>
            </div> */}
      <GenderRadioGroup
        classname_main={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        direct={direct}
        fieldName={'ofwgender'}
        rendered={ofwrendered}
      />

      <LabeledSelect
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Marital Status <span className="text-red-500">*</span>
          </>
        }
        // value={getAppDetails.ofwmstatus}
        fieldName="ofwmstatus"
        data={MaritalStatus()}
        // receive={(e) => {
        //     receive({
        //         name: 'ofwmstatus',
        //         value: e
        //     })
        // }}
        disabled={!direct && !getAppDetails.dataPrivacy}
        category={"direct"}
        placeHolder={"Marital Status"}
        rendered={ofwrendered}
        showSearch
        filterOption={(input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        }
      />

      <LabeledInput_Numeric
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Dependents <span className="text-red-500">*</span>
          </>
        }
        fieldName="ofwdependents"
        // value={getAppDetails.ofwdependents}
        // receive={(e) => {
        //     receive({
        //         name: 'ofwdependents',
        //         value: e
        //     })
        // }}
        disabled={!direct && !getAppDetails.dataPrivacy}
        category={"direct"}
        digits={2} //Max of digits allowd to input
        placeHolder={"No. of Dependents"}
        rendered={ofwrendered}
      />
      <LabeledInput_Email
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Email Address <span className="text-red-500">*</span>
          </>
        }
        // receive={(e) => {
        //     receive({
        //         name: 'ofwemail',
        //         value: e
        //     })
        // }}
        // value={getAppDetails.ofwemail}
        fieldName="ofwemail"
        category={"direct"}
        placeHolder={"Email Address"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
      />

      <LabeledInput_OfwContact
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Mobile Number <span className="text-red-500">*</span>
          </>
        }
        fieldName="ofwmobile"
        placeHolder={"Mobile Number"}
        // receive={(e) => {
        //     receive({
        //         name: 'ofwmobile',
        //         value: e
        //     })
        // }}
        // value={getAppDetails.ofwmobile}
        category={"direct"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
      />

      <LabeledInput
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Facebook Profile/Name <span className="text-red-500">*</span>
          </>
        }
        placeHolder={"Facebook Profile/Name"}
        // receive={(e) => {
        //     receive({
        //         name: 'ofwfblink',
        //         value: e
        //     })
        // }}
        // value={getAppDetails.ofwfblink}
        fieldName="ofwfblink"
        disabled={!direct && !getAppDetails.dataPrivacy}
        category={"direct"}
        rendered={ofwrendered}
      />
      <LabeledSelect
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Type of Residences <span className="text-red-500">*</span>
          </>
        }
        fieldName="ofwresidences"
        // receive={(e) => {
        //     receive({
        //         name: 'ofwresidences',
        //         value: e
        //     })
        // }}
        disabled={!direct && !getAppDetails.dataPrivacy}
        data={Residences()}
        category={"direct"}
        // value={getAppDetails.ofwresidences}
        placeHolder={"Type of Residences"}
        rendered={ofwrendered}
        showSearch
        filterOption={(input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        }
      />

      {(getAppDetails.ofwresidences === 3 ||
        getAppDetails.ofwresidences === 2) && (
        <LabeledCurrencyInput
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              {getAppDetails.ofwresidences === 3
                ? "Rent Amount"
                : "Monthly Amortization"}
              <span className="text-red-500">*</span>
            </>
          }
          fieldName="rentAmount"
          // value={getAppDetails.rentAmount}
          // receive={(e) => {
          //     receive({
          //         name: 'rentAmount',
          //         value: e
          //     })
          // }}
          category={"direct"}
          placeHolder={
            getAppDetails.ofwresidences === 3
              ? "Rent Amount"
              : "Monthly Amortization"
          }
          disabled={!direct && !getAppDetails.dataPrivacy}
          rendered={ofwrendered && getRentRender}
        />
      )}
    </>
  );
}

export default PersonalInfo;
