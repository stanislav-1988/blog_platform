import classes from './app.module.scss';
import Header from '../header';
import Authorization from '../authorization';
import CreateNewArticle from '../createNewArticle/createNewArticle';
import Registration from '../registration/registration';
import EditProfile from '../editProfile/editProfile';
import ArticleList from '../articleList/articleList';
import Article from '../article/article';
import OfError from '../error/error';

import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <div className={classes.body}>
      <Router>
        <Header />
        <Route path="/" exact component={ArticleList} />
        <Route path="/sign-in" component={Authorization} />
        <Route path="/sign-up" component={Registration} />
        <Route path="/profile" component={EditProfile} />
        <Route path="/new-article" component={CreateNewArticle} />
        <Route path="/articl" exact component={ArticleList} />
        <Route
          exact
          path="/articl/:slugs"
          render={({ match }) => {
            return <Article match={match} />;
          }}
        />
        <Route
          path="/articl/:slugs/edit"
          render={({ match }) => {
            return <CreateNewArticle match={match} />;
          }}
        />
        <Route path="/error" component={OfError} />
      </Router>
    </div>
  );
}

export default App;
