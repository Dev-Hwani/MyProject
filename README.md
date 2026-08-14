# Fullstack Integration Test App

Spring Boot, React, Docker 기반의 PostgreSQL을 활용한 Fullstack 연동 테스트 애플리케이션.  
사용자가 이름을 입력하고 DB에 저장하면, 저장된 데이터를 조회하여 화면에 실시간으로 출력한다.

---

## 🛠 Tech Stack

### Backend
* **Java 17**
* **Spring Boot 4.x**
* **Spring Data JPA**
* **Gradle**

### Frontend
* **React**
* **Vite**

### Database & Infrastructure
* **PostgreSQL 17** (Docker)
* **Docker / Docker Compose**
* **WSL2 (Ubuntu)**

---

## 📂 Project Structure

```text
MyProject/
├── backend/                  # Spring Boot 백엔드 프로젝트
│   ├── src/main/java/com/example/demo/
│   │   ├── DemoApplication.java
│   │   ├── HelloController.java
│   │   ├── User.java         # JPA Entity
│   │   ├── UserController.java # REST API Controller
│   │   └── UserRepository.java # Spring Data JPA Repository
│   ├── Dockerfile
│   └── build.gradle
├── frontend/                 # React (Vite) 프론트엔드 프로젝트
│   ├── src/
│   └── Dockerfile
└── docker-compose.yml        # 전체 컨테이너 오케스트레이션
```

## 🚀 Getting Started

### Repository Clone

```
git clone [https://github.com/Dev-Hwani/MyProject.git](https://github.com/Dev-Hwani/MyProject.git) 
cd MyProject
```

### Docker Compose 전체 서비스 실행

```
docker compose up -d --build
```
