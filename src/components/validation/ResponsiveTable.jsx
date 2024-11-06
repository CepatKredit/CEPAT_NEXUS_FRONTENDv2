import * as React from 'react'
import { Table } from 'antd'

function ResponsiveTable({locale, rows, columns, width, height, loading }) {
    return (
        <>
            <Table
                size='small'
                columns={columns}
                locale={locale}
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