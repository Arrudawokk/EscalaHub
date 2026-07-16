# Limitações conhecidas — EscalaHub 1.0.0

Estas limitações não são erros de compilação; são dependências operacionais ou controles que precisam ser concluídos antes de escalar vendas.

## Bloqueadores de lançamento comercial

1. **Stripe ainda não homologada no deploy.** Configurar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e `PRICE_ID` no mesmo modo. A Secret Key compartilhada durante a migração deve ser rotacionada antes disso.
2. **Analytics público inativo.** O HTML publicado não contém GA4, GTM nem Meta Pixel. Configurar IDs reais e validar os eventos nas ferramentas oficiais.
3. **Domínio definitivo não conectado.** A URL operacional é `teste-site-qnxk.vercel.app`; `escalahub.com` ainda publica outra aplicação. Canonical e webhook só devem apontar para o domínio final depois do DNS correto.
4. **Homologação transacional externa pendente.** Não foi criada uma cobrança real durante esta migração. Pix, cartão aprovado/recusado, webhook, retry, reembolso, disputa e entrega precisam ser testados no modo test e depois por uma compra controlada em produção.
5. **Persistência e R2 não verificáveis externamente.** Aplicar as três migrações, testar backup/restauração, configurar credenciais R2 e enviar o PDF na chave do catálogo antes da primeira venda.

## Riscos que reduzem notas abaixo de 9

- **Segurança:** falta rate limiting distribuído/WAF confirmado nos endpoints de criação, consulta e recuperação de conta. Ativar regra por IP e comportamento no projeto Vercel, com monitoramento de HTTP 429.
- **Escalabilidade:** o envio de e-mails está abstraído, mas ainda não possui provedor e fila persistente. Conectar um provedor e uma fila antes de depender do e-mail como canal primário de entrega.
- **Performance:** não existem dados de campo de Core Web Vitals; a capa original tem aproximadamente 2,56 MB, embora o Next/Image entregue formatos e tamanhos otimizados aos navegadores. Medir tráfego real e otimizar o arquivo-fonte se os dados mostrarem impacto.
- **SEO:** o domínio de marca ainda não serve esta aplicação. Conectar o domínio, redefinir `NEXT_PUBLIC_SITE_URL`, reenviar sitemap e validar Search Console.
- **Conversão:** não existem depoimentos reais autorizados e as formas de pagamento Stripe ainda não foram homologadas no deploy. Manter prova social oculta até existirem evidências reais.
- **Conformidade:** analytics dispara quando configurado; consentimento e textos legais precisam de revisão jurídica antes de campanhas com rastreamento.
- **Política de scripts do npm:** a instalação informa que os scripts de `sharp` e `unrs-resolver` ainda não foram revisados pela política `allowScripts` desta máquina. O build utiliza as dependências com sucesso e não há vulnerabilidade reportada; revisar e fixar a política do CI antes de tornar essa validação obrigatória no pipeline.

## Limitações aceitas da V1

- Sem OAuth; acesso à conta usa e-mail e código de pedido aprovado.
- Sem painel administrativo de catálogo.
- Sem cupons, afiliados, marketplace ou assinaturas.
- Sem Meta Conversions API ou Google Enhanced Conversions server-side.
- Sem suíte E2E automatizada do modo de teste da Stripe.
- Dois projetos Vercel permanecem conectados ao mesmo repositório; consolidar somente após comparar variáveis e domínios.
