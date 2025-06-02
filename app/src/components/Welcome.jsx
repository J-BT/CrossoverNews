import React, { useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import RootStore from '../RootStore';
import digitalWorld from '../assets/digital-world.png';

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

  const backgroundStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${digitalWorld})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '2rem',
    color: 'white',
  };

  const headerStyle = {
    color: '#00ccff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2.5rem',
  };

  const cardHeaderStyle = {
    color: '#00ccff',
    fontWeight: 'bold',
    textAlign: 'center',
  };


  return (
    <div style={backgroundStyle}>
      <Row>
        <Col>
          <div style={headerStyle}>CROSSOVER NEWS</div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        {articles.map((entry, index) => {
          const data = entry.data;
          const article = data.content?.[0];
          if (!article) return null;

          return (
            <Col key={index} xs={12} sm={6} md={4} lg={2} className="mb-4">
              <Card bg="dark" text="light" className="h-100 rounded shadow" style={{ border: '1px solid #00ccff' }}>
                <Card.Header style={cardHeaderStyle}>{data.zone}</Card.Header>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="text-info">{data.source}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.8rem' }}>
                      {new Date(article.date).toLocaleString()}
                    </Card.Subtitle>
                    <Card.Text style={{ fontSize: '0.85rem' }}>{article.title}</Card.Text>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-info"
                      size="sm"
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LIRE
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default observer(Welcome);
