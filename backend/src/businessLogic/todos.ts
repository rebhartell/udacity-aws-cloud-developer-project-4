import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'
import { TodoAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/todos')

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  logger.info("get all todos for userId", {userId: userId})
  const todoItems = todoAccess.getAllTodos(userId)
  logger.info("retrieved all todos for userId", { todoItems: todoItems })
  return todoItems
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}
