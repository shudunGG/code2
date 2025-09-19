# 函数API使用说明
函数API是一个事件驱动的服务。函数的执行可以由事件驱动，即当某个事件发生时，该事件触发函数的执行。现在，函数API支持以 API 网关作为事件源。当请求设置函数API为后端服务的 API 时，API 网关会触发相应的函数，函数计算会将执行结果返回给 API 网关。

API 网关与函数API对接，可以让您以 API 形式安全地对外开放您的函数，并且解决认证、流量控制、数据转换等问题。

## 实现原理
用户按照约定参数格式请求API网关，API网关将请求转发给对应函数API，函数API进行计算后，将计算结果按约定格式做出响应。

## 请求、响应格式定义
### 函数API请求参数格式
- 请求方式：POST
当以函数作为 API 网关的后端服务时，API网关会把请求参数通过一个固定的结构传给函数作为入参（即SDK中的FunApiRequest）。函数通过如下结构去获取需要的参数，然后进行处理。
```
{
	"path":"api request path",
    "httpMethod":"请求方式名称",
    "headers":所有请求头，Map结构，key为请求头名，value为该请求头对应值,
    "queryParameters":查询参数，Map结构，key为参数名，value为该参数对应值,
    "body":"string of request payload"
}
```

### 函数API响应参数格式
函数API需按照SDK中提供的FunApiResponse类组织函数计算结果，FunApiResponse结构如下：
```
{
    "isBase64Encoded":true|false,
    "statusCode":httpStatusCode,
    "headers":{用户定义的response headers},
    "body":"..."
}
```
**当 body 内容为二进制编码时，需在函数中对 body 内容进行 Base64 编码，设置"isBase64Encoded" 的值为 "true"。如果 body 内容无需 Base64 编码，设置"isBase64Encoded" 的值为 "false"。**
响应会以json形式返回
- 成功
```
{
    "custom": {
        "message": "计算结果，json字符串"
    },
    "status": {
        "code": 200,
        "text": ""
    }
}
```

- 失败
```
{
    "custom": {
        "message": "失败原因"
    },
    "status": {
        "code": 400,
        "text": ""
    }
}
```

## 配置函数API
1. 模块：统一应用与服务->统一服务管理->API管理->新增API
2. 定义函数API，有以下必填项

字段名 | 值  | 说明
------------ | ------------- | ------------
API名称 | 用户自定义  | 函数API的名称
API源类型 | 函数API  | 必须选中为“函数API”
Path | 用户自定义 | 不能与已有API Path重复，配置后函数API请求路径为http://API网关调用地址/用户填写值
函数包名 | 用户自定义 | 与函数代码中的包名一致
函数类名 | 用户自定义 | 与函数代码中的类名一致
函数代码 | 用户自定义 | Java代码

3. 在保存函数API前，需要执行在线编译，编译通过后才能完成保存
在“在线编译”按钮下方显示编译结果和编译出现的异常，方便及时修正代码

## 函数代码规范
1. 函数代码需按以下形式引入SDK
```
import com.epoint.frame.function.sdk.FuncApiHandler;
import com.epoint.frame.function.sdk.FuncApiRequest;
import com.epoint.frame.function.sdk.FuncApiResponse;
```
2. 函数代码中的类必须实现SDK中定义的FuncApiHandler接口，即实现run方法为执行入口方法

### FuncApiRequest构造
```
/**
 * 函数API请求类
 * 
 */
public class FuncApiRequest
{
    private String path;
    private String httpMethod;
    private Map<String, Object> headers;
    private Map<String, Object> queryParameters;
    private String body;

    @Override
    public String toString() {
        return "Request{" + "path='" + path + '\'' + ", httpMethod='" + httpMethod + '\'' + ", headers=" + headers
                + ", queryParameters=" + queryParameters + ", body='" + body + '}';
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    public Map<String, Object> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, Object> headers) {
        this.headers = headers;
    }

    public Map<String, Object> getQueryParameters() {
        return queryParameters;
    }

    public void setQueryParameters(Map<String, Object> queryParameters) {
        this.queryParameters = queryParameters;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

}
```

### FuncApiResponse构造
```
/**
 * 函数API响应类
 * 
 */
public class FuncApiResponse
{
    private Map<Object, Object> headers;
    private boolean isBase64Encoded;
    private int statusCode;
    private String body;

    public FuncApiResponse(Map<Object, Object> headers, boolean isBase64Encoded, int statusCode, String body) {
        this.headers = headers;
        this.isBase64Encoded = isBase64Encoded;
        this.statusCode = statusCode;
        this.body = body;
    }

    public Map<Object, Object> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<Object, Object> headers) {
        this.headers = headers;
    }

    public boolean getIsBase64Encoded() {
        return isBase64Encoded;
    }

    public void setIsBase64Encoded(boolean base64Encoded) {
        this.isBase64Encoded = base64Encoded;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
```

## 示例
以下提供三个示例，分别为：函数代码示例、API请求示例、和 API网关返回示例。

### 函数代码示例
```
package com.epoint.frame.test;

import com.epoint.frame.function.sdk.FuncApiHandler;
import com.epoint.frame.function.sdk.FuncApiRequest;
import com.epoint.frame.function.sdk.FuncApiResponse;
import java.util.Map;

public class Hello implements FuncApiHandler
{
    @Override
    public FuncApiResponse run(FuncApiRequest funApiRequest) {
        String body = funApiRequest.getBody();
		Map<String, Object> queryParametersMap = funApiRequest.getQueryParameters();
		String name = (String)queryParametersMap.get("name");
		String result = name + body;
        System.out.println(result);
        return new FuncApiResponse(null, false, 200, result);
    }
}
```

### 请求示例
- 请求方式：POST
- Content-Type：text/plain
- 请求 path 为如下的 API：
```
/testfunc?name=Jason
```
请求体
```
requested the API
```

### 响应示例
```
{
    "custom": {
        "message": "{\"body\":\"Jason requested the API\",\"headers\":null,\"isBase64Encoded\":false,\"statusCode\":200}"
    },
    "status": {
        "code": 200,
        "text": ""
    }
}
```