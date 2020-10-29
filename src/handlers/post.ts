"use strict";
import { APIGatewayProxyHandler } from "aws-lambda";
import { createNewNode } from "../clients/dynamo-tree.client";

// BODY:
// headId
// bodyText
export const createNode: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body);
  return createNewNode(body.headId, body.bodyText).then(
    (res) => {
      return res;
    },
    (err) => {
      return {
        statusCode: 200,
        body: "Error",
      };
    }
  );
};
