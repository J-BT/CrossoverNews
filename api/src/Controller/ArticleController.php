<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\RssService;

class ArticleController extends AbstractController
{
    # Attributes & Accessors
    private RssService $rssService;

    # Constructors
    public function __construct(RssService $rssService){
        $this->rssService = $rssService;
    }
    
    # Methods

    #[Route('/api/articles', name: 'app_article_get', methods:['GET'])]
    public function getAll(): Response
    {
        try {
            $articles = $this->rssService->fetchAllArticles();

            return $this->json($articles, Response::HTTP_OK, [
                'Content-Type' => 'application/json; charset=utf-8'
            ]);

        } catch (Throwable $e) {
            return $this->json([
            'errorType' => get_class($e),
            'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
