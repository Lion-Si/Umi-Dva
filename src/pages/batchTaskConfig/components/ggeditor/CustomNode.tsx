import React from 'react';
import { RegisterNode, setAnchorPointsState } from 'gg-editor';
import styles from './ggEditor.less';

class CustomNode extends React.Component {
  render() {
    return (
      <RegisterNode
        //自定义节点的命名
        name="customInternalNode"
        config={{
          setState(name: any, value: any, item: any) {
            const group = item.getContainer();
            const shape = group.get('children')[0]; //根据绘制（draw）时确定
            //选中节点时的状态,状态有selected（选中），active（活跃）等
            if (name === 'selected') {
              console.log(value);

              if (value) {
                shape.attr({
                  fill: '#3f67ed',
                  stroke: '#29BECE',
                  opacity: 1,
                });
              } else {
                shape.attr({
                  fill: '#3f67ed',
                  opacity: 0.7,
                  stroke: 'rgba(41,190,206,.5)',
                });
              }
            }

            //设置描点状态
            setAnchorPointsState.call(
              this,
              name,
              value,
              item,
              (item, anchorPoint) => {
                const { width, height } = item.getKeyShape().getBBox();
                console.log(item.getKeyShape());
                const [x, y] = anchorPoint;
                return {
                  x: width * x - width / 2,
                  y: height * y - height / 2,
                };
              },
              (item, anchorPoint) => {
                const { width, height } = item.getKeyShape().getBBox();
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
              wrapperStyle: {
                fill: '#29088A', //节点最外层边框填充的颜色
              },
              contentStyle: {
                fill: '#FA8C16', //节点内容区域填充的颜色
              },
              labelStyle: {
                fill: '#00FF80', //节点内部文案颜色
              },
            };
          },
          //拿到节点
          getAnchorPoints() {
            return [
              // [0.5, 0],//上边中点
              // [0.5, 1],//下边中点
              [0, 0.5], //左边中点
              [1, 0.5], //右边中点
            ];
          },

          //当前状态
          getStyle(item: any) {
            return {
              fill: '#FA8C16',
              //节点边颜色
              stroke: '#FA8C16',
            };
          },
          getActivedStyle(item: any) {
            return {
              fill: '#29088A',
              //节点边颜色
              stroke: '#29088A',
            };
          },
          getSelectedStyle(item: any) {
            return {
              fill: '#29088A',
              //节点边颜色
              stroke: '#29088A',
            };
          },
        }}
        //需要继承的节点设置
        extend="modelRect"
      />
    );
  }
}

export default CustomNode;
