# 📌 NestJS Comment API Documentation

## **🔑 Authentication**

### **🔹 AniList OAuth Login**
- **Endpoint:** `GET /auth/login`
- **Description:** Redirects user to AniList for authentication.
- **Response:** Redirects to AniList login page.

### **🔹 AniList OAuth Callback**
- **Endpoint:** `GET /auth/callback?code=XYZ`
- **Description:** Exchanges AniList OAuth code for an access token and stores the session.
- **Response:**
  ```json
  {
    "accessToken": "YOUR_ACCESS_TOKEN",
    "user": { "id": 123456, "name": "Username" }
  }
  ```

### **🔹 Get Session Details**
- **Endpoint:** `GET /auth/session`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Description:** Returns session details if the user is authenticated.
- **Response:**
  ```json
  {
    "userId": 123456,
    "accessToken": "YOUR_ACCESS_TOKEN"
  }
  ```

---

## **💬 Comments API**

### **🔹 Create a Comment**
- **Endpoint:** `POST /comments`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Body:**
  ```json
  {
    "content": "This is a test comment",
    "targetId": 456
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "userId": 123456,
    "content": "This is a test comment",
    "targetId": 456,
    "parentId": null,
    "isEdited": false,
    "createdAt": "2025-03-06T10:00:00.000Z"
  }
  ```

### **🔹 Reply to a Comment**
- **Endpoint:** `POST /comments`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Body:**
  ```json
  {
    "content": "This is a reply",
    "targetId": 456,
    "parentId": 1
  }
  ```
- **Response:** Same as comment creation, but with `parentId` set.

### **🔹 Get All Comments for a Target**
- **Endpoint:** `GET /comments/:targetId`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "content": "Top-level comment",
      "replies": [
        {
          "id": 2,
          "content": "This is a reply",
          "parentId": 1,
          "replies": []
        }
      ]
    }
  ]
  ```

### **🔹 Edit a Comment**
- **Endpoint:** `PATCH /comments/:id`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Body:**
  ```json
  {
    "content": "Updated comment content"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "content": "Updated comment content",
    "isEdited": true
  }
  ```

### **🔹 Delete a Single Comment**
- **Endpoint:** `DELETE /comments/:id`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Response:** `{ "message": "Comment deleted successfully" }`

### **🔹 Delete Multiple Comments**
- **Endpoint:** `DELETE /comments/bulk`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Body:**
  ```json
  {
    "commentIds": [1, 2, 3]
  }
  ```
- **Response:** `{ "message": "Comments deleted successfully", "deletedCount": 3 }`

### **🔹 Delete All Comments (Admin Only)**
- **Endpoint:** `DELETE /comments/all`
- **Headers:** `{ "Authorization": "Bearer YOUR_ACCESS_TOKEN" }`
- **Response:** `{ "message": "All comments deleted successfully" }`

---

## **⚡ Rate Limiting**
| Route          | Limit |
|---------------|-------|
| `POST /comments` | 5 requests per minute |
| `DELETE /comments/:id` | 3 requests per minute |
| `PATCH /comments/:id` | 5 requests per minute |

---

## **✅ Summary**
- **Authentication** uses AniList OAuth.
- **Nested comments and replies** are stored in the same table (`parentId` for replies).
- **Users can edit, delete, and reply to comments.**
- **Rate limiting** prevents spam.

🚀 Your API is now well-documented and ready to use!

