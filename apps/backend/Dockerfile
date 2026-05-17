FROM oven/bun:1

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env ./

RUN bun install
RUN bunx prisma generate --schema prisma/schema.prisma

EXPOSE 3001

CMD ["bun", "src/index.ts"]
