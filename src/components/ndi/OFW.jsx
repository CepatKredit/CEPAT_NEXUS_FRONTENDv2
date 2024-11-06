import React, { useState } from 'react'
import SectionHeader from '@components/validation/SectionHeader';
import { Space, Input, Button, Checkbox } from 'antd';
import { GrandTotal, Validation } from '@hooks/NDIController'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import SelectIncome from './SelectIncome';
import SelectExpense from './SelectExpense';
import { GET_LIST } from '@api/base-api/BaseApi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { mmddyy } from '@utils/Converter';
import { GetData } from '@utils/UserData';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';

function OFW({ principal, onValueChange, onOtherIncome, onOtherExpense, InitialOtherIncome, InitialOtherExpense, data, User, onLoadingChange }) {
    const { setOFW, setOFWDOC } = GrandTotal()
    const { setCounter } = Validation()
    const roles = [ '70', '80'];
    const isReadOnly = roles.includes(GetData('ROLE').toString());
    const [MiscExp, setMiscExp] = React.useState(false);
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
        TotalSalaryDoc: '0.00',
        TotalNetIncomeDoc: '0.00',
        RemittanceToPHDoc: '0.00',
        MonthlyFoodDoc: '0.00',
        MonthlyRentDoc: '0.00',
        MiscExpenseDoc: '0.00',
        TotalExpenseDoc: '0.00',
        NetDisposableDoc: '0.00',
        /* DECLARED */
        TotalSalary: '0.00',
        TotalNetIncome: '0.00',
        RemittanceToPH: '0.00',
        MonthlyFood: '0.00',
        MonthlyRent: '0.00',
        MiscExpense: '0.00',
        Others: '0.00',
        TotalExpense: '0.00',
        NetDisposable: '0.00',
    })
    const [getTrigger, setTrigger] = React.useState(0)
    const token = localStorage.getItem('UTK')

    function formatNumberWithCommas(num) {
        if (!num || num == 0) return '0.00';
        const parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
        return parts.join('.');
    }

    function removeCommas(num) {
        if (!num) return '0.00';
        return num.toString().replace(/,/g, '');
    }

    const [getOtherIncome, setOtherIncome] = React.useState([])
    const [getOtherExpense, setOtherExpense] = React.useState([])

    const NdiDataQuery = useQuery({
        queryKey: ['NdiDataQueryOfw'],
        queryFn: async () => {
            setOtherIncome([]);
            setOtherExpense([]);
            if (data.loanIdCode === '' || Object.keys(data).length === 0) return null;
            const loanApp = data.loanIdCode;
            const borrow = data.ofwBorrowersCode;
            const type = 1;
            const user = jwtDecode(token).USRID;
            const date = mmddyy(dayjs());
            try {
                const result = await axios.get(`/getNDIData/${loanApp}/${borrow}/${type}/${user}/${date}`);
                console.log(result.data.list)
                let incomeData = [];
                let expenseData = [];
                onLoadingChange(false);
                result.data.list.forEach((item) => {
                    switch (item.listNo) {
                        case 1:
                            setValue(prev => ({
                                ...prev,
                                TotalSalaryDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                TotalSalary: formatNumberWithCommas(item.formattedDeclared.toString()),
                            }));
                            break;
                        case 20:
                            setValue(prev => ({
                                ...prev,
                                RemittanceToPHDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                RemittanceToPH: formatNumberWithCommas(item.formattedDeclared.toString()),
                            }));
                            break;
                        case 21:
                            setValue(prev => ({
                                ...prev,
                                MonthlyFoodDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                MonthlyFood: formatNumberWithCommas(item.formattedDeclared.toString()),
                            }));
                            break;
                        case 22:
                            setValue(prev => ({
                                ...prev,
                                MonthlyRentDoc: formatNumberWithCommas(item.formattedDocumented.toString()),
                                MonthlyRent: formatNumberWithCommas(item.formattedDeclared.toString()),
                            }));
                            break;
                        case 23:
                            setMiscExp(item.formattedDocumented !== '0.00' || item.formattedDeclared !== '0.00' ? true : false)
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

                setOtherIncome(incomeData);
                setOtherExpense(expenseData);
                InitialOtherIncome(1, incomeData);
                InitialOtherExpense(1, expenseData);

                setTrigger(1);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    console.log('Error:', error);
                }
            }
            return null;
        },
        enabled: true,
    });

    React.useEffect(() => {
        if (data.loanIdCode !== '' || Object.keys(data).length !== 0) {
            NdiDataQuery.refetch();
        }
    }, [data]);

    React.useEffect(() => {
        if (!isComputing && getTrigger) {
            setIsComputing(true);
            compute().finally(() => {
                setIsComputing(false);
            });
        }
    }, [getTrigger, isComputing]);
    React.useEffect(() => {
        if (MiscExp) {
            setValue({
                ...getValue,
                MiscExpense: 0.00,
                MiscExpenseDoc: 0.00,
            });
        }
        setTrigger(1)

    }, [MiscExp])


    React.useEffect(() => { validate() }, [getOtherIncome, getOtherExpense])
    React.useEffect(() => { onValueChange(1, getValue); onOtherIncome(1, getOtherIncome); onOtherExpense(1, getOtherExpense); }, [getValue, getOtherIncome, getOtherExpense])

    function validate() {
        let counter = 0;
        getOtherIncome.map((x) => { if (x.id === '' || x.documented === '' || x.declared === '') { counter += 1 } })
        getOtherExpense.map((x) => { if (x.id === '' || x.documented === '' || x.declared === '') { counter += 1 } })
        /*if (getValue.TotalSalaryDoc === '' || getValue.TotalNetIncomeDoc === '' || getValue.RemittanceToPHDoc === '' || getValue.MonthlyFoodDoc === '' ||
               getValue.MonthlyRentDoc === '' || getValue.MiscExpenseDoc === '' || getValue.TotalExpenseDoc === '' || getValue.NetDisposableDoc === '' ||
               getValue.TotalSalary === '' || getValue.TotalNetIncome === '' || getValue.RemittanceToPH === '' || getValue.MonthlyFood === '' ||
               getValue.MonthlyRent === '' || getValue.MiscExpense === '' || getValue.TotalExpense === '' || getValue.NetDisposable === ''
           ) { counter += 1 }*/
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

    async function compute() {
        let TNI = (parseFloat(removeCommas(getValue.TotalSalary === '' ? 0 : getValue.TotalSalary)) + parseFloat(removeCommas(getValue.OtherIncome === '' ? 0 : getValue.OtherIncome))
            + parseFloat(totalOtherIncome('DEC'))).toFixed(2)
        let MISC =  MiscExp ? parseFloat(removeCommas(getValue.MiscExpense === '' ? 0.00 : getValue.MiscExpense)) : (removeCommas(TNI) * 0.08).toFixed(2);
        let TOTAL = (parseFloat(removeCommas(getValue.RemittanceToPH === '' ? 0 : getValue.RemittanceToPH)) + parseFloat(removeCommas(getValue.MonthlyFood === '' ? 0 : getValue.MonthlyFood)) +
            parseFloat(removeCommas(getValue.MonthlyRent === '' ? 0 : getValue.MonthlyRent)) + parseFloat(removeCommas(MISC)) + parseFloat(totalOtherExpense('DEC'))).toFixed(2)
        let NET = (parseFloat(removeCommas(TNI)) - parseFloat(removeCommas(TOTAL))).toFixed(2)
        let TNIDOC = (parseFloat(removeCommas(getValue.TotalSalaryDoc === '' ? 0 : getValue.TotalSalaryDoc)) + parseFloat(removeCommas(getValue.OtherIncomeDoc === '' ? 0 : getValue.OtherIncomeDoc))
            + parseFloat(totalOtherIncome('DOC'))).toFixed(2)
        let MISCDOC = MiscExp ? parseFloat(removeCommas(getValue.MiscExpenseDoc === '' ? 0.00 : getValue.MiscExpenseDoc)) : (removeCommas(TNIDOC) * 0.08).toFixed(2);
        let TOTALDOC = (parseFloat(removeCommas(getValue.RemittanceToPHDoc === '' ? 0 : getValue.RemittanceToPHDoc)) + parseFloat(removeCommas(getValue.MonthlyFoodDoc === '' ? 0 : getValue.MonthlyFoodDoc)) +
            parseFloat(removeCommas(getValue.MonthlyRentDoc === '' ? 0 : getValue.MonthlyRentDoc)) + parseFloat(removeCommas(MISCDOC)) + parseFloat(totalOtherExpense('DOC'))).toFixed(2)
        let NETDOC = (parseFloat(removeCommas(TNIDOC)) - parseFloat(removeCommas(TOTALDOC))).toFixed(2)
        setValue({
            ...getValue,
            /* DOCUMENTED */
            TotalNetIncomeDoc: formatNumberWithCommas(TNIDOC),
            ...( !MiscExp && { MiscExpenseDoc: formatNumberWithCommas(MISCDOC) }), //CRA Only
            TotalExpenseDoc: formatNumberWithCommas(TOTALDOC),
            NetDisposableDoc: formatNumberWithCommas(NETDOC),
            /* DECLARED */
            TotalNetIncome: formatNumberWithCommas(TNI),
            ...( !MiscExp && { MiscExpense: formatNumberWithCommas(MISC) }), //CRA Only
            TotalExpense: formatNumberWithCommas(TOTAL),
            NetDisposable: formatNumberWithCommas(NET),
        })
        setTrigger(0)
        setOFW(NET)
        setOFWDOC(NETDOC)
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
            <SectionHeader title="NDI OFW" tag={principal} />
            <div className='flex justify-center items-center'>
                <div className='flex flex-col justify-center items-center w-[60vw]'>
                    {/*------------------------------------------------------------*/}
                    <div className='font-semibold text-xl pb-4'>OFW Income</div>
                    <Space className='mb-[1rem] flex justify-center items-center'>
                        <div className='w-[15rem]'></div>
                        <div className='w-[15rem] font-semibold text-center'>Documented</div>
                        <div className='w-[15rem] font-semibold text-center'>Declared</div>
                    </Space>
                    <Space>
                        <div className='w-[15rem]'>Total Salary</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TotalSalaryDoc'
                                placeholder='0.00' maxLength={13}
                                value={getValue.TotalSalaryDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='TotalSalary'
                                placeholder='0.00' maxLength={13}
                                value={getValue.TotalSalary}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>
                            <Space>
                                <Button type='primary' icon={<PlusOutlined style={{ fontSize: '15px' }} />} onClick={() => { addOtherIncome('INCOME') }} disabled={isReadOnly || disabledStatuses.includes(GetStatus)} />
                                <span>Other Income</span>
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
                                disabled={x.id === '' ? true : false}
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
                                disabled={x.id === '' ? true : false}
                            />
                        </div>
                    </Space>))}
                    <Space className='pt-2'>
                        <div className='w-[15rem] font-bold'>Total Net Income</div>
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
                        <div className='w-[15rem]'>Remittance To Philippines</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='RemittanceToPHDoc'
                                placeholder='0.00' maxLength={13}
                                value={getValue.RemittanceToPHDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='RemittanceToPH'
                                placeholder='0.00'
                                value={getValue.RemittanceToPH}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Monthly Food Expense</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MonthlyFoodDoc'
                                placeholder='0.00' maxLength={13}
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
                        <div className='w-[15rem]'>Monthly Rental</div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MonthlyRentDoc'
                                placeholder='0.00' maxLength={13}
                                value={getValue.MonthlyRentDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MonthlyRent'
                                placeholder='0.00'
                                value={getValue.MonthlyRent}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                                readOnly={isReadOnly} />
                        </div>
                    </Space>
                    <Space className='pt-2'>
                        <div className='w-[15rem]'>Miscellaneous Expense{(GetData('ROLE').toString() === '60' && (<Checkbox className='ml-[.8rem]' checked={MiscExp} onClick={() => { setMiscExp(!MiscExp) }} />))} </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MiscExpenseDoc'
                                placeholder='0.00' readOnly={!MiscExp}
                                maxLength={13}
                                value={getValue.MiscExpenseDoc}
                                onChange={(e) => { onChange(e, 0, null) }}
                                onBlur={(e) => { onBlur(e, 0, null) }}
                            />
                        </div>
                        <div className='w-[15rem]'>
                            <Input className='w-full' name='MiscExpense'
                                placeholder='0.00' readOnly={!MiscExp}
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
                                <span>Other Payables</span>
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

export default OFW