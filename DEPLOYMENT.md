# 🚀 Panduan Deployment Produksi Web Dinas Pariwisata Sulteng

Panduan konfigurasi server VPS produksi menggunakan Linux Ubuntu, Nginx, PM2, dan MySQL.

---

## 1. Persiapan Server VPS
- **OS Rekomendasi:** Ubuntu 22.04 LTS / 24.04 LTS
- **Spesifikasi Minimal:** 2 vCPU, 4 GB RAM, 50 GB SSD
- **Provider Lokal:** IDCloudHost / Biznet Gio / Niagahoster (Biaya: ~Rp 80rb - 120rb/bln)

---

## 2. Instalasi Kebutuhan Pokok
```bash
# Update repository
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20+ LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx mysql-server certbot python3-certbot-nginx

# Install PM2 Process Manager
sudo npm install -g pm2
```

---

## 3. Konfigurasi Database MySQL
```bash
sudo mysql
```
```sql
CREATE DATABASE sulteng_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dispar_admin'@'localhost' IDENTIFIED BY 'PasswordKuatDispar2026!';
GRANT ALL PRIVILEGES ON sulteng_tourism.* TO 'dispar_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Import skema dan data awal:
```bash
mysql -u dispar_admin -p sulteng_tourism < database/sulteng_tourism.sql
cd backend && node scripts/migrate_data.js
```

---

## 4. Build Frontend & Menjalankan Backend
```bash
# Backend
cd /var/www/pariwisata/backend
npm install --production
pm2 start server.js --name "dispar-backend"
pm2 save
pm2 startup

# Frontend
cd /var/www/pariwisata/frontend
npm install
npm run build
```

---

## 5. Konfigurasi Nginx Reverse Proxy & SSL
Edit file `/etc/nginx/sites-available/pariwisata`:
```nginx
server {
    server_name pariwisata.sultengprov.go.id;

    # Frontend React Build
    root /var/www/pariwisata/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads Media
    location /uploads/ {
        alias /var/www/pariwisata/backend/uploads/;
    }
}
```
Aktifkan dan pasang SSL gratis:
```bash
sudo ln -s /etc/nginx/sites-available/pariwisata /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d pariwisata.sultengprov.go.id
```

---

## 6. Integrasi Domain Diskominfo
Pihak dinas mengajukan surat permohonan ke Diskominfo Pemprov Sulteng untuk mengarahkan **A-Record** DNS:
- **Host:** `pariwisata.sultengprov.go.id`
- **Target IP:** `<IP_PUBLIC_VPS_BARU>`
