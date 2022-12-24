/* eslint-disable react/jsx-props-no-spreading */
import classes from './editProfile.module.scss';
import ServesServer from '../../serves_server';
import * as action from '../redux/action';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const serves = new ServesServer();

function EditProfile({ successfulAuthorization, history, loginEnteredCorrectly, olState }) {
  const { errorAuthorization } = olState;
  const styleError = errorAuthorization ? 'edit-profile-error' : 'display-none';
  const { token } = JSON.parse(sessionStorage.getItem('user'));
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const profileEditRequest = (e) => {
    loginEnteredCorrectly(false);
    const date = {
      user: {
        email: e.email.toLowerCase(),
        password: e.password,
        image: e.photo,
        username: e.login,
      },
    };
    serves.replaceUserData(date, token).then(
      (el) => {
        if (el.errors) {
          successfulAuthorization(true);
          return el;
        }
        sessionStorage.setItem('user', JSON.stringify(el.user));
        loginEnteredCorrectly(true);
        return el;
      },
      () => {
        history.push('/error');
      }
    );
    reset();
  };

  return (
    <div className={classes['editProfile-list']}>
      <span className={classes[`${styleError}`]}>
        Не удалось выполнить запрос, проверьте введенные данные и повторите!
      </span>
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit(profileEditRequest)}>
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
        <label>New password</label>
        <input style={{ borderColor: errors.repeatPassword && 'red' }} type="password" placeholder="Password" />
        <div>{errors?.password && <p>{errors?.password?.message || 'Error!'}</p>}</div>
        <label>Avatar image (url)</label>
        <input
          {...register('photo', {
            required: 'придумайте пароль от 6 до 40 символов',
            pattern: {
              value:
                /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/,
              message: 'некорректный url',
            },
          })}
          style={{ borderColor: errors.repeatPassword && 'red' }}
          type="text"
          placeholder="url photo"
        />
        <div>{errors?.photo && <p>{errors?.photo?.message || 'Error!'}</p>}</div>
        <input className={classes['submit-editProfile']} type="submit" value="Save" />
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(withRouter(EditProfile));
