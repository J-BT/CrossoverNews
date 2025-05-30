import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndoAlt, faSave, faPlus, faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { getEntryExtraArgs } from '../../model/EnhancedToDoList';

/**
 * Intérêt pédagogique : utilisation des state hook.
 */
function TdlEditingElement({
  onCancel, onValidate, canHaveExtraArgs, entryModel,
}) {
  const [content, setContent] = useState(entryModel && entryModel.content ? entryModel.content : '');
  const [dueDate, setDueDate] = useState(entryModel && entryModel.dueDate ? entryModel.dueDate : '');
  const [extraArgs, setExtraArgs] = useState(canHaveExtraArgs && entryModel
    ? getEntryExtraArgs(entryModel) : []);

  const handleSubmit = (evt) => {
    const form = evt.currentTarget;
    evt.preventDefault();
    evt.stopPropagation();
    if (form.checkValidity() === true) {
      if (canHaveExtraArgs && extraArgs) {
        onValidate(content, dueDate, extraArgs);
      } else {
        onValidate(content, dueDate);
      }
    }
  };

  const allExtraArgsFullfilled = () => !extraArgs.some((ea) => !(ea[0] && ea[1]));

  const addExtraArgs = () => {
    if (allExtraArgsFullfilled()) {
      setExtraArgs([...extraArgs, ['', '']]);
    }
  };

  const setExtraArg = (idx, name, value) => {
    setExtraArgs([...extraArgs.slice(0, idx), [name, value], ...extraArgs.slice(idx + 1)]);
  };

  const removeExtraArg = (idx) => {
    setExtraArgs([...extraArgs.slice(0, idx), ...extraArgs.slice(idx + 1)]);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="my-1">
        <Col>
          <Form.Label htmlFor="contentNewEntry">
            Contenu
          </Form.Label>
          <Form.Control
            required
            type="text"
            id="contentNewEntry"
            placeholder="Me couper les cheveux"
            value={content}
            onChange={(evt) => setContent(evt.target.value)}
          />
        </Col>
        <Col>
          <Form.Label htmlFor="dueDateNewEntry">
            Date
          </Form.Label>
          <Form.Control
            type="date"
            id="dueDateNewEntry"
            value={dueDate}
            onChange={(evt) => setDueDate(evt.target.value)}
          />
        </Col>
        <Col>
          <Button type="submit">
            <FontAwesomeIcon icon={faSave} />
          </Button>
        </Col>
        <Col className="text-right">
          <Button variant="secondary" onClick={onCancel}>
            <FontAwesomeIcon icon={faUndoAlt} />
          </Button>
        </Col>
      </Row>
      {canHaveExtraArgs && (
        <>
          {extraArgs.map((ea, idx) => (
            <Row
              className="my-1"
              key={idx /* eslint-disable-line react/no-array-index-key */}
            >
              <Col>
                <Form.Label htmlFor={`extraArg${idx}NameNewEntry`}>
                  Nom de propriété
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  id={`extraArg${idx}NameNewEntry`}
                  placeholder="Nom"
                  value={ea[0]}
                  onChange={(evt) => setExtraArg(idx, evt.target.value, ea[1])}
                  size="sm"
                />
              </Col>
              <Col>
                <Form.Label htmlFor={`extraArg${idx}ValueNewEntry`}>
                  Valeur de propriété
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  id={`extraArg${idx}ValueNewEntry`}
                  placeholder="Valeur"
                  value={ea[1]}
                  onChange={(evt) => setExtraArg(idx, ea[0], evt.target.value)}
                  size="sm"
                />
              </Col>
              <Col>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => removeExtraArg(idx)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
              </Col>
            </Row>
          ))}
          <Row className="my-1">
            <Col>
              <Button
                variant="success"
                size="sm"
                onClick={addExtraArgs}
                disabled={!allExtraArgsFullfilled()}
              >
                <FontAwesomeIcon icon={faPlus} />
                {' '}
                <small>Ajouter une propriété</small>
              </Button>
            </Col>
          </Row>
        </>
      ) }
    </Form>
  );
}

TdlEditingElement.defaultProps = {
  entryModel: null,
};

TdlEditingElement.propTypes = {
  canHaveExtraArgs: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  entryModel: PropTypes.shape({
    content: PropTypes.string,
    dueDate: PropTypes.string,
  }),
};

export default TdlEditingElement;
