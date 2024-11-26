import * as React from "react";
import { Checkbox, Divider, Form, notification } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import ReadMore from "./loanDetails/ReadMore";
import ReadLess from "./loanDetails/ReadLess";
import LabeledSelect from "@components/loanApplication/LabeledSelect";
import LabeledCurrencyInput from "@components/loanApplication/LabeledCurrencyInput";
import LabeledInput_UpperCase from "@components/loanApplication/LabeledInput_UpperCase";
import LabeledInput_Contact from "@components/loanApplication/LabeledInput_Contact";
import LabeledSelect_Branch from "../../components/loanApplication/LabeledSelect_Branch";
import DatePicker_Deployment from "@components/loanApplication/DatePicker_Deployment";
import LabeledSelectLoanProduct from "@components/loanApplication/LabeledSelectLoanProduct";
import LabeledSelectLoanPurpose from "@components/loanApplication/LabeledSelectLoanPurpose";
import { Hckfi, ReferredBy, LoanTerms } from "@utils/FixedData";
import { GetData } from "@utils/UserData";
import LabeledSelect_BranchMarketing from "@components/loanApplication/LabeledSelect_BranchMarketing";
import LabeledSelect_Consultant from "@components/loanApplication/LabeledSelect_Consultant";
import { getHCKFILoanCases } from "@utils/Validations";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import SelectOpt from "@components/optimized/SelectOpt";
import DatePickerOpt from "@components/optimized/DatePickerOpt";
import { LoanProductList } from "@api/loanApplicationsGetList/LoanProductAPI";
import { useDataContainer } from "@context/PreLoad";

function LoanDetails({ loanrendered, setloanrendered, direct }) {
  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const { GET_LOAN_PRODUCT_LIST, GET_LOAN_PURPOSE_LIST, GET_BRANCH_LIST } =
    useDataContainer();
  const [readMore, setReadMore] = React.useState(false);

  const classname_main =
    "flex flex-col xs1:flex-col 2xl:flex-row mt-2 xs1:mt-3 2xl:mt-2 w-full xs1:w-[250px] xs2:w-[300px] sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] 3xl:w-[500px] h-auto  xs1:h-auto 2xl:h-[60px]";
  const className_label = "mb-2 xs1:mb-0 xs:mr-4 w-full xs1:w-[200px]  xs2:w-[300px] sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[300px] 3xl:w-[500px]";
  const className_dsub = "w-full xs1:w-[250px] xs2:w-[300px] sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] 3xl:w-[400px]";

  React.useEffect(() => {
    setloanrendered(true);
  }, [setloanrendered]);

  const disableDate_deployment = React.useCallback((current) => {
    return current && current < dayjs().startOf("day");
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-[2rem]">
      <div
  className={`flex flex-row w-full 
    ${GetData('ROLE') && GetData('ROLE').toString() === '20' ? 'xs1:w-[40%] xs2:w-[35%] xs:w-[35%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[100%] 2xl:w-[80%] 3xl:w-[51%]' : 'xs1:w-[100%] xs2:w-[85%] xs:w-[85%]'} 
    sm:w-[80%] md:w-[90%] lg:w-[90%] xl:w-[100%] 2xl:w-[70%] 3xl:w-[51%] justify-between items-center`}
>
        <Checkbox
          name="chkBox_DataPrivacy"
          className="h-auto"
          checked={getAppDetails.dataPrivacy}
          onClick={() =>
            updateAppDetails({
              name: "dataPrivacy",
              value: !getAppDetails.dataPrivacy,
            })
          }
        />
        <div className="mx-[10px] text-xs">
          {readMore === false ? (
            <ReadMore
              updateRead={(result) => {
                setReadMore(result);
              }}
            />
          ) : (
            <ReadLess
              updateRead={(result) => {
                setReadMore(result);
              }}
            />
          )}
        </div>
      </div>
      <Divider className="mt-[3%]" />
      <div className="flex flex-col justify-center items-center w-[850px] ">
        {!direct ? (
          <>
            <h2 className="mb-[2%] text-xl">
              <b>LOAN DETAILS</b>
            </h2>
            <div className={classname_main}>
              <label className="mt-[7px] w-[195px]">Renewal</label>
              <div className="mx-[2%] mt-[7px] w-[100px]">
                <Checkbox
                  disabled={!getAppDetails.dataPrivacy}
                  checked={getAppDetails.loanRenewal}
                  onClick={() =>
                    updateAppDetails({
                      name: "loanRenewal",
                      value: !getAppDetails.loanRenewal,
                    })
                  }
                  className="text-"
                ></Checkbox>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Select Loan Product <span className="text-red-500">*</span>
            </>
          }
          value={getAppDetails.loanProd}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Loan Product"}
          required={true}
          showSearch
          notValidMsg={"Loan Product is required."}
          KeyName={"loanProd"}
          receive={(e) => {
            updateAppDetails({
              name: "loanProd",
              value: e,
            });
          }}
          options={GET_LOAN_PRODUCT_LIST.map((product) => ({
            value: product.code,
            label: product.description,
          }))}
          rendered={loanrendered}
        />
        {getAppDetails.loanProd === "0303-DHW" ||
          getAppDetails.loanProd === "0303-VL" ||
          getAppDetails.loanProd === "0303-WL" ? (
          <>
            <DatePickerOpt
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={
                <>
                  OFW Departure Date <span className="text-red-500">*</span>
                </>
              }
              required={true}
              placeHolder={"MM-DD-YYYY"}
              value={getAppDetails.loanDateDep}
              receive={(e) => {
                updateAppDetails({
                  name: "loanDateDep",
                  value: e,
                });
              }}
              notValidMsg={"OFW Departure Date is required."}
              disabled={false || !getAppDetails.dataPrivacy}
              KeyName={"loanDateDep"}
              disabledate={disableDate_deployment}
              rendered={false}
            //SkipRender={false}
            />
          </>
        ) : (
          <></>
        )}
        <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Select Loan Purpose <span className="text-red-500">*</span>
            </>
          }
          value={getAppDetails.loanPurpose}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Loan Purpose"}
          required={true}
          showSearch
          notValidMsg={"Loan Purpose is required."}
          KeyName={"loanPurpose"}
          receive={(e) => {
            updateAppDetails({
              name: "loanPurpose",
              value: e,
            });
          }}
          options={GET_LOAN_PURPOSE_LIST.map((item) => ({
            value: item.id,
            label: item.purpose,
          }))}
          rendered={loanrendered}
        />
        <LabeledCurrencyInput
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Loan Amount <span className="text-red-500">*</span>
            </>
          }
          fieldName="loanAmount"
          category={"direct"}
          placeHolder={"Loan Amount"}
          disabled={!getAppDetails.dataPrivacy}
          rendered={loanrendered}
        />
        <SelectOpt
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={
            <>
              Select Loan Terms <span className="text-red-500">*</span>
            </>
          }
          value={getAppDetails.loanTerms}
          disabled={!getAppDetails.dataPrivacy}
          placeHolder={"Loan Terms"}
          required={true}
          showSearch
          notValidMsg={"Loan Terms is required."}
          KeyName={"loanTerms"}
          receive={(e) => {
            updateAppDetails({
              name: "loanTerms",
              value: e,
            });
          }}
          options={LoanTerms(12)?.map((item) => ({
            value: item.value,
            label: item.label.toString(),
          }))}
          rendered={loanrendered}
        />
        {!direct ? null : (
          <SelectOpt
            className_dmain={classname_main}
            className_label={className_label}
            className_dsub={className_dsub}
            label={
              <>
                How did you know about Cepat Kredit Financing?
                <span className="text-red-500">*</span>
              </>
            }
            value={getAppDetails.hckfi}
            disabled={!getAppDetails.dataPrivacy}
            placeHolder={"Please select..."}
            required={true}
            showSearch
            notValidMsg={"This field is required."}
            KeyName={"hckfi"}
            receive={(e) => {
              updateAppDetails({
                name: "hckfi",
                value: e,
              });
            }}
            options={Hckfi()?.map((item) => ({
              value: item.value,
              label: item.label.toString(),
            }))}
            rendered={loanrendered}
          />
        )}
      </div>
      {(getAppDetails.hckfi === 10 && direct) || !direct ? (
        <div className="flex flex-col justify-center items-center w-[850px] mt-[2%]">
          {GetData("ROLE") !== null ? (
            GetData("ROLE").toString() === "30" ||
              GetData("ROLE").toString() === "40" ? (
              <LabeledSelect_Consultant
                className_dmain={classname_main}
                className_label={
                  "mb-2 sm:mb-0 sm:mr-[5rem] w-[15rem] sm:w-[200px]"
                }
                className_dsub={"w-full sm:w-[400px]"}
                label={"Loan Consultant Name"}
                fieldName="consultName"
                placeHolder="Consultant Fullname"
                required={false}
                category={"direct"}
                readOnly={GetData("ROLE").toString() === "20" ? true : false}
                disabled={!getAppDetails.dataPrivacy}
                rendered={loanrendered}
              />
            ) : (
              <LabeledInput_UpperCase
                className_dmain={classname_main}
                className_label={className_label}
                className_dsub={className_dsub}
                label={
                  <>
                    Loan Consultant Name<span className="text-red-500">*</span>
                  </>
                }
                fieldName="consultName"
                placeHolder="Consultant Fullname"
                // required={false}
                category={"direct"}
                readOnly={GetData("ROLE").toString() === "20" ? true : false}
                disabled={!getAppDetails.dataPrivacy}
                rendered={loanrendered}
              />
            )
          ) : (
            <LabeledInput_UpperCase
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={
                <>
                  Loan Consultant Name <span className="text-red-500">*</span>
                </>
              }
              fieldName="consultName"
              placeHolder="Consultant Fullname"
              // required={false}
              category={"direct"}
              readOnly={
                GetData("ROLE") !== null
                  ? GetData("ROLE").toString() === "20"
                    ? true
                    : false
                  : false
              }
              disabled={!getAppDetails.dataPrivacy}
              rendered={loanrendered}
            />
          )}
          {GetData("ROLE") !== null ? (
            GetData("ROLE").toString() === "20" ? (
              <></>
            ) : (
              <LabeledInput_Contact
                className_dmain={classname_main}
                className_label={className_label}
                className_dsub={className_dsub}
                label={"Loan Consultant Number"}
                fieldName="consultNumber"
                placeHolder={"Consultant No."}
                category={"direct"}
                // required={false}
                disabled={!getAppDetails.dataPrivacy}
                rendered={loanrendered}
              />
            )
          ) : (
            <LabeledInput_Contact
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={
                <>
                  Loan Consultant Number<span className="text-red-500">*</span>
                </>
              }
              fieldName="consultNumber"
              placeHolder={"Consultant No."}
              category={"direct"}
              // required={false}
              disabled={!getAppDetails.dataPrivacy}
              rendered={loanrendered}
            />
          )}
        </div>
      ) : (
        <></>
      )}
      {!direct ? (
        <>
          <div className="flex flex-col justify-center items-center w-[850px]">
            <LabeledInput_UpperCase
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={"Loan Consultant FB Name/Profile"}
              fieldName="consultProfile"
              placeHolder="Consultant FB Name/Profile"
              category={"direct"}
              required={false}
              disabled={!getAppDetails.dataPrivacy}
              rendered={loanrendered}
            />
          </div>
          {GetData("ROLE") !== null ? (
            GetData("ROLE").toString() === "30" ||
              GetData("ROLE").toString() === "40" ? (
              <div className="flex flex-col justify-center items-center w-[850px] ">
                <SelectOpt
                  className_dmain={classname_main}
                  className_label={className_label}
                  className_dsub={className_dsub}
                  label={
                    <>
                      Select Branch
                      <span className="text-red-500">*</span>
                    </>
                  }
                  value={getAppDetails.loanBranch}
                  disabled={!getAppDetails.dataPrivacy}
                  placeHolder={"Please select..."}
                  required={true}
                  showSearch
                  notValidMsg={"This field is required."}
                  KeyName={"loanBranch"}
                  receive={(e) => {
                    updateAppDetails({
                      name: "loanBranch",
                      value: e,
                    });
                  }}
                  options={GET_BRANCH_LIST.map((item) => ({
                    value: item.code,
                    label: item.name,
                  }))}
                  rendered={loanrendered}
                />
              </div>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-[850px] ">
          {[10, 15, 6].includes(getAppDetails.hckfi) ? (
            <SelectOpt
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={
                <>
                  Select Branch
                  <span className="text-red-500">*</span>
                </>
              }
              value={getAppDetails.loanBranch}
              disabled={!getAppDetails.dataPrivacy}
              placeHolder={"Please select..."}
              required={true}
              showSearch
              notValidMsg={"This field is required."}
              KeyName={"loanBranch"}
              receive={(e) => {
                updateAppDetails({
                  name: "loanBranch",
                  value: e,
                });
              }}
              options={GET_BRANCH_LIST.map((item) => ({
                value: item.code,
                label: item.name,
              }))}
              rendered={loanrendered}
            />
          ) : (
            <></>
          )}

          {getAppDetails.hckfi === 14 ? (
            <SelectOpt
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={
                <>
                  Referred By <span className="text-red-500">*</span>
                </>
              }
              value={getAppDetails.loanReferredBy}
              disabled={!getAppDetails.dataPrivacy}
              placeHolder={"Please select..."}
              required={true}
              showSearch
              notValidMsg={"This field is required."}
              KeyName={"loanReferredBy"}
              receive={(e) => {
                updateAppDetails({
                  name: "loanReferredBy",
                  value: e,
                });
              }}
              options={ReferredBy()?.map((item) => ({
                value: item.value,
                label: item.label.toString(),
              }))}
              rendered={loanrendered}
            />
          ) : (
            <></>
          )}
          <div className="mt-[5%]"></div>
        </div>
      )}
    </div>
  );
}

export default LoanDetails;
