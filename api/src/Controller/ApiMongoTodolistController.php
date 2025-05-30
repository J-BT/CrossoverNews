<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
# use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Document\TodolistEntry;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;

class ApiMongoTodolistController extends AbstractController
{

    #[Route('/api/mongotodolist', name: 'api_mongotodolist_get', methods: ['GET'])]
    public function findAll(
        DocumentManager $documentManager,
        SerializerInterface $serializer
    ): Response {
        $repository = $documentManager->getRepository(TodolistEntry::class);
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

    #[Route('/api/mongotodolist', name: 'api_mongotodolist_create', methods: ['POST'])]
    public function create(
        DocumentManager $documentManager,
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

            $documentManager->persist($entry);
            $documentManager->flush();

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

    #[Route('/api/mongotodolist/{id}', name: 'api_mongotodolist_update', methods: ['PUT'])]
    public function update(
        $id,
        DocumentManager $documentManager,
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ) {
        $repository = $documentManager->getRepository(TodolistEntry::class);
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
            $savedEntry->setExtraArgs($entry->getExtraArgs());
            $savedEntry->setDueDate($entry->getDueDate());
            $documentManager->flush();

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

    #[Route('/api/mongotodolist/{id}', name: 'api_mongotodolist_delete', methods: ['DELETE'])]
    public function delete(
        $id,
        DocumentManager $documentManager
    ) {
        $repository = $documentManager->getRepository(TodolistEntry::class);
        $savedEntry = $repository->find($id);
        if (! $savedEntry) {
            return $this->json('Entry does not exist', Response::HTTP_NOT_FOUND);
        }
        $documentManager->remove($savedEntry);
        $documentManager->flush();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
