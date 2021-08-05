import request from '@/utils/request';

export function batchTaskList(params) {
  return request('/register/getBatchTaskInfo', {
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
//批次任务列表查询接口
export function deleteBatchConfigMessage(params) {
  return request('/result/deleteBatchConfigMessage', {
    method: 'POST',
    data: params,
  });
}
//通过具体的批量类型，渠道号，业务代码去查询对应的批量类型中的
export function getBatTypeFlag(params) {
  return request('/message/getBatTypeFlag', {
    method: 'POST',
    data: params,
  });
}
