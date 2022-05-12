import {request} from 'umi'

export async function getToken (code: String) {
  const res:any = await request(`/api/oauth/getToken?code=${code}`)
  if(res.code === 200 && res.data){
    return res.data
  }
}

export async function getUserInfo(){
  const res:any = await request(`/api/user/resource`)
  if(res.code === 200 && res.data){
    return res.data
  }
}
