import * as React from 'react';
import { Table, ConfigProvider } from 'antd';

function ResponsiveTable({ rows, columns, width, height, loading, change }) {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: {
                        cellFontSize: 20,
                        fontSize: 11, 
                        
                    },
                },
            }}
        >
                <Table
                    size="small"
                    onChange={change}
                    columns={columns}
                    dataSource={rows}
                    loading={loading}
                    scroll={{
                        y: height,
                        x: width,
                    }}
                    pagination={{ pageSize: 10 }} // Adjust as needed
                />
        </ConfigProvider>
    );
}

export default ResponsiveTable;
