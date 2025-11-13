FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p reports/html

CMD ["npx", "playwright", "test"]
