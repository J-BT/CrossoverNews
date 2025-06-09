import './Footer.scss';
import { useState, useEffect } from 'react';

function Footer({ articles }) {

    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);

            setTimeout(() => {
                setIndex(prev => (prev + 1) % articles.length);
                setVisible(true);
            }, 1000);
        }, 20000);

        return () => clearInterval(interval);
    }, [articles.length]);

    const current = articles[index];

    return (
        <footer className="breaking-news">
            <div className="label">BREAKING<br />NEWS</div>
            <div className="headline">
                <div className={`fade ${visible ? '' : 'hidden'}`}>
                    <div className="left-block">
                        <span className="zone">{current.zone}</span>
                        <span className="source">{current.source} :</span>
                        <time>{current.date}</time>
                    </div>
                    <div className="text">
                        {current.title}
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;