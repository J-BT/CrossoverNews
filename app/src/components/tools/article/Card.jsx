
import './Card.scss';

function Card({ zone, source, articles }) {
    return (
        <article className="card">
            <h2>{zone.toUpperCase()}</h2>
            {/* <h3>{source}</h3>  */}
            <div className="card-content-wrapper">
                {articles.map((article, index) => (
                    <div className="card-content" key={index}>
                        <h3>{source}</h3>
                        <div className='time-container'>
                            <time>{article.date}</time>
                        </div>
                        <p>{article.title}</p>
                        <div className='btn-container'>
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-read"
                            >
                                Lire
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
}

export default Card;
