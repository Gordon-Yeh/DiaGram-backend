# DiaGram API Server
To run the server locally, run: <br />
`npm start`<br />

**Signup**
----
  Creates a user

* **URL**

  /signup

* **Method:**

  `POST`
  
*  **URL Body**

   **Required:**
 
   `username: <String>` <br />
   `password: <String>` <br />
   `accessCode: <String>` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    `
    {
        jwt: <String>,
        user: {
            _id: <String>,
            username: <String>
        }
    }
    `
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "DUPLICATE_USERNAME", "INVALID_ACCESS_CODE", "INVALID_PASSWORD" ] }`

**Login**
----
Grant session to a user given the username and password

* **URL**

  /login

* **Method:**

  `POST`
  
*  **URL Body**

   **Required:**
 
   `username: <String>` <br />
   `password: <String>` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    `
    {
        jwt: <String>,
        user: {
            _id: <String>,
            username: <String>
        }
    }
    `
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "INVALID_CREDENTIALS" ] }`


**Get Post**
----
Get posts for app feed

* **URL**

  /posts

* **Method:**

  `GET`

* **URL HEADER**

   **Required:**
  
  `Authorization: "Bearer ${jwt}"`
    
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    ```
    [
      {
        _id: <String>,
        tite: <String>,
        body: <String>,
        userType: enum { patient, doctor },
        private: <Boolean>
        comments: [
          {
            _id: [included: if userType == doctor] ,
            userType: enum { patient, doctor },
            body: <String>,
          },
          ...
        ]
      },
      ...
    ]
    ```
* **Error Response:**

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED" ] }`


**Make Post**
----
Make a new post

* **URL**

  /posts

* **Method:**

  `POST`

* **URL HEADER**

   **Required:**
  
  `Authorization: "Bearer ${jwt}"`

*  **URL Body**

   **Required:**

   `title: <String>` <br />
   `body: <String>` <br />

   **Optional:**

   `private: <Boolean>` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    ```
    {
      _id: <String>,
      tite: <String>,
      body: <String>,
      userType: enum { patient, doctor },
      private: <Boolean>
      comments: []
    }
    ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "EMPTY_TITLE", "EMPTY_BODY" ] }`

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED" ] }`

**Common Error Response**
----
* **INTERNAL SERVER ERROR** <br />
happens when there is something wrong with the server internally
  * **Code:** 500 <br />
    **Content:** <br />
    `{ errors : [ "INTERNAL_SERVER_ERROR" ] }`

* **NOT FOUND** <br />
happens the URL does not exist
  * **Code:** 400 <br />
    **Content:** <br />
    `{ errors : [ "NOT_FOUND" ] }`
