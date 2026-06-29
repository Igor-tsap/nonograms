FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install


FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN npm run build 
# uncomment for building the frontend for production, comment for development


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]



# FROM node:20-alpine

# WORKDIR /app

# # Install dependencies first (this utilizes Docker's layer caching)
# COPY package*.json ./
# RUN npm install

# # Copy the rest of your local source files
# COPY . .

# # Expose the Next.js port
# EXPOSE 3000

# # This command acts as a fallback, but docker-compose override will manage it
# CMD ["npm", "run", "dev"]
