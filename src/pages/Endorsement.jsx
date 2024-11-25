import * as React from "react";
import { Steps, Typography, Button, notification, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import LoanDetails from "@containers/loanApplication/LoanDetails";
import OfwDetails from "@containers/loanApplication/OfwDetails";
import levenshtein from "fast-levenshtein";
import { jwtDecode } from "jwt-decode";
import Modal_Result from "@components/loanApplication/Modal_Result";
import { POST_DATA } from "@api/base-api/BaseApi";
import { v4 as uuidv4 } from "uuid";
import { ChangeText, toUpperText } from "@utils/Converter";
import { mmddyy } from "@utils/Converter";
import { toDecrypt } from "@utils/Converter";
import { GetData } from "@utils/UserData";
import { isValidLoanDetails, isValidLoanDetailsLc, isValidOFWDetails, isValidOFWDetailsLc } from "@utils/Validations";
import { LoanApplicationContext } from "@context/LoanApplicationContext";
import { useDirectLoan } from "@hooks/LoanApplicationHooks";

function Endorsement() {
    const direct = false // Control if it is direct / lc / marketing
    const { getAppDetails, resetAppDetails } = React.useContext(LoanApplicationContext);
    document.title = "Loan Application Form";
    const USRNAME = toDecrypt(localStorage.getItem("USRFN"));
    const token = localStorage.getItem("UTK");
    const { Title } = Typography;
    const [loanrendered, setloanrendered] = React.useState(false);
    const [ofwrendered, setofwrendered] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [getLoanDetail, setLoanDetail] = React.useState();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [confirm, setconfirm] = React.useState(true);
    const [loadings, setLoadings] = React.useState(false);
    const [getDetails, setDetails] = React.useState();
    const { directLoan } = useDirectLoan(setDetails, setLoadings, setIsModalOpen);

    const lc_loandetails =
        !getAppDetails.dataPrivacy ||  !isValidLoanDetailsLc(getAppDetails);

    const lc_ofwdetails =  !isValidOFWDetailsLc(getAppDetails);

    React.useEffect(() => {
        if (!getAppDetails.dataPrivacy) {
          resetAppDetails();
        }
      }, [getAppDetails.dataPrivacy]);

      console.log("ENDORSEMENT", getAppDetails)

    async function insertDirect() {

        directLoan(direct);
/*
        const data_lc = {
            LoanAppId: toUpperText(uuidv4()),
            Dpa: getAppDetails.dataPrivacy ? 1 : 0,
            LoanType: getAppDetails.loanRenewal ? 2 : 1,
            Product: getAppDetails.loanProd,
            DepartureDate: getAppDetails.loanDateDep ? mmddyy(getAppDetails.loanDateDep) : '', //moment
            Purpose: parseInt(getAppDetails.loanPurpose),
            Amount: parseFloat(getAppDetails.loanAmount.replaceAll(',', '')),
            Terms: parseInt(getAppDetails.loanTerms),
            Consultant: getAppDetails.consultName, //Add JWT lc user id,
            ConsultantNo: getAppDetails.consultNumber,
            ConsultantProfile: ChangeText('TEST'), //AUTO POPULATE COSULTANT
            RecUser: jwtDecode(token).USRID,
            Branch: 11, //Asign to Facebook Branch //Add JWT lc user branch id
            //ofw
            FirstName: getAppDetails.ofwfname,
            MiddleName: getAppDetails.ofwmname,
            LastName: getAppDetails.ofwlname,
            Suffix: parseInt(getAppDetails.ofwsuffix),
            Birthday: mmddyy(getAppDetails.ofwbdate),
            Gender: getAppDetails.ofwgender,
            CivilStatus: getAppDetails.ofwmstatus,
            Dependent: parseInt(getAppDetails.ofwdependents),
            Email: getAppDetails.ofwemail,
            MobileNo: getAppDetails.ofwmobile,
            FbProfile: ChangeText(getAppDetails.ofwfblink),
            Ownership: parseInt(getAppDetails.ofwresidences),
            RentAmount: getAppDetails.rentAmount ? parseFloat(getAppDetails.rentAmount.replaceAll(',', '')) : 0,

            ProcinceId: getAppDetails.ofwPresProv,
            MunicipalityId: getAppDetails.ofwPresMunicipality,
            BarangyId: getAppDetails.ofwPresBarangay,
            Address1: ChangeText(getAppDetails.ofwPresStreet),
            CountryId: '',
            Salary: getAppDetails.ofwsalary ? parseFloat(getAppDetails.ofwsalary.replaceAll(',', '')) : 0,
            Status: 29, //For Screening
        }
        console.log(data_lc)
        setDetails(data_lc)
        setLoadings(true)
        setIsModalOpen(true)
*/
    }
    function cancelModal() {
        setIsModalOpen(false);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
        <Modal_Result
            showModal={isModalOpen}
            closeModal={closeModal}
            closable={false}
            getLoanDetail={getLoanDetail}
            setLoanDetail={setLoanDetail}
            confirm={confirm}
            cancelModal={cancelModal}
            loading={loadings}
            direct={direct}
            code={getDetails}
        />
        <div className="h-[67vh] xs:h-[50vh] 2xl:h-[67vh] overflow-y-auto">
            <div className="flex items-center justify-center mx-auto ">
            <div className="flex flex-col items-center justify-center mx-auto mt-[2%]">
                <div className="flex items-center justify-center w-[80vw] ">
                <LoanDetails
                    loanrendered={loanrendered}
                    setloanrendered={setloanrendered}
                    direct={direct}
                />
                </div>
                <div className="flex items-center justify-center">
                <OfwDetails
                    ofwrendered={ofwrendered}
                    setofwrendered={setofwrendered}
                    direct={direct}
                />
                </div>
            </div>
            </div>
        </div>
        <div className="flex items-center justify-center">
            <div className="flex mt-[1rem] flex-row">
            <ConfigProvider theme={{ token: { colorPrimary: "#6B73C1" } }}>
                <Button
                size="large"
                onClick={() => insertDirect()}
                className="bg-[#31b235]"
                type="primary"
                disabled={ lc_ofwdetails || lc_loandetails }
                >
                Apply Loan
                </Button>
            </ConfigProvider>
            </div>
        </div>
        </>
    );
    }
    export default Endorsement;
