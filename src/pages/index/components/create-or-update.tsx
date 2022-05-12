import { Modal, Input, Form, InputNumber, TreeSelect, message } from 'antd'
import {useEffect, useMemo, useState} from "react";
import {request} from "umi";
import {useModel} from "@@/plugin-model/useModel";

interface CreateOrUpdateProps {
  visible: boolean;
  record: any;
  handleClose: Function;
}

export default (props: CreateOrUpdateProps)=>{

  const [form] = Form.useForm()
  const { initialState:{ userInfo } } = useModel<any>('@@initialState');

  const title = useMemo(()=> props.record.id ? "编辑数据类型" : '添加数据类型', [props.record])
  const fieldNames = { label: 'name', value: 'id' }
  const [list, setList] = useState([])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  useEffect(()=>{
    if(props.visible){
      search().then(()=>{
        form.setFieldsValue({
          ...props.record,
          sortOrder: props.record.sortOrder || 0
        })
      })
    }else {
      form.resetFields()
    }
  },[props.visible])



  async function search(keyword?: string){
    const res = await request(`/api/dataType/list/tree/${userInfo.id}`)
    setList(res.data)
  }

  async function handleSave(){
    const data = await form.validateFields();
    let url = "/api/dataType/create";
    if(props.record.id){
      data.id = props.record.id
      url = "/api/dataType/update";
      if(data.parentId && data.parentId === data.id){
        return message.info("不能将上级节点设置为自身！");
      }
    }

    const res = await request(url,{
      method: 'post',
      data
    })
    console.log(res)
    if(res.code === 200 && res.data){
      message.success("保存成功！")
      props.handleClose(true)
    }else {
      message.error(res.message)
    }

  }

  return (
    <Modal
      title={title}
      visible={props.visible}
      width='38vw'
      onOk={handleSave}
      onCancel={()=>props.handleClose(false)}
      cancelText="取消"
      okText="确定"
    >
      <Form {...layout} form={form} autoComplete="off">
        <Form.Item name="code" label="数据类型编码" rules={[{ required: true, message: '请输入数据类型编码' }]}>
          <Input disabled={props.record.id} value={props.record.code} placeholder="请输入数据类型编码"/>
        </Form.Item>
        <Form.Item name="name" label="数据类型名称" rules={[{ required: true, message: '请输入数据类型名称' }]}>
          <Input value={props.record.name}  placeholder="请输入数据类型名称"/>
        </Form.Item>
        <Form.Item name="url" label="链接url">
          <Input value={props.record.url}  placeholder="请输入链接url"/>
        </Form.Item>
        <Form.Item name="parentId" label="上级数据类型">
          <TreeSelect
            style={{ width: '100%' }}
            value={props.record.parentId}
            fieldNames={fieldNames}
            allowClear
            treeDefaultExpandAll
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={list}
            placeholder="请选择上级数据类型"
          />
        </Form.Item>
        <Form.Item name="sortOrder" label="排序">
          <InputNumber value={props.record.sortOrder}  min={0} step={1} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
