## 配置云开发

cloudfunctions/openapi/config.json

1. collection 数据库表
2. secret 小程序密钥

```json
{
  "permissions": {
    "openapi": []
  },
  "collection": "money",
  "power_collection": "power",
  "secret": "APP secret",
  "file_type": 2,
  "weixin": "https://api.weixin.qq.com",
  "dev_env": "s-c7930",
  "prod_env": "prod-eeurh"
}
```