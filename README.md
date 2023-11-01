NOTE: AWS credits ran out so dynamoDB access no longer works, hence the error 500 status ):


# Task Manager Application

Task Manager is a virtualized application which provides a simple interface for managing tasks or to-do lists. It uses a React frontend, a Node.js backend, and leverages AWS services for storage and execution.

## Prerequistes

This application requires Docker and Docker Compose to run. Ensure both [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) are installed on your system.

## **Installation and Setup**   

To install this application on your system clone the repository using the following command   

```git clone https://github.com/mitzaa/task-manager```  

Once in the correct directory run the following to build the application  

```docker-compose up --build```

Once the build process completes and the services are up, you can access the frontend task manager at http://localhost:3000
The backend is hosted on http://localhost:3001


## **Making changes** 

**Frontend:** Navigate to the frontend directory. Introduce changes as needed and rebuild using
```docker-compose build frontend```

**Backend:** Go to the backend directory. Modify scripts or routes as required. Rebuild using 
```docker-compose build backend``` 

Ensure any new dependencies are added to the relevant front and backend package.json files before rebuilding.

**Database:** The database is hosted on DynamoDB which is accessed through a lambda API gateway. When you add a task in the frontend it will create a new item in the dynamoDB table. Checking the task as completed will update the items status in the dynamoDB table from 'pending' to 'completed'. Deleting a task will remove it completely from the table. For debugging purposes when interacting with the frontend you can inspect element to view the API log messages. There should be relevant success messages in response to the CRUD operation you are trying to perform. Eg if you are adding a new task the API should respond with 'Item created successfully' if the item was succesfully stored in the dynamoDB table. 


## **Acknowledgements**

[AWS DynamoDB](https://aws.amazon.com/dynamodb/) for data storage

[AWS Lambda](https://aws.amazon.com/lambda/)  for processing HTTP requests

[AWS API gateway](https://aws.amazon.com/api-gateway/)  for processing HTTP requests

[React](https://react.dev/)  for hosting the frontend

[Express](https://expressjs.com/) for backend operations



