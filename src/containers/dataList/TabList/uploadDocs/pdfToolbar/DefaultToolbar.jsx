import * as React from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

function DefaultToolbar({ file }) {

    //disable download PDF depends on User Roles

    const newplugin = defaultLayoutPlugin()
    return (
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'>
            <Viewer fileUrl={file} plugins={[newplugin]} />
        </Worker>
    )
}

export default DefaultToolbar