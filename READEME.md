1.安装nginx, 克隆代码
sudo apt-get install nginx
cd /* the directory you want to put the code*/
git clone https://github.com/fangbing0565/defense.git

2.安装 js package
cd defense
sudo npm install

3.配置nginx 可以修改/etc/nginx/sites-available/default，这是nginx默认的服务器，将其中的root设置为之前的代码目录。配置前端proxy代理，将/api的请求代理至后端，例如后端监听本机的8999端口，则可以在配置中添加：

	location /api {
		proxy_pass http://localhost:8999;
	}
4.启动nginx

sudo nginx -s restart
5.对前端文件修改之后，需要重新载入

sudo nginx -s reload