
export const ColumnList = (command) => {
    
  const column_Marketing = [
      { title: '#', dataIndex: 'NO', key: 'NO', width: '40px', align: 'center', fixed: 'left' },
      {
          title: 'Loan Application Number', dataIndex: 'LAN', key: 'LAN', width: '200px', align: 'center', sorter: (a, b, c) => {
              return a.LAN.props.children.localeCompare(b.LAN.props.children)
          }, fixed: 'left'
      },
      { title: 'Date of Application', dataIndex: 'DOA', key: 'DOA', width: '200px', sorter: (a, b) => { return a.DOA.localeCompare(b.DOA) }, align: 'center' },
      { title: 'Loan Product', dataIndex: 'LP', key: 'LP', width: '250px', sorter: (a, b) => { return a.LP.localeCompare(b.LP) }, align: 'center' },
      { title: 'OFW', dataIndex: 'OFW', key: 'OFW', width: '300px', sorter: (a, b) => { return a?.OFW?.localeCompare(b?.OFW) }, align: 'center' },
      { title: 'OFW Departure Date', dataIndex: 'OFWDD', key: 'OFWDD', width: '180px', sorter: (a, b) => { return a?.OFWDD?.localeCompare(b?.OFWDD) }, align: 'center' },
      { title: 'Co-Borrower', dataIndex: 'BENE', key: 'BENE', width: '300px', sorter: (a, b) => { return a.BENE.localeCompare(b.BENE) }, align: 'center' },
      { title: 'Additional Co-Borrower', dataIndex: 'ACB', key: 'ACB', width: '250px', sorter: (a, b) => { return a?.ACB?.localeCompare(b?.ACB) }, align: 'center' },
      { title: 'Loan Consultant', dataIndex: 'LC', key: 'LC', width: '300px', sorter: (a, b) => { return a?.LC?.localeCompare(b?.LC) }, align: 'center' },
      { title: 'Loan Type', dataIndex: 'LT', key: 'LT', width: '100px', sorter: (a, b) => { return a.LT.localeCompare(b.LT) }, align: 'center' },
      { title: 'Loan Branch', dataIndex: 'LB', key: 'LB', width: '150px', sorter: (a, b) => { return a.LB.localeCompare(b.LB) }, align: 'center' },
      { title: 'Status', dataIndex: 'STAT', key: 'STAT', width: '120px', align: 'center'},
      { title: 'Updated By', dataIndex: 'UB', key: 'UB', width: '250px', sorter: (a, b) => { return a?.UB?.localeCompare(b?.UB) }, align: 'center' },
      { title: 'Latest Internal Remarks', dataIndex: 'LIR', key: 'LIR', sorter: (a, b) => { return a?.LIR?.localeCompare(b.LIR) }, width: '500px', align: 'center' },
  ]

  const column_Cro = [
      { title: '#', dataIndex: 'NO', key: 'NO', width: '40px', align: 'center', fixed: 'left' },
      {
          title: 'Loan Application Number', dataIndex: 'LAN', key: 'LAN', width: '200px', align: 'center', sorter: (a, b, c) => {
              return a.LAN.props.children.localeCompare(b.LAN.props.children)
          }, fixed: 'left'
      },
      {
          title: 'Assigned CRA', dataIndex: 'AC', key: 'AC', width: '250px', align: 'center', sorter: (a, b, c) => {
              return a.AC.props.children.localeCompare(b.AC.props.children)
          }, fixed: 'left'
      },
      { title: 'Date of Application', dataIndex: 'DOA', key: 'DOA', width: '200px', sorter: (a, b) => { return a.DOA.localeCompare(b.DOA) }, align: 'center' },
      { title: 'Loan Product', dataIndex: 'LP', key: 'LP', width: '250px', sorter: (a, b) => { return a.LP.localeCompare(b.LP) }, align: 'center' },
      { title: 'OFW', dataIndex: 'OFW', key: 'OFW', width: '300px', sorter: (a, b) => { return a?.OFW?.localeCompare(b?.OFW) }, align: 'center' },
      { title: 'OFW Departure Date', dataIndex: 'OFWDD', key: 'OFWDD', width: '180px', sorter: (a, b) => { return a?.OFWDD?.localeCompare(b?.OFWDD) }, align: 'center' },
      { title: 'Co-Borrower', dataIndex: 'BENE', key: 'BENE', width: '300px', sorter: (a, b) => { return a.BENE.localeCompare(b.BENE) }, align: 'center' },
      { title: 'Additional Co-Borrower', dataIndex: 'ACB', key: 'ACB', width: '250px', sorter: (a, b) => { return a?.ACB?.localeCompare(b?.ACB) }, align: 'center' },
      { title: 'Loan Consultant', dataIndex: 'LC', key: 'LC', width: '300px', sorter: (a, b) => { return a?.LC?.localeCompare(b?.LC) }, align: 'center' },
      { title: 'Loan Type', dataIndex: 'LT', key: 'LT', width: '100px', sorter: (a, b) => { return a.LT.localeCompare(b.LT) }, align: 'center' },
      { title: 'Loan Branch', dataIndex: 'LB', key: 'LB', width: '150px', sorter: (a, b) => { return a.LB.localeCompare(b.LB) }, align: 'center' },
      { title: 'Updated By', dataIndex: 'UB', key: 'UB', width: '250px', sorter: (a, b) => { return a?.UB?.localeCompare(b?.UB) }, align: 'center' },
      { title: 'Latest Internal Remarks', dataIndex: 'LIR', key: 'LIR', sorter: (a, b) => { return a?.LIR?.localeCompare(b.LIR) }, width: '500px', align: 'center' },
      { title: 'Last Update', dataIndex: 'LU', key: 'LU', sorter: (a, b) => { return a?.LU?.localeCompare(b.LU) }, width: '200px', align: 'center' },
      { title: 'Trans-In Date', dataIndex: 'TID', key: 'TID', sorter: (a, b) => { return a?.TID?.localeCompare(b.TID) }, width: '200px', align: 'center' },
      { title: 'Status', dataIndex: 'STAT', key: 'STAT', width: '250px', align: 'center'},


  ]

  const column_Accounting = [
      { title: "#", dataIndex: "NO", key: "NO", width: "40px", align: "center", fixed: "left", },
      {
        title: "Loan Application Number", dataIndex: "LAN", key: "LAN", width: "200px", align: "center",
        sorter: (a, b, c) => { return a.LAN.props.children.localeCompare(b.LAN.props.children); }, fixed: "left",
      },
      {
        title: "PN No.",
        dataIndex: "PN",
        key: "PN",
        width: "150px",
        sorter: (a, b) => {
          return a.PN.localeCompare(b.PN);
        },
        align: "center",
      },
      {
        title: "OFW",
        dataIndex: "OFW",
        key: "OFW",
        width: "300px",
        sorter: (a, b) => {
          return a?.OFW?.localeCompare(b?.OFW);
        },
        align: "center",
      },
      {
        title: "Co-Borrower",
        dataIndex: "BENE",
        key: "BENE",
        width: "300px",
        sorter: (a, b) => {
          return a.BENE.localeCompare(b.BENE);
        },
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
      {
        title: "Application Date",
        dataIndex: "DOA",
        key: "DOA",
        width: "200px",
        sorter: (a, b) => {
          return a.DOA.localeCompare(b.DOA);
        },
        align: "center",
      },
      {
        title: "Approve Amount",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
      {
        title: "Release Amount",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
    ];
  
    const column_FD = [
      {
        title: "#",
        dataIndex: "NO",
        key: "NO",
        width: "40px",
        align: "center",
        fixed: "left",
      },
      {
        title: "Loan Application Number",
        dataIndex: "LAN",
        key: "LAN",
        width: "200px",
        align: "center",
        sorter: (a, b, c) => {
          return a.LAN.props.children.localeCompare(b.LAN.props.children);
        },
        fixed: "left",
      },
      {
        title: "PN No.",
        dataIndex: "PN",
        key: "PN",
        width: "150px",
        sorter: (a, b) => {
          return a.PN.localeCompare(b.PN);
        },
        align: "center",
      },
      {
        title: "OFW",
        dataIndex: "OFW",
        key: "OFW",
        width: "300px",
        sorter: (a, b) => {
          return a?.OFW?.localeCompare(b?.OFW);
        },
        align: "center",
      },
      {
        title: "Co-Borrower",
        dataIndex: "BENE",
        key: "BENE",
        width: "300px",
        sorter: (a, b) => {
          return a.BENE.localeCompare(b.BENE);
        },
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
      {
        title: "Application Date",
        dataIndex: "DOA",
        key: "DOA",
        width: "200px",
        sorter: (a, b) => {
          return a.DOA.localeCompare(b.DOA);
        },
        align: "center",
      },
      {
        title: "Approved Amount",
        dataIndex: "AA",
        key: "AA",
        width: "200px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
      {
        title: "Release Amount",
        dataIndex: "RA",
        key: "RA",
        width: "200px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
    ];
  
    const column_BG = [
      {
        title: "Loan Application Number",
        dataIndex: "LAN",
        key: "LAN",
        width: "200px",
        align: "center",
        sorter: (a, b, c) => {
          return a.LAN.props.children.localeCompare(b.LAN.props.children);
        },
        fixed: "left",
      },
      {
        title: "PN No.",
        dataIndex: "PN",
        key: "PN",
        width: "150px",
        sorter: (a, b) => {
          return a.PN.localeCompare(b.PN);
        },
        align: "center",
      },
      {
        title: "OFW",
        dataIndex: "OFW",
        key: "OFW",
        width: "300px",
        sorter: (a, b) => {
          return a?.OFW?.localeCompare(b?.OFW);
        },
        align: "center",
      },
      {
        title: "Co-Borrower",
        dataIndex: "BENE",
        key: "BENE",
        width: "300px",
        sorter: (a, b) => {
          return a.BENE.localeCompare(b.BENE);
        },
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
      {
        title: "Disbursment Selection",
        dataIndex: "PS",
        key: "PS",
        width: "200px",
        align: "center",
      },
      {
        title: "Application Date",
        dataIndex: "DOA",
        key: "DOA",
        width: "200px",
        sorter: (a, b) => {
          return a.DOA.localeCompare(b.DOA);
        },
        align: "center",
      },
      {
        title: "Approve Amount",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
      {
        title: "Release Amount",
        dataIndex: "STAT",
        key: "STAT",
        width: "120px",
        sorter: (a, b, c) => {
          return c;
        },
        align: "center",
      },
    ];
  
    switch (command) {
      case 'BANK-GENERATION':
        return column_BG;
      case 'FOR-DISBURSEMENT':
        return column_FD;
      case '90':
        return column_Accounting;
        case '11':
          return column_Cro;
      default:
        return column_Marketing;
    }
}