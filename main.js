const express = require("express");
const cookie = require('cookie-parser');
const app = express();
const http = require('http');
const fs = require('fs');
const md5 = require('md5');
const url = require('url');
const server = http.Server(app);
const mysql  = require('mysql');
const path = require('path');
const bodyparser = require('body-parser');
const code = require("./web/code.json")

app.use(bodyparser.urlencoded({extended:false}));
app.use(cookie());

var setup = {};
var isinstall = false;
var connection = null;

//笔记API接口 前端与后端通信接口
app.post("/get",(req, resp, next)=>{
	if(!isinstall){
		resp.json({code:code.NotInstall,msg:"没有安装"});
		return;
	}
	const {type = ""} = req.body;
	//检测是否登录
	if(!req.cookies.token || req.cookies.token.indexOf("|") < 0){
		//json 发送没有登录
		resp.json({code:code.NoLogin,msg:"没有登录"});
		return;
	}
	let token = req.cookies.token.split("|");
	let thisuser = null;
	connection.query("select * from Users where username = ? AND password = ?",[Buffer.from(token[0], 'base64').toString(),token[1]],(err0,result0)=>{
		if(err0){
			//数据库出错
			resp.json({code:code.SqlError,msg:err0.message});
			return;
		}
		if(result0.length == 0){
			//数据库没有找到这个用户
			resp.json({code:code.NoLogin,msg:"没有登录"});
			return;
		}
		thisuser = result0[0];

		//这里开始 处理所有的 请求
		if(type == "getInfo"){		//获取当前用户的基本信息
			resp.json({code:code.Success,msg:"Success",value:{
				id:thisuser.id,
				username:thisuser.username,
				email:thisuser.email,
				userface:thisuser.userface,
				isadmin:thisuser.isadmin,
				regtime:thisuser.regtime
			}});
			return;
		}

	})

})

//安装界面后台接收处理
app.post("/install",(req, resp, next)=>{
	if(isinstall){
		//已经安装过了
		resp.json({code:code.Install.AlreadyInstalled,msg:"已经是安装状态,无法重复安装"});
	}else{
		const {sqladdr = "",sqlport = "",sqluser = "",sqlpasswd = "",sqldb = "",datasave = "",adminuser = "",adminpasswd = ""} = req.body;
		//将前端的安装信息写入到配置文件 后 isinstall = true
		setup.host = sqladdr;
		setup.port = sqlport;
		setup.user = sqluser;
		setup.password = sqlpasswd;
		setup.database = sqldb;

		if(datasave.length == 1 || datasave[1] != ":")
		{
			setup.datasave = path.join(__dirname, datasave);
		}
		else if(datasave[0] == "/" || datasave[1] == ":")
		{
			setup.datasave = datasave;
		}

		connection = mysql.createConnection({
			host:setup.host,
			port:setup.port,
			user:setup.user,
			password:setup.password,
			database:setup.database
		});
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
					regtime bigint NOT NULL\
				) AUTO_INCREMENT = 100;"
				connection.query(sql_createtable,(err,result)=>{
					if(err)
					{
						//创建表时出错
						resp.json({code:code.Install.SqlFail,msg:err.message})
						return;
					}
					//创建表成功 接下来就是将管理员账户写入到表中
					let sql_insertadmin = "insert into users(username,password,isadmin,regtime) values(?,MD5(?),1,?)";
					connection.query(sql_insertadmin,[adminuser,adminpasswd,Date.now()],(err2,result2)=>{
						//这里面是 插入管理员用户信息到表时的内部处理
						if(err2){
							resp.json({code:code.Install.SqlFail,msg:"插入管理员用户信息时出错:"+err2.message})
							return;
						}
						//这里插入账户信息成功
						fs.writeFileSync(__dirname+"/setup.json",JSON.stringify(setup,null,2),{encoding:"utf-8"});

						//创建安装时填写的用户数据目录
						fs.exists(setup.datasave,exists=>{
							if(!exists) fs.mkdirSync(setup.datasave);
						});

						//创建 文件上传时的临时上传目录
						setup.upload = path.join(__dirname, "upload/");	//上传文件临时目录(绝对路径)
						fs.exists(setup.upload,exists=>{
							if(!exists) fs.mkdirSync(setup.upload);
						});

						isinstall = true;
						resp.json({code:code.Install.Success,msg:"安装完成"})
					})
					//console.log(JSON.stringify(result));
				})
		});
	}
})

//登录页面后台接受处理
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
			if(result.length > 0 && md5pass == result[0].password){
				resp.cookie("token",Buffer.from(username).toString('base64')+"|"+md5pass, { expires: new Date(Date.now() + 1000*60*60*24*(autologin?14:1)), httpOnly: true })
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
		connection = mysql.createConnection({
			host:setup.host,
			port:setup.port,
			user:setup.user,
			password:setup.password,
			database:setup.database
		});
		connection.connect(function (err) {
				if (err) {//数据库连接发生错误
						console.log("数据库连接发生错误:",err);
						connection.end();
						connection = null;
		    }
		});

		if(!setup.upload){
			setup.upload = path.join(__dirname, "upload/");	//上传文件临时目录(绝对路径)
			fs.exists(setup.upload,exists=>{
				if(!exists) fs.mkdirSync(setup.upload);
			});
		}
	}else{
		isinstall = false;

	}
})

//请求静态文件直接转发
app.get("/*",express.static(__dirname + '/web'));

//开启服务监听
server.listen(+8080);
