# Direção visual

O Acervo se comporta como uma pequena exposição em papel: fundo marfim, tipografia Newsreader e Manrope, molduras discretas, legendas e intervalos desiguais. A abertura é centrada e conduz imediatamente à parede de obras. As proporções das reproduções são preservadas.

## Variação no portfólio

Pulso é uma ferramenta musical escura, contínua e técnica. Nômade usa estrutura de app para planejamento. Forma constrói uma narrativa de estúdio com hero e apresentação de projetos. O Acervo usa um percurso visual de galeria, sem dashboard, navegação lateral, ilustração de produto ou grade de cards uniformes. A composição foi escrita do zero, sem copiar shells ou CSS desses projetos.

As primeiras três obras têm larguras e alturas de início diferentes. As demais criam outros intervalos na parede. Busca, filtros e ordenação adotam uma grade alinhada para tornar os resultados previsíveis, e o visitante também pode escolher essa disposição manualmente. A ordem visual da ordenação é aplicada ao DOM, preservando a sequência de navegação por teclado.

## Movimento

O movimento é uma aproximação: a moldura se eleva discretamente ao explorar, o controle de zoom altera a superfície de observação, e a leitura tem uma linha de progresso vinculada à rolagem real. Não há entrada em cascata, parallax, animação permanente, captura de scroll ou movimento inventado para ocupar espaço. A preferência de movimento reduzido desativa transições e scroll suave.

## Telas pequenas

A parede usa duas colunas com intervalos menores; páginas de obra passam para uma coluna, e a comparação é empilhada em telas estreitas. A navegação permanece visível sem depender de um menu oculto. O zoom tem sua própria região de rolagem identificada e acessível por teclado.

## Conteúdo e execução

Eleventy gera HTML real para as obras, textos e metadados. Alpine.js adiciona o estado local, busca, notas e comparação. Nenhum serviço remoto participa do uso. O catálogo é uma fixture estática de nove obras com reproduções CC0, e as leituras editoriais são interpretações próprias desta experiência demonstrativa.
