import React from 'react';
import styles from './index.less';
import people from '../../../assets/common/people.png';
import newImg from '../../../assets/common/new.svg';
import close from '../../../assets/common/banner-close.png';
import { Row, Col } from 'antd';

class Header extends React.Component {
  state = {
    showHeader: 'block',
  };
  render() {
    return (
      <div style={{ display: this.state.showHeader }} className={styles.header}>
        <div className={styles.box}>
          <img
            src={close}
            className={styles.closeImg}
            onClick={() => {
              this.setState({ showHeader: 'none' });
            }}
          />
          <div className={styles.col1}>
            <img src={newImg} />
            <h1 className={styles.h1}>批转联可视化1.2</h1>
          </div>

          <div className={styles.col2}>
            <h3 className={styles.h3}> 新一代数字银行应用技术平台——操作指南</h3>
          </div>
          <img src={people} className={styles.peopleImg} />
        </div>
      </div>
    );
  }
}
export default Header;
