import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import GGEditor, { withEditorContext } from 'gg-editor';
import { EditorContextProps } from 'gg-editor/lib/components/EditorContext';
import { connect } from 'umi';

interface WrappedEndProps extends EditorContextProps {}
class WrappedEndFlow extends React.Component<WrappedEndProps> {
  state = {
    showMainNode: true,
    endData: {
      nodes: [],
      //连接节点的边
      edges: [],
    },
  };
  componentDidMount() {
    console.log('graphEndDataProps', this.props.commandManager);
    const { remove, add } = this.props.commandManager.command;
    if (this.props.graph) {
      console.log('endData', this.props.graph);

      this.props.dispatch({
        //dispatch为页面触发model中方法的函数
        type: 'tableList/saveGraphEndData', //type：'命名空间/reducer或effects中的方法名'
        payload: {
          graphEndData: this.props.graph.save(),
        },
      });
      const nodesEnd = this.props.graph.save().nodes
        ? this.props.graph.save().nodes
        : [];
      const edgesEnd = this.props.graph.save().edges
        ? this.props.graph.save().edges
        : [];
      const endData = {
        nodes: nodesEnd,
        edges: edgesEnd,
      };
      this.props.saveEndData(endData);
      this.setState({
        endData,
      });
    }
  }
  render() {
    return <></>;
  }
}

function mapStateToProps(state) {
  const { graphEndData } = state.tableList;
  return {
    graphEndData,
  };
}
export default connect(mapStateToProps)(
  withEditorContext<WrappedEndProps, WrappedEndFlow>(WrappedEndFlow),
);
