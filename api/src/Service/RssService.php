<?php

namespace App\Service;

use SimpleXMLElement;
use Exception;

class RssService
{
    private array $worldFeeds = [
        //Euronews
        'Euronews[World]' => 'https://fr.euronews.com/rss?format=mrss&level=theme&name=news',
        // NHK
        'NHK[World]' => 'https://www.nhk.or.jp/rss/news/cat6.xml',
        //Fox News
        'Fox News[World]' => 'https://moxie.foxnews.com/google-publisher/world.xml',
        //CBC News
        'CBC News[World]' => 'https://www.cbc.ca/webfeed/rss/rss-world',
        //G1 Globo
        'G1 Globo[World]' => 'https://g1.globo.com/rss/g1/mundo/',
        //CGTN
        'CGTN[World]' => 'https://www.cgtn.com/subscribe/rss/section/world.xml',
        //The Times of India
        'The Times of India[World]' => 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
        //RNZ
        'RNZ[World]' => 'https://www.rnz.co.nz/rss/world.xml',
        //The East African
        'The East African[World]' => 'https://www.theeastafrican.co.ke/rss.xml',
        //Al Jazeera
        'Al Jazeera[World]' => 'https://www.aljazeera.com/xml/rss/all.xml',
        //Ukrainska Pravda
        'Ukrainska Pravda[World]' => 'https://www.pravda.com.ua/eng/rss/view_news/',
        //The Moscow Times
        'The Moscow Times[World]' => 'https://www.themoscowtimes.com/rss/news',
    ];

        private array $localFeeds = [
        //Euronews
        'Euronews[Local]' => 'https://fr.euronews.com/rss?format=mrss&level=vertical&name=my-europe',
        // NHK
        'NHK[Local]' => 'https://www.nhk.or.jp/rss/news/cat0.xml',
        //Fox News
        'Fox News[Local]' => 'https://moxie.foxnews.com/google-publisher/us.xml',
        //CBC News
        'CBC News[Local]' => 'https://www.cbc.ca/webfeed/rss/rss-canada',
        //G1 Globo
        'G1 Globo[Local]' => 'https://g1.globo.com/rss/g1/brasil/',
        //CGTN
        'CGTN[Local]' => 'https://www.cgtn.com/subscribe/rss/section/china.xml',
        //The Times of India
        'The Times of India[Local]' => 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
        //RNZ
        'RNZ[Local]' => 'https://www.rnz.co.nz/rss/national.xml',
    ];


    public function fetchAllArticles(): array
    {
        $articles = [];

        foreach ($this->worldFeeds as $source => $url) {
            try {
                $rss = simplexml_load_file($url, 'SimpleXMLElement', LIBXML_NOCDATA);

                if ($rss === false || !isset($rss->channel->item)) {
                    continue;
                }

                foreach ($rss->channel->item as $item) {
                    $articles[] = [
                        'title' => (string) $item->title,
                        'link' => (string) $item->link,
                        'source' => $source,
                        'date' => date(DATE_RFC2822, strtotime((string) $item->pubDate)),
                    ];
                }
            } catch (Exception $e) {
                // Tu peux logguer l'erreur ici avec Monolog plus tard
                continue;
            }
        }

        return $articles;
    }
}