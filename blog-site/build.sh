#!/bin/bash

hugo --theme=beautifulhugo --baseUrl="https://linuxer.io/"

hugo-algolia -s
