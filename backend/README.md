# Campus Ledger — Backend (Spring Boot 3 + Java 17)

Deployment-ready Spring Boot 3 REST API for **Campus Ledger — Student Record Management System**.

---

## 🚀 Quick Deploy to Render.com (Recommended)

1. Push this folder to GitHub (either as root or inside monorepo).
2. Go to [Render.com](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository:
   - If deploying from monorepo: set **Root Directory** to `backend`.
   - **Environment:** `Java` or `Docker`
   - If using `Java`:
     - **Build Command:** `mvn clean package -DskipTests`
     - **Start Command:** `java -jar target/studentmanagement-0.0.1-SNAPSHOT.jar --server.port=$PORT`
   - If using `Docker`: Render will automatically detect the included `Dockerfile` and build it with zero configuration!
4. **Environment Variables on Render:**
   - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:5173`
   - *(Optional Cloud MySQL)*:
     - `DB_URL`: `jdbc:mysql://<your-mysql-host>:3306/studentdb?useSSL=true`
     - `DB_USERNAME`: `<username>`
     - `DB_PASSWORD`: `<password>`
     *(If `DB_URL` is omitted, the backend starts immediately with the persistent embedded database populated with seed records).*
5. Click **Create Web Service**. Your API will be live at `https://your-backend.onrender.com`!

---

## 💻 Local Execution

```bash
mvn clean test
mvn spring-boot:run
```
API starts at `http://localhost:8080`.
Health check: `http://localhost:8080/api/health`.
