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
- [Update Current User Password](#update-current-user-password)
### Users
- [Get All Users](#get-all-users)
- [Get Current User](#get-current-user)
- [Get User](#get-user)
- [Get Users by nameRegex](#get-users-by-name-regex)
- [Update Current User](#update-current-user)
- [Update User](#update-user)
- [Delete Current User](#delete-current-user)
- [Delete User](#delete-user)
### Blogposts
- [Create New Blogpost](#create-new-blogpost) 🔒
- [Get All Blogposts](#get-all-blogposts)
- [Get All Tags](#get-all-tags)
- [Get Blogposts by Tags](#get-blogposts-by-tags)
- [Get Blogpost](#get-blogpost)
- [Update Blogpost](#update-blogpost) 🔒
- [Delete Blogpost](#delete-blogpost) 🔒
### Comments
- [Create New Comment](#create-new-comment)
- [Get All Comments](#get-all-comments)
- [Get Comment](#get-comment)
- [Update Comment](#update-comment)
- [Delete Comment](#delete-comment)
### Others
- [Create New Comment by BlogpostId](#create-new-comment-by-blogpostid)
- [Get All Comments by BlogpostId](#get-all-comments-by-blogpostid)
- [Get Blogposts by UserId](#get-blogposts-by-userid)
- [Get All Comments by UserId](#get-all-comments-by-userid)


note on symbols:<br/>
🔒 user needs to be authenticated in order to access this API endpoint.<br/>
🎫 only admin can access this API endpoint.

## Sign Up
## Log In
## Forgot Password
## Reset Password
## Update Current User Password

## Get All Users
## Get Current User
## Get User
## Get Users by nameRegex
## Update Current User
## Update User
## Delete Current User
## Delete User

## Create New Blogpost 

```HTTP
POST /api/v1/blogposts
```

🔒 Create a new blogpost by providing title and content at minimum. You can also add tags to your post before updating blogpost for image inclusion.

### Body
```JSON
{
  "title": "User's New Post, 4 Characters Minimum",
  "summary": "This is short summary of this post.",
  "content": "Insert long sentences here, 26 characters at minimum.",
  "tags": ["personal", "funny", "daily-life"]
}
```
### Response
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

### Query Parameters
| param | type | description |
|:------|:-----|:------------|
|fields |`String`|Restrict the fields returned when requesting blogposts. Example to exclude more than one field is divided by coma: "-slug,-thumbnail,-banner,-__v"
|createdAt[gte]|`String`|Get blogposts that are created in or after the date mentioned. Date input is a string in format of "YYYY-MM-DD"|
|createdAt[lte]|`String`|Get blogposts that are created in or before the date mentioned. Can be included alongside of `createdAt[gte]` param|
|createdAt|`String`|Get blogposts in a range date by format of "YYYY-MM-DD,YYYY-MM-DD". Only select blogposts created in 24 hours if there's only one date present. API will return an error if `createdAt[gte]` or `createdAt[lte]` is also included|
|user|`String`|Search blogposts that had been writen by userId|
|limit|`Number`|How many blogposts that can be included in a single page. The default number of limit is 100 blogposts per page|
|page|`Number`|Requested page number deducted from limit param and how many blogposts are found|


### Response
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

### Response
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

### Response
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

### Response
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
                "__v": 0,
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
                "__v": 0,
                "id": "658162f1a6a75f34c6363313"
              }
            ],
      "id": "657dc0cb998ee1e6ed20938c"          
    }
  ]
}
```
## Update Blogpost
## Delete Blogpost
```HTTP
DELETE /api/v1/blogposts/:id
```
🔒 Delete a blogpost and its comments by providing the blogpost's ID.

## Create New Comment
## Get All Comments
## Get Comment
## Update Comment
## Delete Comment

## Create New Comment by BlogpostId
## Get All Comments by BlogpostsId
## Get Blogposts by UserId
## Get All Comments by UserId
