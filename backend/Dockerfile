FROM node:18-alpine

# Add required dependencies
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 