import classes from './article.module.scss';
import * as action from '../redux/action';
import ServesServer from '../../serves_server';
import Loader from '../Loader/loader';
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { withRouter, Link } from 'react-router-dom';
import { message, Popconfirm } from 'antd';

const serves = new ServesServer();

function Article({ generatedTagsForNewPost, history, match, olState, slugStatus }) {
  const { detailsSelectedArticle } = olState;
  const user = JSON.parse(sessionStorage.getItem('user'));
  let arrFavoriteArticles = false;
  if (JSON.parse(sessionStorage.getItem('user'))) {
    const { username } = JSON.parse(sessionStorage.getItem('user'));
    arrFavoriteArticles = JSON.parse(localStorage.getItem(JSON.stringify(username)));
  }

  const id = match.params.slugs;

  useEffect(() => {
    slugStatus(false);
    try {
      serves.gettingOneArticles(id).then(
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

  const { slug } = detailsSelectedArticle;
  const favorited = arrFavoriteArticles ? arrFavoriteArticles.includes(slug) : false;
  const styleLaic = favorited ? 'laik' : 'notLaik';

  const confirmDeletionArticle = () => {
    const { token } = JSON.parse(sessionStorage.getItem('user'));
    message.success('Click on Yes');
    serves.articleDeleting(id, token).then(
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

  const arrayTagsLoadedArticle = () => {
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

  const tags = detailsSelectedArticle.tagList.map((oneTag, index) => {
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

    const { token, username } = JSON.parse(sessionStorage.getItem('user'));

    if (favorited) {
      serves.favoriteDeleting(slug, token).then(
        (el) => {
          slugStatus(el.article);
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
          slugStatus(el.article);
        },
        (error) => {
          message.error(error);
        }
      );
      arrFavoriteArticles.push(slug);
      localStorage.setItem(JSON.stringify(username), JSON.stringify(arrFavoriteArticles));
    }
  };

  const date = format(new Date(detailsSelectedArticle.createdAt), 'MMMM d, yyyy');

  return (
    <div className={classes['article-detail']}>
      <div className={classes['content-list_header']}>
        <div className={classes['article-list_left_header']}>
          <div className={classes['article-title_container']}>
            <h5 className={classes['article-title']}>{detailsSelectedArticle.title}</h5>
            <input value="" onClick={favoriteArticle} type="submit" className={classes[`${styleLaic}`]} />
            <span>{favoritesCount}</span>
          </div>
          <div className={classes['content-list_teg']}>{tags}</div>
        </div>
        <div className={classes['article-list_right_header']}>
          <div className={classes['author-name']}>
            <h5>{detailsSelectedArticle.author.username}</h5>
            <div className={classes['publication-date']}>{date}</div>
          </div>
          <div className={classes['authors_profile_picture-container']}>
            <img
              src={detailsSelectedArticle.author.image}
              onError={(e) => {
                e.target.src = 'https://static.productionready.io/images/smiley-cyrus.jpg';
              }}
              alt="author"
            />
          </div>
        </div>
      </div>
      <div className={classes['content-list_main']}>
        <div className={classes['slug-article']}>
          <p>{detailsSelectedArticle.slug}</p>
        </div>
        <div style={{ visibility: articleOwnershipCheck }} className={classes['button-article']}>
          <Popconfirm
            title="Are you sure to delete this task?"
            placement="rightTop"
            onConfirm={confirmDeletionArticle}
            okText="Yes"
            cancelText="No"
          >
            <button className={classes['button-delete-article']} type="button">
              Delete
            </button>
          </Popconfirm>
          <Link
            onClick={arrayTagsLoadedArticle}
            to={`/articl/${detailsSelectedArticle.slug}/edit`}
            className={classes['link-edit-article']}
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
