import classes from './error.module.scss';
import React from 'react';

function OfError() {
  return (
    <div className={classes['error-conteiner']}>
      <span>ОШИБКА ЗАГРУЗКИ!!!</span>
      <p>Проверьте соединение с интернетом и повторите запрос!</p>
    </div>
  );
}

export default OfError;
