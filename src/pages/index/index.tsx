import styles from './index.less';
import {PageHeader} from 'antd'

export default function IndexPage() {
  return (
    <div className={styles.pageIndex}>
      <PageHeader className={styles.title}>Page index</PageHeader>
    </div>
  );
}
