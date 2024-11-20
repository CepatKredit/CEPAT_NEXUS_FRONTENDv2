import React from 'react'
import SectionHeader from '@components/validation/SectionHeader';
import { Space, Input, Button, Checkbox } from 'antd';
import { GrandTotal, Validation } from '@hooks/NDIController'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import SelectIncome from './SelectIncome';
import SelectExpense from './SelectExpense';
import { jwtDecode } from 'jwt-decode';
import { mmddyy } from '@utils/Converter';
import { useQuery } from '@tanstack/react-query';
import { GetData } from '@utils/UserData';
import axios from 'axios';
import dayjs from 'dayjs';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function Borrower({ principal, onValueChange, onOtherIncome, onOtherExpense, InitialOtherIncome, InitialOtherExpense, data, setMiscellanious }) {
    const {SET_LOADING_INTERNAL} = React.useContext(LoanApplicationContext);
    const { setBENE, setBENEDOC } = GrandTotal()
    const { setCounter } = Validation()
    const roles = ['70', '80'];
    const isReadOnly = roles.includes(GetData('ROLE').toString());
    const [MiscExp, setMiscExp] = React.useState(true);
    const { GetStatus } = ApplicationStatus();
    const [isComputing, setIsComputing] = React.useState(false);
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER', 'RELEASED'
    ];

    const [getValue, setValue] = React.useState({
        /* DOCUMENTED */
        AveRemittanceDoc: '0.00',
        IncomeEmployedHouseholdDoc: '0.00',
        SalaryDoc: '0.00',
        TotalNetIncomeDoc: '0.00',
        MonthlyFoodDoc: '0.00',
        MARDoc: '0.00',
        UtilitiesDoc: '0.00',
        TuitionDoc: '0.00',
        MiscExpenseDoc: '0.00',
        TotalExpenseDoc: '0.00',
        NetDisposableDoc: '0.00',

        /* DECLARED */
        AveRemittance: '0.00',
        IncomeEmployedHousehold: '0.00',
        Salary: '0.00',
        TotalNetIncome: '0.00',
        MonthlyFood: '0.00',
        MAR: '0.00',
        Utilities: '0.00',
        Tuition: '0.00',
        MiscExpense: '0.00',
        TotalExpense: '0.00',
        NetDisposable: '0.00',
    })

    const [getTrigger, setTrigger] = React.useState(0)
    const token = localStorage.getItem('UTK')

    const NdiDataQuery = useQuery({
        queryKey: ['NdiDataQueryBorrower'],
        queryFn: async () => {
            setOtherIncome([]);
            setOtherExpense([]);

            if (data.loanIdCode === '' || Object.keys(data).length === 0) return null;
            const loanApp = data.loanIdCode /*'45D4D875-4309-4988-93B7-4EAB3DD9FC25'*/;
            const borrow = data.ofwBorrowersCode /*'81E829F2-F142-4224-A90B-E343C9ACBA5B'*/;
            const type = 2;
            const user = jwtDecode(token).USRID;
            const date = mmddyy(dayjs());

            await axios.get(`/GET/G109ND/${loanApp}/${borrow}/${type}/${user}/${date}`)
                .then((result) => {
                    let incomeData = [];
                    let expenseData = [];
                    SET_LOADING_INTERNAL('BorrowerNDI', false);
                    console.log(result.data.list)
                    result.data.list.forEach((item) => {
                        switch (item.listNo) {
                            case 30:
                                setValue(prev => ({
                                    ...prev,
                                    AveRemittanceDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    AveRemittance: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 31:
                                setValue(prev => ({
                                    ...prev,
                                    IncomeEmployedHouseholdDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    IncomeEmployedHousehold: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 32:
                                setValue(prev => ({
                                    ...prev,
                                    SalaryDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    Salary: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 40:
                                setValue(prev => ({
                                    ...prev,
                                    MonthlyFoodDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    MonthlyFood: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 41:
                                setValue(prev => ({
                                    ...prev,
                                    MARDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    MAR: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 42:
                                setValue(prev => ({
                                    ...prev,
                                    UtilitiesDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    Utilities: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 43:
                                setValue(prev => ({
                                    ...prev,
                                    TuitionDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    Tuition: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            case 44:
                                setMiscExp(!(item.formattedDocumented === '0.00' && item.formattedDeclared === '0.00' ? false : true))
                                setValue(prev => ({
                                    ...prev,
                                    MiscExpenseDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    MiscExpense: formatNumberWithCommas(item.formattedDeclared.toString()),
                                }));
                                break;
                            default:
                                const add_list = {
                                    id: item.listNo,
                                    name: item.listName,
                                    documented: formatNumberWithCommas(item.formattedDocumented.toString()),
                                    declared: formatNumberWithCommas(item.formattedDeclared.toString())
                                };
                                if (item.formattedSubType === 1) {
                                    incomeData.push(add_list);
                                } else {
                                    expenseData.push(add_list);
                                }
                                break;
                        }
                    });
                    setMiscellanious(2, MiscExp);
                    setOtherIncome(incomeData);
                    setOtherExpense(expenseData);
                    InitialOtherIncome(2, incomeData)
                    InitialOtherExpense(2, expenseData);
                    setTrigger(1);
                }).catch((error) => {
                    console.log(error);
                    SET_LOADING_INTERNAL('BorrowerNDI', false);
                })
            return null;
        },
        enabled: true,
    });
    React.useEffect(() => {
        if (data.loanIdCode !== '' || Object.keys(data).length !== 0) {
            SET_LOADING_INTERNAL('BorrowerNDI', true);
            NdiDataQuery.refetch();
        }
    }, [data.loanIdCode]);
    React.useEffect(() => {
        if (!isComputing && getTrigger) {
            setIsComputing(true);
            compute().finally(() => {
                setIsComputing(false);
            });
        }
    }, [getTrigger, isComputing]);

    function checkMisc() {
        if (MiscExp) {
            setMiscExp(false);
        } else {
            setMiscExp(true);
        }
        if (MiscExp) {
            setValue({
                ...getValue,
                MiscExpense: '0.00',
                MiscExpenseDoc: '0.00',
            });
        }
        setTrigger(1);
        setMiscellanious(2, MiscExp);
    }

    const [getOtherIncome, setOtherIncome] = React.useState([])
    const [getOtherExpense, setOtherExpense] = React.useState([])

    React.useEffect(() => { validate() }, [getOtherIncome, getOtherExpense])
    React.useEffect(() => { onValueChange(2, getValue); onOtherIncome(2, getOtherIncome); onOtherExpense(2, getOtherExpense) }, [getValue, getOtherIncome, getOtherExpense])

    function validate() {
        let counter = 0;
        getOtherIncome.map((x) => { if (x.name === '' || x.documented === '' || x.declared === '') { counter += 1 } })
        getOtherExpense.map((x) => { if (x.name === '' || x.documented === '' || x.declared === '') { counter += 1 } })
        if (getValue.AveRemittanceDoc === '' || getValue.IncomeEmployedHouseholdDoc === '' || getValue.SalaryDoc === '' || getValue.TotalNetIncomeDoc === '' ||
            getValue.MonthlyFoodDoc === '' || getValue.MARDoc === '' || getValue.UtilitiesDoc === '' || getValue.TuitionDoc === '' ||
            getValue.MiscExpenseDoc === '' || getValue.TotalExpenseDoc === '' || getValue.NetDisposableDoc === '' ||

            getValue.AveRemittance === '' || getValue.IncomeEmployedHousehold === '' || getValue.Salary === '' || getValue.TotalNetIncome === '' ||
            getValue.MonthlyFood === '' || getValue.MAR === '' || getValue.Utilities === '' || getValue.Tuition === '' ||
            getValue.MiscExpense === '' || getValue.TotalExpense === '' || getValue.NetDisposable === ''
        ) { counter += 1 }
        setCounter(counter)
    }

    function addOtherIncome(command) {
        let container = {
            id: '',
            name: '',
            documented: 0.00,
            declared: 0.00
        }
        if (command === 'INCOME') { setOtherIncome([...getOtherIncome, container]) }
        else { setOtherExpense([...getOtherExpense, container]) }
    }

    function deleteOtherIncome(e, command) {
        if (command === 'INCOME') {
            const newData = getOtherIncome.filter((_, data) => data !== e);
            setOtherIncome(newData)
        }
        else {
            const newData = getOtherExpense.filter((_, data) => data !== e);
            setOtherExpense(newData)
        }
        setTrigger(1)
    }

    function formatNumberWithCommas(num) {
        if (!num) return '0.00';
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function removeCommas(num) {
        if (!num) return '0.00';
        return num.toString().replace(/,/g, '');
    }

    async function compute() {
        /* Documented */
        let TNIDOC = (parseFloat(removeCommas(getValue.AveRemittanceDoc === '' ? 0 : getValue.AveRemittanceDoc)) +
            parseFloat(removeCommas(getValue.IncomeEmployedHouseholdDoc === '' ? 0 : getValue.IncomeEmployedHouseholdDoc)) +
            parseFloat(removeCommas(getValue.SalaryDoc === '' ? 0 : getValue.SalaryDoc)) + parseFloat(totalOtherIncome('DOC'))).toFixed(2);
        let MISCDOC = !MiscExp ? parseFloat(removeCommas(getValue.MiscExpenseDoc === '' ? 0.00 : getValue.MiscExpenseDoc)) : (removeCommas(TNIDOC) * 0.08).toFixed(2);
        let TOTALDOC = (parseFloat(removeCommas(getValue.MonthlyFoodDoc === '' ? 0 : getValue.MonthlyFoodDoc)) + parseFloat(removeCommas(getValue.MARDoc)) +
            parseFloat(removeCommas(getValue.UtilitiesDoc === '' ? 0 : getValue.UtilitiesDoc)) + parseFloat(removeCommas(getValue.TuitionDoc === '' ? 0 : getValue.TuitionDoc)) +
            parseFloat(removeCommas(MISCDOC)) + parseFloat(totalOtherExpense('DOC'))).toFixed(2)
        let NETDOC = (parseFloat(removeCommas(TNIDOC)) - parseFloat(removeCommas(TOTALDOC))).toFixed(2)
        /* DECLARED */
        let TNI = (parseFloat(removeCommas(getValue.AveRemittance === '' ? 0 : getValue.AveRemittance)) +
            parseFloat(removeCommas(getValue.IncomeEmployedHousehold === '' ? 0 : getValue.IncomeEmployedHousehold)) +
            parseFloat(removeCommas(getValue.Salary === '' ? 0 : getValue.Salary)) + parseFloat(totalOtherIncome('DEC'))).toFixed(2);
        let MISC = (!MiscExp) ? parseFloat(removeCommas(getValue.MiscExpense === '' ? 0.00 : getValue.MiscExpense)) : (removeCommas(TNI) * 0.08).toFixed(2);
        let TOTAL = (parseFloat(removeCommas(getValue.MonthlyFood === '' ? 0 : getValue.MonthlyFood)) + parseFloat(removeCommas(getValue.MAR)) +
            parseFloat(removeCommas(getValue.Utilities === '' ? 0 : getValue.Utilities)) + parseFloat(removeCommas(getValue.Tuition === '' ? 0 : getValue.Tuition)) +
            parseFloat(removeCommas(MISC)) + parseFloat(totalOtherExpense('DEC'))).toFixed(2)
        let NET = (parseFloat(removeCommas(TNI)) - parseFloat(removeCommas(TOTAL))).toFixed(2)

        setValue({
            ...getValue,
            /* DOCUMENTED */
            TotalNetIncomeDoc: formatNumberWithCommas(TNIDOC),
            ...((MiscExp) && { MiscExpenseDoc: formatNumberWithCommas(MISCDOC) }),
            TotalExpenseDoc: formatNumberWithCommas(TOTALDOC),
            NetDisposableDoc: formatNumberWithCommas(NETDOC),
            /* DECLARED */
            TotalNetIncome: formatNumberWithCommas(TNI),
            ...((MiscExp) && { MiscExpense: formatNumberWithCommas(MISC) }),
            TotalExpense: formatNumberWithCommas(TOTAL),
            NetDisposable: formatNumberWithCommas(NET)
        })

        setBENE(NET)
        setBENEDOC(NETDOC)
        setTrigger(0)
        return new Promise((resolve) => setTimeout(resolve, 500));
    }

    function totalOtherIncome(command) {
        let documented = 0
        let declared = 0
        if (getOtherIncome.length !== 0) {
            getOtherIncome.map((x) => {
                documented += parseFloat(removeCommas(x.documented === '' ? 0 : x.documented))
                declared += parseFloat(removeCommas(x.declared === '' ? 0 : x.declared))
            })
        }

        switch (command) {
            case 'DOC':
                return documented;
            default:
                return declared;
        }
    }

    function totalOtherIncome(command) {
        let documented = 0
        let declared = 0
        if (getOtherIncome.length !== 0) {
            getOtherIncome.map((x) => {
                documented += parseFloat(removeCommas(x.documented === '' ? 0 : x.documented))
                declared += parseFloat(removeCommas(x.declared === '' ? 0 : x.declared))
            })
        }

        switch (command) {
            case 'DOC':
                return documented;
            default:
                return declared;
        }
    }

    function totalOtherExpense(command) {
        let documented = 0
        let declared = 0
        if (getOtherExpense.length !== 0) {
            getOtherExpense.map((x) => {
                documented += parseFloat(removeCommas(x.documented === '' ? 0 : x.documented))
                declared += parseFloat(removeCommas(x.declared === '' ? 0 : x.declared))
            })
        }

        switch (command) {
            case 'DOC':
                return documented;
            default:
                return declared;
        }
    }

    function onChange(e, target, index) {
        let num = e.target.value;
        if (num === '' || num === '0') {
            setTrigger(1);

            if (target === 1) {
                const newData = getOtherIncome.map((x, i) => {
                    if (i === index) {
                        return { ...x, [e.target.name]: '' };
                    }
                    return x;
                });
                setOtherIncome(newData);
            } else if (target === 2) {
                const newData = getOtherExpense.map((x, i) => {
                    if (i === index) {
                        return { ...x, [e.target.name]: '' };
                    }
                    return x;
                });
                setOtherExpense(newData);
            } else {
                setValue({ ...getValue, [e.target.name]: '' });
            }

            return;
        }

        if (num.length > 1 && num.startsWith('0') && !num.startsWith('0.')) {
            num = num.substring(1);
        }

        num = num.replace(/[^0-9.]/g, '');

        if (num.startsWith('.')) {
            num = '0.' + num.substring(1);
        }

        const periodCount = (num.match(/\./g) || []).length;
        if (periodCount > 1) {
            num = num.substring(0, num.lastIndexOf('.'));
        }
        const decimalIndex = num.indexOf('.');
        if (decimalIndex !== -1) {
            num = num.substring(0, decimalIndex + 3);
        }

        const formattedNum = formatNumberWithCommas(num);

        if (target === 1) {
            const newData = getOtherIncome.map((x, i) => {
                if (i === index) {
                    return { ...x, [e.target.name]: formattedNum };
                }
                return x;
            });
            setOtherIncome(newData);
        } else if (target === 2) {
            const newData = getOtherExpense.map((x, i) => {
                if (i === index) {
                    return { ...x, [e.target.name]: formattedNum };
                }
                return x;
            });
            setOtherExpense(newData);
        } else {
            setValue({ ...getValue, [e.target.name]: formattedNum });
        }
        setTrigger(1);
    }

    function onBlur(e, target, index) {
        if (e.target.value !== '') {
            let num = e.target.value.replace(/[^0-9.]/g, '');
            const periodCount = num.split('.').length - 1;
            if (periodCount > 1) { num = num.slice(0, -1); }

            let CommaFormat = formatNumberWithCommas(parseFloat(num).toFixed(2).toString())
            if (target === 1) {
                const newData = getOtherIncome.map((x, i) => { if (i === index) { return { ...x, [e.target.name]: CommaFormat }; } return x })
                setOtherIncome(newData)
            }
            else if (target === 2) {
                const newData = getOtherExpense.map((x, i) => { if (i === index) { return { ...x, [e.target.name]: CommaFormat }; } return x })
                setOtherExpense(newData)
            }
            else { setValue({ ...getValue, [e.target.name]: CommaFormat }) }
        }
        else {
            if (target === 1) {
                const newData = getOtherIncome.map((x, i) => { if (i === index) { return { ...x, [e.target.name]: '0.00' }; } return x })
                setOtherIncome(newData)
            }
            else if (target === 2) {
                const newData = getOtherExpense.map((x, i) => { if (i === index) { return { ...x, [e.target.name]: '0.00' }; } return x })
                setOtherExpense(newData)
            }
            else { setValue({ ...getValue, [e.target.name]: '0.00' }) }
        }
        setTrigger(1);
    }

    function onChangeName(target, index, lab, val) {
        if (target === 1) {
            const newData = getOtherIncome.map((x, i) => { if (i === index) { return { ...x, id: val, name: lab }; } return x })
            setOtherIncome(newData)
        }
        else {
            const newData = getOtherExpense.map((x, i) => { if (i === index) { return { ...x, id: val, name: lab }; } return x })
            setOtherExpense(newData)
        }
    }

    return (
        <>
            <SectionHeader title='NDI Beneficiary' tag={principal} />
            <div className='flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center w-full'>
                    {/*------------------------------------------------------------*/}
                    <div className='font-semibold text-xl pb-4'>Income</div>
                    <Space className='mb-[1rem] flex justify-center items-center'>
                        <div className='w-[15rem]'></div>
                        <div className='w-[15rem] font-semibold text-center'>Documented</div>
                        <div className='w-[15rem] font-semibold text-center'>Declared</div>
                    </Space>
                    <Space>
                        <div className='w-[15rem]'>Average Remittance</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='AveRemittanceDoc'
                                placeholder='0.00'
                                value={getValue.AveRemittanceDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='AveRemittance'
                                placeholder='0.00'
                                value={getValue.AveRemittance}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Income from Employed member of Household</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='IncomeEmployedHouseholdDoc'
                                placeholder='0.00'
                                value={getValue.IncomeEmployedHouseholdDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='IncomeEmployedHousehold'
                                placeholder='0.00'
                                value={getValue.IncomeEmployedHousehold}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem] '>Salary</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='SalaryDoc'
                                placeholder='0.00'
                                value={getValue.SalaryDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='Salary'
                                placeholder='0.00'
                                value={getValue.Salary}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>
                            <Space>
                                <Button type='primary' icon={<PlusOutlined style={{ fontSize: '15px' }} />} onClick={() => { addOtherIncome('INCOME') }} disabled={isReadOnly || disabledStatuses.includes(GetStatus)} />
                                <span>Other Sources of Income</span>
                            </Space>
                        </div>
                        <div className='w-[15rem]' />
                        <div className='w-[15rem]' />
                    </Space>
                    {getOtherIncome.map((x, i) =>
                    (<Space className='pt-2' key={x.id}>
                        <div className='w-[15rem]'>
                            <Space>
                                <Button type='primary' icon={<MinusOutlined style={{ fontSize: '15px' }} />} onClick={() => { deleteOtherIncome(i, 'INCOME') }} danger disabled={isReadOnly || disabledStatuses.includes(GetStatus)} />
                                <SelectIncome data={x.name} event={(lab, val) => { onChangeName(1, i, lab, val) }} excludeItems={getOtherIncome} />
                            </Space>
                        </div>
                        <div className='w-[15rem]'>
                            <Input
                                key={i}
                                name={'documented'}
                                placeholder='0.00' maxLength={13}
                                value={x.documented}
                                onChange={(e) => { onChange(e, 1, i) }}
                                onBlur={(e) => { onBlur(e, 1, i) }}
                                disabled={x.name === '' ? true : false}
                            />
                        </div>
                        <div className='w-[15rem]'>
                            <Input
                                key={i}
                                name={'declared'}
                                placeholder='0.00' maxLength={13}
                                value={x.declared}
                                onChange={(e) => { onChange(e, 1, i) }}
                                onBlur={(e) => { onBlur(e, 1, i) }}
                                disabled={x.name === '' ? true : false}
                            />
                        </div>
                    </Space>))}
                    <Space className='pt-2'>
                        <div className='w-[15rem] font-bold'>Total Salary</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TotalNetIncomeDoc'
                                placeholder='0.00' readOnly
                                value={getValue.TotalNetIncomeDoc} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TotalNetIncome'
                                placeholder='0.00' readOnly
                                value={getValue.TotalNetIncome} />
                        </div>
                    </Space>

                    {/*------------------------------------------------------------*/}
                    <div className='font-semibold text-xl pb-4 pt-4'>Expense</div>
                    <Space>
                        <div className='w-[15rem]'>Monthly Food Expense </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MonthlyFoodDoc'
                                placeholder='0.00'
                                value={getValue.MonthlyFoodDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MonthlyFood'
                                placeholder='0.00'
                                value={getValue.MonthlyFood}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Mortgaged/ Amort/ Rent</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MARDoc'
                                placeholder='0.00'
                                value={getValue.MARDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MAR'
                                placeholder='0.00'
                                value={getValue.MAR}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Utilities</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='UtilitiesDoc'
                                placeholder='0.00'
                                value={getValue.UtilitiesDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='Utilities'
                                placeholder='0.00'
                                value={getValue.Utilities}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Tuition</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TuitionDoc'
                                placeholder='0.00'
                                value={getValue.TuitionDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='Tuition'
                                placeholder='0.00'
                                value={getValue.Tuition}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Miscellaneous Expense{(GetData('ROLE').toString() === '60' && (<Checkbox className='ml-[.8rem]' checked={!MiscExp} onClick={() => { checkMisc() }} />))} </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MiscExpenseDoc'
                                placeholder='0.00' readOnly={MiscExp}
                                maxLength={13}
                                value={getValue.MiscExpenseDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                            />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MiscExpense'
                                placeholder='0.00' readOnly={MiscExp}
                                maxLength={13}
                                value={getValue.MiscExpense}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                            />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>
                            <Space>
                                <Button type='primary' icon={<PlusOutlined style={{ fontSize: '15px' }} />} onClick={() => { addOtherIncome('EXPENSE') }} disabled={isReadOnly || disabledStatuses.includes(GetStatus)} />
                                <span>Other Expenses</span>
                            </Space>
                        </div>
                        <div className='w-[15rem]' />
                        <div className='w-[15rem]' />
                    </Space>
                    {getOtherExpense.map((x, i) =>
                    (<Space className='pt-2' key={x.id}>
                        <div className='w-[15rem]'>
                            <Space>
                                <Button type='primary' icon={<MinusOutlined style={{ fontSize: '15px' }} />} onClick={() => { deleteOtherIncome(i, 'EXPENSE') }} danger disabled={isReadOnly || disabledStatuses.includes(GetStatus)} />
                                <SelectExpense data={x.name} event={(lab, val) => { onChangeName(2, i, lab, val) }} excludeItems={getOtherExpense} />
                            </Space>
                        </div>
                        <div className='w-[15rem]'>
                            <Input
                                key={i}
                                name={'documented'}
                                placeholder='0.00' maxLength={13}
                                value={x.documented}
                                onChange={(e) => { onChange(e, 2, i) }}
                                onBlur={(e) => { onBlur(e, 2, i) }}
                                disabled={x.name === '' ? true : false}
                            />
                        </div>
                        <div className='w-[15rem]'>
                            <Input
                                key={i}
                                name={'declared'}
                                placeholder='0.00' maxLength={13}
                                value={x.declared}
                                onChange={(e) => { onChange(e, 2, i) }}
                                onBlur={(e) => { onBlur(e, 2, i) }}
                                disabled={x.name === '' ? true : false}
                            />
                        </div>
                    </Space>))}
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Total Expense </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TotalExpenseDoc'
                                placeholder='0.00' readOnly
                                value={getValue.TotalExpenseDoc} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TotalExpense'
                                placeholder='0.00' readOnly
                                value={getValue.TotalExpense} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem] font-bold'>Net Disposable Income</div>
                        <div className='w-[15rem]'>
                            <Input className={(parseFloat(removeCommas(getValue.NetDisposableDoc))) < 0
                                ? 'w-full text-red-500 font-bold'
                                : 'w-full text-emerald-500 font-bold'}
                                name='NetDisposableDoc' placeholder='0.00' readOnly value={getValue.NetDisposableDoc} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className={(parseFloat(removeCommas(getValue.NetDisposable))) < 0
                                ? 'w-full text-red-500 font-bold'
                                : 'w-full text-emerald-500 font-bold'}
                                name='NetDisposable' placeholder='0.00' readOnly value={getValue.NetDisposable} />
                        </div>
                    </Space>
                </div>
            </div>
        </>
    )
}

export default Borrower