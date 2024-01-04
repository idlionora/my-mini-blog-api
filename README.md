# myMiniBlog's API
myMiniBlog is a blog application built by integrating What You See is What You Get text editor into a ReactJS structure. The backend side of the application allows user to create an account, login, write blogs, edit them, and shares their comments. The API for myMiniBlog is served by Express.js application connected to MongoDB by using Mongoose ODM. Image files are hosted in Cloudinary's platform after user uploaded their images through myMiniBlog's API.

### Rate Limit
There is a rate limit of **100 requests per hour**, per IP address. If you exceed the rate limit, the application will return an error message.

## API References
### Authentication
- [Sign Up](#sign-up)
- [Log In](#log-in)
- [Forgot Password](#forgot-password)
- [Reset Password](#reset-password)
- [Update Current User Password](#update-current-user-password) 🔒
### Users
- [Get All Users](#get-all-users) 🎫
- [Get Current User](#get-current-user) 🔒
- [Get User](#get-user)
- [Get Users by nameRegex](#get-users-by-name-regex)
- [Update Current User](#update-current-user) 🔒
- [Update User](#update-user) 🎫
- [Delete Current User](#delete-current-user) 🔒
- [Delete User](#delete-user) 🎫
### Blogposts
- [Create New Blogpost](#create-new-blogpost) 🔒
- [Get All Blogposts](#get-all-blogposts)
- [Get All Tags](#get-all-tags)
- [Get Blogposts by Tags](#get-blogposts-by-tags)
- [Get Blogpost](#get-blogpost)
- [Update Blogpost](#update-blogpost) 🔒
- [Delete Blogpost](#delete-blogpost) 🔒
### Comments
- [Create New Comment](#create-new-comment) 🔒
- [Get All Comments](#get-all-comments)
- [Get Comment](#get-comment)
- [Update Comment](#update-comment) 🔒
- [Delete Comment](#delete-comment) 🔒
### Others
- [Create New Comment by BlogpostId](#create-new-comment-by-blogpostid) 🔒
- [Get All Comments by BlogpostId](#get-all-comments-by-blogpostid)
- [Get Blogposts by UserId](#get-blogposts-by-userid)
- [Get All Comments by UserId](#get-all-comments-by-userid)


note on symbols:<br/>
🔒 user needs to be authenticated in order to access this API endpoint.<br/>
🎫 only admin can access this API endpoint.

## Sign Up

```HTTP
POST /api/v1/users/signup
```
Create a new account in myMiniBlog app. The account is identified by email so the field should be unique per account. Token is immediately saved when signing up is successful. You cannot assign user's role through this API endpoint.

**Body**
```JSON
{
  "name": "Test Account",
  "email": "testaccount2023@usermail.com",
  "password": "test1234",
  "passwordConfirm": "test1234"
}
```

**Response**
```JSON
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODc2MzZiM2FhYWU5NWM1OTBjZTdmZiIsImlhdCI6MTcwMzM3MTYyOCwiZXhwIjoxNzA1OTYzNjI4fQ.2jBETgPWzUCmL1rdFJ2AEnqsLHwkPkLk-Amq1zOGnHE",
    "data": {
        "user": {
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
            "active": true,
            "_id": "6587636b3aaae95c590ce7ff",
        }
    }
}
```

## Log In

```HTTP
POST /api/v1/users/login
```
Get token for registered user. The token will be saved in cookies and have expired date set in 24 hours after logging in.

**Body**
```JSON
{
    "email": "testaccount2023@mailsac.com",
    "password": "test1234"
}
```

**Response**
```JSON
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODc2MzZiM2FhYWU5NWM1OTBjZTdmZiIsImlhdCI6MTcwMzM3MjY1MywiZXhwIjoxNzA1OTY0NjUzfQ.8ET3_FX0EEwR-CWcSMxOyBEG3R6ozB6_Uasg0I7jpHw",
    "data": {
        "user": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
        }
    }
}
```

## Forgot Password

```HTTP
POST /api/v1/users/login
```
Get an email containing token to reset password sent to the address provided. The token will immediately be sent and valid for 10 minutes after it was sent.

**Body**
```JSON
{
    "email": "testaccount2023@mailsac.com",
}
```

**Response**
```JSON
{
    "status": "success",
    "message": "Token sent to email!"
}
```

## Reset Password
```HTTP
PATCH /api/v1/users/resetPassword/:token
```
Change user's password by the token sent in email after accessing Forgot Password API endpoint.

**Body**
```JSON
{
    "password": "pass1234",
    "passwordConfirm": "pass1234"
}
```

**Response**
```JSON
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODc2MzZiM2FhYWU5NWM1OTBjZTdmZiIsImlhdCI6MTcwMzQ1Nzc2NSwiZXhwIjoxNzA2MDQ5NzY1fQ.DvKmslyiBVm_JF-SFAmFrJGU-sKYiQVFAJY7C38x58k",
    "data": {
        "user": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
            "passwordChangedAt": "2023-12-24T22:42:44.389Z"
        }
    }
}
```
## Update Current User Password
```HTTP
PATCH /api/v1/users/resetPassword/:token
```
🔒 Change user's password from myMiniBlog's account menu. The user needs to type in old password to change it. 

**Body**
```JSON
{
    "passwordCurrent": "pass1234",
    "password": "newpassword",
    "passwordConfirm": "newpassword"
}
```
**Response**
```JSON
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODc2MzZiM2FhYWU5NWM1OTBjZTdmZiIsImlhdCI6MTcwMzQ1ODU4MSwiZXhwIjoxNzA2MDUwNTgxfQ.vJsz4NuUVo754zaTRsmBhAjA_QFlUjPF789YpX7h3QI",
    "data": {
        "user": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
            "passwordChangedAt": "2023-12-24T22:56:20.224Z"
        }
    }
}
```

## Get All Users

```HTTP
GET /api/v1/users/
```
🎫 Get all registered users that has not been deactivated. This API endpoint can only be accessed by admins. 

**Response**
```JSON
{
    "status": "success",
    "results": 2,
    "data": [
        {
            "_id": "6561dfed2e9013c758a7e675",
            "name": "Fleetways",
            "email": "fleetways@mailsac.com",
            "photo": "/v1702280414/my-mini-blog/user/profile-6561dfed2e9013c758a7e675.jpg",
            "role": "admin"
        },
        {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
            "passwordChangedAt": "2023-12-24T22:56:20.224Z"
        }
    ]
}
```

## Get Current User

```HTTP
GET /api/v1/users/me
```
🔒 Get informations of the current logged in user. JWT token is needed in order to search for user.

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
            "passwordChangedAt": "2023-12-24T22:56:20.224Z"
        }
    }
}
```

## Get User
```HTTP
GET /api/v1/users/:id
```
Get user's data by providing user's ID param in API endpoint.

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "user",
            "passwordChangedAt": "2023-12-24T22:56:20.224Z"
        }
    }
}
```

## Get Users by nameRegex
```HTTP
GET /api/v1/users/search/:nameRegex
```
Get users' data which user's name is matching the regex keyword provided. The name search is case insensitive and the result will provide id and name fields.

**Response for /api/v1/users/search/b**
```HTTP
{
    "status": "success",
    "results": 2,
    "data": [
        {
            "_id": "655c7a2bd2ffdd11ea492d1c",
            "name": "Barry T. Quokka"
        },
        {
            "_id": "655c7db100dd54c3bb607cd7",
            "name": "Blaze"
        }
    ]
}
```

## Update Current User
```HTTP
PATCH /api/v1/users/updateMe
```
🔒 Change the current logged in user's name, email, and/or photo. You cannot change user's password or role through this API endpoint. 

**multipart/ form-data**
| key | type | value |
|:------|:-----|:------------|
| name | Text | Guest Account |
| email | Text | guestacc23@mailsac.com |
| photo | File | insert image file here |

**Response**
```JSON
{
    "status": "success",
    "data": {
        "user": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Guest",
            "email": "guestacc23@mailsac.com",
            "photo": "/v1703860117/my-mini-blog/user/profile-6587636b3aaae95c590ce7ff.jpg",
            "role": "user",
            "passwordChangedAt": "2023-12-24T22:56:20.224Z"
        }
    }
}
```
## Update User
```HTTP
PATCH /api/v1/users/:id
```
🎫 Update user by provided ID, cannot upload image and change password through this API endpoint. Access for admins only.

**Body**
```JSON
{
    "name": "Test Account",
    "email": "testaccount2023@mailsac.com",
    "photo": "/my-mini-blog/user/default.jpg",
    "role": "admin",
    "active": false
}
```

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "6587636b3aaae95c590ce7ff",
            "name": "Test Account",
            "email": "testaccount2023@mailsac.com",
            "photo": "/my-mini-blog/user/default.jpg",
            "role": "admin",
            "passwordChangedAt": "2023-12-24T22:56:20.224Z"
        }
    }
}
```

## Delete Current User
```HTTP
DELETE /api/v1/users/deleteMe
```
🔒 Set active: false for the current logged in user and hide data from showing in API responses.

## Delete User
```HTTP
DELETE /api/v1/users/:id
```
🎫 Remove user data permanently from mongoDB. Only admins can do this action. 

## Create New Blogpost 

```HTTP
POST /api/v1/blogposts
```
🔒 Create a new blogpost by providing title and content at minimum. You can also add tags to your post before updating blogpost for image inclusion.

**Body**
```JSON
{
  "title": "User's New Post, 4 Characters Minimum",
  "summary": "This is short summary of this post.",
  "content": "Insert long sentences here, 26 characters at minimum.",
  "tags": ["personal", "funny", "daily-life"]
}
```
**Response**
```JSON
{
  "status": "success",
  "data": {
    "doc": {
      "title": "User's New Post, 4 Characters Minimum",
      "summary": "This is short summary of this post.",  
      "blogpostImg": "/my-mini-blog/post_img/default.jpg",
      "blogthumbImg": "/my-mini-blog/thumb_img/default.jpg",
      "bannerImg": "/my-mini-blog/banner_img/default.jpg",
      "content": "Insert long sentences here, 26 characters at minimum.",
      "tags": [
                "personal",
                "daily-life"
      ],
      "createdAt": "2023-12-16T15:12:41.879Z",
      "updatedAt": "2023-12-16T15:12:41.879Z",
      "user": "655f6a6feea8c6dc6f4f1227",
      "commentCount": 0,
      "slug": "users-new-post-4-characters-minimum",
      "id": "657dc0cb998ee1e6ed20938c"          
    }
  }
}
```
## Get All Blogposts

```HTTP
GET /api/v1/blogposts
```

Get all active blogposts that had been created before. The response is sorted by blogpost's createdAt from new to old.

**Query Parameters**
| param | type | description |
|:------|:-----|:------------|
|fields |`String`|Restrict the fields returned when requesting blogposts. Example to exclude more than one field is divided by coma: "-slug,-thumbnail,-banner,-__v"
|createdAt[gte]|`String`|Get blogposts that are created in or after the date mentioned. Date input is a string in format of "YYYY-MM-DD"|
|createdAt[lte]|`String`|Get blogposts that are created in or before the date mentioned. Can be included alongside of `createdAt[gte]` param|
|createdAt|`String`|Get blogposts in a range date by format of "YYYY-MM-DD,YYYY-MM-DD". Only select blogposts created in 24 hours if there's only one date present. API will return an error if `createdAt[gte]` or `createdAt[lte]` is also included|
|user|`String`|Search blogposts that had been writen by userId|
|limit|`Number`|How many blogposts that can be included in a single page. The default number of limit is 100 blogposts per page|
|page|`Number`|Requested page number deducted from limit param and how many blogposts are found|

<br/>

**Response**
```JSON
{
  "status" : "success",
  "results": 1,
  "data": [
    {
      "_id": "657dc0cb998ee1e6ed20938c",
      "title": "User's New Post, 4 Characters Minimum",
      "summary": "This is short summary of this post.", 
      "blogpostImg": "/my-mini-blog/post_img/default.jpg",
      "blogthumbImg": "/my-mini-blog/thumb_img/default.jpg",
      "bannerImg": "/my-mini-blog/banner_img/default.jpg",
      "content": "Insert long sentences here, 26 characters at minimum.",
      "tags": [
                "personal",
                "funny",
                "daily-life"
      ],
      "createdAt": "2023-12-16T15:12:41.879Z",
      "updatedAt": "2023-12-16T15:12:41.879Z",
      "user": {
        "_id": "655f6a6feea8c6dc6f4f1227",
        "name": "Rouge"
      },
      "commentCount": 0,
      "slug": "users-new-post-4-characters-minimum",
      "id": "657dc0cb998ee1e6ed20938c"  
    }
  ]
}
```
## Get All Tags
```HTTP
GET /api/v1/blogposts/alltags
```
Get all tags that had been used in myMiniBlog before. 

**Response**
```JSON
{
  "status" : "success",
  "data": {
    "tags": [
      "admin-post",
      "daily-life",
      "funny",
      "personal",
      "testing"
    ]
  }
}
```
## Get Blogposts by Tags
```HTTP
GET /api/v1/blogposts/tags/:tag
```
Get all blogposts by filtering its owned tags. You can input multiple tags by inserting the parameters divided by comma. Query filter works the same way as [Get All Blogposts](#get-all-blogposts) API endpoint. The response returned is also in the same format as Get All Blogposts' response.

**Response**
```JSON
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "title": "User's New Post, 4 Characters Minimum",
      "summary": "This is short summary of this post.", 
      "blogpostImg": "/my-mini-blog/post_img/default.jpg",
      "blogthumbImg": "/my-mini-blog/thumb_img/default.jpg",
      "bannerImg": "/my-mini-blog/banner_img/default.jpg",
      "content": "Insert long sentences here, 26 characters at minimum.",
      "tags": [
                "personal",
      ],
      "createdAt": "2023-12-16T15:12:41.879Z",
      "updatedAt": "2023-12-16T15:12:41.879Z",
      "user": {
        "_id": "655f6a6feea8c6dc6f4f1227",
        "name": "Rouge"
      },
      "commentCount": 2,
      "slug": "users-new-post-4-characters-minimum",
      "id": "657dc0cb998ee1e6ed20938c"          
    }
  ]
}
```
## Get Blogpost

```HTTP
GET /api/v1/blogposts/:id
```
Call a single blogpost by its ID and get the requested document with all embedded comment section.  

**Response**
```JSON
{
  "status": "success",
  "results": 1,
  "data": [
    {
      "title": "User's New Post, 4 Characters Minimum",
      "summary": "This is short summary of this post.", 
      "blogpostImg": "/my-mini-blog/post_img/default.jpg",
      "blogthumbImg": "/my-mini-blog/thumb_img/default.jpg",
      "bannerImg": "/my-mini-blog/banner_img/default.jpg",
      "content": "Insert long sentences here, 26 characters at minimum.",
      "tags": [
                "personal",
      ],
      "createdAt": "2023-12-16T15:12:41.879Z",
      "updatedAt": "2023-12-16T15:12:41.879Z",
      "user": {
                "_id": "655f6a6feea8c6dc6f4f1227",
                "name": "Rouge",
                "photo": "/v1702280414/my-mini-blog/user/profile-655f6a6feea8c6dc6f4f1227.jpg"
            },
      "commentCount": 2,
      "slug": "users-new-post-4-characters-minimum",
      "comments": [
              {
                "_id": "658162c0a6a75f34c636330d",
                "comment": "Hello! First comment here. I hope you don't mind.",
                "createdAt": "2023-12-19T09:15:54.930Z",
                "updatedAt": "2023-12-19T09:15:54.930Z",
                "blogpost": "6581608ea6a75f34c6363302",
                "user": {
                    "_id": "655c7a2bd2ffdd11ea492d1c",
                    "name": "Barry T. Quokka",
                    "photo": "/my-mini-blog/user/default.jpg"
                },
                "id": "658162c0a6a75f34c636330d"
              },
              {
                "_id": "658162f1a6a75f34c6363313",
                "comment": "Sure. Thanks for the test comment, Hun",
                "createdAt": "2023-12-19T09:15:54.930Z",
                "updatedAt": "2023-12-19T09:15:54.930Z",
                "blogpost": "6581608ea6a75f34c6363302",
                "user": {
                    "_id": "655f6a6feea8c6dc6f4f1227",
                    "name": "Rouge",
                    "photo": "/v1702280414/my-mini-blog/user/profile-658162f1a6a75f34c6363313.jpg"
                },
                "id": "658162f1a6a75f34c6363313"
              }
            ],
      "id": "657dc0cb998ee1e6ed20938c"          
    }
  ]
}
```
## Update Blogpost

```HTTP
PATCH /api/v1/blogposts/:id
```

🔒 Edit user's blogpost including adding blogpostImg and bannerImg. blogpostImg will be used to post's representative picture in main page and thumbnail with size of ,  Only user who wrote the post and admins can perform this action.

**multipart/ form-data**
| key | type | value |
|:------|:-----|:------------|
| title | Text | This is a New Title for an Editted Post |
| summary | Text | Give this blogpost more compelling summary here. |
| blogpostImg | File | insert image file in here. Post's image will be resized to have width of 600px and cropped to have height of 200px, thumbnail image will be resized and cropped to 250px x 200px |
| bannerImg | File | insert image file in here, will be ressized to have width of 1920px and cropped to have height of 1080px |
| content | text | This content has been editted, so it no longer has typo or such. |
| tags | text | JSON.stringify(["array", "of-string"]) |

<br/>

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "6581608ea6a75f34c6363302",
            "title": "This is a New Title for an Editted Post",
            "summary": "Give this blogpost more compelling summary here.",
            "blogpostImg": "/v1703114809/my-mini-blog/blogpost_img/blogpost-6581608ea6a75f34c6363302_2023-12-20-659.jpg",
            "blogthumbImg": "/v1703114810/my-mini-blog/blogthumb_img/blogthumb-6581608ea6a75f34c6363302_2023-12-20-812.jpg",
            "bannerImg": "/v1703114807/my-mini-blog/banner_img/banner-6581608ea6a75f34c6363302_2023-12-20-829.jpg",
            "content": "This content has been editted, so it no longer has typo or such.",
            "tags": [
                "array",
                "of-string"
            ],
            "createdAt": "2023-12-19T09:15:54.918Z",
            "updatedAt": "2023-12-20T23:26:51.893Z",
            "user": "655f6a6feea8c6dc6f4f1227",
            "commentCount": 2,
            "slug": "this-is-a-new-title-for-an-editted-post",
            "id": "6581608ea6a75f34c6363302"
        }
    }
}
```
## Delete Blogpost
```HTTP
DELETE /api/v1/blogposts/:id
```
🔒 Delete a blogpost and its comments by providing the blogpost's ID.

## Create New Comment
```HTTP
POST /api/v1/comments/
```
🔒 Create new comment by posting string of comment and blogpost's ID. User's ID is derived from the current logged in user's JWT token.

**Body**
```JSON
{
    "comment": "Posting comment here. Is it working?",
    "blogpost": "6596c872c880de6594f068fa"
}
```

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "comment": "Posting comment here. Is it working?",
            "createdAt": "2024-01-04T14:53:38.903Z",
            "updatedAt": "2024-01-04T14:53:38.903Z",
            "blogpost": "6596c872c880de6594f068fa",
            "user": "6587636b3aaae95c590ce7ff",
            "_id": "6596c8bbc880de6594f068fd",
            "id": "6596c8bbc880de6594f068fd"
        }
    }
}
```
## Get All Comments
```HTTP
GET /api/v1/comments/
```
Get all posted comments from all the blogposts and users, sorted from oldest to newest by default. 

**Query Parameters**
| param | type | description |
|:------|:-----|:------------|
|createdAt[gte]|`String`|Get comments that are created in or after the date mentioned. Date input is a string in format of "YYYY-MM-DD"|
|createdAt[lte]|`String`|Get comments that are created in or before the date mentioned. Can be included alongside of `createdAt[gte]` param|
|createdAt|`String`|Get comments in a range date by format of "YYYY-MM-DD,YYYY-MM-DD". Only select blogposts created in 24 hours if there's only one date present. API will return an error if `createdAt[gte]` or `createdAt[lte]` is also included|
|blogpost|`String`|Search comments that had been writen for blogpostId|
|user|`String`|Search comments that had been writen by userId|
|limit|`Number`|How many blogposts that can be included in a single page. The default number of limit is 100 comments per page|
|page|`Number`|Requested page number deducted from limit param and how many comments are found|

<br/>

**Response**
```JSON
{
    "status": "success",
    "results": 1,
    "data": [
        {
            "_id": "6596c8bbc880de6594f068fd",
            "comment": "Posting comment here. Is it working?",
            "createdAt": "2024-01-04T14:53:38.903Z",
            "updatedAt": "2024-01-04T14:53:38.903Z",
            "blogpost": {
                "_id": "6596c872c880de6594f068fa",
                "title": "This is Test Account's Post",
                "id": "6596c872c880de6594f068fa"
            },
            "user": {
                "_id": "6587636b3aaae95c590ce7ff",
                "name": "Test Account",
                "photo": "/my-mini-blog/user/default.jpg"
            },
            "id": "6596c8bbc880de6594f068fd"
        }
    ]
}
```

## Get Comment
```HTTP
GET /api/v1/comments/:id
```
Call a single comment by its ID and get the requested document with blogpost title it posted to and the user who had written it.  

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "6596c8bbc880de6594f068fd",
            "comment": "Posting comment here. Is it working?",
            "createdAt": "2024-01-04T14:53:38.903Z",
            "updatedAt": "2024-01-04T14:53:38.903Z",
            "blogpost": {
                "_id": "6596c872c880de6594f068fa",
                "title": "This is Test Account's Post",
                "id": "6596c872c880de6594f068fa"
            },
            "user": {
                "_id": "6587636b3aaae95c590ce7ff",
                "name": "Test Account",
                "photo": "/my-mini-blog/user/default.jpg"
            },
            "id": "6596c8bbc880de6594f068fd"
        }
    }
}
```

## Update Comment
## Delete Comment

## Create New Comment by BlogpostId
## Get All Comments by BlogpostsId
## Get Blogposts by UserId
## Get All Comments by UserId
