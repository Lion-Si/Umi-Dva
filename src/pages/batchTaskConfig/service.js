import request from '@/utils/request';

//批次消息查询接口
export function getBatchMessage(params) {
  return request('/message/getBatchMessage', {
    method: 'POST',
    data: params,
  });
}
//批次消息新增接口
export function addBatchMessage(params) {
  return request('/message/addBatchMessage', {
    method: 'POST',
    data: params,
  });
}
//批次消息修改接口
export function upBatchMessage(params) {
  return request('/message/updateBatchMessage', {
    method: 'POST',
    data: params,
  });
}
//批次消息唯一保存接口
export function checkBatchMessage(params) {
  return request('/message/checkBatchMessage', {
    method: 'POST',
    data: params,
  });
}
//批次消息校验规则接口
export function getMsgStandardConfig(params) {
  return request('/message/getMsgStandardConfig', {
    method: 'POST',
    data: params,
  });
}
//批次消息校验规则接口
export function getCheckRuleCommonCode(params) {
  return request('/pandect/getCheckRuleCommonCode', {
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

//批次流程主节点信息查询接口
export function findFlowNodeMsg(params) {
  return request('/process/findFlowNodeMsg', {
    method: 'POST',
    data: params,
  });
}
//文件下载拆分下节点信息查询接口
export function findBatFlowChildNodeMsg(params) {
  return request('/process/findBatFlowChildNodeMsg', {
    method: 'POST',
    data: params,
  });
}
//联机服务调度步骤节点查询接口
export function findBatFlowChildStepMsg(params) {
  return request('/process/findBatFlowChildStepMsg', {
    method: 'POST',
    data: params,
  });
}

//文件体检信息查询接口
export function getFileCheckRule(params) {
  return request('/process/getFileCheckRule', {
    method: 'POST',
    data: params,
  });
}
//文件体检信息添加接口
export function addFileCheckRule(params) {
  return request('/process/addFileCheckRule', {
    method: 'POST',
    data: params,
  });
}
//文件体检信息删除接口
export function removeFileCheckRule(params) {
  return request('/process/removeFileCheckRule', {
    method: 'POST',
    data: params,
  });
}
//文件体检信息修改接口
export function upFileCheckRule(params) {
  return request('/process/updateFileCheckRule', {
    method: 'POST',
    data: params,
  });
}

//文件拆分信息新增接口
export function addFileSplitRule(params) {
  return request('/process/addFileSplitRule', {
    method: 'POST',
    data: params,
  });
}

//联机服务调度下
//分片文件解析入库配置新增接口
export function addFileTempl(params) {
  return request('/engine/addFileTempl', {
    method: 'POST',
    data: params,
  });
}
//获取文件列信息
export function getSerDataDicList(params) {
  return request('/engine/getServiceDataDictionaryList', {
    method: 'POST',
    data: params,
  });
}
//批转连服务调度配置新增接口
export function addServiceScheduling(params) {
  return request('/engine/addServiceScheduling', {
    method: 'POST',
    data: params,
  });
}

//通过能力中心查询标准服务标志（去重）
export function getStdSvcIndByAac(params) {
  return request('/engine/getStdSvcIndByAac', {
    method: 'POST',
    data: params,
  });
}
//通过能力中心、标准服务标志查询标准接口标识
export function getStdIntfIndBySvc(params) {
  return request('/engine/getStdIntfIndBySvc', {
    method: 'POST',
    data: params,
  });
}

//通过能力中心、标准服务标志查询标准接口标识
export function getVersionByService(params) {
  return request('/serviceOaps/getVersionByService', {
    method: 'POST',
    data: params,
  });
}
//通过能力中心、标准服务标志查询标准接口标识
export function getNgParamOapsDetails(params) {
  return request('/serviceOaps/getNgParamOapsDetails', {
    method: 'POST',
    data: params,
  });
}
//结果推送配置保存接口
export function saveResultPush(params) {
  return request('/result/saveResultPush', {
    method: 'POST',
    data: params,
  });
}

//模板配置信息表查询
export function getTempConf(params) {
  return request('/template/getTempConf', {
    method: 'POST',
    data: params,
  });
}
//配置信息模板表保存接口
export function saveTempConf(params) {
  return request('/template/saveTempConf', {
    method: 'POST',
    data: params,
  });
}

//saveBatchConfigMessage
//配置信息表保存接口
export function saveBatchConfigMessage(params) {
  return request('/result/saveBatchConfigMessage', {
    method: 'POST',
    data: params,
  });
}
//批次任务列表查询接口
export function findBatchConfigMessage(params) {
  return request('/result/findBatchConfigMessage', {
    method: 'POST',
    data: params,
  });
}
//批次任务列表修改接口
export function updateBatchConfigMessage(params) {
  return request('/result/updateBatchConfigMessage', {
    method: 'POST',
    data: params,
  });
}

//重跑接口（待补充）

//查根据返回信息文件列信息
export function getFileList(params) {
  return request('/engine/getDataDictionaryList', {
    method: 'POST',
    data: params,
  });
}

//清分规则添加接口
export function saveBtrClearRuleList(params) {
  return request('/process/saveBtrClearRuleList', {
    method: 'POST',
    data: params,
  });
}

//清分规则添加接口
export function updateBtrClearRule(params) {
  return request('/process/updateBtrClearRule', {
    method: 'POST',
    data: params,
  });
}

//清分规则添加接口
export function removeBtrClearRule(params) {
  return request('/process/removeBtrClearRule', {
    method: 'POST',
    data: params,
  });
}

//清分规则添加接口
export function findBtrClearRuleList(params) {
  return request('/process/findBtrClearRuleList', {
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
