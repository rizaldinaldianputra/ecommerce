FROM node:22-alpine

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

# Copy package files
COPY package*.json ./

# CRITICAL: Copy the prisma directory before npm install
# Your package.json has a "postinstall": "prisma generate" script
# which will fail if this folder is missing during installation.
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate Prisma Client (sanity check to ensure generated code is fresh)
RUN npx prisma generate

# Provide DATABASE_URL for build-time requirements (e.g. Prisma client)
ENV DATABASE_URL="postgresql://rizaldi:15031996@postgres:5432/zelixa_db"

# Bake environment variables into the Next.js bundle during build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STORAGE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STORAGE_URL=$NEXT_PUBLIC_STORAGE_URL

RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "start"]