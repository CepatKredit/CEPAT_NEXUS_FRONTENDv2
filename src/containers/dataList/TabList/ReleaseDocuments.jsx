import { Collapse, ConfigProvider, Button } from 'antd'
import React, { useState } from 'react';
import { viewModalUploadDocx } from '@hooks/ModalController';
import { FileUpload } from '@hooks/FileController';
import FileLoader from './uploadDocs/FileLoader'
import UploadRelease from '@containers/dataList/TabList/releaseDocs/UploadRelease'
import { useQuery } from '@tanstack/react-query';
import { GET_LIST } from '@api/base-api/BaseApi'
import { toUpperText } from '@utils/Converter'
import StatusRemarks from './StatusRemarks';
import moment from 'moment'
import { jwtDecode } from 'jwt-decode';
import { LoanApplicationContext } from '@context/LoanApplicationContext';

function ReleaseDocuments({ ClientId, FileType, Uploader, User, data, isEdit, LoanStatus }) {
    const { SET_LOADING_INTERNAL } = React.useContext(LoanApplicationContext);
    React.useEffect(() => { console.log(ClientId + 'ReleaseDocuments') }, [ClientId])
    const getModalStatus = viewModalUploadDocx((state) => state.modalStatus)
    const setModalStatus = viewModalUploadDocx((state) => state.setStatus)
    const clearFileList = FileUpload((state) => state.clearList)

    const DocListQuery = useQuery({
        queryKey: ['ReleaseDocListQuery'],
        queryFn: async () => {
            let container = []
            const LPACCDDT = await GET_LIST(`/api/v1/GET/G16FT/${'LPACCDDT'}`)
            LPACCDDT.list?.map((x) => {
                container.push({ id: x.id, name: 'LPACCDDT', docsType: x.docsType })
            })
            const LPACCREL = await GET_LIST(`/api/v1/GET/G16FT/${'LPACCREL'}`)
            LPACCREL.list?.map((x) => {
                container.push({ id: x.id, name: 'LPACCREL', docsType: x.docsType })
            })
            return container
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    const token = localStorage.getItem('UTK');
    const FileListQuery = useQuery({
        queryKey: ['ReleaseFileListQuery'],
        queryFn: async () => {
            try {
                let container = []
                const LPACCDDT = await GET_LIST(`/GET/G17FL/${ClientId}/${'LPACCDDT'}/${jwtDecode(token).USRID}`)
                LPACCDDT.list?.map((x) => { container.push(x) })
                const LPACCREL = await GET_LIST(`/GET/G17FL/${ClientId}/${'LPACCREL'}/${jwtDecode(token).USRID}`)
                LPACCREL.list?.map((x) => { container.push(x) })
                SET_LOADING_INTERNAL('ReleaseFile', false);
                return container
            } catch (error) {
                console.error(error);
                SET_LOADING_INTERNAL('ReleaseFile', false);
                return [];
            }
        },
        enabled: true,
        retryDelay: 1000,
        staleTime: 5 * 1000
    })

    React.useEffect(() => {
        if (!data.loanIdCode) {
            SET_LOADING_INTERNAL('ReleaseFile', true)
            FileListQuery.refetch();
        }
    }, [data]);


    function GetFile(id, command) {
        let count = 0;
        let file_list = []
        FileListQuery.data?.map((x) => {
            if (x.docsId === id) {
                count += 1;
                file_list.push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
                })
            }
        })

        switch (toUpperText(command)) {
            case 'COUNT':
                return count;
            case 'FILE':
                return file_list;
            default:
                return;
        }
    }

    function GetOtherDocs(command) {
        let count = 0;
        let file_list = []
        FileListQuery.data?.map((x) => {
            if (x.docsId === 81) {
                count += 1;
                file_list.push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
                })
            }
            if (x.docsId === 92) {
                count += 1;
                file_list.push({
                    fileName: x.docsFileName.toString(),
                    file: x.base64,
                    extension: x.fileExtension,
                    remarks: x.remarks,
                    recDate: moment(x.recDate).format('MM/DD/YYYY hh:mm A').toString()
                })
            }
        })

        switch (toUpperText(command)) {
            case 'COUNT':
                return count;
            default:
                return file_list;
        }
    }

    function CollapseList() {
        const data = [
            {
                key: 0,
                label: <span className='font-bold'>
                    Other Docs
                    <span className='text-rose-500'>{GetOtherDocs('COUNT') === 0 ? '' : `(${GetOtherDocs('COUNT')})`}</span>
                </span>,
                children: <div className='h-[300px] overflow-y-auto'>
                    <FileLoader key={0} files={GetOtherDocs('FILES')} />
                </div>
            },
        ];

        DocListQuery.data?.map((x, i) => {
            if (x.id.toString() !== '86' && x.id.toString() !== '97') {
                data.push({
                    key: i + 1,
                    label: <span className='font-bold'>
                        {x.docsType}
                        <span className='text-rose-500'>{GetFile(x.id, 'COUNT') === 0 ? '' : `(${GetFile(x.id, 'COUNT')})`}</span>
                    </span>,
                    children: <div className='h-[300px] overflow-y-auto'>
                        <FileLoader key={i} Display={LoanStatus === 'CANCELLED' || LoanStatus === 'DECLINED' ? '' : 'USER'} files={GetFile(x.id, 'FILE')} />
                    </div>
                })
            }
        })
        return data
    }

    return (
        <div>
            <StatusRemarks isEdit={!isEdit} User={User} data={data} />
            <UploadRelease showModal={getModalStatus} Display={'USER'} closeModal={() => {
                setModalStatus(false)
                clearFileList()
            }} docTypeList={DocListQuery.data} ClientId={ClientId} Uploader={Uploader} FileType={FileType} LoanStatus={LoanStatus} />
            <div className='space-x-[1.5rem]'>
                {
                    LoanStatus === 'CANCELLED' || LoanStatus === 'DECLINED' || LoanStatus === 'ON WAIVER' || LoanStatus === 'UNDECIDED' || LoanStatus === 'FOR DISBURSEMENT'
                        ? (<></>)
                        : (<ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Button size='large' className='ml-6 bg-[#3b0764]' type='primary' onClick={() => { setModalStatus(true) }}>Upload Document</Button>
                        </ConfigProvider>)
                }
                <div className='h-[54vh] pt-2 overflow-y-auto'>
                    <div className='mr-[.5rem]'>
                        <Collapse items={CollapseList()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReleaseDocuments
