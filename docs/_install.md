## Install

#### Requirements
```
--> Google Service Account
--> Telegram Bot Account
--> Github Account
--> Redis Service Account
--> MongoDB Service Account
```
#### Linux || WSL
```bash
git clone https://github.com/moviemultiverse/core
cd core
git pull origin dev
git checkout dev
nano .env -> {add your crendentials}
npx nodemon index.js
```
#### CLI Installation
```
chmod +x cli.mjs cli.js
sudo npm install -g
```