import {getToken} from '@/api';
const {global_config} = window as any

export async function isLogin(){
  const token = localStorage.getItem("token");
  if(token) return true
  if(/^(\?code=)[a-zA-Z0-9]{6}$/.test(location.search)){
    const list = location.search.split('=')
    if(list.length < 1) return false
    const token = await getToken(list[1])
    localStorage.setItem("token", token)
    if(token) return true
  }else {
    window.open(global_config.BASE_URL+`/oauth/login`, "_parent");
  }
  return false
}
