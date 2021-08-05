import request from '@/utils/request';

// 批次消息查询接口
export function getAllUploadHistory(params: any) {
  return request('/uploadHistory/getAllUploadHistory', {
    method: 'POST',
    data: params,
  });
}

// 下拉列表数据
export function getCommonCode(params: any) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}

// 模板消息查询接口
export function getAllTempMessage(params: any) {
  return request('/template/getAllTempMessage', {
    method: 'POST',
    data: params,
  });
}
