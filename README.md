# System Design: Questions and Answers API
The goal of the project was to build a scalable RESTful API for an existing e-commerce web application and optimize the performance to handle the web scale traffic loads. I worked with two other software engineers to breakdown the original legacy API into micro-services. I was responsible for redesigning and building a backend server and database for Questions and Answers API micro-service and the service I built was able to withstand up to 4500 RPS for the most used read route with  ~0% error rate.

## **Tech Stacks**

Backend Development:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639.svg?style=for-the-badge&logo=nginx&logoColor=white)


Deployment:

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![EC2](https://img.shields.io/badge/Amazon%20Ec2-FF9900.svg?style=for-the-badge&logo=amazon-ec2&logoColor=white)


Testing: 

![JEST](https://img.shields.io/badge/JEST-C21325.svg?style=for-the-badge&logo=jest&logoColor=white)
![SuperTest](https://img.shields.io/badge/SuperTest-C21325.svg?style=for-the-badge&logo=supertest&logoColor=white)
![k6](https://img.shields.io/badge/k6-7D64FF.svg?style=for-the-badge&logo=k6&logoColor=white)
![NewRelic](https://img.shields.io/badge/NewRelic-008C99.svg?style=for-the-badge&logo=new-relic&logoColor=white)
![LoaderIo](https://img.shields.io/badge/Loader.io-4169E1.svg?style=for-the-badge&logo=loader-io&logoColor=white)


## **Table of Contents**

- <a href="#system-design-and-optimization"> System Design and Optimization </a>
    - <a href="#database-schema"> Database Schema </a>
    - <a href="#test-coverage"> Test Coverage </a>
    - <a href="#architecture"> Architecture </a>
- <a href="#api-endpoints"> API Endpoints</a>
- <a href="#installation"> Installation</a>


## System Design and Optimization

### Database Schema

### Test Coverage

### Architecture


## API Endpoints
### List Questions

`GET /qa/questions`
Retrieves a list of questions for a particular product.  This list *does not* include any reported questions.

Parameters

| Parameter  | Type    | Description                                               |
| ---------- | ------- | --------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.    |
| page       | integer | Selects the page of results to return.  Default 1.        |
| count      | integer | Specifies how many results per page to return. Default 5. |

Response

`Status: 200 OK `

```json
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": 0,
        "answers": {
          "68": {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": 0,
        "answers": {
          "70": {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          "78": {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}
```



### Answers List

Returns answers for a given question. This list *does not* include any reported answers.

`GET /qa/questions/:question_id/answers`

Parameters

| Parameter   | Type    | Description                                               |
| ----------- | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the Question requested                     |
| page        | integer | Selects the page of results to return.  Default 1.        |
| count       | integer | Specifies how many results per page to return. Default 5. |

Response

`Status: 200 OK `

```json
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```



### Add a Question

Adds a question for the given product

`POST /qa/questions`

Parameters

| Parameter  | Type    | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| product_id | integer | Required ID of the Product to post the question for |

Body Parameters

| Parameter | Type | Description                      |
| --------- | ---- | -------------------------------- |
| body      | text | Text of question being asked     |
| name      | text | Username for question asker      |
| email     | text | Email address for question asker |

Response

`Status: 201 CREATED `



### Add an Answer

Adds an answer for the given question

`POST /qa/questions/:question_id/answers`

Parameters

| Parameter   | Type    | Description                                        |
| ----------- | ------- | -------------------------------------------------- |
| question_id | integer | Required ID of the question to post the answer for |

Body Parameters

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| body      | text   | Text of question being asked                        |
| name      | text   | Username for question asker                         |
| email     | text   | Email address for question asker                    |
| photos    | [text] | An array of urls corresponding to images to display |

Response

`Status: 201 CREATED `



### Mark Question as Helpful

Updates a question to show it was found helpful.

`PUT /qa/questions/:question_id/helpful`

Parameters

| Parameter   | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response

`Status: 204 NO CONTENT `



### Report Question

Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

`PUT /qa/questions/:question_id/report`

Parameters

| Parameter   | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response

`Status: 204 NO CONTENT `



### Mark Answer as Helpful

Updates an answer to show it was found helpful.

`PUT /qa/answers/:answer_id/helpful`

Parameters

| Parameter | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id | integer | Required ID of the answer to update |

Response

`Status: 204 NO CONTENT `



### Report Answer

Updates an answer to show it has been reported.  Note, this action does not delete the answer, but the answer will not be returned in the above GET request.

`PUT /qa/answers/:answer_id/report`

Parameters

| Parameter | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id | integer | Required ID of the answer to update |

Response

`Status: 204 NO CONTENT `


## Installation
1. Fork the project and clone to your local repository
2. Install all the packages and dependencies by running:

```jsx
npm install
```

3. Run webpack at local development mode:

```jsx
npm run react-dev
```

4. create `.env` file and add following variables:

```jsx
PG_USER = <YOUR_USERNAME>
PG_PASSWORD = <YOUR_PASSWORD>
PG_PORT = <YOUR_DB_PORT>
PG_HOST = <YOUR_DB_HOST>
PG_DB = <YOUR_DB_NAME>
```

5. Start server:

```jsx
npm run server-dev
```
