import { Collapse, ConfigProvider, Button, Spin } from 'antd'
import React, { useEffect, useState } from 'react';
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

function UploadDocs({ classname, Display, ClientId, FileType, Uploader, User, data, isEdit, LoanStatus }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    const { getAppDetails } = React.useContext(LoanApplicationContext)
    const { GetStatus } = ApplicationStatus()
    const getModalStatus = viewModalUploadDocx((state) => state.modalStatus)
    const setModalStatus = viewModalUploadDocx((state) => state.setStatus)
    const clearFileList = FileUpload((state) => state.clearList)
    const DocListQuery = useQuery({
        queryKey: ['DocListQuery'],
        queryFn: async () => {
            const result = await GET_LIST(`/GET/G16FT/${FileType}`)
            //console.log('jjjjjjjjj', result.list)
            return result.list
        },
        refetchInterval: (data) => (data?.length === 0 ? 500 : false),
        retryDelay: 1000,
    })
    const token = localStorage.getItem('UTK');
    const FileListQuery = useQuery({
        queryKey: ['FileListQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/GET/G17FL/${ClientId}/${FileType}/${Uploader}`)
                SET_LOADING_INTERNAL('UploadDocs', false);
                console.log('si Rex ba ito.....')
                return result.list
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('UploadDocs', false);
                return [];
            }
        },
       enabled:true
    })



    function GetFile(id, command) {
        let count = 0;
        let file_list = []
        let count_arch = 0
        let file_arch = []
        FileListQuery.data?.map((x) => {
            if (x.docsId === id && x.docStatus === 1) {
                count += 1;
                file_list.push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    docStatus: x.docStatus,
                    docsId: x.docsId,
                    id: x.id,
                    docsFileName: x.docsFileName,
                    loanAppId: ClientId,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
                })
            }

            if (x.docStatus === 0) {
                count_arch += 1;
                file_arch.push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    docStatus: x.docStatus,
                    docsId: x.docsId,
                    id: x.id,
                    docsFileName: x.docsFileName,
                    loanAppId: ClientId,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
                })
            }
        })

        switch (toUpperText(command)) {
            case 'COUNT':
                return count;
            case 'FILE':
                return file_list;
            case 'COUNT-ARCH':
                return count_arch;
            case 'FILE-ARCH':
                return file_arch;
            default:
                return;
        }
    }

    function CollapseList() {
        const data = [
            {
                key: 0,
                label: <span className='font-bold'>
                    Others <span className='text-rose-500' />
                </span>,
                children: <div className='h-[300px] overflow-y-auto'>
                    <FileLoader key={0} files={GetFile('Others', 'FILE')} className='z-50' />
                </div>
            },
        ]

        DocListQuery.data?.map((x, i) => {
            if (x.docsType !== 'Others') {
                if (Display === 'USER') {
                    data.push({
                        key: i + 1,
                        label: <span className='font-bold'>
                            {x.docsType}
                            <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                        </span>,
                        children: <div className='h-[300px] overflow-y-auto'>
                            <FileLoader key={i} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data} className='z-50'
                                Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} isClient={Display} />
                        </div>
                    })
                }
                else {
                    if (GetFile(x.id, 'COUNT') !== 0) {
                        data.push({
                            key: i + 1,
                            label: <span className='font-bold'>
                                {x.docsType}
                                <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                            </span>,
                            children: <div className='h-[300px] overflow-y-auto'>
                                <FileLoader key={i} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data} className='z-50'
                                    Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} isClient={Display} />
                            </div>
                        })
                    }
                }
            }
            else {
                data[0] = {
                    key: 0,
                    label: <span className='font-bold'>
                        Others <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                    </span>,
                    children: <div className='h-[300px] overflow-y-auto'>
                        <FileLoader key={0} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data} className='z-50'
                            Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} isClient={Display} />
                    </div>
                }
            }
        })

        if (Display === 'USER') {
            data[data.length + 1] = {
                key: data.length + 1,
                label: <span className='font-bold'>
                    Archive <span className='text-rose-500'>{GetFile('', 'COUNT-ARCH') === 0 ? '' : `(${GetFile('', 'COUNT-ARCH')})`}</span>
                </span>,
                children: <div className='h-[300px] overflow-y-auto'>
                    <FileLoader key={data.length + 1} files={GetFile('', 'FILE-ARCH')} FileListName={DocListQuery.data}
                        Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} className='z-50' />
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
                clearFileList()
            }} docTypeList={DocListQuery.data} ClientId={ClientId} Uploader={Uploader} FileType={FileType} LoanStatus={GetStatus} />
            <div className="space-x-[1.5rem]">
                {
                    !DISABLE_STATUS(localStorage.getItem('SP'), GetStatus) ? (
                        (GetStatus === "LACK OF DOCUMENTS" || GetStatus === "RECEIVED") && (
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
                        )
                    ) : null
                }
                <div className={classname}>
                    <div className="mr-[.5rem]">
                        <Collapse items={DocListQuery.isFetched && FileListQuery.isFetched ? CollapseList() : null} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadDocs