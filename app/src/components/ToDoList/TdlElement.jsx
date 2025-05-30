import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { getEntryExtraArgs } from '../../model/EnhancedToDoList';

function TdlElement({ entry, onDelete, onEdit }) {
  const extraArgs = getEntryExtraArgs(entry);
  return (
    <Row>
      <Col>
        <Button className="mr-4 mr-sm-2" variant="success" size="sm" onClick={onDelete}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
        <span>{entry.content}</span>
        {entry.dueDate && (
          <small className="d-block">
            Pour le :&nbsp;
            {entry.dueDate}
          </small>
        )}
      </Col>
      {extraArgs && (
        <Col>
          <ul>
            {extraArgs.map(([eaName, eaValue], idx) => (
              <li key={idx /* eslint-disable-line react/no-array-index-key */}>
                {eaName}
                {' '}
                :
                {' '}
                {eaValue}
              </li>
            ))}
          </ul>
        </Col>
      )}
      <Col className="text-right">
        <Button variant="primary" size="sm" onClick={onEdit}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </Col>
    </Row>
  );
}

TdlElement.propTypes = {
  entry: PropTypes.shape({
    content: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TdlElement;
