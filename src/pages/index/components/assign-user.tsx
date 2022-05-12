import {Table, Modal, Input, message} from 'antd'
import {useEffect, useMemo, useState} from "react";
import {request} from "umi";
import styles from './assign-user.less'
import { useImmer } from "use-immer";
import { produce } from "immer";

interface AssignUserProps {
  visible: boolean;
  record: any;
  handleClose: Function;
}

export default (props: AssignUserProps)=>{

  const [dataSource, setDataSource] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pagination, setPagination]:any = useState<any>({
    total: 0,
    pageSize: 10,
    current: 1,
    onChange: (current: number, pageSize: number)=>{
      setPagination(produce((draft:any) => {
        draft.current = current
        draft.pageSize = pageSize
      }))
    }
  })


  const columns = [
    {
      title: '账号名',
      dataIndex: 'username',
    },
    {
      title: '用户姓名',
      dataIndex: 'realName',
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys:any)=>{
      setSelectedRowKeys(keys)
    },
  };

  useEffect(()=>{
    props.visible && search().then()
  },[pagination.current, props.visible])

  useEffect(()=>{
    searchAssigned().then()
  },[props.visible])

  async function searchAssigned(){
    const res = await request(`/api/user/list/by/dataType?dataTypeId=${props.record.id}`)
    console.log(res.data)
    res.data && setSelectedRowKeys(res.data.map((item:any)=>item.id))

  }

  async function search(keyword?:string){
    const params = {
      keyword,
      current: pagination.current,
      size: pagination.pageSize
    }
    const res = await request(`/api/user/list`,{params})
    setDataSource(res.data.records)
    setPagination(produce((draft:any) => {
      draft.total = res.data.total
    }))
  }

  async function handleSave(){
    console.log(selectedRowKeys)
    console.log(props.record.id)
    const res = await request('/api/dataType/malloc/user',{
      method: 'post',
      params:{
        dataTypeId: props.record.id
      },
      data: selectedRowKeys
    })
    if(res.code === 200 && res.data){
      message.success("分配成功！")
      props.handleClose()
    }else {
      message.error(res.message)
    }
  }


  return (
    <Modal
      title="分配用户"
      className={styles.assignUserModal}
      visible={props.visible}
      width='38vw'
      onOk={handleSave}
      onCancel={()=>props.handleClose(false)}
      cancelText="取消"
      okText="确定"
    >
      <div>
        <Input.Search onSearch={search} placeholder="请输入用账号、姓名"/>
        <Table
          rowKey="id"
          dataSource={dataSource}
          rowSelection={rowSelection}
          columns={columns}
          pagination={pagination}
        />
      </div>
    </Modal>
  )
}
