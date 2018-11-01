#!/usr/bin/env bash
set -xe
scripts/templater.sh kubernetes/deployment.yml.template > kubernetes/deployment.yml