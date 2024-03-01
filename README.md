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
- [Get Users by nameRegex](#get-users-by-nameregex)
- [Update Current User](#update-current-user) 🔒
- [Update User](#update-user) 🎫
- [Delete Current User](#delete-current-user) 🔒
- [Delete User](#delete-user) 🎫
### Blogposts
- [Create New Blogpost](#create-new-blogpost) 🔒
- [Get All Blogposts](#get-all-blogposts)
- [Get Blogpost](#get-blogpost)
- [Update Blogpost](#update-blogpost) 🔒
- [Delete Blogpost](#delete-blogpost) 🔒
### Tags
- [Create New Tag](#create-new-tag) 🎫
- [Get All Tags](#get-all-tags)
- [Get Tag](#get-tag)
- [Update Tag](#update-tag) 🎫
- [Delete Tag](#delete-tag) 🎫
### Comments
- [Create New Comment](#create-new-comment) 🔒
- [Get All Comments](#get-all-comments)
- [Get Comment](#get-comment)
- [Update Comment](#update-comment) 🔒
- [Delete Comment](#delete-comment) 🔒
### Others
- [Create New Comment by BlogpostId](#create-new-comment-by-blogpostid) 🔒
- [Get All Comments by BlogpostId](#get-all-comments-by-blogpostid)
- [Get All Tags by BlogpostId](#get-all-tags-by-blogpostid)
- [Get Blogposts by UserId](#get-blogposts-by-userid)
- [Get All Comments by UserId](#get-all-comments-by-userid)


note on symbols:<br/>
🔒 user needs to be authenticated in order to access this API endpoint.<br/>
🎫 only admin can access this API endpoint.

## Sign Up

```HTTP
POST /api/v2/users/signup
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
POST /api/v2/users/login
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
POST /api/v2/users/login
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
PATCH /api/v2/users/resetPassword/:token
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
PATCH /api/v2/users/resetPassword/:token
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
------
✔💬 Below are descriptions for API endpoints related to **Users**. Click [here](#api-references) to go back to table of contents.

## Get All Users

```HTTP
GET /api/v2/users/
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
GET /api/v2/users/me
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
GET /api/v2/users/:id
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
GET /api/v2/users/search/:nameRegex
```
Get users' data which user's name is matching the regex keyword provided. The name search is case insensitive and the result will provide id and name fields.

**Response for /api/v2/users/search/b**
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
PATCH /api/v2/users/updateMe
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
PATCH /api/v2/users/:id
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
DELETE /api/v2/users/deleteMe
```
🔒 Set active: false for the current logged in user and hide data from showing in API responses.

## Delete User
```HTTP
DELETE /api/v2/users/:id
```
🎫 Remove user data permanently from mongoDB. Only admins can do this action. 

<br>

------
✔💬 Below are descriptions for API endpoints related to **Blogposts**. Click [here](#api-references) to go back to table of contents.
## Create New Blogpost 

```HTTP
POST /api/v2/blogposts
```
🔒 Create a new blogpost by providing title and content at the minimum. You can also add tags and summary to your post. Image representations can also be provided by uploading blogpostImg and bannerImg as form-data files. (See [Update Blogpost](#update-blogpost) for form-data example). Make sure the value for `tags` is submitted in correct data-type as to not mess with the tag updating middleware!

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
GET /api/v2/blogposts
```

Get all active blogposts that had been created before. The response is sorted by blogpost's createdAt from new to old.

**Query Parameters**
| param | type | description |
|:------|:-----|:------------|
|fields |`String`|Restrict the fields returned when requesting blogposts. Example to exclude more than one field is divided by coma: "-slug,-thumbnail,-banner,-__v"|
|_id|`String`|Search blogpost by ID, can return multiple blogposts when prompted (input multiple IDs separated by comma)|
|createdAt[gte]|`String`|Get blogposts that are created in or after the date mentioned. Date input is a string in format of "YYYY-MM-DD"|
|createdAt[lte]|`String`|Get blogposts that are created in or before the date mentioned. Can be included alongside of `createdAt[gte]` param|
|createdAt|`String`|Get blogposts in a range date by format of "YYYY-MM-DD,YYYY-MM-DD". Only select blogposts created in 24 hours if there's only one date present. API will return an error if `createdAt[gte]` or `createdAt[lte]` is also included|
|user|`String`|Search blogposts that had been writen by userId|
|tags|`String`|Search blogposts by its saved tags. If there were two or more tags provided (separated by comma), search result would only display posts with all of the tags included|
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
## Get Blogpost

```HTTP
GET /api/v2/blogposts/:id
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
PATCH /api/v2/blogposts/:id
```

🔒 Edit user's blogpost including adding blogpostImg and bannerImg. blogpostImg can be used as post's representative picture in main page, while bannerImg will be used as the leading image in the post's page. Only user who wrote the post and admins can perform this action.

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
DELETE /api/v2/blogposts/:id
```
🔒 Delete a blogpost by providing the blogpost's ID. Deleting a blogpost will also delete comments related, delete images in Cloudinary platform, and take the blogpost's ID off the Tag documents.

<br>

------
✔💬 Below are descriptions for API endpoints related to **Tags**. Click [here](#api-references) to go back to table of contents.
## Create New Tag 

```HTTP
POST /api/v2/tags
```
🎫 Create a new tag by directly inputing tag's name and/or blogpostIDs. (tag documents are automatically created when tags in blogposts are updated)

**Body**
```JSON
{
    "tag": "new user intro",
    "blogposts": []
}
```

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "tag": "new user intro",
            "blogposts": [
                "65c1b06904a3707cf58c1098"
            ],
            "_id": "65c8e5d5363ca0365b175529"
        }
    }
}
```

## Get All Tags
```HTTP
GET /api/v2/tags
```
Get all tags that had been created before. The response is sorted by tag's name.

**Query Parameters**
| param | type | description |
|:------|:-----|:------------|
|populate|`String`|input "true" to populate blogposts with blogpostImg, title, user, createdAt, summary, tags, commentCount, and slug|
|blogposts|`ObjectId`|Search tags which include all the blogpostIDs provided|
|tag|`String`|Search tag by tag's name, can return multiple tags when prompted (input multiple names separated by comma)|

**Response**
```JSON
{
    "status": "success",
    "results": 1,
    "data": [
        {
            "_id": "65c8e5d5363ca0365b175529",
            "tag": "new user intro",
            "blogposts": [
                {
                    "_id": "65c1b06904a3707cf58c1098",
                    "title": "Testing Destroy Image by Cld Id Tag",
                    "summary": "This is short summary of this post.",
                    "slug": "journaling-rubberducking-our-mind",
                    "blogpostImg": "/my-mini-blog/blogpost_img/default.jpg",
                    "tags": [ "new user intro" ],
                    "createdAt": "2024-02-24T12:34:20.276Z",
                    "user": {
                        "_id": "6561dfed2e9013c758a7e675",
                        "name": "Fleetways"
                    },
                    "commentCount": 0,
                    "id": "65c1b06904a3707cf58c1098"
                }
            ]
        }
    ]
}
```
## Get Tag
```HTTP
GET /api/v2/tags/:id
```
Get a single tag by its ID. Adding populate=true for query param would not expand the blogposts object.

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "65c8e5d5363ca0365b175529",
            "tag": "new user intro",
            "blogposts": [
                "65c1b06904a3707cf58c1098"
            ]
        }
    }
}
```

## Update Tag
```HTTP
PATCH /api/v2/tags/:id
```
🎫 Update tag's name and array of blogposts manually. This endpoint is admin-only as to not disturb the flow of updating tags from /blogposts endpoints.

**Body**
```JSON
{
    "tag": "fun-house",
    "blogposts": ["65c1b06904a3707cf58c1098"]
}
```

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "65c8dbe808e1d032e71c11ed",
            "tag": "fun-house",
            "blogposts": [
                "65c1b06904a3707cf58c1098"
            ]
        }
    }
}
```

## Delete Tag
```HTTP
DELETE /api/v2/tags/:id
```
🎫 Delete a tag by providing the tag's ID. Deleting a tag will not update the tags array in blogpost's document.

<br>

------
✔💬 Below are descriptions for API endpoints related to **Comments**. Click [here](#api-references) to go back to table of contents.
## Create New Comment
```HTTP
POST /api/v2/comments/
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
GET /api/v2/comments/
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
GET /api/v2/comments/:id
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
```HTTP
PATCH /api/v2/comments/:id
```
🔒 Save new data for comment with ID provided in endpoint. Only user who wrote the comment and admins can update. The `user` field will persist unless an admin decided to input new ID. `updatedAt` field will be marked by `Date.now()`.

**Body**
```JSON
{
  "comment": "This comment is updated by admin. Thank you for participating.",
  "user": "655c7db100dd54c3bb607cd7"
}
```

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "_id": "6596c8bbc880de6594f068fd",
            "comment": "This comment is updated by admin. Thank you for participating.",
            "createdAt": "2024-01-04T14:53:38.903Z",
            "updatedAt": "2024-01-06T15:12:38.856Z",
            "blogpost": "6596c872c880de6594f068fa",
            "user": "655c7db100dd54c3bb607cd7",
            "id": "6596c8bbc880de6594f068fd"
        }
    }
}
```

## Delete Comment
```HTTP
DELETE /api/v2/comments/:id
```
🔒 Delete a comment by its ID. Deleting a comment will automatically update commentsNum for the associated blogpost. Note: this endpoint can be accessed by every user logged in and not secured for only the user making comment.

<br>

------

✔💬 Below are descriptions for API endpoints with blogpostId or userId in it. Click [here](#api-references) to go back to table of contents.

## Create New Comment by BlogpostId
```HTTP
POST /api/v2/blogposts/:blogpostId/comments
```
🔒 Create new comment by inputing blogpost's ID in API endpoint. User's ID is derived from the current logged in user's JWT token.

**Body**
```JSON
{
    "comment": "Posting comment by blogpost's ID here :)",
}
```

**Response**
```JSON
{
    "status": "success",
    "data": {
        "doc": {
            "comment": "Posting comment by blogpost's ID here :)",
            "createdAt": "2024-01-09T13:55:31.978Z",
            "updatedAt": "2024-01-09T13:55:31.978Z",
            "blogpost": "6596c872c880de6594f068fa",
            "user": "6587636b3aaae95c590ce7ff",
            "_id": "659d51e5d3fa56a30b06897d",
            "id": "659d51e5d3fa56a30b06897d"
        }
    }
}
```
## Get All Comments by BlogpostId
```HTTP
GET /api/v2/blogposts/:blogpostId/comments
```
Get all posted comments from specified blogpost, sorted from oldest to newest by default. 

**Response**
```JSON
{
    "status": "success",
    "results": 1,
    "data": [
        {
            "_id": "659d51e5d3fa56a30b06897d",
            "comment": "Posting comment by blogpost's ID here.",
            "createdAt": "2024-01-09T13:55:31.978Z",
            "updatedAt": "2024-01-09T14:07:24.975Z",
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
            "id": "659d51e5d3fa56a30b06897d"
        }
    ]
}
```

## Get All Tags by BlogpostId
```HTTP
GET /api/v2/blogposts/:blogpostId/tags
```
Get all Tag documents which list the blogpost's ID provided. You can also put populate=true query param in this endpoint. The search result is sorted by the tag's name. 

**Response**
```JSON
{
    "status": "success",
    "results": 3,
    "data": [
        {
            "_id": "65ca246ddc149658dd4035ae",
            "tag": "admin-post",
            "blogposts": [
                "65ca246ddc149658dd4035ab",
                "65ca225cdc149658dd40357a"
            ]
        },
        {
            "_id": "65ca225cdc149658dd403580",
            "tag": "personal",
            "blogposts": [
                "65ca225cdc149658dd40357a"
            ]
        },
        {
            "_id": "65ca219cdc149658dd40356e",
            "tag": "tag-edit",
            "blogposts": [
                "65ca225cdc149658dd40357a"
            ]
        }
    ]
}
```

## Get Blogposts by UserId
```HTTP
GET /api/v2/users/:userId/blogposts
```
Get all blogposts that had been posted by a user.

**Response**
```JSON
{
    "status": "success",
    "results": 1,
    "data": [
        {
            "_id": "6596c872c880de6594f068fa",
            "title": "This is Test Account's Post",
            "summary": "This is short summary of this post.",
            "blogpostImg": "/my-mini-blog/post_img/default.jpg",
            "blogthumbImg": "/my-mini-blog/thumb_img/default.jpg",
            "bannerImg": "/my-mini-blog/banner_img/default.jpg",
            "content": "Insert long sentences here, 26 characters at minimum.",
            "tags": [
                "test-post"
            ],
            "createdAt": "2024-01-04T14:53:38.868Z",
            "updatedAt": "2024-01-04T14:53:38.868Z",
            "user": {
                "_id": "6587636b3aaae95c590ce7ff",
                "name": "Test Account"
            },
            "commentCount": 1,
            "slug": "this-is-test-accounts-post",
            "id": "6596c872c880de6594f068fa"
        }
    ]
}
```

## Get All Comments by UserId
```HTTP
GET /api/v2/users/:userId/comments
```
Get all comments that had been posted by a user.

**Response**
```JSON
{
    "status": "success",
    "results": 1,
    "data": [
        {
            "_id": "659d51e5d3fa56a30b06897d",
            "comment": "Posting comment by blogpost's ID here.",
            "createdAt": "2024-01-09T13:55:31.978Z",
            "updatedAt": "2024-01-09T14:07:24.975Z",
            "blogpost": {
                "_id": "6596c872c880de6594f068fa",
                "title": "This is Test Account's Post",
                "id": "6596c872c880de6594f068fa"
            },
            "user": "6587636b3aaae95c590ce7ff",
            "id": "659d51e5d3fa56a30b06897d"
        }
    ]
}
```
