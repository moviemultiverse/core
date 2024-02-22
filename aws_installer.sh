sudo su 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
&& . ~/.nvm/nvm.sh && nvm install 20 && nvm --version && yum install git -y \
&& git clone https://github.com/ss0809/core.git && cd core && npm i 