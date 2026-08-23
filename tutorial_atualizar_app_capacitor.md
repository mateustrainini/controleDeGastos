# Atualizar o app Android com Capacitor

Este tutorial serve para quando você **já fez alterações no HTML, CSS ou JavaScript** e quer colocar essas alterações na versão Android usando o Capacitor.

## 1. Abra o terminal na pasta do projeto

```bash
cd C:\wamp64\www\controleDeGastos
```

Confirme que está na pasta correta:

```bash
dir
```

Você deve encontrar `package.json`, o arquivo de configuração do Capacitor e a pasta `android`.

## 2. Verifique o `webDir`

O Capacitor precisa saber onde está o `index.html`.

No seu projeto, se o `index.html` estiver diretamente na raiz, use:

```json
"webDir": "."
```

Se estiver dentro de `www`, use:

```json
"webDir": "www"
```

## 3. Sincronize as alterações

Depois de alterar HTML, CSS ou JavaScript:

```bash
npx cap sync
```

Esse é o comando principal do fluxo de atualização: ele sincroniza os arquivos web com o projeto Android e atualiza as dependências/plugins nativos.

Se quiser apenas copiar os arquivos web:

```bash
npx cap copy
```

Para o uso normal, prefira `npx cap sync`.

## 4. Abra o projeto Android

Depois que o `sync` terminar sem erros:

```bash
npx cap open android
```

O projeto será aberto no Android Studio.

## 5. Teste no celular

Com o celular conectado por USB e a **Depuração USB** ativada:

1. Abra o projeto no Android Studio.
2. Aguarde a sincronização do Gradle terminar.
3. Selecione seu celular como dispositivo.
4. Clique em **Run ▶**.

O Android Studio compilará e instalará a versão atualizada.

## 6. Fluxo normal depois de uma alteração

Se você só alterou HTML, CSS ou JavaScript:

```bash
cd C:\wamp64\www\controleDeGastos
npx cap sync
npx cap open android
```

Depois execute o aplicativo novamente pelo Android Studio.

## 7. Se aparecer o erro `www` não existe

Exemplo:

```text
Could not find the web assets directory: .\www.
```

Isso significa que o `webDir` está apontando para `www`, mas essa pasta não existe.

Se o seu `index.html` está na raiz, configure:

```json
{
  "appId": "com.mateus.controlegastos",
  "appName": "Controle de Gastos",
  "webDir": "."
}
```

Depois:

```bash
npx cap sync
```

## 8. Se aparecer `capacitor.settings.gradle` ausente

Se aparecer:

```text
Could not read script
android\capacitor.settings.gradle
as it does not exist
```

não crie esse arquivo manualmente.

Feche o Android Studio e, se a pasta `android` for somente o projeto gerado pelo Capacitor e você não tiver alterações manuais importantes nela, regenere a plataforma:

```bash
rmdir /s /q android
npx cap add android
npx cap sync
```

## Fluxo resumido

Sempre que fizer alterações no código:

```bash
cd C:\wamp64\www\controleDeGastos
npx cap sync
npx cap open android
```

Depois:

```text
Android Studio
    ↓
Selecionar celular
    ↓
Run ▶
    ↓
Aplicativo atualizado
```

## Importante

Você **não precisa executar `npx cap init` novamente** a cada atualização.

Também não precisa executar `npx cap add android` novamente se a plataforma Android já existe e está funcionando.

Esses comandos são principalmente para a configuração inicial.

No dia a dia, o comando que você mais usará será:

```bash
npx cap sync
```

## Referência

Documentação oficial do Capacitor: https://capacitorjs.com/docs
