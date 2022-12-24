/* eslint-disable react/jsx-props-no-spreading */
import classes from './createNewArticle.module.scss';
import ServesServer from '../../serves_server';
import * as action from '../redux/action';
import Authorization from '../Authorization';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

const serves = new ServesServer();

function CreateNewArticle({ history, olState, match, generatedTagsForNewPost }) {
  const { tagsInput, keyTagsNewArticle, detailsSelectedArticle } = olState;
  const editingArticle = match.params.slugs;
  const nameComponent = editingArticle ? 'Edit article' : 'Create new article';
  const title = editingArticle ? detailsSelectedArticle.title : '';
  const description = editingArticle ? detailsSelectedArticle.description : '';
  const body = editingArticle ? detailsSelectedArticle.body : '';
  const { slug } = detailsSelectedArticle;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
  });

  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user) {
    return <Authorization />;
  }

  function submitArticle(e) {
    const { token } = JSON.parse(sessionStorage.getItem('user'));
    const tags = [];
    tagsInput.map((el) => tags.push(Object.values(el)[0]));
    const date = {
      article: {
        title: e.title,
        description: e.description,
        body: e.body,
        tagList: tags,
      },
    };
    if (!editingArticle) {
      serves.articlePublication(date, token).then(
        () => {
          message.success('article successfully publication!!!');
        },
        (error) => {
          message.error(error);
          history.push('/error');
        }
      );
    }
    if (editingArticle) {
      serves.articleEditing(date, token, slug).then(
        () => {
          message.success('article successfully edited!!!');
        },
        (error) => {
          message.error(error);
          history.push('/error');
        }
      );
    }
    reset();
    generatedTagsForNewPost([{ [keyTagsNewArticle]: '' }]);
    history.push('/articl');
  }

  const deleteTeg = (key) => {
    const newArr = [...tagsInput.slice(0, key), ...tagsInput.slice(key + 1)];
    generatedTagsForNewPost(newArr);
  };

  const item = tagsInput.map((el, index) => {
    const key = Object.keys(el);
    return (
      <div key={`inp${index + 1}`} className={classes['form-one-tag']}>
        <input
          {...register(`teg ${key}`, {
            required: true,
          })}
          className={classes['form-one-tag_input-text']}
          type="text"
          defaultValue={el[key]}
          onChange={(e) => {
            const newArr = [...tagsInput.slice(0, index), { [key]: e.target.value }, ...tagsInput.slice(index + 1)];
            generatedTagsForNewPost(newArr);
          }}
        />
        <button onClick={() => deleteTeg(index)} className={classes['form-one-tag_delete']} type="button">
          Delete
        </button>
      </div>
    );
  });

  const addTeg = (e) => {
    e.preventDefault();
    const newArr = [...tagsInput, { [keyTagsNewArticle]: '' }];
    generatedTagsForNewPost(newArr);
  };

  return (
    <main className={classes['createNewArticle-list']}>
      <div className={classes.title}>
        <h3>{nameComponent}</h3>
      </div>
      <form onSubmit={handleSubmit(submitArticle)}>
        <label htmlFor="titleCreateArticl">Title</label>
        <input
          {...register('title', {
            required: 'Введите заголовок',
            minLength: {
              value: 3,
              message: 'минимальная длинна заголовка 3 символа',
            },
            maxLength: {
              value: 20,
              message: 'максимальная длинна заголовка 20 символов',
            },
          })}
          id="titleCreateArticl"
          defaultValue={title}
          type="text"
          placeholder="Title"
        />
        <div>{errors?.title && <p>{errors?.title?.message || 'Error!'}</p>}</div>
        <label htmlFor="shortDescriptionCreateArticl">Short description</label>
        <input
          {...register('description', {
            required: 'Введите краткое описания',
            minLength: {
              value: 3,
              message: 'минимальная длинна описания 3 символа',
            },
            maxLength: {
              value: 40,
              message: 'максимальная длинна описания 40 символов',
            },
          })}
          id="shortDescriptionCreateArticl"
          defaultValue={description}
          type="text"
          placeholder="Short description"
        />
        <div>{errors?.description && <p>{errors?.description?.message || 'Error!'}</p>}</div>
        <label htmlFor="textareaCreateArticle">Text</label>
        <textarea
          {...register('body', {
            required: 'Введите текст',
            minLength: {
              value: 20,
              message: 'минимальная длинна текста 20 символов',
            },
          })}
          id="textareaCreateArticle"
          defaultValue={body}
          placeholder="Text"
          rows="6"
        />
        <div>{errors?.body && <p>{errors?.body?.message || 'Error!'}</p>}</div>
        <label>Tags</label>
        <div className={classes['tag-conteiner']}>
          <div>{item}</div>
          <button onClick={addTeg} className={classes['form-one-tag_add-teg']} type="submit">
            Add teg
          </button>
        </div>
        <input className={classes['createNewArticle-list_send']} type="submit" value="Send" />
      </form>
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    olState: state,
  };
};

export default connect(mapStateToProps, action)(withRouter(CreateNewArticle));
