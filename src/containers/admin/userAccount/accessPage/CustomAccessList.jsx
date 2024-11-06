import * as React from 'react'
import { ConfigProvider, Button, Space, Table, Select, Tooltip, Popconfirm } from 'antd'
import { SaveOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';


function CustomAccessList({ List, isLoading, isEdit }) {

    const [getAccess, setAccess] = React.useState({
        key: '',
        AccessList: []
    })

    React.useEffect(() => {
        setEditingKey(isEdit)
    }, [isEdit])

    const columns = [
        {
            title: 'Description',
            dataIndex: 'descr',
            key: 'descr',
            width: '180px',
        },
        {
            title: 'Access',
            dataIndex: 'access',
            key: 'access',
            width: '150px',
            editable: true,
        },
        
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '60px',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (<Space>
                    <Tooltip title='Save'>
                        <Button onClick={() => {
                            //console.log(record)
                        }} icon={<SaveOutlined />} type='primary' success />
                    </Tooltip>
                    <Tooltip title='Cancel'>
                        <Popconfirm title="Are you sure you want to cancel the edit?"
                            onConfirm={() => { setEditingKey('') }}>
                            <Button icon={<CloseOutlined />} type='primary' danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>)
                    : (<center>
                        <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                            <Tooltip title='Edit'>
                                <Button className='bg-[#3b0764]' onClick={() => { edit(record) }}
                                    disabled={editingKey} icon={<EditOutlined />} type='primary' />
                            </Tooltip>
                        </ConfigProvider>
                    </center>)
            }
        }
    ]

    const [editingKey, setEditingKey] = React.useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        setAccess({
            ...getAccess,
            key: record.key,
            AccessList: record.access.split(',')
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
        let inputNode = <Select className='w-[100%]'
            allowClear
            maxTagCount={'responsive'}
            mode={'multiple'}
            value={getAccess.AccessList}
            onChange={(e) => {
                setAccess({
                    ...getAccess,
                    AccessList: e
                })
            }}
            options={record?.access?.split(',').map((data) => ({
                value: data,
                label: data
            }))}
        />
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
    }

    return (
        <>
            <div className='mb-2'>
                <center>
                    <span className='text-lg font-bold'>Custom Access</span>
                </center>
            </div>
            <Table size='small' columns={mergedColumns}
                dataSource={List?.map((x) => ({
                    key: x.id,
                    descr: x.description,
                    access: x.accessType,
                }))}
                loading={isLoading}
                components={{ body: { cell: EditableCell } }}
                scroll={{ y: '16.5rem' }} />
        </>
    )
}

export default CustomAccessList