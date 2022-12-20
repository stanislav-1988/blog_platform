import classes from './article.module.scss';
import * as action from '../redux/action';
import SwappiSerwer from '../../swapi_server';
import Loader from '../loader/loader';
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { withRouter, Link } from 'react-router-dom';
import { message, Popconfirm } from 'antd';

const swapi = new SwappiSerwer();

function Article({ generatedTagsForNewPost, history, match, olState, slugStatus }) {
  const { detailsSelectedArticle } = olState;
  const user = JSON.parse(sessionStorage.getItem('user'));

  const id = match.params.slugs;
  useEffect(() => {
    slugStatus(false);
    try {
      swapi.gettinOneArticles(id).then(
        (el) => {
          slugStatus(el.article);
        },
        (error) => {
          message.error(error);
        }
      );
    } catch (e) {
      message.error(e);
      history.push('/error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (detailsSelectedArticle === false) {
    return <Loader />;
  }

  const { slug, favorited } = detailsSelectedArticle;
  const styleLaik = favorited ? 'laik' : 'notLaik';

  const confirmDeletionArticl = () => {
    const { token } = JSON.parse(sessionStorage.getItem('user'));
    message.success('Click on Yes');
    swapi.articleDeleting(id, token).then(
      () => {
        message.success('article deleted successfully!!!');
      },
      (error) => {
        message.error(error);
        history.push('/error');
      }
    );
    history.push('/articl');
  };

  const { favoritesCount } = detailsSelectedArticle;

  const arrayTagsLoadedArticl = () => {
    const newArr = [];
    detailsSelectedArticle.tagList.forEach((tag, index) => {
      newArr.push({ [index]: tag });
    });
    generatedTagsForNewPost(newArr);
  };

  // eslint-disable-next-line no-nested-ternary
  const articleOwnershipCheck = user
    ? detailsSelectedArticle.author.username === user.username
      ? ''
      : 'hidden'
    : 'hidden';

  const tage = detailsSelectedArticle.tagList.map((oneTag, index) => {
    return (
      <div key={`${oneTag}${index + 1}`} className={classes.teg_list}>
        {oneTag}
      </div>
    );
  });

  const favoriteArticle = () => {
    if (!sessionStorage.getItem('user')) {
      history.push('/sign-in');
      return;
    }

    const { token } = JSON.parse(sessionStorage.getItem('user'));
    if (favorited) {
      swapi.favoriteDeleting(slug, token).then(
        (el) => {
          slugStatus(el.article);
        },
        (error) => {
          message.error(error);
        }
      );
    } else {
      swapi.articleFavorite(slug, token).then(
        (el) => {
          slugStatus(el.article);
        },
        (error) => {
          message.error(error);
        }
      );
    }
  };

  const date = format(new Date(detailsSelectedArticle.createdAt), 'MMMM d, yyyy');

  return (
    <div className={classes['article-detail']}>
      <div className={classes['content-list_header']}>
        <div className={classes['article-list_left_header']}>
          <div className={classes['article-title_conteiner']}>
            <h5 className={classes['article-title']}>{detailsSelectedArticle.title}</h5>
            <input value="" onClick={favoriteArticle} type="submit" className={classes[`${styleLaik}`]} />
            <span>{favoritesCount}</span>
          </div>
          <div className={classes['content-list_tegs']}>{tage}</div>
        </div>
        <div className={classes['article-list_right_header']}>
          <div className={classes['authir-name']}>
            <h5>{detailsSelectedArticle.author.username}</h5>
            <div className={classes['publication-date']}>{date}</div>
          </div>
          <div className={classes['authors_profile_picture-conteiner']}>
            <img src={`${detailsSelectedArticle.author.image}`} alt="author" />
          </div>
        </div>
      </div>
      <div className={classes['content-list_main']}>
        <div className={classes['slug-articl']}>
          <p>{detailsSelectedArticle.slug}</p>
        </div>
        <div style={{ visibility: articleOwnershipCheck }} className={classes['button-articl']}>
          <Popconfirm
            title="Are you sure to delete this task?"
            placement="rightTop"
            onConfirm={confirmDeletionArticl}
            okText="Yes"
            cancelText="No"
          >
            <button className={classes['button-delete-articl']} type="button">
              Delete
            </button>
          </Popconfirm>
          <Link
            onClick={arrayTagsLoadedArticl}
            to={`/articl/${detailsSelectedArticle.slug}/edit`}
            className={classes['link-edit-articl']}
          >
            Edit
          </Link>
        </div>
      </div>
      <div className={classes['article-detail-content']}>
        <ReactMarkdown>{detailsSelectedArticle.body}</ReactMarkdown>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(withRouter(Article));
