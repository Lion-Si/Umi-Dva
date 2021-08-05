import request from '@/utils/request';

export function batchMainTask(params) {
  return request('/register/getControlTaskInfo', {
    method: 'POST',
    data: params,
  });
}
export function getBatchType(params) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}
export function getChnNo(params) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}
export function getBusCode(params) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}
//下拉列表公共数据
export function getCommonCode(params) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}
