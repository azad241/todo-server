import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {v4} from 'uuid'; //for generating unique id

const app = new Hono()

let todos = [];

app.get('/', (c) => {
  const random_string = v4();
  return c.text(`Server is Running! Random String to Check: ${random_string}`);
})

app.post('/todos', async (c) => {
  const {title, status = 'todo'} = await c.req.json(); //need to handle params too
  if (!title) {
    return c.json({ message: 'Title is required' }, 400);
  }
  const now = new Date().toISOString();
  const newTodo = {
    'id' : v4(),
    'title': title,
    'status': status,
    'createdAt': now,
    'updatedAt': now,
  };
  todos.push(newTodo);
  
  return c.json({
    message: 'Todo created',
    todo: newTodo,
  }, 201);

});

app.get('/todos', (c) => {
  return c.json(todos);
});


app.get('/todos/:id', (c) => {
  const { id } = c.req.param();
  const todo = todos.find(item => item.id === id);

  if (!todo) {
    return c.json({ message: 'Todo not found' }, 404);
  }

  return c.json(todo);
});

app.put('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { title, status } = await c.req.json();
  const todoIndex = todos.findIndex(item => item.id === id);

  if (todoIndex === -1) {
    return c.json({ message: 'Todo not found' }, 404);
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
});

app.delete('/todos/:id', (c) => {
  const { id } = c.req.param();
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return c.json({ message: 'Todo not found' }, 404);
  }
  const deletedTodo = todos.splice(todoIndex, 1)[0];

  return c.json({
    message: 'Todo deleted',
    todo: deletedTodo,
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

//http://localhost:3000/todos
//http://localhost:3000/todos/id