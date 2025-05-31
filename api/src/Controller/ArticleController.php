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
    // private RssService
    # Constructors

    # Methods

    #[Route('/api/articles', name: 'app_article_get', methods:['GET'])]
    public function getAll(): Response
    {
        try {
            return $this->json([
                'message' => '日本語が読めるかな？　出来たら、APIの開発が開発し始める。',
                'path' => 'src/Controller/ArticleController.php',
            ], Response::HTTP_OK, [
                'Content-Type' => 'application/json; charset=utf-8'
            ]);
            // $json = json_encode([
            //     'message' => 'OK OK',
            //     'path' => 'src/Controller/ArticleController.php',
            // ]);

            // return new Response($json, Response::HTTP_OK, [
            //     'content-type' => 'application/json'
            // ]);
        } catch (Throwable $e) {
            return $this->json([
            'errorType' => get_class($e),
            'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
