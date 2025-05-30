<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
#use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Repository\TodolistEntryRepository;
use App\Entity\TodolistEntry;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;

class ApiSqlTodolistController extends AbstractController
{
    #[Route('/api/sqltodolist', name: 'api_sqltodolist_get', methods: ['GET'])]
    public function findAll(
      TodolistEntryRepository $repository,
      SerializerInterface $serializer
      ): Response
    {
      try {
          $entries = $repository->findAll();
          $json = $serializer->serialize($entries, 'json', [
        'datetime_format' => 'Y-m-d'
      ]);
          return new Response($json, Response::HTTP_OK, [
        'content-type' => 'application/json'
      ]);
      } catch (Throwable $e) {
          return $this->json([
          'errorType' => get_class($e),
          'message' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
      }
    }

    #[Route('/api/sqltodolist', name: 'api_sqltodolist_create', methods: ['POST'])]
    public function create(
        EntityManagerInterface $entityManager,
        Request $request,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): Response {
        try {
            $content = $request->getContent();
            $entry = $serializer->deserialize($content, TodolistEntry::class, 'json', [
              'datetime_format' => 'Y-m-d'
            ]);

            $errors = $validator->validate($entry);
            if (count($errors) > 0) {
                return $this->json($errors, Response::HTTP_BAD_REQUEST);
            }
            if ($entry->getContent() == '') {
                throw new NotEncodableValueException('Content empty');
            }

            $entityManager->persist($entry);
            $entityManager->flush();

            $json = $serializer->serialize($entry, 'json', [
              'datetime_format' => 'Y-m-d'
            ]);
            return new Response($json, Response::HTTP_CREATED, [
              'content-type' => 'application/json'
            ]);
        } catch (NotEncodableValueException | NotNormalizableValueException $e) {
            return $this->json([
              'errorType' => get_class($e),
              'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (Throwable $e) {
            return $this->json([
              'errorType' => get_class($e),
              'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/sqltodolist/{id}', name: 'api_sqltodolist_update', methods: ['PUT'])]
    public function update(
        $id,
        TodolistEntryRepository $repository,
        EntityManagerInterface $entityManager,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ) {
        try {
            $content = $request->getContent();

            $entry = $serializer->deserialize($content, TodolistEntry::class, 'json', [
              'datetime_format' => 'Y-m-d'
            ]);
            $errors = $validator->validate($entry);
            if (count($errors) > 0) {
                return $this->json($errors, Response::HTTP_BAD_REQUEST);
            }
            if ($entry->getContent() == '') {
                throw new NotEncodableValueException('Content empty');
            }

            $savedEntry = $repository->find($id);
            if (! $savedEntry) {
                return $this->json('Entry does not exist', Response::HTTP_NOT_FOUND);
            }

            $savedEntry->setContent($entry->getContent());

            $savedEntry->setDueDate($entry->getDueDate());
            $entityManager->flush();

            $json = $serializer->serialize($savedEntry, 'json', [
              'datetime_format' => 'Y-m-d'
            ]);
            return new Response($json, Response::HTTP_OK, [
              'content-type' => 'application/json'
            ]);
        } catch (NotEncodableValueException | NotNormalizableValueException $e) {
            return $this->json([
              'errorType' => get_class($e),
              'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (Throwable $e) {
            return $this->json([
              'errorType' => get_class($e),
              'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/sqltodolist/{id}', name: 'api_sqltodolist_delete', methods: ['DELETE'])]
    public function delete(
        $id,
        TodolistEntryRepository $repository,
        EntityManagerInterface $entityManager
    ) {
        $savedEntry = $repository->find($id);
        if (! $savedEntry) {
            return $this->json('Entry does not exist', Response::HTTP_NOT_FOUND);
        }
        $entityManager->remove($savedEntry);
        $entityManager->flush();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
