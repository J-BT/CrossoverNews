import React, { useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import RootStore from '../RootStore';

function Welcome() {
  const { articlestore } = useContext(RootStore);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const load = async () => {
      await articlestore.loadEntries();
      setArticles(articlestore.entries || []);
    };
    load();
  }, [articlestore]);

  return (
    <>
      <Row>
        <Col>
          <Alert variant="info">
            <Alert.Heading>Bienvenue sur Crossover News</Alert.Heading>
          </Alert>
        </Col>
      </Row>

      <Row>
        {articles.map((entry, index) => {
          const data = entry.data;
          const article = data.content?.[0];
          if (!article) return null;

          return (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card bg="dark" text="white" style={{ height: '100%' }}>
                <Card.Header>{data.zone}</Card.Header>
                <Card.Body>
                  <Card.Title>{data.source}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(article.date).toLocaleString()}
                  </Card.Subtitle>
                  <Card.Text>{article.title}</Card.Text>
                  <Button
                    variant="info"
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lire
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export default observer(Welcome);
