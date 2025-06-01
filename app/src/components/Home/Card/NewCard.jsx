import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const NewsCard = ({ region, source, date, title }) => {
    return (
        <Card className="mb-3" bg="dark" text="white" style={{ minHeight: '200px' }}>
            <Card.Header as="h5">{region}</Card.Header>
            <Card.Body>
                <Card.Title>{source}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{new Date(date).toLocaleString()}</Card.Subtitle>
                <Card.Text>{title}</Card.Text>
                <Button variant="info">Lire</Button>
            </Card.Body>
        </Card>
    );
};

export default NewsCard;
