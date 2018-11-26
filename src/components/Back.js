import React from "react";
import { withRouter } from "react-router-dom";
import styles from 'shared/Board.module.css';

const Back = ({ history }) => (
    <button type="button" onClick={history.goBack} className={styles.backBtn}>Back</button>
);

export default withRouter(Back);