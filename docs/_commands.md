## Commands

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

## CLI for Core

#### CLI Basic Usage

```bash
core runn baby

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  runn <baby>
  size
  test <db>
```

#### CLI Advanced Usage

```bash
coree 

Interface:
  ? Heyy Dear, what can i do : (Use arrow keys)
  servers
❯ Toggle Server (ON/OFF) 
  Exit 
  content
  Size of the Movies heap 
  Get Movies 
```
#### Shut Down Server 

```bash
Ctrl + C
```