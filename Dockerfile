FROM node:16.15.0-bullseye-slim

WORKDIR /aws-cognito-auth-trial
COPY . /aws-cognito-auth-trial

RUN apt update -y

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD npm run start
