# 请求、响应格式定义
## 请求参数格式
- Content-Type：application/json
- 请求参数
```
	"params":"json字符串"
```
- json字符串格式如下：
```
{
	"columns":[{
		column: "表字段",
		value: "字段值"
	},
	……]
}
```

## 响应参数格式
响应会以json形式返回
- 成功
```
{
    "custom": {
        "message": "查询结果（json字符串）"
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
## 请求示例
- 请求方式：GET
- Content-Type：application/json
- 请求 path 为如下的 API：
```
/testdata
```
请求体
```
{
    "params": "{columns:[{\"column\": \"loginid\", \"value\": \"aa\"}, {\"column\": \"sex\", \"value\": \"男\"}]}"
}
```

### 响应示例
```
{
    "custom": {
        "message": "[{\"firstname\":\"\",\"framemj\":null,\"updatepwd\":\"2018-12-03 18:03:28\",\"timezone\":\"\",\"description\":\"\",\"issyncthirdparty\":null,\"adloginid\":\"\",\"title\":\"\",\"password\":\"7B21848AC9AF35BE0DDB2D6B9FC3851934DB8420\",\"allowuseemail\":null,\"prelang\":\"\",\"ordernumber\":0,\"fax\":\"\",\"email\":\"\",\"isenabled\":1,\"leaderguid\":\"\",\"loginid\":\"aa\",\"ouguid\":\"5e64e497-773b-4804-9dac-21c582e9f375\",\"telephoneoffice\":\"\",\"sex\":\"男\",\"mobile\":\"\",\"middlename\":\"\",\"oucodelevel\":null,\"lastname\":\"\",\"userguid\":\"c7eeec05-4ee8-4c5d-be5a-ef763fb2d300\",\"displayname\":\"aa\",\"md5id\":\"f4a1eae052167baae68ca4cfca29be0b\",\"updatetime\":null,\"row_id\":null,\"telephonehome\":\"\"}]"
    },
    "status": {
        "code": 200,
        "text": ""
    }
}
```