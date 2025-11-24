# 生成服务器 HTTPS 证书

## 证书链模拟方案（根证书+服务器证书）

- 生成根证书（自签名，需导入浏览器信任）

```bash
# 根证书私钥
openssl genrsa -out rootCA.key.pem 2048  
# 根证书CSR
openssl req -new -key rootCA.key.pem -out rootCA.csr.pem  
# 自签名根证书（有效期365天）
openssl x509 -req -days 365 -in rootCA.csr.pem -signkey rootCA.key.pem -out rootCA.crt.pem  
```

- 生成服务器证书（由根证书签发）

```bash
# 服务器私钥（同前）
openssl genrsa -out server.key.pem 2048  
# 服务器CSR（同前）
openssl req -new -key server.key.pem -out server.csr.pem  
# 根证书签发服务器证书（需SAN配置）
openssl x509 -req -days 365 -in server.csr.pem -CAkey rootCA.key.pem -CA rootCA.crt.pem -extfile server.ext -out server.crt.pem
```

**关键参数**：`-CA`（根证书）、`-CAkey`（根私钥）、`-extfile`（SAN配置文件`server.ext`）  

`server.ext`示例（需包含域名/IP）：  

```ini
  subjectAltName = @alt_names  
  [alt_names]  
  DNS = localhost  
  IP.1 = 127.0.0.1
```

- 导入根证书到浏览器

访问`chrome://certificate-manager/localcerts/usercerts` → 导入`rootCA.crt.pem`到“可信证书”

## 快速工具替代方案

使用mkcert一键生成可信证书：

```bash
# 安装本地根证书
mkcert -install  
# 为localhost生成证书
mkcert localhost  
```

原理：自动创建根证书并导入系统信任，再签发服务器证书
