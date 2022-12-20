import classes from './articleList.module.scss';
import OfError from '../error/error';
import SwappiSerwer from '../../swapi_server';
import * as action from '../redux/action';
import Loader from '../loader/loader';
import { format } from 'date-fns';
import { useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { Pagination, message } from 'antd';
import { Link, withRouter } from 'react-router-dom';

const swapi = new SwappiSerwer();

function ArticleList({ history, olState, loadingArticle, changeFavoritedOfArticles, pageNum }) {
  const { articlListSummary, page, errors } = olState;

  useLayoutEffect(() => {
    try {
      swapi.gettinArticles(page).then((el) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pagination = (val) => {
    try {
      pageNum(val);
      loadingArticle(0);
      swapi.gettinArticles(val).then((el) => {
        loadingArticle(el.articles);
      });
    } catch (e) {
      history.push('/error');
    }
  };

  if (errors) {
    return <OfError />;
  }

  if (articlListSummary === 0) {
    return <Loader />;
  }

  const favoriteArticle = (favorited, slug, index) => {
    if (!sessionStorage.getItem('user')) {
      history.push('/sign-in');
      return;
    }

    const { token } = JSON.parse(sessionStorage.getItem('user'));
    if (favorited) {
      swapi.favoriteDeleting(slug, token).then(
        (el) => {
          const newArr = [...articlListSummary.slice(0, index), el.article, ...articlListSummary.slice(index + 1)];
          changeFavoritedOfArticles(newArr);
        },
        (error) => {
          message.error(error);
        }
      );
    } else {
      swapi.articleFavorite(slug, token).then(
        (el) => {
          const newArr = [...articlListSummary.slice(0, index), el.article, ...articlListSummary.slice(index + 1)];
          changeFavoritedOfArticles(newArr);
        },
        (error) => {
          message.error(error);
        }
      );
    }
  };

  const item = articlListSummary.map((el, index) => {
    const { title, author, createdAt, favorited, favoritesCount, tagList, slug } = el;
    const styleLaik = favorited ? 'notLaik' : 'laik';
    const tage = tagList.map((oneTag, i) => {
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
            <div className={classes['article-title_conteiner']}>
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
            <div className={classes['content-list_tegs']}>{tage}</div>
          </div>
          <div className={classes['article-list_right_header']}>
            <div className={classes['authir-name']}>
              <h5>{author.username}</h5>
              <div className={classes['publication-date']}>{date}</div>
            </div>
            <div className={classes['authors_profile_picture-conteiner']}>
              <img src={`${author.image}`} alt="author" />
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
      <div className={classes['pagination-conteiner']}>
        <Pagination onChange={pagination} defaultCurrent={page} total={50} />
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
