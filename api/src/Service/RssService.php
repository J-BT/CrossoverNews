<?php

namespace App\Service;

use SimpleXMLElement;
use Exception;

class RssService
{
    // Tableau associatif avec source => URL RSS
    private array $feeds = [
        'Euronews' => 'https://fr.euronews.com/rss?format=mrss&level=theme&name=news',
        'NHK' => 'https://www.nhk.or.jp/rss/news/cat0.xml',
        'Fox News' => 'https://moxie.foxnews.com/google-publisher/world.xml',
        // ➕ ajoute d’autres sources ici
    ];

    public function fetchAllArticles(): array
    {
        $articles = [];

        foreach ($this->feeds as $source => $url) {
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