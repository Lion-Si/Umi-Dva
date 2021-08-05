export let DATA = {
  nodeIcon_EA: {
    'C-TSK': 'allControlTask_EA',
    'C-FDS': 'FileDownSplit_EA',
    'S-OS': 'OnlineServices_EA',
    'C-FSM': 'ResultSort_EA',
    'F-RS': 'ResultInfoPush_EA',
  },
  nodeIcon_FA: {
    'C-TSK': 'allControlTask_FA',
    'C-FDS': 'FileDownSplit_FA',
    'S-OS': 'OnlineServices_FA',
    'C-FSM': 'ResultSort_FA',
    'F-RS': 'ResultInfoPush_FA',
  },
  nodeIcon_NS: {
    'C-TSK': 'allControlTask_NS',
    'C-FDS': 'FileDownSplit_NS',
    'S-OS': 'OnlineServices_NS',
    'C-FSM': 'ResultSort_NS',
    'F-RS': 'ResultInfoPush_NS',
  },
  nodeIcon_RETRY: {
    'C-TSK': 'allControlTask_Retry',
    'C-FDS': 'FileDownSplit_Retry',
    'S-OS': 'OnlineServices_Retry',
    'C-FSM': 'ResultSort_Retry',
    'F-RS': 'ResultInfoPush_Retry',
  },
  nodeIcon_RU: {
    'C-TSK': 'allControlTask_RU',
    'C-FDS': 'FileDownSplit_RU',
    'S-OS': 'OnlineServices_RU',
    'C-FSM': 'ResultSort_RU',
    'F-RS': 'ResultInfoPush_RU',
  },
  nodeIcon_SU: {
    'C-TSK': 'allControlTask_SU',
    'C-FDS': 'FileDownSplit_SU',
    'S-OS': 'OnlineServices_SU',
    'C-FSM': 'ResultSort_SU',
    'F-RS': 'ResultInfoPush_SU',
  },
  // 文件下载拆分子节点图标
  fileDownIcon_EA: {
    btrFileDownloadService: 'fileDown_EA',
    fileValidationService: 'fileCheck_EA',
    btrClearService: 'prdCode_EA',
    btrInterceptPrdCodeService: 'prdCode_EA',
    btrFileSplitService: 'fileSplit_EA',
    btrOsNoticeService: 'noticeService_EA',
  },
  fileDownIcon_FA: {
    btrFileDownloadService: 'fileDown_FA',
    fileValidationService: 'fileCheck_FA',
    btrClearService: 'prdCode_FA',
    btrInterceptPrdCodeService: 'prdCode_FA',
    btrFileSplitService: 'fileSplit_FA',
    btrOsNoticeService: 'noticeService_FA',
  },
  fileDownIcon_NS: {
    btrFileDownloadService: 'fileDown_NS',
    fileValidationService: 'fileCheck_NS',
    btrClearService: 'prdCode_NS',
    btrInterceptPrdCodeService: 'prdCode_NS',
    btrFileSplitService: 'fileSplit_NS',
    btrOsNoticeService: 'noticeService_NS',
  },
  fileDownIcon_Retry: {
    btrFileDownloadService: 'fileDown_Retry',
    fileValidationService: 'fileCheck_Retry',
    btrClearService: 'prdCode_Retry',
    btrInterceptPrdCodeService: 'prdCode_Retry',
    btrFileSplitService: 'fileSplit_Retry',
    btrOsNoticeService: 'noticeService_Retry',
  },
  fileDownIcon_RU: {
    btrFileDownloadService: 'fileDown_RU',
    fileValidationService: 'fileCheck_RU',
    btrClearService: 'prdCode_RU',
    btrInterceptPrdCodeService: 'prdCode_RU',
    btrFileSplitService: 'fileSplit_RU',
    btrOsNoticeService: 'noticeService_RU',
  },
  fileDownIcon_SU: {
    btrFileDownloadService: 'fileDown_SU',
    fileValidationService: 'fileCheck_SU',
    btrClearService: 'prdCode_SU',
    btrInterceptPrdCodeService: 'prdCode_SU',
    btrFileSplitService: 'fileSplit_SU',
    btrOsNoticeService: 'noticeService_SU',
  },

  //服务调度子节点图标
  serviceDispIcon_EA: {
    btrFileDownloadService: 'splitFileDown_EA', //分片文件下载
    btrFileParserService: 'splitFileInStorage_EA', //分片文件解析入库
    btrDispatchService: 'serverDispatch_EA', //批转联调度服务
    resultFileGenerateService: 'splitResCreate_EA', //分片结果文件生成
    resultFileUploadService: 'splitResUpload_EA', //分片结果文件上传
    resultFileSendService: 'messageReceipt_EA', //消息回执
    btrNotifyInvokeService: 'messageReceipt_EA',
  },
  // 服务调度子节点图标(失败状态)
  serviceDispIcon_FA: {
    btrFileDownloadService: 'splitFileDown_FA', //分片文件下载
    btrFileParserService: 'splitFileInStorage_FA', //分片文件解析入库
    btrDispatchService: 'serverDispatch_FA', //批转联调度服务
    resultFileGenerateService: 'splitResCreate_FA', //分片结果文件生成
    resultFileUploadService: 'splitResUpload_FA', //分片结果文件上传
    resultFileSendService: 'messageReceipt_FA', //消息回执
    btrNotifyInvokeService: 'messageReceipt_FA',
  },
  serviceDispIcon_NS: {
    btrFileDownloadService: 'splitFileDown_NS', //分片文件下载
    btrFileParserService: 'splitFileInStorage_NS', //分片文件解析入库
    btrDispatchService: 'serverDispatch_NS', //批转联调度服务
    resultFileGenerateService: 'splitResCreate_NS', //分片结果文件生成
    resultFileUploadService: 'splitResUpload_NS', //分片结果文件上传
    resultFileSendService: 'messageReceipt_NS', //消息回执
    btrNotifyInvokeService: 'messageReceipt_NS',
  },
  serviceDispIcon_Retry: {
    btrFileDownloadService: 'splitFileDown_Retry', //分片文件下载
    btrFileParserService: 'splitFileInStorage_Retry', //分片文件解析入库
    btrDispatchService: 'serverDispatch_Retry', //批转联调度服务
    resultFileGenerateService: 'splitResCreate_Retry', //分片结果文件生成
    resultFileUploadService: 'splitResUpload_Retry', //分片结果文件上传
    resultFileSendService: 'messageReceipt_Retry', //消息回执
    btrNotifyInvokeService: 'messageReceipt_Retry',
  },
  serviceDispIcon_RU: {
    btrFileDownloadService: 'splitFileDown_RU', //分片文件下载
    btrFileParserService: 'splitFileInStorage_RU', //分片文件解析入库
    btrDispatchService: 'serverDispatch_RU', //批转联调度服务
    resultFileGenerateService: 'splitResCreate_RU', //分片结果文件生成
    resultFileUploadService: 'splitResUpload_RU', //分片结果文件上传
    resultFileSendService: 'messageReceipt_RU', //消息回执
    btrNotifyInvokeService: 'messageReceipt_RU',
  },
  serviceDispIcon_SU: {
    btrFileDownloadService: 'splitFileDown_SU', //分片文件下载
    btrFileParserService: 'splitFileInStorage_SU', //分片文件解析入库
    btrDispatchService: 'serverDispatch_SU', //批转联调度服务
    resultFileGenerateService: 'splitResCreate_SU', //分片结果文件生成
    resultFileUploadService: 'splitResUpload_SU', //分片结果文件上传
    resultFileSendService: 'messageReceipt_SU', //消息回执
    btrNotifyInvokeService: 'messageReceipt_SU',
  },
};
