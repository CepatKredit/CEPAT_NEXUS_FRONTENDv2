import * as React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { ZoomOutOutlined, ZoomInOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/toolbar/lib/styles/index.css"

function LimitedToolbar({ file }) {
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    return (
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#eeeeee',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        padding: '4px',
                    }}
                >
                    <Toolbar>
                        {props => {
                            const {
                                CurrentPageInput,
                                CurrentScale,
                                GoToNextPage,
                                GoToPreviousPage,
                                NumberOfPages,
                                ZoomIn,
                                ZoomOut
                            } = props
                            return (
                                <>
                                    <div style={{ padding: "0px 2px" }}>
                                        <ZoomOut>
                                            {props => (
                                                <Tooltip placement='bottom' title='Zoom out'>
                                                    <Button type='test' icon={<ZoomOutOutlined />} onClick={props.onClick} />
                                                </Tooltip>
                                            )}
                                        </ZoomOut>
                                    </div>
                                    <div style={{ padding: "0px 2px" }}>
                                        <CurrentScale>
                                            {props => <span>{`${Math.round(props.scale * 100)}%`}</span>}
                                        </CurrentScale>
                                    </div>
                                    <div style={{ padding: "0px 2px" }}>
                                        <ZoomIn>
                                            {props => (
                                                <Tooltip placement='bottom' title='Zoom in'>
                                                    <Button type='test' icon={<ZoomInOutlined />} onClick={props.onClick} />
                                                </Tooltip>
                                            )}
                                        </ZoomIn>
                                    </div>
                                    <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                                        <GoToPreviousPage>
                                            {props => (
                                                <Tooltip placement='bottom' title='Previous page'>
                                                    <Button type='test' icon={<UpOutlined />} onClick={props.onClick} />
                                                </Tooltip>
                                            )}
                                        </GoToPreviousPage>
                                    </div>
                                    <div style={{ padding: "0px 2px", width: "4rem" }}>
                                        <CurrentPageInput />
                                    </div>
                                    <div style={{ padding: "0px 2px" }}>
                                        / <NumberOfPages />
                                    </div>
                                    <div style={{ padding: "0px 2px" }}>
                                        <GoToNextPage>
                                            {props => (
                                                <Tooltip placement='bottom' title='Next page'>
                                                    <Button type='test' icon={<DownOutlined />} onClick={props.onClick} />
                                                </Tooltip>
                                            )}
                                        </GoToNextPage>
                                    </div>
                                </>
                            )
                        }}
                    </Toolbar>
                </div>
                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Viewer fileUrl={file} plugins={[toolbarPluginInstance]} />
                </div>
            </div>
        </Worker>
    )
}

export default LimitedToolbar