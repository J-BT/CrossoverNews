import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Alert from 'react-bootstrap/Alert';
import RootStore from '../../RootStore';

import style from './ErrorList.scss';

/**
 * Intérêt pédagogique : portal & manipulation d'une classe CSS en pure JS.
 */
function ErrorListInt({ errors, remove }) {
  return (
    <aside className={style.ErrorList}>
      {errors.map((error, idx) => (
        <Alert
          key={idx /* eslint-disable-line react/no-array-index-key */}
          variant="danger"
          onClose={() => remove(idx)}
          dismissible
        >
          {error.title ? (
            <>
              <Alert.Heading>{error.title}</Alert.Heading>
              <p>{error.content}</p>
            </>
          ) : <p>{error.content}</p>}
        </Alert>
      ))}
    </aside>
  );
}

ErrorListInt.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  remove: PropTypes.func.isRequired,
};

function ErrorList() {
  const { errorstore } = useContext(RootStore);

  return errorstore.hasAny && createPortal(<ErrorListInt />, document.body);
}

export default observer(ErrorList);
