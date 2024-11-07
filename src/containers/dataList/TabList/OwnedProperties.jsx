import React, { useEffect } from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, message, Spin, Form } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import moment from 'moment';
import axios from 'axios';
import { toDecrypt } from '@utils/Converter';
import { DropdownOwnedProperties } from '@utils/FixedData';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';
import { toUpperText } from '@utils/Converter';

function OwnedProperties({ data, User }) {
    const [loading, setLoading] = React.useState(true);
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [getInfo, setInfo] = React.useState({
        LoanAppId: '',
        key: '',
        Properties: '',
        Location: '',
        Remarks: '',

    });
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER', 'RELEASED'
    ];
    const [getStat, setStat] = React.useState(true);
    const role = GetData('ROLE').toString();

    //React.useEffect(() => { getOtherLoanHistory.refetch() }, [data.loanIdCode]);
    const getOwnedProperties = useQuery({
        queryKey: ['getOwnedProperties'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            //  console.log("Decrypted SIDC:", sidcDecrypted);
            const result = await axios.get(`/getOwnedProperties/${toDecrypt(localStorage.getItem('SIDC'))}`);
            //  console.log("get Owned Properties:", result);
            let dataList = [{
                key: 0,
                no: '',
                Properties: '',
                Location: '',
                Remarks: '',
            }];

            result.data.list?.map((x, i) => {
                dataList.push({
                    key: x.id,
                    no: i + 1,
                    Properties: x.properties,
                    Location: x.location,
                    Remarks: x.remarks,
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

    /*useEffect(() =>
    {
        console.log('loan product ' + data.loanProd);
    }, [data])*/

    /*const [fieldErrors, setFieldErrors] = React.useState({
        Properties: '',
        Location: '',
        Remarks: '',
    });*/

    function GetPropertiesOption() {
        const Properties = form.getFieldValue('properties');
        const PropertiesOptionHolder = DropdownOwnedProperties().find(
            (x) => x.label === Properties || x.value === Properties
        );
        return PropertiesOptionHolder ? PropertiesOptionHolder.value : null;
    }

    function validateLoan(Properties) {
        return Properties !== '';
    }

    function validateAmount(Location) {
        return Location.trim() !== '';
    }
    function validateRemarks(Remarks) {
        return Remarks.trim() !== '';
    }

    const [getAddStat, setAddStat] = React.useState(false)


    async function onClickSave() {
        /* let errors = {};
 
         if (!validateLoan(getInfo.Properties)) {
             errors.Properties = 'Properties is required.';
         }
 
         if (!validateAmount(getInfo.Location)) {
             errors.Location = 'Location is required.';
         }
         if (!validateRemarks(getInfo.Remarks)) {
             errors.Remarks = 'Remarks is required.';
         }
 
         if (Object.keys(errors).length > 0) {
             setFieldErrors(errors);
             return;
         }
         setFieldErrors({ Properties: '', Location: '', Remarks: '' });*/

        setStat(false);
        const row = await form.validateFields();
        const data = {
            LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
            Properties: row.properties,
            Location: row.location,
            Remarks: row.remarks,
            RecUser: jwtDecode(token).USRID
        }
        //console.log(data)
        await axios.post('/addOwnedProperties', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getOwnedProperties'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        Properties: '',
                        Location: '',
                        Remarks: '',
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

    async function onClickEdit() {
        /*  let errors = {};
          if (!validateLoan(getInfo.Properties)) {
              errors.Properties = 'Properties is required.';
          }
  
          if (!validateAmount(getInfo.Location)) {
              errors.Location = 'Location is required.';
          }
  
          if (!validateRemarks(getInfo.Remarks)) {
              errors.Remarks = ' Remarks is required.';
          }
  
  
  
          if (Object.keys(errors).length > 0) {
              setFieldErrors(errors);
              return;
          }
          // Clear errors if validation passes
          setFieldErrors({ Properties: '', Location: '', Remarks: '' });*/

        try {
            const row = await form.validateFields();
            const data = {
                Id: editingKey,
                Properties: GetPropertiesOption(),
                Location: row.location,
                Remarks: row.remarks,
                ModUser: jwtDecode(token).USRID
            };

             console.log('Data to be sent to the server:', data);
            const result = await axios.post('/editOwnedProperties', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getOwnedProperties'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    Properties: '',
                    Location: '',
                    Remarks: '',
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
            const result = await axios.post(`/DeleteOwnedProperties/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getOwnedProperties'] }, { exact: true });
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
    const [form] = Form.useForm();
    const columns = [
        {
            title: (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Tooltip title='Add'>
                    <Button className='bg-[#3b0764]' type='primary' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || getAddStat}
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            const record = { key: 0, properties: '', location: '', remarks: '' }
                            edit(record)
                            setStat(false)
                            setEditingKey(0);
                            setAddStat(!getAddStat)
                            setInfo({
                                ...getInfo,
                                Properties: '',
                                Location: '',
                                Remarks: '',
                            })
                        }} />

                </Tooltip>
            </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '8px',
            align: 'center',
        },
        {
            title: 'Properties',
            dataIndex: 'properties',
            key: 'properties',
            width: '40px',
            editable: true,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: '40px',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '100px',
            editable: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '15px',
            fixed: 'right',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);
                if (User === 'Lp') {
                    return null;
                }
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
                                    <Button icon={<SaveOutlined />} type="primary" />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel this record?"
                                    onConfirm={() => {

                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"
                                >
                                    <Button icon={<CloseOutlined />} type="primary" danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                } else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <Popconfirm
                                    title="Are you sure you want to save the changes?"
                                    onConfirm={() => { onClickEdit(); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<SaveOutlined />} type="primary" />
                                </Popconfirm>
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel the edit?"
                                    onConfirm={() => {

                                        setStat(true);
                                        setAddStat(!getAddStat);
                                        setEditingKey('');
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<CloseOutlined />} type="primary" danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={role === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} onClick={() => {

                                        edit(record);
                                        setAddStat(!getAddStat);
                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => { onClickDelete(record.key); }}
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


    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: record.key,
            Properties: record.properties,
            Location: record.location,
            Remarks: record.remarks,
        })
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

    async function onChangeProperties(e, pointer) {
        if (pointer === 'properties') { form.setFieldsValue({ 'properties': e }); }
    }

    async function onChangeToUpper(e, pointer) {
        if (pointer === 'location') { form.setFieldsValue({ 'location': toUpperText(e) }) }
        else { form.setFieldsValue({ 'remarks': toUpperText(e) }) }
    }


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
        const inputNode = dataIndex === 'properties'
            ? (
                <>
                    <Select
                        className='w-[13rem]'
                        onChange={(value) => { onChangeProperties(value); }}
                        placeholder='Properties'
                        options={DropdownOwnedProperties().map(x => ({
                            value: x.value,
                            label: x.label
                        }))}
                    />
                </>
            )
            : dataIndex === 'location'
                ? (
                    <>
                        <Input
                            className='w-[13rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'location'); }}
                            placeholder='Location' />
                    </>
                )
                : dataIndex === 'remarks'
                    ? (
                        <>
                            <Input
                                className='w-[13rem]'
                                onChange={(e) => { onChangeToUpper(e.target.value, 'remarks'); }}
                                placeholder='Remarks' />
                        </>
                    ) : null
        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={[
                    {
                        required: true,
                        message: `Please Input ${title}`,
                    },
                ]}>
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dataOnly = Array.isArray(getOwnedProperties.data)
        ? getOwnedProperties.data.filter(x => x.key !== 0)
        : [];

    return (
        <div className='h-[500px] flex flex-col items-center'>
            {contextHolder}
            <div className='mt-[5rem] w-[100%]'>
                <div className='mt-[-5rem]'>
                    <center>
                        <SectionHeader title="Owned Properties of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-[0rem]'>
                    <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                        <Spin spinning={loading} tip="Please wait..." className="flex justify-center items-center">
                        <Form form={form} component={false} >
                            <Table
                                columns={mergedColumns.map((col) => ({
                                    ...col,
                                    width: col.width || '25%',
                                }))}
                                dataSource={
                                    getStat === false
                                        ? getOwnedProperties.data?.map((x) => ({
                                            key: x.key,
                                            no: x.no,
                                            properties: DropdownOwnedProperties().find((option) => option.value === x.Properties)?.label || x.Properties,
                                            location: x.Location,
                                            remarks: x.Remarks,
                                        }))
                                        : dataOnly?.map((x) => ({
                                            key: x.key,
                                            no: x.no,
                                            properties: DropdownOwnedProperties().find((option) => option.value === x.Properties)?.label || x.Properties,
                                            location: x.Location,
                                            remarks: x.Remarks,
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

export default OwnedProperties;
