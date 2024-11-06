import LabeledCurrencyInput from "@components/global/LabeledCurrencyInput";
import LabeledInput from "@components/global/LabeledInput";
import LabeledSelect from "@components/global/LabeledSelect";
import { detailCurrencyModal } from "@hooks/ModalAdminController";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mmddyy } from "@utils/Converter";
import { GET_LIST } from "@api/base-api/BaseApi";
import { Button, ConfigProvider } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import React from "react";

function CurrencyDetails({ option,api }) {
    const token = localStorage.getItem('UTK')
    const setModalStatus = detailCurrencyModal((state) => state.setStatus);
    const getModalStatus = detailCurrencyModal((state) => state.modalStatus);

    const queryClient = useQueryClient();
    const [getData, setData] = React.useState({
        Id: '',
        Code: '',
        Country: '',
        CurrencyName: '',
        ExchangeRate: '',
        ModifiedBy: '',
        DateModified: '',
        AddedBy: '',
        DateAdded: '',
        Status: '',
    })

    React.useEffect(() => {
        if (option != 'NEW') {
            setData((prevData) => ({
                ...prevData,
                Id: option.id,
                Code: option.currencyCode,
                Country: option.country,
                CurrencyName: option.currencyName,
                ExchangeRate: option.exchangeRate,
                ModifiedBy: jwtDecode(token).USRID,
                AddedBy: option.recUser,
                DateAdded: option.recDate,
                Status: option.status,
            }))
        } else {
            setData((prevData) => ({
                ...prevData,
                Code: '',
                Country: '',
                CurrencyName: '',
                ExchangeRate: '',
                ModifiedBy: null,
                DateModified: null,
                AddedBy: jwtDecode(token).USRID,
                Status: 'ENABLED',
            }))
        }

    }, [option,getModalStatus])

    async function save() {
        const validateAdd = ['Code', 'Country', 'CurrencyName', 'ExchangeRate',  'Status'];
        const validateEdit = ['Code', 'Country', 'CurrencyName', 'ExchangeRate',  'Status'];

        const fieldsToValidate = option !== 'NEW' ? validateEdit : validateAdd;

        const hasInvalidField = fieldsToValidate.some(field => {
            console.log(`field: ${field}, value:`, getData[field]);
            const condition = getData[field] === undefined || getData[field] === '';
            console.log(`Result for field ${field}:`, condition);
            return condition;
        });

        if (hasInvalidField) {
            api['warning']({
                message: 'Incomplete Details',
                description: 'Please complete all required details.',
            });
        } else if (!hasInvalidField && option != 'NEW') {
            await update();
        } else if (!hasInvalidField && option == 'NEW') {
            await add();
        }
    }
    async function add() {
        const data = {
            currencyCode: getData.Code,
            country: getData.Country,
            currencyName: getData.CurrencyName,
            exchangeRate: getData.ExchangeRate,
            recUser: jwtDecode(token).USRID,
            recDate: mmddyy(dayjs()),
            status: getData.Status,
        }
        try {
            const result = await axios.post('/addCurrency', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });
            if(result.data.status==='success'){
                queryClient.invalidateQueries({ queryKey: ['CurrencyListQuery'] }, { exact: true });
                setModalStatus(false);
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
            console.log(error)
        }
    }

    async function update() {
        const data = {
            iD: getData.Id,
            currencyCode: getData.Code,
            country: getData.Country,
            currencyName: getData.CurrencyName,
            exchangeRate: getData.ExchangeRate,
            modUser: jwtDecode(token).USRID,
            status: getData.Status,
            modDate: mmddyy(dayjs()),
        }
        console.log(data)
        try {
            const result = await axios.post('/editCurrency', data);
            api[result.data.status]({
                message: result.data.message,
                description: result.data.description
            });
            if(result.data.status==='success'){
                queryClient.invalidateQueries({ queryKey: ['CurrencyListQuery'] }, { exact: true });
                setModalStatus(false);
            }
        } catch (error) {
            api['error']({
                message: 'Something went wrong',
                description: error.message
            });
            console.log(error)
        }
       
    }

    const getCountrySelect = useQuery({
        queryKey: ['getCountrySelect'],
        queryFn: async () => {
            const result = await GET_LIST('/OFWDetails/getCountry');
            return result.list;
        },
        refetchInterval: (data) => {
            data?.length === 0
                ? 500 : false
        },
        enabled: true,
        retryDelay: 1000,
    });

    return (<>
        <LabeledInput placeHolder={'Currency Code'} className={'w-[100%]'} label={'Currency Code'} value={getData.Code}
            receive={(e) => { setData({ ...getData, Code: e }) }} readOnly={option != 'NEW' ? true : false} />
        <LabeledSelect
            className='w-[100%]'
            label='Country'
            value={getData.Country}
            receive={(e) => { setData({ ...getData, Country: e }) }}
            data={getCountrySelect.data?.map(x => ({
                label: x.description,
                value: x.description,
            }))}
            filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
            }
        />
        <LabeledInput placeHolder={'Currency Name'} className={'w-[100%]'} label={'Currency Name'} value={getData.CurrencyName}
            receive={(e) => { setData({ ...getData, CurrencyName: e }) }} />
        <LabeledCurrencyInput className={'w-[100%]'} label={'Exchange Rate(Foreign to Peso)'} value={getData.ExchangeRate}
            receive={(e) => { setData({ ...getData, ExchangeRate: e }) }} />
        <LabeledSelect
            className='w-[100%]'
            label='Status'
            value={getData.Status}
            receive={(e) => { setData({ ...getData, Status: e }) }}
            data={[
                { label: 'ENABLED', value: 'ENABLED' },
                { label: 'DISABLED', value: 'DISABLED' }
            ]}
        />
        <center>
            {option === 'NEW'
                ? (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button
                            className='bg-[#3b0764] mt-5 w-[100px]'
                            size='large'
                            type='primary'
                            onClick={save}
                        >
                            Add
                        </Button>
                    </ConfigProvider>
                ) : (
                    <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
                        <Button
                            className='bg-[#3b0764] mt-5 w-[100px]'
                            size='large'
                            type='primary'
                            onClick={save}
                        >
                            Update
                        </Button>
                    </ConfigProvider>
                )}
        </center>
    </>
    );
};
export default CurrencyDetails;