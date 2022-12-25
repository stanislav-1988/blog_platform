import classes from './app.module.scss';
import Header from '../Header';
import Authorization from '../Authorization';
import CreateNewArticle from '../CreateNewArticle';
import Registration from '../Registration';
import EditProfile from '../EitProfile';
import ArticleList from '../ArticleList';
import Article from '../Article';
import OfError from '../Error/error';

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
