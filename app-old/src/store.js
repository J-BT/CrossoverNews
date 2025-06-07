import { ToDoListManager } from './model/ToDoListManager';
import { ErrorManager } from './model/ErrorManager';
import { NetworkManager } from './model/NetworkManager';
import { ArticleList } from './model/ArticleList';

const STORE = {
  mainstore: new ToDoListManager(),
  errorstore: new ErrorManager(),
  netstore: new NetworkManager(),
  articlestore: new ArticleList(`${APP_ENV.API_EP_URI}/articles`)
};

export default STORE;
