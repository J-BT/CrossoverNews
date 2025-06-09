
// import './Home.scss'
// import Header from '../tools/header/Header';
// import Card from '../tools/article/Card';
// import Footer from '../tools/footer/Footer';
// import exampleArticles from '../../../src/if-no-backend/example-articles-too-big.json';

// function Home() {

//     const articles = exampleArticles.flatMap(item =>
//         item.content.map(article => ({
//             zone: item.zone,
//             source: item.source,
//             title: article.title,
//             date: article.date.replace(/\s\+\d{4}$/, ''),
//             link: article.link
//         }))
//     );
//     return (
//         <div className="app">
//             <Header />
//             <main className="main-content">
//                 <section className="news-cards">
//                     {articles.map((article, index) => (
//                         <Card key={index} {...article} />
//                     ))}

//                 </section>
//             </main>
//             <Footer articles={articles} />
//         </div>
//     );
// }

// export default Home;


import './Home.scss'
import Header from '../tools/header/Header';
import Card from '../tools/article/Card';
import Footer from '../tools/footer/Footer';
import exampleArticles from '../../../src/if-no-backend/example-articles-too-big.json';

function Home() {
    const groupedArticles = exampleArticles.map(item => ({
        zone: item.zone,
        source: item.source,
        articles: item.content.map(article => ({
            title: article.title,
            date: article.date.replace(/\s\+\d{4}$/, ''),
            link: article.link
        }))
    }));

    const articles = exampleArticles.flatMap(item =>
        item.content.map(article => ({
            zone: item.zone,
            source: item.source,
            title: article.title,
            date: article.date.replace(/\s\+\d{4}$/, ''),
            link: article.link
        }))
    );

    return (
        <div className="app">
            <Header />
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
