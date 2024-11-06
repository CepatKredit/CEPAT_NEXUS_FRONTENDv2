import * as React from 'react';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import LabeledInput from '@components/trackApplication/LabeledInput';
import LabeledSelect from '@components/trackApplication/LabeledSelect';
import LabeledInput_Salary from '@components/trackApplication/LabeledInput_Salary';
import LabeledSelect_Country from '@components/trackApplication/LabeledSelect_Country';
import DatePicker_BDate from '@components/trackApplication/DatePicker_BDate';
import AddressGroup_Component from '@components/trackApplication/AddressGroup_Component';
import SectionHeader from '@components/validation/SectionHeader';
import LabeledInput_Contact from '@components/trackApplication/LabeledInput_Contact';
import LabeledInput_Fullname from '@components/trackApplication/LabeledInput_UpperCase';
import LabeledInput_Numeric from '@components/trackApplication/LabeledInput_Numeric';
import LabeledSelect_Suffix from '@components/trackApplication/LabeledSelect_Suffix';
import LabeledSelect_ValidId from '@components/trackApplication/LabeledSelect_ValidId';
import LabeledCurrencyInput from '@components/trackApplication/LabeledCurrencyInput';
import { Suffix, MaritalStatus, Residences, Gender } from '@utils/FixedData';
import LabeledInput_Email from '@components/trackApplication/LabeledInput_Email';
import { Descriptions, Button, notification } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST, GetBranchCode, GetPurposeId, POST_DATA } from '@api/base-api/BaseApi';
import axios from 'axios';
import { mmddyy, ReturnText } from '@utils/Converter';
import { UpdateLoanDetails } from '@utils/LoanDetails';
import LabeledInput_OfwContact from '@components/trackApplication/LabeledInput_OfwContact';
import LabeledInput_NotRequired from '@components/trackApplication/LabeledInput_NotRequired';

function OfwDetails({ data, receive, presaddress, OldData }) {
    const [isEdit, setEdit] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();

    const { data: suffixOption } = useQuery({
        queryKey: ['getSuffix'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/GetSuffix');
            return result.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    const getCountrySelect  = useQuery({
        queryKey: ['getCountrySelect'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/getCountry');
            return result?.list?.map(x => ({ value: x.code, label: x.description })) || [];
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });
 
    const validIdDisplay = useQuery({
        queryKey: ['validIdDisplay'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/getIDtype');
            return result.list
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    React.useEffect(() => {
        validIdDisplay.refetch()
        getCountrySelect.refetch()
    }, [data])

    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.')
    }
    function formatToTwoDecimalPlaces(num) {
        if (!num) return '';
        return parseFloat(num).toFixed(2);
    }

    const items = [

        { key: '1', label: <span className="font-semibold text-black whitespace-nowrap">First Name</span>, children: data.ofwfname || '' },
        { key: '2', label: <span className="font-semibold text-black whitespace-nowrap">Middle Name</span>, children: data.ofwmname || '' },
        { key: '3', label: <span className="font-semibold text-black whitespace-nowrap">Last Name</span>, children: data.ofwlname || '' },
        { key: '4', label: <span className="font-semibold text-black whitespace-nowrap">Suffix</span>, children: suffixOption?.find(suffix => suffix.code === data.ofwsuffix)?.description || '' },
        { key: '5', label: <span className="font-semibold text-black whitespace-nowrap">Birthdate</span>, children: data.ofwbdate || '' },
        { key: '6', label: <span className="font-semibold text-black whitespace-nowrap">Gender</span>, children: Gender().find(gender => gender.value === data.ofwgender)?.label || '' },
        { key: '7', label: <span className="font-semibold text-black whitespace-nowrap">Mobile Number</span>, children: data?.ofwmobile.replace('/', ' ') || '' },
        { key: '8', label: <span className="font-semibold text-black whitespace-nowrap">Email Address</span>, children: data.ofwemail || '' },
        { key: '9', label: <span className="font-semibold text-black whitespace-nowrap">Dependents</span>, children: data.ofwdependents || '0' },
        { key: '10', label: <span className="font-semibold text-black whitespace-nowrap">Marital Status</span>, children: MaritalStatus().find(status => status.value === data.ofwmstatus)?.label || '' },
        { key: '11', label: <span className="font-semibold text-black whitespace-nowrap">Valid ID Type</span>, children: validIdDisplay.data?.find(x => x.id === data.ofwvalidid || x.name === data.ofwvalidid)?.name || '' },
        { key: '12', label: <span className="font-semibold text-black whitespace-nowrap">ID Number</span>, children: data.ofwidnumber || '' },
        { key: '13', label: <span className="font-semibold text-black whitespace-nowrap">Type Of Residences</span>, children: Residences().find(residence => residence.value === data.ofwresidences)?.label || '' },
        ...(data.ofwresidences === 3 ? [{
            key: '14',
            label: <span className="font-semibold text-black whitespace-nowrap">Rent Amount</span>,
            children: <p>{data.ofwrent ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.ofwrent)) : ''}</p>,
        }] : data.ofwresidences === 2 ? [{
            key: '14',
            label: <span className="font-semibold text-black whitespace-nowrap">Monthly Amortization</span>,
            children: <p>{data.ofwrent ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.ofwrent)) : ''}</p>,
        }] : []),
        { key: '15', label: <span className="font-semibold text-black whitespace-nowrap">Present Area/Province</span>, children: <p>{data.ofwPresProvname || ''}</p> },
        { key: '16', label: <span className="font-semibold text-black whitespace-nowrap">Present City/Municipality</span>, children: <p>{data.ofwPresMunicipalityname || ''}</p> },
        { key: '17', label: <span className="font-semibold text-black whitespace-nowrap">Present Barangay</span>, children: <p>{data.ofwPresBarangayname || ''}</p> },
        { key: '18', label: <span className="font-semibold text-black whitespace-nowrap">Present Street</span>, children: <p>{ReturnText(data.ofwPresStreet) || ''}</p> },
        { key: '19', label: <span className="font-semibold text-black whitespace-nowrap">Permanent Area/Province</span>, children: <p>{data.ofwPermProvname || ''}</p> },
        { key: '20', label: <span className="font-semibold text-black whitespace-nowrap">Permanent City/Municipality</span>, children: data.ofwPermMunicipalityname || '' },
        { key: '21', label: <span className="font-semibold text-black whitespace-nowrap">Permanent Barangay</span>, children: data.ofwPermBarangayname || '' },
        { key: '22', label: <span className="font-semibold text-black whitespace-nowrap">Permanent Street</span>, children: ReturnText(data.ofwPermStreet) || '' },
        { key: '23', label: <span className="font-semibold text-black whitespace-nowrap">Country of Employment</span>, 
        children: getCountrySelect.data?.find(country => country.value === data.ofwcountry || country.label === data.ofwcountry)?.label || '' },
        { key: '24', label: <span className="font-semibold text-black whitespace-nowrap">Job Title / Position</span>, children: data.ofwjobtitle || '' },
        { key: '25', label: <span className="font-semibold text-black w-[8rem]">Company/Employer /AgencyName</span>, children: data.ofwcompany || '' },
        { key: '26', label: (<span className="font-semibold text-black whitespace-nowrap">Salary</span>), children: data.ofwsalary ? formatNumberWithCommas(formatToTwoDecimalPlaces(data.ofwsalary)) : '' },
      ];
    

    const queryClient = useQueryClient()
    async function updateData() {

        let update = 0;
        if (OldData.FirstName !== data.ofwfname || OldData.LastName !== data.ofwlname ||
            parseInt(OldData.Suffix) !== parseInt(data.ofwsuffix) || OldData.Birthday !== data.ofwbdate) {
            update = 1;
        } else { update = 0 }

        if (update === 1) {
            const checkLoan = {
                FirstName: data.ofwfname,
                LastName: data.ofwlname,
                Suffix: parseInt(data.ofwsuffix),
                Birthday: data.ofwbdate,
            }

            var result = await POST_DATA('/checkLoan', checkLoan);
            if (result.list.length === 0) { update = 0; }
            else { update = 2; }
        }

        if (update === 0) {
           
            const value = {
                LoanAppId: data.loanIdCode,
                BorrowersCode: data.borrowersCode,
                Tab: 2,
                Product: data.loanProd,
                BranchId: parseInt(data.loanBranch),
                DepartureDate: mmddyy(data.loanDateDep),
                Purpose: data.loanPurpose,
                //LoanType: 1,
                Amount: parseFloat(data.loanAmount.replaceAll(',', '')),
                Terms: data.loanTerms,
                Channel: data.hckfi,
                Consultant: data.consultant,
                ConsultantNo: data.consultNumber,
                ConsultantProfile: data.consultProfile,
                ReferredBy: data.referredby ? parseInt(data.referredby) : 0,
                FirstName: data.ofwfname,
                MiddleName: data.ofwmname,
                LastName: data.ofwlname,
                Suffix: data.ofwsuffix,
                BirthDay: data.ofwbdate,
                Gender: data.ofwgender,
                CivilStatus: data.ofwmstatus,
                Dependent: data.ofwdependents,
                Email: data.ofwemail,
                MobileNo: data.ofwmobile,
                FBProfile: data.ofwfblink,
                Ownership: data.ofwresidences,
                RentAmount: parseFloat(data.ofwrent.replaceAll(',', '')),
                IsCurrPerm: data.ofwsameAddress,
                ProvinceId: data.ofwPresProv,
                MunicipalityId: data.ofwPresMunicipality,
                BarangayId: data.ofwPresBarangay,
                Address1: data.ofwPresStreet,
                PerProvinceId: data.ofwPermProv,
                PerMunicipalityId: data.ofwPermMunicipality,
                PerBarangayId: data.ofwPermBarangay,
                PerAddress1: data.ofwPermStreet,
                ValidId: data.ofwvalidid,
                ValidIdNo: data.ofwidnumber,
                Country: data.ofwcountry,
                JobTitle: data.ofwjobtitle,
                Employer: data.ofwcompany,
                Salary: parseFloat(data.ofwsalary.replaceAll(',', '')),
                ModUser: data.borrowersCode,
            }
            console.log('testtset',value)
            let result = await UpdateLoanDetails(value);
            if(result.data.status==="success"){
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                queryClient.invalidateQueries({ queryKey: ['ClientDataQuery'] }, { exact: true })
                setEdit(!isEdit);
            }else{
                api['warning']({
                    message: 'Error: Failed to Update' ,
                    description: "Fail Connection",
                });
            }
        }
    
        else {
            api['info']({
                message: 'Loan Already Exists',
                description: `Please be advised that you have an ongoing application with Cepat Kredit ${result.list[0].branch} branch with Loan Application No. 
                ${result.list[0].loanAppCode}. For further concerns, please email our Customer Service Department at customerservice@cepatkredit.com. Thank you!`
            })
        }
    }

    return (<>
        {contextHolder}
        {
            isEdit
                ?
                (<div className="h-full">
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
                            <LabeledInput_Fullname
                                className_dmain="w-full h-[3.5rem]"
                                className_label="font-bold"
                                label="First Name"
                                value={data.ofwfname}
                                placeHolder="First Name"
                                receive={(e) => receive({ name: 'ofwfname', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_NotRequired
                                className_dmain="w-full h-[3.5rem]"
                                className_label="font-bold"
                                label="Middle Name"
                                value={data.ofwmname}
                                placeHolder="Middle Name"
                                receive={(e) => receive({ name: 'ofwmname', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_Fullname
                                className_dmain="w-full h-[3.5rem]"
                                className_label="font-bold"
                                label="Last Name"
                                value={data.ofwlname}
                                placeHolder="Last Name"
                                receive={(e) => receive({ name: 'ofwlname', value: e })}
                                category="marketing"
                            />
                            <LabeledSelect_Suffix
                                className_dmain="w-full h-[3.5rem]"
                                className_label="font-bold"
                                label="Suffix"
                                placeHolder="Please Select"
                                value={data.ofwsuffix}
                                receive={(e) => receive({ name: 'ofwsuffix', value: e })}
                                category="marketing"
                            />
                            <DatePicker_BDate
                                className_dmain="w-full h-[3.5rem] mt-3"
                                className_label="font-bold"
                                label="Birthdate"
                                placeHolder="Birthdate"
                                receive={(e) => receive({ name: 'ofwbdate', value: e })}
                                value={data.ofwbdate}
                                category="marketing"
                            />
                            <LabeledSelect
                                className_dmain="w-full h-[3.5rem] mt-3"
                                className_label="font-bold"
                                label="Gender"
                                placeHolder="Please Select"
                                value={data.ofwgender}
                                data={Gender()}
                                receive={(e) => receive({ name: 'ofwgender', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_OfwContact
                                className_dmain="w-full h-[3.5rem] mt-3"
                                className_label="font-bold"
                                label="Mobile Number"
                                placeHolder="Mobile Number"
                                value={data.ofwmobile}
                                receive={(e) => receive({ name: 'ofwmobile', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_Email
                                className_dmain="w-full h-[3.5rem] mt-3"
                                className_label="font-bold"
                                label="Email Address"
                                placeHolder="Email Address"
                                value={data.ofwemail}
                                receive={(e) => receive({ name: 'ofwemail', value: e })}
                                category="marketing"
                            />
                            <LabeledInput_Numeric
                                className_dmain="w-full h-[3.5rem] mt-5"
                                className_label="font-bold"
                                className_dsub=""
                                label="Dependents"
                                value={data.ofwdependents}
                                receive={(e) => receive({ name: 'ofwdependents', value: e })}
                                category="marketing"
                                digits={2}
                                placeHolder="No. of Dependents"
                            />
                            <LabeledSelect
                                className_dmain="w-full h-[3.5rem] mt-5"
                                className_label="font-bold"
                                label="Marital Status"
                                placeHolder="Marital Status"
                                value={data.ofwmstatus}
                                data={MaritalStatus()}
                                receive={(e) => receive({ name: 'ofwmstatus', value: e })}
                                category="marketing"
                            />
                            <LabeledSelect
                                className_dmain="w-full h-[3.5rem] mt-5"
                                className_label={'font-bold'}
                                label={'Type of Residences'}
                                placeHolder='Type of Residences'
                                value={data.ofwresidences}
                                receive={(e) => receive({ name: 'ofwresidences', value: e })}
                                data={Residences()}
                                category={'marketing'}
                            />
                             {data.ofwresidences === 3 || data.ofwresidences === 2 ? (
                                <LabeledCurrencyInput
                                    className_dmain={'mt-5 w-[300px] h-[62px]'}
                                    className_label={'font-bold'}
                                    label={data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                                    value={data.ofwrent}
                                    receive={(e) => { receive({ name: 'ofwrent', value: e }) }}
                                    category={'marketing'}
                                    placeHolder={data.ofwresidences === 3 ? 'Rent Amount' : 'Monthly Amortization'}
                                />
                            ) : null}
                        </div>
                        <SectionHeader title="Present Address" />
                            <AddressGroup_Component
                                data={data}
                                receive={(e) => receive(e)}
                                presaddress={(e) => presaddress(e)}
                                type="present"
                                disabled={!isEdit}
                                className_dsub="w-full h-[3.5rem]"
                                category="marketing"
                                className_dmain="mt-[1.25rem] w-full h-[3.875rem] sm:w-[12rem] md:w-[14rem] lg:w-[15rem] xl:w-[16rem]"
                                className_label="font-bold"
                                vertical_algin={true}
                            />

                        <SectionHeader title="Permanent Address" />
                            <AddressGroup_Component
                                data={data}
                                receive={(e) => receive(e)}
                                presaddress={(e) => presaddress(e)}
                                type="permanent"
                                disabled={!isEdit}
                                className_dsub="w-full h-[3.5rem]"
                                category="marketing"
                                className_dmain="mt-[1.25rem] w-full h-[3.875rem] sm:w-[12rem] md:w-[14rem] lg:w-[15rem] xl:w-[16rem]"
                                className_label="font-bold"
                                vertical_algin={true}
                            />
                        {/* <SectionHeader title="Provincial Address" />
                            <AddressGroup_Component
                                data={data}
                                receive={(e) => receive(e)}
                                presaddress={(e) => presaddress(e)}
                                type="provincial"
                                disabled={isEdit}
                                category="marketing"
                                className_dmain="w-full h-[3.5rem]"
                                className_label="font-bold"
                                vertical_algin={true}
                            />*/}
                        <SectionHeader title="Presented ID" />
                        <div className="flex justify-center w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[80%] lg:w-[50%]">
                                <LabeledSelect_ValidId
                                    className_dmain="w-full h-[3.5rem]"
                                    className_label="font-bold"
                                    label="Valid ID Type"
                                    placeHolder="Valid ID Type"
                                    value={data.ofwvalidid}
                                    receive={(e) => receive({ name: 'ofwvalidid', value: e })}
                                    category="marketing"
                                />
                                <LabeledInput
                                    className_dmain="w-full h-[3.5rem]"
                                    className_label="font-bold"
                                    label="ID Number"
                                    placeHolder="ID Type Number"
                                    receive={(e) => receive({ name: 'ofwidnumber', value: e })}
                                    value={data.ofwidnumber}
                                    category="marketing"
                                />
                            </div>
                        </div>
                        {/* Employment Details Section */}
                        <SectionHeader title="Employment Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                            <LabeledSelect_Country
                                className_dmain="w-full h-[3rem]"
                                className_label="font-bold text-xs leading-tight"
                                label="Country of Employment for OFW or Joining Port for SEAFARER"
                                placeHolder="Country"
                                category="marketing"
                                value={data.ofwcountry}
                                receive={(e) => receive({ name: 'ofwcountry', value: e })}
                            />
                            <LabeledInput
                                className_dmain="w-full h-[3rem] mt-6"
                                className_label="font-bold"
                                label="Job Title / Position"
                                category='direct'
                                value={data.ofwjobtitle}
                                receive={(e) => {
                                    receive({
                                        name: 'ofwjobtitle',
                                        value: e
                                    });
                                }}
                                disabled={(data.loanProd==="0303-DH" || data.loanProd==="0303-DHW") && data.ofwjobtitle==="DOMESTIC HELPER"}
                                placeHolder='Job Title/Position'
                            />
                            <LabeledInput
                                className_dmain="w-full h-[3rem] mt-6"
                                className_label="font-bold text-xs leading-tight"
                                label="Company/ Employer / Agency Name"
                                placeHolder="Company/ Employer / Agency Name"
                                category="marketing"
                                value={data.ofwcompany}
                                receive={(e) => receive({ name: 'ofwcompany', value: e })}
                            />
                            <LabeledInput_Salary
                                className_dmain="w-full h-[3rem] mt-6"
                                className_label="font-bold"
                                label="Salary"
                                placeHolder="Salary"
                                value={data.ofwsalary}
                                receive={(e) => receive({ name: 'ofwsalary', value: e })}
                                category="direct"
                            />
                            </div>
                      </div>
                      </div>)
                : (<>
                <Descriptions className="mt-6" column={{ md: 2, lg: 3, xl: 4 }} items={items} />
                </>)
        }
        <div className="flex justify-center space-x-10 mb-2 mt-6">
            {isEdit ? (
                <>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => { updateData() }}  >
                        Save
                    </Button>

                    <Button
                        type="default"
                        onClick={() => { setEdit(!isEdit) }}
                    >
                        Cancel
                    </Button>
                </>
            ) : (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => { setEdit(!isEdit) }}
                    disabled={data.loanStatus !== 'RECEIVED'}
                >
                    Edit
                </Button>
            )}
        </div>
    </>
    );
}

export default OfwDetails;