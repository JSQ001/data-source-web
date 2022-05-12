import React, {useEffect, useMemo, useState} from 'react';
import {useModel} from "umi";
import {Button, Tree, Input, TreeSelect, message} from "antd"
import { DownOutlined } from '@ant-design/icons';
import styles from './index.less';
import CreateOrUpdate from './components/create-or-update'
import AssignUser from './components/assign-user'
import {request} from "@@/plugin-request/request";

export default ()=>{

  const { initialState:{ userInfo } } = useModel<any>('@@initialState');

  const [current, setCurrent] = useState<any>({})
  const [record, setRecord] = useState<any>({})
  const [visible, setVisible] = useState<any>(false)
  const [assignUser, setAssignUser] = useState<any>(false)
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1'])
  const fieldNames = { title: 'name', key: 'id' }

  useEffect(()=>{
    search().then()
  },[])

  async function search(keyword?: string){
    const params = {
      keyword,
      current: 1,
      size: 999
    }
    const res = await request(`/api/dataType/list/tree/page/${userInfo.id}`,{params})
    setTreeData(res.data.records)
    //默认展开第一条所有节点
    const keys: string[] = [];
    const selected: any[] = [];
    res.data.records[0] && deepSetDefaultExpandKeys([res.data.records[0]], keys, selected)
    setExpandedKeys(keys)
    setCurrent(selected[0])
  }

  function deepSetDefaultExpandKeys(list: Array<any>, target: string[], current: any[]){
    list.forEach((i:any)=>{
      target.push(i.id)
      if(i.children && i.children.length){
        deepSetDefaultExpandKeys(i.children, target,current)
      }else {
        if(!current.length){
          current.push(i)
        }
      }
    })
  }

  const onSelect = (selectedKeys:any, info:any) => {
    setCurrent(info.node)
  };

  function handleAdd(){
    setVisible(true)
    setRecord({})
  }

  async function handleDelete(node:any){
    const res = await request(`/api/dataType/delete/${node.id}`,{method: 'post'})
    if(res.code === 200 && res.data){
      message.success("删除成功！")
    }else {
      message.error(res.message)
    }
  }


  function handleClose(refresh: boolean){
    refresh && search()
    setVisible(false)
  }

  return (
    <div className={styles.pageIndex}>
      <div className={styles.leftArea}>
        <Input.Search onSearch={search} placeholder="请输入数据类型编码、名称"/>
        <Tree
          showLine
          blockNode
          switcherIcon={<DownOutlined />}
          expandedKeys={expandedKeys}
          fieldNames={fieldNames}
          onSelect={onSelect}
          treeData={treeData}
          titleRender={(nodeData: any)=>{
            return (
              <div className={styles.treeItem}>
                <span>{nodeData.name}</span>
                {
                  current.id === nodeData.id &&
                  <span className={styles.operateArea}>
                    <a onClick={()=>{
                      setRecord(nodeData)
                      setVisible(true)
                    }}>编辑</a>
                    <a onClick={()=>handleDelete(nodeData)}>删除</a>
                  </span>
                }
              </div>
            )
          }}
        />

      </div>
      <div className={styles.rightArea}>
        <div className={styles.headerArea}>
          <div className={styles.headerLeft}>
            <Button onClick={handleAdd}>添加数据类型</Button>
            <Button onClick={()=>{setAssignUser(true)}} style={{marginLeft: '.15rem'}}>分配用户</Button>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.username}>{userInfo.realName}</span>
          </div>
        </div>

        <div className={styles.wrapperIframe}>
          <iframe src={current.url}/>
        </div>
      </div>

      <CreateOrUpdate
        visible={visible}
        record={record}
        handleClose={handleClose}
      />
      <AssignUser
        visible={assignUser}
        record={current}
        handleClose={()=>setAssignUser(false)}
      />
    </div>
  )
}
