import request from '@/utils/request';

export function batchAbnormalFlow(params) {
  return request('/register/getAbnormalFlowListInfo', {
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
