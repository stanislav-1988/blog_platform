import classes from './articleList.module.scss';
import OfError from '../Error/error';
import ServesServer from '../../serves_server';
import * as action from '../redux/action';
import Loader from '../Loader/loader';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Pagination, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';

const serves = new ServesServer();

function ArticleList({ history, olState, loadingArticle, changeFavoritedOfArticles, pageNum }) {
  const { articleListSummary, page, errors } = olState;
  let arrFavoriteArticles = false;
  if (JSON.parse(sessionStorage.getItem('user'))) {
    const { username } = JSON.parse(sessionStorage.getItem('user'));
    arrFavoriteArticles = JSON.parse(localStorage.getItem(JSON.stringify(username)));
  }

  useEffect(() => {
    try {
      serves.gettingArticles(page).then((el) => {
        const key = Object.keys(el);
        if (key[0] === 'articles') {
          loadingArticle(el.articles);
        } else {
          message.error(el.body);
        }
      });
    } catch (e) {
      history.push('/error');
    }
  }, [history, loadingArticle, page]);

  const pagination = (val) => {
    try {
      pageNum(val);
      loadingArticle(0);
      serves.gettingArticles(val).then((el) => {
        loadingArticle(el.articles);
      });
    } catch (e) {
      history.push('/error');
    }
  };

  if (errors) {
    return <OfError />;
  }

  if (articleListSummary === 0) {
    return <Loader />;
  }

  const favoriteArticle = (favorited, slug, index) => {
    if (!sessionStorage.getItem('user')) {
      history.push('/sign-in');
      return;
    }
    const { token, username } = JSON.parse(sessionStorage.getItem('user'));

    if (favorited) {
      serves.favoriteDeleting(slug, token).then(
        (el) => {
          const newArr = [...articleListSummary.slice(0, index), el.article, ...articleListSummary.slice(index + 1)];
          changeFavoritedOfArticles(newArr);
        },
        (error) => {
          message.error(error);
        }
      );
      const newArr = arrFavoriteArticles.filter((el) => el !== slug);
      localStorage.setItem(JSON.stringify(username), JSON.stringify(newArr));
    } else {
      serves.articleFavorite(slug, token).then(
        (el) => {
          const newArr = [...articleListSummary.slice(0, index), el.article, ...articleListSummary.slice(index + 1)];
          changeFavoritedOfArticles(newArr);
        },
        (error) => {
          message.error(error);
        }
      );
      arrFavoriteArticles.push(slug);
      localStorage.setItem(JSON.stringify(username), JSON.stringify(arrFavoriteArticles));
    }
  };

  const item = articleListSummary.map((el, index) => {
    const { title, author, createdAt, favoritesCount, tagList, slug } = el;
    const favorited = arrFavoriteArticles ? arrFavoriteArticles.includes(slug) : false;
    const styleLaik = favorited ? 'notLaik' : 'laik';
    const avatar = author.image ? author.image : 'https://static.productionready.io/images/smiley-cyrus.jpg';
    const tags = tagList.map((oneTag, i) => {
      return (
        <div key={`${oneTag}${i + 1}`} className={classes.teg_list}>
          {oneTag}
        </div>
      );
    });
    const date = format(new Date(createdAt), 'MMMM d, yyyy');

    return (
      <div key={`${slug}${index + 1}`} className={classes['article-list']}>
        <div className={classes['content-list_header']}>
          <div className={classes['article-list_left_header']}>
            <div className={classes['article-title_container']}>
              <Link to={`/articl/${slug}`} className={classes['article-title']}>
                {title}
              </Link>
              <input
                value=""
                onClick={() => favoriteArticle(favorited, slug, index)}
                type="submit"
                className={classes[`${styleLaik}`]}
              />
              <span>{favoritesCount}</span>
            </div>
            <div className={classes['content-list_teg']}>{tags}</div>
          </div>
          <div className={classes['article-list_right_header']}>
            <div className={classes['author-name']}>
              <h5>{author.username}</h5>
              <div className={classes['publication-date']}>{date}</div>
            </div>
            <div className={classes['authors_profile_picture-container']}>
              <img src={`${avatar}`} alt="author" />
            </div>
          </div>
        </div>
        <div className={classes['content-list_main']}>
          <div>
            <p>{slug}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div>{item}</div>
      <div className={classes['pagination-container']}>
        <Pagination onChange={pagination} defaultCurrent={page} total={1750} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(withRouter(ArticleList));
