import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/todos')

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {

  logger.info("getAllTodos", { userId })

  const todoItems = todoAccess.getAllTodos(userId)

  logger.info("getAllTodos - retrieved all todos for userId", { todoItems })

  return todoItems
}

export async function deleteTodo(userId: string, todoId: string): Promise<TodoItem> {

  logger.info("deleteTodo", { userId, todoId })

  const deletedItem = todoAccess.deleteTodo(userId, todoId)

  logger.info("deleteTodo - deleted todo", { deletedItem })

  return deletedItem
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  logger.info("createTodo", { userId, createTodoRequest })

  const todoId = uuid.v4()

  const createdItem = await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done: false
  })

  logger.info("createTodo", { createdItem })

  return createdItem
}
