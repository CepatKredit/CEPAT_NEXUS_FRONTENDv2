import React, { useEffect, useRef } from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, message, Spin, Form } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import moment from 'moment';
import axios from 'axios';
import { toDecrypt } from '@utils/Converter';
import { DropdownOwnedAssets } from '@utils/FixedData';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';
import { toUpperText } from '@utils/Converter';
import { LoanApplicationContext } from '@context/LoanApplicationContext';


function OwnedAsset({ data, User }) {
    const { SET_LOADING_INTERNAL, getAppDetails } = React.useContext(LoanApplicationContext);
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const saveButtonRef = useRef(null);
    const [deleteKey, setDeleteKey] = React.useState(null);
    const [getInfo, setInfo] = React.useState({
        LoanAppId: '',
        key: '',
        Category: '',
        Make: '',
        YearModel: '',
        PlateNo: '',

    });

    const [getStat, setStat] = React.useState(true);
    const role = GetData('ROLE').toString();



    const getOwnedAssets = useQuery({
        queryKey: ['getOwnedAssets'],
        queryFn: async () => {
            const sidcDecrypted = toDecrypt(localStorage.getItem('SIDC'));
            try {
                const result = await axios.get(`/GET/G110OA/${toDecrypt(localStorage.getItem('SIDC'))}`);
                let dataList = [{
                    key: 0,
                    no: '',
                    Category: '',
                    Make: '',
                    YearModel: '',
                    PlateNo: '',
                }];

                result.data.list?.map((x, i) => {
                    dataList.push({
                        key: x.id,
                        no: i + 1,
                        Category: x.category,
                        Make: x.make,
                        YearModel: x.yearModel,
                        PlateNo: x.plateNo,
                    });
                });
                SET_LOADING_INTERNAL('AssetTABLE', false)
                return dataList;
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('AssetTABLE', false);
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
            SET_LOADING_INTERNAL('AssetTABLE', true)
            getOwnedAssets.refetch();
    }, [getAppDetails]);

    function GetAssetsOption() {
        const categoryValue = form.getFieldValue('category');
        const CategoryOptionHolder = DropdownOwnedAssets().find(
            (x) => x.label === categoryValue || x.value === categoryValue
        );
        return CategoryOptionHolder ? CategoryOptionHolder.value : null;
    }

    const [getAddStat, setAddStat] = React.useState(false)

    async function onClickSave() {
        setStat(false);
        const row = await form.validateFields();
        onClickSaveData.mutate(row);
    }


    const onClickSaveData = useMutation({
        mutationFn: async (row) => {
            const data = {
                LoanAppId: toDecrypt(localStorage.getItem('SIDC')),
                Category: GetAssetsOption(),
                Make: row.make,
                YearModel: row.yearModel,
                PlateNo: row.plateNo,
                RecUser: jwtDecode(token).USRID
            }
            await axios.post('/POST/P133AOA', data)
                .then((result) => {
                    api[result.data.status]({
                        message: result.data.message,
                        description: result.data.description,
                    });
                    if (result.data.status === 'success') {
                        queryClient.invalidateQueries({ queryKey: ['getOwnedAssets'] }, { exact: true });
                        setStat(true);
                        setAddStat(false);
                        setEditingKey('');
                        setInfo({
                            Category: '',
                            Make: '',
                            YearModel: '',
                            PlateNo: '',
                        });
                    }
                })
                .catch((error) => {
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message,
                    });
                })
            saveButtonRef.current?.focus();
        }
    })
    async function onClickEdit() {
        const row = await form.validateFields();
        onClickEditData.mutate(row);
    }

    const onClickEditData = useMutation({
        mutationFn: async (row) => {
            try {
                const data = {
                    Id: editingKey,
                    Category: GetAssetsOption(),
                    Make: row.make,
                    YearModel: row.yearModel,
                    PlateNo: row.plateNo,
                    ModUser: jwtDecode(token).USRID
                };
                console.log('Data to be sent to the server:', data);
                const result = await axios.post('/POST/P134UOA', data);
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });

                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getOwnedAssets'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        key: '',
                        Category: '',
                        Make: '',
                        YearModel: '',
                        PlateNo: '',
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
        setDeleteKey(e);
        onClickDeleteData.mutate(e, {
            onSettled: () => {
                setDeleteKey(null);
            },
        });
    }

    const onClickDeleteData = useMutation({
        mutationFn: async (e) => {
            try {
                const result = await axios.post(`/POST/P135DOA/${e}`);
                queryClient.invalidateQueries({ queryKey: ['getOwnedAssets'] }, { exact: true });
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
        if (GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40') {
            if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/approved'
                || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled'
                || LOCATION === '/ckfi/declined' || LOCATION === '/ckfi/for-re-application' || LOCATION === '/ckfi/assessement/credit') {
                console.log('MA')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '20') {
            {
                if (LOCATION === '/ckfi/credit-list' || LOCATION === '/ckfi/under-credit' || LOCATION === '/ckfi/for-approval'
                    || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/under-lp' || LOCATION === '/ckfi/for-re-application'
                    || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') {
                    console.log('LC')
                    return true
                }
                else { return false }
            }
        }
        else if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
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
                console.log('CRO')
                return true
            }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '70') {
            console.log('LPA')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/undecided'
                || LOCATION === '/ckfi/returned/credit-officer' || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else if (GetData('ROLE').toString() === '80') {
            console.log('LPO')
            if (LOCATION === '/ckfi/for-docusign' || LOCATION === '/ckfi/for-disbursement' || LOCATION === '/ckfi/released' || LOCATION === '/ckfi/reassessed/credit-officer'
                || LOCATION === '/ckfi/returned/credit-associate' || LOCATION === '/ckfi/approved' || LOCATION === '/ckfi/confirmation' || LOCATION === '/ckfi/confirmed' || LOCATION === '/ckfi/undecided'
                || LOCATION === '/ckfi/returned/credit-officer' || LOCATION === '/ckfi/on-waiver' || LOCATION === '/ckfi/cancelled' || LOCATION === '/ckfi/declined') { return true }
            else { return false }
        }
        else { return false }
    }

    const [getStatus, setStatus] = React.useState(false)
    React.useEffect(() => { setStatus(DISABLE_STATUS(localStorage.getItem('SP'))); }, [localStorage.getItem('SIDC')])
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER', 'COMPLIED - LACK OF DOCUMENTS'
    ];
    const [form] = Form.useForm();
    const columns = [
        {

            title: (<div className="flex items-center">
                {!DISABLE_STATUS(localStorage.getItem('SP')) && !disabledStatuses.includes(GetStatus) && (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Tooltip title='Add'>
                            <Button className='bg-[#3b0764]' type='primary'
                                icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                                onClick={() => {
                                    const record = { key: 0, category: '', make: '', yearModel: '', plateNo: '' }
                                    edit(record)
                                    setStat(false)
                                    setEditingKey(0);
                                    setAddStat(!getAddStat)
                                    setInfo({
                                        ...getInfo,
                                        Category: '',
                                        Make: '',
                                        YearModel: '',
                                        PlateNo: '',
                                    })
                                }} />

                        </Tooltip>
                    </ConfigProvider>
                )}
            </div>
            ),
            dataIndex: 'no',
            key: 'no',
            width: '5%',
            align: 'center'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '20%',
            editable: true,
        },
        {
            title: 'Make',
            dataIndex: 'make',
            key: 'make',
            width: '15%',
            editable: true,
        },
        {
            title: 'Year Model',
            dataIndex: 'yearModel',
            key: 'yearModel',
            width: '15%',
            editable: true,
        },
        {
            title: 'Remarks',
            dataIndex: 'plateNo',
            key: 'plateNo',
            width: '25%',
            editable: true,
        },
        {
            hidden: DISABLE_STATUS(localStorage.getItem('SP')) || disabledStatuses.includes(GetStatus),
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            fixed: 'right',
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
                    );
                } else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8', colorPrimaryHover: '#34b330' } }}>
                                    <Button loading={onClickEditData.isPending} icon={<SaveOutlined />} type='primary' onClick={onClickEdit} className='bg-[#2b972d]' />
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
                                    <Button loading={deleteKey === record.key} disabled={editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
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
            category: record.category,
            make: record.make,
            yearModel: record.yearModel,
            plateNo: record.plateNo,
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
    async function onChangeCategory(e, pointer) {
        if (pointer === 'category') { form.setFieldsValue({ 'category': e }); }
    }

    async function onChangeToUpper(e, pointer) {

        if (pointer === 'make') {
            form.setFieldsValue({ 'make': e });
        } else if (pointer === 'yearModel') {
            form.setFieldsValue({ 'yearModel': e });
        } else {
            form.setFieldsValue({ 'plateNo': e });
        }
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
        const inputNode = dataIndex === 'category'
            ? (
                <>
                    <Select
                        className='w-[13rem]'
                        onChange={(value) => { onChangeCategory(value); }}
                        placeholder='Category'
                        options={DropdownOwnedAssets().map(x => ({
                            value: x.value,
                            label: x.label
                        }))}
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </>
            )
            : dataIndex === 'make'
                ? (
                    <>

                        <Input
                            className='w-[10rem]'
                            onChange={(e) => { onChangeToUpper(e.target.value, 'make'); }}
                            placeholder='Make' />
                    </>
                )
                : dataIndex === 'yearModel'
                    ? (
                        <>

                            <Input
                                className='w-[10rem]'
                                onChange={(e) => { onChangeToUpper(e.target.value, 'yearModel'); }}
                                placeholder='Year Model' />
                        </>
                    )
                    : dataIndex === 'plateNo'
                        ? (
                            <>

                                <Input
                                    className='w-[17rem]'
                                    onChange={(e) => { onChangeToUpper(e.target.value, 'plateNo'); }}
                                    placeholder='Remarks' />

                            </>
                        ) : null
        return (
            <td {...restProps}>
                {editing ? (<Form.Item name={dataIndex} style={{ margin: 0, }} rules={
                    dataIndex !== 'plateNo' ? [{ required: true, message: `Please Input ${title}` }] : []
                }>
                    {inputNode}
                </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const dataOnly = Array.isArray(getOwnedAssets.data)
        ? getOwnedAssets.data.filter(x => x.key !== 0)
        : [];

    return (
        <div className='flex flex-col items-center'>
            {contextHolder}
            <div className=' w-full px-2'>
                <div>
                    <center>
                        <SectionHeader title="Owned Assets of OFW / Seaman" />
                    </center>
                </div>
                <div className='mt-[0rem]'>
                    <Form form={form} component={false} >
                        <Table
                            columns={mergedColumns}
                            dataSource={
                                getStat === false
                                    ? getOwnedAssets.data?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        category: DropdownOwnedAssets().find((option) => option.value === x.Category)?.label || x.Category,
                                        make: x.Make,
                                        yearModel: x.YearModel,
                                        plateNo: x.PlateNo,
                                    }))
                                    : dataOnly?.map((x) => ({
                                        key: x.key,
                                        no: x.no,
                                        category: DropdownOwnedAssets().find((option) => option.value === x.Category)?.label || x.Category,
                                        make: x.Make,
                                        yearModel: x.YearModel,
                                        plateNo: x.PlateNo,
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

export default OwnedAsset;
