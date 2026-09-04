import { PrismaClient } from "@prisma/client"
const p = new PrismaClient()
const rows = await p.agentRun.findMany({ where: { agentName: "extractor" }, orderBy: { occurredAt: "desc" }, take: 20, select: { occurredAt: true, ok: true, errorKind: true, outputPreview: true } })
console.log("total:", rows.length)
for (const r of rows) console.log("---", r.occurredAt.toISOString(), r.ok, r.errorKind ?? "", (r.outputPreview ?? "").replace(/\s+/g," ").slice(0,220))
await p.$disconnect()
process.exit(0)
