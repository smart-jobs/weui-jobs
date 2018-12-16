# pc-jobs

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

备注:
1)目前list.vue这个组件的耦合性太强,需要解耦.待正常使用,保存一版后,尽量去解耦,先将各自的功能拿到各自的页面上.
现在所有的功能和处理都在本组件中进行
2)qrcode组件未能成功组件化
=>错误描述:在学生用户的列表页中,所有的二维码都在第一个按钮的弹框中显示(即:在第一个组件中),其他按钮
打开的弹框均没有二维码.
3)所有返回均没有记忆功能:多页面跳转不会恢复之前的状态
