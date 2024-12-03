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
import InputOpt from "@components/optimized/InputOpt";
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
    "flex flex-col xs1:flex-col 2xl:flex-row mt-2 xs1:mt-3 2xl:mt-2 w-full xs1:w-[300px] sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] 3xl:w-[500px] h-auto  xs:h-auto 2xl:h-[60px]";
  const className_label = "mb-2 xs1:mb-0 xs1:mr-4 w-full xs1:w-[300px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[300px] 3xl:w-[500px]";
  const className_dsub = "w-full xs1:w-[300px] sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] 3xl:w-[400px]";
  React.useEffect(() => {
    setbenrendered(true);
  }, [setbenrendered]);

  return (
    <div className="flex flex-col justify-center items-center mt-[2%]">
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
        <div className={`${classname_main} flex items-center `}>
          <label className="mb-5 xs1:mb-1 sm:mb-5 xs1:mr-1 sm:mr-4 w-full sm:w-[252px]">
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
            <div className="relative flex items-center w-full sm:w-[420px] mb-5 xs1:mb-1 sm:mb-5">
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

          KeyName={"bensuffix"}
          group={'Default'}
          compname={'Suffix'}
          EmptyMsg={'Suffix Required'}
          InvalidMsg={'Invalid Suffix'}
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
          disabled={false || !getAppDetails.dataPrivacy}
          rendered={benrendered}

          KeyName={"benbdate"}
          group={'Default'}
          compname={'Birth Date'}
          EmptyMsg={'Birth Date Required'}
          InvalidMsg={'Invalid Birth Date'}
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

          KeyName={"benmstatus"}
          group={'Default'}
          compname={'Marital Status'}
          EmptyMsg={'Marital Status Required'}
          InvalidMsg={'Invalid Marital Status'}
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

        <InputOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Contact Number <span className="text-red-500">*</span></>}
          value={getAppDetails.bennumber}
          receive={(e) => updateAppDetails({ name: 'bennumber', value: e })}
          category={'marketing'}
          rendered={benrendered}
          placeHolder={'Enter Contact No.'}
          KeyName={'bennumber'}
          format={'+639'}
          group={'ContactNo'}
          compname={'Contact No.'}

          EmptyMsg={'Contact No. Required'}
          InvalidMsg={'Invalid Contact No.'}
        />

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
          KeyName={"benrelationship"}
          group={'Default'}
          compname={'Relationship to the OFW'}
          EmptyMsg={'Relationship to the OFW Required'}
          InvalidMsg={'Invalid Relationship to the OFW'}

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
