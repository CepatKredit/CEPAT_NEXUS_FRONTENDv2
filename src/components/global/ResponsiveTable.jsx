import * as React from 'react'
import { Table } from 'antd'

function ResponsiveTable({ rows, columns, width, height, loading, change }) {
    return (
        <>
            <Table
                size='small'
                onChange={change}
                columns={columns}
                dataSource={rows}
                loading={loading}
                scroll={{
                    y: height,
                    x: width
                }} />
        </>
    )
}

export default ResponsiveTable