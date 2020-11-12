module.exports={
  dev_host: "",
  dev_port: 8090,
  favicon: './src/images/favicon.ico',
  commonname: "common",
  cssOutPath:"./css",
  cssPublicPath:"../",
  fontsOutPath:"./fonts",
  imageOutPath:"./img",
  entrys:[
    {
      title:"主页",
      name:"index",
      entry:"./src/app.ts",
      template:'./src/index.html',
      filename:"./index.html"
    }
  ]
};
