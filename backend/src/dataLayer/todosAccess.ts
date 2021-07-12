import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodosTable = process.env.TODOS_TABLE,
    private readonly IndexName = process.env.INDEX_NAME) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log(`Getting all Todos for ${userId}`)

    const result = await this.docClient.query({
      TableName: this.TodosTable,
      IndexName: this.IndexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(Todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.TodosTable,
      Item: Todo
    }).promise()

    return Todo
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
