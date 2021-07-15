import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const logger = createLogger('dataLayer/todosAccess')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly IndexName = process.env.INDEX_NAME) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {

    logger.info("getAllTodos", { userId })

    const params = {
      TableName: this.TodosTable,
      IndexName: this.IndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items = result.Items as TodoItem[]

    // remove the user id from the results
    items.forEach(item => { delete item.userId });

    return items
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {

    logger.info("createTodo", { todo })

    const params = {
      TableName: this.TodosTable,
      Item: todo
    }

    await this.docClient.put(params).promise()

    // remove the user id from the results
    delete todo.userId

    return todo
  }

  async deleteTodo(userId: string, todoId: string): Promise<TodoItem> {

    logger.info("deleteTodo", { userId, todoId })

    const params = {
      TableName: this.TodosTable,
      Key: { userId: userId, todoId: todoId },
      ReturnValues: "ALL_OLD"
    }

    const result = await this.docClient.delete(params).promise()

    if (!result.Attributes) {
      const errMsg = "Cannot delete item that does not exist"

      logger.info(`deleteTodo - ${errMsg}`)

      throw new Error(errMsg)
    }

    const todo = result.Attributes as TodoItem

    // remove the user id from the results
    delete todo.userId

    return todo
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
