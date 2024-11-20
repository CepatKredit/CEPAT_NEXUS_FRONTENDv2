import * as React from 'react'
import { Image, Space, Button, ConfigProvider, notification, Popconfirm, Tooltip, Form, Table, Input, Select, Spin } from 'antd'
import { SaveOutlined, CloseOutlined, DeleteOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import ResponsiveModal from '@components/validation/ResponsiveModal';
import { viewModal, viewPDFView } from '@hooks/ModalController';
import CheckerDocument from '../finalCheckerModal/CheckerDocument';
import { FileUpload } from '@hooks/FileController';
import SectionHeader from '@components/validation/SectionHeader'
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'
import { toDecrypt, toEncrypt } from '@utils/Converter';
import ViewPdf from '../uploadDocs/pdfToolbar/ViewPdf';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function UploadRecord({ data, ClientId, Uploader }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext)
    const [api, contextHolder] = notification.useNotification();
    const getModalStatus = viewModal((state) => state.modalStatus)
    const setModalStatus = viewModal((state) => state.setStatus)
    const clearFileList = FileUpload((state) => state.clearList)


    const DocListICQuery = useQuery({
        queryKey: ['DocListICQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/GroupGet/G16FT/${'IC'}`)
                SET_LOADING_INTERNAL('FinancialChecker', false);
                return result.list
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('FinancialChecker', false); // Stop loading on error
            }
            return [];
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    const colFinalCheck = [
        {
            title: '#',
            dataIndex: 'num',
            key: 'num',
            width: '50px',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '250px',
            editable: true,
        },
        {
            title: 'Borrower',
            dataIndex: 'br',
            key: 'br',
            width: '150px',
        },
        {
            title: 'Financial Checker',
            dataIndex: 'fc',
            key: 'fc',
            width: '200px',
            editable: true,
            //default sorting of antd Nico 11/08/20204
            // defaultSortOrder: 'ascend',
            sortDirections: ['ascend', 'descend'],
            sorter: (a, b) => a.fc.localeCompare(b.fc),
            // sortIcon: ({ sortOrder }) => (
            //     <div className="flex flex-col items-center">
            //     <CaretUpOutlined 
            //         className={`${sortOrder === 'ascend' ? 'text-white' : 'text-gray-600'} text-xs`}
            //     />
            //     <CaretDownOutlined 
            //         className={`${sortOrder === 'descend' ? 'text-white' : 'text-gray-600'} text-xs`}
            //     />
            // </div>
            // ),

            //for filter in case Nico 11/08/2024
            // filters: DocListICQuery.data?.map((x) => ({
            //     text: x.docsType, 
            //     value: x.docsType,
            // })),
            // onFilter: (value, record) => record.fc === value,
        },
        {
            title: 'File Uploaded',
            dataIndex: 'file',
            key: 'file',
            width: '130px',
            ellipsis: true,
        },
       /* {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            width: '300px',
            editable: true,
        },*/
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '90px',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (<Space>
                    <Tooltip title="Save">
                        <Popconfirm
                            title="Are you sure you want to save changes?"
                            onConfirm={() => { save(record.key) }}
                            okText="Yes"
                            cancelText="Cancel">
                            <Button icon={<SaveOutlined />} type='primary' className='bg-[#2b972d]'/>
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Cancel">
                        <Popconfirm
                            title="Are you sure you want to cancel the edit?"
                            onConfirm={cancel}
                            okText="Yes"
                            cancelText="Cancel"
                        >
                            <Button icon={<CloseOutlined />} type='primary' danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>) : (<Space>
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Tooltip title='Edit'>
                            <Button disabled={editingKey !== ''} onClick={() => edit(record)} className='bg-[#3b0764]' type='primary' icon={<MdEditSquare />} />
                        </Tooltip>
                    </ConfigProvider>
                    {/* <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this record?"
                            onConfirm={() => { file_delete(record) }}
                            okText="Yes"
                            cancelText="Cancel"  >
                            <Button disabled={editingKey !== ''} icon={<DeleteOutlined />} type='primary' danger />
                        </Popconfirm>
                    </Tooltip> */}
                </Space>);
            },
        },
    ]

    React.useEffect(() => {
        FileListQuery.refetch()
        SET_LOADING_INTERNAL('FinancialChecker', true);
    }, [ClientId])

    const token = localStorage.getItem('UTK');
    const FileListQuery = useQuery({
        queryKey: ['FileListFinQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/getFileList/${ClientId}/${'IC'}/${jwtDecode(token).USRID}`)
                let dataContainer = []
                SET_LOADING_INTERNAL('FinancialChecker', false);
                result.list?.map((x) => {
                    var dfn = x.docsFileName.split(' ')
                    var fullname = toDecrypt(dfn[0]).split(' ')
                    dataContainer.push({
                        id: x.id,
                        file: x.base64,
                        fileExtension: x.fileExtension,
                        fname: dfn[1] === 'ML' ? fullname[1] : fullname[0],
                        lname: dfn[1] === 'ML' ? fullname[0] : fullname[1],
                        fc: dfn[1],
                        remarks: x.remarks
                    })
                })
                return dataContainer;
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('FinancialChecker', false); // Stop loading on error
            }
            return [];
        },
        enabled: true
    })

    const { modalStatus, setStatus, storeData } = viewPDFView()

    const [getImg, setImg] = React.useState({
        display: false,
        file: ''
    })

    // const DocListICQuery = useQuery({
    //     queryKey: ['DocListICQuery'],
    //     queryFn: async () => {
    //         const result = await GET_LIST(`/GroupGet/G16FT/${'IC'}`)
    //         return result.list
    //     },
    //     enabled: true,
    //     retryDelay: 1000,
    //     staleTime: 5 * 1000
    // })

    function GetDocsCode(data) {
        const DocsCode = DocListICQuery.data?.find((x) => x.docsType === data ||
            x.id === data)
        return DocsCode.id
    }

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

    const [form] = Form.useForm();
    const [getData, setData] = React.useState({
        key: '',
        name: '',
        fc: '',
        remarks: '',
    });

    React.useEffect(() => {
        form.setFieldsValue({
            key: getData.key,
            name: getData.name,
            fc: getData.fc,
            remarks: getData.remarks,
            ...getData,
        });
    }, [getData])

    const [editingKey, setEditingKey] = React.useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            key: '',
            name: '',
            fc: '',
            remarks: '',
            ...record,
        });
        setData({
            ...getData,
            key: record.key,
            name: record.name,
            fc: record.fc,
            remarks: record.remarks,
        })
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    async function save(key) {
        const dataContainer = {
            DocsID: GetDocsCode(getData.fc),
            DocsFileName: toEncrypt(getData.name) + ' ' + getData.fc,
            Remarks: getData.remarks,
            ModUser: Uploader,
            DocStatus: 1,
            LAI: ClientId,
            Id: key,
            PROID: 'IC'
        }

        await axios.post('/GroupPost/P68FS', dataContainer)
            .then((result) => {
                FileListQuery.refetch()
                cancel()
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
            })
            .catch((error) => {
                console.log(error)
                api['error']({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    };
    const mergedColumns = colFinalCheck.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'fc' ? 'fc'
                    : col.dataIndex === 'name'
                        ? 'name' : 'remarks',
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
        const inputRef = React.useRef(null);
        const inputNode = inputType === 'fc' ? <Select ref={inputRef} className='w-[100%]' onChange={(e) => { setData({ ...getData, fc: e, name: '' }) }}
            options={DocListICQuery.data?.map((x) => ({ value: x.docsType, label: x.docsType, }))} />
            : inputType === 'name'
                ? <Select ref={inputRef} value={getData.name} className='w-[100%]' options={NameList(getData.fc)?.map((x) => ({
                    value: x.name, 
                    label: x.name, 
                    emoji: x.emoji, 
                    desc: x.desc
                }))} onChange={(e) => { setData({ ...getData, name: e }) }}
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
                    )} />
                : <Input onBlur={(e) => { setData({ ...getData, remarks: e.target.value }) }} ref={inputRef} />
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    async function file_delete(command) {
        const dataContainer = {
            DocsID: GetDocsCode(command.fc),
            DocsFileName: toEncrypt(command.name) + ' ' + command.fc,
            Remarks: command.remarks,
            ModUser: Uploader,
            DocStatus: 0,
            LAI: ClientId,
            Id: command.key,
            PRODID: 'IC'
        }

        await axios.post('/GroupPost/P68FS', dataContainer)
            .then((result) => {
                FileListQuery.refetch()
                cancel()
                api[result.data.status]({
                    message: result.data.message,
                    description: result.data.description
                })
            })
            .catch((error) => {
                api['error']({
                    message: 'Something went wrong',
                    description: error.message
                })
            })
    };


    return (
        <center>
            {contextHolder}
            <ViewPdf showModal={modalStatus} closeModal={() => { setStatus(false) }} />
            <Image style={{ display: 'none' }} preview={{
                visible: getImg.display,
                src: getImg.file,
                onVisibleChange: () => { setImg({ ...getImg, display: false, file: '' }) }
            }} />

            <ResponsiveModal showModal={getModalStatus} closeModal={() => {
                setModalStatus(false)
                clearFileList()
            }}
                modalWidth={'90%'} modalTitle={'Upload Financial Checker Document'} contextHeight={'h-[500px]'}
                contextInside={(<><CheckerDocument data={data} ClientId={ClientId} Uploader={Uploader} /></>)} style={{ zIndex: 997 }} />
            <div className='mt-[3%]'>
                <SectionHeader title="List of 3rd Party Financial Checker" />
            </div>
            <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                <Button className='bg-[#3b0764] w-[200px]' onClick={() => { setModalStatus(true) }}
                    size='large' type='primary'>Upload Record</Button>
            </ConfigProvider>
            <div className='h-[300px] px-2'>
                <div className='mt-2'>
                    <Form form={form} component={false}>
                        <ConfigProvider theme={{ components: { Spin: { colorPrimary: 'rgb(86,191,84)' } } }}>
                            <Table components={{ body: { cell: EditableCell } }} columns={mergedColumns}
                                dataSource={
                                    FileListQuery.data?.map((x, i) => ({
                                        key: x.id,
                                        num: i + 1,
                                        name: x.fc === 'ML' ? `${x.lname} ${x.fname}` : `${x.fname} ${x.lname}`,
                                        br: data.loanProd === '0303-DHW' || data.loanProd === '0303-VL' || data.loanProd === '0303-WL'
                                            ? data.ofwfname === x.fname && data.ofwlname === x.lname
                                                ? 'Principal Borrower'
                                                : data.benfname === x.fname && data.benlname === x.lname
                                                    ? 'Co-Borrower'
                                                    : 'Additional Co-Borrower'
                                            : data.ofwfname === x.fname && data.ofwlname === x.lname
                                                ? 'Co-Borrower'
                                                : data.benfname === x.fname && data.benlname === x.lname
                                                    ? 'Principal Borrower'
                                                    : 'Additional Co-Borrower',
                                        fc: x.fc,
                                        file: x.fileExtension === '.pdf'
                                            ? (<Button type='link' onClick={async () => {
                                                setStatus(true); storeData(x.file)
                                            }}>View PDF</Button>)
                                            : (<Button type='link' onClick={async () => {
                                                setImg({ ...getImg, display: true, file: x.file })
                                            }}>View Image</Button>),
                                        remarks: x.remarks
                                    }))}
                            />
                        </ConfigProvider>
                    </Form>
                </div>
            </div>
        </center>
    )
}

export default UploadRecord