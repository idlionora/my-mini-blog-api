# myMiniBlog's API
myMiniBlog is a blog application built by integrating What You See is What You Get text editor into a ReactJS structure. The backend side of the application allows user to create an account, login, write blogs, edit them, and then shares their comments. The API for myMiniBlog is served by Express.js application connected to MongoDB by using Mongoose ODM. Image files are hosted in Cloudinary's platform after user uploaded their images through myMiniBlog's API.

### Rate Limit
There is a rate limit of **100 requests per hour** per IP address. If you exceed the rate limit, you will get an error message.

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
- [Create New Blogpost](#create-new-blogpost)
- [Get All Blogposts](#get-all-blogposts)
- [Get All Tags](#get-all-tags)
- [Get Blogposts by Tags](#get-blogposts-by-tags)
- [Get Blogpost](#get-blogpost)
- [Update Blogpost](#update-blogpost)
- [Delete Blogpost](#delete-blogpost)
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
## Get All Blogposts
## Get All Tags
## Get Blogposts by Tags
## Get Blogpost
## Update Blogpost
## Delete Blogpost

## Create New Comment
## Get All Comments
## Get Comment
## Update Comment
## Delete Comment

## Create New Comment by BlogpostId
## Get All Comments by BlogpostsId
## Get Blogposts by UserId
## Get All Comments by UserId
