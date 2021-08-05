import React from 'react';
import { Tooltip, Tag, Menu } from 'antd';
import {
  UndoOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
  DeleteOutlined,
  CopyOutlined,
  RedoOutlined,
  SnippetsOutlined,
  QuestionCircleTwoTone,
} from '@ant-design/icons';
import { Command, constants, ContextMenu } from 'gg-editor';
import styles from './ggEditor.less';
const { EditorCommand } = constants;

class NodeContextMenu extends React.Component {
  render() {
    return (
      <>
        {/* 节点右键菜单 */}
        <ContextMenu
          type="node"
          renderContent={(item, position, hide) => {
            const { x: left, y: top } = position;
            return (
              <div style={{ position: 'absolute', top, left }}>
                <Menu mode="vertical" selectable={false} onClick={hide}>
                  <Menu.Item>
                    <Command
                      key={EditorCommand.Remove}
                      name={EditorCommand.Remove}
                      className={styles.command}
                      disabledClassName={styles.commandDisabled}
                    >
                      <DeleteOutlined />
                      删除
                    </Command>
                  </Menu.Item>
                  <Menu.Item>
                    <Command
                      key={EditorCommand.Copy}
                      name={EditorCommand.Copy}
                      className={styles.command}
                      disabledClassName={styles.commandDisabled}
                    >
                      <CopyOutlined />
                      复制
                    </Command>
                  </Menu.Item>
                </Menu>
              </div>
            );
          }}
        ></ContextMenu>
        {/* 画布右键菜单 */}
        <ContextMenu
          renderContent={(item, position, hide) => {
            const { x: left, y: top } = position;
            return (
              <div style={{ position: 'absolute', top, left }}>
                <Menu mode="vertical" selectable={false} onClick={hide}>
                  <Menu.Item>
                    <Command
                      key={EditorCommand.Undo}
                      name={EditorCommand.Undo}
                      className={styles.command}
                      disabledClassName={styles.commandDisabled}
                    >
                      <UndoOutlined />
                      撤销
                    </Command>
                  </Menu.Item>
                  <Menu.Item>
                    <Command
                      key={EditorCommand.Redo}
                      name={EditorCommand.Redo}
                      className={styles.command}
                      disabledClassName={styles.commandDisabled}
                    >
                      <RedoOutlined />
                      还原
                    </Command>
                  </Menu.Item>
                  <Menu.Item>
                    <Command
                      key={EditorCommand.PasteHere}
                      name={EditorCommand.PasteHere}
                      className={styles.command}
                      disabledClassName={styles.commandDisabled}
                    >
                      <SnippetsOutlined /> 粘贴到这里
                    </Command>
                  </Menu.Item>
                </Menu>
              </div>
            );
          }}
        ></ContextMenu>
      </>
    );
  }
}

export default NodeContextMenu;
