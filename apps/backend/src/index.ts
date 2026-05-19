import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";

// Ambil JWT Secret dengan fallback tegas agar TypeScript tidak error
const JWT_SECRET = process.env.JWT_SECRET || "secret-uas-ppwl";

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
        },
        token: jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          JWT_SECRET,
          {
            expiresIn: "1d",
          }
        ),
      },
    };
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
      const decoded: any = jwt.verify(token, JWT_SECRET);

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

  // ─── ENDPOINT BARU KHUSUS MENGAMBIL LIST KOMENTAR 💬 ───
  .get("/posts/:id/comments", async ({ params }) => {
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.id,
      },
      orderBy: {
        createdAt: "asc", // Urutkan dari komentar terlama ke terbaru
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
      message: "Komentar berhasil diambil",
      data: comments,
    };
  })

  // ─── ENDPOINT BARU KHUSUS MENAMBAH KOMENTAR LEWAT PARAMS ✍️ ───
  .post("/posts/:id/comments", async ({ params, body, headers }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Unauthorized" };
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const { content } = body as { content: string };

      if (!content) {
        return { success: false, message: "Komentar tidak boleh kosong" };
      }

      const comment = await prisma.comment.create({
        data: {
          postId: params.id,
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

      return {
        success: true,
        message: "Komentar berhasil dibuat",
        data: comment,
      };
    } catch {
      return { success: false, message: "Token tidak valid" };
    }
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
      const decoded: any = jwt.verify(token, JWT_SECRET);

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
      const decoded: any = jwt.verify(token, JWT_SECRET);

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
      const decoded: any = jwt.verify(token, JWT_SECRET);

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
      const decoded: any = jwt.verify(token, JWT_SECRET);

      const { content, imageUrl } = body as {
        content: string;
        imageUrl?: string;
      };

      if (!content) {
        return {
          success: false,
          message: "Content wajib diisi",
        };
      }

      const post = await prisma.post.create({
        data: {
          content,
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
      const decoded: any = jwt.verify(token, JWT_SECRET);

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

  .listen(3001);

console.log(`Backend running at http://localhost:${app.server?.port}`);