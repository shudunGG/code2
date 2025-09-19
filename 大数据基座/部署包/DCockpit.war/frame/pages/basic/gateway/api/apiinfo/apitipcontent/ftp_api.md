# 请求、响应格式定义
**operateType说明：1（上传）、2（下载）、3（删除）**
## 上传
### 请求参数格式
- Content-Type：multipart/form-data
- 请求参数
```
	"filename":"文件路径（若有文件名则含后缀）",
    "fileparam":文件流,
    "operateType":1
```

## 响应参数格式
响应会以json形式返回
- 成功
```
{
    "custom": {
        "message": "upload file success"
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

## 下载
### 请求参数格式
- Content-Type：application/json
- 请求参数
```
	"params":"json字符串"
```
- json字符串格式如下：
```
{
	"filename":"文件路径（若有文件名则含后缀）",
    "operateType":2
}
```

## 响应参数格式
成功响应以文件流形式返回，失败响应会以json形式返回
- 成功
文件流

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

## 删除
### 请求参数格式
- Content-Type：application/json
- 请求参数
```
	"params":"json字符串"
```
- json字符串格式如下：
```
{
	"filename":"文件路径（若有文件名则含后缀）",
    "operateType":3
}
```

## 响应参数格式
响应会以json形式返回
- 成功
```
{
    "custom": {
        "message": "upload file success"
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

# 示例
以下提供三个示例，分别为：API请求示例、和 API返回示例。

## 上传
### 请求示例
- 请求方式：POST
- Content-Type：multipart/form-data
- 请求 path 为如下的 API：
```
/testftp
```
表单字段
```
filename="demo.txt"
fileparam=文件流
```
请求体

```
boundary=--------------------------811760658886556720883543
content-length: 342
Connection: keep-alive

----------------------------811760658886556720883543
Content-Disposition: form-data; name="filename"

demo.txt
----------------------------811760658886556720883543
Content-Disposition: form-data; name="fileparam"; filename="demo.txt"
Content-Type: text/plain

```

### 响应示例
```
{
    "custom": {
        "message": "upload file success"
    },
    "status": {
        "code": 200,
        "text": ""
    }
}
```

## 下载
### 请求示例
- 请求方式：GET
- Content-Type：application/json
- 请求 path 为如下的 API：
```
/testftp
```
请求体
```
{
	"filename":"demo.txt",
    "operateType":2
}
```

### 响应示例
响应体（响应体中为下载的文件内容）
```
演示文件内容
```

## 删除
### 请求示例
- 请求方式：DELETE
- Content-Type：application/json
- 请求 path 为如下的 API：
```
/testftp
```
请求体
```
{
	"filename":"demo.txt",
    "operateType":3
}
```

### 响应示例
```
{
    "custom": {
        "message": "delete file success"
    },
    "status": {
        "code": 200,
        "text": ""
    }
}
```