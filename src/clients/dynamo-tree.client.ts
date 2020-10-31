import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new DynamoDB.DocumentClient();
const binaryTreeTable = process.env.BINARY_TREE_TABLE;

export async function createNewNode(
  id: string,
  text: string
): Promise<APIGatewayProxyResult> {
  const newId = uuidv4();
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: binaryTreeTable,
    Item: {
      parentNode: id,
      id: newId,
      text,
    },
  };

  const prevRes: APIGatewayProxyResult | true = await updatePrevNodeChild(
    id,
    newId
  );

  // If updating the head fails do not create the child
  if (prevRes !== true) {
    return prevRes as APIGatewayProxyResult;
  }

  return await new Promise(
    (
      resolve: (x: APIGatewayProxyResult) => void,
      reject: (err: APIGatewayProxyResult) => void
    ): void => {
      dynamoDb.put(params, function (error, data) {
        if (error) {
          reject({ statusCode: Number(error.code), body: error.message });
        }
        resolve({
          statusCode: 200,
          body: JSON.stringify(data),
        });
      });
    }
  ).then(
    (result) => {
      return result;
    },
    (err) => {
      return err;
    }
  );
}

export async function updatePrevNodeChild(
  headId: string,
  childId: string
): Promise<APIGatewayProxyResult | true> {
  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: binaryTreeTable,
    Key: {
      id: headId,
    },
    ExpressionAttributeValues: {
      ":child": [childId],
      ":size": 2,
    },
    ConditionExpression: "size(children) < :size",
    UpdateExpression: "SET children = list_append(children, :child)",
  };

  return await new Promise(
    (
      resolve: (x: DynamoDB.DocumentClient.UpdateItemOutput) => void,
      reject: (err: APIGatewayProxyResult) => void
    ): void => {
      dynamoDb.update(params, function (error, data) {
        if (error) {
          reject({ statusCode: Number(error.code), body: error.message });
        }
        resolve(data);
      });
    }
  ).then(
    (_) => {
      return true;
    },
    (err) => {
      return err;
    }
  );
}

export async function getNode(id: string) {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: binaryTreeTable,
    Key: {
      id,
    },
  };

  return await new Promise(
    (
      resolve: (x: APIGatewayProxyResult) => void,
      reject: (err: APIGatewayProxyResult) => void
    ): void => {
      dynamoDb.get(params, (error, data) => {
        if (error) {
          reject({ statusCode: Number(error.code), body: error.message });
          return;
        }
        resolve({
          statusCode: 200,
          body: JSON.stringify(data.Item),
        });
      });
    }
  ).then(
    (result) => {
      return result;
    },
    (err) => {
      return err;
    }
  );
}
