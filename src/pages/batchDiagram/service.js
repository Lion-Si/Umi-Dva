import request from '@/utils/request';

export function batchDiagram(params) {
  return request('/run/getRunTask', {
    method: 'POST',
    data: params,
  });
}
export function runGetRun(params) {
  return request('/run/getRun', {
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
//大节点：文件下载拆分
export function getStepRunInfo(params) {
  return request('/run/getStepRunInfo', {
    method: 'POST',
    data: params,
  });
}
//大节点：联机服务调度
export function getRunStepMsg(params) {
  return request('/run/getRunStepMsg', {
    method: 'POST',
    data: params,
  });
}
//大节点：结果文件排序

//大节点：消息推送
export function getResultPushHistory(params) {
  return request('/run/getResultPushHistory', {
    method: 'POST',
    data: params,
  });
}
//小节点：文件拆分列表查询
export function getSplitResultList(params) {
  return request('/run/getSplitResultList', {
    method: 'POST',
    data: params,
  });
}

//小节点：服务调度列表查询
export function getBtrDetail(params) {
  return request('/run/getBtrDetail', {
    method: 'POST',
    data: params,
  });
}

//联机服务重跑
export function repeatRunNodeStep(params) {
  return request('run/repeatRunNodeStep', {
    method: 'POST',
    data: params,
  });
}

//服务重跑
export function repeatRunFlow(params) {
  return request('/run/repeatRunFlow', {
    method: 'POST',
    data: params,
  });
}
