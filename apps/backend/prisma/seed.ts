import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  // USER 1
  const siki = await prisma.user.upsert({
    where: {
      email: "siki@test.com",
    },
    update: {},
    create: {
      name: "Siki",
      username: "siki",
      email: "siki@test.com",
      password: hashedPassword,
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      bio: "Mahasiswa PPWL Threads Clone",
      provider: "EMAIL",
    },
  });

  // USER 2
  const budi = await prisma.user.upsert({
    where: {
      email: "budi@test.com",
    },
    update: {},
    create: {
      name: "Budi",
      username: "budi",
      email: "budi@test.com",
      password: hashedPassword,
      avatarUrl: "https://i.pravatar.cc/150?img=12",
      bio: "Dummy user testing",
      provider: "EMAIL",
    },
  });

  // POST 1
  const post1 = await prisma.post.create({
    data: {
      userId: siki.id,
      content: "Halo ini postingan dummy pertama.",
    },
  });

  // POST 2
  const post2 = await prisma.post.create({
    data: {
      userId: budi.id,
      content: "Postingan dummy dengan gambar.",
      imageUrl: "https://picsum.photos/600/400",
    },
  });

  // COMMENT
  const comment1 = await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: budi.id,
      content: "Komentar dummy dari Budi.",
    },
  });

  // LIKE
  await prisma.postLike.create({
    data: {
      postId: post1.id,
      userId: budi.id,
    },
  });

  // NOTIFICATION COMMENT
  await prisma.notification.create({
    data: {
      type: "COMMENT",
      userId: siki.id,
      actorId: budi.id,
      postId: post1.id,
      commentId: comment1.id,
    },
  });

  // NOTIFICATION LIKE
  await prisma.notification.create({
    data: {
      type: "LIKE",
      userId: budi.id,
      actorId: siki.id,
      postId: post2.id,
    },
  });

  console.log("✅ Seeder berhasil dijalankan");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });