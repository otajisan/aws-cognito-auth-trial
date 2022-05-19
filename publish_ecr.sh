#!/bin/bash

AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}
ECRNAME=aws-cognito-auth-trial
REGION=ap-northeast-1
TAG=latest

# build an your docker app
docker build -t ${ECRNAME} .
docker tag ${ECRNAME}:${TAG} "${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECRNAME}:${TAG}"

# push
aws ecr get-login-password --region ap-northeast-1 --profile morning-code-dev | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com"
docker push "${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECRNAME}:${TAG}"

