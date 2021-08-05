import React from 'react';
import { Card, Row, Table, Tooltip, Button } from 'antd';
import {
  runGetRun,
  getStepRunInfo,
  findBatFlowChildStepRel,
  getSplitResultList,
  getRunStepMsg,
  getResultPushHistory,
  getBtrDetail,
  repeatRunNodeStep,
  repeatRunFlow,
} from './service.js';
import { cloneDeep } from 'lodash';
import { DATA } from './data.js';
import GGEditor, {
  Flow,
  ItemPanel,
  Item,
  RegisterNode,
  setAnchorPointsState,
} from 'gg-editor';
import CommandList from './ggEditor/CommandList';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import { RollbackOutlined } from '@ant-design/icons';
class RunDiagram extends React.Component {
  state = {
    btrFlowRelsNode: [
      {
        id: 'FA',
        label: '运行失败',
        logoIcon: {
          img: require('@/assets/batchDiagram/failLogo.svg'),
          x: -75,
        },
      },
      {
        id: 'SU',
        label: '运行成功',
        logoIcon: {
          img: require('@/assets/batchDiagram/succLogo.svg'),
          x: -75,
        },
      },
      {
        id: 'RU',
        label: '运行中 ',
        logoIcon: {
          img: require('@/assets/batchDiagram/doingLogo.svg'),
        },
      },
      {
        id: 'NS',
        label: '未开始 ',
        logoIcon: {
          img: require('@/assets/batchDiagram/notStartLogo.svg'),
        },
      },
      {
        id: 'EA',
        label: '可运行 ',
        logoIcon: {
          img: require('@/assets/batchDiagram/enableExeLogo.svg'),
        },
      },
      {
        id: 'RETRY',
        label: '重试  ',
        logoIcon: {
          img: require('@/assets/batchDiagram/retryLogo.svg'),
        },
      },
    ],
    bigNodeData: {
      nodes: [],
      edges: [],
    },
    NodeData: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
    //拆分结果列表
    splitResultList: [],
    showSplitTable: false,
    columns: [
      {
        title: '批次号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      {
        title: '批量类型',
        key: 'batType',
        align: 'left',
        render: (text, record) => {
          return <span>{this.props.currentRecord.batType}</span>;
        },
      },
      {
        title: '渠道号',
        key: 'chnNo',
        align: 'left',
        render: (text, record) => {
          return <span>{this.props.currentRecord.chnNo}</span>;
        },
      },
      {
        title: '业务代码',
        key: 'busCode',
        align: 'left',
        render: (text, record) => {
          return <span>{this.props.currentRecord.busCode}</span>;
        },
      },
      {
        title: '子批次号',
        dataIndex: 'subBatNo',
        key: 'subBatNo',
        align: 'left',
      },
      {
        title: '拆分文件序号',
        dataIndex: 'splitSerialNum',
        key: 'splitSerialNum',
        align: 'left',
      },
      {
        title: '拆分文件名称',
        dataIndex: 'splitResultFileName',
        key: 'splitResultFileName',
        align: 'left',
      },
    ],
    //消息推送列表
    msgPushTable: [],
    showMsgPushTable: false,
    msgPushColumns: [
      {
        title: '主批次号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      {
        title: '推送消息内容',
        dataIndex: 'pushRequest',
        key: 'pushRequest',
        align: 'left',
      },
      {
        title: '推送时间',
        dataIndex: 'pushTime',
        key: 'pushTime',
        align: 'left',
      },
      {
        title: '推送方式',
        dataIndex: 'pushWay',
        key: 'pushWay',
        align: 'left',
      },
      {
        title: '推送状态',
        dataIndex: 'pushResult',
        key: 'pushResult',
        align: 'left',
      },
      {
        title: '失败原因',
        dataIndex: 'exception',
        key: 'exception',
        align: 'left',
      },
    ],
    //拆分结果文件生成列表
    splitResFileGenList: [],
    splitResFileGen: false,
    splitResFileGenColumns: [
      {
        title: '批次号',
        dataIndex: 'subBatNo',
        key: 'subBatNo',
        align: 'left',
      },
      {
        title: '批量类型',
        dataIndex: 'batType',
        key: 'batType',
        align: 'left',
      },
      {
        title: '渠道号',
        dataIndex: 'chnNo',
        key: 'chnNo',
        align: 'left',
      },
      {
        title: '业务代码',
        dataIndex: 'txnCode',
        key: 'txnCode',
        align: 'left',
      },
      {
        title: '主批次号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      /*    {
        title: '文件数据',
        dataIndex: 'fileData',
        key: 'fileData',
        align: 'left',
        ellipsis: true,
      },
      {
        title: '结果数据',
        dataIndex: 'resultData',
        key: 'resultData',
        align: 'left',
        ellipsis: true,
      }, */
      {
        title: '交易日期',
        dataIndex: 'consmPltfmDt',
        key: 'consmPltfmDt',
        align: 'left',
      },
      {
        title: '交易金额',
        dataIndex: 'txAmt',
        key: 'txAmt',
        align: 'left',
      },
      {
        title: '状态',
        dataIndex: 'sts',
        key: 'sts',
        align: 'left',
      },
      {
        title: '错误码',
        dataIndex: 'retCode',
        key: 'retCode',
        align: 'left',
      },
      {
        title: '错误原因',
        dataIndex: 'retMsg',
        key: 'retMsg',
        align: 'left',
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'left',
        render: (text, record) => {
          return (
            <div style={{ display: 'flex' }}>
              <Button
                type="primary"
                size="small"
                style={{ marginRight: 8 }}
                onClick={() => this.reRun(record)}
              >
                重跑
              </Button>
              <Button size="small" onClick={() => this.stop(record)}>
                中断
              </Button>
            </div>
          );
        },
      },
    ],
    //总概信息预览表
    viewList: [],
    showViewList: false,
    viewColumns: [
      {
        title: '主批次号',
        dataIndex: 'batNo',
        key: 'batNo',
        align: 'left',
      },
      {
        title: '批量类型',
        dataIndex: 'batType',
        key: 'batType',
        align: 'left',
        // render: (text, record) => {
        //   let tmp = this.props.batTypeArr.find(
        //     (item, index) => item.key == record.batType,
        //   );
        //   if (tmp) {
        //     return <span>{tmp.value}</span>;
        //   }
        // },
      },
      {
        title: '渠道号',
        dataIndex: 'chnNo',
        key: 'chnNo',
        align: 'left',
      },
      {
        title: '业务代码',
        dataIndex: 'busCode',
        key: 'busCode',
        align: 'left',
      },
      {
        title: '任务节点ID',
        dataIndex: 'currentNodeId',
        key: 'currentNodeId',
        align: 'left',
      },
      {
        title: '任务节点名称',
        dataIndex: 'currentNodeName',
        key: 'currentNodeName',
        align: 'left',
      },
      /*   {
        title: '任务节点输入参数',
        dataIndex: 'inputParam',
        key: 'inputParam',
        align: 'left',
        ellipsis: true,
      }, */
      {
        title: '运行时长',
        dataIndex: 'time',
        key: 'time',
        align: 'left',
        render: (text, record) => {
          if (!record.endTime) return <span></span>;
          else
            return (
              <span>
                {new Date(record.endTime).getTime() -
                  new Date(record.startTime).getTime() +
                  'ms'}
              </span>
            );
        },
      },
      {
        title: '节点状态',
        dataIndex: 'nodeSts',
        key: 'nodeSts',
        align: 'left',
        render: (text, record) => {
          if (record.nodeSts == 'NS') return <span>未开始</span>;
          else if (record.nodeSts == 'EA') return <span>可运行</span>;
          else if (record.nodeSts == 'RU') return <span>运行中</span>;
          else if (record.nodeSts == 'SU') return <span>运行成功</span>;
          else if (record.nodeSts == 'FA') return <span>运行失败</span>;
          else if (record.nodeSts == 'RETRY') return <span>重试</span>;
        },
      },
    ],
  };
  componentDidMount() {
    this.getRunDiagramData();
  }

  //获取运行图大节点数据
  getRunDiagramData = () => {
    const { busCode, chnNo, batType, batNo } = this.props.currentRecord;
    runGetRun({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getRun',
      data: {
        busCode,
        chnNo,
        batType,
        batNo,
        pageNum: 1,
        pageSize: this.props.pageSize,
      },
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        if (res.body.list.length === 0) {
          console.log(this.props.currentRecord);

          res.body.list = [
            {
              currentNodeId: 'C-TSK',
              currentNodeName: '总控任务节点',
              nodeSts: this.props.currentRecord.status,
            },
            {
              currentNodeId: 'C-FDS',
              currentNodeName: '文件下载拆分',
              nodeSts: this.props.currentRecord.status,
            },
            {
              currentNodeId: 'S-OS',
              currentNodeName: '批转联服务调度',
              nodeSts: this.props.currentRecord.status,
            },
            {
              currentNodeId: 'C-FSM',
              currentNodeName: '结果文件排序',
              nodeSts: this.props.currentRecord.status,
            },
            {
              currentNodeId: 'F-RS',
              currentNodeName: '结果消息推送',
              nodeSts: this.props.currentRecord.status,
            },
          ];
        } else {
          this.setState({
            showViewList: true,
            viewList: res.body.list,
          });
        }
        //节点信息
        const nodes = res.body.list.map((item, index) => {
          if (!item.nodeSts) {
            item.nodeSts = 'NS';
          }
          let logoName, logoIcon, picName; //logoName：大节点的右上标的小图标的名字,logoIcon：大节点图标路径 picName:大节点的名字
          if (item.nodeSts == 'FA') {
            logoName = 'failLogo';
            picName = DATA.nodeIcon_FA[item.currentNodeId];
          } else if (item.nodeSts == 'SU') {
            logoName = 'succLogo';
            picName = DATA.nodeIcon_SU[item.currentNodeId];
          } else if (item.nodeSts == 'NS') {
            logoName = 'notStartLogo';
            picName = DATA.nodeIcon_NS[item.currentNodeId];
          } else if (item.nodeSts == 'EA') {
            logoName = 'enableExeLogo';
            picName = DATA.nodeIcon_EA[item.currentNodeId];
          } else if (item.nodeSts == 'RETRY') {
            logoName = 'retryLogo';
            picName = DATA.nodeIcon_RETRY[item.currentNodeId];
          } else if (item.nodeSts == 'RU') {
            logoName = 'doingLogo';
            picName = DATA.nodeIcon_RU[item.currentNodeId];
          }
          logoIcon = require(`@/assets/batchDiagram/node/${picName}.svg`);
          return {
            id: `${index}`,
            label: ' ',
            description: item.currentNodeName,
            currentNodeId: item.currentNodeId,
            y: 150,
            x: 150 * (index + 1) + 150,
            size: [90, 70],
            style: {
              lineWidth: 0,
              fill: '#F7F7F7',
              //  stroke: '#3f67ed',
              radius: 32.5,
              // opacity: 0.7,
            },
            stateIcon: {
              img: require(`@/assets/batchDiagram/${logoName}.svg`),
              show: true,
              height: 20,
              width: 20,
              x: 32,
              y: -25,
            },
            logoIcon: {
              height: 64,
              width: 64,
              show: true,
              img: logoIcon,
              x: -30,
              y: -30,
            },
            descriptionCfg: {
              /*  offset:-5, */
              paddingTop: 40,
              style: {
                fontSize: 14,
                fill: '#000',
              },
            },
            labelCfg: {
              offset: -60,
              style: {
                fontSize: 12,
                fill: 'red',
              },
              /*    position:'right', */
              /*   offset:15, */
            },
            nodeStateStyles: {
              hover: {
                fillOpacity: 0.1,
                lineWidth: 10,
              },
            },
            linkPoints: {
              size: 1,
              left: true,
              right: true,
              top: false,
              bottom: false,
              fill: '#fff',
            },
          };
        });
        //线信息
        const edges = res.body.list.slice(0, -1).map((item, index) => {
          return {
            sourceAnchor: 3,
            targetAnchor: 4,
            source: `${index}`,
            target: `${index + 1}`,
          };
        });
        const NodeData = {
          nodes,
          edges,
        };
        this.setState({
          bigNodeData: NodeData,
          NodeData,
        });
      }
    });
  };

  //请求重跑接口
  reqReRun = (e: any) => {
    if (
      e.item?._cfg?.model?.stateIcon?.img
        .split('/')[4]
        .toString()
        .split('.')[0] === 'retryLogo'
    ) {
      const { busCode, chnNo, batType, batNo } = this.props.currentRecord;
      repeatRunFlow({
        stdSvcInd: 'BatchRuningSVC',
        stdIntfcInd: 'repeatRunFlow',
        data: {
          batNo,
          currentNodeId: e.item._cfg.model.currentNodeId,
        },
      }).then((res: any) => {
        if (res && res.body) {
        }
      });
    }
  };

  //双击重跑事件
  showNodeDoubleClick = (e: any) => {
    switch (e.item._cfg.model.currentNodeId) {
      case 'C-TSK':
        this.reqReRun(e);
        break;
      case 'C-FDS':
        this.reqReRun(e);
        break;
      case 'S-OS':
        this.reqReRun(e);
        break;
      case 'C-FSM':
        this.reqReRun(e);
        break;
      case 'F-RS':
        this.reqReRun(e);
        break;
    }
  };

  //点击节点事件
  showNodeClick = (e: any) => {
    console.log(e.item);
    //大节点
    switch (e.item._cfg.model.currentNodeId) {
      case 'C-TSK':
        break;
      case 'C-FDS':
        this.getFileDownsplitMsg(e.item._cfg.model.currentNodeId);
        break;
      case 'S-OS':
        this.getOnlineServiceMsg();
        break;
      case 'C-FSM':
        break;
      case 'F-RS':
        this.getResultPush();
        break;
      //文件下载拆分子节点
      case 'btrFileDownloadService':
        break;
      case 'fileValidationService':
        break;
      case 'btrInterceptPrdCodeService':
        break;
      case 'btrFileSplitService':
        this.getSplitList();
        break;
      case 'btrOsNoticeService':
        break;
      //服务调度子节点
      case 'btrFileDownloadService': //分片文件下载
        break;
      case 'btrFileParserService':
        this.splitFileResCreate(); //分片文件解析入库
        break;
      case 'btrDispatchService':
        this.splitFileResCreate(); //批转联服务调度
        break;
      case 'resultFileGenerateService':
        this.splitFileResCreate(); //分片结果文件生成
        break;
      case 'resultFileUploadService': //分片结果文件上传
        break;
      case 'resultFileSendService': //消息回执
        break;
    }
  };
  showNodeMouseOut = (e: any) => {
    console.log('在上方');
  };
  //文件下载拆分
  getFileDownsplitMsg = currentNodeId => {
    const { busCode, chnNo, batType, batNo } = this.props.currentRecord;
    getStepRunInfo({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getStepRunInfo',
      data: {
        currentNodeId,
        chnNo,
        batType,
        busCode,
        batNo,
      },
    }).then(res => {
      if (res && res.body) {
        let logoName, logoIcon, picName; //logoName：大节点的右上标的小图标的名字,logoIcon：大节点图标路径 picName:大节点的名字
        let nodes = res.body.map((item, index) => {
          if (item.stepSts == '00') {
            logoName = 'notStartLogo';
            picName = DATA.fileDownIcon_NS[item.currentStepId];
          } else if (item.stepSts == '01') {
            logoName = 'enableExeLogo';
            picName = DATA.fileDownIcon_EA[item.currentStepId];
          } else if (item.stepSts == '02') {
            logoName = 'doingLogo';
            picName = DATA.fileDownIcon_RU[item.currentStepId];
          } else if (item.stepSts == '03') {
            logoName = 'succLogo';
            picName = DATA.fileDownIcon_SU[item.currentStepId];
          } else if (item.stepSts == '04') {
            logoName = 'failLogo';
            picName = DATA.fileDownIcon_FA[item.currentStepId];
          } else if (item.stepSts == '05') {
            logoName = 'retryLogo';
            picName = DATA.fileDownIcon_Retry[item.currentStepId];
          }
          console.log(item.currentStepId, picName, item.stepBeanName);
          logoIcon = require(`@/assets/batchDiagram/FileDown/${picName}.svg`);
          return {
            id: index + this.state.bigNodeData.nodes.length,
            label: ' ',
            description: item.currentStepName,
            currentNodeId: item.currentStepId,
            y: 300,
            x: 130 * (index + 1) + 195,
            size: [50, 48],
            style: {
              lineWidth: 0,
              fill: '#F7F7F7',
            },
            stateIcon: {
              img: require(`@/assets/batchDiagram/${logoName}.svg`),
              show: true,
              height: 15,
              width: 15,
              x: 10,
              y: -20,
            },
            logoIcon: {
              height: 28,
              width: 28,
              show: true,
              img: logoIcon,
              x: -20,
              y: -20,
            },
            labelCfg: {
              offset: -35,
              style: {
                fontSize: 12,
                fill: '#000',
              },
            },
            descriptionCfg: {
              paddingTop: 10,
              style: {
                fontSize: 12,
                fill: '#000',
              },
            },
          };
        });
        this.drawPic(res.body, nodes);
      }
    });
  };
  //联机服务调度
  getOnlineServiceMsg = () => {
    // console.log(this.props.currentRecord);
    const { busCode, chnNo, batType, batNo } = this.props.currentRecord;
    getRunStepMsg({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getRunStepMsg',
      data: {
        chnNo,
        batType,
        busCode,
        batNo,
      },
    }).then(res => {
      if (res && res.body) {
        let nodes = res.body.map((item, index) => {
          let logoName, logoIcon, picName; //logoName：大节点的右上标的小图标的名字,logoIcon：大节点图标路径 picName:大节点的名字
          if (item.status == 'NS') {
            logoName = 'notStartLogo';
            picName = DATA.serviceDispIcon_NS[item.stepName];
          } else if (item.status == 'EA') {
            logoName = 'enableExeLogo';
            picName = DATA.serviceDispIcon_EA[item.stepName];
          } else if (item.status == 'RU') {
            logoName = 'doingLogo';
            picName = DATA.serviceDispIcon_RU[item.stepName];
          } else if (item.status == 'SU') {
            logoName = 'succLogo';
            picName = DATA.serviceDispIcon_SU[item.stepName];
          } else if (item.status == 'FA') {
            logoName = 'failLogo';
            picName = DATA.serviceDispIcon_FA[item.stepName];
          } else if (item.status == 'RETRY') {
            logoName = 'retryLogo';
            picName = DATA.serviceDispIcon_Retry[item.stepName];
          }
          console.log(picName, item.stepName);
          if (require(`@/assets/batchDiagram/OnlineServers/${picName}.svg`)) {
            logoIcon = require(`@/assets/batchDiagram/OnlineServers/${picName}.svg`);
          }
          return {
            id: index + this.state.bigNodeData.nodes.length,
            description: item.stepDesc,
            label: ' ',
            currentNodeId: item.stepName,
            y: 300,
            x: 140 * (index + 1) + 195,
            size: [50, 48],
            style: {
              lineWidth: 0,
              fill: '#F7F7F7',
            },
            stateIcon: {
              img: require(`@/assets/batchDiagram/${logoName}.svg`),
              show: true,
              height: 15,
              width: 15,
              x: 10,
              y: -20,
            },
            logoIcon: {
              height: 28,
              width: 28,
              show: true,
              img: logoIcon,
              x: -20,
              y: -20,
            },
            labelCfg: {
              offset: -48,
              style: {
                fontSize: 12,
                fill: '#000',
              },
            },
            descriptionCfg: {
              paddingTop: 10,
              style: {
                fontSize: 12,
                fill: '#000',
              },
            },
          };
        });
        this.drawPic(res.body, nodes);
      }
    });
  };
  //绘图
  drawPic = (nodesArr, nodes) => {
    console.log(111);
    const edges = nodesArr.slice(0, -1).map((item, index) => {
      return {
        sourceAnchor: 3,
        targetAnchor: 4,
        source: `${index + this.state.bigNodeData.nodes.length}`,
        target: `${index + this.state.bigNodeData.nodes.length + 1}`,
      };
    });
    const NodeData = {
      nodes: [...this.state.bigNodeData.nodes, ...nodes],
      edges: [...this.state.bigNodeData.edges, ...edges],
    };
    this.setState({ NodeData }, () => console.log(this.state.NodeData));
  };
  //未修改完成
  //进入停止图标换重跑标志
  showNodeEnter = e => {
    if (e) {
      console.log(
        '当前进入的节点为：',
        e.item._cfg.id,
        e.item._cfg.model.stateIcon.img
          .split('/')[4]
          .toString()
          .split('.')[0],
      );
      if (
        e.item?._cfg?.model?.stateIcon?.img
          .split('/')[4]
          .toString()
          .split('.')[0] === 'failLogo'
      ) {
        const NodeData = cloneDeep(this.state.NodeData);
        console.log('节点集', NodeData.nodes);
        NodeData.nodes.map(item => {
          if (item.id === e.item._cfg.id) {
            item.stateIcon.img = require(`@/assets/batchDiagram/retryLogo.svg`);
          }
        });
        this.setState({
          NodeData,
        });
      }
    }
  };
  //未修改完成
  //鼠标移出重新变为失败标志
  showNodeLeave = e => {
    if (e) {
      console.log(
        '当前移出的节点为：',
        e.item._cfg.id,
        e.item._cfg.model.stateIcon.img
          .split('/')[4]
          .toString()
          .split('.')[0],
      );
      if (
        e.item?._cfg?.model?.stateIcon?.img
          .split('/')[4]
          .toString()
          .split('.')[0] === 'retryLogo'
      ) {
        const NodeData = cloneDeep(this.state.NodeData);
        console.log('节点集', NodeData.nodes);
        NodeData.nodes.map(item => {
          if (item.id === e.item._cfg.id) {
            item.stateIcon.img = require(`@/assets/batchDiagram/failLogo.svg`);
          }
        });
        this.setState({
          NodeData,
        });
      }
    }
  };

  //结果消息推送列表
  getResultPush = () => {
    const { batNo } = this.props.currentRecord;
    getResultPushHistory({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getResultPushHistory',
      data: { batNo },
    }).then(res => {
      if (res && res.body) {
        this.setState({
          showViewList: false,
          showSplitTable: false,
          splitResFileGen: false,
          showMsgPushTable: true,
          msgPushTable: res.body.list,
        });
      }
    });
  };
  //文件下载拆分--文件拆分列表
  getSplitList = () => {
    const { batNo } = this.props.currentRecord;
    getSplitResultList({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getSplitResultList',
      data: { batNo },
    }).then(res => {
      if (res && res.body) {
        this.setState({
          showViewList: false,
          showMsgPushTable: false,
          showSplitTable: true,
          splitResFileGen: false,
          splitResultList: res.body,
        });
      }
    });
  };
  //服务调度--分片结果文件生成列表
  splitFileResCreate = () => {
    const { batType, chnNo, busCode, batNo } = this.props.currentRecord;
    getBtrDetail({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'getBtrDetail',
      data: { batType, chnNo, txnCode: busCode, batNo },
    }).then(res => {
      if (res && res.body) {
        this.setState({
          showViewList: false,
          showSplitTable: false,
          showMsgPushTable: false,
          splitResFileGen: true,
          splitResFileGenList: res.body,
        });
      }
    });
  };
  //联机服务重跑
  reRun = record => {
    console.log(record, '重跑');
    repeatRunNodeStep({
      stdSvcInd: 'BatchRuningSVC',
      stdIntfcInd: 'repeatRunStep',
      data: { batNo },
    }).then(res => {
      console.log(res);
    });
  };

  stop = record => {
    console.log(record, '中断');
  };
  //返回
  returnMain = () => {
    this.props.setDisPlay(true, false);
  };
  render() {
    return (
      <div>
        <Card>
          <GGEditor>
            <Row gutter={18}>
              <div style={{ width: '12%' }}>
                <Card className={styles.cardType} title="状态名称">
                  <Scrollbars autoHeightMax={340} autoHide autoHeight>
                    <ItemPanel className={styles.ItemPanel}>
                      {this.state.btrFlowRelsNode.map(item => {
                        return (
                          <Item className={styles.item}>
                            <img
                              title={item.label}
                              src={item.logoIcon.img}
                              draggable={false}
                            />
                            <span className={styles.nodeChar}>
                              {item.label}
                            </span>
                          </Item>
                        );
                      })}
                    </ItemPanel>
                  </Scrollbars>
                </Card>
              </div>

              <div className={styles.cardTypeRight}>
                <div>
                  <Button
                    type="primary"
                    style={{
                      top: '1px',
                      border: '1px solid #e8e8e8',
                      float: 'right',
                      height: '46px',
                      width: '72px',
                    }}
                    onClick={this.returnMain}
                  >
                    <Tooltip title={'返回'}>
                      <RollbackOutlined
                        style={{
                          display: 'inline-block',
                          width: '44px',
                          fontSize: '20px',
                        }}
                      />
                    </Tooltip>
                  </Button>
                  <CommandList />
                </div>
                <Flow
                  className={styles.graph}
                  data={this.state.NodeData}
                  onNodeMouseEnter={e => this.showNodeEnter(e)}
                  onNodeMouseLeave={e => this.showNodeLeave(e)}
                  onNodeDoubleClick={e => this.showNodeDoubleClick(e)}
                  onNodeClick={e => this.showNodeClick(e)}
                  /*  onNodeMouseEnter={e => this.showNodeMouseEnter(e)} */
                  onNodeMouseOut={e => this.showNodeMouseOut(e)}
                  graphConfig={{
                    //画布渲染模式
                    renderer: 'canvas',
                    //配置默认连入点
                    nodeStateStyles: {
                      hover: {
                        opacity: 0.1,
                      },
                      click: {
                        opacity: 0.1,
                      },
                      selected: {
                        opacity: 0.1,
                      },
                    },
                    //节点信息
                    defaultNode: {
                      //去掉左边的竖线
                      preRect: {
                        show: false,
                      },
                      //改变文字样式
                      /*   labelCfg: {
                        style: {
                          marginRight: 20,
                          fontSize: 12,
                          fill: '#fff',
                        },
                      }, */
                      //linkPoints无法修改
                      linkPoints: {
                        top: false,
                        bottom: false,
                        left: true,
                        right: true,
                        size: 0,
                        stroke: '#3f67ed',
                        fill: '#fff',
                      },
                      style: {
                        lineWidth: 0,
                        fill: '#3f67ed',
                        stroke: '#3f67ed',
                        radius: 32.5,
                        opacity: 0.7,
                        cursor: 'pointer',
                        shadowColor: 'red',
                      },
                      type: 'customInternalNode',
                    },

                    //边信息
                    defaultEdge: {
                      style: {
                        lineWidth: 1,
                        stroke: '#ccc',
                        endArrow: true,
                      },
                      type: 'polyline',
                    },
                  }}
                />
                {/* 自定义节点类型 */}
                <RegisterNode
                  name="customInternalNode"
                  config={{
                    setState(name: any, value: any, item: any) {
                      //设置描点状态
                      setAnchorPointsState.call(
                        this,
                        name,
                        value,
                        item,
                        (item, anchorPoint) => {
                          const {
                            width,
                            height,
                          } = item.getKeyShape().getBBox();
                          const [x, y] = anchorPoint;
                          return {
                            x: width * x - width / 2,
                            y: height * y - height / 2,
                          };
                        },
                        (item, anchorPoint) => {
                          const {
                            width,
                            height,
                          } = item.getKeyShape().getBBox();
                          const [x, y] = anchorPoint;
                          return {
                            x: width * x - width / 2,
                            y: height * y - height / 2,
                          };
                        },
                      );
                    },
                    getCustomConfig(model: any) {
                      return {
                        size: [40, 40],
                        wrapperStyle: {
                          fill: 'lightgreen',
                          stroke: 'lightgreen',
                        },
                        contentStyle: {
                          fill: '#5e6a7d',
                          stroke: 'lightgreen',
                        },
                        labelStyle: {
                          fill: '#FFFFFF',
                          stroke: 'lightgreen',
                        },
                      };
                    },
                    getAnchorPoints() {
                      return [
                        /*   [0.5, 0],
                        [0.5, 1], */
                        [0, 0.5],
                        [1, 0.5],
                      ];
                    },
                  }}
                  extend="modelRect"
                />
              </div>
            </Row>
          </GGEditor>
        </Card>
        {/* 信息总揽表 */}
        {this.state.showViewList && (
          <div className={styles.mainInfoList}>
            <Card>
              <Table
                className={styles.tableHeader}
                columns={this.state.viewColumns}
                dataSource={this.state.viewList}
                pagination={false}
              ></Table>
            </Card>
          </div>
        )}
        {/* 拆分表 */}
        {this.state.showSplitTable && (
          <Card>
            <Table
              className={styles.tableHeader}
              columns={this.state.columns}
              dataSource={this.state.splitResultList}
              pagination={false}
            ></Table>
          </Card>
        )}
        {/* 结果消息推送表 */}
        {this.state.showMsgPushTable && (
          <Card>
            <Table
              className={styles.tableHeader}
              columns={this.state.msgPushColumns}
              dataSource={this.state.msgPushTable}
              pagination={false}
            ></Table>
          </Card>
        )}
        {/* 分片结果文件生成 */}
        {this.state.splitResFileGen && (
          <Card>
            <Table
              className={styles.tableHeader}
              columns={this.state.splitResFileGenColumns}
              dataSource={this.state.splitResFileGenList}
              pagination={false}
            ></Table>
          </Card>
        )}
      </div>
    );
  }
}

export default RunDiagram;
