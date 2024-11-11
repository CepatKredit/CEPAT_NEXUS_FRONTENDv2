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
            const result = await GET_LIST(`/getFileType/${FileType}`)
            return result.list
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    const token = localStorage.getItem('UTK');
    const FileListQuery = useQuery({
        queryKey: ['FileListQuery'],
        queryFn: async () => {
            try {
                const result = await GET_LIST(`/getFileList/${ClientId}/${FileType}/${Uploader}`)
                SET_LOADING_INTERNAL('UploadDocs', false);
                return result.list
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('UploadDocs', false);
                return [];
            }
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    React.useEffect(() => {
        if (!getAppDetails.loanIdCode) {
            SET_LOADING_INTERNAL('UploadDocs', true)
            FileListQuery.refetch();
        }
    }, [getAppDetails]);

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
                    <FileLoader key={0} files={GetFile('Others', 'FILE')} />
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
                            <FileLoader key={i} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data}
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
                                <FileLoader key={i} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data}
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
                        <FileLoader key={0} files={GetFile(x.id, 'FILE')} FileListName={DocListQuery.data}
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
                        Display={GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' ? '' : 'USER'} />
                </div>
            }
        }
        return data
    }

    return (
        <div>
            <StatusRemarks isEdit={!isEdit} User={User} data={getAppDetails} />

            <DocxTable showModal={getModalStatus} Display={Display} closeModal={() => {
                setModalStatus(false)
                clearFileList()
            }} docTypeList={DocListQuery.data} ClientId={ClientId} Uploader={Uploader} FileType={FileType} LoanStatus={GetStatus} />
            <div className='space-x-[1.5rem]'>
                {
                    GetStatus === 'RELEASED' || GetStatus === 'CANCELLED' || GetStatus === 'DECLINED' || GetStatus === 'FOR RE-APPLICATION' || GetStatus === 'FOR DOCUSIGN' || GetStatus === 'OK FOR DOCUSIGN'
                        || GetStatus === 'TAGGED FOR RELEASE' || GetStatus === 'ON WAIVER' || GetStatus === 'CONFIRMATION' || GetStatus === 'CONFIRMED' || GetStatus === 'UNDECIDED' ||
                        GetStatus === 'FOR DISBURSEMENT' || GetStatus === 'RELEASED' || GetStatus === 'RETURN TO LOANS PROCESSOR' || GetStatus === 'APPROVED (TRANS-OUT)' ||
                        LoanStatus === 'COMPLIED - LACK OF DOCUMENTS'
                        ? (<></>)
                        : (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button size='large' className='ml-6 mb-2 bg-[#3b0764]' type='primary' onClick={() => { setModalStatus(true) }} disabled={User === 'Lp'} >Upload Document</Button>
                        </ConfigProvider>)
                }
                <div className={classname}>
                    <div className='mr-[.5rem]'>
                        <Collapse items={CollapseList()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadDocs