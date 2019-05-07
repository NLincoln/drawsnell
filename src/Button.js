import React from 'react';
import MuiButton from '@material-ui/core/Button';
import styles from './button.module.css';

export default function Button(props) {
  return <MuiButton {...props} className={`${styles.button} ${styles.buttonContained}`} />
}
