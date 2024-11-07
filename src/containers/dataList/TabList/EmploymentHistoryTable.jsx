import React, { useEffect } from 'react';
import { Form, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, message, Spin } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { WorkEducStatusOption } from '@utils/FixedData';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import moment from 'moment';
import axios from 'axios';
import { toDecrypt, toUpperText } from '@utils/Converter';
import SectionHeader from '@components/validation/SectionHeader';
import { GetData } from '@utils/UserData';

function EmploymentHistory({ data, User }) {
    const [loading, setLoading] = React.useState(true);
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [getInfo, setInfo] = React.useState({
        LoanAppId: '',
        key: '',
        Agency: '',
        Position: '',
        StartDate: '',
        EndDate: '',

    });

    const [getStat, setStat] = React.useState(true);
    const role = GetData('ROLE').toString();
    React.useEffect(() => { getEmploymentHistory.refetch() }, [data.loanIdCode]);

    const getEmploymentHistory = useQuery({
        queryKey: ['getEmploymentHistory'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            // console.log("Decrypted SIDC:", sidcDecrypted);
            const result = await axios.get(`/getEmploymentHistory/${toDecrypt(localStorage.getItem('SIDC'))}`);

            //   console.log("Employment History:", result);

            let dataList = [{
                key: 0,
                no: '',
                Agency: '',
                Position: '',
                StartDate: '',
                EndDate: '',
            }];

            result.data.list?.map((x, i) => {
                dataList.push({
                    key: x.id,
                    no: i + 1,
                    Agency: x.agency,
                    Position: x.position,
                    StartDate: x.startDate,
                    EndDate: x.endDate,
                });
            });
            setLoading(false);
            return dataList;
        },
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });

    const [fieldErrors, setFieldErrors] = React.useState({
        Agency: '',
        Position: '',
        StartDate: '',
        EndDate: '',


    });

    function validateStartDate(StartDate) {
        const year = StartDate.split('-')[1];

        return StartDate.trim() !== '' && year && /^\d{4}$/.test(year);
    }

    function validateCompanyAgency(Agency) {
        return Agency.trim() !== '';
    }
    function validatePosition(Position) {
        return Position !== '';
    }


    function validateFullbdate(EndDate) {
        const year = EndDate.split('-')[1];

        return EndDate.trim() !== '' && year && /^\d{4}$/.test(year);
    }


    const [getAddStat, setAddStat] = React.useState(false)

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////


    async function onClickSave() {
        /* let errors = {};
         if (!validateCompanyAgency(getInfo.Agency)) {
             errors.Agency = 'Company Agency is required.';
         }
 
         if (!validateStartDate(getInfo.StartDate)) {
             errors.StartDate = 'Start Date is required and should have a 4-digit year.';
         }
 
         if (!validateFullbdate(getInfo.EndDate)) {
             errors.EndDate = 'End Date is required and should have a 4-digit year.';
         }
 
         if (!validatePosition(getInfo.Position)) {
             errors.Position = 'Position is required.';
         }
 
 
 
         if (Object.keys(errors).length > 0) {
             setFieldErrors(errors);
             return;
         }
 
 
 
 
         setFieldErrors({ StartDate: '', Agency: '', EndDate: '', Position: '' });*/

        setStat(false);
        // const formattedBirthdate = getInfo.Birthdate ? moment(getInfo.Birthdate).format('MM-DD-YYYY') : '';

        const row = await form.validateFields();
        const data = {
            LoanappId: toDecrypt(localStorage.getItem('SIDC')),
            Agency: row.agency,
            Position: row.position,
            StartDate: row.startdate,
            EndDate: row.enddate,
            RecUser: jwtDecode(token).USRID
        }

        //   console.log(data)
        await axios.post('/addEmploymentHistory', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getEmploymentHistory'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        Agency: '',
                        Position: '',
                        StartDate: '',
                        EndDate: '',
                    });
                }
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
                /*    setFocus({
                        name: false,
                        conNum: true,
                        remarks: false,
                    });*/
            })

    }




    async function onClickEdit() {
        /* let errors = {};
        // Correct the field name to Agency instead of CompanyAgency
         if (!validateCompanyAgency(getInfo.Agency)) {
             errors.Agency = 'Company/Agency is required.';
         }
 
         if (getInfo.StartDate.trim() === '') {
             errors.StartDate = 'Start Date is required and should have a 4-digit year.';
         }
 
         if (!validateFullbdate(getInfo.EndDate)) {
             errors.EndDate = 'End Date is required.';
         }
 
         if (!validatePosition(getInfo.Position)) {
             errors.Position = 'Position is required.';
         }
 
         if (Object.keys(errors).length > 0) {
             setFieldErrors(errors);
             return;
         }
 
         // Clear errors if validation passes
         setFieldErrors({ StartDate: '', Agency: '', EndDate: '', Position: '' });*/

        try {
            const row = await form.validateFields();
            const data = {
                Id: editingKey, // Ensuring the record key is used correctly
                Agency: row.agency,
                Position: row.position,
                StartDate: row.startdate.format('YYYY-MM'), // Format as needed for the API
                EndDate: row.enddate.format('YYYY-MM'),
                ModUser: jwtDecode(token).USRID
            };

            // console.log('Data to be sent to the server:', data);

            const result = await axios.post('/editEmploymentHistory', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getEmploymentHistory'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    Agency: '',
                    Position: '',
                    StartDate: '',
                    EndDate: '',
                });
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }
    }


    async function onClickDelete(e) {
        try {
            const result = await axios.post(`/DeleteEmploymentHistory/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getEmploymentHistory'] }, { exact: true });
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
        }
    }
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER', 'RELEASED'
    ];

    const [form] = Form.useForm();
    const columns = [
        {
            title: (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Tooltip title='Add'>
                    <Button className='bg-[#3b0764]' type='primary' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || getAddStat}
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            const record = { key: 0, agency: '', position: '', startdate: undefined, enddate: undefined }
                            edit(record)
                            setStat(false);
                            setEditingKey(0);
                            setAddStat(!getAddStat);
                            setInfo({
                                ...getInfo,
                                Agency: '',
                                Position: '',
                                StartDate: '',
                                EndDate: '',
                            });
                        }}
                    />
                </Tooltip>
            </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '1rem',
            align: 'center'
        },

        {
            title: data.loanProd === '0303-DH' ||
                data.loanProd === '0303-DHW' ||
                data.loanProd === '0303-WA' ||
                data.loanProd === '0303-WL'
                ? 'Company'
                : data.loanProd === '0303-VL' || data.loanProd === '0303-VA'
                    ? 'Agency'
                    : 'Company / Agency',
            dataIndex: 'agency',
            key: 'agency',
            width: '25%',
            editable: true,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: '25%',
            editable: true,
        },
        {
            title: 'Start Date',
            dataIndex: 'startdate',
            key: 'startdate',
            width: '25%',
            editable: true,
            render: (text) => text ? moment(text, "YYYY-MM-DD").format("YYYY-MM") : "",
        },
        {
            title: 'End Date',
            dataIndex: 'enddate',
            key: 'enddate',
            width: '25%',
            editable: true,
            render: (text) => text ? moment(text, "YYYY-MM-DD").format("YYYY-MM") : "",

        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '2rem',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <Popconfirm
                                    title="Are you sure you want to save this record?"
                                    onConfirm={() => { onClickSave(); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<SaveOutlined />} type='primary' />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel this record?"
                                    onConfirm={() => {
                                        /* setFocus({
                                             name: false,
                                             conNum: false,
                                             remarks: false,
                                         })*/
                                        setStat(true)
                                        setAddStat(!getAddStat)
                                        setEditingKey('')
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"
                                >
                                    <Button icon={<CloseOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
                else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <Popconfirm
                                    title="Are you sure you want to save the changes?"
                                    onConfirm={() => {
                                        onClickEdit(); // Execute save if confirmed
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<SaveOutlined />} type='primary' />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel the edit?"
                                    onConfirm={() => {
                                        /*setFocus({
                                            name: false,
                                            conNum: false,
                                            remarks: false,
                                        });*/
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<CloseOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} onClick={() => {
                                        /*   setFocus({
                                               name: false,
                                               conNum: false,
                                               remarks: false,
                                           });*/
                                        edit(record);
                                        setAddStat(!getAddStat);
                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => {
                                        onClickDelete(record.key);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                }
            },
        },
    ];

    /*const [getFocus, setFocus] = React.useState({
        name: false,
        conNum: true,
        remarks: false,
    })*/

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            agency: record.agency,
            position: record.position,
            startdate: dayjs(record.startDate),
            enddate: dayjs(record.enddate),
        });
        setEditingKey(record.key);
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const [startDate, setStartDate] = React.useState(null); // Track the start date value

    async function onDateChange(e, pointer) {
        if (pointer === 'startdate') {
            form.setFieldsValue({ 'startdate': e });
            setStartDate(e); // Update the start date in state
            console.log("Selected Start Date:", e ? e.format('YYYY-MM') : "No date selected");
        } else {
            form.setFieldsValue({ 'enddate': e });
            console.log("Selected End Date:", e ? e.format('YYYY-MM') : "No date selected");
        }
    }

    const disabledStartDate = (current) => {
        return current && current >= dayjs().endOf('day');
    };

    const disabledEndDate = (current) => {
        return current && (startDate && current < startDate.startOf('month')) ||
            current >= dayjs().endOf('day');
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = dataIndex === 'agency'
            ? (
                <>
                    <Input
                        className='w-[16rem]'
                        onChange={(e) => { onChangeToUpper(e.target.value, 'agency') }}
                        placeholder={
                            data.loanProd === '0303-DH' ||
                                data.loanProd === '0303-DHW' ||
                                data.loanProd === '0303-WA' ||
                                data.loanProd === '0303-WL'
                                ? 'Company'
                                : data.loanProd === '0303-VL' || data.loanProd === '0303-VA'
                                    ? 'Agency'
                                    : 'Company / Agency'
                        } />
                </>
            )
            : dataIndex === 'position'
                ? (
                    <>
                        <Input
                            className='w-[16rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'position') }}
                            placeholder='Position'
                        />
                    </>
                )
                : dataIndex === 'startdate' ? (
                    <>
                        <DatePicker disabledDate={disabledStartDate} onChange={(e) => { onDateChange(e, 'startdate') }} picker='month' />

                    </>

                ) : dataIndex === 'enddate' ? (<>
                    <DatePicker disabledDate={disabledEndDate} onChange={(e) => { onDateChange(e, 'enddate') }} picker='month' />
                </>
                ) : null;

        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={[
                    {
                        required: true,
                        message: `Please Input ${title}`,
                    },
                    dataIndex === 'startdate' && {
                        validator: (_, value) =>
                            !value || dayjs(value).isBefore(dayjs(), 'day')
                                ? Promise.resolve()
                                : Promise.reject("Start Date cannot be in the future.")
                    },
                    dataIndex === 'enddate' && {
                        validator: (_, value) =>
                            !value || (startDate && dayjs(value).isAfter(startDate, 'day'))
                                ? Promise.resolve()
                                : Promise.reject("End Date must be after Start Date.")
                    }
                ].filter(Boolean)}
                >
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )
                }
            </td >
        );
    };



    const dataOnly = Array.isArray(getEmploymentHistory.data)
        ? getEmploymentHistory.data.filter(x => x.key !== 0)
        : [];


    return (
        <div className='h-[500px] flex flex-col items-center mt-[10rem]'>
            {contextHolder}
            <div className='mt-[5rem] w-full'>
                <div className="mt-[-2rem]">
                    <center>
                        <SectionHeader title="Employment History of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-0'>
                    <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                        <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center">
                            <Form form={form} component={false} >
                                <Table
                                    columns={mergedColumns}
                                    dataSource={
                                        getStat === false
                                            ? getEmploymentHistory.data?.map((x) => ({
                                                key: x.key,
                                                no: x.no,
                                                agency: x.Agency,
                                                position: x.Position,
                                                startdate: x.StartDate,
                                                enddate: x.EndDate,
                                            }))
                                            : dataOnly?.map((x) => ({
                                                key: x.key,
                                                no: x.no,
                                                agency: x.Agency,
                                                position: x.Position,
                                                startdate: x.StartDate,
                                                enddate: x.EndDate,
                                            }))
                                    }
                                    components={{ body: { cell: EditableCell } }}
                                    rowClassName='editable-row'
                                    pagination={false}
                                />
                            </Form>
                        </Spin>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default EmploymentHistory;
