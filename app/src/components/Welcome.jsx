import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function Welcome() {
  return (
    <Row>
      <Col>
        <Alert variant="info">
          <Alert.Heading>Bienvenue !</Alert.Heading>
        </Alert>
      </Col>
    </Row>
  );
}

export default Welcome;
