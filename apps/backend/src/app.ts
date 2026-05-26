import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const S3_BUCKET = process.env.S3_BUCKET_NAME || "threads-clone-storage-ppwl-tubes";

const app = new Elysia()
  .use(cors())

  .get("/", () => ({
    success: true,
    message: "Backend Threads Clone aktif",
  }))

  .get("/users", async ({ query }) => {
    if (query.key !== process.env.ADMIN_KEY) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Data users berhasil diambil",
      data: users,
    };
  })

  .post("/auth/register", async ({ body }: any) => {
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return {
        success: false,
        message: "Semua field wajib diisi",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email atau username sudah digunakan",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        provider: "EMAIL",
      },
    });

    return {
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  })

  .post("/auth/login", async ({ body }: any) => {
  const { email, password } = body;

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan password wajib diisi",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return {
      success: false,
      message: "Email atau password salah",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Email atau password salah",
    };
  }

  return {
    success: true,
    message: "Login berhasil",
    data: {
      user: {
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
  bio: user.bio,
},
      token: jwt.sign(
  {
    userId: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET || "secret-uas-ppwl",
  {
    expiresIn: "1d",
  }
),
    },
  };
})

  .post("/auth/google", async ({ body }) => {
  try {
    const { name, email, avatarUrl } = body as {
      name: string;
      email: string;
      avatarUrl?: string;
    };

    if (!email) {
      return {
        success: false,
        message: "Email Google tidak ditemukan",
      };
    }

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Kalau user belum ada → create user baru
    if (!user) {
      const username =
        email.split("@")[0] +
        Math.floor(Math.random() * 1000);

      user = await prisma.user.create({
        data: {
          name: name || "Google User",
          email,
          username,
          avatarUrl: avatarUrl || null,
          provider: "GOOGLE",
        },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: "USER",
      },
      process.env.JWT_SECRET || "secret-uas-ppwl",
      {
        expiresIn: "7d",
      }
    );

    return {
      success: true,
      message: "Google login berhasil",
      data: {
        token,
        user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      provider: user.provider,
    },
      },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Google login gagal",
    };
  }
})

  .get("/auth/me", async ({ headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Token tidak ditemukan",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return {
      success: true,
      message: "User login berhasil diambil",
      data: user,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid",
    };
  }
})

  .post("/seed/posts", async () => {
  const user = await prisma.user.findFirst();

  if (!user) {
    return {
      success: false,
      message: "Belum ada user. Register dulu.",
    };
  }

  await prisma.post.createMany({
    data: [
      {
        userId: user.id,
        content: "Ini postingan dummy pertama untuk halaman beranda.",
        imageUrl: null,
      },
      {
        userId: user.id,
        content: "Belajar membuat sosial media KW pakai React, Elysia, Prisma, dan PostgreSQL.",
        imageUrl: null,
      },
      {
        userId: user.id,
        content: "Postingan dengan gambar dummy.",
        imageUrl: "https://picsum.photos/600/400",
      },
    ],
  });

  return {
    success: true,
    message: "Dummy postingan berhasil dibuat",
  };
})

.get("/posts", async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      likes: true,
      comments: true,
    },
  });

  return {
    success: true,
    message: "Data postingan berhasil diambil",
    data: posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      user: post.user,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    })),
  };
})

.post("/seed/comments", async () => {
  const user = await prisma.user.findFirst();
  const post = await prisma.post.findFirst();

  if (!user || !post) {
    return {
      success: false,
      message: "User atau post belum ada",
    };
  }

  await prisma.comment.createMany({
    data: [
      {
        userId: user.id,
        postId: post.id,
        content: "Ini komentar dummy pertama.",
      },
      {
        userId: user.id,
        postId: post.id,
        content: "Komentar ini digunakan untuk testing halaman detail postingan.",
      },
    ],
  });

  return {
    success: true,
    message: "Dummy komentar berhasil dibuat",
  };
})

.get("/posts/:id", async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      likes: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return {
      success: false,
      message: "Postingan tidak ditemukan",
    };
  }

  return {
    success: true,
    message: "Detail postingan berhasil diambil",
    data: {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      user: post.user,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      comments: post.comments,
    },
  };
})

  .post("/seed/comments", async () => {
  const user = await prisma.user.findFirst();
  const post = await prisma.post.findFirst();

  if (!user || !post) {
    return {
      success: false,
      message: "User atau post belum ada",
    };
  }

  await prisma.comment.createMany({
    data: [
      {
        userId: user.id,
        postId: post.id,
        content: "Ini komentar dummy pertama.",
      },
      {
        userId: user.id,
        postId: post.id,
        content: "Komentar ini digunakan untuk testing halaman detail postingan.",
      },
    ],
  });

  return {
    success: true,
    message: "Dummy komentar berhasil dibuat",
  };
})

.get("/posts/:id", async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      likes: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return {
      success: false,
      message: "Postingan tidak ditemukan",
    };
  }

  return {
    success: true,
    message: "Detail postingan berhasil diambil",
    data: {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      user: post.user,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      comments: post.comments,
    },
  };
})

  .post("/comments", async ({ body, headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const { postId, content } = body as {
      postId: string;
      content: string;
    };

    if (!postId || !content) {
      return {
        success: false,
        message: "PostId dan content wajib diisi",
      };
    }

const commentCount = await prisma.comment.count({
  where: {
    userId: decoded.userId,
  },
});

if (commentCount >= 5) {
  return {
    success: false,
    message: "Setiap user hanya boleh membuat maksimal 5 komentar",
  };
}

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Postingan tidak ditemukan",
      };
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId: decoded.userId,
      },
      include: {
  user: {
    select: {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
    },
  },
},
    });

    // notif ke pemilik post
    if (post.userId !== decoded.userId) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          userId: post.userId,
          actorId: decoded.userId,
          postId: post.id,
          commentId: comment.id,
        },
      });
    }

    return {
      success: true,
      message: "Komentar berhasil dibuat",
      data: comment,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid",
    };
  }
})

.get("/notifications", async ({ headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const notifications = await prisma.notification.findMany({
      where: {
        userId: decoded.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Notifikasi berhasil diambil",
      data: notifications,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid",
    };
  }
})

.post("/posts/:id/like", async ({ params, headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Postingan tidak ditemukan",
      };
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: params.id,
          userId: decoded.userId,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return {
        success: true,
        message: "Like dibatalkan",
      };
    }

    const like = await prisma.postLike.create({
      data: {
        postId: params.id,
        userId: decoded.userId,
      },
    });

    if (post.userId !== decoded.userId) {
      await prisma.notification.create({
        data: {
          type: "LIKE",
          userId: post.userId,
          actorId: decoded.userId,
          postId: post.id,
        },
      });
    }

    return {
      success: true,
      message: "Postingan berhasil dilike",
      data: like,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid",
    };
  }
})

.post("/posts", async ({ body, headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const { content, imageUrl } = body as {
      content: string;
      imageUrl?: string;
    };

    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

if (
  imageUrl &&
  videoExtensions.some((ext) => imageUrl.toLowerCase().includes(ext))
) {
  return {
    success: false,
    message: "Upload video tidak diperbolehkan",
  };
}

    if (!content && !imageUrl) {
  return {
    success: false,
    message: "Content atau gambar wajib diisi",
  };
}

    const postCount = await prisma.post.count({
  where: {
    userId: decoded.userId,
  },
});

if (postCount >= 2) {
  return {
    success: false,
    message: "Setiap user hanya boleh membuat maksimal 2 postingan",
  };
}

    const post = await prisma.post.create({
      data: {
        content: content || "",
imageUrl: imageUrl || null,
        userId: decoded.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Postingan berhasil dibuat",
      data: post,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid",
    };
  }
})
  .put("/posts/:id", async ({ params, body, headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const { content, imageUrl } = body as {
      content?: string;
      imageUrl?: string | null;
    };

    if (!content && imageUrl === undefined) {
      return {
        success: false,
        message: "Tidak ada data yang diperbarui",
      };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Postingan tidak ditemukan",
      };
    }

    if (post.userId !== decoded.userId) {
      return {
        success: false,
        message: "Anda tidak punya akses untuk mengubah postingan ini",
      };
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Postingan berhasil diperbarui",
      data: updatedPost,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid",
    };
  }
})

.delete("/posts/:id", async ({ params, headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Postingan tidak ditemukan",
      };
    }

    if (post.userId !== decoded.userId) {
      return {
        success: false,
        message: "Anda tidak punya akses untuk menghapus postingan ini",
      };
    }

    await prisma.notification.deleteMany({
      where: {
        postId: params.id,
      },
    });

    await prisma.comment.deleteMany({
      where: {
        postId: params.id,
      },
    });

    await prisma.postLike.deleteMany({
      where: {
        postId: params.id,
      },
    });

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    return {
      success: true,
      message: "Postingan berhasil dihapus",
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid atau gagal menghapus postingan",
    };
  }
})

  .put("/profile", async ({ body, headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret-uas-ppwl"
    );

    const { name, username, email, avatarUrl, bio, password } = body as {
      name?: string;
      username?: string;
      email?: string;
      avatarUrl?: string;
      bio?: string;
      password?: string;
    };

    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.userId,
      },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(email && { email }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bio !== undefined && { bio }),
        ...(password && { password: await bcrypt.hash(password, 10) }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
      },
    });

    return {
      success: true,
      message: "Profile berhasil diperbarui",
      data: updatedUser,
    };
  } catch {
    return {
      success: false,
      message: "Token tidak valid atau data sudah digunakan",
    };
  }
})

.post("/upload", async ({ body }) => {
  try {
    const { fileName, fileType, base64 } = body as {
      fileName: string;
      fileType: string;
      base64: string;
    };

    if (!fileName || !fileType || !base64) {
      return {
        success: false,
        message: "File wajib diupload",
      };
    }

    if (!fileType.startsWith("image/")) {
      return {
        success: false,
        message: "Hanya file gambar yang diperbolehkan",
      };
    }

    const ext = fileName.split(".").pop() || "png";
    const s3Key = `uploads/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(base64, "base64");

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: fileType,
      })
    );

    return {
      success: true,
      message: "Upload berhasil",
      data: {
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${s3Key}`,
      },
    };
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);

    return {
      success: false,
      message: "Upload gagal ke S3",
    };
  }
})

export default app;