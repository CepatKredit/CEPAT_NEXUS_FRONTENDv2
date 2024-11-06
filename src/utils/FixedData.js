export const Suffix = () => {
    const dataList = [
        {
            value: '1',
            label: 'N/A',
        },
        {
            value: '2',
            label: 'Sr.',
        },
        {
            value: '3',
            label: 'Jr.',
        },
        {
            value: '4',
            label: 'I',
        },
        {
            value: '5',
            label: 'II',
        },
        {
            value: '6',
            label: 'III',
        },
        {
            value: '7',
            label: 'IV',
        },
        {
            value: '8',
            label: 'V',
        },
    ]

    return dataList;
}

export const StatusDrop = () => {
    const dataList = [
        {
            value: 'ENABLE',
            label: 'ENABLE',
        },
        {
            value: 'DISABLE',
            label: 'DISABLE',
        },
        {
            value: 'FOR APPROVAL',
            label: 'FOR APPROVAL',
        },
        {
            value: 'REJECTED',
            label: 'REJECTED',
        },
    ]

    return dataList;
}

export const SessionTimeoutList = () => {
    const dataList = [
        {
            value: 15,
            label: '15 Minutes',
        },
        {
            value: 30,
            label: '30 Minutes',
        },
        {
            value: 45,
            label: '45 Minutes',
        },
        {
            value: 60,
            label: '1 Hour',
        },
        {
            value: 120,
            label: '2 Hours',
        },
    ]

    return dataList;
}


export const LoanType = (deFault = true) => {
    const dataList = [
        {
            value: 1,
            label: 'NEW',
        },
        {
            value: 2,
            label: 'RENEWAL',
        },
        
    ]
    if (deFault) {
        dataList.push({
            value: 3,
            label: 'DORMANT',
        });
    }
    return dataList;
}

export const MaritalStatus = () => {
    const dataList = [
        {
            value: 1,
            label: 'Single',
        },
        {
            value: 2,
            label: 'Married',
        },
        {
            value: 3,
            label: 'Widowed',
        },
        {
            value: 4,
            label: 'Separated',
        },
        {
            value: 5,
            label: 'Common Law',
        },
        {
            value: 6,
            label: 'Live in Partner',
        },
    ]


    return dataList;
}

export const Gender = () => {
    const dataList = [
        {
            value: 1,
            label: 'Male',
        },
        {
            value: 2,
            label: 'Female',
        },
        
    ]
    return dataList;
}


    export const Residences = () => {
        const dataList = [
    {
        value: 1,
        label: 'Owned House',
    },
    {
        value: 2,
        label: 'Mortgaged',
    },
    {
        value: 3,
        label: 'Renting',
    },
    {
        value: 4,
        label: 'Used Free',
    },
]
return dataList;
}
export const WorkEducStatus = () => {
    const dataList = [
        {
            value: 1,
            label: "Student",
        },
        {
            value: 2,
            label: "Employed",
        },
        {
            value: 3,
            label: "Un-Employed",
        },
        {
            value: 4,
            label: "N/A",
        }
    ]
    return dataList;
}
export const EducationalAttainment = () => {
    const dataList = [
        {
            value: 1,
            label: 'N/A',
        },
        {
            value: 2,
            label: 'Elementary School',
        },
        {
            value: 3,
            label: 'High School',
        },
        {
            value: 4,
            label: 'College',
        },
        {
            value: 5,
            label: 'Associate / Vocational Degree',
        },
        {
            value: 6,
            label: 'Bachelor / Master / Doctorate Degree',
        },
        {
            value: 7,
            label: 'Technical or Trade School Certificate',
        },
        {
            value: 8,
            label: 'Postgraduate Studies',
        },
        {
            value: 9,
            label: 'Professional Certification',
        },
        
    ]
    return dataList;
}


   

export const BranchStatus = () => {
    const dataList = [
        {
            value: 1,
            label: 'ENABLE',
        },
        {
            value: 0,
            label: 'DISABLE',
        },
    ]
    return dataList;
}
export const ValidId = () => {
    const dataList = [
        {
            value: "Government ID's",
            label: "Government ID's",
        },
        {
            value: "N/A",
            label: "N/A",
        }
    ]
    return dataList;
}

export const Hckfi = () => {
    const dataList = [
        
        {
            value: 16,
            label: "Facebook",
        },
        {
            value: 1,
            label: "Tiktok",
        },
        {
            value: 3,
            label: "Influencer",
        },
        {
            value: 2,
            label: "YouTube",
        },
        {
            value: 4,
            label: "Cepat Website",
        },
        {
            value: 11,
            label: "Internet",
        },
        {
            value: 12,
            label: "Events",
        },
        {
            value: 13,
            label: "Blogs/Articles",
        },
        {
            value: 8,
            label: "SMS/Text Message",
        },
        {
            value: 5,
            label: "Client Referral",
        },
        {
            value: 10,
            label: "Loan Consultant/Referral",
        },
        {
            value: 15,
            label: "Cepat Branch",
        },
        {
            value: 6,
            label: "Tarpaulin/Banners",
        },
        {
            value: 14,
            label: "Asialink Finance Referral",
        },
        
       
        
    ]
    return dataList;
}
export const ReferredBy = () => {
    const dataList = [
        {
            value: 1,
            label: "Online Marketing Group",
        },
        {
            value: 2,
            label: "Tele-Marketing Group",
        },
        {
            value: 3,
            label: "Custom Service",
        },
        {
            value: 4,
            label: "Branch",
        }
    ]
    return dataList;
}
export const LoanTerms = (terms) => {
    const dataList = [];
    for (let x = 3; x <= terms; x++) {
        dataList.push({
            value: x,
            label: x,
        });
    }
    return dataList;
}

export const CallCodes = () => {
    const dataList = [
        {
            value: '+63',
            label: 'Philippines +63'
        },
        {
            value: '+1',
            label: 'USA +1'
        },
        {
            value: '+44',
            label: 'UK +44'
        },
        {
            value: '+91',
            label: 'India +91'
        },
        {
            value: '+61',
            label: 'Australia +61'
        }
    ]
    return dataList;
}

export const mmddyy = (date) => {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
};

export const loanterm = () => {
    const dataList = Array.from({ length: 22 }, (v, i) => ({
        value: (i + 3).toString(),
        label: `${i + 3} Months`
    }));
    
    return dataList;
}

export const WorkEducStatusOption = () => {
    const dataList = [
        {
            value: 1,
            label: "Student",
        },
        {
            value: 2,
            label: "Employed",
        },
        {
            value: 3,
            label: "Un-Employed",
        },
        {
            value: 4,
            label: "N/A",
        }
    ]
    return dataList;
}

export const SpouseSourceIncome = () =>{
    const dataList = [
        {
            value: 1,
            label: "Employed",
        },
        {
            value: 2,
            label: "Unemployed",
        },
        {
            value: 3,
            label: "Business",
        }
    ]
    return dataList;
}

export const EmploymentStatus = () => {
    const dataList = [
        {
            value: 1,
            label: "Rehired",
        },
        {
            value: 2,
            label: "Under Agency"
        },
        {
            value: 3,
            label: "Direct Hired"
        },
        {
            value: 4,
            label: "Lb Abroad"
        }
    ]
    return dataList;
}
export const Currency = () =>{
    const dataList = [
        {
            currencyPeso:2.549,
            value: "JPY",
            label: "Japanese Yen (¥)",
        },
        {
            currencyPeso:56.36,
            value: "USD",
            label: "United States Dollar ($)",
        },
        {
            currencyPeso:8.01,
            value: "CNY",
            label: "Chinese Yuan (¥)",
        }
    ]
    return dataList;
}
export const AllotChannel = () => {
    const dataList = [
        {
            value:1,
            label: 'GCASH',
        },
        {
            value:2,
            label: 'Bank',
        }
    ]
    return dataList;
}
export const Overseas = () => {
    const dataList = [
        {
            value:1,
            label: 'YES',
        },
        {
            value:2,
            label: 'NO',
        }
    ]
    return dataList;
}
export const Religion = () => {
    const dataList = [
        {
            value: 1,
            label: 'Catholic'
        },
        {
            value: 2,
            label: 'Islam'
        },
        {
            value: 3,
            label: 'Evangelicals (Philippine Council of Evangelical Churches)'
        },
        {
            value: 4,
            label: 'Iglesia ni Cristo'
        },
        {
            value: 5,
            label: 'Aglipayan (Philippine Independent Church)'
        },
        {
            value: 6,
            label: 'Seventh-day Adventist'
        },
        {
            value: 7,
            label: 'Jehovah’s Witnesses'
        },
        {
            value: 8,
            label: 'Buddhism'
        },
        {
            value: 9,
            label: 'Protestant'
        },
        {
            value: 10,
            label: 'Hinduism'
        },
        {
            value: 11,
            label: 'Judaism'
        },
        {
            value: 12,
            label: 'Mormon (Church of Jesus Christ of Latter-day Saints)'
        },
        {
            value: 13,
            label: 'Baha’i Faith'
        },
        {
            value: 14,
            label: 'Methodist'
        },
        {
            value: 15,
            label: 'United Church of Christ in the Philippines (UCCP)'
        },
        {
            value: 16,
            label: 'Pentecostal'
        },
        {
            value: 17,
            label: 'Baptist'
        },
        {
            value: 18,
            label: 'Anglican (Episcopal Church in the Philippines)'
        },
        {
            value: 19,
            label: 'Other Christian denominations'
        },
        {
            value: 20,
            label: 'Unitarian Universalism'
        },
        {
            value: 21,
            label: 'Animism (Indigenous/Tribal Religions)'
        },
        {
            value: 22,
            label: 'Sikhism'
        },
        {
            value: 23,
            label: 'Taoism'
        },
        {
            value: 24,
            label: 'Falun Gong'
        },
        {
            value: 25,
            label: 'Zoroastrianism'
        },
        {
            value: 26,
            label: 'Confucianism'
        },
        {
            value: 27,
            label: 'Church of the Nazarene'
        },
        {
            value: 28,
            label: 'Scientology'
        },
        {
            value: 29,
            label: 'Apostolic Catholic Church'
        },
        {
            value: 30,
            label: 'Eastern Orthodox Christianity'
        },
        {
            value: 31,
            label: 'Quakers (Society of Friends)'
        },
        {
            value: 32,
            label: 'Church of Christ (Iglesia sa Dios, Kay Kristo Hesus)'
        },
        {
            value: 33,
            label: 'Rizalista Religious Movements'
        },
        {
            value: 34,
            label: 'Aetherius Society'
        },
        {
            value: 35,
            label: 'Kabbalah'
        },
        {
            value: 36,
            label: 'New Thought'
        },
        {
            value: 37,
            label: 'Wicca'
        },
        {
            value: 38,
            label: 'Druze'
        },
        {
            value: 39,
            label: 'Shintoism'
        },
        {
            value: 40,
            label: 'Neo-Paganism'
        },
        {
            value: 41,
            label: 'Universal Church of the Kingdom of God'
        }
    ]
    return dataList;
}
export const JobCategory = () =>{
    const dataList = [
        {
            value: 1,
            label: 'Computer and Information Technology',
            
        },
        {
            value: 2,
            label: 'Administration & Office Support',
        }
    ]
    return dataList;
}
export const JobTitle = (job) => {
    const dataList1 = [
        {
            value: 'SD',
            label: 'Software Developer',
        },
        {
            value: 'DA',
            label: 'Database Administrator',
        },
        {
            value: 'SA',
            label: 'System Analyst',
        }
    ]
    const dataList2 = [
        {
            value: 'AA',
            label: 'Administrative Assistant',
        },
        {
            value: 'R',
            label: 'Receptionist',
        }
    ]
    switch(job){
        case 1: return  dataList1;
        case 2: return dataList2;
    }

}
export const DropdownOwnedProperties = () =>{
    const dataList = [
        {
            value: 1,
            label: 'Commercial',
            
        },
        {
            value: 2,
            label: 'Residential',
        },
        {
            value: 3,
            label: 'Lot',
        }
    ]
    return dataList;
}

export const DropdownOwnedAssets = () =>{
    const dataList = [
        {
            value: 1,
            label: 'Truck',
            
        },
        {
            value: 2,
            label: 'Car',
        },
        {
            value: 3,
            label: 'Motor',
        },
        {
            value: 4,
            label: 'Bus',
        },
        {
            value: 5,
            label: 'Multicab',
        },
        {
            value: 6,
            label: 'Tricycle',
        }
    ]
    return dataList;
}

export const RequestTypeDropdown = (loanProd) => {
    const MArequestType = [
        {
            value: 1,
            label: 'RENEWAL'
        },
        ...(loanProd === '0303-DHW' || loanProd === '0303-VL' || loanProd === '0303-WL' ? [
            {
                value: 2,
                label: 'DD TODAY - DD TOMORROW'
            }
        ] : []),
        {
            value: 3,
            label: 'PERSONAL APPEARANCE'
        },
       
    ];

    const LPrequestType = [
        {
            value: 6,
            label: 'RHA',
        },
        {
            value: 7,
            label: 'TERMS',
        },
        {
            value: 8,
            label: 'INTEREST RATE',
        },
        {
            value: 9,
            label: 'LOAN CHARGES',
        },
        {
            value: 10,
            label: 'DOCUMENTATION',
        },
        {
            value: 11,
            label: 'LTP',
        }
    ];

    return { MArequestType, LPrequestType };
};

