#!/bin/bash

# exit on any failure
set -e

npm run compile:release
npm run build
