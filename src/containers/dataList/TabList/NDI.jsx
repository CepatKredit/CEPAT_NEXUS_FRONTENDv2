import OFW from '@components/ndi/OFW'
import Borrower from '@components/ndi/Borrower'
import ACB from '@components/ndi/ACB'
import * as React from 'react'
import { Space, Input, Button, notification, ConfigProvider, Anchor, Spin } from 'antd'
import { GrandTotal, Validation } from '@hooks/NDIController'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { mmddyy } from '@utils/Converter'
import dayjs from 'dayjs'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import StatusRemarks from './StatusRemarks'
import { ApplicationStatus } from '@hooks/ApplicationStatusController'
import { GetData } from '@utils/UserData';

function NDI({ event, data, isReadOnly, User, activeKey, sepcoborrowfname }) {
    const [loading, setLoading] = React.useState(true);
    const onLoadingChange = (value) => {
        setLoading(value);
    }
    const [isEdit, setEdit] = React.useState(false);
    const [childValues, setChildValues] = React.useState({});
    const [getMisc, setMisc] = React.useState({});
    const [expenses, setExpenses] = React.useState({});
    const [income, setIncome] = React.useState({});
    const [incomeInitial, setIncomeInitial] = React.useState({});
    const [expenseInitial, setExpenseInitial] = React.useState({});
    const [api, contextHolder] = notification.useNotification();
    const token = localStorage.getItem('UTK')
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    function DISABLE_STATUS(LOCATION) {
        if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
            {
                if (LOCATION === '/ckfi/for-approval' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('CRA')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '70') {
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined' || LOCATION === '/ckfi/approved'
                || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/returned/credit-officer'
                || LOCATION === '/ckfi/reassessed/credit-officer'  || LOCATION === '/ckfi/undecided') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            console.log('LPO')
            if (LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined' || LOCATION === '/ckfi/approved'
                || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/returned/credit-officer'
                || LOCATION === '/ckfi/reassessed/credit-officer'  || LOCATION === '/ckfi/undecided') { return true }
            else { return false }
        }
        else { return false }
    }

    const InitialOtherIncome = (key, getValue) => {
        setIncomeInitial((prevValues) => ({
            ...prevValues,
            [key]: getValue, // Update the specific child's value
        }));
    };
    const ExpenseOtherIncome = (key, getValue) => {
        setExpenseInitial((prevValues) => ({
            ...prevValues,
            [key]: getValue, // Update the specific child's value
        }));
    };
    const handleValueChange = (key, getValue) => {
        // if (isReadOnly) return;
        setChildValues((prevValues) => ({
            ...prevValues,
            [key]: getValue, // Update the specific child's value
        }));
    };
    const handleMisc = (k, get) => {
        setMisc((prev) => ({
            ...prev,
            [k]: get,
        }))
    }
    const handleIncomeChange = (key, getValue) => {
        //  if (isReadOnly) return;
        setIncome((prevValues) => ({
            ...prevValues,
            [key]: getValue, // Update the specific child's value
        }));
    };
    const handleExpenseChange = (key, getValue) => {
        setExpenses((prevValues) => ({
            ...prevValues,
            [key]: getValue, // Update the specific child's value
        }));
    };

    const { OFWValue, BENEValue, ACBValue,
        OFWValueDOC, BENEValueDOC, ACBValueDOC,
    } = GrandTotal()

    const { Counter } = Validation()

    function formatNumberWithCommas(num) {
        if (!num) return '';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    const onClickSaveNDI = useMutation({
        mutationFn: async () => {
            let dat = [];
            let del_dat = [];
            let lower = false;
            console.clear();
            const items = sepcoborrowfname ? 3 : 2;
            for (let i = 1; i <= items; i++) { //Ofw,ben,add
                NdiItemList(i).forEach((Listno, index) => {
                    if ([23, 44, 64].includes(Listno.listno)) {
                        console.log('Checking...', i, getMisc[i])
                    }
                    if ((([23, 44, 64].includes(Listno.listno)) && !getMisc[i])) {
                        console.log('EXEC...', i, getMisc[i], Listno.values.documented)
                        dat.push({
                            "BorrowersCode": data.ofwBorrowersCode,
                            "Type": i,
                            "ListNo": Listno.listno,
                            "Documented": parseFloat('0.00').toFixed(2),
                            "Declared": parseFloat('0.00').toFixed(2),
                            "LoggedUser": jwtDecode(token).USRID,
                            "LoggedDate": mmddyy(dayjs())
                        });
                    } else if (!([23, 44, 64].includes(Listno.listno)) || (([23, 44, 64].includes(Listno.listno)) && getMisc[i])) { //Skip Miscellaneous if not check
                        dat.push({
                            "BorrowersCode": data.ofwBorrowersCode,
                            "Type": i,
                            "ListNo": Listno.listno,
                            "Documented": parseFloat(Listno.values.documented.toString().replaceAll(',', '')).toFixed(2),
                            "Declared": parseFloat(Listno.values.declared.toString().replaceAll(',', '')).toFixed(2),
                            "LoggedUser": jwtDecode(token).USRID,
                            "LoggedDate": mmddyy(dayjs())
                        });
                    }
                });
                const processEntries = (entries, type) => {
                    entries.forEach(x => {
                        dat.push({
                            "BorrowersCode": data.ofwBorrowersCode,
                            "Type": type,
                            "ListNo": x.id,
                            "Documented": parseFloat(x.documented.toString().replaceAll(',', '')).toFixed(2),
                            "Declared": parseFloat(x.declared.toString().replaceAll(',', '')).toFixed(2),
                            "LoggedUser": jwtDecode(token).USRID,
                            "LoggedDate": mmddyy(dayjs())
                        });
                    });
                };
                [income[i], expenses[i]].forEach((entries, index) => {
                    entries.forEach((subEntries, subIndex) => {
                        if (!(['documented', 'declared'].some(key => parseFloat((subEntries[key] || '0').replaceAll(',', '')) >= 100))) {
                            api['warning']({
                                message: 'The update has been cancelled',
                                description: 'Other Expense/Income must not be lower than 100.00',
                            });
                            lower = true;
                            return;
                        }
                    })
                    const haveAnArray = deleteNotInList(i, entries, (index === 0 ? incomeInitial[i] : expenseInitial[i]))
                    if (haveAnArray != null) del_dat = [...del_dat, ...haveAnArray];
                    processEntries(entries, i);
                });
                if (lower) return;
            }
            if (lower) return;
            console.log("Rows to Update", dat)
            console.log("Rows to Delete", del_dat)
            try {
                const [updateRNdi, deleteRNdi] = await Promise.all([
                    axios.post('/updateNDI', dat),
                    axios.post('/deleteNDI', del_dat),
                ]);
                if (updateRNdi.data.status !== 'success' || (Object.keys(del_dat).length !== 0 && deleteRNdi.data.status !== 'success')) {
                    api['warning']({
                        message: 'Failed to Update',
                        description: 'The record was not update.',
                    });
                } else {
                    api['success']({
                        message: 'Successfully Updated',
                        description: 'The record has been updated.',
                    });
                }
            } catch (Error) {
                console.log(Error);
            }
            queryClient.invalidateQueries({ queryKey: ['NdiDataQueryOfw'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['NdiDataQueryAcb'] }, { exact: true })
            queryClient.invalidateQueries({ queryKey: ['NdiDataQueryBorrower'] }, { exact: true })
        }
    })

    async function SaveNdi() {
        onClickSaveNDI.mutate();

    }
    function deleteNotInList(i, compare, remove = []) {
        const filteredList = remove.filter(removeRow => !compare.some(compareRow => removeRow.id === compareRow.id));
        const temp_del = [];
        if (filteredList.length > 0) {
            filteredList.forEach(x => {
                temp_del.push({
                    "LoanAppId": data.loanIdCode,
                    "Type": i,
                    "ListNo": x.id
                });
            });
            return temp_del;
        } else {
            return null;
        }
    }
    function NdiItemList(item) {
        let ofw_ListNo = [
            {
                listno: 1,
                values: {
                    documented: childValues[item].TotalSalaryDoc || '0',
                    declared: childValues[item].TotalSalary || '0',
                }
            },
            {
                listno: 20,
                values: {
                    documented: childValues[item].RemittanceToPHDoc || '0',
                    declared: childValues[item].RemittanceToPH || '0',
                }
            },
            {
                listno: 21,
                values: {
                    documented: childValues[item].MonthlyFoodDoc || '0',
                    declared: childValues[item].MonthlyFood || '0',
                }
            },
            {
                listno: 22,
                values: {
                    documented: childValues[item].MonthlyRentDoc || '0',
                    declared: childValues[item].MonthlyRent || '0',
                }
            },
            {
                listno: 23,
                values: {
                    documented: childValues[item].MiscExpenseDoc || '0',
                    declared: childValues[item].MiscExpense || '0',
                }
            }
        ];
        let ben_ListNo = [
            {
                listno: 30,
                values: {
                    documented: childValues[item].AveRemittanceDoc || '0',
                    declared: childValues[item].AveRemittance || '0',
                }
            },
            {
                listno: 31,
                values: {
                    documented: childValues[item].IncomeEmployedHouseholdDoc || '0',
                    declared: childValues[item].IncomeEmployedHousehold || '0',
                }
            },
            {
                listno: 32,
                values: {
                    documented: childValues[item].SalaryDoc || '0',
                    declared: childValues[item].Salary || '0',
                }
            },
            {
                listno: 40,
                values: {
                    documented: childValues[item].MonthlyFoodDoc || '0',
                    declared: childValues[item].MonthlyFood || '0',
                }
            },
            {
                listno: 41,
                values: {
                    documented: childValues[item].MARDoc || '0',
                    declared: childValues[item].MAR || '0',
                }
            },
            {
                listno: 42,
                values: {
                    documented: childValues[item].UtilitiesDoc || '0',
                    declared: childValues[item].Utilities || '0',
                }
            },
            {
                listno: 43,
                values: {
                    documented: childValues[item].TuitionDoc || '0',
                    declared: childValues[item].Tuition || '0',
                }
            },
            {
                listno: 44,
                values: {
                    documented: childValues[item].MiscExpenseDoc || '0',
                    declared: childValues[item].MiscExpense || '0',
                }
            }
        ];
        let add_ListNo = [
            {
                listno: 50,
                values: {
                    documented: childValues[item].AveRemittanceDoc || '0',
                    declared: childValues[item].AveRemittance || '0',
                }
            },
            {
                listno: 51,
                values: {
                    documented: childValues[item].IncomeEmployedHouseholdDoc || '0',
                    declared: childValues[item].IncomeEmployedHousehold || '0',
                }
            },
            {
                listno: 52,
                values: {
                    documented: childValues[item].SalaryDoc || '0',
                    declared: childValues[item].Salary || '0',
                }
            },
            {
                listno: 60,
                values: {
                    documented: childValues[item].MonthlyFoodDoc || '0',
                    declared: childValues[item].MonthlyFood || '0',
                }
            },
            {
                listno: 61,
                values: {
                    documented: childValues[item].MARDoc || '0',
                    declared: childValues[item].MAR || '0',
                }
            },
            {
                listno: 62,
                values: {
                    documented: childValues[item].UtilitiesDoc || '0',
                    declared: childValues[item].Utilities || '0',
                }
            },
            {
                listno: 63,
                values: {
                    documented: childValues[item].TuitionDoc || '0',
                    declared: childValues[item].Tuition || '0',
                }
            },
            {
                listno: 64,
                values: {
                    documented: childValues[item].MiscExpenseDoc || '0',
                    declared: childValues[item].MiscExpense || '0',
                }
            }
        ];

        return item === 1 ? ofw_ListNo
            : item === 2 ? ben_ListNo
                : item === 3 ? add_ListNo
                    : null;
    }



    return (
        <>
            {contextHolder}
            <div className="w-full flex flex-col">
                <StatusRemarks isEdit={!isEdit} User={User} data={data} />
                <div className="flex flex-row mt-4">
                    <div
                        id="scrollable-container"
                        className="h-[58vh] xs:h-[40vh] sm:h-[40vh] md:h-[40vh] lg:h-[43vh] xl:h-[45vh] 2xl:h-[47vh] 3xl:h-[56vh] w-full mb-8 overflow-y-auto px-4 mx-2"
                    >
                        <div className="w-full">
                            {data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL' ? (
                                <>
                                    <div id="OFW-NDI">
                                        <OFW
                                            principal="Principal Borrower"
                                            onLoadingChange={onLoadingChange}
                                            key={1}
                                            onValueChange={handleValueChange}
                                            onOtherIncome={handleIncomeChange}
                                            onOtherExpense={handleExpenseChange}
                                            data={data}
                                            InitialOtherIncome={InitialOtherIncome}
                                            InitialOtherExpense={ExpenseOtherIncome}
                                        />
                                    </div>
                                    <div id="BORROWER-NDI">
                                        <Borrower
                                            principal="Co-Borrower"
                                            key={2}
                                            onValueChange={handleValueChange}
                                            onOtherIncome={handleIncomeChange}
                                            onOtherExpense={handleExpenseChange}
                                            data={data}
                                            InitialOtherIncome={InitialOtherIncome}
                                            InitialOtherExpense={ExpenseOtherIncome}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div id="OFW-NDI">
                                        <Borrower
                                            principal="Principal Borrower"
                                            key={2}
                                            onValueChange={handleValueChange}
                                            onOtherIncome={handleIncomeChange}
                                            onOtherExpense={handleExpenseChange}
                                            data={data}
                                            InitialOtherIncome={InitialOtherIncome}
                                            InitialOtherExpense={ExpenseOtherIncome}
                                        />
                                    </div>
                                    <div id="BORROWER-NDI">
                                        <OFW
                                            principal="Co-Borrower"
                                            key={1}
                                            onValueChange={handleValueChange}
                                            onOtherIncome={handleIncomeChange}
                                            onOtherExpense={handleExpenseChange}
                                            data={data}
                                            InitialOtherIncome={InitialOtherIncome}
                                            InitialOtherExpense={ExpenseOtherIncome}
                                        />
                                    </div>
                                </>
                            )}
                            {!!sepcoborrowfname && (
                                <div id="ACB-NDI" className="w-full">
                                    <ACB
                                        activeKey={activeKey}
                                        key={3}
                                        onValueChange={handleValueChange}
                                        onOtherIncome={handleIncomeChange}
                                        onOtherExpense={handleExpenseChange}
                                        data={data}
                                        InitialOtherIncome={InitialOtherIncome}
                                        InitialOtherExpense={ExpenseOtherIncome}
                                    />
                                </div>
                            )}
                            <div className="flex justify-center items-center pt-4">
                                <div className="flex flex-col justify-center items-center w-[60vw]">
                                    <Space>
                                        <div className="w-[15rem] font-bold">Grand Total</div>
                                        <div className="w-[15rem]">
                                            <Input
                                                className={(parseFloat(OFWValueDOC) + parseFloat(BENEValueDOC) + parseFloat(ACBValueDOC)) < 0 ? 'w-full text-red-500 font-bold' : 'w-full text-emerald-500 font-bold'}
                                                placeholder="0.00"
                                                value={formatNumberWithCommas((parseFloat(OFWValueDOC) + parseFloat(BENEValueDOC) + parseFloat(ACBValueDOC)).toFixed(2))}
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                        <div className="w-[15rem]">
                                            <Input
                                                className={(parseFloat(OFWValue) + parseFloat(BENEValue) + parseFloat(ACBValue)) < 0 ? 'w-full text-red-500 font-bold' : 'w-full text-emerald-500 font-bold'}
                                                placeholder="0.00"
                                                value={formatNumberWithCommas((parseFloat(OFWValue) + parseFloat(BENEValue) + parseFloat(ACBValue)).toFixed(2))}
                                                disabled={isReadOnly}
                                            />
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigation Anchor Section */}
                    <div className="bg-[#f0f0f0] p-2 rounded-lg rounded-tr-none rounded-br-none h-[58vh] xs:h-[40vh] sm:h-[40vh] md:h-[40vh] lg:h-[43vh] xl:h-[45vh] 2xl:h-[47vh] 3xl:h-[56vh]">
                        <ConfigProvider theme={{ token: { colorSplit: 'rgba(60,7,100,0.55)', colorPrimary: 'rgb(52,179,49)' } }}>
                            <Anchor
                                replace
                                affix={false}
                                targetOffset={50}
                                getContainer={() => document.getElementById('scrollable-container')}
                                items={[
                                    { key: 'OFW-NDI', href: '#OFW-NDI', title: data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL' ? 'NDI OFW' : 'NDI Beneficiary' },
                                    { key: 'BORROWER-NDI', href: '#BORROWER-NDI', title: data.loanProd !== '0303-DHW' && data.loanProd !== '0303-VL' && data.loanProd !== '0303-WL' ? 'NDI OFW' : 'NDI Beneficiary' },
                                    ...(!!sepcoborrowfname ? [{ key: 'ACB-NDI', href: '#ACB-NDI', title: 'NDI ACB' }] : []),
                                ]}
                            />
                        </ConfigProvider>
                    </div>
                </div>
                
                {/* Save Button Section */}
                <center className="flex justify-center items-center ">
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        {!DISABLE_STATUS(localStorage.getItem('SP')) && (
                            <Button
                                size="large"
                                className="-mt-6 mr-40 bg-[#2b972d]"
                                type="primary"
                                disabled={Counter >= 1}
                                onClick={SaveNdi}
                                loading={onClickSaveNDI.isPending}
                            >
                                SAVE NDI
                            </Button>
                        )}
                    </ConfigProvider>
                </center>
            </div>
        </>
    );
}

export default NDI;