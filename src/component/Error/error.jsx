import classes from './error.module.scss';
import React from 'react';

function OfError(title = 'ОШИБКА ЗАГРУЗКИ!!!', text = 'Проверьте соединение с интернетом и повторите запрос!') {
  return (
    <div className={classes['error-container']}>
      <span>{title}</span>
      <p>{text}</p>
    </div>
  );
}

export default OfError;
