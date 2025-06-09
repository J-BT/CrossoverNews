
import { useEffect, useState } from 'react';
import './Home.scss'
import Header from '../tools/header/Header';
import Card from '../tools/article/Card';
import Footer from '../tools/footer/Footer';
import exampleArticles from '../../../src/if-no-backend/example-articles-too-big.json';

function Home() {
    const [articles, setArticles] = useState([]);
    const [groupedArticles, setGroupedArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        FetchArticles(`${__API_PROD__}/articles`, exampleArticles,
            setArticles, setGroupedArticles, setIsLoading, setError);

    }, []);

    console.log(`${__API_PROD__}/articles`);

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur : {error.message}</div>;


    return (
        <div className="app">
            <Header />
            <strong>
                {!__USE_API__ ? '__USE_API__ inactif — JSON local' : ''}
            </strong>
            <main className="main-content">
                <section className="news-cards">
                    {groupedArticles.map((group, index) => (
                        <Card key={index} {...group} />
                    ))}
                </section>
            </main>
            <Footer articles={articles} />
        </div>
    );
}

export default Home;


/************************* Private Methods**************************/
/*******************************************************************/

function FetchArticles(apiUrl, exampleData,
    setArticles, setGroupedArticles, setIsLoading, setError
) {
    if (__USE_API__) {
        fetch(apiUrl)
            .then((res) => {
                if (!res.ok) throw new Error('Erreur API');
                return res.json();
            })
            .then((data) => {

                let articles = GetArticlesDetails(data);
                setGroupedArticles(articles.grouped);
                setArticles(articles.flat);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Erreur lors du fetch:', err);
                setError(err);
                setIsLoading(false);
            });
    } else {

        let articles = GetArticlesDetails(exampleData);
        setGroupedArticles(articles.grouped);
        setArticles(articles.flat);
        setIsLoading(false);
    }
}


function GetArticlesDetails(articles) {
    const grouped = articles.map(item => ({
        zone: item.zone,
        source: item.source,
        articles: item.content.map(article => ({
            title: article.title,
            date: article.date.replace(/\s\+\d{4}$/, ''),
            link: article.link
        }))
    }));

    const flat = articles.flatMap(item =>
        item.content.map(article => ({
            zone: item.zone,
            source: item.source,
            title: article.title,
            date: article.date.replace(/\s\+\d{4}$/, ''),
            link: article.link
        }))
    );

    return { 'grouped': grouped, 'flat': flat }

}