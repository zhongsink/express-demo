module.exports = [
    {
        "hash": "626382856",
        "title": "Vue 技术总结",
        "user": "admin",
        "labels": [
            {
                "name": "总结"
            }
        ],
        "created_at": "2017-03-31T07:27:30Z",
        "updated_at": "2017-04-05T01:20:32Z",
        "body": "## Vue\r\n\r\n**父组件调用子组件方法**：首先需要在子组件中有一个 handleParentClick（方法名任取） 方法，然后在父组件中给子组件赋一个 ref，最后直接通过 ref 直接调用 handleParentClick 方法即可。\r\n\r\nchild.vue\r\n\r\n``` vue\r\n<template>\r\n  <div>child</div>\r\n</template>\r\n\r\n<script>\r\n  export default {\r\n    methods: {\r\n      handleParentClick() {\r\n        console.log('parent click');\r\n      }\r\n    }\r\n  }:\r\n</script>\r\n```\r\n\r\nparent.vue\r\n\r\n``` vue\r\n<template>\r\n  <div>\r\n    <button @click=\"handleClick\">点击</button>\r\n    <child ref=\"child\"></child>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\n  import Child from './child';\r\n  export default {\r\n    component: {\r\n      child: Child\r\n    },\r\n    methods: {\r\n      handleClick() {\r\n        this.$refs.child.handleParentClick();\r\n      }\r\n    }\r\n  };\r\n</script>\r\n```\r\n\r\n## Npm\r\n\r\n一直以来都为 ``node-sass`` 的安装而头疼，因为它不仅安装慢，而且没翻墙的话偶尔会安装失败。直到 google 到这篇[「安装 node-sass 的正确姿势」](https://github.com/lmk123/blog/issues/28)。\r\n\r\n其中我使用的是方法一，在项目内添加一个 ``.npmrc`` 文件：\r\n\r\n``` bash\r\nsass_binary_site=https://npm.taobao.org/mirrors/node-sass/\r\nphantomjs_cdnurl=http://cnpmjs.org/downloads\r\nelectron_mirror=https://npm.taobao.org/mirrors/electron/\r\nregistry=https://registry.npm.taobao.org\r\n```\r\n\r\n这样在不同的机器上 ``npm install`` 都会从淘宝源下载，但需要注意的是在使用 ``npm publish`` 时需要把 ``registry`` 这一行注释点，否则会发布到淘宝源上。\r\n\r\n## Webpack\r\n\r\n### postcss-loader & autoprefixer\r\n\r\n在使用 **Webpack 1.0** 配置 postcss-loader 的时候，autoprefixer 一直不生效，错误的配置代码如下：\r\n\r\n``` js\r\nmodule.exports = {\r\n  vue: {\r\n    loaders: {\r\n      css: ExtractTextPlugin.extract('css-loader'),\r\n      scss: ExtractTextPlugin.extract('vue-style-loader', 'css-loader', 'sass-loader'),\r\n      postcss: [\r\n        require('autoprefixer')()\r\n      ]\r\n    }\r\n  }\r\n};\r\n```\r\n\r\n谷歌了很久，尝试了很多修改，未果。后来发现要安装 ``autoprefixer``，于是：\r\n\r\n``` bash\r\n$ npm install autoprefixer --save-dev\r\n```\r\n\r\n以为可以了，结果还是没效果，郁闷。\r\n\r\n后来再次谷歌，突然发现我的 postcss 的位置写！错！了！\r\n\r\n``` js\r\nmodule.exports = {\r\n  vue: {\r\n    loaders: {\r\n      css: ExtractTextPlugin.extract('css-loader'),\r\n      scss: ExtractTextPlugin.extract('vue-style-loader', 'css-loader', 'sass-loader')\r\n    },\r\n    postcss: [\r\n      require('autoprefixer')()\r\n    ]\r\n  }\r\n};\r\n```\r\n\r\n### sass sourceMap\r\n\r\n在使用 **Webpack 2.0** 自定义配置的时候，发现 vue 单文件组件 sass-loader 的 sourceMap 没法定位到精确的位置（即具体的 sass 在 vue 文件中的行数，还有 @import 后 sass 文件里的代码行数）。\r\n\r\n通过与 vue-cli 中的 webpack 模板进行比较，将以下代码改动以下即可使 sourceMap 准确定位 sass 代码。需注意的是：以下的修改方法在 **Webpack 1.0** 中不！起！作！用！\r\n\r\n修改前：\r\n\r\n``` js\r\nmodule.exports = {\r\n  module: {\r\n    rules: [\r\n      {\r\n        test: /\\.vue$/,\r\n        loader: 'vue-loader',\r\n        options: {\r\n          loaders: {\r\n            'scss': 'vue-style-loader!css-loader!sass-loader'\r\n          }\r\n        }\r\n      }\r\n    ]\r\n  },\r\n  devtool: '#eval-source-map'\r\n}\r\n```\r\n\r\n修改后：\r\n\r\n``` js\r\nmodule.exports = {\r\n  module: {\r\n    rules: [\r\n      {\r\n        test: /\\.vue$/,\r\n        loader: 'vue-loader',\r\n        options: {\r\n          loaders: {\r\n            'scss': {\r\n              loader: 'vue-style-loader?sourceMap!css-loader?sourceMap!sass-loader',\r\n              options: {\r\n                sourceMap: true\r\n              }\r\n            }\r\n          }\r\n        }\r\n      }\r\n    ]\r\n  },\r\n  devtool: '#eval-source-map'\r\n}\r\n```\r\n\r\n### debugger\r\n\r\n一直以来 vue 单文件组件在 chrome debug 我都需要先 console.log() 一句话，然后从 console 里找到相应的行数进去才能够 debug，突然发现了这一条特殊语句 ``debugger``，妈妈再也不用担心我老是写 console.log() 来 debug 了。\r\n\r\n``` js\r\nexport default {\r\n  name: 'app',\r\n  data () {\r\n    return {\r\n      msg: 'Welcome to Your Vue.js App'\r\n    }\r\n  },\r\n\r\n  mounted() {\r\n    debugger  // 代码运行到此处会中断\r\n    console.log(111);\r\n  }\r\n}\r\n```\r\n"
    },
    {
        "hash": "713882856",
        "title": "使用 npm 和 bower 发布插件",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2017-03-06T02:04:58Z",
        "updated_at": "2017-03-06T02:07:34Z",
        "body": "我在 Github 上看到过一些第三方插件，除了可以使用 git clone 之外，它们还可以使用 npm 或 bower 进行安装。于是我也尝试把自己编写的一个 jQuery 插件发布到 npm 和 bower，并且效果还不错。项目源码请看[「jquery.nail」](https://github.com/cobish/jquery.nail)。\r\n\r\n首先编写好的源码得先打上 tag 版本号，然后 push 到 Github 上。第一个步骤算是完成了。\r\n\r\n## npm\r\n\r\n先说 npm。npm 是 Nodejs 的包管理器，用过 gulp 的都知道很多 gulp 的插件都需要通过 npm 进行安装，现在也有许多其他的插件比如 jQuery 在 npm 上都搜得到。首先得安装 nodejs 和 npm，这里不细说了。\r\n\r\n在使用 npm 之前需要注意，如果你在大天朝使用的是淘宝镜像的话是无法发布的，它没有 addUser 这一条命令，这时需先暂时将 npm 淘宝镜像清除：\r\n\r\n``` bash\r\n$ npm config delete registry\r\n$ npm config delete disturl\r\n```\r\n\r\n然后得在 npm 的官网上注册一个账号，接着电脑上需添加 npm 账号，输入以下命令进行添加：\r\n\r\n``` bash\r\n$ npm addUser\r\n```\r\n\r\n接着再输入一条命令就能把源码发布到 npm 上：\r\n\r\n``` bash\r\n$ npm publish\r\n```\r\n\r\n搞定！很方便是吧，可以在 npm 官网上看能不能搜索到你刚刚发布的插件，或者是电脑上直接安装一下：\r\n\r\n``` bash\r\n$ npm install jquery.nail --save-dev\r\n```\r\n\r\npublish 完成之后再将淘宝镜像添加回来即可：\r\n\r\n``` bash\r\n$ npm config set registry https://registry.npm.taobao.org\r\n$ npm config list\r\n```\r\n\r\n## bower\r\n\r\n接着是 bower。bower 也是一个包管理器，bower 的安装参考这篇[「bower简明入门教程」](https://segmentfault.com/a/1190000002971135)。bower 的发布需新建一个 bower.json 文件，内容的填写跟 package.json 很相似，接着注册项目即可：\r\n\r\n``` bash\r\n$ bower register jquery.nail https://github.com/cobish/jquery.nail\r\n```\r\n\r\nbower register 后面的两个参数分别是项目名和 Github 的项目地址。注册完成如果没有相同的项目名就会发布成功，这时也可以尝试在本地上进行安装：\r\n\r\n``` bash\r\n$ bower install jquery.nail --save-dev\r\n```\r\n\r\n安装完成，完美！到此发现，实际上 npm 和 bower 的发布都异常的简单，总共加起来才三条命令，赶紧试试吧。"
    },
    {
        "hash": "790882683",
        "title": "Webpack 构建单页面应用",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2017-02-28T03:07:41Z",
        "updated_at": "2017-03-07T05:49:08Z",
        "body": "捣鼓了一段时间的 Webpack 和 Vue，是时候写出一篇文章来反馈一下学习情况，也正好为接下来的项目做做准备。Webpack 对于 Vue 或是 React 的单页面应用来说简直就是居家必备，Vue 也有相应的脚手架[「vue-cli」](https://github.com/vuejs/vue-cli)。但是由于具体的项目有特殊的配置，加上代码比较复杂，于是干脆就自己实现一个简单的 Webpack 配置，主要是参考了这一篇[「webpack 单页面应用实战」](http://huangsw.com/2016/07/12/webpack%20%E5%8D%95%E9%A1%B5%E9%9D%A2%E5%BA%94%E7%94%A8%E5%AE%9E%E6%88%98/)的思路。接下来的内容我将结合[「vue-spa-project」](https://github.com/cobish/vue-spa-project)这个示例来介绍，具体详情可以参考源代码。\r\n\r\n## 目录结构\r\n\r\n``` bash\r\n├─ dist/                  # 发布（调试）模式下生成的运行代码\r\n├─ server/                # node server，用于开发模式下模拟网络请求\r\n├─ src/                   # 开发目录\r\n    ├─ components/        # 存放html的目录\r\n    ├─ img/               # 存放图片的目录\r\n    ├─ style/             # 存放js的目录\r\n    ├─ App.vue            # 根组件\r\n    ├─ index.html         # 入口文件\r\n    ├─ index.js           # 入口文件\r\n    └─ routers.js         # 配置路由文件\r\n├─ package.json           # npm 包管理文件\r\n└─ webpack.config.js      # webpack 配置文件\r\n```\r\n\r\n## 区分开发、调试、发布阶段\r\n\r\n因为开发期间用到了 ``webpack-dev-server`` 来热替换，再加上使用了 ``node`` 来模拟网络请求，于是便有了**开发阶段**。由于正式的项目后端使用的是 ``PHP``，再加上未压缩合并打包的可调试代码，于是便有了**调试阶段**。调试通过，最后将静态资源压缩合并的则是**发布阶段**。\r\n\r\n### 开发阶段：\r\n\r\n-  ``webpack-dev-server`` 热替换，看不到 webpack 编译出的文件；\r\n-  ``node`` 代理模拟网络请求，``ajax`` 拦截；\r\n-  静态资源没有合并压缩。\r\n\r\n### 调试阶段：\r\n\r\n- 看得到 webpack 编译出的文件；\r\n- 监听代码改动，但不会自动刷新浏览；\r\n- ``PHP`` 或其它作为后端；\r\n- 静态资源没有合并压缩。\r\n\r\n### 发布阶段：\r\n\r\n- 看得到 webpack 变移除的文件；\r\n- ``PHP`` 或其它作为后端；\r\n- 静态资源进行了合并压缩，打上 hash 戳。\r\n\r\n不同的阶段使用到的不同命令在 ``package.json`` 文件中都有记录：\r\n\r\n``` js\r\n\"scripts\": {\r\n  \"start\": \"cross-env NODE_ENV=development webpack-dev-server\",\r\n  \"debug\": \"cross-env NODE_ENV=debug webpack --watch --colors --config webpack.config.js\",\r\n  \"build\": \"cross-env NODE_ENV=production webpack --colors --config webpack.config.js\"\r\n },\r\n```\r\n\r\n## 开发阶段\r\n\r\n开发阶段与其它两个阶段的不同之处在于两点：一是使用了 webpack-dev-server 来进行热替换，没有生成真实的运行文件；二是使用了 node 来进行 ajax 拦截。\r\n\r\n### 热替换\r\n\r\n这是一个神奇的东西，采用了 websocket 的技术来实现网页的部分替换。扯远了，实际上就是你改动了代码，浏览器只会刷新改动的那一部分效果，而不是整个页面重新刷新。它的实现估计不简单，但是使用起它来还是挺容易的。在 webpack 里的代码这么写就能实现热替换了：\r\n\r\n``` javascript\r\nmodule.export = {\r\n  devServer: {\r\n    color: true,\r\n    hot: true,\r\n    inline: true\r\n  },\r\n  plugins: [{\r\n    new webpack.HotModuleReplacementPlugin({\r\n      multiStep: true\r\n    })\r\n  }]\r\n};\r\n```\r\n\r\n### ajax 拦截\r\n\r\n这功能需要一个 node 服务（进入 server 目录，执行 ``node index.js``），监听着与 webpack-dev-server 不同的端口（比如 webpack-dev-server 监听的是 80 端口，node 服务监听 8888 端口）。然后需要在 webpack 设置代理，把 80 端口的 ajax 请求都拦截，然后去请求 8888 端口的接口即可。\r\n\r\n``` javascript\r\nmodule.export = {\r\n  devServer: {\r\n    historyApiFallback: true,\r\n    proxy: {\r\n      '/api/**': {\r\n        target: 'http://localhost:8888',\r\n        secure: false\r\n      }\r\n    }\r\n  }\r\n};\r\n```\r\n\r\n## 调试阶段\r\n\r\n调试阶段和发布阶段都没有使用 webpack-dev-server 和 ajax 拦截，因为实际上我们的后端并不是 nodejs，有可能是 PHP，也有可能是 Java。于是，调试阶段只是使用 webpack 来打包前端资源并监听资源改动，后端 API 接口则由 PHP 或 Java 提供。这个阶段主要是用来前后端联调 API 接口。\r\n\r\n## 发布阶段\r\n\r\n发布阶段与调试阶段的不同在于，它把静态资源都进行了合并压缩，并打上了 hash 戳，即多用到了几个 webpack 插件：\r\n\r\n``` javascript\r\nvar webpack = require('webpack');\r\nvar WebpackMd5Hash = require('webpack-md5-hash');\r\n\r\nmodule.export = {\r\n  plugins: [\r\n    new webpack.DefinePlugin({\r\n      'process.env': {\r\n        NODE_ENV: '\"production\"'\r\n      }\r\n      }),\r\n      new webpack.optimize.UglifyJsPlugin({\r\n        minimize: true,\r\n        output: {\r\n        comments: false,\r\n      },\r\n      compress: {\r\n        warnings: false\r\n      }\r\n      }),\r\n      new WebpackMd5Hash()\r\n  ]\r\n};\r\n```\r\n\r\n## 结尾\r\n\r\n这一篇文章主要提供了一个前后端分离的方法，使用 webpack 让前端开发者在开发阶段不依赖后端。但是它也有局限性，一是它必须使用到 webpack-dev-server，因为要用到代理，当然也可能通过其它方式来实现代理；二是它是一个单页面应用，因为只有单页面应用才会在前端管理自己的路由，如果是多页面的话依然需要依赖到后端的路由。\r\n\r\n总结完这一篇文章，对 webpack 的学习也算是告一段落了，接下来我要去探索其它的未知技术了！"
    },
    {
        "hash": "853882756",
        "title": "Git 分支命令整理",
        "user": "admin",
        "labels": [
            {
                "name": "其它"
            }
        ],
        "created_at": "2017-02-05T03:07:41Z",
        "updated_at": "2017-07-07T05:49:08Z",
        "body": "## 创建分支\r\n\r\nGit 可以在本地任意并很快地创建分支，它实际上就在当前分支的基础上创建了一个新的指针，工作区的文件都没有任何的变化。\r\n\r\n创建一条分支 ``dev``，然后切换到 ``dev`` 分支的命令如下：\r\n\r\n``` bash\r\n$ git checkout -b dev\r\nSwitched to a new branch 'dev'\r\n```\r\n\r\n``git checkout`` 命令加上 ``-b`` 参数表示创建并切换分支，它相当于以下两条命令：\r\n\r\n``` bash\r\n$ git branch dev\r\n$ git checkout dev\r\nSwitched to branch 'dev'\r\n```\r\n\r\n## 查看分支\r\n\r\n一旦创建的分支多了起来，一时忘记了分支的名字，可以使用以下命令查看本地项目的所有分支：\r\n\r\n``` bash\r\n$ git branch\r\n  master\r\n* dev\r\n```\r\n\r\n当前所在的分支前面会标有一个 ``*`` 号，如果想顺便把远程的所有分支列出来，加上参数 ``-a``：\r\n\r\n``` bash\r\n$ git branch -a\r\n  master\r\n* dev\r\n  remotes/origin/HEAD -> origin/master\r\n  remotes/origin/master\r\n```\r\n\r\n## 推送分支\r\n\r\n刚刚创建的 ``dev`` 分支要推送到远程上，可以使用 ``push`` 命令：\r\n\r\n``` bash\r\n$ git push origin dev\r\n```\r\n\r\n再次查看远程分支，就会发现多了一条 ``origin/dev`` 的远程分支：\r\n\r\n``` bash\r\n$ git branch -a\r\n  master\r\n* dev\r\n  remotes/origin/HEAD -> origin/master\r\n  remotes/origin/master\r\n  remotes/origin/dev\r\n```\r\n\r\n## 切换分支\r\n\r\n不同的分支代表着项目不同的功能或模块的开发。 ``dev`` 分支上的模块开发完成后，这时想切换到 ``master`` 去开发另一个模块，则可以使用切换分支的命令：\r\n\r\n``` bash\r\n$ git checkout master\r\nSwitched to branch 'master'\r\nYour branch is up-to-date with 'origin/master'.\r\n```\r\n\r\n还有一种情况，\r\n\r\n## 合并分支\r\n\r\n开发完毕之后，这时 ``master`` 分支上是没有 ``dev`` 分支上的模块的。如果想要 ``master`` 分支上也有 ``dev`` 分支上的模块的话，则需要将 ``dev`` 合并到 ``master``。首先得确保当前的分支是 ``master`` ，然后执行合并命令：\r\n\r\n``` bash\r\n$ git merge dev\r\n```\r\n\r\n合并完成，如果有冲突的话则手动修改代码解决冲突即可。\r\n\r\n## 删除分支\r\n\r\n最后，``master`` 分支上有自己的模块和从 ``dev`` 分支那合并过来的模块，这时如果 ``dev`` 分支不再维护可以把它进行删除。使用 ``-d`` 参数表示删除分支：\r\n\r\n``` bash\r\n$ git branch -d dev\r\n```\r\n\r\n有时候遇到了删除失败的情况，那可能是当前分支的模块没有被合并到其他分支上，删除后可能该模块可能就没有了。如果这模块不想要的话，可以使用 ``-D`` 参数进行强制删除：\r\n\r\n``` bash\r\n$ git branch -D dev\r\n```\r\n\r\n前面的命令只删除了本地的 ``dev`` 分支，远程上的 ``origin/dev`` 分支还是存在的。如果也想顺便把它给删除了，则可以使用以下命令（注意：命令中的冒号前是有一个空格的）：\r\n\r\n``` bash\r\ngit push origin :dev\r\n```"
    },
    {
        "hash": "931882892",
        "title": "Vue 学习总结",
        "user": "admin",
        "labels": [
            {
                "name": "前端"
            }
        ],
        "created_at": "2017-01-24T02:41:00Z",
        "updated_at": "2017-01-26T01:13:26Z",
        "body": "在接触[「Vue」](https://cn.vuejs.org/v2/guide/)之前，其实我已经学习了一段时间的 React。一直没来得及总结 React，却先本末倒置地学习起 Vue 来了。也许我是有点浮躁，被技术的浪潮拍打着前进。总之，既然学习了，那就总结一下这一次的学习吧。\r\n\r\n## 比较\r\n\r\n### Vue vs jQuery\r\n\r\njQuery 是一名出色的老将，它的出现是 js 巨大的一次进步。jQuery 能够出色的操作 DOM 元素，但是操作 DOM 依然是一项麻烦的事情。你必须先获取到 DOM 元素，然后才能进行增删改操作。而 Vue 则是将 html 和 js 通过某种方式绑定在一起，只有修改了 js 里的数据，那么 html 也会跟着变化。相比于 jQuery，Vue 省去了开发者操作 DOM 的麻烦。\r\n\r\n### Vue vs React\r\n\r\nReact 是一款特别出色的库，它的虚拟 DOM 和组件化方式都是一种先进的思想，它的出现可以说是 js 的一次大变革。但是 React 的生态系统太过于庞大，不适合开发者短期之内掌握并使用于正式项目。因为它身后的 jsx、flux、redux、webpack、react-native、hot reload，React 并不能让团队里的每一个开发成员都能够快速上手。而 Vue 采用自底向上增量开发的设计，React 有的它也不缺。假如你还没接触 webpack，没关系，你可以直接 script 外部引入开包即用。相比于 React，Vue 能够更快地上手。\r\n\r\n## 使用\r\n\r\n### 基础语法\r\n\r\n通过 script 或者 webpack 等方式引入 Vue 文件之后，便可以通过构造函数创建一个 Vue 实例。实例中的 ``data`` 属性与 html 中的插值进行数据绑定。无论那一边的数据改动，另一个也会跟着一起变化。\r\n\r\n``` html\r\n<span id=\"app\">Message: {{ msg }}</span>\r\n```\r\n\r\n``` js\r\nnew Vue({\r\n  el: '#app',\r\n  data: {\r\n    msg: 'Hello World!'\r\n  }\r\n});\r\n```\r\n\r\nVue 的条件渲染与列表渲染跟模板引擎的写法很类似，在 HTML 中通过指令便可以使用条件判断与循环。\r\n\r\n``` html\r\n<h1 id=\"app-1\" v-if=\"ok\">Yes</h1>\r\n\r\n<ul id=\"app-2\">\r\n  <li v-for=\"item in items\">\r\n     {{ item.message }}\r\n  </li>\r\n</ul>\r\n```\r\n\r\n``` js\r\nvar app1 = new Vue({\r\n  el: '#app-1',\r\n  data: {\r\n    ok: true\r\n  }\r\n});\r\n\r\nvar app2 = new Vue({\r\n  el: '#app-2',\r\n  data: {\r\n    items: [{\r\n      message: 'Foo'\r\n    }, {\r\n      message: 'Bar'\r\n    }]\r\n  }\r\n});\r\n```\r\n\r\nVue 比 jQuery 简单之处有一项就在于事件的绑定上，jQuery 通常先给标签的 id 或 class 取名，然后通过获取的方式获取到 DOM 元素，然后再进行事件的绑定。而 Vue 则直接通过指令进行事件绑定。\r\n\r\n``` html\r\n<div id=\"app\">\r\n  <button v-on:click=\"addCounter\">增加 1</button>\r\n  <p>这个按钮被点击了 {{ counter }} 次。</p>\r\n</div>\r\n```\r\n\r\n``` js\r\nnew Vue({\r\n  el: '#app',\r\n  data： {\r\n    counter: 0\r\n  },\r\n  methods: {\r\n    addCounter: function() {\r\n      this.counter += 1;\r\n    }\r\n  }\r\n});\r\n```\r\n\r\n当然，Vue 最吸引人的功能之一就在于它的组件，组件可以扩展 HTML 元素，封装可重用的代码。Vue 注册组件的方式有两种，一种是全局注册，被注册的组件被称为全局组件，即可被全局使用；另一种则是局部注册，被注册出来的组件只能在特定的实例或组件中使用。\r\n\r\n全局组件的注册与使用方式如下：\r\n\r\n``` html\r\n<div id=\"app\">\r\n  <my-component></my-component>\r\n</div>\r\n```\r\n\r\n``` js\r\nVue.component('my-component', {\r\n  template: '<span>Hello World!</span>'\r\n});\r\n\r\nnew Vue({\r\n el: '#app'\r\n});\r\n```\r\n\r\n局部组件的注册与使用方式如下：\r\n\r\n``` js\r\nvar Child = {\r\n  template: '<span>Hello World!</span>'\r\n};\r\n\r\nnew Vue({\r\n  el: '#app',\r\n  components: {\r\n    'my-component': Child\r\n  }\r\n});\r\n```\r\n\r\n### 单文件组件\r\n\r\n文件扩展名为 ``.vue`` 的单文件组件作为一种局部组件，它需要使用 Webpack 或 Browserify 等构建工具才能使用，[「vue-loader」]( https://vue-loader.vuejs.org/ )就是其中一种使用方法。但是由于它可以将 HTML、CSS 和 JS 都写到一个文件里，所以很适合组件的提取。\r\n\r\n一个名为 ``Hello.vue`` 的简单实例：\r\n\r\n``` vue\r\n<template>\r\n  <p>{{ greetring }} <span>World!</span></p>\r\n</template>\r\n\r\n<script>\r\nmodule.exports = {\r\n  data: function() {\r\n    return {\r\n      return {\r\n        greeting: 'Hello'\r\n      };\r\n    };\r\n  }\r\n};\r\n</script>\r\n\r\n<style>\r\np {\r\n  color: red;\r\n  font-size: 2em;\r\n  text-align: center;\r\n}\r\n\r\nspan {\r\n  color: blue;\r\n}\r\n</style>\r\n```\r\n\r\n在 HTML 中引入该组件，并在 Vue 实例中引用即可：\r\n\r\n``` html\r\n<div id=\"app\">\r\n  <Hello></Hello>\r\n</div>\r\n```\r\n\r\n``` js\r\nvar Vue = require('vue');\r\nvar Hello = require('./components/hello');\r\n\r\nnew Vue({\r\n  el: '#app',\r\n  components: {\r\n    'hello': Hello\r\n  }\r\n});\r\n```\r\n\r\n当然单文件组件里可以使用 ES6 和 Sass 等，具体代码可以简单参考我编写的一个[「demo」](https://github.com/cobish/demo/tree/master/vue-demo/vue-component)。\r\n\r\n### 路由\r\n\r\n在创建单页面应用中，路由则有前端负责管理。当页面变化时，浏览器的 url 也会随着改变。使用官方的 [「vue-router」](http://router.vuejs.org/zh-cn/)，只需要配置组件和路由映射，然后告诉 vue-router 在哪里渲染它们。\r\n\r\n以下是一个路由的简单示例：\r\n\r\n``` html\r\n<div id=\"app\">\r\n  <h1>Hello App!</h1>\r\n  <p>\r\n    <router-link to=\"/foo\">Go to Foo</router-link>\r\n    <router-link to=\"/bar\">Go to Bar</router-link>\r\n  </p>\r\n  <router-view></router-view>\r\n</div>\r\n```\r\n\r\n``` js\r\nvar Foo = { template: '<div>foo</div>' };\r\nvar Bar = { template: '<div>bar</div>' };\r\n\r\nvar router = new VueRouter({\r\n  routes: [{\r\n    path: '/foo',\r\n    component: Foo\r\n  }, {\r\n    path: '/bar',\r\n    component: Bar\r\n  }]\r\n});\r\n\r\nvar app = new Vue({\r\n  el: '#app',\r\n  router: router\r\n});\r\n```\r\n\r\n### 环境部署\r\n\r\nVue 提供了一套官方的构建脚手架[「vue-cli」](https://github.com/vuejs/vue-cli)，安装完毕后可选择需要的 template 进行初始化。目前使用得比较多的是[「webpack-simple」](https://github.com/vuejs-templates/webpack-simple)和[「webpack」](https://github.com/vuejs-templates/webpack)。\r\n\r\nwebpack-simple 主要用于学习使用，真正项目的开发则是初始化 webpack，安装如下：\r\n\r\n``` bash\r\n$ npm install -g vue-cli\r\n\r\n# 初始化 webpack-simple\r\n$ vue init webpack-simple my-project\r\n\r\n# 初始化 webpack\r\n$ vue init webpack my-project\r\n```\r\n\r\n当然，即使是用 vue-cli 初始化 webpack 也不一定能够满足项目的需求，这时可以根据初始化后的代码进行修改调整。\r\n\r\n## 结尾\r\n\r\n上面只是总结了 Vue 一些简单入门的功能，实际上 Vue 相关的功能远远不止这一些，比如状态管理 vuex，调试工具 vue-devtools，单元测试等等。等今后接触学习到了再进行总结吧。\r\n"
    },
    {
        "hash": "968882892",
        "title": "基于 gulp 的前端构建",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2017-01-18T08:53:52Z",
        "updated_at": "2017-01-19T09:11:41Z",
        "body": "之前使用 Grunt 时总结了一篇[「基于 Grunt 的前端构建」](https://cobish.github.io/#/post/13)。在使用了 Grunt 的一段时间后，我发现了 gulp 的运行速度比 Grunt 快很多，于是便从 Grunt 转移阵地到了 gulp。以下的构建思路跟 Grunt 的构建很类似。如果你也使用过 Grunt，那我相信你一定能够很快地切换到 gulp。当然如果你没有接触过 Grunt，我相信你一定也能够很快上手 gulp。\r\n\r\n## 目录结构\r\n\r\n``` bash\r\n├─ gulp/                  # gulp配置目录\r\n    ├─ tasks              # 任务配置目录\r\n        ├─ image.js       # 图片配置\r\n        ├─ other.js       # 其它配置\r\n        ├─ script.js      # 脚本配置\r\n        ├─ style.js       # 样式配置\r\n        └─ view.js        # 页面配置\r\n    └─ config             # gulp配置文件\r\n├─ src/                   # 开发目录\r\n    ├─ html/              # 存放html的目录\r\n        ├─ app/           # 可提取复用的页面模块\r\n        └─ page/          # 各页面入口文件\r\n    ├─ images/            # 存放图片的目录\r\n        ├─ single/        # 不需要合并的图片\r\n        └─ sprite/        # 需要合并的图片\r\n    ├─ js/                # 存放js的目录\r\n        ├─ app/           # 可提取复用的脚步模块\r\n        ├─ lib/           # 第三方js库\r\n        ├─ page/          # 各页面入口脚本文件\r\n        └─ config.js      # RequireJs的配置文件\r\n    └─ sass/              # 存放sass的目录\r\n        ├─ app/           # 可提取复用的样式模块\r\n        └─ page/          # 各页面入口样式文件\r\n├─ .jshintrc              # jshint参数配置文件\r\n├─ gulpfile.js            # gulp入口配置文件\r\n└─ package.json           # npm包管理文件\r\n```\r\n\r\n## gulp 目录\r\n\r\n参考：[「前端 | 重构 gulpfile.js」](https://segmentfault.com/a/1190000002880177)。其中专门创建一个 `gulp` 目录用来存放 gulp 代码，为了能够将任务更加细化，职责单一，方便日后的维护更新。\r\n\r\n``` bash\r\n└─ gulp/                  # gulp配置目录\r\n    ├─ tasks              # 任务配置目录\r\n        ├─ image.js       # 图片配置\r\n        ├─ other.js       # 其它配置\r\n        ├─ script.js      # 脚本配置\r\n        ├─ style.js       # 样式配置\r\n        └─ view.js        # 页面配置\r\n    └─ config             # gulp配置文件\r\n```\r\n\r\n## 命令\r\n\r\n``` bash\r\n$ gulp help          # 说明帮助\r\n$ gulp sass          # sass本地编译\r\n$ gulp jshint        # js语法检测\r\n$ gulp include       # html包含依赖编译\r\n$ gulp dev           # 开发监控，浏览器不自动刷新\r\n$ gulp serve         # 开发监控，浏览器自动刷新\r\n$ gulp build         # 打包上线\r\n```\r\n\r\n## 开发阶段\r\n\r\n执行 `gulp dev` 命令，gulp 会进行一系列构建操作，最后在 `dist` 目录下生成可运行文件，并实时监听源文件，一旦源文件改动会执行相应的操作。\r\n\r\n``` javascript\r\n// 开发监控，浏览器不自动刷新\r\ngulp.task('dev', function(cb) {\r\n    runSequence(\r\n        'clean:dist',\r\n        'clean:tmp',\r\n        ['copy:img', 'sass', 'jshint', 'copy:js', 'include'],\r\n        'watch',\r\n        cb\r\n    );\r\n});\r\n```\r\n\r\n执行 `gulp serve` 命令，gulp 会执行跟 `gulp dev` 一样的操作并监听源文件，唯一不同的是它在执行后会监听某个端口，一旦有文件改动它会帮你自动刷新浏览器，帮你省下了按 F5 的力气。当然在同时开上多个浏览器测试页面时它将会很有帮助。\r\n\r\n``` javascript\r\n// 开发监控，浏览器自动刷新\r\ngulp.task('serve', function(cb) {\r\n    runSequence(\r\n        'clean:dist',\r\n        'clean:tmp',\r\n        ['copy:img', 'sass', 'jshint', 'copy:js', 'include'],\r\n        'reload',\r\n        cb\r\n    );\r\n});\r\n```\r\n\r\n## 上线打包阶段\r\n\r\n参考：张云龙的[「大公司里怎样开发和部署前端代码？」](https://github.com/fouber/blog/issues/6)。通过以下代码一个大体知道，上线打包主要是对图片样式脚本进行打包处理。所以接下来的工作就是职责分工，独立完成各自的构建工作。\r\n\r\n``` javascript\r\ngulp.task('build', function(cb) {\r\n    runSequence(\r\n        'clean:dist',\r\n        'clean:tmp',\r\n        'build:img',\r\n        'build:css',\r\n        'build:js',\r\n        'build:html',\r\n        'clean:tmp',\r\n        cb\r\n    );\r\n});\r\n```\r\n\r\n第一个步骤主要是对图片进行处理，包括图片合并压缩 hash 戳等。其中对 css 代码处理是为了替换合并后的图片路径。\r\n\r\n``` javascript\r\n// 打包图片\r\ngulp.task('build:img', function(cb) {\r\n    runSequence(\r\n        'sass:tmp',\r\n        'copy:tmpImg',\r\n        'autoSprite',\r\n        'imagemin',\r\n        'rev:img',\r\n        cb\r\n    )\r\n});\r\n```\r\n\r\n第二个步骤主要是对 css 文件进行处理，其中还包括替换已经 hash 的图片资源，并生成 hash 戳。\r\n\r\n``` javascript\r\n// 打包css文件\r\ngulp.task('build:css', function(cb) {\r\n    runSequence(\r\n        'usemin:css',\r\n        'sass:dist',\r\n        'rev:css',\r\n        cb\r\n    );\r\n});\r\n```\r\n\r\n第三个步骤是 js 文件的打包，打包 RequireJs 代码可以根据依赖进行 js 文件的合并压缩，最终每个页面都打包一个 js 文件为单入口。\r\n\r\n``` javascript\r\n// 打包js文件\r\ngulp.task('build:js', function(cb) {\r\n    runSequence(\r\n        'requirejs',\r\n        'uglify:config',\r\n        'rev:js',\r\n        'copy:js',\r\n        cb\r\n    );\r\n});\r\n```\r\n\r\n第四个步骤是 html 文件的打包，替换掉前面已经 hash 的静态资源即可。\r\n\r\n``` javascript\r\n// 打包html文件\r\ngulp.task('build:html', function(cb) {\r\n    runSequence(\r\n        'include',\r\n        'usemin:html',\r\n        cb\r\n    );\r\n});\r\n```\r\n\r\n最终生成的代码依然在 `dist` 目录下，也就是说在开发阶段与上线打包阶段构建生成的代码都在同一个目录下，只不过在开发阶段代码是未进行合并压缩，上线打包阶段代码是经过合并压缩打上 hash 戳的。所以建议该目录下的代码不需要添加到版本控制中。\r\n\r\n## 未解决的问题\r\n\r\n- 开发阶段：对 `RequireJs` 的路径配置（config.js 与 gulp 中的配置）感到困惑迷糊，多创建一个目录就路径不匹配打包不成功。\r\n- 上线打包阶段：`RequireJS` 若添加第三方库，需要手动修改 gulp 代码。\r\n"
    },
    {
        "hash": "968837892",
        "title": "合并图片",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2016-12-27T02:21:17Z",
        "updated_at": "2016-12-27T02:21:17Z",
        "body": "一直在寻找更优的方式来解决合并图片问题。这种方式需要满足几个要求：首先它能够将一个或多个 css 文件里引用到的图片合并成一张图片，接着它要能对应地修改 css 里图片的路径，最后它还要能方便维护修改，即如果我想替换图片或增加图片，它能够重新合并图片。\r\n\r\n过去都是设计师把所有的小图标合并成一张大的图片，这需要我们不断地去修改 background-position 来调整小图片的显示。这种方式的好处就是前端不需要去合并图片，直接图片拿来使用即可。但它也有一些缺点，图片并不是以最优的方式合并，还可以合并成大小更小的图片；还有就是大图片里的小图标需要更换或是添加的时候，都必须让设计师找到原图进行更改，并且得保证原来的小图标位置不能改动，不然 css 代码也需要随之改动。\r\n\r\n后来，网上有很多工具可以帮忙合并图片。尝试过了很多，大致都是你把要合并到一起的图片移到一个框内，然后自己去调整位置。实际上这种做法跟设计师的做法没区别，只不过是前端自己来完成而已，最后还是需要前端自己去调整 css 代码。后来又出现了一些线上的工具，例如[「GoPng」](http://alloyteam.github.io/gopng/)。这些工具会根据一定的算法去合并，并且会把 css 代码展示出来给你复制，不需要前端去手动书写引用图片的代码。但是，它们也有缺点，还是不方便更改，一旦图片做了更改，css 代码也会随之更改。\r\n\r\n最后，构建工具让我找到了较优的解决方案。可以用到的插件是[「grunt-css-sprite」](https://www.npmjs.com/package/grunt-css-sprite)或[「gulp-css-spritesmith」](https://www.npmjs.com/package/gulp-css-spritesmith)。主要策略是有两个目录，一个是保存开发代码的 src 目录，一个是用于上线的 dist 目录。src 目录下用到的都是没有合并的小图片，css 代码引用到的也是各个图片。dist 目录下则是通过插件把图片都合并了，并修改了 css 里的代码。开发期间就使用未合并的图片，上线期间则通过打包工具使用已合并的图片。最后，目录如下：\r\n\r\n``` bash\r\n├─ dist/\r\n    ├─ css/\r\n        └─ login.css\r\n    └─ images/\r\n        └─ icon_sprite.css\r\n└─ src/\r\n    ├─ css/\r\n        └─ login.css\r\n    └─ images/\r\n        └─ login\r\n            ├─ icon_1.png\r\n            ├─ icon_2.png\r\n            └─ icon_3.png\r\n```"
    },
    {
        "hash": "158837892",
        "title": "gulp 自动刷新浏览器",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2016-12-23T08:52:30Z",
        "updated_at": "2016-12-23T08:53:47Z",
        "body": "项目本地后端开发语言是是基于 apache 的 php，域名为 ``cloud.xxx.com``。刚开始想实现浏览器 F5 自动刷新使用到的是 grunt 和 livereload 插件，gulp 也有对应的方法，参考[「gulp 教程之 gulp-livereload」](http://www.ydcss.com/archives/702)。但是，它需要浏览器安装 livereload 插件才能使用，chrome 的插件需要翻墙下载，firefox 的插件不起作用，其它的浏览器也无法实现自动刷新。\r\n\r\n后来，我发现了[「Browsersync」](http://www.browsersync.cn/)。简直就像是找到了宝藏一样，同样支持 grunt 和 gulp。以下代码是使用代理去实现：\r\n\r\n``` javascript\r\nvar gulp = require('gulp');\r\nvar browserSync = require('browser-sync').create();\r\n\r\ngulp.task('serve', function () {\r\n    browserSync.init({\r\n        proxy: \"http://cloud.xxx.com\"\r\n    });\r\n\r\n    gulp.watch('*.html').on('change', browserSync.reload);\r\n});\r\n```\r\n\r\n运行命令，默认的浏览器会自动打开 ``127.0.0.1:3000`` 链接\r\n\r\n``` bash\r\ngulp serve\r\n```\r\n\r\n如果想多个浏览器都可以自动刷新，只需要打开其它浏览器，把刚刚的链接输入即可。还有，由于项目原因，开发的时候不能使用到 127.0.0.1 ，想换成php配置的域名怎么做？直接把 ``127.0.0.1:3000`` 链接换成 ``cloud.xxx.com:3000`` 即可，Browsersync实际就是监听 3000 端口来实现刷新浏览器。"
    },
    {
        "hash": "158831576",
        "title": "gulp 打包 requirejs",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2016-12-12T03:10:14Z",
        "updated_at": "2016-12-12T03:11:51Z",
        "body": "目前我的项目是一个页面一个 js 入口，比如登录页面的入口是 login.js，而主页面的入口是 home.js，它们都是在同一个目录下。\r\n\r\n``` bash\r\n├─ src/\r\n    ├─ js/\r\n        ├─ lib\r\n            ├─ require.min.js\r\n            └─ jquery-1.11.1.min.js\r\n        ├─ mod\r\n            ├─ home.js\r\n            └─ login.js\r\n        └─ config.js\r\n├─ gulpfile.js\r\n└─ package.js\r\n```\r\n\r\nhtml 每个页面的引入是这样子的：\r\n\r\n``` html\r\n<script type=\"text/javascript\" src=\"__JSPATH__/config.js\"></script>\r\n<script type=\"text/javascript\" src=\"__JSPATH__/lib/requirejs.min.js\" data-main=\"__JSPATH__/mod/login.js\"></script>\r\n```\r\n\r\nrequirejs 的 config 文件如下：\r\n\r\n``` js\r\nvar requirejs = {\r\n  paths: {\r\n    jquery: '../lib/jquery-1.11.1.min',\r\n    widget: '../widget'\r\n  }\r\n};\r\n```\r\n\r\n接下来就是使用 gulp 对 js 文件进行打包，用到的是[「gulp-requirejs-optimize」](https://www.npmjs.com/package/gulp-requirejs-optimize)，由于项目是多入口文件，所以需要批量打包，打包的代码如下：\r\n\r\n``` js\r\nvar gulp = require('gulp');\r\nvar requirejsOptimize = require('gulp-requirejs-optimize');\r\n\r\ngulp.task('rjs', function () {\r\n  return gulp.src('src/js/mod/*.js')\r\n    .pipe(requirejsOptimize({\r\n      mainConfigFile: 'src/js/config.js',\r\n      exclude: [\r\n        'jquery'\r\n      ]\r\n    }))\r\n    .pipe(gulp.dest('dist/js/mod'));\r\n});\r\n```\r\n\r\n运行相应命令，即可完成打包：\r\n\r\n``` bash\r\n$ gulp rjs\r\n```"
    },
    {
        "hash": "158521573",
        "title": "gulp 初次试用",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2016-12-09T02:30:35Z",
        "updated_at": "2016-12-09T02:30:35Z",
        "body": "我在用了 Grunt 的一段时间内，越来越觉得自己离不开构建工具。但是，Grunt 的构建速度让我有点苦恼，即使是编译 sass 也需要花上一段时间。于是，我开始试用 gulp，结果意外地让我惊喜。\r\n\r\n下面代码是使用 gulp 初次来编译 sass，由于一直都有点习惯了 Grunt 那编译速度单位为秒级别的速度，刚输入命令还没反应过来，就已经以毫秒级的速度编译完了。\r\n\r\n``` js\r\nvar gulp = require('gulp');\r\nvar sass = require('gulp-sass');\r\nvar sourcemaps = require('gulp-sourcemaps');\r\n\r\n// sass编译\r\ngulp.task('sass:dev', function() {\r\n  return gulp.src('dev/sass/**/*.scss')\r\n    .pipe(sourcemaps.init())\r\n    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))\r\n    .pipe(sourcemaps.write())\r\n    .pipe(gulp.dest('dev/css'));\r\n});\r\n```\r\n\r\n比较一下 Grunt 与 gulp 编译同一套 sass 代码下所花费的时间：\r\n\r\n![2016-04-04-gulp-first-use-01](https://cloud.githubusercontent.com/assets/8475099/21035484/6f0c61b4-bdfa-11e6-9e2c-2c768bc75224.png)\r\n\r\n并不是说 Grunt 就比 gulp 不好，也有 gulp 办不到 Grunt 办得到的事情。但是就运行速度相比，gulp 的速度确实是完胜。\r\n"
    },
    {
        "hash": "158526683",
        "title": "Git 简单命令",
        "user": "admin",
        "labels": [
            {
                "name": "其它"
            }
        ],
        "created_at": "2016-11-24T03:33:47Z",
        "updated_at": "2016-11-24T03:33:47Z",
        "body": "当你正在某分支上进行开发，突然有一个紧急 bug 需要修复。可是你不想提交现在的代码，可以使用以下命令贮藏来暂时保存代码：\r\n\r\n``` bash\r\n$ git stash\r\n```\r\n\r\n查看贮藏命令：\r\n\r\n``` bash\r\n$ git stash list\r\n```\r\n\r\n紧急 bug 修复完了，你可以恢复到原来的分支，并恢复之前贮藏的代码，即未提交的代码。恢复贮藏有两种办法，一个是用 git stash apply 恢复，恢复后，stash 内容没有删除，需要用 git stash drop 来删除。另一种办法是用 git stash pop，恢复的同时把 stash 内容也删除了。\r\n\r\n``` bash\r\n$ git stash apply\r\n$ git stash drop\r\n```\r\n\r\n``` bash\r\n$ git stash pop\r\n```\r\n\r\n如果你有多个贮藏，查看贮藏里它们都有 0，1，2 编号，可以用以下命令来删除特定的贮藏。\r\n\r\n``` bash\r\n$ git stash pop stash@{0}\r\n```\r\n\r\n如果你修改了某个文件，突然不想把它给添加进暂存区，并且想丢弃修改，可是使用以下命令，它会让文件回到最近一次 commit 或 add 时的状态，注意的是 checkout 后面有两个杆杆。\r\n\r\n``` bash\r\n$ git checkout -- README.md\r\n```\r\n\r\n还有一种情况，想取消添加到暂存区的文件，可以使用 reset 命令。\r\n\r\n``` bash\r\n$ git reset HEAD README.md\r\n```\r\n\r\n还有就是提交了不想提交的代码，后悔了，想恢复，那就只能进行版本回退，以下命令为回退上一个版本\r\n\r\n``` bash\r\n$ git reset —hard HEAD^\r\n```\r\n\r\n如果想回退到特定版本，可以先查看版本号，然后使用以下命令:\r\n\r\n``` bash\r\n$ git reset —hard 3612357\r\n```"
    },
    {
        "hash": "156056683",
        "title": "基于 Grunt 的前端构建",
        "user": "admin",
        "labels": [
            {
                "name": "构建"
            }
        ],
        "created_at": "2016-11-12T03:42:34Z",
        "updated_at": "2016-11-12T03:47:36Z",
        "body": "在[「Grunt的初次使用」](http://cobish.github.io/#/post/2)的基础上，这一篇继续对 Grunt 进行探索研究，例子参考[「grunt-project」](https://github.com/cobish/grunt-project)。这一次不再使用 php 进行 include 静态文件，而是在 html 里面进行 include。然后主要将 Grunt 用于两个大的方向，一个是用于开发期间，一个用于上线前期打包。使用到的插件可能有些更换。具体目录如下，src 目录用于开发与维护，dist 目录是打包后的项目，用于上线：\r\n\r\n``` bash\r\n├─ dist/\r\n    ├─ css/\r\n    ├─ images/\r\n    ├─ js/\r\n    └─ view/\r\n└─ src/\r\n    ├─ css/\r\n    ├─ images/\r\n    ├─ js/\r\n    ├─ sass/\r\n    └─ view/\r\n```\r\n\r\n在开发期间，使用到的 Grunt 插件如下，watch 插件用了监听文件，一旦文件被修改，可以让它触发浏览器自动刷新：\r\n\r\n``` javascript\r\n\"devDependencies\": {\r\n  \"grunt\": \"^0.4.5\",\r\n  \"grunt-contrib-jshint\": \"^0.12.0\",\r\n  \"grunt-contrib-sass\": \"^0.9.2\",\r\n  \"grunt-contrib-watch\": \"^0.6.1\"\r\n}\r\n```\r\n\r\n图片不需要压缩，css 使用 sass 编译，js 使用了 requirejs，并使用 jshint 进行检错。其中 sass 编译好后会在同一目录下生成对应的 css 目录与文件。jshint 的具体配置参考[「例子」](https://github.com/cobish/grunt-demo/blob/master/grunt-contrib-jshint-demo/Gruntfile.js)。\r\n\r\n``` javascript\r\nsass: {\r\n  dev: {\r\n    options: {\r\n      style: 'expanded'\r\n    },\r\n    files: [{\r\n      expand: true,\r\n      cwd: 'src/sass/',\r\n      src: ['**/*.scss'],\r\n      dest: 'src/css/',\r\n      ext: '.css'\r\n    }]\r\n  }\r\n},\r\n\r\njshint: {\r\n  options: {\r\n    curly: true,\r\n    newcap: true,\r\n    eqeqeq: true\r\n    // ...\r\n  },\r\n  files: {\r\n    src: ['Gruntfile.js', 'src/**/*.js']\r\n  }\r\n}\r\n```\r\n\r\n在开发结束后，接下来就是让项目上线了，于是就有了打包项目的过程。看过张云龙博客里讲的[「大公司里怎样开发和部署前端代码？」](https://github.com/fouber/blog/issues/6)，于是便有了非覆盖式发布和静态文件hash，用到了[「grunt-filerev」](https://www.npmjs.com/package/grunt-filerev)和[「grunt-usemin」](https://www.npmjs.com/package/grunt-usemin)这两个插件。网上有很多教程都是图片、css、js 文件同一时间进行 hash，但我觉得这样不妥，毕竟 css（js）代码里引用到了图片，得先图片进行 hash 后替换了 css（js）里引用的路径，然后再对 css（js）进行hash才能保证哪些文件是修改过的。\r\n\r\n打包分四个步骤。按顺序分别是图片的打包、css 文件的打包、js 文件的打包、html 文件的打包。使用到的插件如下：\r\n\r\n``` javascript\r\n\"devDependencies\": {\r\n  \"grunt\": \"^0.4.5\",\r\n  \"grunt-contrib-clean\": \"^0.7.0\",\r\n  \"grunt-contrib-copy\": \"^0.8.2\",\r\n  \"grunt-contrib-cssmin\": \"^0.14.0\",\r\n  \"grunt-contrib-htmlmin\": \"^0.6.0\",\r\n  \"grunt-contrib-imagemin\": \"^1.0.0\",\r\n  \"grunt-contrib-jshint\": \"^0.12.0\",\r\n  \"grunt-contrib-requirejs\": \"^0.4.4\",\r\n  \"grunt-contrib-sass\": \"^0.9.2\",\r\n  \"grunt-contrib-watch\": \"^0.6.1\",\r\n  \"grunt-css-sprite\": \"^0.2.2\",\r\n  \"grunt-filerev\": \"^2.3.1\",\r\n  \"grunt-include-replace\": \"^3.2.0\",\r\n  \"grunt-newer\": \"^1.1.1\",\r\n  \"grunt-replace\": \"^0.11.0\",\r\n  \"grunt-usemin\": \"^3.1.1\",\r\n  \"load-grunt-tasks\": \"^3.3.0\",\r\n  \"time-grunt\": \"^1.2.1\"\r\n}\r\n```\r\n\r\n首先得将 dist 目录给删除掉，因为是非覆盖式部署，所以删掉一些过期用不到的静态文件。第一个步骤是图片打包，将需要合并的图片合并了（并修改对应的 css 文件）放置于临时目录（tmp），不需要合并的图片则复制粘贴到临时目录（tmp）。然后对临时目录里的图片进行压缩，最后 hash 后放置于 dist 生产环境目录。\r\n\r\n``` javascript\r\n// 步骤一：对图片进行打包\r\ngrunt.registerTask('img', [\r\n  'clean:dist',\r\n  'sprite',\r\n  'copy:images',\r\n  'imagemin',\r\n  'filerev:img'\r\n]);\r\n```\r\n\r\n第二个步骤是 css 文件的打包，先用 sass 将 css 压缩到临时目录(tmp)中，接着用 usemin 替换掉里面的已经 hash 的图片资源，最后将 css 文件进行 hash 后放置于 dist 生产环境目录。\r\n\r\n``` javascript\r\n// 步骤二：对css进行打包\r\ngrunt.registerTask('css', [\r\n  'sass:dist',\r\n  'usemin:css',\r\n  'filerev:css'\r\n]);\r\n```\r\n\r\n第三个步骤是 js 文件的打包，用的是 requirejs 插件将 js 文件合并压缩到临时目录（tmp），然后替换掉文件里的图片资源路径，最后 hash 到生产环境目录（dist），并把不需要 hash 的第三方库复制到 dist 生产环境目录。\r\n\r\n``` javascript\r\n// 步骤三：对js进行打包\r\ngrunt.registerTask('js', [\r\n  'requirejs',\r\n  'usemin:js',\r\n  'filerev:js',\r\n  'copy:js'\r\n]);\r\n```\r\n\r\n第四个步骤则是 html 文件的打包，先用 grunt-replace 把里面的 php include 替换成特定的模式放置于临时目录（tmp），然后再用 grunt-include-replace 把 html 依赖的 html 片段复制粘贴到一个 html 中，紧接着替换到 html 中的已 hash 的静态文件（包括css，js，image），最后将 html 压缩至 dist 目录下。\r\n\r\n``` javascript\r\n// 步骤四：对html进行打包\r\ngrunt.registerTask('html', [\r\n  'replace:before',\r\n  'includereplace',\r\n  'usemin:html',\r\n  'replace:after',\r\n  'htmlmin',\r\n  'clean:tmp'\r\n]);\r\n```\r\n\r\n如果你想问我为什么上面的四个步骤不直接写成一个 task 呢，这是我一直解不开的问题。我试过写成一个 task，后果则是文件里的图片资源路径没能够替换成功，可能是在一个 task 内 usemin 插件无法执行多次，于是我就分类写成四个了。\r\n最后总结一下，以上的方式的好处就在于开发时期不需要去合并压缩文件，方便调试。而生产环境则是尽可能去合并压缩，减少用户的请求时间。\r\n"
    },
    {
        "hash": "156084683",
        "title": "Git 与 SVN 的比较",
        "user": "admin",
        "labels": [
            {
                "name": "其它"
            }
        ],
        "created_at": "2016-10-09T08:27:34Z",
        "updated_at": "2016-10-09T08:27:43Z",
        "body": "公司项目最近从 SVN 更换到了 Git，不舍得那适应没多久的 SVN 分支开发，但毕竟不排斥更好的工具。大家都说 Git 比 SVN 好用，虽然在我接触 Git 与 SVN 的时间内，我也下意识觉得 Git 好用，但真正运用到实际开发项目的也就只有 SVN，Git 只是独自一人拿来过家家而已，总算是有机会尝试比较一下了。\n\nSVN 图形操作有 TortoiseSVN，而 Git 图形操作有 SourceTree，相比较来说，TortoiseSVN 总是要右键去提交更新查看，log 也只是显示了提交情况，而 SourceTree 有一个完整的界面，提交合并情况也显示得很清晰明了，特别是分支的操作情况。不仅如此，Git 还有简单强大的命令行，有大部分的人都会选择用 Git 命令进行操作。相比之下，我想 SVN 应该是没有几个人想去用 SVN 的命令吧。印象里我接触过一次命令，然后接触了 TortoiseSVN 就再也没有使用过 SVN 的命令了，因为图形操作更加便捷了。\n\nGit 最强大之处在于它的分支管理，在本地你可以随意拉取分支，只要你喜欢，而且拉取的速度很快，它实际只是修改了一下指针。SVN 虽然也有分支管理，但它创建一条分支却是先在远程上创建，然后你才能 checkout 到本地，实际就是复制了一份一模一样的代码，项目大的话，checkout 也得花点时间。实际上，Git 有几条分支在自己的电脑上都是保留着一个目录的代码，随着你切换分支，目录里的代码会相应进行改变。SVN 则是你有几条分支则本地电脑保存着几份项目的代码，偶尔可能找错代码。\n\n在使用过 TortoiseSVN 之后切换到 SourceTree 不习惯的地方还是有的，TortoiseSVN 在项目的目录里的每一个文件或文件夹都有提交或改动情况，已提交则显示一个绿色的勾勾，未提交显示红色的叉叉，还有冲突情况则显示橙色的感叹号。切换之后就再也看不到那些清晰明显的小图标了，一切都只能在 SourceTree 或命令行中查看，解决冲突时找起文件来也没有那么的方便。\n\n总的来说，Git 还是比较适合多人之间的协作开发，因为它那强大的分支管理和简单的命令。而 SVN 适合项目人少的开发，分支不需要创建太多。SourceTree 虽然直观，但是 Git 命令更加高效，结合两者一起使用也是一个不错的选择。这篇文章不是来说 Git 有多好，SVN 有多不好的，单纯只是一个客观的比较。萝卜青菜各有所爱，选择适合自己项目的才是最好的。如今项目也慢慢地切换到了 Git，感谢 SVN 对项目的支持，最后，向即将逝去的 SVN 致敬。\n"
    },
    {
        "hash": "172084683",
        "title": "使用 SVN 分支",
        "user": "admin",
        "labels": [
            {
                "name": "其它"
            }
        ],
        "created_at": "2016-10-03T02:03:06Z",
        "updated_at": "2016-10-03T02:03:06Z",
        "body": "大学期间我第一次做项目的时候，当时的三个人分别做不同的功能，互不影响。过了一个寒假，大家约好到一个地方把代码整合到一起。那时大家都没有版本控制的概念，经过了一下午的整合，总算是把项目能够完整成功地运行起来了，后来那个项目也一直没有用到版本控制。我的两个同学比我机智，他们合作一起做毕业设计，一个前端，一个后端。亏他们想得出拿云盘来进行协作，开发完的代码就上传到云盘，另一半则同步一下云盘，想想也是醉了。\n\n后来，我接触过大部分项目都用的是 SVN 来进行版本控制，不知大家跟我一样是否只是用 SVN 来备份代码或协作。是的，在 SVN 的使用中，大部分人都只用到了其中的 trunk，大家都在 trunk 上面修改提交协作。人少项目小时还勉强没什么问题。一旦项目大了人多了，问题也就慢慢地浮现出来。\n\n项目大了，当你正在 trunk 上开发一个新功能的时候，突然被告知要修复一个紧急 bug，这时怎么办？bug 如果不涉及到现在开发功能的文件还好，改完 bug 的文件直接上线即可。但是如果涉及到正在开发的文件，那么你只能先默默地注释掉新功能的代码，代码如果多且分布广的话真的会吐血。\n\n参与项目的人数多了，都在 trunk 上开发，今天我开发的功能要上线，可是其他的同事提交了开发一半的代码，代码混在一起就很难放心地上线了。同事之间每天的不断代码提交会增加项目的不稳定性，没有人会在项目不稳定的时候就把它放到线上给用户使用，这不是给自己挖坑吗。但是，我真的经历过，想起那时也真是愉快的时光。那时赶着项目上线，并且没有测试，一声令下就上线。用户就是我们的测试，每天都有许多的用户打电话过来反馈这里有问题那里有问题，不过这段时光总算是过去了。\n\n以上罗列的种种问题就是为了接下来做铺垫。分支可以解决以上等大部分问题，那么，分支又是什么？创建一条新的分支可以理解为把代码再复制一份，在新分支上面的改动不影响原来代码的运行。并且该分支上的代码，也就是复制的那一份的代码也会被添加到版本库中被管理，还可以进行分支合并的操作将代码们进行合并。比如，你被指派去开发一个功能，这个功能可能得花上一段时间的开发，为了不影响其他同事在原来功能上的开发，你可以拉去一条新的分支进行功能的开发，功能开发完毕便可以合并到原来的主干上。\n\n大部分用 SVN 进行版本控制的开发者都很少甚至不用 SVN 的分支，有的人说没必要，有的人说不会，有的人说合并很麻烦有很多的冲突，这些都是借口。在稍微有点规模的项目中，只有一条主干的 trunk 是无法保证项目的稳定性，至少得保证 trunk 主干上的代码是稳定的。SVN 创建一条分支是在远程机器上创建的，创建完毕你需要 checkout 到你本地才能使用。SVN 的一切操作都是以远程机器为主，你想进行分支合并的操作时得先将本地的代码提交并更新后才能进行合并操作，最后合并了其他分支上的代码后还需进行提交。\n\n那么，分支得创建多少，该怎么使用。参考了这篇[「多分支开发策略」](http://blog.csdn.net/crylearner/article/details/18779137)的文章，目前项目中我有四条一直保存着的分支。 master 主干分支也就是 trunk 是默认存在的，然后我从trunk上检出了三条分支，分别是 hotfix、dev、release。hotfix 分支是专门用来应对紧急 bug 的修复，dev 分支是用来新功能的开发，release 分支是用来发布测试版本，master 则是用来发布正式版本。dev 上开发完毕可以合并到 release 上，然后可以继续功能的开发。一旦 release 被测出有 bug，可以直接在 release 上面进行修复。线上的 bug 则可以使用 hotfix 分支进行修复。\n\n理论方法说得差不多了，接下来就是实战了，知道了那么多，但还是没有具体的操作也是白搭。可以戳这个[「TortoiseSVN中Branching和Merging实践」](http://blog.csdn.net/eggcalm/article/details/6606520)学习如何操作 SVN 分支的合并。需要注意的是，两条分支之间的合并都需要把本地的代码进行提交并更新才能进行 merge 操作，否则，你自己试了就会知道了嘿嘿嘿。\n"
    },
    {
        "hash": "456238766",
        "title": "js 模板引擎",
        "user": "admin",
        "labels": [
            {
                "name": "前端"
            }
        ],
        "created_at": "2016-09-24T09:47:34Z",
        "updated_at": "2016-09-26T05:40:04Z",
        "body": "在接触到 js 模板引擎之前，我都是使用字符串拼接的方式来操作 html 的标签。例如通过 Ajax 获取到以下一个对象，把它拼接起来显示到网页上。用久了这一种方式便会发现它的缺点。代码看起来不美观，js 代码里包含着大量的 html 代码；代码不易维护，html 标签没有合适的缩进。如果再 if 等判断语句只会让拼接代码更加的复杂。\n\n``` js\nvar data = {\n  title: '四大名著',\n  list: ['西游记', '三国演义', '水浒传', '红楼梦']\n};\n\n// 拼装html代码块\nvar html = '';\nhtml += '<h1>' + data.title + '</h1>';\nhtml += '<ul>';\n\nfor ( var i = 0; i < data.list.length; i++ ) {\n  html += '<li>索引 ' + ( i + 1 ) + ' : ' + data.list[i] + '</li>';\n}\n\nhtml += '</ul>';\ndocument.getElementById('content').innerHTML = html;\n```\n\n后来从[「基于HTML模板和JSON数据的JavaScript交互」](http://www.zhangxinxu.com/wordpress/2012/09/javascript-html-json-template/)中学习到另一种处理方法，即将 html 代码放在一个隐藏的标签里，然后通过 js 获取到并正则匹配进行替换，最后把替换后的代码块显示在网页上。js 模板引擎大致都是类似原理。\n## 使用 artTemplate\n\n当然也有现成的模板引擎帮我们解决以上的种种问题，例如[「artTemplate」](https://github.com/aui/artTemplate)，下面有一段小例子可以拿来与上面的代码对比，然后细细地品味出它们之前的不同。\n### 编写模板\n\n``` html\n<div id=\"content\"></div>\n<script id=\"test\" type=\"text/html\">\n  <h1>{{title}}</h1>\n  <ul>\n    {{each list as value i}}\n      <li>{{value}}</li>\n    {{/each}}\n  </ul>\n</script>\n```\n### 渲染模板\n\n``` js\nvar data = {\n  title: '四大名著',\n  list: ['西游记', '三国演义', '水浒传', '红楼梦']\n};\n\nvar html = template('test', data);\ndocument.getElementById('content').innerHTML = html;\n```\n### 条件表达式\n\n``` html\n{{if admin}}\n  <p>admin</p>\n{{else if code > 0}}\n  <p>master</p>\n{{else}}\n  <p>error!</p>\n{{/if}}\n```\n### 遍历表达式\n\n``` html\n{{each list as value index}}\n  <li>{{index}} - {{value.user}}</li>\n{{/each}}\n```\n### 模板包含表达式\n\n``` html\n{{include 'template_name'}}\n```\n"
    },
    {
        "hash": "172084633",
        "title": "函数防抖与函数节流",
        "user": "admin",
        "labels": [
            {
                "name": "前端"
            }
        ],
        "created_at": "2016-08-19T08:54:33Z",
        "updated_at": "2017-01-22T09:35:21Z",
        "body": "我们在开发中都会遇到这样一种情况：先给 Window 绑定一个 `scroll` 事件，然后打印日志，代码如下。打开浏览器，滚动一下鼠标，便会发现日志被频繁地打印出来。类似这样的事件还是 Window 的 `resize` 事件、输入框的 `keyup` 事件、拖拽时的 `mousemove` 事件等等。\r\n\r\n``` javascript\r\n$(window).on('scroll', function() {\r\n  console.log(111);\r\n});\r\n```\r\n\r\n它们都有以下两个特点：\r\n- 事件发生后会被频繁地调用；\r\n- 都是浏览器自带的事件，无法对其进行代码修改。\r\n\r\n既然无法对这些事件进行改动，那么我们只能在被调用的函数中想办法优化了。因为使用场景的不同，所以有 `函数防抖` 和 `函数节流` 这两种优化方案，下面将逐一进行介绍。\r\n## 函数防抖\r\n\r\n**如果用手指一直按住一个弹簧，它将不会弹起直到你松手。**函数防抖 `debounce` 就是给函数设置一个定时器，n 秒之后才调用函数，n 秒内如果再次设置定时器的话，则会重新定时 n 秒后执行函数。\r\n\r\n函数防抖的简单实现：\r\n\r\n``` javascript\r\n/**\r\n * 函数防抖\r\n * @param  {Function} 调用的函数\r\n * @param  {Int}      时间\r\n * @return {Function} 返回客户调用函数\r\n */\r\nvar debounce = function(action, time) {\r\n  var timer = null;\r\n    return function() {\r\n      var context = this,\r\n          args = arguments;\r\n\r\n      clearTimeout(timer);\r\n        timer = setTimeout(function() {\r\n        action.apply(context, args);\r\n      }, time);\r\n    };\r\n};\r\n```\r\n\r\n这时如果我们再结合 Window 的 scroll 事件，可以发现控制台里的打印明细打印少了很多，而且几乎是在停止 scroll 了之后才会去调用 `doResize` 函数（主要是因为设置的事件为 500 毫秒）。\r\n\r\n``` javascript\r\nfunction doResize() {\r\n  console.log(arguments);\r\n}\r\n\r\nvar action = debounce(doResize, 500);\r\n$(window).on('resize', action);\r\n```\r\n## 函数节流\r\n\r\n**如果将水龙头拧紧直到水是以水滴的形式流出，那你会发现每隔一段时间，就会有一滴水流出。**函数节流 `throttle` 顾名思义就是节约使用函数次数的意思。\r\n\r\n有一种场景，一个输入框在 keyup 之后需获取到输入的值去 ajax 请求，如果是正常实现的话，那 ajax 请求的数量则太大了。如果是使用 `debounce` 的话，则会在用户输入完毕后的 n 秒后才会去 ajax 请求。我们需要的只是减少 keyup 事件的触发，而不是完全禁止它等到最后一个 keyup 才触发。这时我们就可以使用函数节流`throttle`。\r\n\r\n函数节流的简单实现：\r\n\r\n``` javascript\r\n/**\r\n * 函数节流\r\n * @param  {Function} 调用的函数\r\n * @param  {Int}      时间，单位毫秒\r\n * @return {Function} 返回客户调用函数\r\n */\r\nvar throttle = function(action, delay) {\r\n  var last = 0;\r\n  return function() {\r\n    var curr = +new Date();\r\n    if (curr - last > delay) {\r\n      action.apply(this, arguments);\r\n      last = curr;\r\n    }\r\n  };\r\n}\r\n```\r\n\r\n再结合输入框的 keyup 事件，就可以看出 keyup 调用的频率明显减少了。\r\n\r\n``` javascript\r\nfunction doInput() {\r\n  console.log($(this).val());\r\n}\r\n\r\nvar action = throttle(doInput, 1000);\r\n$('#txt').on('keyup', action);\r\n```\r\n## 使用 underscore.js\r\n\r\n`underscore.js` 有对 `debounce` 和 `throttle` 的分别实现。将上面的代码修改如下：\r\n\r\n``` javascript\r\n// debounce\r\nvar resizeAction = _.debounce(doResize, 500);\r\n$(window).on('resize', resizeAction);\r\n\r\n// throttle\r\nvar keyupAction = _.throttle(doInput, 1000);\r\n$('#txt').on('keyup', keyupAction);\r\n```\r\n## 参考\r\n- http://www.cnblogs.com/fsjohnhuang/p/4147810.html\r\n- https://segmentfault.com/a/1190000002764479\r\n"
    },
    {
        "hash": "168501598",
        "title": "为什么写博客",
        "user": "admin",
        "labels": [
            {
                "name": "随笔"
            }
        ],
        "created_at": "2016-07-31T04:55:23Z",
        "updated_at": "2016-08-01T00:54:56Z",
        "body": "为什么写博客？自己的博客记录自己所学、所想、所总结的技术。随着博客年龄的增长，便会发现自己的技术也在成长。它就像是你在某一知识领域的秘籍。\n\n两年前我突然发现，我所学的知识没有记录，没有总结，过段时间便忘记。太可怕了，得用什么来保存才行。这时我发现，我在寻找一些技术解决方案的时候，我会在搜索引擎搜索结果后优先去寻找别人的博客，因为里面更加容易找到我想要的答案。我写博客的初衷就是为了做笔记。于是，我开始在博客园、开源中国等第三方博客网站开始自己的技术博客。它们不需要你自己搭建网站，只需你提交博文即可，比较方便。\n## 第三方站点\n\n我开始是在[「开源中国」](http://my.oschina.net/cobish)上写技术博客，那时候自己是做 iOS 开发的，对第三方的博客站点没有什么太大的要求，也乐于将自己学习到的新知识记录在博客上。后来我成为了一枚前端开发，慢慢地看到了网上的一些人的博客的界面是自己编写的，于是也想自己尝试一下。\n## 使用 github page\n\ngithub page 还是在实习的时候一个大神告诉我的，使用它可以定制自己的静态页面。刚开始使用的是 **Hexo**，因为搭建方便，缺点就是样式太大众化了，时不时会发现一个博客跟自己的博客撞衫了。我是一个爱折腾的人，后来接触到了 **jekyll**，整个博客外观都可以自己定制，果断定制出属于自己的技术博客，自豪感油然而生。\n## 使用 github api\n\n后来，我在网上看到了有人使用 github page + github api + issues 来搭建自己的博客。我静下心来思考了一下，目前我的 jekyll 博客每次要写一篇文章就要创建一个 markdown 文件，写完才能推送到 Github 上，而且换成另外一台电脑的话就要把源代码都下载下来，太麻烦了。如果是使用 Github 的 issues 来写博客，然后通过 github api 来获取到我的 **issue** 显示在我的 github page 上，那 jekyll 博客的烦恼不就解决了。\n\n说干就干，花了几天的时间参考了别人的代码，我写出了一个单页面的博客应用，虽然功能还不齐全，但已经够我个人使用的了。这是这个博客的第一篇文章，以此纪念一下吧。\n"
    }
]