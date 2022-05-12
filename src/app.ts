import {isLogin} from '@/utils'

import { RequestConfig } from 'umi';
import {getUserInfo} from "@/api";

const {global_config} = window as any

export async function getInitialState() {
 const userInfo = await getUserInfo()
  return {
    userInfo
  }
}

export async function render(oldRender:any) {
  if(await isLogin()){
    oldRender()
  }
}


function loginInterceptor(url: string, options: any) {
  if(url.startsWith("/api")){
    url = global_config.BASE_URL + url
    const token = localStorage.getItem("token")
    if(token){
      options.headers['Authorization'] = 'Bearer '+ token
    }
  }
  return {
    url,
    options: {
      ...options,
      interceptors: true
    },
  };
}

export const request: RequestConfig = {
  //timeout: 1000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [loginInterceptor],
  responseInterceptors: [],

};
