import * as React from 'react'
import { Modal, Upload, Button, ConfigProvider, notification, Form, Image, Input, Popconfirm, Table, Select, Space } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { FileUpload } from '@hooks/FileController';
import { viewModal, viewPDFView } from '@hooks/ModalController';
import ViewPdf from '../uploadDocs/pdfToolbar/ViewPdf';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'
import axios from 'axios';
import { ChangeText, toEncrypt } from '@utils/Converter';

function CheckerDocument({ data, ClientId, Uploader }) {

    const [api, contextHolder] = notification.useNotification()
    const { fileList, addFile, updateFile, removeFile, clearList } = FileUpload()
    const { modalStatus, setStatus, storeData } = viewPDFView()
    const setModalStatus = viewModal((state) => state.setStatus)
    const queryClient = useQueryClient()

    const DocListICQuery = useQuery({
        queryKey: ['DocListICQuery'],
        queryFn: async () => {
            const result = await GET_LIST(`/GET/G16FT/${'IC'}`)
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    function NameList(command) {
        let names = []
        let OFW = { fname: data.ofwfname, lname: data.ofwlname }
        let BENE = { fname: data.benfname, lname: data.benlname }
        let ACB = { fname: data.coborrowfname, lname: data.coborrowlname }
        if (data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL') {
            if (command === 'ML') {
                names.push({
                    name: `${OFW.lname} ${OFW.fname}`,
                    desc: 'Principal Borrower',
                    emoji: 'PB'
                })
                if (BENE.fname !== '' || BENE.fname === undefined && BENE.lname !== '' || BENE.fname === undefined) {
                    names.push({
                        name: `${BENE.lname} ${BENE.fname}`,
                        desc: 'Co-Borrower',
                        emoji: 'CB'
                    })
                }
                if (ACB.fname !== '' || ACB.fname === undefined && ACB.lname !== '' || ACB.fname === undefined) {
                    names.push({
                        name: `${ACB.lname} ${ACB.fname}`,
                        desc: 'Additional Co-Borrower',
                        emoji: 'ACB'
                    })
                }
            }
            else {
                names.push({
                    name: `${OFW.fname} ${OFW.lname}`,
                    desc: 'Principal Borrower',
                    emoji: 'PB'
                })
                if (BENE.fname !== '' || BENE.fname === undefined && BENE.lname !== '' || BENE.fname === undefined) {
                    names.push({
                        name: `${BENE.fname} ${BENE.lname}`,
                        desc: 'Co-Borrower',
                        emoji: 'CB'
                    })
                }
                if (ACB.fname !== '' || ACB.fname === undefined && ACB.lname !== '' || ACB.fname === undefined) {
                    names.push({
                        name: `${ACB.fname} ${ACB.lname}`,
                        desc: 'Additional Co-Borrower',
                        emoji: 'ACB'
                    })
                }
            }
        }
        else {
            if (command === 'ML') {
                names.push({
                    name: `${OFW.lname} ${OFW.fname}`,
                    desc: 'Co-Borrower',
                    emoji: 'CB'
                })
                if (BENE.fname !== '' || BENE.fname === undefined && BENE.lname !== '' || BENE.fname === undefined) {
                    names.push({
                        name: `${BENE.lname} ${BENE.fname}`,
                        desc: 'Principal Borrower',
                        emoji: 'PB'
                    })
                }
                if (ACB.fname !== '' || ACB.fname === undefined && ACB.lname !== '' || ACB.fname === undefined) {
                    names.push({
                        name: `${ACB.lname} ${ACB.fname}`,
                        desc: 'Additional Co-Borrower',
                        emoji: 'ACB'
                    })
                }
            }
            else {
                names.push({
                    name: `${OFW.fname} ${OFW.lname}`,
                    desc: 'Co-Borrower',
                    emoji: 'CB'
                })
                if (BENE.fname !== '' || BENE.fname === undefined && BENE.lname !== '' || BENE.fname === undefined) {
                    names.push({
                        name: `${BENE.fname} ${BENE.lname}`,
                        desc: 'Principal Borrower',
                        emoji: 'PB'
                    })
                }
                if (ACB.fname !== '' || ACB.fname === undefined && ACB.lname !== '' || ACB.fname === undefined) {
                    names.push({
                        name: `${ACB.fname} ${ACB.lname}`,
                        desc: 'Additional Co-Borrower',
                        emoji: 'ACB'
                    })
                }
            }
        }
        return names
    }

    let checkFiles = true
    if (fileList.length === 0) { checkFiles = true }
    else { checkFiles = false }

    function handleRemove(file) {
        removeFile(file)
        CheckList.refetch()
    }

    async function handleBeforeUpload(file) {
        let checkType
        if (file.name.match(/\.(jpeg|jpg|png|gif|pdf)$/) !== null) {
            checkType = true
        }
        else { checkType = false }

        if (!checkType) {
            api['warning']({
                message: 'Unable to save file',
                description: `${file.name} is not allowed to upload in the system. 
                Please contact the System Administrator.`
            });
        }
        else {
            addFile({
                file: file,
                docsID: 'ID',
                fc: 'Please select category',
                nm: 'Please select name',
                remarks: 'Please input remarks',
                docStatus: '1'
            })
            CheckList.refetch()
        }
        return checkType || Upload.LIST_IGNORE;
    }

    function GetDocsCode(data) {
        const DocsCode = DocListICQuery.data?.find((x) => x.docsType === data ||
            x.id === data)
        return DocsCode.id
    }

    const defaultColumns = [
        {
            title: 'File',
            dataIndex: 'fl',
            key: 'fl',
            ellipsis: true,
        },
        {
            title: 'Financial Checker',
            dataIndex: 'fc',
            key: 'fc',
            width: '350px',
            editable: true
        },
        {
            title: 'Name',
            dataIndex: 'nm',
            key: 'nm',
            editable: true
        },
        // {
        //     title: 'Remarks',
        //     dataIndex: 'remarks',
        //     key: 'remarks',
        //     editable: true
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '100px',
        },
    ]

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const handleSave = (row) => {
        const newData = [...fileList];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row, });
    };

    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const [getFC, setFC] = React.useState()
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = React.useState(false);
        const inputRef = React.useRef(null);
        const form = React.useContext(EditableContext);
        React.useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            if (record[dataIndex].toUpperCase() === 'PLEASE SELECT CATEGORY' || record[dataIndex].toUpperCase() === 'PLEASE SELECT NAME' ||
                record[dataIndex].toUpperCase() === 'PLEASE INPUT REMARKS') {
                form.setFieldsValue({
                    [dataIndex]: '' || undefined,
                });
            }
            else {
                form.setFieldsValue({
                    [dataIndex]: record[dataIndex],
                });
            }
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values, });
                setFC(values.fc)
                if (dataIndex === 'fc') {
                    updateFile(record.key,
                        {
                            file: fileList[record.key].file,
                            docsID: GetDocsCode(values.fc),
                            fc: values.fc,
                            nm: 'Please select name',
                            remarks: fileList[record.key].remarks,
                            docStatus: fileList[record.key].docStatus
                        })
                    CheckList.refetch()
                }
                else if (dataIndex === 'nm') {
                    updateFile(record.key,
                        {
                            file: fileList[record.key].file,
                            docsID: GetDocsCode(fileList[record.key].fc),
                            fc: fileList[record.key].fc,
                            nm: values.nm,
                            remarks: fileList[record.key].remarks,
                            docStatus: fileList[record.key].docStatus
                        })
                    CheckList.refetch()
                }
                else {
                    updateFile(record.key,
                        {
                            file: fileList[record.key].file,
                            docsID: GetDocsCode(fileList[record.key].fc),
                            fc: fileList[record.key].fc,
                            nm: fileList[record.key].nm,
                            remarks: values.remarks,
                            docStatus: fileList[record.key].docStatus
                        })
                    CheckList.refetch()
                }

            } catch (errInfo) { }
        };

        let childNode = children;
        if (editable) {
            childNode = editing ?
                (<Form.Item style={{ margin: 0 }} name={dataIndex}
                    rules={[{ required: true, message: `${title} is required.`, },]}>
                    {dataIndex === 'fc'
                        ? (<Select ref={inputRef} value={fileList[record.key].fc} onKeyDown={(e) => { if (e.key.toUpperCase() === 'ENTER') { save() } }}
                            onBlur={() => { save() }} className='w-[100%]' options={DocListICQuery.data?.map((x) => ({ value: x.docsType, label: x.docsType, }))} />)
                        : dataIndex === 'nm'
                            ? (<Select ref={inputRef} value={fileList[record.key].nm} onKeyDown={(e) => { if (e.key.toUpperCase() === 'ENTER') { save() } }}
                                onBlur={() => { save() }} className='w-[100%]' options={NameList(getFC)?.map((x) => ({
                                    value: x.name, label: x.name, emoji: x.emoji, desc: x.desc
                                }))}
                                optionRender={(option) => (
                                    <Space>
                                        <span className='font-bold text-green-600'>
                                            {option.data.emoji}
                                        </span>
                                        <span className='font-semibold'>
                                            {option.data.value}
                                        </span>
                                        <span className='font-thin text-xs'>
                                            {option.data.desc}
                                        </span>
                                    </Space>
                                )} />)
                            : (<Input ref={inputRef} value={fileList[record.key].remarks}
                                onKeyDown={(e) => { if (e.key.toUpperCase() === 'ENTER') { save() } }} onBlur={save} />)}
                </Form.Item>)
                : (
                    <div className="editable-cell-value-wrap"
                        style={{ paddingInlineEnd: 24 }}
                        onClick={toggleEdit}  >
                        {children}
                    </div>
                )
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const CheckList = useQuery({
        queryKey: ['CheckList'],
        queryFn: async () => {
            let count = 0;
            let checker = false
            fileList.map((x) => {
                if (x.remarks.toUpperCase() === 'PLEASE SELECT CATEGORY' ||
                    x.remarks.toUpperCase() === 'PLEASE SELECT NAME') { count += 1 }
            })
            if (count >= 1) { checker = true }
            return checker
        },
        refetchInterval: 500,
    })

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    const onClickSaveFile = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            var MAX_LIMIT = 0
            let dfn_list = ''
            let docsID_list = ''
            let remarks_list = ''
            let docStatus_list = ''
            fileList.map((x) => {
                if (dfn_list === '') {
                    dfn_list += toEncrypt(x.nm) + ' ' + x.fc
                    docsID_list += x.docsID
                    remarks_list += x.remarks === 'Please input remarks' ? '' : x.remarks
                    docStatus_list += x.docStatus
                }
                else {
                    dfn_list += ',' + toEncrypt(x.nm) + ' ' + x.fc
                    docsID_list += ',' + x.docsID
                    x.remarks === 'Please input remarks' ? remarks_list += ',' + 'NO DATA' : remarks_list += ',' + x.remarks
                    docStatus_list += ',' + x.docStatus
                }
            })

            formData.append('client', ClientId)
            formData.append('docsID_list', docsID_list)
            formData.append('dfn_list', dfn_list)
            formData.append('remarks_list', remarks_list)
            formData.append('docStatus_list', docStatus_list)
            formData.append('prid', 'IC')
            formData.append('Uploader', Uploader)
            fileList.map((x) => {
                MAX_LIMIT += x.file.size
                formData.append('files', x.file);
            })
            if (MAX_LIMIT >= 40000000) {
                api['warning']({
                    message: 'File size limit',
                    description: 'The file is too large and cannot be uploaded. Please reduce the size of the file and try again.'
                })
            }
            else {
                await axios.post(`/GroupPost/P67UFF`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then((result) => {
                        api[result.data.status]({
                            message: result.data.message,
                            description: result.data.description
                        })
                        clearList()
                        setModalStatus(false)
                        queryClient.invalidateQueries({ queryKey: ['FileListFinQuery'] }, { exact: true })
                    })
                    .catch((error) => {
                        api['error']({
                            message: 'Something went wrong',
                            description: error.message
                        })
                    })
            }
        }
    })

    const [getImg, setImg] = React.useState({
        display: false,
        file: ''
    })

    return (
        <div className='pt-2 h-[100%]'>
            {contextHolder}
            <ViewPdf showModal={modalStatus} closeModal={() => { setStatus(false) }} />
            <Image style={{ display: 'none' }} preview={{
                visible: getImg.display,
                src: getImg.file,
                onVisibleChange: () => { setImg({ ...getImg, display: false, file: '' }) }
            }} />
            <div className='pt-2'>
                <Upload beforeUpload={handleBeforeUpload} className='w-100' multiple showUploadList={false}>
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button className='float-left bg-[#3b0764]' type='primary'
                            icon={<UploadOutlined />}>Upload</Button>
                    </ConfigProvider>
                </Upload>
                <div className='float-right'>
                    <ConfigProvider theme={{ token: { colorPrimary: '#166534' } }}>
                        <Popconfirm
                            title="Are you sure you want to save this files?"
                            onConfirm={() => { onClickSaveFile.mutate(''); }}
                            okText="Yes"
                            cancelText="Cancel" >
                            <Button className='float-right bg-[#166534]' type='primary' disabled={CheckList.data}
                                loading={onClickSaveFile.isPending} hidden={checkFiles} icon={<SaveOutlined />}>Save</Button>
                        </Popconfirm>
                    </ConfigProvider>
                </div>
                <Table columns={columns} scroll={{ y: 'calc(100vh - 360px)', x: '100%' }}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    dataSource={
                        fileList.map((x, i) => ({
                            key: i,
                            fl: x.file.type === 'application/pdf'
                                ? (<Button onClick={async () => {
                                    setStatus(true); await getBase64(x.file).then((f) => { storeData(f) })
                                }} type='link'>{x.file.name}</Button>)
                                : (<Button type='link' onClick={async () => {
                                    await getBase64(x.file).then((f) => { setImg({ ...getImg, display: true, file: f }) })
                                }}>{x.file.name}</Button>),
                            fc: x.fc,
                            nm: x.nm,
                            remarks: x.remarks,
                            action: (<Button type='primary' onClick={() => { handleRemove(x) }} danger>Remove</Button>)
                        }))
                    } />
            </div>
        </div>
    )
}

export default CheckerDocument