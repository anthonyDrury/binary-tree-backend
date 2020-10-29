(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/handlers/post.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/clients/dynamo-tree.client.ts":
/*!*******************************************!*\
  !*** ./src/clients/dynamo-tree.client.ts ***!
  \*******************************************/
/*! exports provided: createNewNode, updatePrevNodeChild, getNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createNewNode\", function() { return createNewNode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updatePrevNodeChild\", function() { return updatePrevNodeChild; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getNode\", function() { return getNode; });\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst dynamoDb = new aws_sdk__WEBPACK_IMPORTED_MODULE_0__[\"DynamoDB\"].DocumentClient();\nconst binaryTreeTable = process.env.BINARY_TREE_TABLE;\nasync function createNewNode(id, text) {\n    const newId = Object(uuid__WEBPACK_IMPORTED_MODULE_1__[\"v4\"])();\n    const params = {\n        TableName: binaryTreeTable,\n        Item: {\n            parentNode: id,\n            id: newId,\n            text,\n        },\n    };\n    const prevRes = await updatePrevNodeChild(id, newId);\n    if (prevRes.Attributes === undefined) {\n        return prevRes;\n    }\n    return await new Promise((resolve, reject) => {\n        dynamoDb.put(params, function (error, data) {\n            if (error) {\n                reject({ statusCode: Number(error.code), body: error.message });\n            }\n            resolve({\n                statusCode: 200,\n                body: JSON.stringify(data),\n            });\n        });\n    }).then((result) => {\n        return result;\n    }, (err) => {\n        return err;\n    });\n    return;\n}\nasync function updatePrevNodeChild(headId, childId) {\n    const params = {\n        TableName: binaryTreeTable,\n        Key: {\n            id: headId,\n        },\n        ExpressionAttributeValues: {\n            \":child\": [childId],\n            \":size\": 2,\n        },\n        ConditionExpression: \"size(children) < :size\",\n        UpdateExpression: \"SET children = list_append(children, :child)\",\n    };\n    return await new Promise((resolve, reject) => {\n        dynamoDb.update(params, function (error, data) {\n            if (error) {\n                reject({ statusCode: Number(error.code), body: error.message });\n            }\n            resolve(data);\n        });\n    }).then((result) => {\n        return result;\n    }, (err) => {\n        return err;\n    });\n}\nasync function getNode(id) {\n    const params = {\n        TableName: binaryTreeTable,\n        Key: {\n            id,\n        },\n    };\n    return await new Promise((resolve, reject) => {\n        dynamoDb.get(params, (error, data) => {\n            if (error) {\n                reject({ statusCode: Number(error.code), body: error.message });\n                return;\n            }\n            resolve({\n                statusCode: 200,\n                body: JSON.stringify(data.Item),\n            });\n        });\n    }).then((result) => {\n        return result;\n    }, (err) => {\n        return err;\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xpZW50cy9keW5hbW8tdHJlZS5jbGllbnQudHMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY2xpZW50cy9keW5hbW8tdHJlZS5jbGllbnQudHM/ZTcyNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tIFwiYXdzLXNka1wiO1xuaW1wb3J0IHsgVXBkYXRlSXRlbU91dHB1dCB9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvZHluYW1vZGJcIjtcbmltcG9ydCB7IHY0IGFzIHV1aWR2NCB9IGZyb20gXCJ1dWlkXCI7XG5cbmNvbnN0IGR5bmFtb0RiID0gbmV3IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5jb25zdCBiaW5hcnlUcmVlVGFibGUgPSBwcm9jZXNzLmVudi5CSU5BUllfVFJFRV9UQUJMRTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU5ld05vZGUoXG4gIGlkOiBzdHJpbmcsXG4gIHRleHQ6IHN0cmluZ1xuKTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+IHtcbiAgY29uc3QgbmV3SWQgPSB1dWlkdjQoKTtcbiAgY29uc3QgcGFyYW1zOiBEeW5hbW9EQi5Eb2N1bWVudENsaWVudC5QdXRJdGVtSW5wdXQgPSB7XG4gICAgVGFibGVOYW1lOiBiaW5hcnlUcmVlVGFibGUsXG4gICAgSXRlbToge1xuICAgICAgcGFyZW50Tm9kZTogaWQsXG4gICAgICBpZDogbmV3SWQsXG4gICAgICB0ZXh0LFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcHJldlJlczpcbiAgICB8IEFQSUdhdGV3YXlQcm94eVJlc3VsdFxuICAgIHwgVXBkYXRlSXRlbU91dHB1dCA9IGF3YWl0IHVwZGF0ZVByZXZOb2RlQ2hpbGQoaWQsIG5ld0lkKTtcblxuICAvLyBJZiB1cGRhdGluZyB0aGUgaGVhZCBmYWlscyBkbyBub3QgY3JlYXRlIHRoZSBjaGlsZFxuICBpZiAoKHByZXZSZXMgYXMgVXBkYXRlSXRlbU91dHB1dCkuQXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHByZXZSZXMgYXMgQVBJR2F0ZXdheVByb3h5UmVzdWx0O1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKFxuICAgIChcbiAgICAgIHJlc29sdmU6ICh4OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHZvaWQsXG4gICAgICByZWplY3Q6IChlcnI6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4gdm9pZFxuICAgICk6IHZvaWQgPT4ge1xuICAgICAgZHluYW1vRGIucHV0KHBhcmFtcywgZnVuY3Rpb24gKGVycm9yLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdCh7IHN0YXR1c0NvZGU6IE51bWJlcihlcnJvci5jb2RlKSwgYm9keTogZXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICApLnRoZW4oXG4gICAgKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIChlcnIpID0+IHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICApO1xuXG4gIHJldHVybjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVByZXZOb2RlQ2hpbGQoXG4gIGhlYWRJZDogc3RyaW5nLFxuICBjaGlsZElkOiBzdHJpbmdcbik6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0IHwgRHluYW1vREIuRG9jdW1lbnRDbGllbnQuVXBkYXRlSXRlbU91dHB1dD4ge1xuICBjb25zdCBwYXJhbXM6IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50LlVwZGF0ZUl0ZW1JbnB1dCA9IHtcbiAgICBUYWJsZU5hbWU6IGJpbmFyeVRyZWVUYWJsZSxcbiAgICBLZXk6IHtcbiAgICAgIGlkOiBoZWFkSWQsXG4gICAgfSxcbiAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICBcIjpjaGlsZFwiOiBbY2hpbGRJZF0sXG4gICAgICBcIjpzaXplXCI6IDIsXG4gICAgfSxcbiAgICBDb25kaXRpb25FeHByZXNzaW9uOiBcInNpemUoY2hpbGRyZW4pIDwgOnNpemVcIixcbiAgICBVcGRhdGVFeHByZXNzaW9uOiBcIlNFVCBjaGlsZHJlbiA9IGxpc3RfYXBwZW5kKGNoaWxkcmVuLCA6Y2hpbGQpXCIsXG4gIH07XG5cbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKFxuICAgIChcbiAgICAgIHJlc29sdmU6ICh4OiBEeW5hbW9EQi5Eb2N1bWVudENsaWVudC5VcGRhdGVJdGVtT3V0cHV0KSA9PiB2b2lkLFxuICAgICAgcmVqZWN0OiAoZXJyOiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHZvaWRcbiAgICApOiB2b2lkID0+IHtcbiAgICAgIGR5bmFtb0RiLnVwZGF0ZShwYXJhbXMsIGZ1bmN0aW9uIChlcnJvciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoeyBzdGF0dXNDb2RlOiBOdW1iZXIoZXJyb3IuY29kZSksIGJvZHk6IGVycm9yLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKS50aGVuKFxuICAgIChyZXN1bHQpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICAoZXJyKSA9PiB7XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5vZGUoaWQ6IHN0cmluZykge1xuICBjb25zdCBwYXJhbXM6IER5bmFtb0RCLkRvY3VtZW50Q2xpZW50LkdldEl0ZW1JbnB1dCA9IHtcbiAgICBUYWJsZU5hbWU6IGJpbmFyeVRyZWVUYWJsZSxcbiAgICBLZXk6IHtcbiAgICAgIGlkLFxuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKFxuICAgIChcbiAgICAgIHJlc29sdmU6ICh4OiBBUElHYXRld2F5UHJveHlSZXN1bHQpID0+IHZvaWQsXG4gICAgICByZWplY3Q6IChlcnI6IEFQSUdhdGV3YXlQcm94eVJlc3VsdCkgPT4gdm9pZFxuICAgICk6IHZvaWQgPT4ge1xuICAgICAgZHluYW1vRGIuZ2V0KHBhcmFtcywgKGVycm9yLCBkYXRhKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdCh7IHN0YXR1c0NvZGU6IE51bWJlcihlcnJvci5jb2RlKSwgYm9keTogZXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEuSXRlbSksXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICApLnRoZW4oXG4gICAgKHJlc3VsdCkgPT4ge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICAgIChlcnIpID0+IHtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICApO1xufVxuIl0sIm1hcHBpbmdzIjoiQUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/clients/dynamo-tree.client.ts\n");

/***/ }),

/***/ "./src/handlers/post.ts":
/*!******************************!*\
  !*** ./src/handlers/post.ts ***!
  \******************************/
/*! exports provided: createNode */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createNode\", function() { return createNode; });\n/* harmony import */ var _clients_dynamo_tree_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../clients/dynamo-tree.client */ \"./src/clients/dynamo-tree.client.ts\");\n\n\nconst createNode = async (event) => {\n    const body = JSON.parse(event.body);\n    return Object(_clients_dynamo_tree_client__WEBPACK_IMPORTED_MODULE_0__[\"createNewNode\"])(body.headId, body.bodyText).then((res) => {\n        return res;\n    }, (err) => {\n        return {\n            statusCode: 200,\n            body: \"Error\",\n        };\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaGFuZGxlcnMvcG9zdC50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9oYW5kbGVycy9wb3N0LnRzPzAzYzQiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlIYW5kbGVyIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCB7IGNyZWF0ZU5ld05vZGUgfSBmcm9tIFwiLi4vY2xpZW50cy9keW5hbW8tdHJlZS5jbGllbnRcIjtcblxuLy8gQk9EWTpcbi8vIGhlYWRJZFxuLy8gYm9keVRleHRcbmV4cG9ydCBjb25zdCBjcmVhdGVOb2RlOiBBUElHYXRld2F5UHJveHlIYW5kbGVyID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGJvZHkgPSBKU09OLnBhcnNlKGV2ZW50LmJvZHkpO1xuICByZXR1cm4gY3JlYXRlTmV3Tm9kZShib2R5LmhlYWRJZCwgYm9keS5ib2R5VGV4dCkudGhlbihcbiAgICAocmVzKSA9PiB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG4gICAgKGVycikgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICBib2R5OiBcIkVycm9yXCIsXG4gICAgICB9O1xuICAgIH1cbiAgKTtcbn07XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/handlers/post.ts\n");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLXNkay5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImF3cy1zZGtcIj81MTQyIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImF3cy1zZGtcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///aws-sdk\n");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInV1aWRcIj8zNzEyIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///uuid\n");

/***/ })

/******/ })));