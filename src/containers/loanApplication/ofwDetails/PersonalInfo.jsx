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
import DatePickerOpt from "@components/optimized/DatePickerOpt";
import SelectOpt from "@components/optimized/SelectOpt";
import { useDataContainer } from "@context/PreLoad";

dayjs.extend(customParseFormat);

function PersonalInfo({ ofwrendered, receive, presaddress, direct }) {
  const { getAppDetails, handleAddressCases, updateAppDetails } =
    React.useContext(LoanApplicationContext);
  const { GET_OFW_SUFFIX } = useDataContainer();

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
        fieldName="ofwfname"
        placeHolder="First Name"
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
        fieldName="ofwlname"
        placeHolder="Last Name"
        category={"direct"}
        disabled={!direct && !getAppDetails.dataPrivacy}
        rendered={ofwrendered}
      />
      <SelectOpt
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Suffix <span className="text-red-500">*</span>
          </>
        }
        value={getAppDetails.ofwsuffix}
        disabled={!getAppDetails.dataPrivacy}
        placeHolder={"Suffix"}
        required={true}
        showSearch
        notValidMsg={"Suffix is required."}
        KeyName={"ofwsuffix"}
        receive={(e) => {
          updateAppDetails({
            name: "ofwsuffix",
            value: e,
          });
        }}
        options={GET_OFW_SUFFIX.map((item) => ({
          label: item.description,
          value: item.code,
        }))}
        rendered={ofwrendered}
      />
      <DatePickerOpt
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Birth Date <span className="text-red-500">*</span>
          </>
        }
        required={true}
        placeHolder={"MM-DD-YYYY"}
        value={getAppDetails.ofwbdate}
        receive={(e) => {
          updateAppDetails({
            name: "ofwbdate",
            value: e,
          });
        }}
        notValidMsg={"OFW Birth Date is required."}
        disabled={false || !getAppDetails.dataPrivacy}
        KeyName={"ofwbdate"}
        rendered={ofwrendered}
        // disabledate={disableDate_deployment}
      />
      <GenderRadioGroup
        classname_main={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        direct={direct}
        fieldName={"ofwgender"}
        rendered={ofwrendered}
        disabled={!direct && !getAppDetails.dataPrivacy}
      />
      <SelectOpt
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Marital Status <span className="text-red-500">*</span>
          </>
        }
        value={getAppDetails.ofwmstatus}
        disabled={!getAppDetails.dataPrivacy}
        placeHolder={"Marital Status"}
        required={true}
        showSearch
        notValidMsg={"Marital Status is required."}
        KeyName={"ofwmstatus"}
        receive={(e) => {
          updateAppDetails({
            name: "ofwmstatus",
            value: e,
          });
        }}
        options={MaritalStatus().map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        rendered={ofwrendered}
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

      <SelectOpt
        className_dmain={classname_main}
        className_label={className_label}
        className_dsub={className_dsub}
        label={
          <>
            Type of Residences <span className="text-red-500">*</span>
          </>
        }
        value={getAppDetails.ofwresidences}
        disabled={!getAppDetails.dataPrivacy}
        placeHolder={"Residence"}
        required={true}
        showSearch
        notValidMsg={"Residence is required."}
        KeyName={"ofwresidences"}
        receive={(e) => {
          updateAppDetails({
            name: "ofwresidences",
            value: e,
          });
        }}
        options={Residences().map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        rendered={ofwrendered}
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
