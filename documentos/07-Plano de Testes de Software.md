# Plano de Testes de Software

Os requisitos para realização dos testes de software são:
<ul><li>Site publicado na internet;</li>
<li>Navegador da internet: Chrome, Firefox ou Edge.</li>
</ul>

Os testes funcionais a serem realizados na aplicação são descritos a seguir.

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-01: Verificar o funcionamento dos links da página Home</td>

  <td>
   <ul>
    <li>RF-01: A aplicação deve permitir ao usuário cadastrar uma conta.</li>
    <li>RF-02: A aplicação deve permitir ao usuário fazer o login da sua conta.</li>
   </ul>
  </td>

  <td>Verificar se os links da página Home estão encaminhando para as respectivas páginas corretamente.</td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar nos links da página Home.</li>
   </ol>
  </td>

  <td>Todos os links da página Home devem encaminhar o usuário para as páginas descritas.</td>

  <td>Eduardo</td>
 </tr>

</table>

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-02: Verificar o cadastro de usuários</td>

  <td>
   <ul>
    <li>RF-01: A aplicação deve permitir ao usuário cadastrar uma conta.</li>
   </ul>
  </td>

  <td>Verificar se o cadastro está sendo feito corretamente.</td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar em “Cadastrar”, no Menu.</li>
    <li>Preencher o formulário e clicar em “Criar conta”.</li>
   </ol>
  </td>

  <td>Deve ocorrer a validação das informações fornecidas pelo usuário e, ao clicar em “Criar conta”, deve aparecer a mensagem “Usuário cadastrado com sucesso”.</td>

  <td>Eduardo</td>
 </tr>

</table>

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-03: Verificar o login de usuários</td>

  <td>
   <ul>
    <li>RF-02: O site deve permitir ao usuário fazer o login da sua conta.</li>
   </ul>
  </td>

  <td>Verificar se o login está sendo feito corretamente.</td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar em “Entrar”, no menu.</li>
    <li>Preencher seus dados e clicar em “Entrar”.</li>
   </ol>
  </td>

  <td>Após o login, o usuário deverá ser redirecionado para a sua página de perfil.</td>

  <td>Eduardo</td>
 </tr>

</table>

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-04: Verificar o funcionamento dos links da página "Dashboard"</td>

  <td>
   <ul>
    <li>RF-03: A aplicação deve permitir ao usuário criar um evento e inserir os convidados.</li>
    <li>RF-04: A aplicação deve oferecer uma funcionalidade de filtro/pesquisa para permitir ao usuário localizar listas específicas de convidados e/ou convidados específicos.</li>
    <li>RF-05: A aplicação deve permitir ao usuário disponibilizar informações sobre os eventos.</li>
    <li>RF-06: A aplicação deve apresentar informações básicas do evento, bem como regras e condutas.</li>
    <li>RF-09: A aplicação deve permitir ao organizador gerar relatórios de presença e ausência de convidados.</li>
   </ul>
  </td>

  <td>
   Verificar se os links da página "Dashboard" estão encaminhando para as respectivas páginas corretamente e se o painel está exibindo as informações dos eventos cadastrados e dos participantes.
  </td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar em “Entrar”, no menu.</li>
    <li>Preencher seus dados e clicar em “Entrar”.</li>
    <li>Visualizar a página Dashboard.</li>
    <li>Clicar nos links da página Dashboard.</li>
   </ol>
  </td>

  <td>
   A página Dashboard deve ser visualizada contendo as informações dos eventos e dos participantes e todos os links da página Dashboard devem encaminhar os usuários para as páginas descritas.
  </td>

  <td>Eduardo</td>
 </tr>

</table>

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-05: Verificar o cadastro de eventos</td>

  <td>
   <ul>
    <li>RF-03: A aplicação deve permitir ao usuário criar um evento e inserir os convidados.</li>
    <li>RF-05: A aplicação deve permitir ao usuário disponibilizar informações sobre os eventos.</li>
    <li>RF-06: A aplicação deve apresentar informações básicas do evento, bem como regras e condutas.</li>
    <li>RF-07: A aplicação deve apresentar uma imagem correspondente à arte do evento.</li>
   </ul>
  </td>

  <td>Verificar se o usuário consegue cadastrar o evento corretamente.</td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar em “Entrar”, no menu.</li>
    <li>Preencher seus dados e clicar em “Entrar”.</li>
    <li>Visualizar a página Dashboard.</li>
    <li>Clicar em “Eventos” no menu superior ou em “Meus eventos”.</li>
    <li>Clicar em “+ Criar Evento”.</li>
    <li>Inserir as informações sobre o evento (incluindo o flyer/arte do evento).</li>
    <li>Clicar em “Salvar Evento”.</li>
   </ol>
  </td>

  <td>Deverá aparecer a mensagem indicando que o evento foi criado com sucesso.</td>

  <td>Eduardo</td>
 </tr>


</table>

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-06: Verificar o cadastro de participantes</td>

  <td>
   <ul>
    <li>RF-03: A aplicação deve permitir ao usuário criar um evento e inserir os convidados.</li>
    <li>RF-04:	A aplicação deve oferecer uma funcionalidade de filtro/pesquisa para permitir ao usuário localizar listas específicas de convidados e/ou convidados específicos.</li>
    <li>RF-09: A aplicação deve permitir ao organizador gerar relatórios de presença e ausência de convidados.</li>
    <li>RF-10: A aplicação deve permitir ao promotor/organizador classificar convidados por categorias (aniversariante, VIP, cortesia, lista “amiga” etc.).</li>
   </ul>
  </td>

  <td>Verificar se o usuário consegue cadastrar participantes corretamente.</td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar em “Entrar”, no menu.</li>
    <li>Preencher seus dados e clicar em “Entrar”.</li>
    <li>Visualizar a página Dashboard.</li>
    <li>Clicar em “Participantes”.</li>
    <li>Selecionar o evento desejado.</li>
    <li>Clicar em “Adicionar Participante”.</li>
    <li>Inserir as informações sobre o participante.</li>
    <li>Clicar em “Salvar Participante”.</li>
   </ol>
  </td>

  <td>Deverá aparecer a mensagem indicando que o participante foi adicionado com sucesso.</td>

  <td>Gabriel</td>
 </tr>

</table>

<table>
 <tr>
  <th>Caso de teste</th>
  <th>Requisitos associados</th>
  <th>Objetivo do teste</th>
  <th>Passos</th>
  <th>Critérios de êxito</th>
  <th>Responsável</th>
 </tr>

 <tr>
  <td>CT-07: Verificar as métricas do Dashboard (Painel)</td>

  <td>
   <ul>
    <li>RF-04: A aplicação deve oferecer uma funcionalidade de filtro/pesquisa para permitir ao usuário localizar listas específicas de convidados e/ou convidados específicos.</li>
    <li>RF-09: A aplicação deve permitir ao organizador gerar relatórios de presença e ausência de convidados.</li>
   </ul>
  </td>

  <td>Verificar se as métricas do Dashboard (painel) são atualizadas corretamente.</td>

  <td>
   <ol>
    <li>Acessar o navegador.</li>
    <li>Informar o endereço do site.</li>
    <li>Visualizar a página Home.</li>
    <li>Clicar em “Entrar”, no menu.</li>
    <li>Preencher seus dados e clicar em “Entrar”.</li>
    <li>Visualizar a página Dashboard.</li>
    <li>Clicar em “Eventos” no menu superior ou em “Meus eventos”.</li>
    <li>Clicar em “+ Criar Evento”.</li>
    <li>Inserir as informações sobre o evento (incluindo o flyer).</li>
    <li>Clicar em “Salvar Evento”.</li>
    <li>Clicar em “Participantes”.</li>
    <li>Selecionar o evento criado.</li>
    <li>Clicar em “Adicionar Participante”.</li>
    <li>Inserir as informações do participante.</li>
    <li>Clicar em “Salvar Participante”.</li>
    <li>Alterar o status de presença de alguns participantes (ex.: presente/ausente).</li>
   </ol>
  </td>

  <td>
   O número total de eventos, o número total de participantes e o percentual médio de comparecimento devem corresponder aos dados cadastrados.
  </td>

  <td>Gabriel</td>
 </tr>

</table>
