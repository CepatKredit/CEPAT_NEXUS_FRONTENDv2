import React, { useState, useEffect } from 'react';
import { Button, Space, Card, Modal, Form, Input, Select, Tooltip, Popconfirm, ConfigProvider } from 'antd';
import { SaveOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { MdEditSquare } from "react-icons/md";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GetData } from '@utils/UserData';

function ModCharacterReference({ BorrowerId, Creator, form, getCharacterRef, getRelationshipList, provinceList, onClickSaveData, onClickDeleteData }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const queryClient = useQueryClient();
  const [deleteKey, setDeleteKey] = React.useState(null);

  const getCharacterRefQuery = useQuery({
    queryKey: ['getCharacterRef', BorrowerId],
    queryFn: async () => {
      try {
        const result = await axios.get(`/GET/G13CR/${BorrowerId}`);
        let dataList = [{
          key: 0,
          no: '',
          name: '',
          conNum: '',
          relShip: '',
          prov: '',
          remarks: '',
        }];
        result.data.list?.map((x, i) => {
          dataList.push({
            key: x.characterRefId,
            no: i + 1,
            name: x.fullName,
            conNum: x.mobileNo,
            relShip: x.relationship,
            prov: x.province,
            remarks: x.remarks
          });
        });
        return dataList;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    refetchInterval: 500,
    enabled: Boolean(BorrowerId),
    retryDelay: 1000,
  });

  const getRelationshipListQuery = useQuery({
    queryKey: ['getRelationshipList'],
    queryFn: async () => {
      const result = await axios.get('/GET/G12R');
      return result.data.list;
    },
    retryDelay: 1000,
  });

  const getProvinceListQuery = useQuery({
    queryKey: ['getProvinceSelect'],
    queryFn: async () => {
      const result = await axios.get('/GET/G8P');
      return result.data.list;
    },
    retryDelay: 1000,
  });

  function GetReshipId() {
    if (!getRelationshipListQuery.data) return null;
    const relshipvalue = form.getFieldValue('relShip');
    const ReshipHolder = getRelationshipListQuery.data?.find((x) => x.description === relshipvalue || x.code === relshipvalue);
    return ReshipHolder ? ReshipHolder.code : null;
  }

  function GetProvId() {
    if (!getProvinceListQuery.data) return null;
    const provincevalue = form.getFieldValue('prov');
    const ProvHolder = getProvinceListQuery.data?.find((x) => x.provinceDescription === provincevalue || x.provinceCode === provincevalue);
    return ProvHolder ? ProvHolder.provinceCode : null;
  }

  const onClickSave = async (values) => {
    const data = {
      BorrowersId: BorrowerId,
      FullName: values.name,
      Relationship: GetReshipId(),
      MobileNo: values.conNum,
      Remarks: values.remarks || '',
      ProvinceId: values.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
      RecUser: Creator
    };

    try {
      const result = await axios.post('/POST/P60ACR', data);
      if (result.data.status === 'success') {
        queryClient.invalidateQueries(['getCharacterRef']);
        form.setFieldsValue({
          key: '',
          name: '',
          conNum: '',
          relShip: '',
          prov: '',
          remarks: '',
        });
        setEditingKey('');
      }
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const onClickEditData = useMutation({
    mutationFn: async (row) => {
      const data = {
        CharacterRefId: editingKey,
        FullName: row.name,
        Relationship: GetReshipId(),
        MobileNo: row.conNum,
        Remarks: row.remarks || '',
        ProvinceId: row.prov ? (GetProvId() ? GetProvId().toString() : '') : '',
        ModUser: Creator
      };

      await axios.post('/POST/P61UCR', data)
        .then((result) => {
          if (result.data.status === 'success') {
            queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
            setEditingKey('');
            setModalVisible(false);
          }
        })
        .catch((error) => {
          console.error('Error editing data', error);
        });
    }
  });

  const onClickDelete = (e) => {
    setDeleteKey(e);
    axios.post(`/POST/P62DCR/${e}`).then((result) => {
      queryClient.invalidateQueries({ queryKey: ['getCharacterRef'] }, { exact: true });
      setDeleteKey(null);
    }).catch((error) => {
      console.error('Error deleting data', error);
    });
  };

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      key: record.key,
      name: record.name,
      conNum: record.conNum,
      relShip: record.relShip,
      prov: record.prov,
      remarks: record.remarks,
    });
    setEditingKey(record.key);
    setModalVisible(true);
  };

  return (
    <>
      <ConfigProvider theme={{ token: { colorPrimary: '#6b21a8' } }}>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: '15px' }} />}
            size="large"
            onClick={() => setModalVisible(true)}
            className="w-full max-w-[250px] mb-2"
          >
            Add
          </Button>
          {getCharacterRefQuery.data?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
              {getCharacterRefQuery.data?.map((x) => {
                const hasData = x.name || x.conNum || x.relShip || x.prov || x.remarks;
                return hasData ? (
                  <Card key={x.key} title={`Character Reference`} bordered={false}>
                    {x.name && <p><strong>Name:</strong> {x.name}</p>}
                    {x.conNum && <p><strong>Contact Number:</strong> {x.conNum}</p>}
                    {x.relShip && <p><strong>Relationship:</strong> {x.relShip}</p>}
                    {x.prov && <p><strong>Province:</strong> {x.prov}</p>}
                    {x.remarks && <p><strong>Remarks:</strong> {x.remarks}</p>}
                    <Space>
                      <Tooltip title="Edit">
                        <Button
                          className="bg-[#3b0764]"
                          onClick={() => edit(x)}
                          type="primary"
                          icon={<MdEditSquare />}
                          disabled={editingKey !== ''}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Popconfirm
                          title="Are you sure you want to delete this record?"
                          onConfirm={() => onClickDelete(x.key)}
                          okText="Yes"
                          cancelText="Cancel"
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            type="primary"
                            danger
                            disabled={editingKey !== ''}
                            loading={deleteKey === x.key}
                          />
                        </Popconfirm>
                      </Tooltip>
                    </Space>
                  </Card>
                ) : null;
              })}
            </div>
          ) : (
            <p>No Character References available.</p>
          )}
        </div>
      </ConfigProvider>

      {/* Modal for Add/Edit Character Reference */}
      <Modal
        title={editingKey ? "Edit Character Reference" : "Add Character Reference"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={editingKey ? onClickEditData.mutate : onClickSave} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item name="conNum" label="Contact Number" rules={[{ required: true }]}>
            <Input placeholder="Enter contact number" maxLength={11} />
          </Form.Item>
          <Form.Item name="relShip" label="Relationship" rules={[{ required: true }]}>
            <Select placeholder="Select relationship">
              {getRelationshipListQuery.data?.map((x) => (
                <Select.Option key={x.code} value={x.description}>
                  {x.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="prov" label="Province" rules={[{ required: true }]}>
            <Select placeholder="Select province">
              {getProvinceListQuery.data?.map((x) => (
                <Select.Option key={x.provinceCode} value={x.provinceDescription}>
                  {x.provinceDescription}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input placeholder="Enter remarks" />
          </Form.Item>
          <div className="flex justify-center gap-4">
            <Tooltip title="Save">
              <Button
                icon={<SaveOutlined />}
                type="primary"
                htmlType="submit"
                loading={onClickSaveData.isPending}
                className="bg-[#2b972d]"
                size="large"
              />
            </Tooltip>
            <Tooltip title="Cancel">
              <Button
                icon={<CloseOutlined />}
                type="primary"
                danger
                onClick={() => {
                  setModalVisible(false);
                  setEditingKey('');
                }}
                size="large"
              />
            </Tooltip>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default ModCharacterReference;
