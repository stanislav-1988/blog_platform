/* eslint-disable react/jsx-props-no-spreading */
import classes from './registration.module.scss';
import SwappiSerwer from '../../swapi_server';
import * as action from '../redux/action';
import { useForm } from 'react-hook-form';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const swapi = new SwappiSerwer();

function Registration({ history, successfulAuthorization, olState }) {
  const { errorAthorization } = olState;
  const styleregist = errorAthorization ? 'registration-error' : 'display-none';
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const registrationData = (e) => {
    const result = {
      user: {
        username: e.login,
        email: e.email.toLowerCase(),
        password: e.password,
      },
    };
    swapi.registration(result).then(
      (el) => {
        if (el.errors) {
          successfulAuthorization(true);
          return el;
        }
        history.push('/sign-in');
        reset();
        return el;
      },
      () => {
        history.push('/error');
      }
    );
  };
  return (
    <div className={classes['registration-list']}>
      <div className={classes['registration-form']}>
        <div className={classes[`${styleregist}`]}>Пользователь с такой почтой уже зарегестрирован!</div>
        <h3>Create new account</h3>
        <form onSubmit={handleSubmit(registrationData)}>
          <label>Username</label>
          <input
            {...register('login', {
              required: 'придумайте логин',
              minLength: {
                value: 3,
                message: 'минимальная длинна логина 3 символов',
              },
              maxLength: {
                value: 20,
                message: 'максимальная длинна логина 20 символов',
              },
            })}
            style={{ borderColor: errors.login && 'red' }}
            type="text"
            placeholder="Username"
          />
          <div>{errors?.login && <p>{errors?.login?.message || 'Error!'}</p>}</div>
          <label>Email address</label>
          <input
            {...register('email', {
              required: 'введите корректный адрес',
              pattern: {
                value: /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,4})+$/,
                message: 'некорректный адрес почты',
              },
            })}
            style={{ borderColor: errors.email && 'red' }}
            type="email"
            placeholder="Email address"
          />
          <div>{errors?.email && <p>{errors?.email?.message || 'Error!'}</p>}</div>
          <label>Password</label>
          <input
            {...register('password', {
              required: 'придумайте пароль от 6 до 40 символов',
              minLength: {
                value: 6,
                message: 'минимальная длинна пароля 6 символов',
              },
              maxLength: {
                value: 40,
                message: 'максимальная длинна пароля 40 символов',
              },
            })}
            style={{ borderColor: errors.repeadPassword && 'red' }}
            type="password"
            placeholder="Password"
          />
          <div>
            {errors?.repeadPassword && <p>{errors?.repeadPassword.validate?.message || 'пароли не совпадают'}</p>}
          </div>
          <div>{errors?.password && <p>{errors?.password?.message || 'Error!'}</p>}</div>
          <label>Repeat Password</label>
          <input
            {...register('repeadPassword', {
              required: 'повторите пароль',
              minLength: {
                value: 6,
                message: 'минимальная длинна пароля 6 символов',
              },
              maxLength: {
                value: 40,
                message: 'максимальная длинна пароля 40 символов',
              },
              validate: (value) => value === watch('password') || 'пароли не совпадают',
            })}
            style={{ borderColor: errors.repeadPassword && 'red' }}
            type="password"
            placeholder="Repead Password"
          />
          <div>{errors?.repeadPassword && <p>{errors?.repeadPassword?.message || 'Error!'}</p>}</div>
          <div className={classes['agreement-conteiner']}>
            <input
              {...register('checkbox', {
                required: true,
              })}
              style={{ color: errors.checkbox && 'red' }}
              id="agreement"
              className={classes.agreement}
              type="checkbox"
              placeholder="Repeat Password"
            />
            <label htmlFor="agreement">I agree to the processing of my personal information</label>
          </div>
          <div>{errors?.checkbox && <p>необходимо дать согласие!</p>}</div>
          <input className={classes['submit-create']} type="submit" value="Create" />
        </form>
        <span className={classes['registration-link']}>
          Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
        </span>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(withRouter(Registration));
