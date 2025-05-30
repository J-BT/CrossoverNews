<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * @MongoDB\Document(collection="todolistEntries")
 */
class TodolistEntry
{
    /**
     * @MongoDB\Id
     */
    protected $id;

    /**
     * @MongoDB\Field(type="string")
     */
    protected $content;

    /**
     * @MongoDB\Field(type="date")
     */
    protected $dueDate;

    /**
     * @MongoDB\Field(type="hash")
     */
    protected $extraArgs;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getDueDate(): ?\DateTimeInterface
    {
        return $this->dueDate;
    }

    public function setDueDate(?\DateTimeInterface $dueDate): self
    {
        $this->dueDate = $dueDate;

        return $this;
    }

    public function getExtraArgs(): ?array
    {
        return $this->extraArgs;
    }

    public function setExtraArgs(?array $extraArgs): self
    {
        $this->extraArgs = $extraArgs;

        return $this;
    }
}
