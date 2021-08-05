import React from 'react';
import GGEditor, { withEditorContext } from 'gg-editor';
import { EditorContextProps } from 'gg-editor/lib/components/EditorContext';
import { connect } from 'umi';
import CommandList from '../../batchDiagram/ggEditor/CommandList';

interface WrappedChildProps extends EditorContextProps {}
class WrappedChildFlow extends React.Component<WrappedChildProps> {
  state = {
    showMainNode: true,
    btrFlowRelsNode: [
      {
        id: 'majorTask',
        type: 'modelRect',
        label: '总控任务节点',
        size: [150, 65],
        logoIcon: {
          height: 36,
          width: 36,
          show: true,
          img: require('@/assets/batchProcessSet/node/allControlTask.svg'),
          x: -75,
        },

        styles: {
          stroke: 'lightblue',
        },
        stateStyles: {
          hover: {},
        },
      },
      {
        id: 'fileDownsplit',
        label: '文件下载拆分',
        type: 'modelRect',
        size: [150, 65],
        logoIcon: {
          height: 36,
          width: 36,
          show: true,
          img: require('@/assets/batchProcessSet/node/FileDownsplit.svg'),
          x: -75,
        },
        styles: {
          stroke: 'lightgreen',
        },
      },
      {
        id: 'onlineServer',
        type: 'modelRect',
        label: '联机服务调度',
        size: [165, 60],
        logoIcon: {
          height: 36,
          width: 36,
          show: true,
          img: require('@/assets/batchProcessSet/node/OnlineServices.svg'),
          x: -75,
        },
      },
      {
        id: 'resMesSort',
        type: 'modelRect',
        label: '结果文件排序',
        size: [150, 65],
        logoIcon: {
          height: 36,
          width: 36,
          show: true,
          img: require('@/assets/batchProcessSet/node/ResultSort.svg'),
          x: -75,
        },
      },
      {
        id: 'resMesPush',
        type: 'modelRect',
        label: '结果消息推送',
        size: [150, 65],
        logoIcon: {
          height: 36,
          width: 36,
          show: true,
          img: require('@/assets/batchProcessSet/node/ResultInfoPush.svg'),
          x: -75,
        },
      },
    ],
    childData: {
      nodes: [],
      //连接节点的边
      edges: [
        // {
        //   label: 'have',
        //   source: 'fileDownsplit',
        //   sourceAnchor: 1,
        //   target: 'fileDown',
        //   targetAnchor: 0,
        // },
      ],
    },
  };
  componentDidMount() {
    console.log('graphChildDataProps', this.props.commandManager);
    const { remove, add } = this.props.commandManager.command;
    if (this.props.graph) {
      this.props.dispatch({
        //dispatch为页面触发model中方法的函数
        type: 'tableList/saveGraphChildData', //type：'命名空间/reducer或effects中的方法名'
        payload: {
          graphChildData: this.props.graph.save(),
        },
      });
      const nodesChild = this.props.graph.save().nodes
        ? this.props.graph.save().nodes
        : [];
      const edgesChild = this.props.graph.save().edges
        ? this.props.graph.save().edges
        : [];
      const childData = {
        nodes: nodesChild,
        edges: edgesChild,
      };
      this.props.saveChildData(childData);
      this.setState({
        childData,
      });
    }
  }
  render() {
    return <></>;
  }
}

function mapStateToProps(state) {
  const { graphChildData } = state.tableList;
  return {
    graphChildData,
  };
}
export default connect(mapStateToProps)(
  withEditorContext<WrappedChildProps, WrappedChildFlow>(WrappedChildFlow),
);
