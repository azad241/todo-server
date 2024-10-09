import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Context } from 'hono';

interface Todo {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const app = new Hono();

let todos: Todo[] = [];

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Root Route
app.get('/', (c: Context) => {
  const randomString = crypto.randomUUID();
  return c.text(`Server is Running! Random String to Check: ${randomString}`);
});

// Create a new todo
app.post('/todos', async (c: Context) => {
  try {
    let body: any;
    if (c.req.header('content-type')?.includes('application/json')) {
      body = await c.req.json();
    } else {
      body = await c.req.parseBody();
    }
    const { title, status = 'todo' }: { title: string; status?: string } = body;

    if (!title || title.length > 300) {
      return c.json({ message: 'Title is required and should be within 300 characters' }, 400);
    }

    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      status,
      createdAt: now,
      updatedAt: now,
    };

    todos.push(newTodo);

    return c.json({
      message: 'Todo created',
      todo: newTodo,
    }, 201);
  } catch (error) {
    return c.json({ message: 'Invalid JSON or request body' }, 400);
  }
});

// Get all todos
app.get('/todos', (c: Context) => {
  return c.json(todos);
});

// Get a specific todo by ID
app.get('/todos/:id', (c: Context) => {
  const { id } = c.req.param();
  const todo = todos.find(item => item.id === id);

  if (!todo) {
    return c.json({ message: 'Todo not found' }, 404);
  }

  return c.json(todo);
});

// Update a specific todo by ID
app.put('/todos/:id', async (c: Context) => {
  try {
    let body: any;
    if (c.req.header('content-type')?.includes('application/json')) {
      body = await c.req.json();
    } else {
      body = await c.req.parseBody();
    }
    const { id } = c.req.param();
    const { title, status }: { title?: string; status?: string } = body;
    const todoIndex = todos.findIndex(item => item.id === id);

    if (todoIndex === -1) {
      return c.json({ message: 'Todo not found' }, 404);
    }
    if (title == '' || title && title.length > 300) {
      return c.json({ message: 'Title is required, Cannot be empty string and should be within 300 characters'},
        400);
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      title: title || todos[todoIndex].title,
      status: status || todos[todoIndex].status,
      updatedAt: new Date().toISOString(),
    };

    return c.json({
      message: 'Todo updated',
      todo: todos[todoIndex],
    });
  } catch (error) {
    return c.json({ message: 'Invalid JSON data' }, 400);
  }
});

// Delete a specific todo by ID
app.delete('/todos/:id', (c: Context) => {
  const { id } = c.req.param();
  const todoIndex = todos.findIndex(item => item.id === id);

  if (todoIndex === -1) {
    return c.json({ message: 'Todo not found' }, 404);
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];

  return c.json({
    message: 'Todo deleted',
    todo: deletedTodo,
  });
});

// Delete all todos
app.delete('/todos', (c: Context) => {
  todos = [];

  return c.json({
    message: 'All todos have been deleted!',
  });
});

// Catch All route for undefined routes
app.all('*', (c: Context) => {
  const availableRoutes = [
    { method: 'GET', route: '/' },
    { method: 'POST', route: '/todos' },
    { method: 'GET', route: '/todos' },
    { method: 'GET', route: '/todos/:id' },
    { method: 'PUT', route: '/todos/:id' },
    { method: 'DELETE', route: '/todos/:id' },
    { method: 'DELETE', route: '/todos' },
  ];

  return c.json({
    message: 'Requested route not found. Here are the available routes:',
    routes: availableRoutes,
  }, 404);
});

console.log(`Server is running on port ${port}\nVisit: http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
