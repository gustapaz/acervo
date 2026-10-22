# Verificações realizadas

## Automatizadas

- `npm run build`: Vite e Eleventy concluídos; 18 páginas HTML e sitemap exportados.
- `npm test`: oito testes aprovados, cobrindo filtros, busca sem acentos, ordenação sem mutação da curadoria, validação do armazenamento, parâmetros de comparação, páginas estáticas, links internos e imagens com registro CC0.
- Instalação npm: nenhuma vulnerabilidade reportada na auditoria.
- Build: JavaScript de 60,5 KB (21,5 KB gzip), CSS de 40,9 KB (9 KB gzip), três fontes WOFF2 locais de 147,4 KB no total. As 18 versões WebP somam cerca de 4,25 MB; carregamento responsivo e lazy loading evitam baixar todas de início.

## Navegador Chromium

- Coleção: busca, estado sem resultados, tema e técnica combinados, limpeza de filtros, ordenação cronológica e alternância entre parede e grade.
- Seleção: guardar uma obra, escrever uma nota, recarregar a página e verificar persistência; confirmação de limpeza e estado vazio.
- Comparação: seleção mantida ao navegar entre coleção e obra, duas imagens lado a lado, rejeição de obras iguais e troca pelas listas nativas.
- Observação: imagem em 200% com dimensões roláveis; foco de teclado na região ampliada, contenção em modal e retorno ao controle de origem com Escape.
- Cadernos: abertura de ensaio e alteração do tamanho do texto.
- Projeto: pergunta frequente expandida e resposta legível.
- Telas de 320, 390, 768 e 1.280 pixels; sem overflow horizontal global nas verificações. Uma rolagem de um pixel causada pela nota rotacionada no tablet foi corrigida limitando sua largura.
- Leituras no console apresentaram ruído de uma extensão do navegador, sem erros identificados da aplicação nos fluxos inspecionados.

## Limites

Não foram medidos escores Lighthouse, executada auditoria com leitor de tela ou feitos testes em Safari, Firefox e aparelhos físicos. A impressão possui estilos dedicados, mas não foi validada em impressora ou no diálogo nativo de PDF. Movimento reduzido está implementado no CSS, sem simulação da preferência do sistema nesta revisão.

As interpretações curatoriais são texto editorial desta demonstração. Os metadados e o status CC0 foram obtidos em fonte primária; o registro de fontes inclui URLs originais, créditos, data da coleta e hashes dos arquivos de origem.
