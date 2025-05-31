<?php

namespace App\Models;

class Media
{
    ## Attributes & Accessors

    public string $name;
    public string $zone;
    public string $category;
    public string $url;

    ## Constructor
    public function __construct(string $name, string $zone, string $category, string $url){
        $this->name = $name;
        $this->zone = $zone;
        $this->category = $category;
        $this->url = $url;
    }

}