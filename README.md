# transactional-wallet-ledger

API e dashboard para carteira transacional com ledger auditável.

## Leitura arquitetural

- Monorepo com backend Fastify e dashboard Next.js.
- Foco em consistência ACID, rastreabilidade de débito/crédito e contratos validados por Zod.
- Uso de Prisma/PostgreSQL para persistência transacional e Playwright na camada de verificação quando presente.
- A estrutura do repositório foi lida como evidência principal; este README evita prometer features que não aparecem no código ou no contexto técnico consolidado do portfólio.

## Stack identificada

JavaScript, KSP, Ledger, Redis, Transactions, TypeScript

## Decisões de engenharia

- Separação explícita entre interface, regras de domínio e persistência sempre que a estrutura do projeto permite.
- Validação de entrada e contratos de API são tratados como fronteira de segurança, não como detalhe de UI.
- Persistência e autenticação são documentadas como partes críticas do sistema quando aparecem no stack.
- O projeto prioriza fundamentos verificáveis: modelagem de dados, fluxo operacional claro e manutenção pragmática.

## Evidências observadas

- estrutura analisada a partir dos arquivos públicos do repositório.

## Operação

Antes de rodar em produção, revise variáveis de ambiente, migrações, credenciais, build e políticas de deploy. O repositório deve ser tratado como produto técnico auditável: dependências explícitas, scripts reproduzíveis e logs suficientes para investigar erro real.
