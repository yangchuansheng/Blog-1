#!/bin/bash

rm -r public

hugo --theme=beautifulhugo --baseUrl="https://linuxer.io/"

hugo-algolia -s
