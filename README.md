# Simple ToDo Server using Hono

```
npm install
npm run dev
```

```
open http://localhost:3000
```

### Available Routes

```
GET     - http://localhost:3000/                  # Check server status
POST    - http://localhost:3000/todos             # Create a new todo {'title':'sample title'}
GET     - http://localhost:3000/todos             # Get all todos
GET     - http://localhost:3000/todos/:id         # Get a specific todo by id
PUT     - http://localhost:3000/todos/:id         # Update a specific todo {'title':'updated title', 'status':'in-progress'}
DELETE  - http://localhost:3000/todos/:id         # Delete a specific todo by id
DELETE  - http://localhost:3000/todos             # Delete all todos
```
