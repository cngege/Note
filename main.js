const express = require("express");
const cookie = require('cookie-parser');
const app = express();
const http = require('http');
const fs = require('fs');
const md5 = require('md5');
const url = require('url');
const server = http.Server(app);
const mysql  = require('mysql');
//const path = require('path');
const bodyparser = require('body-parser');//body-parser.urlencoded({ extended: false })
const code = require("./web/code.json")

app.use(bodyparser.urlencoded({extended:false}));
app.use(cookie());

var setup = {};
var isinstall = false;
var connection = null;

//笔记API接口 前端与后端通信接口
/*
app.post("/get",(req, resp, next)=>{

})
*/
app.post("/install",(req, resp, next)=>{
	if(isinstall){
		//已经安装过了
		resp.json({code:code.Install.AlreadyInstalled,msg:"已经是安装状态,无法重复安装"});
	}else{
		const {sqladdr = "",sqlport = "",sqluser = "",sqlpasswd = "",sqldb = "",adminuser = "",adminpasswd = ""} = req.body;
		//将前端的安装信息写入到配置文件 后 isinstall = true
		setup.host = sqladdr;
		setup.port = sqlport;
		setup.user = sqluser;
		setup.password = sqlpasswd;
		setup.database = sqldb;

		connection = mysql.createConnection(setup);
		connection.connect(function (err) {
				if (err) {//数据库连接发生错误
						resp.json({code:code.Install.ConnectSqlError,msg:err.message});
						console.log(setup);
						connection.end();
						connection = null;
		        return;
		    }
				//到这里表示数据库连接成功
				//并将管理员用户密码写入数据库
				//1.创建一张用户表
				let sql_createtable = "create table Users(\
					id int PRIMARY KEY AUTO_INCREMENT,\
					username varchar(20) NOT NULL,\
					password varchar(50) NOT NULL,\
					email varchar(20),\
					userface varchar(20),\
					isadmin tinyint NOT NULL default 0,\
					regtime timestamp default CURRENT_TIMESTAMP\
				) AUTO_INCREMENT = 100;"
				connection.query(sql_createtable,(err,result)=>{
					if(err)
					{
						//创建表时出错
						resp.json({code:code.Install.SqlFail,msg:err.message})
						return;
					}
					//创建表成功 接下来就是将管理员账户写入到表中
					let sql_insertadmin = "insert into users(username,password,isadmin) values(?,MD5(?),1)";
					connection.query(sql_insertadmin,[adminuser,adminpasswd],(err2,result2)=>{
						//这里面是 插入管理员用户信息到表时的内部处理
						if(err2){
							resp.json({code:code.Install.SqlFail,msg:"插入管理员用户信息时出错:"+err2.message})
							return;
						}
						//这里插入账户信息成功
						fs.writeFileSync(__dirname+"/setup.json",JSON.stringify(setup,null,2),{encoding:"utf-8"});
						resp.json({code:code.Install.Success,msg:"安装完成"})
					})
					//console.log(JSON.stringify(result));
				})
		});
	}
})

app.post("/login",(req,resp,next)=>{
	if(!isinstall){
		resp.json({code:code.NotInstall,msg:"没有安装"});
	}else{
		const {username = "",password = "",autologin = false} = req.body;
		let sql_login = "select password from Users where username = ?";
		connection.query(sql_login,[username],(err,result)=>{
			if(err){
				resp.json({code:code.Login.SqlFail,msg:err.message});
				return;
			}
			let md5pass = md5(password);
			if(md5pass == result[0].password){
				resp.cookie("token",new Buffer(username).toString('base64')+"|"+md5pass, { expires: new Date(Date.now() + 1000*60*60*24*(autologin?14:1)), httpOnly: true })
				//resp.cookie("user",username);
				//resp.cookie("token",md5pass, { expires: new Date(Date.now() + 1000*60*60*24*(autologin?14:1)), httpOnly: true })
				resp.json({code:code.Login.Success,msg:"登录成功"});
			}else{
				resp.json({code:code.Login.PasswordFail,msg:"登录失败,账号或密码错误"});
			}
		})
	}
})

//检查相关文件夹是否存在以及创建文件夹
fs.exists(__dirname + '/setup.json',exists=>{
	if(exists){
		isinstall = true;
		//读取配置;并连接数据库
		setup = JSON.parse(fs.readFileSync(__dirname + '/setup.json'));
		connection = mysql.createConnection(setup);
		connection.connect(function (err) {
				if (err) {//数据库连接发生错误
						console.log("数据库连接发生错误:",err);
						connection.end();
						connection = null;
		    }
		});
	}else{
		isinstall = false;

	}
})


app.get("/*",express.static(__dirname + '/web'));

/*
app.get("/:request?/*",(req, resp, next)=>{
	//console.log(req.header("User-Agent"));
	console.log(req.params);
	const { request = '' } = req.params;
	if(request != "request"){
		//静态文件请求
		if(request==""){
			//主页 判断有没有安装登录等
			//TODO
			if(req.params[0] == "" || req.params[0] == "index.html"){
				fs.access('setup.json', fs.constants.F_OK, (err) => {
					//console.log(err);
					if(err){//没有配置文件
						//resp.statusCode = 302;
						//resp.header({"Location":"install.html"});
						resp.redirect(302,"install.html");
						resp.end();
					}
				});
				return;
			}
		}
		express.static(__dirname + '/web')(req, resp, next);
	}else{
		resp.end("错误");
	}
});
*/

server.listen(+8080);

//判断配置文件是否存在,不存在则安装
/*
fs.access('setup.json', fs.constants.F_OK, (err) => {
	console.log(err);
});


fs.readFile("mime.json",(err,data)=>{//将mine.json文件数据读取到data中
	if(err){
		console.error(err);
		return;
	}
	mime = JSON.parse(data.toString());//将json数据转化为一个对象
})

*/
