### 需求

- elasticsearch 版本均为 6.3.2
- 不同的索引和数据录入到了相同版本的却不同的 es 中
- 不是整个 data 文件的拷贝，只是部分索引的迁移

### 使用工具 elasticdump

工具名称：elasticdump
描述：用于移动和保存索引的工具（Tools for moving and saving indices.）
npm 网站地址：<https://www.npmjs.com/package/elasticdump>
最新的版本说明：Version 6.1.0 and higher of Elasticdump contains a change to the upload/dump process. This change allows for overlapping promise processing. The benefit of which is improved performance due increased parallel processing, but a side-effect exists where-by records (data-set) aren't processing in sequential order (ordering is no longer guaranteed)
不准确翻译：Elasticdump 6.1.0 及更高版本包含对上载/转储过程的更改。此更改允许重叠的承诺处理。它的好处是由于增加了并行处理而提高了性能，但是存在一个副作用，即 by 记录（数据集）没有按顺序处理（不再保证排序）

### 安装

##### 1、使用 npm 进行 windows 上的全局安装

```cmake
npm install elasticdump -g
```

##### 2、使用 docker

地址：<https://hub.docker.com/r/taskrabbit/elasticsearch-dump/>

```bash
docker pull taskrabbit/elasticsearch-dump
```

附 docker 的使用例子：

```dockerfile
# Copy an index from production to staging with mappings:
docker run --rm -ti taskrabbit/elasticsearch-dump \
  --input=http://production.es.com:9200/my_index \
  --output=http://staging.es.com:9200/my_index \
  --type=mapping
docker run --rm -ti taskrabbit/elasticsearch-dump \
  --input=http://production.es.com:9200/my_index \
  --output=http://staging.es.com:9200/my_index \
  --type=data

# Backup index data to a file:
docker run --rm -ti -v /data:/tmp taskrabbit/elasticsearch-dump \
  --input=http://production.es.com:9200/my_index \
  --output=/tmp/my_index_mapping.json \
  --type=data
```

我没有使用 docker 的方式，是直接采用了直接在 windows 上全局安装

### 使用

elasticdump 通过将输入发送到输出工作。两者都可以是 Elasticsearch URL 或文件。

Elasticsearch：

- format: `{protocol}://{host}:{port}/{index}`
- example: `http://127.0.0.1:9200/my_index`

File:

- format: `{FilePath}`
- example: `/Users/evantahler/Desktop/dump.json`

开始使用：
type 为 mapping 是拷贝索引的构成

```routeros
elasticdump \
  --input=http://192.168.0.1:9200/my_index \
  --output=http://192.168.0.2:9200/my_index \
  --type=mapping
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-cff2a80248bd34b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

type 为 data 是拷贝索引的数据，可以不用拷贝索引的构成直接拷贝数据

```routeros
elasticdump \
  --input=http://production.es.com:9200/my_index \
  --output=http://staging.es.com:9200/my_index \
  --type=data
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-9536e6598c1da5a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 检查

通过 postman 或者浏览器请求`http://192.168.0.1:9200/_cat/indices`，查看导入索引的健康值，发现是不对的
![image.png](https://upload-images.jianshu.io/upload_images/12877063-e249d341d7b1b4d9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

用 postman 进行`put`请求`http://192.168.0.1:9200/_settings`，参数设置

```json
{
 "index":{
  "number_of_replicas":0
 }
}
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-faf2fa878e553ec1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

修改索引健康值
![image.png](https://upload-images.jianshu.io/upload_images/12877063-c71c5ac553342c06.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
