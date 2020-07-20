# Backend API Docs

## Users

### Register/Authenticate User

POST - /api/auth/signup

**Request format:**

```
{
  "username": "JohnDoe",
  "email": "john@email.com",
  "password": "12345678"
}
```

POST - /api/auth/login

**Request format:**

```
{
  "email": "john@email.com",
  "password": "12345678"
}
```

Both routes will respond with JSON:

**Response format:**

```
{
"token": json-webtoken-here
}
```

### Retrieve/Modify User(s) within database

GET - /api/users

> `GET http://localhost:3000/api/users/`

**Response format:**

```
[
  {
    "posts": [],
    "_id": "5f0e49b2691cc5bb91e88c1a",
    "username": "JohnDoe",
    "email": "john@email.com",
    "password": "$2a$10$H5oRsWyKxx74ynD1etWuQeRq7k.QpaEci.CyhJFYXnq.ALba1zUp6",
    "__v": 0
  },
]
```

GET - /api/users/:id

> `GET http://localhost:3000/api/users/5f0e52be2d7aa9d738cd0a8a`

**Response format:**

```
{
  "posts": [],
  "_id": "5f0e49b2691cc5bb91e88c1a",
  "username": "JohnDoe",
  "email": "john@email.com",
  "password": "$2a$10$H5oRsWyKxx74ynD1etWuQeRq7k.QpaEci.CyhJFYXnq.ALba1zUp6",
  "__v": 0
}
```

PUT - /api/users/:id

**Request format:**
All fields are optional, mongoose will apply changes to any valid fields

> `PUT http://localhost:3000/api/users/5f0e52be2d7aa9d738cd0a8a`

```
headers: {
  "auth-token": "insert JWT here"
},
body: {
  "username": "Jonothan Doe",
  "email": "johnnyboy@email.com",
}
```

**Response format:**

```
{
  "posts": [],
  "_id": "5f0e49b2691cc5bb91e88c1a",
  "username": "Jonothan Doe",
  "email": "johnnyboy@email.com",
  "password": "$2a$10$H5oRsWyKxx74ynD1etWuQeRq7k.QpaEci.CyhJFYXnq.ALba1zUp6",
  "__v": 0
}
```

DELETE - /api/users/:id

> `DELETE http://localhost:3000/api/users/5f0e52be2d7aa9d738cd0a8a`

**Request format:**

```
"headers": {
  "auth-token": "insert JWT here"
}
```

**Response format:**

```
{
  "message": "User successfully deleted",
  "id": "Id of deleted user"
}
```

## Posts

### Create Post

DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT
DONT FORGET TO FILL THIS OUT

### Retrieve/Modify Post(s)

PUT - /api/posts/:id

**Request format:**
All fields are optional, mongoose will apply changes to any valid fields.
Requires the JWT of the user who created the post.

> `PUT http://localhost:3000/api/posts/5f0e9862e3368b517f36e363`

```
headers: {
  "auth-token": "insert JWT here"
},
body: {
  "caption": "This is updating the caption"
}
```

**Response format:**

```
{
  "comments": [],
  "tags": [],
  "images": [
      "imageID"
  ],
  "_id": "5f0e9862e3368b517f36e363",
  "caption": "This is updating the caption",
  "date": "2020-07-15T05:47:14.005Z",
  "__v": 0
}
```

## Images

### Create new Image

POST - /api/images/

**Request format:**

> `POST http://localhost:3000/api/images/`

```
headers: {
  "auth-token": "insert JWT here"
},
body: {
  "url": "url for s3 image location",
  "tags": ["array", "of", "tags"],
  "posts": ["array", "of", "post", "IDs"],
  "visibility": "3"
}
```

**Response format:**

```
{
  "tags": [],
  "posts": [],
  "_id": "5f0fa7af68fb54de33e2061b",
  "url": "http://someurl.com/someotherstuff",
  "visibility": "1",
  "__v": 0
}
```

### Retrieve / Modify Images

GET - /api/images

> `GET http://localhost:3000/api/images/`

**Response format:**

```
[
  {
    "tags": [],
    "posts": [],
    "_id": "5f0fa7af68fb54de33e2061b",
    "url": "http://someurl.com/someotherstuff",
    "visibility": "1",
    "__v": 0
  }
]
```

GET - /api/images/:id

> `GET http://localhost:3000/api/images/5f0fa7af68fb54de33e2061b`

**Response format:**

```
{
  "tags": [],
  "posts": [],
  "_id": "5f0fa7af68fb54de33e2061b",
  "url": "http://someurl.com/someotherstuff",
  "visibility": "1",
  "__v": 0
}
```

PUT - /api/images/:id

**Request format:**
All fields are optional, mongoose will apply changes to any valid fields.
Requires the JWT of the user who created the image.

> `PUT http://localhost:3000/api/images/5f0fa7af68fb54de33e2061b`

```
headers: {
  "auth-token": "insert JWT here"
},
body: {
  "tags": ["New tag"]
}
```

**Response format:**

```
{
  "tags": [
    "New tag"
  ],
  "posts": [],
  "_id": "5f0fa7af68fb54de33e2061b",
  "url": "http://someurl.com/someotherstuff",
  "visibility": "1",
  "__v": 0
}
```

DELETE - /api/images/:id

> `DELETE http://localhost:3000/api/images/5f0fa7af68fb54de33e2061b`

**Request format:**

```
"headers": {
  "auth-token": "insert JWT here"
}
```

**Response format:**

```
{
  "message": "Image successfully deleted",
  "id": "5f0fa7af68fb54de33e2061b"
}
```

## Tags

### Create a Tag

POST - /api/tags/

**Request format:**
Tag names need to be unique, if a tag already exists with that name, error will be returned.

> `POST http://localhost:3000/api/tags/`

```
headers: {
  "auth-token": "insert JWT here"
},
body: {
  "tag": "name of the tag",
  "posts": ["array", "of", "post", "IDs"],
  "images": ["array", "of", "image", "IDs"]
}
```

**Response format:**

```
{
  "tag": "name of the tag",
  "posts": [],
  "_id": "5f0fa7af68fb54de33e2020c",
  "images": [],
  "__v": 0
}
```

### Retrieve / Modify Tags

GET - /api/tags

> `GET http://localhost:3000/api/tags/`

**Response format:**

```
[
  {
    "tag": "name of the tag",
    "posts": [],
    "_id": "5f0fa7af68fb54de33e2020c",
    "images": [],
    "__v": 0
  }
]
```

GET - /api/tags/:tagName

> `GET http://localhost:3000/api/tags/:tagName`

**Response format:**

```
{
  "tag": "name of the tag",
  "posts": [],
  "_id": "5f0fa7af68fb54de33e2020c",
  "images": [],
  "__v": 0
}
```

PUT - /api/tags/:tagName

**Request format:**
All fields are optional, mongoose will apply changes to any valid fields.
Requires the JWT of the user who created the image.

> `PUT http://localhost:3000/api/tags/bbq`

```
headers: {
  "auth-token": "insert JWT here"
},
body: {
  "posts": ["New post ID"],
  "images": ["New image ID"],
}
```

**Response format:**

```
{
  "tag": "bbq",
  "posts": ["New post ID"],
  "_id": "5f0fa7af68fb54de33e2020c",
  "images": ["New image ID"],
  "__v": 0
}
```

DELETE - /api/tags/:tagName

> `DELETE http://localhost:3000/api/tags/bbq`

**Request format:**

```

"headers": {
"auth-token": "insert JWT here"
}

```

**Response format:**

```

{
"message": "Tag successfully deleted",
"id": "5f0fa7af68fb54de33e2020c"
}

```
