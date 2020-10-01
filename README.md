# CI/CD pipeline setup on AWS with Lambda and Serverless Framework

Setting up a Serverless CI/CD pipeline in AWS using [Lambda](https://aws.amazon.com/lambda/) and the [Serverless Framework](https://serverless.com/) 

 - Gets triggered by pushing git commits
 - Runs unit tests and code linting
 - Deploys to staging environment
 - Deploys to production using manual approval gate.
    *(will be implementing Jenkins for automated approval gate)*


# Code

 - NodeJS function (handler.js)
 - unit tests written in Jest (handler.test.js)
 - ESLint config (eslintrc.json)
 - Serverless framework config (serverless.yml)

## Function to should:

 1. read timezone param from query string, if not specified, use *Africa/Johannesburg*
 2. validate the timezone against known timezones
 3. display awesome message with the time

> const  moment  =  require('moment-timezone');
module.exports.timeinjozi  =  async (event) => {
let  timezone  =  'Africa/Johannesburg';
if (event.queryStringParameters  &&  event.queryStringParameters.timezone) {
// eslint-disable-next-line prefer-destructuring
timezone  =  event.queryStringParameters.timezone;
if (!moment.timezone.names().includes(timezone)) {
return {
statusCode: '400',
body: `Unknown timezone ${timezone}`
};
}
}
return {
statusCode: '200',
body: `The time in ${timezone} is: ${moment.timezone(timezone).format()}`
};
};

## Test suite
It is made up of 3 unit tests using Jest framework

# CI/CD Pipeline
In AWS Console you will

 1. Create an S3 bucket
 2. Create a CodePipeline
 3. In the build stage, you can either choose AWS CodeBuild or Jenkins
	 - Select "use a buildspec file"


     version: 0.2  
     phases:  
    	 pre_build:  
    		 commands:  
    			 - npm install --no-progress --silent  
    	 build:  
    		 commands:  
    			 - npm run-script lint  
    			 - npm run test

4. Add a deploy a deploy stage

# Serverless Framework
Install serverless

    npm install serverless -g

Run serverless

    serverless deploy

# Deployment package

    version: 1.0
    phases:
    
    install:
    commands:
    		- rm package-lock.json
    		- npm install --silent --no-progress -g npm
    		- npm install --silent --no-progress -g serverless
    		- npm --version
    pre_build:
    commands:
    	- npm install --silent --no-progress
    build:
    commands:
    	- npm run-script lint
    	- npm run test
    	- mkdir -p target/staging
    	- mkdir target/production
    	- serverless package --package target/staging --stage staging -v -r us-east-2
    	- serverless package --package target/production --stage production -v -r us-east-2
    artifacts:
    	files:
    	- target/**/*
    	- serverless.yml
    	- deploy.sh

 1. install phase makes sure that npm and serverless framework are installed
 2. pre_build phase installs dependencies
 3. build phase runs linting and unit tests
	 - also creates target directory with 2 sub directories for 
	 - staging and production artifacts

# Deployment script

    > #! /bin/bash
    npm install -g serverless
    serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/target/$env -v -r us-east-2