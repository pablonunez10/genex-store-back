#!/bin/bash

# Script de despliegue para AWS EC2
echo "🚀 Iniciando despliegue de Genex Store Backend..."

# Actualizar código
echo "📥 Actualizando código..."
git pull origin main

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --production=false

# Construir proyecto
echo "🔨 Compilando TypeScript..."
npm run build

# Generar cliente de Prisma
echo "🔧 Generando Prisma Client..."
npm run prisma:generate

# Ejecutar migraciones de base de datos
echo "🗄️  Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Reiniciar aplicación con PM2
echo "♻️  Reiniciando aplicación..."
pm2 restart ecosystem.config.js --update-env

echo "✅ Despliegue completado!"
