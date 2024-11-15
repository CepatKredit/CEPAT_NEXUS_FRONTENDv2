import React from "react";
import { MaritalStatus } from "@utils/FixedData";
import { Radio, Checkbox, Input, ConfigProvider } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LabeledSelect from "@components/loanApplication/LabeledSelect";
import LabeledInput_Fullname from "@components/loanApplication/LabeledInput_UpperCase";
import LabeledInput_Email from "@components/loanApplication/LabeledInput_Email";
import LabeledInput_Contact from "@components/loanApplication/LabeledInput_Contact";
import AddressGroup_Component from "@components/loanApplication/AddressGroup_Component";
import DatePicker_BDate from "@components/loanApplication/DatePicker_BDate";
import LabeledSelect_Suffix from "@components/loanApplication/LabeledSelect_Suffix";
import LabeledSelect_Relationship from "../../components/loanApplication/LabeledSelect_Relationship";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import GenderRadioGroup from "@components/loanApplication/GenderRadioGroup";
import SelectOpt from "@components/optimized/SelectOpt";
import { useDataContainer } from "@context/PreLoad";
import DatePickerOpt from "@components/optimized/DatePickerOpt";
import { toUpperText } from "@utils/Converter";
dayjs.extend(customParseFormat);

function BeneficiaryDetails({
  benrendered,
  setbenrendered,
  api,
  data,
  receive,
  presaddress,
}) {
  const { getAppDetails, handleAddressCases, updateAppDetails } =
    React.useContext(LoanApplicationContext);

  const { GET_OFW_SUFFIX, GET_RELATIONSHIP_LIST } = useDataContainer();
  const classname_main =
    "flex flex-col sm:flex-row mt-2 w-full sm:w-[500px] h-auto sm:h-[60px]";
  const className_label = "mb-2 sm:mb-0 sm:mr-4 w-full sm:w-[200px]";
  const className_dsub = "w-full sm:w-[400px]";

  React.useEffect(() => {
    setbenrendered(true);
  }, [setbenrendered]);

  return (
    <div className="flex flex-col justify-center mt-[2%]">
      <div className="flex flex-col justify-center items-center w-[850px]">
        <LabeledInput_Fullname
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              First Name <span className="text-red-500">*</span>
            </>
          }
          // value={data.benfname}
          fieldName="benfname"
          error_status={"First name is required."}
          placeHolder={"First Name"}
          // receive={(e) => {
          //     receive({
          //         name: 'benfname',
          //         value: e
          //     })
          // }}
          category={"direct"}
          rendered={benrendered}
        />
        <div className={`${classname_main} flex items-center space-x-2`}>
          <label className={"mb-5 sm:mb-5 sm:mr-4 w-full sm:w-[200px]"}>
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
                fieldName="benmname"
                placeholder={
                  getAppDetails.withBenMName ? "No Middle Name" : "Middle Name"
                }
                onChange={(e) => {
                  updateAppDetails({
                    name: "benmname",
                    value: toUpperText(e.target.value),
                  });
                }}
                value={getAppDetails["benmname"]}
                disabled={
                  getAppDetails.withBenMName || !getAppDetails.dataPrivacy
                }
                addonAfter={
                  <Checkbox
                    checked={getAppDetails.withBenMName}
                    onClick={() => {
                      updateAppDetails({
                        name: "withBenMName",
                        fieldName: "withBenMName",
                        value: !getAppDetails.withBenMName,
                      });
                      handleAddressCases({
                        name: "resetBenMiddleName",
                        fieldName: "resetBenMiddleName",
                        value: "",
                      }, "beneficiary");
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
          // value={data.benlname}
          fieldName="benlname"
          error_status={"Last name is required."}
          placeHolder={"Last Name"}
          // receive={(e) => {
          //     receive({
          //         name: 'benlname',
          //         value: e
          //     })
          // }}
          category={"direct"}
          rendered={benrendered}
        />
        {/* <LabeledSelect_Suffix
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Suffix <span className="text-red-500">*</span>
            </>
          }
          fieldName={"bensuffix"}
          // value={data.bensuffix}
          // receive={(e) => {
          //     receive({
          //         name: 'bensuffix',
          //         value: e
          //     })
          // }}
          category={"direct"}
          placeHolder={"Suffix"}
          rendered={benrendered}
          showSearch
        /> */}

        <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Suffix <span className="text-red-500">*</span>
            </>
          }
          value={getAppDetails.bensuffix}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Suffix"}
          required={true}
          showSearch
          notValidMsg={"Suffix is required."}
          KeyName={"bensuffix"}
          receive={(e) => {
            updateAppDetails({
              name: "bensuffix",
              value: e,
            });
          }}
          options={GET_OFW_SUFFIX.map((item) => ({
            label: item.description,
            value: item.code,
          }))}
          rendered={benrendered}
        />
        {/* <DatePicker_BDate
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Birth Date <span className="text-red-500">*</span>
            </>
          }
          // value={data.benbdate}
          fieldName="benbdate"
          error_status={"Birth Date is required."}
          placeHolder="MM-DD-YYYY"
          // receive={(e) => {
          //     receive({
          //         name: 'benbdate',
          //         value: dayjs(e, 'MM-DD-YYYY')
          //     })
          // }}
          category={"direct"}
          rendered={benrendered}
        /> */}
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
          value={getAppDetails.benbdate}
          receive={(e) => {
            updateAppDetails({
              name: "benbdate",
              value: e,
            });
          }}
          notValidMsg={"OFW Birth Date is required."}
          disabled={false || !getAppDetails.dataPrivacy}
          KeyName={"benbdate"}
          rendered={benrendered}
          // disabledate={disableDate_deployment}
        />
        <GenderRadioGroup
          classname_main={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          fieldName={"bengender"}
          rendered={benrendered}
        />

        {/* <LabeledSelect
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Marital Status <span className="text-red-500">*</span>
            </>
          }
          // value={data.benmstatus}

          error_status={"Marital Status is required."}
          placeHolder={"Marital Status"}
          fieldName="benmstatus"
          data={MaritalStatus()}
          category={"direct"}
          rendered={benrendered}
        /> */}

        <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Marital Status <span className="text-red-500">*</span>
            </>
          }
          value={getAppDetails.benmstatus}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Marital Status"}
          required={true}
          showSearch
          notValidMsg={"Marital Status is required."}
          KeyName={"benmstatus"}
          receive={(e) => {
            updateAppDetails({
              name: "benmstatus",
              value: e,
            });
          }}
          options={MaritalStatus().map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          rendered={benrendered}
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
          // value={data.benemail}
          fieldName="benemail"
          error_status={"Email Address is required."}
          placeHolder={"Email Adress"}
          category={"direct"}
          rendered={benrendered}
        />
        <LabeledInput_Contact
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Contact Number <span className="text-red-500">*</span>
            </>
          }
          fieldName="bennumber"
          error_status={"Contact Number is required."}
          category={"direct"}
          placeHolder={"Contact No."}
          rendered={benrendered}
        />
        {/* <LabeledSelect_Relationship
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Relationship to the OFW (Kaano-ano mo si OFW)
              <span className="text-red-500">*</span>
            </>
          }
          error_status={"Relationship is required."}
          fieldName="benrelationship"
          category={"direct"}
          placeHolder={"Relationship"}
          rendered={benrendered}
          showSearch
        /> */}

        <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Relationship to the OFW (Kaano-ano mo si OFW)
              <span className="text-red-500">*</span>
            </>
          }
          value={getAppDetails.benrelationship}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Relationship"}
          required={true}
          showSearch
          notValidMsg={"Relationship is required."}
          KeyName={"benrelationship"}
          receive={(e) => {
            updateAppDetails({
              name: "benrelationship",
              value: e,
            });
          }}
          options={GET_RELATIONSHIP_LIST.map((item) => ({
            label: item.description,
            value: item.code,
          }))}
          rendered={benrendered}
        />
        <h2 className=" mt-[5%]">
          <b>PRESENT ADDRESS</b>
        </h2>
        <AddressGroup_Component
          api={api}
          data={data}
          rendered={benrendered}
          // receive={(e) => { receive(e) }}
          type="beneficiary"
          category={"direct"}
          // presaddress={(e) => { handleBeneficiaryAddressCases(e) }}
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          vertical_align={false}
          disabled={false}
        />
      </div>
    </div>
  );
}

export default BeneficiaryDetails;
