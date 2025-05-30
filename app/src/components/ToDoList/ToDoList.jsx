import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import TdlElement from './TdlElement';
import TdlEditingElement from './TdlEditingElement';
import RootStore from '../../RootStore';

/**
 * Intérêt pédagogique : injection de multiples store, affichage de composants conditionnel,
 * state et effect hook.
 */
function ToDoList({ listName, canHaveExtraArgs }) {
  const { mainstore, errorstore } = useContext(RootStore);
  const [isEditing, setEdit] = useState(false);
  const [idEntryEditing, setIdEntryEditing] = useState(-1);
  const list = mainstore[listName];

  const createNewEntry = (content, dueDate, extraArgs) => list
    .addEntry(content, dueDate, extraArgs)
    .then(() => { setEdit(false); })
    .catch((e) => errorstore.register(e, 'Erreur réseau'));

  const updateEntry = (entry, newContent, newDueDate, newExtraArgs) => list
    .updateEntry(entry.id, newContent, newDueDate, newExtraArgs)
    .then(() => { setEdit(false); })
    .catch((e) => errorstore.register(e, 'Erreur réseau'));

  const deleteEntry = (entry) => list
    .deleteEntry(entry)
    .catch((e) => errorstore.register(e, 'Erreur réseau'));

  useEffect(() => {
    if (!list.entries) {
      list.loadEntries();
    }
  });

  return (
    <>
      <Row>
        <Col>
          <Alert variant="info">
            <Alert.Heading>{mainstore.getListName(listName)}</Alert.Heading>
          </Alert>
        </Col>
      </Row>
      {
        !list.entries ? (
          <Row>
            <Col>
              Loading...
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <ListGroup>
                {isEditing && idEntryEditing === -1
                  ? (
                    <TdlEditingElement
                      canHaveExtraArgs={canHaveExtraArgs}
                      onCancel={() => setEdit(false)}
                      onValidate={createNewEntry}
                    />
                  )
                  : (
                    <ListGroup.Item
                      variant="secondary"
                      action
                      onClick={() => { setEdit(true); setIdEntryEditing(-1); }}
                    >
                      Nouvelle entrée
                    </ListGroup.Item>
                  )}
                {list.entries.map((entry) => (
                  <ListGroup.Item key={entry.id}>
                    {
                      isEditing && idEntryEditing === entry.id
                        ? (
                          <TdlEditingElement
                            canHaveExtraArgs={canHaveExtraArgs}
                            onCancel={() => setEdit(false)}
                            onValidate={(c, dd, ea) => updateEntry(entry, c, dd, ea)}
                            entryModel={entry.data}
                          />
                        )
                        : (
                          <TdlElement
                            entry={entry.data}
                            onDelete={() => deleteEntry(entry)}
                            onEdit={() => { setEdit(true); setIdEntryEditing(entry.id); }}
                          />
                        )
                    }
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )
      }
    </>
  );
}

ToDoList.propTypes = {
  listName: PropTypes.string.isRequired,
  canHaveExtraArgs: PropTypes.bool,
};

ToDoList.defaultProps = {
  canHaveExtraArgs: false,
};

export default observer(ToDoList);
