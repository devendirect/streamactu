<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Règles projet

- `app/llms.txt/route.ts` et `app/llms-full.txt/route.ts` décrivent le site pour les
  assistants IA. Quand une route publique est ajoutée, renommée ou supprimée, mettre
  à jour ces fichiers (et le footer) dans le même commit.
