/* eslint-disable default-param-last */
const initState = {
  detailsSelectedArticle: false,
  page: 1,
  articlListSummary: 0,
  errorAthorization: false,
  loginEntered: false,
  tagsInput: [{ 0: '' }],
  keyTageNewArticl: 10,
};

const reducer = (state = initState, action) => {
  if (action.type === 'loadingArticle') {
    return {
      ...state,
      articlListSummary: action.payload,
    };
  }
  if (action.type === 'changeFavoritedOfArticles') {
    return {
      ...state,
      articlListSummary: action.payload,
    };
  }
  if (action.type === 'pageNum') {
    return {
      ...state,
      page: action.payload,
    };
  }
  if (action.type === 'slugs') {
    return {
      ...state,
      detailsSelectedArticle: action.payload,
    };
  }
  if (action.type === 'successfulAuthorization') {
    return {
      ...state,
      errorAthorization: action.payload,
    };
  }
  if (action.type === 'loginEnteredCorrectly') {
    return {
      ...state,
      loginEntered: action.payload,
    };
  }
  if (action.type === 'generatedTagsForNewPost') {
    return {
      ...state,
      keyTageNewArticl: state.keyTageNewArticl + 1,
      tagsInput: action.payload,
    };
  }
  return state;
};

export default reducer;
