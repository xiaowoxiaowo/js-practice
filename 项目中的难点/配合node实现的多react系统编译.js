// 分为开发和生产模式，还建了一些通用组件库，在webpack中设置别名，可以在多个不同的react系统中引用

// 开发模式通过webpack watch监听所有系统
// webpack --watch --config ./config/webpack.dev.js
// webpack.dev.js中引用基本的webpack.config文件，webpack.config文件文件的entry入口，传入一个node生成的对象appEntryList
let appEntryList = {};
const src = path.resolve(__dirname, '../src');
const dirList = fs.readdirSync(src);
dirList.forEach(function(item) {
  if (fs.statSync(src + '//' + item).isDirectory()) {
    appEntryList[item] = path.resolve(__dirname, src + '//' + item + '//' + 'index.js');
  }
});

// 生产模式通过node运行一个build.js文件
const inquirer = require("inquirer");
const src = path.resolve(__dirname, '../src');
const dirList = fs.readdirSync(src);
const res = await inquirer.prompt([
  {
    type: "list",
    name: "project",
    message: "请选择一个项目进行打包",
    choices: dirList,
  },
]);

const file = res.project;
// node引入webpack.pro文件的配置，
// 匹配刚才选择的某一个项目，将原webpack.pro文件的entry对象替换为选择的这个项目

// 还要配置输出的文件路径和资源路径，使其单独打包成一个文件夹
config.output.path = path.resolve(__dirname, "../build/" + file);
config.output.publicPath = config.output.publicPath + file + "/";

// 还要修改file-load的loader配置里的publicPath，设置一些图片，字体文件的引用路径

// 最后通过引入的webpack进行打包
webpack(config).run();