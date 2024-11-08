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

function LoanDetails({
  loanrendered,
  setloanrendered,
  direct
}) {

  const { getAppDetails, updateAppDetails } = React.useContext(
    LoanApplicationContext
  );
  const [readMore, setReadMore] = React.useState(false);

  // const [loanStates, setLoanStates] = React.useState({
  //   validDDate: loanrendered,
  //   consulant: loanrendered,
  //   consulNo: loanrendered,
  //   branch: loanrendered,
  //   referred: loanrendered,
  // });
  // const { validDDate, consulant, consulNo, branch, referred } = loanStates;

  const classname_main =
    "flex flex-col sm:flex-row mt-2 w-full sm:w-[500px] h-auto sm:h-[60px]";
  const className_label = "mb-2 sm:mb-0 sm:mr-4 w-full sm:w-[200px]";
  const className_dsub = "w-full sm:w-[400px]";

  React.useEffect(() => {
    setloanrendered(true);
  }, [setloanrendered]);

  const disableDate_deployment = React.useCallback((current) => {
    // Disable past dates including today
    return current && current < dayjs().startOf("day");
  }, []);

  return (
    <div className="flex flex-col justify-center mt-[2rem]">
      <div className="flex flex-rows">
        <Checkbox
          name="chkBox_DataPrivacy"
          className="h-[10%]"
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
      <div className="flex flex-col justify-center items-center w-[850px]">
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
        <LabeledSelectLoanProduct
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Select Loan Product <span className="text-red-500">*</span></>}
          category={"direct"}
          placeHolder="Loan Product"
          disabled={!getAppDetails.dataPrivacy}
          rendered={loanrendered}
          showSearch
        />
        {getAppDetails.loanProd === "0303-DHW" ||
        getAppDetails.loanProd === "0303-VL" ||
        getAppDetails.loanProd === "0303-WL" ? (
          <DatePicker_Deployment
            className_dmain={classname_main}
            className_label={className_label}
            className_dsub={className_dsub}
            label={<>OFW Departure Date <span className="text-red-500">*</span></>}
            disabled={false || !getAppDetails.dataPrivacy}
            category={"direct"}
            placeHolder={"MM-DD-YYYY"}
            disabledate={disableDate_deployment}
            rendered={loanrendered}
          />
        ) : (
          <></>
        )}
        <LabeledSelectLoanPurpose
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Select Loan Purpose <span className="text-red-500">*</span></>}
          category={"direct"}
          placeHolder={"Loan Purpose"}
          disabled={!getAppDetails.dataPrivacy}
          rendered={loanrendered}
          showSearch
        />
        <LabeledCurrencyInput
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Loan Amount <span className="text-red-500">*</span></>}
          fieldName="loanAmount"
          category={"direct"}
          placeHolder={"Loan Amount"}
          disabled={!getAppDetails.dataPrivacy}
          rendered={loanrendered}
        />
        <LabeledSelect
          className_dmain={classname_main}
          className_label={className_label}
          className_dsub={className_dsub}
          label={<>Loan Terms (in Months) <span className="text-red-500">*</span></>}
          fieldName="loanTerms"
          data={LoanTerms(12)}
          placeHolder={"Loan Terms"}
          category={"direct"}
          disabled={!getAppDetails.dataPrivacy}
          rendered={loanrendered}
        />
        {!direct ? (
          null
        ) : (
          <LabeledSelect
            className_dmain={classname_main}
            className_label={className_label}
            className_dsub={className_dsub}
            label={<>How did you know about Cepat Kredit Financing? <span className="text-red-500">*</span></>}
            fieldName="hckfi"
            data={Hckfi()}
            category={"direct"}
            placeHolder={"Please select..."}
            disabled={!getAppDetails.dataPrivacy}
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
                label={<>Loan Consultant Name<span className="text-red-500">*</span></>}
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
              label={<>Loan Consultant Name <span className="text-red-500">*</span></>}
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
              label={<>Loan Consultant Number <span className="text-red-500">*</span></>}
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
              <div className="flex flex-col justify-center items-center w-[850px]">
                <LabeledSelect_BranchMarketing
                  className_dmain={classname_main}
                  className_label={className_label}
                  className_dsub={className_dsub}
                  label={<>Select Branch <span className="text-red-500">*</span></>}
                  // value={getAppDetails.loanBranch}
                  // placeHolder={"Branch"}
                  // receive={(e) => {
                  //   receive({
                  //     name: "loanBranch",
                  //     value: e,
                  //   });
                  // }}
                  category={"direct"}
                  showSearch={true}
                  disabled={!getAppDetails.dataPrivacy}
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
        <div className="flex flex-col justify-center items-center w-[850px] mt-[3%]">
          {[10, 15, 6].includes(getAppDetails.hckfi) ? (
            <LabeledSelect_Branch
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={<>Select Branch <span className="text-red-500">*</span></>}
              // value={getAppDetails.loanBranch}
              placeHolder={"Branch"}
              // receive={(e) => {
              //   receive({
              //     name: "loanBranch",
              //     value: e,
              //   });
              // }}
              category={"direct"}
              showSearch={true}
              mod={
                [16, 1, 3, 2, 4, 11, 12, 13, 8, 5, 14].includes(
                  getAppDetails.hckfi
                )
                  ? true
                  : false
              } //include fb in the list to auto select
              disabled={!getAppDetails.dataPrivacy}
              rendered={loanrendered}
            />
          ) : (
            <></>
          )}

          {getAppDetails.hckfi === 14 ? (
            <LabeledSelect
              className_dmain={classname_main}
              className_label={className_label}
              className_dsub={className_dsub}
              label={<>Referred By <span className="text-red-500">*</span></>}
              data={ReferredBy()}
              showSearch={true}
              fieldName="loanReferredBy"
              category={"direct"}
              placeHolder={"Please Select..."}
              disabled={!getAppDetails.dataPrivacy}
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
