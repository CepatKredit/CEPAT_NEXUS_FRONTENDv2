// src/components/SectionHeader.js
import React from 'react';
import { Typography } from 'antd';

const GradientLine = () => (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 via-gray-300 to-transparent"></div>
);

const SectionHeader = ({ title, tag }) => (
    <div className="my-8">
        <div className='font-bold text-2xl text-center mt-[3rem]'>{title}</div>
        {
            tag ? (<div className='font-semibold text-center'>({tag})</div>) : (<></>)
        }
        <div className="flex items-center mt-2">
            <GradientLine />
        </div>
    </div>
);

export default SectionHeader;
