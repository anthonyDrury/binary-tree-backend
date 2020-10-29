"use strict";

import { APIGatewayProxyHandler } from "aws-lambda";
import { getNode } from "../clients/dynamo-tree.client";

export const getNodeHandler: APIGatewayProxyHandler = async (event) => {
  const nodeId = event.queryStringParameters.nodeId;
  console.log(nodeId);
  return await getNode(nodeId);
};
