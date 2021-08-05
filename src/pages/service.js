import request from '@/utils/request';

//最近批次任务查询接口
export function getBatTask(params) {
  return request('/pandect/batTask', {
    method: 'POST',
    data: params,
  });
}
//批次异常提醒查询接口
export function getExAlert(params) {
  return request('/pandect/exAlert', {
    method: 'POST',
    data: params,
  });
}
//批次统计查询接口
export function getStatisticalQuery(params) {
  return request('/pandect/statisticalQuery', {
    method: 'POST',
    data: params,
  });
}
//批次状态统计查询接口
export function getStatusStatistic(params) {
  return request('/pandect/statusStatistic', {
    method: 'POST',
    data: params,
  });
}
//公共数据获取数据接口
export function getCommonCode(params) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}
