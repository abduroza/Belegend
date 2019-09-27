Content of CI

image: node:latest

stages:
  - build
  - test
  - production

proses compile:
  stage: build
  script: 
    - npm install

test:
  script: 
  - npm install
  - npm test

production:
  type: deploy
  stage: production
  image: ruby:latest
  script:
    - apt-get update -qy
    - apt-get install -y ruby-dev
    - gem install dpl
    - dpl --provider=heroku --app=belegend --api-key=$HEROKU_API_KEY
  
  only:
    - master


