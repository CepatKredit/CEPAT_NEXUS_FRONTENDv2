import * as React from 'react'
import { Upload, notification, Button, ConfigProvider, Progress } from 'antd';
import { FileUpload } from '@hooks/FileController'
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

function UploadFile() {
    const [api, contextHolder] = notification.useNotification();
    const fileList = FileUpload((state) => state.fileList)
    const addFile = FileUpload((state) => state.addFile)
    const removeFile = FileUpload((state) => state.removeFile)

    let checkFiles = true
    if (fileList.length === 0) { checkFiles = true }
    else { checkFiles = false }

    function handleRemove(file) {
        removeFile(file)
    }

    async function handleBeforeUpload(file) {
        let checkType = false
        if (file.name.match(/\.(jpeg|jpg|png|jfif|gif|pjpeg|pjp|svg|pdf)$/) !== null) {
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
            addFile(file)
        }
        return checkType || Upload.LIST_IGNORE;
    }

    function getSizeFile(bytes, decimals) {
        if (decimals === 0) return '0 Bytes'
        const dm = decimals || 2
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
        const index = Math.floor(Math.log(bytes) / Math.log(1000))
        return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + '-' + sizes[index]
    }

    const [uploadPercentage, setUploadPercentage] = React.useState(0);
    async function handleUpload() {
        const formData = new FormData();
        var MAX_LIMIT = 0
        fileList.map((x, i) => {
            MAX_LIMIT += x.size
            formData.append('files', x, 'test' + i);
            formData.append('name', 'TEST' + i);
        })

        if (MAX_LIMIT >= 40000000) {
            api['warning']({
                message: 'File size limit',
                description: 'The file is too large and cannot be uploaded. Please reduce the size of the file and try again.'
            })
        }
        else {
            await axios.post(`/test_upload`, formData)
                .then((result) => {
                    console.log(result)
                })
                .catch((error) => {
                    console.log(error)
                    api['error']({
                        message: 'Something went wrong',
                        description: error.message
                    })
                })
            await axios.post('/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.floor((loaded / total) * 100);
                    setUploadPercentage(percent);
                },
            })
                .then((result) => {
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
        }
    }

    return (
        <div className='flex h-screen'>
            {contextHolder}
            <div className='h-[500px] w-[800px] m-auto'>
                <ConfigProvider theme={{ token: { colorPrimary: '#166534' } }}>
                    <Button className='float-right bg-[#166534]' type='primary'
                        onClick={handleUpload} hidden={checkFiles} icon={<UploadOutlined />}>Save</Button>
                </ConfigProvider>
                <Upload size='large' beforeUpload={handleBeforeUpload} className='w-100'
                    onRemove={handleRemove} fileList={fileList} multiple>
                    <Button className='float-left bg-[#1677ff]' type='primary'
                        icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                {uploadPercentage > 0 && (
                    <Progress percent={uploadPercentage >= 99 ? 100 : uploadPercentage} className='mt-4' />
                )}
            </div>
        </div>
    )
}

export default UploadFile