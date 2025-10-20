/// <reference types="node" />

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.companionTask.deleteMany();
  await prisma.circleSession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.circle.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("letmein", 10);

  const user = await prisma.user.create({
    data: {
      name: "Avery Stone",
      email: "avery@circlecast.ai",
      handle: "avery-studio",
      birthdate: new Date("1992-04-17T00:00:00.000Z"),
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
    }
  });

  const circle = await prisma.circle.create({
    data: {
      name: "Indie Game Audio Lab",
      focusArea: "Indie game music production",
      cadence: "Tue & Thu",
      access: "PREMIUM",
      members: 18,
      companionTone: "Energetic, collaborative, detail oriented",
      ownerId: user.id
    }
  });

  const session = await prisma.circleSession.create({
    data: {
      circleId: circle.id,
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24),
      topic: "FM Synthesis deep dive",
      status: "SCHEDULED",
      hostId: user.id
    }
  });

  await prisma.companionTask.createMany({
    data: [
      {
        circleId: circle.id,
        title: "Generate promo clip",
        kind: "CLIP",
        status: "IN_PROGRESS",
        etaMinutes: 5,
        payload: {
          highlight: "FM patch breakdown",
          targetChannels: ["TikTok", "Instagram Reels"],
          insight:
            "Surface the FM synthesis walkthrough and share stem exports for collaborators."
        }
      },
      {
        circleId: circle.id,
        title: "Draft recap email",
        kind: "SUMMARY",
        status: "QUEUED",
        etaMinutes: 3,
        payload: {
          insight:
            "Highlight the granular synthesis discussion and attach Ableton rack presets."
        }
      }
    ]
  });

  console.log(
    `Seeded circle ${circle.name} with session ${session.topic} and companion tasks.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
