import React, { Component } from 'react';
import {
  findFlowNodeMsg,
  findBatFlowChildNodeMsg,
  findBatFlowChildStepMsg,
  getBatchMessage,
  getTempConf,
} from '../service';
import { Command, constants, G6 } from 'gg-editor';
import { cloneDeep } from 'lodash';
import {
  Card,
  Row,
  Col,
  Button,
  notification,
  Collapse,
  Menu,
  Table,
  Tooltip,
  message,
} from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import GGEditor, { Flow, EditableLabel, ItemPanel, Item } from 'gg-editor';
import WrappedClassComponent from './Wrapped/WrappedClassComponent';
import WrappedChildFlow from './Wrapped/WrappedChildFlow';
import { Scrollbars } from 'react-custom-scrollbars';
import CommandList from './ggEditor/CommandList';
import NodeContextMenu from './ggEditor/NodeContextMenu';
import styles from './component.less';
import { connect } from 'umi';
import {
  columns,
  nodeInfo,
  graphConfig,
  stepNodes,
  endNodes,
  childrenNode,
  btrFlowRelsNode,
} from '../data';
import WrappedEndFlow from './wrapped/WrappedEndFlow';
import WrappedStepFlow from './wrapped/WrappedStepFlow';
import CustomNode from './ggeditor/CustomNode';

// interface WrappedClassComponentProps extends EditorContextProps {}
class BatchNodeTable extends React.Component {
  state = {
    opacity: 1,
    //节点信息表
    nodesInfo: [],
    showMainFlow: false,
    showFileDown: false,
    showOnlineServices: false,
    showFileSplit: false,
    showSplitFileInStorage: false,
    showServerDispatch: false,
    showSplitResCreate: false,
    showChildNodes: false,
    showEndNodes: false,
    showStepNodes: false,
    showMainNode: true,
    display: 'none',
    //主节点
    btrFlowRelsNode: btrFlowRelsNode,
    //文件下载拆分子节点
    childrenNode: childrenNode,
    //联机服务调度子节点
    endNodes: endNodes,
    //结果文件排序子节点
    stepNodes: stepNodes,
    //主画布
    data: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
    //文件下载拆分子画布
    childData: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
    //联机服务调度
    endData: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
    //结果文件排序子画布
    stepData: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
  };
  componentDidMount() {
    if (this.state.data.nodes.length > 0) {
      console.log(
        '节点信息是否存在',
        this.state.data.nodes,
        '长度为',
        this.state.data.nodes.length,
      );
    } else {
      this.getTempConf();
    }
    this.cancelRightEvent();
    this.getFlowNodeMsg();
    this.setExistFlow();
    this.isClearNode();
    this.props.translateDisplay(this.state.display);
  }

  // 判断是否展示清分融合节点
  isClearNode = () => {
    if (this.props.clearRuleData?.length > 0) {
      var stepNodes = cloneDeep(this.state.stepNodes);
      stepNodes = [
        ...stepNodes,
        {
          styles: {
            opacity: 1,
          },
          id: 'fgrsResFileMerge',
          type: 'modelRect',
          parent: 'C-FSM',
          parentLabel: '结果文件排序',
          size: [175, 65],
          logoIcon: {
            height: 25,
            width: 25,
            show: true,
            img: require('@/assets/batchProcessSet/ResFileSort/notifyFileCateway-unChecked.svg'),
            x: -70,
          },
          label: '结果文件融合',
          x: 850,
          y: 400,
        },
      ];
      this.setState({
        stepNodes,
      });
    }
  };

  //组件卸载后对state进行清除
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  //取消画布中右键事件
  cancelRightEvent = () => {
    var mainFlow = document.getElementById('mainFlow');
    if (mainFlow) {
      mainFlow.oncontextmenu = function(e) {
        e = e || window.event;
        return false;
      };
    }
  };

  //模板查询接口初始化画布
  getTempConf = () => {
    console.log(
      '当前页码为：',
      this.props.current,
      this.props.clearRuleData?.length,
    );
    // if (this.props.current === 0) {
    getTempConf({
      stdSvcInd: 'BatchTemplateSVC',
      stdIntfcInd: 'getTempConf',
      data: {
        tempId: this.props.clearRuleData?.length > 0 ? '6000024' : '6000023',
      },
    }).then(res => {
      if (res) {
        var numTag = this.props.clearRuleData?.length > 0 ? 4 : 3;
        var flowRelConfig = JSON.parse(res.body.flowRelConfig);
        var stepRelConfig = JSON.parse(res.body.stepRelConfig);
        var nodeStepRelConfig = JSON.parse(res.body.nodeStepRelConfig);
        var fileDownload: any = [];
        var resultSort: any = [];
        var nodes: any = [];
        var edges: any = [];
        var nodesStep: any = [];
        var edgesStep: any = [];
        nodeStepRelConfig.nodes.map((item: any) => {
          if (item.parent == 'C-FDS') {
            nodes.push(item);
          }
          if (item.parent == 'C-FSM') {
            nodesStep.push(item);
          }
        });
        // for (let i = 0; i < 4; i++) {
        //   nodes.push(nodeStepRelConfig.nodes[i]);
        // }
        for (let i = 0; i < numTag; i++) {
          edges.push(nodeStepRelConfig.edges[i]);
        }
        // for (let i = 4; i < nodeStepRelConfig.nodes.length; i++) {
        //   nodesStep.push(nodeStepRelConfig.nodes[i]);
        // }
        for (let i = numTag; i < nodeStepRelConfig.edges.length; i++) {
          edgesStep.push(nodeStepRelConfig.edges[i]);
        }
        fileDownload = {
          nodes,
          edges,
        };
        resultSort = {
          nodes: nodesStep,
          edges: edgesStep,
        };
        console.log(
          'flowRelConfig:',
          flowRelConfig,
          'fileDownload:',
          fileDownload,
          'stepRelConfig:',
          stepRelConfig,
          'resultSort:',
          nodeStepRelConfig,
          nodesStep,
          edgesStep,
        );
        this.setState({
          data: flowRelConfig,
          childData: fileDownload,
          endData: stepRelConfig,
          stepData: resultSort,
        });
        this.setConnectInfo(flowRelConfig);
      }
    });
    // else {
    //   this.setExistFlow();
    // }
  };

  //如果画布有值就设置
  setExistFlow = () => {
    console.log('拖拽结束');
    if (this.props.graphData.nodes) {
      const nodes = this.props.graphData.nodes
        ? this.props.graphData.nodes
        : [];
      const edges = this.props.graphData.edges
        ? this.props.graphData.edges
        : [];
      const data = {
        nodes,
        edges,
      };
      console.log(data);
      this.setState({
        data,
      });
    }
    // if (this.props.graphChildData.nodes) {
    //   const nodesChild = this.props.graphChildData.nodes
    //     ? this.props.graphChildData.nodes
    //     : [];
    //   const edgesChild = this.props.graphChildData.edges
    //     ? this.props.graphChildData.edges
    //     : [];
    //   const childData = {
    //     nodes: nodesChild,
    //     edges: edgesChild,
    //   };
    //   this.setState({
    //     childData,
    //   });
    // }
    // if (this.props.graphEndData.nodes) {
    //   const nodesEnd = this.props.graphEndData.nodes
    //     ? this.props.graphEndData.nodes
    //     : [];
    //   const edgesEnd = this.props.graphEndData.edges
    //     ? this.props.graphEndData.edges
    //     : [];
    //   const endData = {
    //     nodes: nodesEnd,
    //     edges: edgesEnd,
    //   };
    //   this.setState({
    //     endData,
    //   });
    // }
    // if (this.props.graphStepData.nodes) {
    //   const nodesStep = this.props.graphStepData.nodes
    //     ? this.props.graphStepData.nodes
    //     : [];
    //   const edgesStep = this.props.graphStepData.edges
    //     ? this.props.graphStepData.edges
    //     : [];
    //   const stepData = {
    //     nodes: nodesStep,
    //     edges: edgesStep,
    //   };
    //   this.setState({
    //     stepData,
    //   });
    // }
  };

  //获取主节点信息
  getFlowNodeMsg = () => {
    findFlowNodeMsg({
      stdSvcInd: 'BatchProcessSetupSVC',
      stdIntfcInd: 'findFlowNodeMsg',
      data: {},
    }).then(res => {
      if (res && res.body) {
        console.log('节点信息：', res);
        const btrFlowRelsNode = cloneDeep(this.state.btrFlowRelsNode);
        btrFlowRelsNode.map((element, index1) => {
          res.body.btrFlowNodeList.map((item, index2) => {
            if (index1 == index2) {
              element.id = item.currentNodeId;
            }
          });
        });
        this.setState(
          {
            btrFlowRelsNode,
          },
          () => console.log(this.state.btrFlowRelsNode),
        );
      }
    });
  };

  /**
   * 获取文件下载拆分和结果文件子节点信息
   * @param type 子节点的判定类型
   */
  getStepNodesMsg = (type: any) => {
    findBatFlowChildNodeMsg({
      stdSvcInd: 'BatchProcessSetupSVC',
      stdIntfcInd: 'findBatFlowChildNodeMsg',
      data: { currentNode: type },
    }).then((res: any) => {
      if (res) {
        console.log('');
        switch (type) {
          case 'C-FDS':
            var childrenNode = cloneDeep(this.state.childrenNode);
            childrenNode.map((element, index1) => {
              res.body.map((item: any, index2: any) => {
                if (element.label == item.currentStepName) {
                  element.id = item.currentStepId;
                }
              });
            });
            this.setState({
              childrenNode,
            });
            break;
          case 'C-FSM':
            var stepNodes = cloneDeep(this.state.stepNodes);
            stepNodes.map((element, index1) => {
              res.body.map((item: any, index2: any) => {
                if (element.label == item.currentStepName) {
                  element.id = item.currentStepId;
                }
              });
            });
            console.log(stepNodes);
            this.setState({
              stepNodes,
            });
            break;
        }
        // 之后考虑去这样做
        // childrenNode = res.body.map((item: any, index2: any) => {
        //   return {
        //     id: item.currentStepId,
        //     label: item.currentStepName,
        //     parent: item.currentNode,
        //     type: 'modelRect',
        //     parentLabel: '文件下载拆分',
        //     size: [130, 65],
        //     logoIcon: {
        //       height: 28,
        //       width: 28,
        //       show: true,
        //       img: require('@/assets/batchProcessSet/FileDown/fileDown-unChecked.svg'),
        //       x: -50,
        //     },
        //     anchorPoints: [
        //       [0, 1],
        //       [0.5, 1],
        //     ],
        //   }
        // });
      }
    });
  };

  //获取联机服务调度子节点信息
  getOnlineServiceMsg = () => {
    findBatFlowChildStepMsg({
      stdSvcInd: 'BatchProcessSetupSVC',
      stdIntfcInd: 'findBatFlowChildStepMsg',
      data: {},
    }).then(res => {
      if (res) {
        console.log('节点信息：', res.body);
        const endNodes = cloneDeep(this.state.endNodes);
        endNodes.map((element, index1) => {
          res.body.map((item, index2) => {
            if (index1 == index2) {
              element.id = item.stepName;
            }
          });
        });
        this.setState({
          endNodes,
        });
      }
    });
  };
  showChildNode = (id: string) => {
    if (id == 'fileDownSplit') {
      this.setState({
        showChildNodes: true,
        showEndNodes: false,
      });
    } else if (id == 'onlineServer') {
      this.setState({
        showChildNodes: false,
        showEndNodes: true,
      });
    }
  };
  handleConfigOk = () => {};
  //动画回调
  // onload = () => {
  //   var childFlow: any = document.getElementById('childFlow')
  //   childFlow.addEventListener('animationend', this.set)
  // }
  // set = () => {
  //   if (document.getElementById('childFlow')) {
  //     document.getElementById('childFlow').style.display = 'none'
  //   }
  // }
  //展示节点信息列表
  showFileList = () => {
    try {
      var fileList: any = document.getElementById('fileList');
      var fileCheckForm: any = document.getElementById('fileCheckForm');
      var fileSplitForm: any = document.getElementById('fileSplitForm');
      fileList.style.display = 'block';
      fileSplitForm.style.display = 'none';
      fileCheckForm.style.display = 'none';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };
  //控制主节点进入子节点默认配置页面展示
  showDefaultFileDate = (type: any) => {
    try {
      var fileList: any = document.getElementById('fileList');
      var fileCheckForm: any = document.getElementById('fileCheckForm');
      var fileSplitForm: any = document.getElementById('fileSplitForm');
      var splitFileInStorage: any = document.getElementById(
        'splitFileInStorage',
      );
      var serverDispatch: any = document.getElementById('serverDispatch');
      var splitResCreate: any = document.getElementById('splitResCreate');
      var fileSortMerge: any = document.getElementById('fileSortMerge');
      var clearDismantle: any = document.getElementById('clearDismantle');
      switch (type) {
        case 'File':
          fileList.style.display = 'none';
          fileSplitForm.style.display = 'none';
          fileCheckForm.style.display = 'block';
          clearDismantle.style.display = 'none';
          break;
        case 'Online':
          fileList.style.display = 'none';
          splitResCreate.style.display = 'none';
          serverDispatch.style.display = 'none';
          fileSortMerge.style.display = 'none';
          splitFileInStorage.style.display = 'block';
          break;
        case 'Merge':
          fileList.style.display = 'none';
          splitResCreate.style.display = 'none';
          serverDispatch.style.display = 'none';
          splitFileInStorage.style.display = 'none';
          fileSortMerge.style.display = 'block';
          break;
      }
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };
  //控制文件下载
  fileCheck = () => {
    try {
      var fileCheckForm: any = document.getElementById('fileCheckForm');
      var fileSplitForm: any = document.getElementById('fileSplitForm');
      var fileList: any = document.getElementById('fileList');
      const opacity = [this.state.opacity];
      var clearDismantle: any = document.getElementById('clearDismantle');
      clearDismantle.style.display = 'none';
      opacity.forEach(e => 1);
      this.setState(
        {
          opacity: opacity,
        },
        () => {},
      );
      console.log(fileList);
      fileList.style.display = 'none';
      fileSplitForm.style.display = 'none';
      fileCheckForm.style.display = 'block';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };
  //控制文件拆分
  fileSplit = () => {
    try {
      var fileCheckForm: any = document.getElementById('fileCheckForm');
      var fileSplitForm: any = document.getElementById('fileSplitForm');
      var fileList: any = document.getElementById('fileList');
      var clearDismantle: any = document.getElementById('clearDismantle');
      clearDismantle.style.display = 'none';
      const opacity = [this.state.opacity];
      const display = [this.state.display];
      opacity.forEach(e => 1);
      display.forEach(e => 'none');
      this.setState(
        {
          display: display,
          opacity: opacity,
        },
        () => {},
      );
      fileList.style.display = 'none';
      fileCheckForm.style.display = 'none';
      fileSplitForm.style.display = 'block';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };

  //文件下载拆分
  splitFileDown = () => {
    var splitFileDown: any = document.getElementById('splitFileDown');
    const opacity = [this.state.opacity];
    opacity.forEach(e => 1);
    this.setState(
      {
        opacity: opacity,
      },
      () => {},
    );
  };
  //分片文件解析入库
  splitFileInStorage = () => {
    try {
      var splitFileInStorage: any = document.getElementById(
        'splitFileInStorage',
      );
      var fileSortMerge: any = document.getElementById('fileSortMerge');
      fileSortMerge.style.display = 'none';
      var serverDispatch: any = document.getElementById('serverDispatch');
      var splitResCreate: any = document.getElementById('splitResCreate');
      var resultFileMerge: any = document.getElementById('resultFileMerge');
      resultFileMerge.style.display = 'none';
      splitResCreate.style.display = 'none';
      serverDispatch.style.display = 'none';
      splitFileInStorage.style.display = 'block';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };
  //联机服务调度节点
  serverDispatch = () => {
    try {
      var splitFileInStorage: any = document.getElementById(
        'splitFileInStorage',
      );
      var fileSortMerge: any = document.getElementById('fileSortMerge');
      fileSortMerge.style.display = 'none';
      var serverDispatch: any = document.getElementById('serverDispatch');
      var splitResCreate: any = document.getElementById('splitResCreate');
      var resultFileMerge: any = document.getElementById('resultFileMerge');
      resultFileMerge.style.display = 'none';
      splitResCreate.style.display = 'none';
      serverDispatch.style.display = 'block';
      splitFileInStorage.style.display = 'none';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };
  //分片结果文件生成
  splitResCreate = () => {
    try {
      var splitFileInStorage: any = document.getElementById(
        'splitFileInStorage',
      );
      var fileSortMerge: any = document.getElementById('fileSortMerge');
      fileSortMerge.style.display = 'none';
      var serverDispatch: any = document.getElementById('serverDispatch');
      var splitResCreate: any = document.getElementById('splitResCreate');
      var resultFileMerge: any = document.getElementById('resultFileMerge');
      resultFileMerge.style.display = 'none';
      splitResCreate.style.display = 'block';
      serverDispatch.style.display = 'none';
      splitFileInStorage.style.display = 'none';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };

  //一清二拆节点事件
  clearDismantle = () => {
    try {
      var fileCheckForm: any = document.getElementById('fileCheckForm');
      var fileSplitForm: any = document.getElementById('fileSplitForm');
      var fileList: any = document.getElementById('fileList');
      var clearDismantle: any = document.getElementById('clearDismantle');
      fileCheckForm.style.display = 'none';
      fileSplitForm.style.display = 'none';
      fileList.style.display = 'none';
      clearDismantle.style.display = 'block';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };

  //分片文件上传
  splitResUpload = () => {
    var splitResUpload: any = document.getElementById('splitResUpload');
    const opacity = [this.state.opacity];
    opacity.forEach(e => 1);
    this.setState(
      {
        opacity: opacity,
      },
      () => {
        // splitResUpload.style.opacity = '0.3';
      },
    );
    this.props.translateDisplay(this.state.display);
  };

  //是否显示文件合并排序
  fileSortMerge = () => {
    try {
      var fileSortMerge: any = document.getElementById('fileSortMerge');
      var splitFileInStorage: any = document.getElementById(
        'splitFileInStorage',
      );
      var serverDispatch: any = document.getElementById('serverDispatch');
      var splitResCreate: any = document.getElementById('splitResCreate');
      var resultFileMerge: any = document.getElementById('resultFileMerge');
      resultFileMerge.style.display = 'none';
      splitResCreate.style.display = 'none';
      serverDispatch.style.display = 'none';
      splitFileInStorage.style.display = 'none';
      fileSortMerge.style.display = 'block';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };

  // 结果文件融合节点事件
  resultFileMerge = () => {
    try {
      var fileSortMerge: any = document.getElementById('fileSortMerge');
      var splitFileInStorage: any = document.getElementById(
        'splitFileInStorage',
      );
      var serverDispatch: any = document.getElementById('serverDispatch');
      var splitResCreate: any = document.getElementById('splitResCreate');
      var resultFileMerge: any = document.getElementById('resultFileMerge');
      splitResCreate.style.display = 'none';
      serverDispatch.style.display = 'none';
      splitFileInStorage.style.display = 'none';
      fileSortMerge.style.display = 'none';
      resultFileMerge.style.display = 'block';
    } catch (error) {
      notification.info({
        description: '本步骤中不进行此节点配置',
        message: '无效调用',
      });
    }
  };

  //点击节点事件
  showNodeClick = (e: any) => {
    // 点击前先设置底部按钮位置
    this.setButtonPosition();
    console.log(
      '您新增了节点：',
      `${e.item._cfg.model.label}(${e.item._cfg.id})`,
    );
    if (e.item._cfg.id == this.state.btrFlowRelsNode[0].id) {
      console.log('您点击了节点：', e.item._cfg.model.label);
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[1].id) {
      console.log(
        '您点击了节点：',
        e.item._cfg.model.id,
        '他的透明度是：',
        e.item._cfg.styles.opacity,
      );
      console.log(this.props.current);
      if (this.props.current === 1) {
        this.setDisplay('in');
        this.setState({
          showChildNodes: true,
          showEndNodes: false,
          showStepNodes: false,
          showMainFlow: true,
          showMainNode: false,
        });
        this.showDefaultFileDate('File');
        this.getStepNodesMsg('C-FDS');
      } else {
        message.destroy();
        message.info('本步骤中不进行此节点配置');
      }
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[2].id) {
      console.log(
        '您点击了节点：',
        e.item._cfg.model.id,
        '他的透明度是：',
        e.item._cfg.styles.opacity,
      );
      if (this.props.current === 2) {
        this.setDisplay('in');
        this.setState({
          showMainFlow: true,
          showChildNodes: false,
          showEndNodes: true,
          showStepNodes: false,
          showMainNode: false,
        });
        this.showDefaultFileDate('Online');
        this.getOnlineServiceMsg();
      } else {
        message.destroy();
        message.info('本步骤中不进行此节点配置');
      }
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[3].id) {
      console.log(
        '您点击了节点：',
        e.item._cfg.model.id,
        '他的透明度是：',
        e.item._cfg.styles.opacity,
      );
      if (this.props.current === 2) {
        this.setDisplay('in');
        this.setState({
          showMainFlow: true,
          showChildNodes: false,
          showEndNodes: false,
          showStepNodes: true,
          showMainNode: false,
        });
        this.showDefaultFileDate('Merge');
        this.getStepNodesMsg('C-FSM');
      } else {
        message.destroy();
        message.info('本步骤中不进行此节点配置');
      }
    }

    // else if (e.item._cfg.id == this.state.childrenNode[0].id) {
    //   console.log('您点击了节点：', e.item._cfg.model.label);
    // } else if (e.item._cfg.id == this.state.childrenNode[1].id) {
    //   // e.item._cfg.styles.opacity = 0.3;
    //   console.log('您点击了节点：', this.state.childrenNode[1].id);
    //   this.fileCheck();
    // } else if (e.item._cfg.id == this.state.childrenNode[2].id) {
    //   console.log('您点击了节点：', this.state.childrenNode[2].id);
    //   this.clearDismantle();
    // } else if (e.item._cfg.id == this.state.childrenNode[3].id) {
    //   console.log(
    //     '您点击了节点：',
    //     e.item._cfg.id,
    //     this.state.childrenNode[3].id,
    //   );
    //   this.fileSplit();
    // }
    else if (e.item._cfg.id == this.state.endNodes[0].id) {
      console.log('您点击了节点：', e.item._cfg.model.label);
      this.splitFileDown();
    } else if (e.item._cfg.id == this.state.endNodes[1].id) {
      console.log('您点击了节点：', e.item._cfg.model.label);
      this.splitFileInStorage();
    } else if (e.item._cfg.id == this.state.endNodes[2].id) {
      console.log('您点击了节点：', e.item._cfg.model.label);
      this.serverDispatch();
    } else if (e.item._cfg.id == this.state.endNodes[3].id) {
      console.log('您点击了节点：', e.item._cfg.model.label);
      this.splitResCreate();
    } else if (e.item._cfg.id == this.state.endNodes[4].id) {
      console.log('您点击了节点：', e.item._cfg.model.label);
      this.splitResUpload();
    }
    // else if (e.item._cfg.id == this.state.stepNodes[2].id) {
    //   console.log('您点击了节点：', e.item._cfg.model.label);
    //   this.fileSortMerge();
    // } else if (
    //   this.state.stepNodes[5] &&
    //   e.item._cfg.id == this.state.stepNodes[5].id
    // ) {
    //   console.log('您点击了节点：', e.item._cfg.model.label);
    //   // 当为一清二拆时才会存在结果文件融合节点
    //   if (this.props.clearRuleData.length > 0) {
    //     this.resultFileMerge();
    //   }
    // }
    this.state.childrenNode.map(item => {
      if (e.item._cfg.id == item.id) {
        switch (item.id) {
          case 'fileValidationService':
            this.fileCheck();
            break;
          case 'btrClearService':
            this.clearDismantle();
            break;
          case 'btrFileSplitService':
            this.fileSplit();
            break;
        }
      }
    });

    this.state.stepNodes.map(item => {
      if (e.item._cfg.id == item.id) {
        switch (item.id) {
          case 'resultFileSortAndMergeService':
            this.fileSortMerge();
            break;
          case 'fgrsResFileMerge':
            this.resultFileMerge();
            break;
        }
      }
    });
  };

  //设置底部按钮位置
  setButtonPosition = () => {
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveIsDisplay', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        display: true,
      },
    });
  };

  //设置首页是否展示节点列表
  setDisplay = (type: any) => {
    var fileList: any = document.getElementById('fileList');
    switch (type) {
      case 'in':
        fileList.style.display = 'none';
        this.props.dispatch({
          //dispatch为页面触发model中方法的函数
          type: 'tableList/saveFileListDisplay', //type：'命名空间/reducer或effects中的方法名'
          payload: {
            fileListDisplay: 'block',
          },
        });
        break;
      case 'return':
        fileList.style.display = 'block';
        this.props.dispatch({
          //dispatch为页面触发model中方法的函数
          type: 'tableList/saveFileListDisplay', //type：'命名空间/reducer或effects中的方法名'
          payload: {
            fileListDisplay: 'none',
          },
        });
        break;
    }
  };
  //新增节点事件
  showAddItem = async (e: any) => {
    // this.setButtonPosition();
    console.log(
      '您新增了节点：',
      `${e.item._cfg.model.label}(${e.item._cfg.id})`,
    );
    if (e.item._cfg.id == this.state.btrFlowRelsNode[0].id) {
      // this.showFileList();
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[1].id) {
      // this.getFileDownSplitMsg();
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[2].id) {
      this.getOnlineServiceMsg();
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[3].id) {
      this.getOnlineServiceMsg();
    }
    // else if (e.item._cfg.id == (await this.state.childrenNode[1].id)) {
    //   this.fileCheck();
    // } else if (e.item._cfg.id == (await this.state.childrenNode[2].id)) {
    //   // 文件清分节点
    //   this.clearDismantle();
    // } else if (e.item._cfg.id == (await this.state.childrenNode[3].id)) {
    //   this.fileSplit();
    // }
    else if (e.item._cfg.id == this.state.endNodes[1].id) {
      this.splitFileInStorage();
    } else if (e.item._cfg.id == this.state.endNodes[2].id) {
      this.serverDispatch();
    } else if (e.item._cfg.id == this.state.endNodes[3].id) {
      this.splitResCreate();
    }
    // else if (e.item._cfg.id == this.state.stepNodes[2].id) {
    //   this.fileSortMerge();
    // } else if (
    //   this.state.stepNodes[5] &&
    //   e.item._cfg.id == this.state.stepNodes[5].id
    // ) {
    //   if (this.props.clearRuleData.length > 0) {
    //     this.resultFileMerge();
    //   } else {
    //     e.item._cfg.states[0] = 'none';
    //     console.log(e.item._cfg.states);
    //   }
    // }
    this.state.childrenNode.map(item => {
      if (e.item._cfg.id == item.id) {
        switch (item.id) {
          case 'fileValidationService':
            this.fileCheck();
            break;
          case 'btrClearService':
            this.clearDismantle();
            break;
          case 'btrFileSplitService':
            this.fileSplit();
            break;
        }
      }
    });

    this.state.stepNodes.map(item => {
      if (e.item._cfg.id == item.id) {
        switch (item.id) {
          case '"resultFileSortAndMergeService"':
            this.fileSortMerge();
            break;
          case 'fgrsResFileMerge':
            this.resultFileMerge();
            break;
        }
      }
    });
  };
  //连线完成事件
  showEdgeConnect = (e: any) => {
    console.log('新增边：', e);
    if (e) {
      console.log(
        e,
        '当前连线的问题为：',
        nodeInfo[e.edge._cfg.targetNode._cfg.edges[0]._cfg.model.target],
      );
      //设置连线信息

      var nodesInfo = cloneDeep(this.state.nodesInfo);
      nodesInfo.push({
        //当前节点名称var
        batType: this.props.batType.label,
        chnNo: this.props.chnNo.label,
        busCode: this.props.busCode.label,
        currentNodeName: e.edge._cfg.target._cfg.model.label,
        currentNodeId: e.edge._cfg.target._cfg.id,
        crtTmstmp: e.edge._cfg.source._cfg.model.label,
        modTmstmp: e.edge._cfg.source._cfg.id,
        afterTmstmp:
          nodeInfo[e.edge._cfg.targetNode._cfg.edges[0]._cfg.model.target],
        afterTmsId: e.edge._cfg.targetNode._cfg.edges[0]._cfg.model.target,
      });
      console.log('nodesInfo', nodesInfo);
      //保存连线信息
      this.props.dispatch({
        //dispatch为页面触发model中方法的函数
        type: 'tableList/saveConnectLineInfo', //type：'命名空间/reducer或effects中的方法名'
        payload: {
          connectLineInfo: nodesInfo,
        },
      });
      if (e.edge._cfg.source._cfg.id === 'C-TSK') {
        nodesInfo.unshift({
          batType: this.props.batType.label,
          chnNo: this.props.chnNo.label,
          busCode: this.props.busCode.label,
          currentNodeName: e.edge._cfg.source._cfg.model.label,
          currentNodeId: e.edge._cfg.source._cfg.id,
          afterTmstmp: e.edge._cfg.target._cfg.model.label,
          afterTmsId: e.edge._cfg.target._cfg.id,
        });
      }
      //整合好数据后利用本身的数组index作为seqNum
      nodesInfo.map((item: any, index: any) => {
        item.seqNum = index + 1;
      });
      var obj = {};
      nodesInfo = nodesInfo.reduce((item, next) => {
        obj[next.currentNodeId]
          ? ''
          : (obj[next.currentNodeId] = true && item.push(next));
        return item;
      }, []);
      this.setState({
        nodesInfo,
      });
    }
  };

  //设置连线信息表
  setConnectInfo = e => {
    console.log(e);
    var nodesInfo = cloneDeep(this.state.nodesInfo);
    e.edges.map((item: any, index: any, array: any) => {
      console.log('array', array[index + 1]);
      nodesInfo.push({
        //当前节点名称
        batType: this.props.batType.label,
        chnNo: this.props.chnNo.label,
        busCode: this.props.busCode.label,
        currentNodeId: item.target,
        modTmstmp: item.source,
        currentNodeName: nodeInfo[item.target],
        crtTmstmp: nodeInfo[item.source],
        afterTmstmp: nodeInfo[array[index + 1]?.target],
        afterTmsId: array[index + 1]?.target,
      });
      if (item.source === 'C-TSK') {
        nodesInfo.unshift({
          batType: this.props.batType.label,
          chnNo: this.props.chnNo.label,
          busCode: this.props.busCode.label,
          currentNodeName: nodeInfo[item.source],
          currentNodeId: item.source,
          afterTmstmp: nodeInfo[item.target],
          afterTmsId: item.target,
        });
      }
    });
    nodesInfo.map((item: any, index: any) => {
      item.seqNum = index + 1;
    });

    // var obj = {}
    // nodesInfo = nodesInfo.reduce((item, next) => {
    //   obj[next.currentNodeId] ? '' : obj[next.currentNodeId] = true && item.push(next)
    //   return item
    // }, [])

    console.log('nodesInfo', nodesInfo);
    //保存连线信息
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveConnectLineInfo', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        connectLineInfo: nodesInfo,
      },
    });
    this.setState({
      nodesInfo,
    });
  };

  afterRemoveItem = e => {
    console.log('当边删除时会移除：', e);
  };

  //删除节点事件
  showRemoveItem = (e: any) => {
    var fileCheckForm: any = document.getElementById('fileCheckForm');
    var fileSplitForm: any = document.getElementById('fileSplitForm');
    var fileSortMerge: any = document.getElementById('fileSortMerge');
    console.log('E的样子为：', e);
    if (e.item._cfg.id == this.state.btrFlowRelsNode[1].id) {
      console.log('您删除了节点：', e.item._cfg.model.label);
      this.setState({
        showChildNodes: false,
      });
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[2].id) {
      console.log('您删除了节点：', e.item._cfg.model.label);
      this.setState({
        showEndNodes: false,
      });
    } else if (e.item._cfg.id == this.state.btrFlowRelsNode[3].id) {
      console.log('您删除了节点：', e.item._cfg.model.label);
      this.setState({
        showStepNodes: false,
      });
    } else if (e.item._cfg.id == this.state.childrenNode[1].id) {
      console.log('您删除了节点');
      fileCheckForm.style.display = 'none';
    } else if (e.item._cfg.id == this.state.childrenNode[2].id) {
      fileSplitForm.style.display = 'none';
    } else if (e.item._cfg.id == this.state.endNodes[1].id) {
      console.log('您删除了节点');
      this.setState(
        {
          showSplitFileInStorage: false,
        },
        () => {
          this.props.translateDisplay(this.state.showSplitFileInStorage);
        },
      );
    } else if (e.item._cfg.id == this.state.endNodes[2].id) {
      this.setState(
        {
          showServerDispatch: false,
        },
        () => {
          this.props.translateDisplay(this.state.showServerDispatch);
        },
      );
    } else if (e.item._cfg.id == this.state.endNodes[3].id) {
      this.setState(
        {
          showSplitResCreate: false,
        },
        () => {
          this.props.translateDisplay(this.state.showSplitResCreate);
        },
      );
    } else if (e.item._cfg.id == this.state.stepNodes[2].id) {
      fileSortMerge.style.display = 'none';
    }
    //  else if (e.item._cfg.id == this.state.stepNodes[5].id) {
    //   var resultFileMerge: any = document.getElementById('resultFileMerge');
    //   resultFileMerge.style.display = 'none';
    // }
  };

  //删除数组其中一个元素（可以是ArrayList）
  removeAnItem = (arr: any, ele: any) => {
    var index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  setGraph = (component: any) => {
    if (component && component.graph) {
      // component.graph.clear()
      const graph = component.graph;
      graph.get('canvas').set('localRefresh', false);
      graph.get('canvas').set('zoom-canvas', false);
      var nodesInfo = cloneDeep(this.state.nodesInfo);
      //当删除画布中的元素触发
      graph.on('beforeremoveitem', e => {
        console.log(e, '被删除了', e.item._cfg);
        //当边删除后删除对应的数据表中的信息
        nodesInfo.map((item: any) => {
          if (item.modTmstmp === e.item._cfg.model.source) {
            this.removeAnItem(nodesInfo, item);
          }
        });
        //重排对应的seqNum
        nodesInfo.map((item: any, index: any) => {
          item.seqNum = index + 1;
        });
        this.setState({
          nodesInfo,
        });
      });

      if (graph.get('nodes') || graph.cfg.nodes) {
        graph.on('afteradditem', e => {
          const nodes = graph.get('nodes') ? graph.get('nodes') : [];
          const edges = graph.get('edges') ? graph.get('edges') : [];
          const data = {
            nodes,
            edges,
          };
        });
      }
      //画布节点事件设置
    }
  };

  //操作子画布
  setChildGraph = (component: any) => {
    if (component && component.graph) {
      //   // component.graph.clear()
      const graph = component.graph;
      graph.get('canvas').set('localRefresh', false);
      graph.get('canvas').set('zoom-canvas', false);
      console.log('获取的child节点：', graph.get('nodes'));
      //   console.log(graph.save());
    }
  };
  //操作子画布
  setEndGraph = (component: any) => {
    if (component && component.graph) {
      const graph = component.graph;
      graph.get('canvas').set('localRefresh', false);
      graph.get('canvas').set('zoom-canvas', false);
      console.log('获取的end节点：', graph.get('nodes'));
    }
  };
  //操作子画布
  setStepGraph = (component: any) => {
    if (component && component.graph) {
      const graph = component.graph;
      graph.get('canvas').set('localRefresh', false);
      graph.get('canvas').set('zoom-canvas', false);
      console.log('获取的step节点：', graph.get('nodes'));
    }
  };
  getData = (data: any) => {
    this.setState({
      data,
    });
  };
  getChildData = (childData: any) => {
    console.log('child');
    this.setState(
      {
        childData,
      },
      () => {
        console.log('此状态下的子：', this.state.childData);
      },
    );
  };
  getEndData = (endData: any) => {
    console.log('end');
    this.setState({
      endData,
    });
  };
  getStepData = (stepData: any) => {
    console.log('step');
    this.setState({
      stepData,
    });
  };
  returnMain = () => {
    //设置底部按钮的位置
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveIsDisplay', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        display: false,
      },
    });
    this.setDisplay('return');
    this.setState({
      showMainNode: true,
      showChildNodes: false,
      showEndNodes: false,
      showStepNodes: false,
      showMainFlow: false,
    });
  };
  render() {
    const { Panel } = Collapse;

    return (
      <React.Fragment>
        <div
          className={styles.batchTaskConfig}
          style={{ pointerEvents: 'fill' }}
        >
          <div
            id="mainFlow"
            // className={this.state.showMainFlow ? styles.fadeOut : styles.fadeIn}
          >
            <GGEditor>
              {this.state.showMainNode && (
                <Row gutter={18} style={{ marginBottom: '15px' }}>
                  <Col
                    span={4}
                    style={{ paddingLeft: '0px', paddingRight: '0px' }}
                  >
                    <Card className={styles.cardType} title="节点名称">
                      <Scrollbars autoHeightMax={395} autoHide autoHeight>
                        {/* 节点列表 */}
                        <ItemPanel
                          className={styles.ItemPanel}
                          style={{ padding: '15px', paddingTop: '30px' }}
                        >
                          {this.state.btrFlowRelsNode.map((item, index) => {
                            return (
                              <Item
                                key={index}
                                className={styles.item}
                                style={item.styles}
                                model={{
                                  id: item.id,
                                  logoIcon: item.logoIcon,
                                  size: [150, 60],
                                  label: item.label,

                                  stateStyles: item.stateStyles,
                                }}
                              >
                                <div
                                /*  {...(item.id == 'fileDownSplit' && {
                                    onClick: () => this.showChildNode(item.id),
                                  })} */
                                >
                                  <img
                                    title={item.label}
                                    src={item.logoIcon.img}
                                    style={{
                                      width: item.logoIcon.width,
                                      height: item.logoIcon.height,
                                    }}
                                    draggable={false}
                                  />
                                  <span /* className={styles.nodeChar} */>
                                    {item.label}
                                  </span>
                                </div>
                              </Item>
                            );
                          })}
                        </ItemPanel>
                      </Scrollbars>
                    </Card>
                  </Col>
                  <Col span={20} style={{ paddingLeft: '0px' }}>
                    <div className={styles.cardTypeRight}>
                      <CommandList />
                      <Flow
                        className={styles.graph}
                        data={this.state.data}
                        onNodeDoubleClick={e => this.showNodeClick(e)}
                        onAfterAddItem={e => this.showAddItem(e)}
                        onBeforeRemoveItem={e => this.showRemoveItem(e)}
                        onAfterConnect={e => this.showEdgeConnect(e)}
                        onAfterRemoveItem={e => this.afterRemoveItem(e)}
                        style={{ width: '100%' }}
                        graphConfig={{
                          //画布渲染模式
                          renderer: 'canvas',
                          //默认可交互行为
                          // modes:{
                          //   default:['drag-canvas','drag-node','zoom-canvas'],
                          //   edit:[]
                          // },
                          //配置默认连入点
                          // nodeStateStyles: {
                          //   selected: {
                          //     opacity: 0.1,
                          //   },
                          // },
                          //节点信息
                          defaultNode: {
                            //去掉左边的竖线
                            preRect: {
                              show: false,
                            },
                            //改变文字样式
                            labelCfg: {
                              style: {
                                marginRight: 20,
                                fontSize: 12,
                                fill: '#fff',
                              },
                            },
                            //linkPoints无法修改
                            linkPoints: {
                              top: false,
                              bottom: false,
                              left: true,
                              right: true,
                              size: 4,
                              //描点边颜色
                              stroke: '#3f67ed',
                              //描点填充颜色
                              fill: '#fff',
                            },
                            stateStyles: {
                              selected: {
                                fill: '#3f67ed',
                                stroke: '#3f67ed',
                              },
                            },
                            style: {
                              lineWidth: 1,
                              //节点填充色
                              fill: '#3f67ed',
                              //节点边颜色
                              stroke: '#3f67ed',
                              radius: 32.5,
                              fillOpacity: 0.7,
                            },
                            type: 'customInternalNode',
                          },
                          //边信息
                          defaultEdge: {
                            style: {
                              lineWidth: 2,
                              stroke: '#A4A4A4',
                              endArrow: true,
                            },
                            type: 'polyline',
                          },
                        }}
                        ref={component => this.setGraph(component)}
                      />

                      <WrappedClassComponent
                        saveData={this.getData}
                        ref={component => {
                          console.log('wrappedClassComponentRef:', component);
                        }}
                      />
                      {/* 自定义节点类型 */}
                      <CustomNode />
                      {/* 节点右键菜单功能 */}
                      <NodeContextMenu />
                    </div>
                  </Col>
                </Row>
              )}
            </GGEditor>
          </div>
          <GGEditor style={{ marginBottom: '15px' }}>
            {this.state.showChildNodes && (
              <Row gutter={18}>
                <Col
                  span={4}
                  style={{ paddingLeft: '0px', paddingRight: '0px' }}
                  className={this.state.showMainFlow ? styles.fadeIn : ''}
                >
                  <Card
                    title="文件下载拆分"
                    className={styles.cardType}
                    style={{ height: '440px' }}
                  >
                    <Scrollbars autoHeightMax={395} autoHide autoHeight>
                      <ItemPanel
                        style={{
                          textAlign: 'left',
                          padding: '15px',
                          paddingTop: '45px',
                        }}
                      >
                        {this.state.childrenNode.map((item, index) => {
                          return (
                            <Item
                              key={index}
                              style={{
                                marginBottom: '45px',
                                marginLeft: '60px',
                                userSelect: 'none',
                                cursor: 'move',
                              }}
                              model={{
                                id: item.id,
                                size: item.size,
                                label: item.label,
                                logoIcon: item.logoIcon,
                                parent: item.parent,
                                parentLabel: item.parentLabel,
                              }}
                            >
                              <img
                                title={item.label}
                                src={item.logoIcon.img}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  marginRight: '10px',
                                }}
                                draggable={false}
                              />
                              <span>{item.label}</span>
                            </Item>
                          );
                        })}
                      </ItemPanel>
                    </Scrollbars>
                  </Card>
                </Col>
                <Col
                  id="childFlow"
                  span={20}
                  style={{ paddingLeft: '0px' }}
                  className={this.state.showMainFlow ? styles.fadeIn : ''}
                >
                  <div>
                    <div>
                      <Button
                        type={'primary'}
                        className={styles.returnButton}
                        onClick={this.returnMain}
                      >
                        <Tooltip title={'返回'}>
                          <RollbackOutlined
                            style={{ width: '44px', fontSize: '20px' }}
                          />
                        </Tooltip>
                      </Button>
                      <CommandList />
                    </div>

                    <Flow
                      style={{
                        width: '100%',
                        height: '394px',
                        border: '1px solid #e8e8e8',
                        backgroundColor: 'rgb(247, 247, 247)',
                      }}
                      data={this.state.childData}
                      onNodeClick={e => this.showNodeClick(e)}
                      onAfterAddItem={e => this.showAddItem(e)}
                      onBeforeRemoveItem={e => this.showRemoveItem(e)}
                      graphConfig={graphConfig}
                      ref={component => this.setChildGraph(component)}
                    />
                    <WrappedChildFlow
                      saveChildData={this.getChildData}
                      ref={component => {
                        console.log('wrappedClassComponentRef:', component);
                      }}
                    />
                    {/* 节点右键菜单功能 */}
                    <NodeContextMenu />
                    {/* 自定义节点类型 */}
                    <CustomNode />
                  </div>
                </Col>
              </Row>
            )}
          </GGEditor>
          <GGEditor style={{ marginBottom: '15px' }}>
            {this.state.showEndNodes && (
              <Row gutter={18}>
                <Col
                  span={4}
                  style={{ paddingLeft: '0px', paddingRight: '0px' }}
                  // className={
                  //   this.state.showMainFlow ? styles.fadeIn : styles.fadeOut
                  // }
                >
                  <Card
                    title="联机服务调度"
                    className={styles.cardType}
                    style={{ height: '440px' }}
                  >
                    <Scrollbars autoHeightMax={360} autoHide autoHeight>
                      <ItemPanel
                        style={{
                          textAlign: 'left',
                          padding: '15px',
                          paddingTop: '30px',
                        }}
                      >
                        {this.state.endNodes.map((item, index) => {
                          return (
                            <Item
                              key={index}
                              style={{
                                marginBottom: '35px',
                                marginLeft: '30px',
                                userSelect: 'none',
                                cursor: 'move',
                              }}
                              model={{
                                id: item.id,
                                size: item.size,
                                label: item.label,
                                logoIcon: item.logoIcon,
                                styles: item.styles,
                              }}
                            >
                              <img
                                title={item.label}
                                src={item.logoIcon.img}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  marginRight: '10px',
                                }}
                                draggable={false}
                              />
                              <span>{item.label}</span>
                            </Item>
                          );
                        })}
                      </ItemPanel>
                    </Scrollbars>
                  </Card>
                </Col>
                <Col
                  id="endFlow"
                  span={20}
                  style={{ paddingLeft: '0px' }}
                  className={this.state.showMainFlow ? styles.fadeIn : ''}
                >
                  <div>
                    <div>
                      <Button
                        type="primary"
                        className={styles.returnButton}
                        onClick={this.returnMain}
                      >
                        <Tooltip title={'返回'}>
                          <RollbackOutlined
                            style={{ width: '44px', fontSize: '20px' }}
                          />
                        </Tooltip>
                      </Button>
                      <CommandList />
                    </div>

                    <Flow
                      style={{
                        width: '100%',
                        height: '394px',
                        border: '1px solid #e8e8e8',
                        backgroundColor: 'rgb(247, 247, 247)',
                      }}
                      data={this.state.endData}
                      onNodeClick={e => this.showNodeClick(e)}
                      onAfterAddItem={e => this.showAddItem(e)}
                      onAfterConnect={e => this.showEdgeConnect(e)}
                      onBeforeRemoveItem={e => this.showRemoveItem(e)}
                      graphConfig={graphConfig}
                      ref={component => this.setEndGraph(component)}
                    />
                    <WrappedEndFlow
                      saveEndData={this.getEndData}
                      ref={component => {
                        console.log('wrappedClassComponentRef:', component);
                      }}
                    />
                    {/* 节点右键菜单功能 */}
                    <NodeContextMenu />
                    {/* 自定义节点类型 */}
                    <CustomNode />
                  </div>
                </Col>
              </Row>
            )}
          </GGEditor>
          <GGEditor>
            {this.state.showStepNodes && (
              <Row gutter={18}>
                <Col
                  span={4}
                  style={{ paddingLeft: '0px', paddingRight: '0px' }}
                  className={this.state.showMainFlow ? styles.fadeIn : ''}
                >
                  <Card
                    title="结果文件排序"
                    className={styles.cardType}
                    style={{ height: '440px', textAlign: 'center' }}
                  >
                    <Scrollbars autoHeightMax={395} autoHide autoHeight>
                      <ItemPanel
                        style={{
                          textAlign: 'left',
                          padding: '15px',
                          paddingTop: '40px',
                        }}
                      >
                        {this.state.stepNodes.map((item, index) => {
                          return (
                            <Item
                              key={index}
                              style={{
                                marginLeft: '50px',
                                marginBottom: '35px',
                                userSelect: 'none',
                                cursor: 'move',
                              }}
                              model={{
                                id: item.id,
                                size: item.size,
                                label: item.label,
                                logoIcon: item.logoIcon,
                                parent: item.parent,
                                parentLabel: item.parentLabel,
                              }}
                            >
                              <img
                                title={item.label}
                                src={item.logoIcon.img}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  marginRight: '10px',
                                }}
                                draggable={false}
                              />
                              <span>{item.label}</span>
                            </Item>
                          );
                        })}
                      </ItemPanel>
                    </Scrollbars>
                  </Card>
                </Col>
                <Col
                  id="stepFlow"
                  span={20}
                  style={{ paddingLeft: '0px' }}
                  className={this.state.showMainFlow ? styles.fadeIn : ''}
                >
                  {/* 修改样式 */}
                  <div>
                    <div>
                      <Button
                        type="primary"
                        className={styles.returnButton}
                        onClick={this.returnMain}
                      >
                        <Tooltip title={'返回'}>
                          <RollbackOutlined
                            style={{ width: '44px', fontSize: '20px' }}
                          />
                        </Tooltip>
                      </Button>
                      <CommandList />
                    </div>
                    <Flow
                      style={{
                        width: '100%',
                        height: '394px',
                        border: '1px solid #e8e8e8',
                        backgroundColor: 'rgb(247, 247, 247)',
                      }}
                      data={this.state.stepData}
                      onNodeClick={e => this.showNodeClick(e)}
                      onAfterAddItem={e => this.showAddItem(e)}
                      onBeforeRemoveItem={e => this.showRemoveItem(e)}
                      graphConfig={graphConfig}
                      ref={component => this.setStepGraph(component)}
                    />
                    <WrappedStepFlow
                      saveStepData={this.getStepData}
                      ref={component => {
                        console.log('wrappedClassComponentRef:', component);
                      }}
                    />
                    {/* 节点右键菜单功能 */}
                    <NodeContextMenu />
                    {/* 自定义节点类型 */}
                    <CustomNode />
                  </div>
                </Col>
              </Row>
            )}
          </GGEditor>
          {/* 节点信息表 */}
          <div className={styles.fileList} id="fileList">
            <Table
              bordered
              rowKey={record => record.seqNum}
              className={styles.batchMesTable}
              columns={columns}
              dataSource={this.state.nodesInfo}
              pagination={false}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const {
    batType,
    busCode,
    chnNo,
    graphData,
    graphChildData,
    graphEndData,
    graphStepData,
    connectLineInfo,
    current,
    clearRuleData,
    uploadStatus,
  } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    graphData,
    graphChildData,
    graphEndData,
    graphStepData,
    connectLineInfo,
    current,
    clearRuleData,
    uploadStatus,
  };
}

export default connect(mapStateToProps)(BatchNodeTable);
