# Backend Deployment Guide

## 1. Supabase Postgres Setup

1. Create a project on [Supabase](https://supabase.com)
2. Go to **Settings → Database** to get connection details
3. Set the following environment variables:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<your-password>
```

---

## 2. Deploy to Render (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root directory**: `backend`
   - **Build command**: `./mvnw clean package -DskipTests`
   - **Start command**: `java -jar target/campus-resource-management-1.0.0.jar`
   - **Environment**: Java 17
5. Add environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`

---

## 3. Deploy to Railway (Alternative)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set root directory to `backend`
4. Railway auto-detects Spring Boot
5. Add the same environment variables

---

## 4. Deploy to Vercel (NOT SUPPORTED)
> ⛔ **Update**: Vercel has successfully removed support for the `@vercel/java` runtime. You cannot deploy this Spring Boot application to Vercel directly.
> **Please use Render or Railway (Steps 2 or 3 above).**

---

## Local Development

```bash
cd backend
./mvnw spring-boot:run
```

The server starts on `http://localhost:8080`
