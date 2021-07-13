import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { createLogger } from '../utils/logger';

const logger = createLogger('lambda/utils')

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 * @returns a user id
 */
export function getUserId(event: APIGatewayProxyEvent): string {

  logger.info("getUserId")

  const jwtToken = getJwtToken(event)

  const userId = parseUserId(jwtToken)

  return userId
}


/**
 * Get a JWT token from an API Gateway event
 * @param event an event from API Gateway
 * @returns a JWT token
 */
 export function getJwtToken(event: APIGatewayProxyEvent): string {

  logger.info("getJwtToken")

  const authorization = event.headers.Authorization

  logger.info("extract event.headers.Authorization", { authorization: authorization})

  const split = authorization.split(' ')
  
  const jwtToken = split[1]

  return jwtToken
}