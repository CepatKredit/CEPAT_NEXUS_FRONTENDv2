import { Collapse, ConfigProvider, Button, Spin, Flex } from 'antd'
import React from 'react';
import { viewModalUploadDocx } from '@hooks/ModalController';
import { FileUpload } from '@hooks/FileController';
import FileLoader from './uploadDocs/FileLoader'
import DocxTable from './uploadDocs/DocxTable'
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'
import { toUpperText } from '@utils/Converter'
import StatusRemarks from './StatusRemarks';
import moment from 'moment'
import { jwtDecode } from 'jwt-decode';
import { GetData } from '@utils/UserData';
import { ApplicationStatus } from '@hooks/ApplicationStatusController';
import { LoanApplicationContext } from '@context/LoanApplicationContext';
import { useDataContainer } from '@context/PreLoad';

function UploadDocs({ classname, Display, ClientId, FileType, Uploader, User, data, isEdit, LoanStatus, ModUser }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const { getAppDetails } = React.useContext(LoanApplicationContext)
    const { GetStatus } = ApplicationStatus()
    const getModalStatus = viewModalUploadDocx((state) => state.modalStatus)
    const setModalStatus = viewModalUploadDocx((state) => state.setStatus)
    const clearFileList = FileUpload((state) => state.clearList)
    const [fetchTime, setFetchTime] = React.useState(null);
    const DocListQuery = useQuery({
        queryKey: ['DocListQuery',FileType],
        queryFn: async () => {
            const result = await GET_LIST(`/GET/G16FT/${FileType}`)
            return result.list
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        retryDelay: 1000,
    })

    const token = localStorage.getItem('UTK');
    const FileListQuery = useQuery({
        queryKey: ['FileListQuery', ClientId, FileType, toUpperText(Uploader)],
        queryFn: async () => {
            const startTime = performance.now();
            try {
                const result = await GET_LIST(`/GET/G17FL/${ClientId}/${FileType}/${toUpperText(Uploader)}`)
                //     const endTime = performance.now();
                // setFetchTime((endTime - startTime).toFixed(2)); 
                SET_LOADING_INTERNAL('UploadDocs', false);
                return result.list
            } catch (error) {
                //     const endTime = performance.now();
                // setFetchTime((endTime - startTime).toFixed(2)); 
                console.error(error);
                SET_LOADING_INTERNAL('UploadDocs', false);
                return [];
            }
        },
        enabled: DocListQuery.isSuccess,
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        retryDelay: 1000,
    })

    React.useEffect(() => {
        SET_LOADING_INTERNAL('UploadDocs', true)
        FileListQuery.refetch();
    }, []);
    /* React.useEffect(() => {
     SET_LOADING_INTERNAL('UploadDocs', true);
     if (FileListQuery.isFetched) {
         SET_LOADING_INTERNAL('UploadDocs', false);
     }
 }, [FileListQuery.isFetched])*/

    const processedData = React.useMemo(() => {
        const count = {};
        const file_list = {};
        const count_arch = {};
        const file_arch = {};

        FileListQuery.data?.forEach((x) => {
            if (x.docStatus === 1) {
                if (!file_list[x.docsId]) {
                    file_list[x.docsId] = [];
                    count[x.docsId] = 0;
                }
                file_list[x.docsId].push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    docStatus: x.docStatus,
                    docsId: x.docsId,
                    id: x.id,
                    docsFileName: x.docsFileName,
                    loanAppId: ClientId,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString(),
                });
                count[x.docsId]++;
            } else if (x.docStatus === 0) {
                if (!file_arch[x.docsId]) {
                    file_arch[x.docsId] = [];
                    count_arch[x.docsId] = 0;
                }
                file_arch[x.docsId].push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    docStatus: x.docStatus,
                    docsId: x.docsId,
                    id: x.id,
                    docsFileName: x.docsFileName,
                    loanAppId: ClientId,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString(),
                });
                count_arch[x.docsId]++;
            }
        });

        return { count, file_list, count_arch, file_arch };
    }, [FileListQuery.data]);

    function GetFile(id, command) {
        switch (toUpperText(command)) {
            case 'COUNT':
                return processedData.count[id] || 0;
            case 'FILE':
                return processedData.file_list[id] || [];
            case 'COUNT-ARCH':
                return processedData.count_arch[id] || 0;
            case 'FILE-ARCH':
                return processedData.file_arch[id] || [];
            default:
                return [];
        }
    }

    // function GetFile(id, command) {
    //     let count = 0;
    //     let file_list = []
    //     let count_arch = 0
    //     let file_arch = []
    //     FileListQuery.data?.map((x) => {
    //         if (x.docsId === id && x.docStatus === 1) {
    //             count += 1;
    //             file_list.push({
    //                 fileName: x.docsFileName.toString(),
    //                 file: x.base64,
    //                 extension: x.fileExtension,
    //                 remarks: x.remarks,
    //                 docStatus: x.docStatus,
    //                 docsId: x.docsId,
    //                 id: x.id,
    //                 docsFileName: x.docsFileName,
    //                 loanAppId: ClientId,
    //                 recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
    //             })
    //         }

    //         if (x.docStatus === 0) {
    //             count_arch += 1;
    //             file_arch.push({
    //                 fileName: x.docsFileName.toString(),
    //                 file: x.base64,
    //                 extension: x.fileExtension,
    //                 remarks: x.remarks,
    //                 docStatus: x.docStatus,
    //                 docsId: x.docsId,
    //                 id: x.id,
    //                 docsFileName: x.docsFileName,
    //                 loanAppId: ClientId,
    //                 recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
    //             })
    //         }
    //     })

    //     switch (toUpperText(command)) {
    //         case 'COUNT':
    //             return count;
    //         case 'FILE':
    //             return file_list;
    //         case 'COUNT-ARCH':
    //             return count_arch;
    //         case 'FILE-ARCH':
    //             return file_arch;
    //         default:
    //             return;
    //     }
    // }

    function CollapseList() {
        const data = [
            {
                key: 0,
                label: 
                <Flex className="flex flex-col justify-center">
                <span className='font-bold'>
                    Others &nbsp;
                    {FileListQuery.isFetching && (<Spin size="small" className="text-green-500"><span className="text-green-500">"Loading files..."</span></Spin>)}
                    <span className='text-rose-500' />
                </span>
                </Flex>,
                // children: <div className='h-[300px] overflow-y-auto'>
                //     <FileLoader key={0} files={GetFile('Others', 'FILE')} className='z-50' ModUser={ModUser} />
                // </div>
                children: (
                    <div className="h-[300px] overflow-y-auto">
                        {FileListQuery.isFetching ? (
                            <Spin tip="Loading files..." size="small" className="text-green-500">
                                <div className="h-full w-full"></div>
                            </Spin>
                        ) : (
                            <FileLoader key={0} files={GetFile('Others', 'FILE')} className="z-50" ModUser={ModUser} />
                        )}
                    </div>
                ),
            },
        ]

        DocListQuery.data?.map((x, i) => {
            if (x.docsType !== 'Others') {
                if (Display === 'USER') {
                    data.push({
                        key: i + 1,
                        label: 
                        <span className='font-bold'>
                            {x.docsType}&nbsp;
                            {FileListQuery.isFetching && (<Spin size="small" className="text-green-500"><span className="text-green-500">"Loading files..."</span></Spin>)}
                            <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                        </span>,
                        children: <div className='h-[300px] overflow-y-auto'>
                            {FileListQuery.isFetching ? (
                                <Spin tip="Loading files..." size="small" className="text-green-500">
                                    <div className="h-full w-full"></div>
                                </Spin>
                            ) : (
                                <FileLoader key={i} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data} className='z-50'
                                    Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} isClient={Display} ModUser={ModUser} />
                            )}</div>
                    })
                }
                else {
                    if (GetFile(x.id, 'COUNT') !== 0) {
                        data.push({
                            key: i + 1,
                            label: 
                            <span className='font-bold'>
                                {x.docsType}&nbsp;
                                {FileListQuery.isFetching && (<Spin size="small" className="text-green-500"><span className="text-green-500">"Loading files..."</span></Spin>)}
                                <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                            </span>,
                            children: (<div className='h-[300px] overflow-y-auto'>
                                {FileListQuery.isFetching ? (
                                    <Spin tip="Loading files..." size="small" className="text-green-500">
                                        <div className="h-full w-full"></div>
                                    </Spin>
                                ) : (
                                    <FileLoader
                                        key={i}
                                        files={GetFile(x.id, 'FILE')}
                                        FileListName={DocListQuery.data}
                                        className='z-50'
                                        Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'}
                                        isClient={Display}
                                        ModUser={ModUser} />
                                )}
                            </div>
                            )
                        })
                    }
                }
            }
            else {
                data[0] = {
                    key: 0,
                    label: <span className='font-bold'>
                        Others &nbsp;
                        {FileListQuery.isFetching && (<Spin size="small" className="text-green-500"><span className="text-green-500">"Loading files..."</span></Spin>)}
                        <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                    </span>,
                    children: <div className='h-[300px] overflow-y-auto'>
                        {FileListQuery.isFetching ? (
                            <Spin tip="Loading files..." size="small" className="text-green-500">
                                <div className="h-full w-full"></div>
                            </Spin>
                        ) : (
                            <FileLoader key={0} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data} className='z-50'
                                Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} isClient={Display} ModUser={ModUser} />
                        )}</div>
                }
            }
        })

        if (Display === 'USER') {
            data[data.length + 1] = {
                key: data.length + 1,
                label: <span className='font-bold'>
                    Archive &nbsp;
                    {FileListQuery.isFetching && (<Spin size="small" className="text-green-500"><span className="text-green-500">"Loading files..."</span></Spin>)}
                    <span className='text-rose-500'>{GetFile('', 'COUNT-ARCH') === 0 ? '' : `(${GetFile('', 'COUNT-ARCH')})`}</span>
                </span>,
                children: <div className='h-[300px] overflow-y-auto'>
                    <FileLoader key={data.length + 1} files={GetFile('', 'FILE-ARCH')} FileListName={DocListQuery.data}
                        Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} className='z-50' ModUser={ModUser} />
                </div>
            }
        }
        return data
    }
    function DISABLE_STATUS(LOCATION, LoanStatus) {
        if (!GetData('ROLE')) {
            return !(LoanStatus === 'RECEIVED' || LoanStatus === 'LACK OF DOCUMENTS');
        }
        if (GetData('ROLE').toString() === '30' || GetData('ROLE').toString() === '40') {
            return ['/ckfi/credit-list', '/ckfi/under-credit', '/ckfi/approved', '/ckfi/under-lp', '/ckfi/released', '/ckfi/cancelled', '/ckfi/declined', '/ckfi/for-re-application', '/ckfi/assessement/credit'].includes(LOCATION);
        } else if (GetData('ROLE').toString() === '20') {
            return ['/ckfi/credit-list', '/ckfi/under-credit', '/ckfi/for-approval', '/ckfi/approved', '/ckfi/under-lp', '/ckfi/for-re-application', '/ckfi/released', '/ckfi/cancelled', '/ckfi/declined'].includes(LOCATION);
        } else if (GetData('ROLE').toString() === '50' || GetData('ROLE').toString() === '55') {
            return ['/ckfi/for-approval', '/ckfi/approved', '/ckfi/under-lp', '/ckfi/released', '/ckfi/cancelled', '/ckfi/declined'].includes(LOCATION);
        } else if (GetData('ROLE').toString() === '60') {
            return ['/ckfi/approved', '/ckfi/queue-bucket', '/ckfi/under-lp', '/ckfi/released', '/ckfi/cancelled', '/ckfi/declined'].includes(LOCATION);
        } else if (GetData('ROLE').toString() === '70') {
            return ['/ckfi/for-docusign', '/ckfi/for-disbursement', '/ckfi/released', '/ckfi/reassessed/credit-officer', '/ckfi/returned/credit-associate', '/ckfi/on-waiver', '/ckfi/cancelled', '/ckfi/declined'].includes(LOCATION);
        } else if (GetData('ROLE').toString() === '80') {
            return ['/ckfi/for-disbursement', '/ckfi/released', '/ckfi/reassessed/credit-officer', '/ckfi/on-waiver', '/ckfi/cancelled', '/ckfi/declined'].includes(LOCATION);
        }
        return false;
    }
    const [getStatus, setStatus] = React.useState(false)
    React.useEffect(() => { setStatus(DISABLE_STATUS(localStorage.getItem('SP'))); }, [localStorage.getItem('SIDC')])
    return (
        <div>
            <StatusRemarks isEdit={!isEdit} User={User} data={getAppDetails} />

            <DocxTable showModal={getModalStatus} Display={Display} closeModal={() => {
                setModalStatus(false)
                // clearFileList()
            }} docTypeList={DocListQuery.data} ClientId={ClientId} Uploader={Uploader} FileType={FileType} LoanStatus={GetStatus} />
            <div className="space-x-[1.5rem]">
                {
                    !DISABLE_STATUS(localStorage.getItem('SP'), GetStatus) ? (
                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button
                                size="large"
                                className="ml-6 mb-2 bg-[#3b0764]"
                                type="primary"
                                onClick={() => setModalStatus(true)}
                                disabled={User === 'Lp'}
                            >
                                Upload Document
                            </Button>
                        </ConfigProvider>
                    ) : null
                }
                <div className={classname}>
                    <div className="mr-[.5rem]">
                        <Collapse items={DocListQuery.isFetched ? CollapseList()
                            : (<div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white bg-opacity-50 z-50">
                                <Spin
                                    spinning={true}
                                    tip="Please wait..."
                                    className="text-green-500"
                                />
                            </div>)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadDocs