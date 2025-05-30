import { ToDoListManager } from './model/ToDoListManager';
import { ErrorManager } from './model/ErrorManager';
import { NetworkManager } from './model/NetworkManager';

const STORE = {
  mainstore: new ToDoListManager(),
  errorstore: new ErrorManager(),
  netstore: new NetworkManager(),
};

export default STORE;
