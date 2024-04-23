Esse projeto tem como intuito possibilitar a transmissão de dados armazenados em uma extensão para uma paǵina web.
Ele é dividido em duas partes, sendo uma a extensão e outro a página.

A extensão possui um manifesto, que serve para o navegador identificar quais são os scripts utilizados na extensão, quais permissões essa extensão possui, além de nome, versão, descrição, etc.
Ela também possui uma estrutura para mandar mensagens internamente e para fora da extensão através de eventos personalizados.

Background : Tem a função de ouvir as mensagens vindas do pop-up e do content e realizar as ações pedidas nessas mensagens, como armazenar dados e enviar dados armazenados. Ele também ira participar na construção da hashchain.
Content : Realiza a comunicação entre a página e a extensão, envia e recebe mensagens para o background(pedindo dados) e cria e recebe eventos personalizados da página, esses eventos personalizados podem conter dados.
Pop-Up : Área de interação com o usuário, digitar dados, por exemplo.






Utilização :

1° : Instalar a API do google chrome para apis( npm install --save-dev @types/chrome)

2° : rodar npm run build
3° : carregar a pasta dist na aba de desenvolvedor de extensão do chrome
4° : rodar npm run dev na página.
5° : usar a extensão no navegador juntamente à extensão.

