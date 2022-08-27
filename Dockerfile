FROM python:3.9

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get install nodejs -y
RUN node --version
RUN npm --version
RUN npm install -g pnpm typescript@4.6.3
RUN pnpm --version

RUN npm install -g pnpm
RUN pnpm --version

# Init project
COPY .gitignore package.json pnpm-lock.yaml tsconfig.json /KP/
WORKDIR /KP
RUN pnpm install
COPY neopjuki/ /KP/neopjuki/
WORKDIR /KP/neopjuki/
RUN python3 --version
RUN pip3 install wheel
RUN pip3 install -r requirements.txt
COPY build/index.js /KP/build/index.js

# Run server
WORKDIR /KP
ENTRYPOINT ["node", "/KP/build/index.js"]
