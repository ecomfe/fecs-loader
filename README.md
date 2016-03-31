# fecs-loader
fecs loader (for webpack) —— webpack中的fecs检查工具
## Usage
安装fecs-loader

```shell
    npm install fecs-loader
```
如果less/css/js文件都check，可直接在原有webpack.config.js配置中的module.loaders的基础上加多一项

```js
{
    test: /\.(less|css|js)$/,
    loader: 'fecs-loader'
}
```
或者只针对某一类文件check，可在原有的loader配置中添加loader，如：

```js
{
    test: /\.js$/,
    loader: 'fecs-loader'
},
{
    test: /\.css$/,
    loader: 'style-loader!css-loader!fecs-loader'
},
{
    test: /\.less$/,
    loader: 'style-loader!css-loader!less-loader!fecs-loader'
}
```
因为webpack的loader调用的顺序是从后往前的，所以为了fecs-loader能check最原始的代码，请将fecs-loader放置在数组or叹号相连的loader中的最后