import React from 'react';
import upperFirst from 'lodash/upperFirst';
import { Tooltip, Tag } from 'antd';
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
import { Command, constants } from 'gg-editor';
import styles from './ggEditor.less';
const { EditorCommand } = constants;

const FLOW_COMMAND_LIST = [
  EditorCommand.Undo, //撤销命令
  EditorCommand.Redo, //还原
  EditorCommand.Copy, //复制
  EditorCommand.Paste, //粘贴
  EditorCommand.Remove, //删除
  EditorCommand.ZoomIn, //放大
  EditorCommand.ZoomOut, //缩小
  EditorCommand.Topic,
];

class CommandList extends React.Component {
  render() {
    return (
      <>
        <div className={styles.toolbar}>
          <Command
            key={EditorCommand.Undo}
            name={EditorCommand.Undo}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'撤销'}>
              <UndoOutlined />
            </Tooltip>
          </Command>
          <Command
            key={EditorCommand.Redo}
            name={EditorCommand.Redo}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'还原'}>
              <RedoOutlined />
            </Tooltip>
          </Command>
          <Command
            key={EditorCommand.Copy}
            name={EditorCommand.Copy}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'复制'}>
              <CopyOutlined />
            </Tooltip>
          </Command>
          <Command
            key={EditorCommand.Paste}
            name={EditorCommand.Paste}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'粘贴'}>
              <SnippetsOutlined />
            </Tooltip>
          </Command>
          <Command
            key={EditorCommand.Remove}
            name={EditorCommand.Remove}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'删除'}>
              <DeleteOutlined />
            </Tooltip>
          </Command>
          <Command
            key={EditorCommand.ZoomIn}
            name={EditorCommand.ZoomIn}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'放大'}>
              <ZoomInOutlined />
            </Tooltip>
          </Command>
          <Command
            key={EditorCommand.ZoomOut}
            name={EditorCommand.ZoomOut}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'缩小'}>
              <ZoomOutOutlined />
            </Tooltip>
          </Command>
          {/* <Command
            key={EditorCommand.Update}
            name={EditorCommand.Update}
            className={styles.command}
            disabledClassName={styles.commandDisabled}
          >
            <Tooltip title={'主节点双击进入对应子节点，子节点单击进入配置项'}>
              
            </Tooltip>
          </Command> */}
          <Tooltip
            title={'( 提示：请双击进入对应子节点，子节点单击进入配置项 )'}
          >
            <span className={styles.help}>
              ( 提示：请双击进入对应子节点，子节点单击进入配置项 )
            </span>
          </Tooltip>
        </div>
      </>
    );
  }
}

export default CommandList;
