import request from '@/utils/request';

//批次消息唯一保存接口
export function checkBatchMessage(params) {
  return request('/message/checkBatchMessage', {
    method: 'POST',
    data: params,
  });
}

//克隆接口
export function cloneBatchInfo(params) {
  return request('/result/cloneBatchInfo', {
    method: 'POST',
    data: params,
  });
}
//下拉列表数据
export function getCommonCode(params) {
  return request('/pandect/getCommonCode', {
    method: 'POST',
    data: params,
  });
}

//OSS上传下载
export function getOssInfo(params) {
  return request('/pandect/getOssUploadAccess', {
    method: 'POST',
    data: params,
  });
}

//OSS明细文件上传
export function ossImport(params) {
  return request('/message/getFileSummaryInfo', {
    method: 'POST',
    data: params,
  });
}

//OSS服务文件上传
export function ossImportDetail(params) {
  return request('/message/getServiceDetail', {
    method: 'POST',
    data: params,
  });
}

//OSS字段映射上传
export function ossImportFields(params) {
  return request('/message/fieldMappingFileParsing', {
    method: 'POST',
    data: params,
  });
}

//OSS字段映射上传
export function getOssDownloadAccess(params) {
  return request('/pandect/getOssDownloadAccess', {
    method: 'POST',
    data: params,
  });
}

//OSS字段映射上传
export function saveUploadHistory(params) {
  return request('/uploadHistory/saveUploadHistory', {
    method: 'POST',
    data: params,
  });
}
