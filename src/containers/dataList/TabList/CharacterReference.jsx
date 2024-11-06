
import React, {useState} from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, Spin } from 'antd';
import { SaveOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import StatusRemarks from './StatusRemarks';
import axios from 'axios';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { GetData } from '@utils/UserData';


function CharacterReference({ classname, BorrowerId, Creator, isEdit, User, data }) {
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [loading, setLoading] = useState(true);
    const [contactError, setContactError] = React.useState('')
    const [getInfo, setInfo] = React.useState({
        key: '',
        name: '',
        conNum: '',
        relShip: '',
        prov: '',
        /* city: '',
         barangay: '',*/
        remarks: '',
    })
    React.useEffect(() => { getCharacterRef.refetch() }, [BorrowerId])
    const [getStat, setStat] = React.useState(true)
    const role = GetData('ROLE') ? GetData('ROLE').toString() : null;
    const getCharacterRef = useQuery({
        queryKey: ['getCharacterRef'],
        queryFn: async () => {
            const result = await axios.get(`/getCharacterRef/${BorrowerId}`);
            let dataList = [{
                key: 0,
                no: '',
                name: '',
                conNum: '',
                relShip: '',
                prov: '',
                /* city: '',
                 barangay: '',*/
                remarks: '',
            }]

            result.data.list?.map((x, i) => {
                dataList.push({
                    key: x.characterRefId,
                    no: i + 1,
                    name: x.fullName,
                    conNum: x.mobileNo,
                    relShip: x.relationship,
                    prov: x.province,
                    /* city: x.municipality,
                     barangay: x.barangay,*/
                    remarks: x.remarks
                })
            })
            setLoading(false);
            return dataList
        },
        refetchInterval: 5000,
        enabled: true,
        retryDelay: 1000,
    })

    const getRelationshipList = useQuery({
        queryKey: ['getRelationshipList'],
        queryFn: async () => {
            const result = await axios.get('/getRelationship');
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function GetReshipId() {
        const ReshipHolder = getRelationshipList.data?.find((x) => x.description === getInfo.relShip || x.code === getInfo.relShip)
        return ReshipHolder.code
    }


    const [getProvList, setProvList] = React.useState()
    const provinceList = useQuery({
        queryKey: ['getProvinceSelect'],
        queryFn: async () => {
            const result = await axios.get('/getProvince');
            setProvList(result.data.list)
            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function GetProvId() {
        let dataHolder = getProvList;
        if (!dataHolder) {
            return null; // Or handle the case where the data is not available
        }
        const ProvHolder = dataHolder.find((x) => x.provinceDescription === getInfo.prov || x.provinceCode === getInfo.prov);
        return ProvHolder ? ProvHolder.provinceCode : null;
    }

    /* const [getCityList, setCityList] = React.useState()
    const cityList = useQuery({
        queryKey: ['getCitySelect'],
        queryFn: async () => {
            const result = await axios.get(`/getMuniArea/${GetProvId()}`);
            setCityList(result.data.list)
            return result.data.list;
        },
        enabled: false
    });

    React.useEffect(() => {
        cityList.refetch()
    }, [getInfo.prov])

    function GetCityId() {
        let dataHolder = getCityList
        const CityHolder = dataHolder.find((x) => x.munDesc === getInfo.city || x.munCode === getInfo.city)
        return CityHolder.munCode
    }

    const [getBrgyList, setBrgyList] = React.useState()
    const brgyList = useQuery({
        queryKey: ['getBrgySelect'],
        queryFn: async () => {
            const result = await axios.get(`/getbarangaylist/${GetCityId()}`);
            setBrgyList(result.data.list)
            return result.data.list;
        },
        enabled: false
    });

    React.useEffect(() => {
        brgyList.refetch()
    }, [getInfo.city])

    function GetBrgyId() {
        let dataHolder = getBrgyList
        const BrgyHolder = dataHolder.find((x) => x.description === getInfo.barangay || x.code === getInfo.barangay)
        return BrgyHolder.code
    }*/

    function validateContactNumber(number) {
        return /^09\d{9}$/.test(number);
    }
    function validateFullName(name) {
        return name.trim() !== '';
    }
    function validateFullRelationship(relShip) {
        return relShip.trim() !== '';
    }
    function validateRemarks(remarks) {
        return remarks.trim() !== '';
    }


    const [fieldErrors, setFieldErrors] = React.useState({
        name: '',
        conNum: '',
        relShip: '',
    });

    const [getAddStat, setAddStat] = React.useState(false)
    async function onClickSave() {
        let errors = {};

        // Validate Name
        if (!validateFullName(getInfo.name)) {
            errors.name = 'Name is required.';
        }
        // Validate Contact Number
        if (!validateContactNumber(getInfo.conNum)) {
            errors.conNum = 'Contact number should have exactly 11 digits.';
        }
        // Validate Relationship
        if (!validateFullRelationship(getInfo.relShip)) {
            errors.relShip = 'Relationship is required.';
        }

        // If there are errors, set them and don't proceed
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        // Clear errors if validation passes
        setFieldErrors({ name: '', conNum: '', relShip: '', remarks: '' });


        setStat(false)
        const data = {
            BorrowersId: BorrowerId,
            FullName: getInfo.name,
            Relationship: GetReshipId(),
            MobileNo: getInfo.conNum,
            Remarks: getInfo.remarks || '',
           /* BarangayId: getInfo.barangay ? GetBrgyId().toString() : '',
            MunicipalityId: getInfo.city ? GetCityId().toString() : '',
           */ 
            ProvinceId: getInfo.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
            RecUser: Creator
        }

        await axios.post('/addCharacterRef', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });
                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
                    setStat(true)
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        name: '',
                        conNum: '',
                        relShip: '',
                        prov: '',
                        /*  city: '',
                          barangay: '',*/
                        remarks: '',
                    });

                    setFocus({
                        name: false,
                        conNum: false,
                        relShip: false,
                        prov: false,
                        /* city: false,
                         barangay: false,*/
                        remarks: false,
                    })
                }

            })
            .catch((error) => {
                console.log(error)
                api['error']({
                    message: 'Something went wrong',
                    description: error.message,
                });
            })
    }

    async function onClickEdit() {
        let errors = {};

        // Validate Name
        if (!validateFullName(getInfo.name)) {
            errors.name = 'Name is required.';
        }

        // Validate Contact Number
        if (!validateContactNumber(getInfo.conNum)) {
            errors.conNum = 'Contact number should have exactly 11 digits.';
        }

        // Validate Relationship
        if (!validateFullRelationship(getInfo.relShip)) {
            errors.relShip = 'Relationship is required.';
        }

        // If there are errors, set them and don't proceed
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        // Clear errors if validation passes
        setFieldErrors({ name: '', conNum: '', relShip: '', remarks: '' })

        getRelationshipList.refetch()
        provinceList.refetch()
        /*cityList.refetch()
        brgyList.refetch()*/

        const data = {
            CharacterRefId: getInfo.key,
            FullName: getInfo.name,
            Relationship: GetReshipId(),
            MobileNo: getInfo.conNum,
            Remarks: getInfo.remarks || '',
          /*  BarangayId: getInfo.barangay ? GetBrgyId().toString() : '',
            MunicipalityId: getInfo.city ? GetCityId().toString() : '',
            */
            ProvinceId: getInfo.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
            ModUser: Creator
        };
        await axios.post('/editCharacterRef', data)
            .then((result) => {
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description,
                });

                if (result.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
                    setStat(true);
                    setAddStat(false);
                    setEditingKey('');
                    setInfo({
                        key: '',
                        name: '',
                        conNum: '',
                        relShip: '',
                        prov: '',
                        /* city: '',
                         barangay: '',*/
                        remarks: '',
                    });
                    setFocus({
                        name: false,
                        conNum: false,
                        relShip: false,
                        prov: false,
                        /* city: false,
                         barangay: false,*/
                        remarks: false,
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

    async function onClickDelete(e) {
        try {
            const result = await axios.post(`/delete/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
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

    const columns = [
        {
            title: GetStatus === 'RELEASED' || GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' || GetStatus === 'FOR RE-APPLICATION' || GetStatus === 'FOR DOCUSIGN' || GetStatus === 'OK FOR DOCUSIGN'
                || GetStatus === 'TAGGED FOR RELEASE' || GetStatus === 'ON WAIVER' || GetStatus === 'CONFIRMATION' || GetStatus === 'CONFIRMED' || GetStatus === 'UNDECIDED' ||
                GetStatus === 'FOR DISBURSEMENT' || GetStatus === 'RELEASED' || GetStatus === 'RETURN TO LOANS PROCESSOR' || GetStatus === 'APPROVED (TRANS-OUT)' || GetStatus === 'RETURN TO CREDIT OFFICER' || GetStatus === 'RELEASED'
                ? (<></>)
                : (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                    <Tooltip title='Add'>
                        <Button className='bg-[#3b0764]' type='primary' disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || getAddStat}
                            icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                            onClick={() => {
                                setFocus({
                                    name: false,
                                    conNum: false,
                                    remarks: false,
                                })
                                setStat(false)
                                setEditingKey(0);
                                setAddStat(!getAddStat)
                                setInfo({
                                    ...getInfo,
                                    name: '',
                                    conNum: '',
                                    relShip: '',
                                    prov: '',
                                /*city: '',
                                barangay: '',
                               */ remarks: '',
                                })
                            }} />
                    </Tooltip>
                </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            fixed: 'left',
            align: 'center'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '150px',
            editable: true,
        },
        {
            title: 'Contact Number',
            dataIndex: 'conNum',
            key: 'conNum',
            width: '100px',
            editable: true,
        },
        {
            title: 'Relationship',
            dataIndex: 'relShip',
            key: 'relShip',
            width: '100px',
            editable: true,
        },
        {
            title: 'Province',
            dataIndex: 'prov',
            key: 'prov',
            width: '120px',
            editable: true,
        },
        /*{
            title: 'City / Municipality',
            dataIndex: 'city',
            key: 'city',
            width: '120px',
            editable: true,
        },
        {
            title: 'Barangay',
            dataIndex: 'barangay',
            key: 'barangay',
            width: '120px',
            editable: true,
        },*/
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '120px',
            editable: true,
        },
        {
            hidden: GetStatus === 'RELEASED' || GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' || GetStatus === 'FOR RE-APPLICATION' || GetStatus === 'FOR DOCUSIGN' || GetStatus === 'OK FOR DOCUSIGN'
                || GetStatus === 'TAGGED FOR RELEASE' || GetStatus === 'ON WAIVER' || GetStatus === 'CONFIRMATION' || GetStatus === 'CONFIRMED' || GetStatus === 'UNDECIDED' ||
                GetStatus === 'FOR DISBURSEMENT' || GetStatus === 'RELEASED' || GetStatus === 'RETURN TO LOANS PROCESSOR'
                ? true : false,
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '60px',
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
                                        setFocus({
                                            name: false,
                                            conNum: false,
                                            relShip: false,
                                            prov: false,
                                            /* city: false,
                                             barangay: false,*/
                                            remarks: false,
                                        })
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
                                <Button onClick={() => {
                                    onClickEdit()
                                }} icon={<SaveOutlined />} type='primary' />
                            </Tooltip>
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel the edit?"
                                    onConfirm={() => {
                                        setFocus({
                                            name: false,
                                            conNum: false,
                                            relShip: false,
                                            prov: false,
                                            /* city: false,
                                             barangay: false,*/
                                            remarks: false,
                                        })
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
                    ) : (
                        <Space>
                            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                                <Tooltip title='Edit'>
                                    <Button className='bg-[#3b0764]' disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || editingKey !== ''} onClick={() => {
                                        setFocus({
                                            name: false,
                                            conNum: false,
                                            relShip: false,
                                            prov: false,
                                            /* city: false,
                                             barangay: false,*/
                                            remarks: false,
                                        })
                                        edit(record)
                                        setAddStat(!getAddStat)
                                    }}
                                        type='primary' icon={<MdEditSquare />} />
                                </Tooltip>
                            </ConfigProvider>
                            <Tooltip title="Delete">
                                <Popconfirm
                                    title="Are you sure you want to delete this record?"
                                    onConfirm={() => {
                                        onClickDelete(record.key)
                                    }}
                                    okText="Yes"
                                    cancelText="Cancel"  >
                                    <Button disabled={role === '60' || User === 'Lp' || GetStatus === 'FOR APPROVAL' || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />

                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
            }
        },
    ];

    const [getFocus, setFocus] = React.useState({
        name: false,
        conNum: false,
        relShip: false,
        prov: false,
        /*city: false,
        barangay: false,*/
        remarks: false,
    })

    const [editingKey, setEditingKey] = React.useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        setInfo({
            ...getInfo,
            key: record.key,
            name: record.name,
            conNum: record.conNum,
            relShip: record.relShip,
            prov: record.prov,
            /*city: record.city,
            barangay: record.barangay,*/
            remarks: record.remarks,
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
        const inputNode = dataIndex === 'prov'
            ? <Select id='prov' className='w-[100%]' value={getInfo.prov || undefined} placeholder={'Province'} options={provinceList.data?.map((x) => ({ value: x.provinceDescription, label: x.provinceDescription, }))}
                onChange={(e) => { setInfo({ ...getInfo, prov: e, city: '', barangay: '' }) }}
                autoFocus={getFocus.prov}
                onKeyDown={handleTabPress}
                showSearch
                filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                }
            />
            /* : dataIndex === 'city'
                 ? <Select id='city' className='w-[100%]' value={getInfo.city || undefined} placeholder={'City / Municipality'} options={cityList.data?.map((x) => ({ value: x.munDesc, label: x.munDesc, }))}
                     onChange={(e) => { setInfo({ ...getInfo, city: e }) }}
                     autoFocus={getFocus.city}
                     onKeyDown={handleTabPress}
                     />
                 : dataIndex === 'barangay'
                     ? <Select id='barangay' className='w-[100%]' value={getInfo.barangay || undefined} placeholder={'Barangay'} options={brgyList.data?.map((x) => ({ value: x.description, label: x.description, }))}
                         onChange={(e) => { setInfo({ ...getInfo, barangay: e }) }}
                         autoFocus={getFocus.barangay}
                         onKeyDown={handleTabPress}
                     /> */
            : dataIndex === 'relShip' ? (
                <>
                    <Select id='relShip' className='w-[100%]' value={getInfo.relShip || undefined} placeholder={'Relationship'} options={getRelationshipList.data?.map((x) => ({ value: x.description, label: x.description, }))}
                        onChange={(e) => { setInfo({ ...getInfo, relShip: e }) }}
                        autoFocus={getFocus.relShip}
                        onKeyDown={handleTabPress}
                        showSearch
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                    />
                    {fieldErrors.relShip && (
                        <div className="text-red-500 mt-1 text-[7px] font-bold text-center">
                            {fieldErrors.relShip}
                        </div>
                    )}
                </>
            )
                : dataIndex === 'name' ? (
                    <>
                        <Input id='name' value={getInfo.name.toUpperCase()} onChange={(e) => { setInfo({ ...getInfo, name: e.target.value.toUpperCase() }); }} placeholder='Name' autoFocus={getFocus.name}
                            onKeyDown={handleTabPress}
                            onClick={() => handleFocus('name')} />
                        {fieldErrors.name && (
                            <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.name}</div>
                        )}
                    </>
                )
                    : dataIndex === 'conNum' ? (
                        <>
                            <Input
                                id='conNum'
                                value={getInfo.conNum}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, '');

                                    if (value.length > 11) {
                                        value = value.slice(0, 11);
                                    }

                                    if (!value.startsWith('09')) {
                                        value = '09' + value.slice(2);
                                    }

                                    setInfo({ ...getInfo, conNum: value });
                                    setContactError('');
                                }}
                                placeholder='Contact Number'
                                autoFocus={getFocus.conNum}
                                onKeyDown={handleTabPress}
                                onClick={() => handleFocus('conNum')}
                            />
                            {fieldErrors.conNum && (
                                <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.conNum}</div>
                            )}
                        </>
                    )
                        : (
                            <>
                                <Input id='remarks' value={getInfo.remarks.toUpperCase()} onChange={(e) => { setInfo({ ...getInfo, remarks: e.target.value.toUpperCase() }); }} placeholder='Remarks'
                                    autoFocus={getFocus.remarks}
                                    onKeyDown={handleTabPress}
                                    onClick={() => handleFocus('remarks')} />
                                {fieldErrors.remarks && (
                                    <div className='text-red-500 mt-1 text-[7px] font-bold text-center'> {fieldErrors.remarks}</div>
                                )}
                            </>
                        )

        return (
            <td {...restProps}>
                {editing ? (
                    <>
                        {inputNode}
                    </>
                ) : (
                    children
                )}
            </td>
        );
    };

    function handleTabPress(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            const formElements = Array.from(document.querySelectorAll('input, select'));
            const currentIndex = formElements.indexOf(event.target);
            const nextIndex = (currentIndex + 1) % formElements.length;

            formElements[nextIndex]?.focus();
            if (formElements[nextIndex]?.id === 'name') {
                handleFocus('name');
            } else if (formElements[nextIndex]?.id === 'conNum') {
                handleFocus('conNum');
            } else if (formElements[nextIndex]?.id === 'relShip') {
                handleFocus('relShip');
            } else if (formElements[nextIndex]?.id === 'prov') {
                handleFocus('prov');
            }/* else if (formElements[nextIndex]?.id === 'city') {
                handleFocus('city');
            } else if (formElements[nextIndex]?.id === 'barangay') {
                handleFocus('barangay');
            }*/ else if (formElements[nextIndex]?.id === 'remarks') {
                handleFocus('remarks');
            }
        }
    }
    function handleFocus(field) {
        setFocus({
            name: field === 'name',
            conNum: field === 'conNum',
            relShip: field === 'relShip',
            prov: field === 'prov',
            /* city: field === 'city',
             barangay: field === 'barangay',*/
            remarks: field === 'remarks',
        });
    }

    const dataOnly = getCharacterRef.data?.filter(x => x.key !== 0);
    return (
        <div className={classname}>
            {User !== 'Credit' && User !== 'Lp' && (<StatusRemarks isEdit={!isEdit} User={User} data={data} />)}
            {contextHolder}
            <div className='mt-[9rem] w-full'>
                <div className='mt-[-4rem]'>
                    <center>
                        <SectionHeader title="List of Character Reference" />
                    </center>
                </div>
                <div className='mt-[2rem]'>
                <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                    <Table
                        columns={mergedColumns.map(col => ({
                            ...col,
                            width: col.width || 'auto',
                        }))}
                        dataSource={
                            loading
                            ? []
                            : (getStat === false
                                ? getCharacterRef.data?.map((x) => ({
                                    key: x.key,
                                    no: x.no,
                                    name: x.name,
                                    conNum: x.conNum,
                                    relShip: x.relShip,
                                    prov: x.prov,
                                    remarks: x.remarks
                                }))
                                : dataOnly?.map((x) => ({
                                    key: x.key,
                                    no: x.no,
                                    name: x.name,
                                    conNum: x.conNum,
                                    relShip: x.relShip,
                                    prov: x.prov,
                                    remarks: x.remarks
                                }))
                            )
                        }
                        components={{ body: { cell: EditableCell } }}
                        rowClassName='editable-row'
                        pagination={false}
                        loading={{
                            spinning: loading,  
                            indicator: <Spin tip="Loading..." />,  
                        }}
                    />
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default CharacterReference;