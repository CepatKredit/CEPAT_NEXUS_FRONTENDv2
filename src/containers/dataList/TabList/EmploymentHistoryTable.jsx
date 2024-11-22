import React, { useEffect } from 'react';
import { Form, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, message, Spin } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
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
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function EmploymentHistory({ data, User }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext)
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [deletingKey, setDeletingKey] = React.useState(null);
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

    const getEmploymentHistory = useQuery({
        queryKey: ['getEmploymentHistory'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            // console.log("Decrypted SIDC:", sidcDecrypted);
            try {
                const result = await axios.get(`/getEmploymentHistory/${toDecrypt(localStorage.getItem('SIDC'))}`);

                //console.log("Employment History:", result);

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
                SET_LOADING_INTERNAL('EmploymentHistoryTABLE', false);
                return dataList;
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('EmploymentHistoryTABLE', false);
            }
            return null;
        },
        refetchInterval: (data) => {
            return data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });


    React.useEffect(() => {
        if (!data.loanIdCode !== "") {
            SET_LOADING_INTERNAL('EmploymentHistoryTABLE', true)
            getEmploymentHistory.refetch();
        }
    }, [data.loanIdCode]);

    const [getAddStat, setAddStat] = React.useState(false)




    async function onClickSave() {


        setStat(false);

        const row = await form.validateFields();
        onClickSaveData.mutate(row);
        

    }


    const onClickSaveData = useMutation({
        mutationFn: async (row) => {
            const data = {
                LoanappId: toDecrypt(localStorage.getItem('SIDC')),
                Agency: row.agency,
                Position: row.position,
                StartDate: row.startdate,
                EndDate: row.enddate,
                RecUser: jwtDecode(token).USRID
            }
    
    
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
    
                })
        }
    })




    async function onClickEdit() {
        const row = await form.validateFields();
        onClickEdiData.mutate(row);
       
    }

const onClickEdiData = useMutation({
    mutationFn: async (row) => {
        try {
           
            const data = {
                Id: editingKey,
                Agency: row.agency,
                Position: row.position,
                StartDate: row.startdate.format('YYYY-MM'),
                EndDate: row.enddate.format('YYYY-MM'),
                ModUser: jwtDecode(token).USRID
            };



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
})


async function onClickDelete(e) {
    setDeletingKey(e); // Set the key of the row being deleted
    onClickDeleteData.mutate(e, {
        onSettled: () => {
            setDeletingKey(null); // Reset the deletingKey when the mutation completes
        },
    });
}

    const onClickDeleteData = useMutation({
        mutationFn: async (e) => {
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
    })
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
        else if (GetData('ROLE').toString() === '60') {
            if (LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/queue-bucket' || LOCATION === '/ckfi/under-lp'
                || LOCATION === '/ckfi/special-lane' || LOCATION === '/ckfi/assessement/credit' || LOCATION === '/ckfi/queue-bucket'
                || LOCATION === '/ckfi/for-verification' || LOCATION === '/ckfi/pre-check' || LOCATION === '/ckfi/returned/marketing'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/reassessed/credit-officer' || LOCATION === '/ckfi/for-approval'
                || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '70') {
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/undecided'
                || LOCATION === '/ckfi/returned/credit-officer' || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/undecided'
                || LOCATION === '/ckfi/returned/credit-officer' || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }

    const [getStatus, setStatus] = React.useState(false)
    React.useEffect(() => { setStatus(DISABLE_STATUS(localStorage.getItem('SP'))); }, [localStorage.getItem('SIDC')])

    const [form] = Form.useForm();
    const columns = [
        {
            title: (<div className="flex items-center">
                {!DISABLE_STATUS(localStorage.getItem('SP')) && (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Tooltip title='Add'>
                            <Button className='bg-[#3b0764]' type='primary'
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
                    </ConfigProvider>
                )}
            </div>
            ),
            dataIndex: 'no',
            key: 'no',
            width: '6%',
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
            width: '35%',
            editable: true,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            width: '30%',
            editable: true,
        },
        {
            title: 'Start Date',
            dataIndex: 'startdate',
            key: 'startdate',
            width: '15%',
            editable: true,
            render: (text) => text ? moment(text, "YYYY-MM-DD").format("YYYY-MM") : "",
        },
        {
            title: 'End Date',
            dataIndex: 'enddate',
            key: 'enddate',
            width: '15%',
            editable: true,
            render: (text) => text ? moment(text, "YYYY-MM-DD").format("YYYY-MM") : "",

        },
        {
            hidden: DISABLE_STATUS(localStorage.getItem('SP')),
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (record.key === 0) {
                    return (
                        <Space>
                            <Tooltip title="Save">
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8', colorPrimaryHover: '#34b330' } }}>
                                    <Button loading={onClickSaveData.isPending} icon={<SaveOutlined />} type='primary' onClick={onClickSave} className='bg-[#2b972d]' />
                                </ConfigProvider>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    icon={<CloseOutlined />}
                                    type='primary'
                                    danger
                                    onClick={() => {
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    )
                }
                else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8', colorPrimaryHover: '#34b330' } }}>
                                    <Button loading={onClickEdiData.isPending} icon={<SaveOutlined />} type='primary' onClick={onClickEdit} className='bg-[#2b972d]' />
                                </ConfigProvider>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Button
                                    icon={<CloseOutlined />}
                                    type='primary'
                                    danger
                                    onClick={() => {
                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={editingKey !== ''} onClick={() => {

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
                                    <Button  loading={deletingKey === record.key} disabled={editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                }
            },
        },
    ];

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            agency: record.agency,
            position: record.position,
            startdate: record.startdate ? dayjs(record.startdate) : null,
            enddate: record.enddate ? dayjs(record.enddate) : null,
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

    // Separate function for handling start date change
    async function onStartDateChange(e) {
        form.setFieldsValue({ 'startdate': e });
        console.log("Selected Start Date:", e ? e.format('YYYY-MM') : "No date selected");
    }

    // Separate function for handling end date change
    async function onEndDateChange(e) {
        form.setFieldsValue({ 'enddate': e });
        console.log("Selected End Date:", e ? e.format('YYYY-MM') : "No date selected");
    }

    async function onChangeToUpper(e, pointer) {
        if (pointer === 'agency') {
            form.setFieldsValue({ 'agency': toUpperText(e) });
        }
    }

    /*  const disabledStartDate = (current) => {
          return current && current >= dayjs().endOf('day');
      };
  
      const disabledEndDate = (current) => {
          return current && (startDate && current < startDate.startOf('month')) ||
              current >= dayjs().endOf('day');
      };*/

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
                        className='w-[19.5rem]'
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
                            className='w-[16.5rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'position') }}
                            placeholder='Position'
                        />
                    </>
                )
                : dataIndex === 'startdate' ? (
                    <DatePicker
                        onChange={(e) => onStartDateChange(e, 'startdate')}
                        picker='month'
                    />
                ) : dataIndex === 'enddate' ? (
                    <DatePicker
                        onChange={(e) => onEndDateChange(e, 'enddate')}
                        picker='month'
                    />
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
                                : Promise.reject("Start Date cannot be in the future."),
                    },
                    dataIndex === 'enddate' && {
                        validator: (_, value) => {
                            if (!value) return Promise.resolve();
                            if (dayjs(value).isAfter(dayjs(), 'day')) {
                                return Promise.reject("End Date cannot be in the future.");
                            }
                            if (form.getFieldValue('startdate') && dayjs(value).isBefore(form.getFieldValue('startdate'), 'day')) {
                                return Promise.reject("End Date must be after Start Date.");
                            }
                            return Promise.resolve();
                        },
                    },
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
        <div className='flex flex-col items-center '>
            {contextHolder}
            <div className='w-full px-2'>
                <div>
                    <center>
                        <SectionHeader title="Employment History of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-0'>
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
                            scroll={{ y: 200 }}
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default EmploymentHistory;
