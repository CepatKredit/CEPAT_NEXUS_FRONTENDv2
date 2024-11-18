import * as React from 'react'
import { Modal, Upload, Button, ConfigProvider, notification, Form, Image, Input, Popconfirm, Table, Select } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { FileUpload } from '@hooks/FileController';
import { viewPDFView, viewModalUploadDocx } from '@hooks/ModalController';
import ViewPdf from './pdfToolbar/ViewPdf';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

function DocxTable({ showModal, closeModal, Display, docTypeList, ClientId, Uploader, FileType, LoanStatus }) {

    const [api, contextHolder] = notification.useNotification()
    const { fileList, addFile, updateFile, removeFile, clearList } = FileUpload()
    const { modalStatus, setStatus, storeData } = viewPDFView()
    const setModalStatus = viewModalUploadDocx((state) => state.setStatus)
    const queryClient = useQueryClient()

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
            if (Display === 'USER') {
                addFile({
                    file: file,
                    docsID: 'ID',
                    status: 'Please select status',
                    remarks: 'Please input remarks',
                    docStatus: '1'
                })
            }
            else {
                addFile({
                    file: file,
                    docsID: GetDocsCode('Others'),
                    status: 'Others',
                    remarks: 'NO REMARKS',
                    docStatus: '1'
                })
            }
            CheckList.refetch()
        }
        return checkType || Upload.LIST_IGNORE;
    }

    function GetDocsCode(data) {
        let dataHolder = docTypeList
        const DocsCode = dataHolder.find((x) => x.docsType === data ||
            x.id === data)
        return DocsCode.id
    }

    const defaultColumns = Display === 'USER'
        ? [
            {
                title: 'File',
                dataIndex: 'fl',
                key: 'fl',
                ellipsis: true,
            },
            {
                title: 'Document Type',
                dataIndex: 'docxType',
                key: 'docxType',
                width: '350px',
                editable: true
            },
            {
                title: 'Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
                editable: true
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                width: '100px',
            },
        ]
        : [
            {
                title: 'File',
                dataIndex: 'fl',
                key: 'fl',
                ellipsis: true,
            },
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
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
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
            if (record[dataIndex].toUpperCase() === 'PLEASE SELECT STATUS' || record[dataIndex].toUpperCase() === 'PLEASE INPUT REMARKS') {
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
                handleSave({
                    ...record,
                    ...values,
                });
                if (dataIndex === 'docxType') {
                    updateFile(record.key,
                        {
                            file: fileList[record.key].file,
                            status: values.docxType,
                            docsID: GetDocsCode(values.docxType),
                            remarks: fileList[record.key].remarks,
                            docStatus: fileList[record.key].docStatus
                        })
                    CheckList.refetch()
                }
                else {
                    updateFile(record.key,
                        {
                            file: fileList[record.key].file,
                            status: fileList[record.key].status,
                            docsID: fileList[record.key].docsID,
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
                    rules={dataIndex === 'docxType' ? [{ required: true, message: `${title} is required.` }] : []}>
                    {dataIndex === 'docxType'
                        ? (<Select ref={inputRef} value={fileList[record.key].status} onKeyDown={(e) => { if (e.key.toUpperCase() === 'ENTER') { save() } }}
                            onBlur={save} className='w-[100%]' options={docTypeList?.map((x) => ({ value: x.docsType, label: x.docsType, }))} showSearch
                            filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase())} />)
                        : (<Input ref={inputRef} value={fileList[record.key].remarks}
                            onKeyDown={(e) => { if (e.key.toUpperCase() === 'ENTER') { save() } }} onBlur={save} />)}
                </Form.Item>)
                : (
                    <div className="editable-cell-value-wrap"
                        style={{ paddingInlineEnd: 24, }}
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
            let checker = false
            fileList.forEach((x) => {
                if (x.status.toUpperCase() === 'PLEASE SELECT STATUS') { checker = true; }
            })
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
            let status_list = ''
            let docsID_list = ''
            let remarks_list = ''
            let docStatus_list = ''
            fileList.map((x) => {
                if (status_list === '') {
                    status_list += x.status
                    docsID_list += x.docsID
                    remarks_list += x.remarks
                    docStatus_list += x.docStatus
                }
                else {
                    status_list += ',' + x.status
                    docsID_list += ',' + x.docsID
                    remarks_list += ',' + x.remarks
                    docStatus_list += ',' + x.docStatus
                }
            })

            formData.append('client', ClientId)
            formData.append('docsID_list', docsID_list)
            formData.append('status_list', status_list)
            formData.append('remarks_list', remarks_list)
            formData.append('docStatus_list', docStatus_list)
            formData.append('prid', FileType)
            formData.append('Uploader', Uploader)
            fileList.map((x, i) => {
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
                await axios.post(`/v1/POST/P66UFR`, formData, {
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
                        queryClient.invalidateQueries({ queryKey: ['DocListQuery'] }, { exact: true })
                        queryClient.invalidateQueries({ queryKey: ['FileListQuery'] }, { exact: true })
                    })
                    .catch((error) => {
                        api['error']({
                            message: 'Something went wrong',
                            description: error.message
                        })
                    })
                if (LoanStatus === 'LACK OF DOCUMENTS' && Display !== 'USER') {
                    UpdateStatus()
                }
            }
        }
    })

    async function UpdateStatus() {
        await axios.post(`/v1/POST/P82ULD/${ClientId}/${Uploader}`)
            .then((result) => {
                //WORKING
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    }

    const [getImg, setImg] = React.useState({
        display: false,
        file: ''
    })

    return (
        <>
            <ViewPdf showModal={modalStatus} closeModal={() => { setStatus(false) }} />
            <Image style={{ display: 'none' }} preview={{
                visible: getImg.display,
                src: getImg.file,
                onVisibleChange: () => { setImg({ ...getImg, display: false, file: '' }) }
            }} />

            <Modal
                title={'Upload Document'}
                centered
                open={showModal}
                onCancel={closeModal}
                width={Display === 'USER' ? '80%' : '40%'}
                maskClosable={false}
                footer={false} >
                <div className='pt-2'>
                    {contextHolder}
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
                            Display === 'USER'
                                ? fileList.map((x, i) => ({
                                    key: i,
                                    fl: x.file.type === 'application/pdf'
                                        ? (<Button onClick={async () => {
                                            setStatus(true); await getBase64(x.file).then((f) => { storeData(f) })
                                        }} type='link'>{x.file.name}</Button>)
                                        : (<Button type='link' onClick={async () => {
                                            await getBase64(x.file).then((f) => { setImg({ ...getImg, display: true, file: f }) })
                                        }}>{x.file.name}</Button>),
                                    docxType: x.status,
                                    remarks: x.remarks,
                                    action: (<Button type='primary' onClick={() => { handleRemove(x) }} danger>Remove</Button>)
                                }))
                                : fileList.map((x, i) => ({
                                    key: i,
                                    fl: x.file.type === 'application/pdf'
                                        ? (<Button onClick={async () => {
                                            console.log('Mapped fileList for dataSource:', fileList);
                                            setStatus(true); await getBase64(x.file).then((f) => { storeData(f) })
                                        }} type='link'>{x.file.name}</Button>)
                                        : (<Button type='link' onClick={async () => {
                                            await getBase64(x.file).then((f) => { setImg({ ...getImg, display: true, file: f }) })
                                        }}>{x.file.name}</Button>),
                                    action: (<Button type='primary' onClick={() => { handleRemove(x) }} danger>Remove</Button>)
                                }))
                        } />
                </div>
            </Modal>
        </>
    )
}

export default DocxTable