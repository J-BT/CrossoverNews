/* eslint-disable react/static-property-placement */
import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Alert from 'react-bootstrap/Alert';
import RootStore from '../../RootStore';

/**
 * Intérêt pédagogique : Gestion des erreurs de composants ; vision "classe" d'un composant
 */
class ComponentErrorHandler extends React.Component {
  static contextType = RootStore;

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    children: [],
  };

  constructor(props) {
    super(props);
    this.state = { errorCaught: false };
  }

  static getDerivedStateFromError(error) {
    return {
      errorCaught: true,
      error,
    };
  }

  componentDidCatch(error) {
    const { errorstore } = this.context;
    errorstore.register(error, 'Erreur d\'interface', () => {
      this.setState({ errorCaught: false });
    });
  }

  render() {
    const { errorCaught } = this.state;
    const { children } = this.props;
    return errorCaught ? (
      <Alert variant="danger">
        Erreur d&lsquo;interface !
      </Alert>
    ) : children;
  }
}

export default observer(ComponentErrorHandler);
