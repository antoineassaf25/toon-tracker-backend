FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /app/toons
EXPOSE 3000
CMD ["node", "index.js"]