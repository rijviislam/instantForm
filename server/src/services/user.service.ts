import { prisma } from "../db";
import bcrypt from "bcryptjs";

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

interface StoredUser extends SafeUser {
  password?: string | null;
  updatedAt: Date;
}

// Development fallback store when Neon database connection is not yet configured in .env
const devUsersStore = new Map<string, StoredUser>();

export class UserService {
  private static isPrismaAvailable = true;

  static async findByEmail(email: string): Promise<StoredUser | null> {
    const normalizedEmail = email.trim().toLowerCase();

    if (this.isPrismaAvailable) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        return user;
      } catch (error) {
        console.warn(
          "⚠️ Neon PostgreSQL not reachable; using development storage. Set DATABASE_URL in server/.env with your Neon connection string."
        );
        this.isPrismaAvailable = false;
      }
    }

    // Dev fallback store
    for (const user of devUsersStore.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        return user;
      }
    }
    return null;
  }

  static async findById(id: string): Promise<SafeUser | null> {
    if (this.isPrismaAvailable) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });
        return user;
      } catch (error) {
        this.isPrismaAvailable = false;
      }
    }

    const user = devUsersStore.get(id);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    };
  }

  static async ensureUser(data: {
    id?: string;
    email: string;
    name?: string | null;
  }): Promise<SafeUser> {
    const normalizedEmail = data.email.trim().toLowerCase();

    // 1. Try finding by id
    if (data.id) {
      const byId = await this.findById(data.id);
      if (byId) return byId;
    }

    // 2. Try finding by email
    const byEmail = await this.findByEmail(normalizedEmail);
    if (byEmail) {
      return {
        id: byEmail.id,
        name: byEmail.name,
        email: byEmail.email,
        image: byEmail.image,
        createdAt: byEmail.createdAt,
      };
    }

    // 3. Auto-provision in DB
    if (this.isPrismaAvailable) {
      try {
        const user = await prisma.user.create({
          data: {
            id: data.id || undefined,
            name: data.name || normalizedEmail.split("@")[0],
            email: normalizedEmail,
            password: "",
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });
        return user;
      } catch (e) {
        console.warn("⚠️ Could not provision user in database, using dev fallback store.");
        this.isPrismaAvailable = false;
      }
    }

    // 4. Fallback dev store
    const id = data.id || `user_${Date.now()}`;
    const now = new Date();
    const newUser: StoredUser = {
      id,
      name: data.name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      image: null,
      createdAt: now,
      updatedAt: now,
    };
    devUsersStore.set(id, newUser);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      createdAt: newUser.createdAt,
    };
  }

  static async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<SafeUser> {
    const normalizedEmail = data.email.trim().toLowerCase();

    if (this.isPrismaAvailable) {
      try {
        const user = await prisma.user.create({
          data: {
            name: data.name.trim(),
            email: normalizedEmail,
            password: data.passwordHash,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });
        return user;
      } catch (error) {
        console.warn(
          "⚠️ Neon PostgreSQL not reachable; creating user in development storage."
        );
        this.isPrismaAvailable = false;
      }
    }

    // Dev fallback store
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    const newUser: StoredUser = {
      id,
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.passwordHash,
      image: null,
      createdAt: now,
      updatedAt: now,
    };

    devUsersStore.set(id, newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      createdAt: newUser.createdAt,
    };
  }

  static async findOrCreateOAuthUser(data: {
    name?: string | null;
    email: string;
    image?: string | null;
    provider: string;
    providerAccountId: string;
  }): Promise<SafeUser> {
    const normalizedEmail = data.email.trim().toLowerCase();

    if (this.isPrismaAvailable) {
      try {
        let user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: data.name || "User",
              email: normalizedEmail,
              image: data.image || null,
            },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          });
        }

        // Link account in Prisma
        try {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: data.provider,
                providerAccountId: data.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: user.id,
              type: "oauth",
              provider: data.provider,
              providerAccountId: data.providerAccountId,
            },
          });
        } catch {
          // Ignore account linking conflict
        }

        return user;
      } catch (error) {
        console.warn("⚠️ Neon PostgreSQL not reachable; using dev store for OAuth user.");
        this.isPrismaAvailable = false;
      }
    }

    // Dev fallback store
    for (const u of devUsersStore.values()) {
      if (u.email.toLowerCase() === normalizedEmail) {
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          image: u.image,
          createdAt: u.createdAt,
        };
      }
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    const newUser: StoredUser = {
      id,
      name: data.name || "User",
      email: normalizedEmail,
      image: data.image || null,
      createdAt: now,
      updatedAt: now,
    };
    devUsersStore.set(id, newUser);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
      createdAt: newUser.createdAt,
    };
  }
}
