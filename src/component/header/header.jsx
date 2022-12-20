import classes from './header.module.scss';
import * as action from '../redux/action';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Header({ olState, loginEnteredCorrectly }) {
  const { loginEntered } = olState;
  const user = JSON.parse(sessionStorage.getItem('user'));

  const logOut = () => {
    loginEnteredCorrectly(false);
    sessionStorage.clear();
  };

  if (loginEntered || user) {
    return (
      <div className={classes['header-conteiner']}>
        <Link to="/articl">
          <h3>Realworld Blog</h3>
        </Link>
        <div className={classes['create-article']}>
          <Link to="/new-article">Create article</Link>
        </div>
        <Link to="/profile" className={classes['header_name-user']}>
          <h6>{`${user.username}`}</h6>
          <img src={user.image} alt="alt" />
        </Link>
        <div className={classes['log-out']}>
          <Link to="/sign-in" onClick={logOut}>
            Log Out
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className={classes['header-conteiner']}>
      <Link to="/articl">
        <h3>Realworld Blog</h3>
      </Link>
      <div className={classes['sign-in']}>
        <Link to="/sign-in">Sign In</Link>
      </div>
      <div className={classes['sign-up']}>
        <Link to="/sign-up">Sign Up</Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(Header);
