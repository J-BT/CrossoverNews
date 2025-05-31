<?php

namespace App\Service;

use SimpleXMLElement;
use Exception;
use App\Models\Media;

class RssService
{
    ## Attributes & Accessors
    private array $worldFeeds = [];
    private array $localFeeds = [];

    ## Constructor
    public function __construct()
    {
        $this->worldFeeds = [
            new Media('Euronews', 'EU', 'World', 'https://fr.euronews.com/rss?format=mrss&level=theme&name=news'),
            new Media('NHK', 'Japan', 'World', 'https://www.nhk.or.jp/rss/news/cat6.xml'),
            new Media('Fox News', 'USA', 'World', 'https://moxie.foxnews.com/google-publisher/world.xml'),
            new Media('CBC News', 'Canada', 'World', 'https://www.cbc.ca/webfeed/rss/rss-world'),
            new Media('G1 Globo', 'Brazil', 'World', 'https://g1.globo.com/rss/g1/mundo/'),
            // new Media('CGTN', 'China', 'World', 'https://www.cgtn.com/subscribe/rss/section/world.xml'),
            // new Media('The Times of India', 'India', 'World', 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms'),
            // new Media('RNZ', 'New Zealand', 'World', 'https://www.rnz.co.nz/rss/world.xml'),
            // new Media('The East African', 'Kenya', 'World', 'https://www.theeastafrican.co.ke/rss.xml'),
            // new Media('Al Jazeera', 'Qatar', 'World', 'https://www.aljazeera.com/xml/rss/all.xml'),
            // new Media('Ukrainska Pravda', 'Ukraine', 'World', 'https://www.pravda.com.ua/eng/rss/view_news/'),
            // new Media('The Moscow Times', 'Russia', 'World', 'https://www.themoscowtimes.com/rss/news'),
        ];


        $this->localFeeds = [
            new Media('Euronews', 'EU', 'Local', 'https://fr.euronews.com/rss?format=mrss&level=vertical&name=my-europe'),
            new Media('NHK', 'Japan', 'Local', 'https://www.nhk.or.jp/rss/news/cat0.xml'),
            new Media('Fox News', 'USA', 'Local', 'https://moxie.foxnews.com/google-publisher/us.xml'),
            new Media('CBC News', 'Canada', 'Local', 'https://www.cbc.ca/webfeed/rss/rss-canada'),
            new Media('G1 Globo', 'Brazil', 'Local', 'https://g1.globo.com/rss/g1/brasil/'),
            new Media('CGTN', 'China', 'Local', 'https://www.cgtn.com/subscribe/rss/section/china.xml'),
            new Media('The Times of India', 'India', 'Local', 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms'),
            new Media('RNZ', 'New Zealand', 'Local', 'https://www.rnz.co.nz/rss/national.xml'),
        ];
    }

    ## Methods
    public function fetchAllArticles(): array
    {
        $groupedArticles = [];

        $allFeeds = $this->worldFeeds;
        // $allFeeds = array_merge($this->worldFeeds, $this->localFeeds);

        foreach ($allFeeds as $media) {
            try {
                $rss = @simplexml_load_file($media->url, 'SimpleXMLElement', LIBXML_NOCDATA);

                if ($rss === false || !isset($rss->channel->item)) {
                    continue;
                }

                $articles = [];

                foreach ($rss->channel->item as $item) {
                    $articles[] = [
                        'title' => (string) $item->title,
                        'link' => (string) $item->link,
                        'date' => date(DATE_RFC2822, strtotime((string) $item->pubDate)),
                    ];
                }

                $groupedArticles[] = [
                    'source' => "{$media->name}[{$media->category}]",
                    'zone' => $media->zone,
                    'content' => $articles,
                ];

            } catch (Throwable $e) {
                $groupedArticles = [ 
                    'errorType' => get_class($e), 
                    'message' => $e->getMessage()
                ];
                continue;
            }
        }

        return $groupedArticles;
    }
}