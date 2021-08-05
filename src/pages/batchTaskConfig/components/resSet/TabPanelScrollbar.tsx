import React from 'react';
import styles from './index.less';

function TabPanelScrollbar(props: any) {
  return <div className={styles.tabPanelScrollbar}>{props.children}</div>;
}

export default TabPanelScrollbar;
