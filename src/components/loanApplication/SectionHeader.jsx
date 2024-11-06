// src/components/SectionHeader.js
import React from 'react';
import { Typography } from 'antd';

const GradientLine = () => (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 via-gray-300 to-transparent"></div>
);

const SectionHeader = ({ title, borrower }) => (
    <div className="my-2">
        <div className='text-center'>
            <div className='font-bold text-2xl'>{borrower}</div>
            <div className='font-semibold text-lg'>{title}</div>
        </div>
        <div className="flex items-center mt-2">
            <GradientLine />
        </div>
    </div>
);

export default SectionHeader;
