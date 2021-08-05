import React from 'react';
import { Card, Row, Col, Menu } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import GGEditor, { withEditorContext } from 'gg-editor';
import { EditorContextProps } from 'gg-editor/lib/components/EditorContext';
import { connect } from 'umi';

interface WrappedStepProps extends EditorContextProps {}
class WrappedStepFlow extends React.Component<WrappedStepProps> {
  state = {
    showMainNode: true,
    stepData: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
  };
  componentDidMount() {
    console.log('graphChildDataProps', this.props.commandManager);
    const { remove, add } = this.props.commandManager.command;
    if (this.props.graph) {
      console.log('stepData', this.props.graph);
      this.props.dispatch({
        //dispatch为页面触发model中方法的函数
        type: 'tableList/saveGraphStepData', //type：'命名空间/reducer或effects中的方法名'
        payload: {
          graphStepData: this.props.graph.save(),
        },
      });
      const nodesStep = this.props.graph.save().nodes
        ? this.props.graph.save().nodes
        : [];
      const edgesStep = this.props.graph.save().edges
        ? this.props.graph.save().edges
        : [];
      const stepData = {
        nodes: nodesStep,
        edges: edgesStep,
      };
      this.props.saveStepData(stepData);
      this.setState({
        stepData,
      });
    }
  }
  render() {
    return <></>;
  }
}

function mapStateToProps(state) {
  const { graphStepData } = state.tableList;
  return {
    graphStepData,
  };
}
export default connect(mapStateToProps)(
  withEditorContext<WrappedStepProps, WrappedStepFlow>(WrappedStepFlow),
);
