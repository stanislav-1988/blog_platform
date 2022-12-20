/* eslint-disable react/jsx-props-no-spreading */
import classes from './authorization.module.scss';
import SwappiSerwer from '../../swapi_server';
import ArticleList from '../articleList';
import * as action from '../redux/action';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const swapi = new SwappiSerwer();

function Authorization({ history, successfulAuthorization, olState, loginEnteredCorrectly }) {
  const { errorAthorization } = olState;
  const styleError = errorAthorization ? 'authorisation-error' : 'display-none';
  const user = JSON.parse(sessionStorage.getItem('user'));

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  if (user) {
    return <ArticleList />;
  }

  const sendingDataForAuthorization = (e) => {
    const result = {
      user: {
        email: e.login.toLowerCase(),
        password: e.password,
      },
    };
    swapi.authorization(result).then(
      (el) => {
        if (el.errors) {
          successfulAuthorization(true);
          return el;
        }
        sessionStorage.setItem('user', JSON.stringify(el.user));
        loginEnteredCorrectly(true);
        successfulAuthorization(false);
        return el;
      },
      () => {
        history.push('/error');
      }
    );
    reset();
  };

  return (
    <div className={classes['authorization-form']}>
      <span className={classes[`${styleError}`]}>Пользователь не найден! Проверьте введённые данные и повторите!</span>
      <h3>Sign In</h3>
      <form onSubmit={handleSubmit(sendingDataForAuthorization)}>
        <label>Email address</label>
        <input
          type="email"
          {...register('login', {
            required: 'введите емайл',
            pattern: {
              value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,4})+$/,
              message: 'некорректный адрес почты',
            },
          })}
          style={{ borderColor: errors.login && 'red' }}
          placeholder="Email address"
        />
        <div>{errors?.password && <p>{errors?.login?.message || 'Error!'}</p>}</div>
        <label>Password</label>
        <input
          type="password"
          {...register('password', {
            required: true,
            minLength: {
              value: 6,
              message: 'минимальная длинна пароля 6 символов',
            },
            maxLength: {
              value: 40,
              message: 'максимальная длинна пароля 40 символов',
            },
          })}
          placeholder="Password"
        />
        <div>{errors?.password && <p>{errors?.password?.message || 'пароль не введен'}</p>}</div>
        <input className={classes['submit-login']} type="submit" value="Login" />
      </form>
      <span className={classes['registration-link']}>
        Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
      </span>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(withRouter(Authorization));
