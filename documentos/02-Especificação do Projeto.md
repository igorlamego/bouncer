# Especificação do Projeto

## Perfis de Usuários

[Enumere e faça o detalhamento dos perfis de usuários. Utilize o modelo de tabela abaixo para sintetizá-los.]

<table>
<tbody>
<tr align=center>
<th colspan="2">Organizador</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Organiza, gerencia e garante a ordem e fluidez do evento</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Controle e supervisão fáceis, relatórios e estatísticas precisas </td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Promotor/Promoter</th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Equipe de captação e convite do público, responsável por convidar e cadastrar nomes</td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Sistema de listas eficiente a todo momento, assim como cadastro instantâneo de novos nomes quando necessário</td>
</tr>
</tbody>
</table>

<table>
<tbody>
<tr align=center>
<th colspan="2">Recepção </th>
</tr>
<tr>
<td width="150px"><b>Descrição</b></td>
<td width="600px">Controla a portaria do evento no geral, listas e filas </td>
</tr>
<tr>
<td><b>Necessidades</b></td>
<td>Listas completas, organizadas e atualizadas, com consulta simples e rápida</td>
</tr>
</tbody>
</table>


## Histórias de Usuários

| EU COMO... `QUEM`            | QUERO/PRECISO ... `O QUE`                                   | PARA ... `PORQUE`                                         |
| ---------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| Eu como organizador          | Checar o número atualizado de comparecentes                 | Não superlotar a casa                                     |
| Eu como organizador          | Um relatório de comparecentes/faltantes                     | Avaliar a taxa de comparecimento dos convidados           |
| Eu como organizador          | Uma visão detalhada da lista de convidados de cada promotor | Verificar performance da equipe                           |
| Eu como organizador/promotor | Uma interface simples e funcional                           | Inserir e checar convidados rapidamente                   |
| Eu como organizador/promotor | Acesso à lista de convidados no meio do evento              | Adicionar convidados de última hora                       |
| Eu como promotor/organizador | Funcionalidades de organizar meus convidados por categorias | Cadastrar aniversariantes, lista off e outros convidados  |
| Eu como recepção             | Uma busca fácil e rápida por nomes de convidados            | Não gerar atrasos e grandes filas                         |
| Eu como recepção             | A lista de convidados completa                              | Evitar nomes erroneamente faltantes                       |
| Eu como recepção             | A lista de convidados organizada, com categorias visíveis   | Diferenciar aniversariante, lista off, lista “amiga” etc. |
| Eu como recepção             | A lista de convidados sempre atualizada                     | Evitar confusões por nomes recém inseridos                |


## Requisitos do Projeto

[Com base nas Histórias de Usuários, enumere os requisitos da solução. Lembre-se que cada requisito deve corresponder a uma, e somente uma, característica alvo da solução. Além disso, certifique-se de que todos os aspectos capturados nas Histórias de Usuário foram cobertos.]

### Requisitos Funcionais

| ID    | Descrição                                                                                                                                                        | Prioridade |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RF-01 | A aplicação deve permitir ao usuário cadastrar uma conta.                                                                                                        | ALTA |
| RF-02 | A aplicação deve permitir ao usuário fazer o login da sua conta.                                                                                                 | ALTA |
| RF-03 | A aplicação deve permitir ao usuário criar um evento e inserir os convidados.                                                                                    | ALTA |
| RF-04 | A aplicação deve oferecer uma funcionalidade de filtro/pesquisa para permitir ao usuário localizar listas específicas de convidados e/ou convidados específicos. | ALTA |
| RF-05 | A aplicação deve permitir ao usuário disponibilizar informações sobre os eventos.                                                                                | MÉDIA |
| RF-06 | A aplicação deve apresentar informações básicas do evento, bem como regras e condutas.                                                                           | MÉDIA |
| RF-07 | A aplicação deve apresentar uma imagem correspondente à arte do evento.                                                                                          | BAIXA |
| RF-08 | A aplicação deve permitir que os convidados sejam importados ou exportados para Excel.                                                                           | MÉDIA |
| RF-09 | A aplicação deve permitir ao organizador gerar relatórios de presença e ausência de convidados.                                                                  | ALTA |
| RF-10 | A aplicação deve permitir ao promotor/organizador classificar convidados por categorias (aniversariante, VIP, cortesia, lista “amiga” etc.).                     | MÉDIA |

**Prioridade: Alta / Média / Baixa. 

### Requisitos não Funcionais

| ID     | Descrição                                                                                                           | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------------------------- | ---------- |
| RNF-01 | A aplicação deve ser publicada em um ambiente acessível público na Internet.                                        | ALTA |
| RNF-02 | A aplicação deverá ser responsiva permitindo a visualização em dispositivos móveis e web.                           | ALTA |
| RNF-03 | A aplicação deve ser compatível com os principais navegadores do mercado: Google Chrome, Firefox e Microsoft Edge.  | ALTA |
| RNF-04 | A aplicação deve ter disponível acessibilidade de leitor imersivo.                                                  | BAIXA |
| RNF-05 | A aplicação deve responder a consultas de busca por convidados em até 2 segundos, garantindo agilidade na recepção. | MÉDIA |

**Prioridade: Alta / Média / Baixa. 

