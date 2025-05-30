import React, { useContext } from 'react';
import { observer } from 'mobx-react';
// import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import RootStore from '../../RootStore';

function LoadingIcon() {
  const { netstore } = useContext(RootStore);
  return netstore.hasFetchInProgess && (
  <FontAwesomeIcon icon={faSpinner} className="text-success" pulse />
  );
}

export default observer(LoadingIcon);
