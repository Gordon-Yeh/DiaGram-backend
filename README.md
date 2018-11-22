# DiaGram API Server
This is the API Node.js server code for the app DiaGram written for CPEN-321<br />

# Table of Contents
1. [Session](#session)  
    * [Signup](#signup)
    * [Login](#login)
2. [Posts](#posts)  
    * [Get Post](#get-post)
    * [Make Post](#make-post)
    * [Commenting](#commenting)
    * [Get Followed Post](#get-followed-posts)
3. [Users](#users)
    * [View Profile](#view-profile)
    * [Edit Profile](#edit-profile)
    * [View Other Profile](#view-other-profile)

# Session
## Signup
  Creates a user

* **URL**

  `/signup`

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
    ```
    {
        jwt: <String>,
        user: {
            _id: <String>,
            username: <String>,
            userType: <String>,
            firstName: <String>,
            lastName: <String>,
            medications: <String>,
            recentProcedures: <String>,
            conditions: <String>,
        }
    }
    ```

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "DUPLICATE_USERNAME", "INVALID_ACCESS_CODE", "INVALID_PASSWORD" ] }`

## Login
Grant session to a user given the username and password

* **URL**

  `/login`

* **Method:**

  `POST`
  
*  **URL Body**

   **Required:**
 
   `username: <String>` <br />
   `password: <String>` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    ```
    {
        jwt: <String>,
        user: {
            _id: <String>,
            username: <String>,
            userType: <String>,
            firstName: <String>,
            lastName: <String>,
            medications: <String>,
            recentProcedures: <String>,
            conditions: <String>,
        }
    }
    ```
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "INVALID_CREDENTIALS" ] }`

# Posts
## Get Post
Get posts for app feed

* **URL**

  `/posts`

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
        userId: <String>,
        userType: enum { patient, doctor },
        private: <Boolean>
        comments: [
          {
            body: <String>,
            userId: <String>
            userType: enum { patient, doctor },
            createdAt: <Timestamp>
          },
          ...
        ]
        createdAt: <Timestamp>
        updatedAt: <Timestamp>
      },
      ...
    ]
    ```

* **Error Response:**

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED" ] }`

## Make Post
Make a new post

* **URL**

  `/posts`

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
      userId: <String>,
      userType: enum { patient, doctor },
      private: <Boolean>,
      comments: [],
      createdAt: <Timestamp>
      updatedAt: <Timestamp>
    }
    ```    


* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "EMPTY_TITLE", "EMPTY_BODY" ] }`

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED" ] }`

## Commenting
commenting on a post

* **URL**

  `/posts/:post_id/comments`

* **Method:**

  `POST`

* **URL HEADER**

   **Required:**
  
  `Authorization: "Bearer ${jwt}"`

*  **URL Body**

   **Required:**

   `body: <String>` <br />

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    ```
    {
      _id: <String>,
      tite: <String>,
      body: <String>,
      userId: <String>,
      userType: enum { patient, doctor },
      private: <Boolean>,
      comments: [ {newly added comment} ],
      createdAt: <Timestamp>
      updatedAt: <Timestamp>
    }
    ```    

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** <br />
    `{ errors : [ "POST_NOT_FOUND" ] }`

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED", "WRONG_USER" ] }`

## Get Followed Posts
Get posts that the user is followering

* **URL**

  `/posts/followed`

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
        userId: <String>,
        userType: enum { patient, doctor },
        private: <Boolean>
        comments: [
          {
            body: <String>,
            userId: <String>
            userType: enum { patient, doctor },
            createdAt: <Timestamp>
          },
          ...
        ]
        createdAt: <Timestamp>
        updatedAt: <Timestamp>
      },
      ...
    ]
    ```

# Users
## View Profile
gets the user's own profile information

* **URL**

  `/users`

* **Method:**

  `GET`

* **URL HEADER**

   **Required:**
  
  `Authorization: "Bearer ${jwt}"`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    ```
    {
      _id: <String>
      username: <String>
      userType: enum { patient, doctor },
      firstName: <String>
      lastName: <String>
      medications: <String>
      recentProcedures: <String>
      conditions: <String>
    }
    ```

## Edit Profile
edit the user's own profile information

* **URL**

  `/users`

* **Method:**

  `PUTs`

* **URL HEADER**

   **Required:**
  
  `Authorization: "Bearer ${jwt}"`

* **Body**

   **Required:**  
    `firstName: <String>`  
    `lastName: <String>`  
    `medications: <String>`  
    `recentProcedures: <String>`  
    `conditions: <String>`  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />
    ```
    {
      _id: <String>
      username: <String>
      userType: enum { patient, doctor },
      firstName: <String>
      lastName: <String>
      medications: <String>
      recentProcedures: <String>
      conditions: <String>
    }
    ```

* **Error Response:**

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED" ] }`


## View Other Profile
get the profile information of another user

* **URL**

  `/users/:user_id`

* **Method:**

  `GET`

* **URL HEADER**

   **Required:**
  
  `Authorization: "Bearer ${jwt}"`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** <br />

    **`If viewer is a doctor`**
    ```
    {
      _id: <String>
      username: <String>
      userType: enum { patient, doctor },
      firstName: <String>
      lastName: <String>
      medications: <String>
      recentProcedures: <String>
      conditions: <String>
    }
    ```
  
    **`If viewer is a patient`**
    ```
    {
      _id: <String>
      userType: enum { patient, doctor },
      medications: <String>
      recentProcedures: <String>
      conditions: <String>
    }
    ```

* **Error Response:**

  * **Code:** 403 UNAUTHORIZED <br />
    **Content:** <br />
    `{ errors : [ "UNAUTHORIZED", "SESSION_EXPIRED" ] }`

# Common Error Response
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
