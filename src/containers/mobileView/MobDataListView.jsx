import React from 'react';
import { Typography, Button, Pagination } from 'antd';
import { toEncrypt } from '@utils/Converter';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

function MobDataListView({ paginatedData, currentPage, handlePageChange }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Function to capitalize words in a string
  const capitalizeWords = (string) => {
    if (!string) return ''; // Handle empty or undefined strings
    return string
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Loan product mapping
  const loanProductMapping = {
    'DH - Philippines': 'DHP',
    'DH - Abroad': 'DHA',
    'OFW Loan - Abroad': 'LBA',
    'OFW Loan - In the Philippines': 'LBP',
    'Seafarer Loan - Deployed': 'SBA',
    'Seafarer Loan - In the Philippines': 'SBP',
  };

  return (
    <div className="flex flex-wrap gap-4 max-h-[420px] xs1:max-h-[285px] xs2:max-h-[400px] xs:max-h-[510px] sm:max-h-[420px] overflow-y-auto justify-center items-center">
      <div className="w-full">
        {paginatedData?.length === 0 ? (
          <div className="w-full flex justify-center items-center mt-5">
            <Typography.Text className="text-center font-bold">No Data Available</Typography.Text>
          </div>
        ) : (
          paginatedData?.map((x, i) => {
            const loanProductDescription = loanProductMapping[x.loanProduct] || x.loanProduct;

            return (
              <div className="my-2" key={i}>
                <div className="w-full my-2 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <span className="font-bold text-[13px] xs1:text-[12px] xs2:text-[14px]">LA Number:</span>
                    <Button
                      type="link"
                      className="text-cyan-600 font-bold text-lg xs1:text-xs xs2:text-sm xs:text-lg"
                      onClick={() => {
                        localStorage.setItem('SIDC', toEncrypt(x.loanAppId));
                        localStorage.setItem('activeTab', 'deduplication');
                        navigate(`${localStorage.getItem('SP')}/${x.loanAppCode}/deduplication`);
                        queryClient.invalidateQueries(
                          { queryKey: ['getRemarks', x.loanAppCode] },
                          { exact: true }
                        );
                      }}
                    >
                      <span className="text-cyan-600">{x.loanAppCode}</span>
                    </Button>
                  </div>
                  <div className="mt-1">
                    <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">
                      Loan Product: {` ${loanProductDescription}`}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">OFW:</span> {` ${x.borrowersFullName}`}
                  </div>
                  <div className="mt-1">
                    <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">Status:</span> {` ${capitalizeWords(x.statusName)}`}
                  </div>
                  <div className="mt-1">
                    <span className="font-bold text-lg xs1:text-xs xs2:text-[12px] xs:text-md">Remarks:</span> {` ${x.remarksIn}`}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="w-full flex justify-center sticky bottom-0 bg-stone-100 z-10 py-2">
        <Pagination
          current={currentPage}
          total={paginatedData?.length * 10} // Assuming total data is length * page size
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default MobDataListView;
