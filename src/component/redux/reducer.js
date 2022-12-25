/* eslint-disable indent */
/* eslint-disable default-param-last */
const initState = {
  detailsSelectedArticle: false,
  page: 1,
  articleListSummary: 0,
  errorAuthorization: false,
  loginEntered: false,
  tagsInput: [{ 0: '' }],
  keyTagsNewArticle: 10,
};

function reducer(state = initState, action) {
  switch (action.type) {
    case 'loadingArticle':
      return { ...state, articleListSummary: action.payload };
    case 'changeFavoritedOfArticles':
      return { ...state, articleListSummary: action.payload };
    case 'pageNum':
      return { ...state, page: action.payload };
    case 'slugs':
      return { ...state, detailsSelectedArticle: action.payload };
    case 'successfulAuthorization':
      return { ...state, errorAuthorization: action.payload };
    case 'loginEnteredCorrectly':
      return { ...state, loginEntered: action.payload };
    case 'generatedTagsForNewPost':
      return { ...state, keyTagsNewArticle: state.keyTagsNewArticle + 1, tagsInput: action.payload };
    default:
      return state;
  }
}

export default reducer;
