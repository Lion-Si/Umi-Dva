import React from 'react';
import styles from './index.less';
import { Steps, Button, message, Card, Input } from 'antd';
import BatchMessageSet from './components/BatchMessageSet';
import ResultPushSet from './components/ResultPushSet';
import BatchProcessSet from './components/BatchProcessSet';
//import { getMenuList, saveAllSet } from './service';
import EngineServerSet from './components/EngineServerSet';
import {
  getCommonCode,
  saveResultPush,
  getTempConf,
  saveTempConf,
  addFileTempl,
  saveBatchConfigMessage,
  updateBatchConfigMessage,
  findBatchConfigMessage,
} from './service';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect, Link } from 'umi';
import Header from '../components/Header';

const { Step } = Steps;
const steps = [
  {
    title: '批次文件上传',
    icon: <div className={styles.stepImg}></div>,
    content: '1',
  },
  {
    title: '批次流程配置',
    icon: <div className={styles.stepImg}></div>,
    content: '2',
  },
  {
    title: '批次服务配置',
    icon: <div className={styles.stepImg}></div>,
    content: '3',
  },
  {
    title: '批次结果推送',
    icon: <div className={styles.stepImg}></div>,
    content: '4',
  },
];

class BatchTaskConfig extends React.Component {
  state = {
    current: 0, //页数

    msgMappingConfig: [],
    showMsgMappingConfig: [],

    //结果推送
    resPushSet: [],
    showResPushSet: [],
    //文件检查
    fileCheckData: [],
    showFileCheckData: [],
    //文件分片
    fileSplitData: [],
    showFileSplitData: [],
    //联机服务调度
    paramConfig: [],
    showParamConfig: [],
    //文件合并
    btrMergeConfig: [],
    showMergeConfig: [],

    SplitResCreate: [],

    fileTemplConfig: [],
    showFileTemplConfig: [],
    emplyNm: '',
  };

  componentDidMount() {
    this.getTempConf();
    this.getBatchConfigMessage();
    // this.updateBatchConfigMessage();
  }

  //组件卸载后对state进行清除
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  addFileTempl = (fileTemplConfig: any) => {
    addFileTempl({
      stdSvcInd: 'BatchEngineSetupSVC',
      stdIntfcInd: 'addFileTempl',
      data: fileTemplConfig,
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        message.destroy();
        message.success('保存成功');
      }
    });
  };

  //查看/编辑批次任务配置
  getBatchConfigMessage = () => {
    console.log('类型为：', this.props);
    if (typeof this.props.location.query.record == 'object') {
      var record = this.props.location.query.record;
      findBatchConfigMessage({
        stdSvcInd: 'BatchResultSetupSVC',
        stdIntfcInd: 'findBatchConfigMessage',
        data: {
          chnNo: record.chnNo,
          batType: record.batType,
          busCode: record.busCode,
          txnCode: record.busCode,
        },
      }).then(res => {
        if (res && res.sysHead.retCd == '000000') {
          this.props.dispatch({
            type: 'tableList/isClear',
            payload: {
              clearRuleData: res.body.btrClearRuleList,
            },
          });
          this.props.dispatch({
            type: 'tableList/saveViewOrEditData',
            payload: {
              viewOrEditData: res.body,
            },
          });
          this.setState({
            showMsgMappingConfig: res.body.fgrsMsgMappingConfigs,
            showFileCheckData: res.body.btrFileCheckRule,
            showFileSplitData: res.body.btrSplitRule,
            showFileTemplConfig: res.body.btrFileTempl,
            showParamConfig: res.body.btrParamList,
            showResPushSet: res.body.fgrsResultPushConfig,
            showMergeConfig: res.body.btrMergeConfig,
          });
        }
      });
    }
  };

  /**
   * 修改批次任务配置保存接口
   * @param Params 修改后的数据
   */
  updateBatchConfigMessage = (Params: any) => {
    updateBatchConfigMessage({
      stdSvcInd: 'BatchResultSetupSVC',
      stdIntfcInd: 'updateBatchConfigMessage',
      data: Params,
    }).then(res => {
      if (res && res.sysHead.retCd == '000000') {
        console.log('当前的结果为：', res.body);
        message.destroy();
        message.success('修改成功');
        this.props.history.push({
          pathname: '/batchTaskList',
        });
      }
    });
  };

  //获取模板信息
  getTempConf = () => {
    getTempConf({
      stdSvcInd: 'BatchTemplateSVC',
      stdIntfcInd: 'getTempConf',
      data: { tempId: '5000016' },
    }).then(res => {
      this.setState({
        emplyNm: res.localHead.usrBscInf.map.emplyNm,
      });
      console.log(
        '获取代码：',
        res.localHead.usrBscInf.map.emplyNm,
        '目前的：',
        this.props.graphData,
      );
    });
  };
  //保存配置前对数据进行操作

  //保存模板结果
  saveTempConf = () => {
    var fileTemplConfig = {
      ...this.props.param.btrStorageFormData,
      ...this.state.SplitResCreate,
    };
    console.log('this.props.nodes:', this.props);
    //整合节点信息
    if (Object.keys(this.props.graphStepData).length > 0) {
      if (this.props.graphStepData.nodes.length > 0) {
        this.props.graphStepData.nodes.map((item: any) => {
          if (this.props.graphChildData.nodes) {
            this.props.graphChildData.nodes.push(item);
          }
        });
        // this.removeDup(this.props.graphChildData.nodes);
      }
      if (this.props.graphStepData.edges.length > 0) {
        this.props.graphStepData.edges.map((item: any) => {
          if (this.props.graphChildData.edges) {
            this.props.graphChildData.edges.push(item);
          }
        });
        // this.removeDup(this.props.graphChildData.nodes);
      }
    }
    //模板保存所需数据
    const Params = {
      msgMappingConfig: this.state.msgMappingConfig,
      flowRelConfig: this.props.graphData,
      nodeStepRelConfig: this.props.graphChildData,
      stepRelConfig: this.props.graphEndData,
      fileCheckRuleConfig: this.state.fileCheckData,
      splitRuleConfig: this.state.fileSplitData,
      fileTemplConfig: fileTemplConfig,
      paramConfig: this.state.paramConfig,
      btrMergeConfig: this.state.btrMergeConfig,
      resultPushConfig: this.state.resPushSet,
      btrClearMerge:
        this.props.clearRuleData.length > 0
          ? this.props.param.saveClearMerge
          : {},
      //清分规则表
      btrClearRuleList: this.props.param.saveClearRuleList,
      //批次文件列文件-上行文件汇总行（此字段无需配置，前端获取解析数据后自动填充）
      btrFileTotalTempl: this.props.param.btrFileTotalTempl,
      //批次文件传统清分融合字段映射表
      btrTraFileResultTempl:
        this.props.clearRuleData.length > 0
          ? this.props.param.saveTraFileResultData
          : {},
    };
    console.log('Params:', Params);
    saveTempConf({
      stdSvcInd: 'BatchTemplateSVC',
      stdIntfcInd: 'saveTempConf',
      data: Params,
    }).then(res => {
      if (res && res.body && res.sysHead.retCd == '000000') {
        message.destroy();
        message.success('保存成功');
      }
    });
  };

  /**
   * 将节点信息重新组合
   * @param array 对应的存储节点信息数组
   * @param graph 对应的视图数据
   */
  groupNodesInfo = (array: any, graph: any) => {
    if (graph && graph.nodes) {
      for (let i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes) {
          if (graph == this.props.graphEndData) {
            array.push({
              batName: `${this.props.chnNo.value}${this.props.busCode.value}${this.props.batType.value}${this.props.fileType}`,
              stepRank: i,
              stepExeParameter: this.state.paramConfig[0]?.stepExeParameter,
              nodes: graph.nodes,
              edges: graph.edges,
            });
            array.map(item => {
              graph.nodes.map((ele: any, index: any) => {
                if (item.stepRank == index) {
                  item.stepName = ele.id;
                  item.stepDesc = ele.label;
                }
              });
              if (Object.keys(this.props.connectLineInfo).length > 0) {
                item.edges.map(i => {
                  //如果线段的当前节点名称 等于 线段所有信息中的某个节点名称,则给其赋值
                  if (i.target == item.stepName) {
                    item.preStepName = i.source;
                  }
                });
              }
            });
            //判断是否存在模板数据，若有模板数据则依据模板数据,若没有连线关系则为Start
            array.map(item => {
              if (!item.preStepName) {
                item.preStepName = 'Start';
              }
            });
          } else if (graph == this.props.graphData) {
            array.push({
              busCode: this.props.busCode.value,
              chnNo: this.props.chnNo.value,
              batType: this.props.batType.value,
              seqNum: i + 1,
              //修改柜员号
              modTlrNo: this.state.emplyNm,
              //创建柜员号
              crtTlrNo: this.state.emplyNm,
              nodes: graph.nodes,
              edges: graph.edges,
            });
            console.log(
              'this.props.connectLineInfo',
              this.props.connectLineInfo,
            );
          } else {
            array.push({
              busCode: this.props.busCode.value,
              chnNo: this.props.chnNo.value,
              batType: this.props.batType.value,
              seqNum: i + 1,
              nodes: graph.nodes,
              edges: graph.edges,
            });
          }
        }
      }
      //判断节点并替换信息
      array.map(item => {
        if (graph == this.props.graphChildData) {
          graph.nodes.map((ele: any, index: any) => {
            if (item.seqNum == index + 1) {
              item.currentNodeId = ele.parent;
              item.currentNodeName = ele.parentLabel;
              item.currentStepId = ele.id;
            }
          });
        } else if (graph == this.props.graphEndData) {
          graph.nodes.map((ele: any, index: any) => {
            if (item.stepRank == index) {
              item.stepName = ele.id;
              item.stepDesc = ele.label;
            }
          });
        } else {
          graph.nodes.map((ele: any, index: any) => {
            if (item.seqNum == index + 1) {
              item.currentNodeId = ele.id;
              item.currentNodeName = ele.label;
            }
          });
        }
      });
      return array;
    }
  };
  //遍历去重
  removeDup = (arr: any) => {
    var newArr: any = []; //去重结束后存放数据
    for (let item of arr) {
      let flag = true; //判断是否重复
      for (let i of newArr) {
        if (item.id == i.id) {
          flag = false;
        }
      }
      if (flag) {
        newArr.push(item);
      }
    }
    return newArr;
  };
  //保存批次消息配置与模板信息
  saveBatchConfigMessage = () => {
    // 是否放开模板保存 （当要替换节点模板时调用）
    // this.saveTempConf();
    this.child.resPushSetTo();
    setTimeout(() => {
      var fileTemplConfig = {
        ...this.props.param.btrStorageFormData,
        ...this.state.SplitResCreate,
      };
      console.log('this.props.nodes:', this.props);
      if (Object.keys(this.props.graphStepData).length > 0) {
        if (this.props.graphStepData.nodes.length > 0) {
          this.props.graphStepData.nodes.map((item: any) => {
            if (this.props.graphChildData.nodes) {
              this.props.graphChildData.nodes.push(item);
            }
          });
          // this.removeDup(this.props.graphChildData.nodes);
        }
        if (this.props.graphStepData.edges.length > 0) {
          this.props.graphStepData.edges.map((item: any) => {
            if (this.props.graphChildData.edges) {
              this.props.graphChildData.edges.push(item);
            }
          });
          // this.removeDup(this.props.graphChildData.edges);
        }
      }
      var btrFlowRels: any = [];
      var btrNodeStepRels: any = [];
      var btrStepRels: any = [];
      btrFlowRels = this.groupNodesInfo(btrFlowRels, this.props.graphData);
      btrNodeStepRels = this.groupNodesInfo(
        btrNodeStepRels,
        this.props.graphChildData,
      );
      if (btrNodeStepRels) {
        btrNodeStepRels.map((item: any) => {
          if (item.currentNodeId === 'C-FSM') {
            item.seqNum = item.seqNum - 4;
          }
        });
      }
      btrStepRels = this.groupNodesInfo(btrStepRels, this.props.graphEndData);

      //配置表所需要的数据
      const Params = {
        //消息映射配置
        fgrsMsgMappingConfigs: this.state.msgMappingConfig,
        //批次步骤关系表配置
        btrFlowRels: btrFlowRels,
        //节点子步骤
        btrNodeStepRels: btrNodeStepRels?.slice(0, 10),
        //联机服务调度节点
        btrStepRels: btrStepRels,
        //明细文件检查
        btrFileCheckRule: this.state.fileCheckData,
        //明细文件拆分
        btrSplitRule: this.state.fileSplitData,
        //文件模板表
        btrFileTempl: fileTemplConfig,
        //引擎服务调度
        btrParamList: this.state.paramConfig,
        //文件合并
        btrMergeConfig: this.state.btrMergeConfig,
        //结果消息推送表
        fgrsResultPushConfig: this.state.resPushSet,
        //清分容和配置
        btrClearMerge:
          this.props.clearRuleData.length > 0
            ? this.props.param.saveClearMerge
            : {},
        //清分规则表
        btrClearRuleList: this.props.param.saveClearRuleList,
        //批次文件列文件-上行文件汇总行（此字段无需配置，前端获取解析数据后自动填充）
        btrFileTotalTempl: this.props.viewOrEditData?.btrFileTotalTempl
          ? this.props.viewOrEditData?.btrFileTotalTempl
          : this.props.param.btrFileTotalTempl,
        //批次文件传统清分融合字段映射表
        btrTraFileResultTempl:
          this.props.clearRuleData.length > 0
            ? this.props.param.saveTraFileResultData
            : {},
      };
      console.log(
        'Params:',
        Params,
        JSON.stringify(Params),
        'thisprops',
        this.props,
      );
      if (this.props.location.query.type == 'update') {
        this.updateBatchConfigMessage(Params);
      } else {
        saveBatchConfigMessage({
          stdSvcInd: 'BatchResultSetupSVC',
          stdIntfcInd: 'saveBatchConfigMessage',
          data: Params,
        }).then(res => {
          if (res && res.sysHead.retCd == '000000') {
            message.destroy();
            message.success('保存成功');
            this.props.history.push({
              pathname: '/batchTaskList',
            });
          }
        });
      }
    }, 0);
  };
  //消息映射配置
  getMsgMappingConfig = (FormData: any) => {
    console.log('当前的映射配置为', FormData);
    this.setState(
      {
        msgMappingConfig: FormData,
      },
      () => {
        console.log('msgMappingConfig:', this.state.msgMappingConfig);
      },
    );
  };
  //获取文件检查
  getFileCheck = (FormData: any) => {
    console.log(FormData);
    this.setState(
      {
        fileCheckData: FormData,
      },
      () => {
        console.log('fileCheckData:', this.state.fileCheckData);
      },
    );
  };
  //获取文件拆分
  getFileSplit = (FormData: any) => {
    console.log(FormData);
    this.setState(
      {
        fileSplitData: FormData,
      },
      () => {
        console.log('fileSplitData:', this.state.fileSplitData);
      },
    );
  };
  //获取批次引擎调度
  getServerDispatch = (FormData: any) => {
    console.log(FormData);
    this.setState(
      {
        paramConfig: FormData,
      },
      () => {
        console.log('paramConfig:', this.state.paramConfig);
      },
    );
  };
  //获取文件合并
  getBtrMergeConfig = (FormData: any) => {
    console.log(FormData);
    this.setState(
      {
        btrMergeConfig: FormData,
      },
      () => {
        console.log('btrMergeConfig:', this.state.btrMergeConfig);
      },
    );
  };
  //获取结果文件生成
  getSplitResCreate = (FormData: any) => {
    console.log(FormData);
    this.setState(
      {
        SplitResCreate: FormData,
      },
      () => {
        console.log('SplitResCreate:', this.state.SplitResCreate);
      },
    );
  };

  //获取结果文件配置
  getResPushSet = (FormData: any) => {
    console.log(FormData);
    this.setState({
      resPushSet: FormData,
    });
    console.log(this.state.resPushSet);
  };
  //结果推送设置保存
  handleEditOk = async (_e: any) => {
    const FormData = this.state.resPushSet;
    saveResultPush({
      stdSvcInd: 'BatchResultSetupSVC',
      stdIntfcInd: 'saveResultPush',
      data: FormData,
    }).then((res: any) => {
      if (res && res.body && res.sysHead) {
        message.destroy();
        message.success('保存成功');
      }
    });
    console.log(FormData);
  };
  setSkip = (n: any) => {
    this.setState(
      {
        current: n,
      },
      () => {
        this.props.dispatch({
          //dispatch为页面触发model中方法的函数
          type: 'tableList/savePageCurrent', //type：'命名空间/reducer或effects中的方法名'
          payload: {
            current: n,
          },
        });
      },
    );
  };
  //切换
  onChange = current => {
    // this.setState({ current }, () => {
    //   const {current} = this.state
    //   if(current === 1){
    //     try {
    //       this.messageChild.handleAddOk()
    //     } catch (error) {
    //     }
    //   }else if(current ===2){
    //     this.engineChild.handleAddOk()
    //   }else if(current === 3){
    //     this.processChild.handleAddOk()
    //   }
    //   this.props.dispatch({
    //     //dispatch为页面触发model中方法的函数
    //     type: 'tableList/savePageCurrent', //type：'命名空间/reducer或effects中的方法名'
    //     payload: {
    //       current: this.state.current,
    //     },
    //   });
    // })
    // if (this.state.current === 0) {
    //   var status = ''
    //   this.messageChild.handleAddOk().then(res => {
    //     status = res
    //   })
    //   console.log('status', status);
    //   if (status) {
    //     this.setState({
    //       current
    //     }, () => {
    //       this.messageChild.handleAddOk()
    //       this.props.dispatch({
    //         //dispatch为页面触发model中方法的函数
    //         type: 'tableList/savePageCurrent', //type：'命名空间/reducer或effects中的方法名'
    //         payload: {
    //           current: this.state.current,
    //         },
    //       });
    //     })
    //   }
    // }
    // if (current === 2) {
    //   this.setState({
    //     current
    //   }, () => {
    //     this.engineChild.handleAddOk()
    //     this.props.dispatch({
    //       //dispatch为页面触发model中方法的函数
    //       type: 'tableList/savePageCurrent', //type：'命名空间/reducer或effects中的方法名'
    //       payload: {
    //         current: this.state.current,
    //       },
    //     });
    //   })
    // } else if (current === 3) {
    //   this.setState({
    //     current
    //   }, () => {
    //     this.processChild.handleAddOk()
    //     this.props.dispatch({
    //       //dispatch为页面触发model中方法的函数
    //       type: 'tableList/savePageCurrent', //type：'命名空间/reducer或effects中的方法名'
    //       payload: {
    //         current: this.state.current,
    //       },
    //     });
    //   })
    // }
  };

  //绑定批次文件上传子组件
  messageRef = (ref: any) => {
    this.messageChild = ref;
  };
  //绑定批次流程配置子组件
  engineRef = (ref: any) => {
    this.engineChild = ref;
  };

  //绑定批次服务子组件
  processRef = (ref: any) => {
    this.processChild = ref;
  };

  //下一步
  stepNext = () => {
    this.setState({
      current: this.state.current + 1,
    });
  };
  //上一步
  stepPrev = () => {
    this.props.dispatch({
      //dispatch为页面触发model中方法的函数
      type: 'tableList/saveIsDisplay', //type：'命名空间/reducer或effects中的方法名'
      payload: {
        display: false,
      },
    });
    this.setState(
      {
        current: this.state.current - 1,
      },
      () => {
        this.props.dispatch({
          //dispatch为页面触发model中方法的函数
          type: 'tableList/savePageCurrent', //type：'命名空间/reducer或effects中的方法名'
          payload: {
            current: this.state.current,
          },
        });
      },
    );
  };
  render() {
    return (
      // style={{ backgroundColor: '#f1f3fb' }}
      <div className={styles.steps}>
        <Header />
        &nbsp;
        {/* <div>{this.props.location.query.record ? console.log(this.props.location.query.record.chnNo):'不能获取'}</div> */}
        <div className={styles.stepOut}>
          <Steps
            current={this.state.current}
            labelPlacement="vertical"
            onChange={this.onChange}
          >
            {steps.map(item => (
              <Step key={item.title} title={item.title} icon={item.icon} />
            ))}
          </Steps>
        </div>
        <div
          className={styles.stepsContent}
          style={
            this.props.location.query.type == 'view'
              ? { pointerEvents: 'none' }
              : {}
          }
        >
          {this.state.current === 0 && (
            <BatchMessageSet
              onRef={this.messageRef}
              saveMsgMappingConfig={this.getMsgMappingConfig}
              //编辑
              showMsgMappingConfig={this.state.showMsgMappingConfig}
              showFileTemplConfig={this.state.showFileTemplConfig}
              skipToSec={this.setSkip}
            />
          )}
          {this.state.current === 1 && (
            <BatchProcessSet
              onRef={this.processRef}
              saveFileCheck={this.getFileCheck}
              //编辑
              showFileCheck={this.state.showFileCheckData}
              saveFileSplit={this.getFileSplit}
              showFileTemplConfig={this.state.showFileTemplConfig}
              showFileSplit={this.state.showFileSplitData}
              skipToSec={this.setSkip}
            />
          )}
          {this.state.current === 2 && (
            <EngineServerSet
              onRef={this.engineRef}
              saveSplitResCreate={this.getSplitResCreate}
              saveServerDispatch={this.getServerDispatch}
              saveBtrMergeConfig={this.getBtrMergeConfig}
              pageCurrent={this.state.current}
              showFileTemplConfig={this.state.showFileTemplConfig}
              showServerDispatch={this.state.showParamConfig}
              showMergeConfig={this.state.showMergeConfig}
              skipToSec={this.setSkip}
            />
          )}
          {this.state.current === 3 && (
            <ResultPushSet
              onRef={(ref: any) => {
                this.child = ref;
              }}
              saveResPushSet={this.getResPushSet}
              showResPushSet={this.state.showResPushSet}
            />
          )}
        </div>
        <div className={styles.stepsButton}>
          {this.state.current > 0 && (
            <Button
              style={{
                margin: '0 32px',
              }}
              onClick={() => this.stepPrev()}
            >
              上一步
            </Button>
          )}
          {this.state.current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={this.saveBatchConfigMessage}
              disabled={this.props.location.query.type == 'view' ? true : false}
            >
              保存
            </Button>
          )}

          {/* {this.state.current < steps.length - 1 && (
            <Button onClick={() => this.stepNext()}>下一步(待删）</Button>
          )} */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    batType,
    busCode,
    chnNo,
    fileType,
    graphData,
    graphChildData,
    graphEndData,
    graphStepData,
    connectLineInfo,
    clearRuleData,
    param,
    viewOrEditData,
  } = state.tableList;
  return {
    batType,
    busCode,
    chnNo,
    fileType,
    graphData,
    graphChildData,
    graphEndData,
    graphStepData,
    connectLineInfo,
    clearRuleData,
    param,
    viewOrEditData,
  };
}
export default connect(mapStateToProps)(BatchTaskConfig);
