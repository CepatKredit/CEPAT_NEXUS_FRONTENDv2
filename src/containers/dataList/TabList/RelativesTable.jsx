import React from 'react';
import { Typography, Button, Table, Input, ConfigProvider, notification, Select, Tooltip, Popconfirm, Space, DatePicker, Spin } from 'antd';
import { SaveOutlined, EditOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { WorkEducStatusOption } from '@utils/FixedData';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import axios from 'axios';
import SectionHeader from '@components/validation/SectionHeader';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import dayjs from 'dayjs';
import { GetData } from '@utils/UserData';
import { getDependentsCount } from '@hooks/DependentsController';


function Relatives({ BorrowerId, onUpdateCount, User }) {
    const suffixRef = React.useRef();
    const { setCount } = getDependentsCount();
    const saveButtonRef = React.useRef();
    const token = localStorage.getItem('UTK');
    const [api, contextHolder] = notification.useNotification()
    const queryClient = useQueryClient();
    const { GetStatus } = ApplicationStatus();
    const [editingKey, setEditingKey] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [getInfo, setInfo] = React.useState({
        RelativeID: '',
        key: '',
        FullName: '',
        Suffix: '',
        ContactNo: '',
        Birthdate: '',
        WorkEducStatus: '',
        Relationship: '',
    });

    const [getStat, setStat] = React.useState(true);
    React.useEffect(() => {
        getRelatives.refetch()
        getRelativeSuffix.refetch()
    }, [BorrowerId]);

    const getRelatives = useQuery({
        queryKey: ['getRelatives'],
        queryFn: async () => {
            const result = await axios.get(`/getRelatives/${BorrowerId}`);
            //  console.log("API Result:", result);

            let dataList = [{
                key: 0,
                no: '',
                FullName: '',
                Suffix: '',
                ContactNo: '',
                Birthdate: '',
                WorkEducStatus: '',
                Relationship: '',
            }];

            result.data.list?.map((x, i) => {
                const suffix = x.suffix && x.suffix !== 'N/A' ? x.suffix : '';

                const fullNames = `${x.fullName || ''} ${suffix}`.trim();
                //console.log("Key:", x.code); 
                //   console.log("Full Name:", fullName);
                dataList.push({
                    key: x.code,
                    no: i + 1,
                    FullName: x.fullName,
                    Suffix: x.suffix,
                    FullNameSuffix: fullNames,
                    ContactNo: x.contactNo,
                    Birthdate: x.birthdate,
                    WorkEducStatus: x.workEducStatus,
                    Relationship: x.relationship,
                });
            });

            const updatedCount = dataList.length;
            setCount(updatedCount);
            onUpdateCount(updatedCount);
            setLoading(false);
            return dataList;
        },
        refetchInterval: (data) => {
            data?.length === 0 ? 500 : false;
        },
        enabled: true,
        retryDelay: 1000,
    });

    /*if (getRelatives.data) {
        console.log("Row count:", getRelatives.data.length - 1);
    }*/


    const [getReshipList, setReshipList] = React.useState()
    const getRelationshipList = useQuery({
        queryKey: ['getRelationshipList'],
        queryFn: async () => {
            const result = await axios.get('/getRelativesRelationship');
            setReshipList(result.data.list)
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
        if (!getRelationshipList.data) {
            return null; // or handle appropriately
        }
        const ReshipHolder = getRelationshipList.data.find(
            (x) => x.description === getInfo.Relationship || x.code === getInfo.Relationship
        );
        return ReshipHolder ? ReshipHolder.code : null; // Safely return the code or null
    }

    const [getSuffixList, setSuffixList] = React.useState()
    const getRelativeSuffix = useQuery({
        queryKey: ['getRelativeSuffix'],
        queryFn: async () => {
            const result = await axios.get('/getRelativesSuffix');
            setSuffixList(result.data.list)

            return result.data.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    function GetSuffixId() {
        if (!getSuffixList) {
            return null; // or handle appropriately
        }
        const SuffixHolder = getSuffixList.find(
            (x) => x.description === getInfo.Suffix || x.code === getInfo.Suffix
        );

        return SuffixHolder ? SuffixHolder.code : null; // Safely return the code or null
    }


    function GetWorkEducStatusId() {
        const workEducStatusHolder = WorkEducStatusOption().find(
            (x) => x.label === getInfo.WorkEducStatus || x.value === getInfo.WorkEducStatus
        );
        return workEducStatusHolder ? workEducStatusHolder.value : null;
    }

    const [fieldErrors, setFieldErrors] = React.useState({
        FullName: '',
        ContactNo: '',
        relationship: '',
        suffix: '',
        Birthdate: '',
        WorkEducStatus: '',

    });

    function validateContactNumber(ContactNo) {

        return ContactNo.trim() === '' || /^09\d{9}$/.test(ContactNo);
    }

    function validateFullName(FullName) {
        return FullName.trim() !== '';
    }
    function validateSuffix(suffix) {
        return suffix !== '';
    }

    function validateFullRelationship(relationship) {
        return relationship.trim() !== '';
    }
    function validateFullbdate(Birthdate) {
        return Birthdate.trim() !== '';
    }
    function validateWEstatus(WorkEducStatus) {
        return WorkEducStatus !== '';
    }


    const [getAddStat, setAddStat] = React.useState(false)

    async function onClickSave() {
        let errors = {};
        if (!validateFullName(getInfo.FullName)) {
            errors.FullName = 'Name is required.';
        }
        if (getInfo.ContactNo.trim() !== '' && !validateContactNumber(getInfo.ContactNo)) {
            errors.ContactNo = 'Contact number should have exactly 11 digits and start with 09.';
        }
        if (!validateFullRelationship(getInfo.Relationship)) {
            errors.relationship = 'Relationship is required.';
        }
        if (!validateFullbdate(getInfo.Birthdate)) {
            errors.Birthdate = 'Birthdate is required.';
        }
        if (!validateWEstatus(getInfo.WorkEducStatus)) {
            errors.WorkEducStatus = 'Work/Educ Status is required.';
        }
        if (!validateSuffix(getInfo.Suffix)) {
            errors.suffix = 'Suffix is required.';
        }



        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }




        setFieldErrors({ ContactNo: '', FullName: '', relationship: '', Birthdate: '', WorkEducStatus: '', Suffix: '' });

        setStat(false);
        const formattedBirthdate = getInfo.Birthdate ? moment(getInfo.Birthdate).format('MM-DD-YYYY') : '';

        const data = {
            BorrowersId: BorrowerId,
            Fullname: getInfo.FullName,
            Suffix: GetSuffixId(),
            Contactno: getInfo.ContactNo,
            Birthdate: formattedBirthdate,
            workEducStatus: getInfo.WorkEducStatus,
            Relationship: GetReshipId(),
            RecUser: jwtDecode(token).USRID
        }

        try {
            const result = await axios.post('/addRelatives', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getRelatives'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    FullName: '',

                    Suffix: '',
                    ContactNo: '',
                    Birthdate: '',
                    WorkEducStatus: '',
                    Relationship: '',
                });
                handleFocus('fullName');
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message,
            });
        }

    }
    function handleCancel() {
        setFocus({
            fullName: true,
            suffix: false,
            contactNo: false,
            relationship: false,
            birthdate: false,
            workEducStatus: false,
        });
        setStat(true);
        setAddStat(false);
        setEditingKey('');
    }




    async function onClickEdit() {
        let errors = {};
        if (!validateFullName(getInfo.FullName)) {
            errors.FullName = 'Name is required.';
        }

        if (getInfo.ContactNo.trim() !== '' && !validateContactNumber(getInfo.ContactNo)) {
            errors.ContactNo = 'Contact number should have exactly 11 digits and start with 09.';
        }

        if (!validateFullbdate(getInfo.Birthdate)) {
            errors.Birthdate = 'Birthdate is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }



        // Clear errors if validation passes
        setFieldErrors({ ContactNo: '', FullName: '', Birthdate: '' });


        getRelationshipList.refetch();
        getRelativeSuffix.refetch();
        const formattedBirthdate = getInfo.Birthdate ? moment(getInfo.Birthdate).format('MM-DD-YYYY') : '';
        try {
            const data = {
                Code: getInfo.key,
                Fullname: getInfo.FullName,
                Suffix: GetSuffixId(),
                Contactno: getInfo.ContactNo,
                Birthdate: formattedBirthdate,
                workEducStatus: GetWorkEducStatusId(),  // Use the mapped value
                Relationship: GetReshipId(),
                ModUser: jwtDecode(token).USRID
            };
            //console.log('suffix', data)

            const result = await axios.post('/editRelatives', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description,
            });

            if (result.data.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['getRelatives'] }, { exact: true });
                setStat(true);
                setAddStat(false);
                setEditingKey('');
                setInfo({
                    key: '',
                    FullName: '',
                    Suffix: '',
                    ContactNo: '',
                    Birthdate: '',
                    WorkEducStatus: '',
                    Relationship: '',
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
            const result = await axios.post(`/Relativedelete/${e}`);
            queryClient.invalidateQueries({ queryKey: ['getRelatives'] }, { exact: true });
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
    const calculateAge = (birthdate) => {
        if (!birthdate) return 'No Birthdate';
        const birthMoment = moment(birthdate, "MM-DD-YYYY");
        const today = moment();

        if (!birthMoment.isValid()) return 'Invalid Birthdate';
        const age = today.diff(birthMoment, 'years');

        return `Age: ${age} years old`;
    };
    const disabledStatuses = [
        'FOR APPROVAL', 'RELEASED', 'CANCELLED', 'DECLINED', 'FOR RE-APPLICATION',
        'FOR DOCUSIGN', 'OK FOR DOCUSIGN', 'TAGGED FOR RELEASE', 'ON WAIVER',
        'CONFIRMATION', 'CONFIRMED', 'UNDECIDED', 'FOR DISBURSEMENT', 'RETURN TO LOANS PROCESSOR', 'APPROVED (TRANS-OUT)',
        'RETURN TO CREDIT OFFICER', 'RELEASED'
    ];

    const columns = [
        {
            title: (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Tooltip title='Add'>
                    <Button className='bg-[#3b0764]' type='primary' disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || getAddStat}
                        icon={<PlusOutlined style={{ fontSize: '15px' }} />}
                        onClick={() => {
                            setStat(false)
                            setEditingKey(0);
                            setAddStat(!getAddStat)
                            setInfo({
                                ...getInfo,
                                FullName: '',
                                FullNameSuffix: '',
                                Suffix: '',
                                ContactNo: '',
                                Birthdate: '',
                                WorkEducStatus: '',
                                Relationship: '',
                            })
                        }} />

                </Tooltip>
            </ConfigProvider>),
            dataIndex: 'no',
            key: 'no',
            width: '40px',
            align: 'center'
        },

        {
            title: getAddStat || editingKey !== ''
                ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ width: '12rem', borderRight: '1px solid #ddd', paddingRight: '8px' }}>Full Name</span>
                        <span style={{ width: '12rem', paddingRight: '8px' }}>Suffix</span>
                    </div>
                )
                : 'Full Name',
            dataIndex: 'FullNameSuffix',
            key: 'fullName',
            width: getAddStat || editingKey !== '' ? '11rem' : '8rem',
            editable: true,
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNo',
            key: 'contactNo',
            width: '120px',
            editable: true,
        },
        {
            title: 'Birthdate',
            dataIndex: 'birthdate',
            key: 'birthdate',
            width: '100px',
            editable: true,
            render: (birthdate) => (
                <Tooltip title={calculateAge(birthdate)}>
                    {birthdate ? moment(birthdate).format("DD-MM-YYYY") : 'N/A'}
                </Tooltip>
            ),
        },
        {
            title: 'School / Employment',
            dataIndex: 'workEducStatus',
            key: 'workEducStatus',
            width: '120px',
            editable: true,
        },
        {
            title: 'Relationship',
            dataIndex: 'relationship',
            key: 'relationship',
            width: '100px',
            editable: true,
        },
        {
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
                            <Button
                                ref={saveButtonRef}
                                icon={<SaveOutlined />}
                                type='primary'
                                onClick={onClickSave}
                            />
                            {/*
                            <Tooltip title="Save">
                                <Popconfirm
                                    title="Are you sure you want to save this record?"
                                    onConfirm={() => { onClickSave(); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button ref={saveButtonRef} icon={<SaveOutlined />} type='primary' />
                                </Popconfirm>
                            </Tooltip>*/}

                            <Button
                                icon={<CloseOutlined />}
                                type="primary"
                                danger
                                onClick={handleCancel}
                            />
                            {/*
                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel this record?"
                                    onConfirm={() => {
                                        setFocus({
                                            fullName: false,
                                            suffix: false,
                                            contactNo: false,
                                            remarks: false,
                                            relationship: false,
                                            workEducStatus: false,
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
                            </Tooltip>*/}
                        </Space>
                    )
                }
                else {
                    return editable ? (
                        <Space>
                            <Tooltip title="Save">
                                <Popconfirm
                                    title="Are you sure you want to save this record?"
                                    onConfirm={() => { onClickSave(); }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button ref={saveButtonRef} icon={<SaveOutlined />} type='primary' />
                                </Popconfirm>
                            </Tooltip>

                            <Tooltip title="Cancel">
                                <Popconfirm
                                    title="Are you sure you want to cancel the edit?"
                                    onConfirm={() => {
                                        setFocus({
                                            firstName: false,
                                            contactNo: false,
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
                                    <Button className='bg-[#3b0764]' disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} onClick={() => {
                                        setFocus({
                                            firstName: false,
                                            suffix: false,
                                            contactNo: false,
                                            remarks: false,
                                            relationship: false,
                                            workEducStatus: false,
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
                                    <Button disabled={GetData('ROLE').toString() === '60' || User === 'Lp' || disabledStatuses.includes(GetStatus) || editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    )
                }
            }
        },
    ];

    const [getFocus, setFocus] = React.useState({
        fullName: true,
        suffix: false,
        contactNo: false,
        remarks: false,
        relationship: false,
        workEducStatus: false,
    })

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        setInfo({
            ...getInfo,
            key: record.key,
            FullName: record.fullName,
            Suffix: record.suffix,
            ContactNo: record.contactNo,
            Birthdate: record.birthdate,
            WorkEducStatus: record.workEducStatus,
            Relationship: record.relationship,
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
        const inputNode = dataIndex === 'FullNameSuffix'
            ? (
                <>
                    <Space>
                        <Input
                            id='fullName'
                            className='w-[10rem]'
                            value={(getInfo.FullName || '').toUpperCase()}
                            onChange={(e) => {
                                setInfo(prev => ({ ...prev, FullName: e.target.value.toUpperCase() }));
                            }}
                            placeholder='First Name'
                            autoFocus={getFocus.fullName}
                            onKeyDown={handleTabPress}

                        />

                        <Select
                            id='suffix'
                            ref={suffixRef} // Attach the ref to the Select component
                            className='w-[10rem] ml-[1rem]'
                            value={getInfo.Suffix || undefined}
                            placeholder='Suffix'
                            options={getRelativeSuffix.data?.map(x => ({ value: x.code, label: x.description }))}
                            onChange={e => {
                                setInfo(prev => ({ ...prev, Suffix: e }));

                                // Set focus back to the Suffix Select component after selection
                                setTimeout(() => {
                                    suffixRef.current?.focus();
                                }, 0);
                            }}
                            autoFocus={getFocus.suffix}
                            onKeyDown={handleTabPress}
                        />
                    </Space>
                    {fieldErrors.FullName && (
                        <div className="text-red-500 mt-1 ml-[-12rem] text-[7px] font-bold text-center">{fieldErrors.FullName}</div>
                    )}
                    {fieldErrors.suffix && (
                        <div className="text-red-500 mt-[-10px] ml-[7rem] text-[7px] font-bold text-center">{fieldErrors.suffix}</div>
                    )}
                </>
            )
            : dataIndex === 'contactNo'
                ? (
                    <>
                        <Input
                            id='contactNo'
                            value={getInfo.ContactNo || ''}
                            onChange={e => {
                                let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                if (!value.startsWith('09')) {
                                    value = '09' + value; // Ensure it starts with "09"
                                }
                                if (value.length > 11) {
                                    value = value.slice(0, 11); // Limit to 11 digits
                                }
                                setInfo(prev => ({ ...prev, ContactNo: value }));
                            }}
                            placeholder='Contact Number'
                            autoFocus={getFocus.contactNo}
                            onKeyDown={handleTabPress}
                        />

                        {fieldErrors.ContactNo && (
                            <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.ContactNo}</div>
                        )}
                    </>
                )
                : dataIndex === 'birthdate'
                    ? (<>
                        <DatePicker
                            id='birthdate'
                            format="MM-DD-YYYY"
                            value={getInfo.Birthdate ? dayjs(getInfo.Birthdate, 'MM-DD-YYYY') : null}  // Ensure value is correctly parsed
                            onChange={(date, dateString) => {
                                setInfo({ ...getInfo, Birthdate: date ? dayjs(date).format('MM-DD-YYYY') : '' });  // Use `date` for actual selection
                            }}
                            placeholder='Select Birthdate'
                            autoFocus={getFocus.birthdate}
                            onKeyDown={handleTabPress}
                        />
                        {fieldErrors.Birthdate && (
                            <div className="text-red-500 mt-1 ml-[-1rem] text-[7px] font-bold text-center">{fieldErrors.Birthdate}</div>
                        )}
                    </>
                    ) : dataIndex === 'workEducStatus'
                        ? (<>
                            <Select
                                id='workEducStatus'
                                className="w-[100%]"
                                value={getInfo.WorkEducStatus || undefined}
                                placeholder="School / Employment"
                                options={WorkEducStatusOption().map(x => ({
                                    value: x.value,
                                    label: x.label
                                }))}
                                onChange={e => {
                                    setInfo(prev => ({ ...prev, WorkEducStatus: e }));
                                }}
                                autoFocus={getFocus.workEducStatus}
                                onKeyDown={handleTabPress}
                            />
                            {fieldErrors.WorkEducStatus && (
                                <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.WorkEducStatus}</div>
                            )}
                        </>
                        )
                        : (<>


                            <Select
                                id='relationship'
                                className='w-[100%]'
                                value={getInfo.Relationship || undefined}
                                placeholder='Relationship'
                                options={getRelationshipList.data?.map(x => ({ value: x.description, label: x.description }))}
                                onChange={e => {
                                    setInfo(prev => ({ ...prev, Relationship: e }));
                                }}
                                autoFocus={getFocus.relationship}
                                onKeyDown={handleTabPress}
                            />
                            {fieldErrors.relationship && (
                                <div className="text-red-500 mt-1 text-[7px] font-bold text-center">{fieldErrors.relationship}</div>
                            )}
                        </>
                        );

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



    const dataOnly = Array.isArray(getRelatives.data)
        ? getRelatives.data.filter(x => x.key !== 0)
        : [];

    function handleTabPress(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            const formElements = Array.from(document.querySelectorAll('input, select'));
            const currentIndex = formElements.indexOf(event.target);

            // Check if current element is the last field (workEducStatus) before focusing Save button
            if (formElements[currentIndex]?.id === 'relationship') {
                saveButtonRef.current?.focus(); // Focus on Save button
            } else {
                // Move to the next field in the form
                const nextIndex = (currentIndex + 1) % formElements.length;
                formElements[nextIndex]?.focus();
                handleFocus(formElements[nextIndex]?.id); // Update the focused state
            }
        }
    }

    function handleFocus(field) {
        setFocus({
            fullName: field === 'fullName',
            suffix: field === 'suffix',
            contactNo: field === 'contactNo',
            relationship: field === 'relationship',
            birthdate: field === 'birthdate',
            workEducStatus: field === 'workEducStatus',
        });
    }


    return (
        <div className='h-[300px] flex flex-col items-center'>
            {contextHolder}
            <div className='mt-4 w-[100%]'>
                <center>
                    <SectionHeader title="OFW Dependents" />
                </center>
                <div className='mt-0'>
                    <Table
                        columns={mergedColumns}
                        dataSource={
                            loading
                                ? []
                                : (
                                    getStat === false
                                        ? getRelatives.data?.map((x) => ({
                                            key: x.key,
                                            no: x.no,
                                            fullName: x.FullName,
                                            suffix: x.Suffix,
                                            contactNo: x.ContactNo,
                                            birthdate: x.Birthdate,
                                            workEducStatus: WorkEducStatusOption().find((option) => option.value === x.WorkEducStatus)?.label || x.WorkEducStatus,
                                            relationship: x.Relationship,
                                            FullNameSuffix: x.FullNameSuffix,
                                        }))
                                        : dataOnly?.map((x) => ({
                                            key: x.key,
                                            no: x.no,
                                            fullName: x.FullName,
                                            suffix: x.Suffix,
                                            contactNo: x.ContactNo,
                                            birthdate: x.Birthdate,
                                            workEducStatus: WorkEducStatusOption().find((option) => option.value === x.WorkEducStatus)?.label || x.WorkEducStatus,
                                            relationship: x.Relationship,
                                            FullNameSuffix: x.FullNameSuffix,
                                        }))
                                )
                        }
                        components={{ body: { cell: EditableCell } }}
                        scroll={{ y: 200, x: '100vw' }}
                        rowClassName='editable-row'
                        pagination={false}
                        loading={{
                            spinning: loading,
                            indicator: <Spin tip="Loading..." />,
                        }}
                    />

                </div>
            </div>
        </div>
    );
}

export default Relatives;