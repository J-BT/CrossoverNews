<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OptionsRequestsController extends AbstractController
{
    #[Route('/api/{req}', name: 'app_options_requests',
    methods: ['OPTIONS'], requirements: ['req' => '^.+$'])]
    public function answerOptions(): Response
    {
        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
