# 1. Node.js 18 환경
FROM node:20-alpine
WORKDIR /app

# 2. 의존성 설치 및 코드 복사
COPY package*.json ./
RUN npm install
COPY . .

# 3. Vite 개발 서버를 외부에서 접근 가능하게 5173 포트로 실행
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]