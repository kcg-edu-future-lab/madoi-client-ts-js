# madoi-client-ts-js

A TypeScript/JavaScript Client library for <a href="https://github.com/kcg-edu-future-lab/madoi">Distributed Information Sharing Platform: Madoi</a>.

<a href="https://github.com/kcg-edu-future-lab/madoi">分散情報共有基盤Madoi</a>のTypeScript/JavaScript用クライアントライブラリ。

Reactと組み合わせて使う場合は <a href="https://github.com/kcg-edu-future-lab/madoi-client-react">madoi-react</a> も参照してください。

[![Current Release](https://img.shields.io/npm/v/madoi-client.svg)](https://www.npmjs.com/package/madoi-client)
[![Licence](https://img.shields.io/github/license/kcg-edu-future-lab/madoi-client-ts-js.svg)](https://github.com/kcg-edu-future-lab/madoi-client-ts-js/blob/master/LICENSE)

## Install

```bash
npm i madoi-client
```

## Getting started

### Prepare HTML

```html
<!doctype html>
<html lang="ja">
<head>
<meta charset="utf8" />
</head>
<body>
<div>
  <button id="counter1" type="button">count is 0</button>
  <button id="counter2" type="button">count is 0</button>
</div>
<script type="module" src="/src/main.ts"></script>
</body>
</html>
```


### Sharing a function execution (Madoi.registerFunction)

関数の実行をウェブアプリケーション間で共有する例を以下に示します。

```ts
import { Madoi } from 'madoi-client'

window.addEventListener("load", ()=>{
  const madoi = new Madoi("wss://host/madoi-server/rooms/room001", "MADOI_API_KEY");

  const element1 = document.querySelector('#counter1')!;
  let counter1 = 0;
  const incrementCounter = madoi.registerFunction(() => {
    counter1++;
    element1.innerHTML = `count is ${counter1}`
  });
  element1.addEventListener('click', () => incrementCount());  // incrementCounter is executed at all applications joined to same room.
});
```

`Madoi`クラスの`registerFunction`メソッドに関数を渡すと、新たな関数を返します。
返された関数を実行すると、Madoiサーバに関数の登録番号と引数が送信され、自身も含め同じルームに参加しているアプリケーション全てにそれが送信され、それを受信すると、`registerFunction`に渡された関数が実行されます。このように、`registerFunction`を使うと、簡単に関数の実行を共有できます。複数のアプリケーションで同時に実行された場合でも、サーバから各アプリケーションへは同じ順番でメッセージが届くので、アプリケーション間での振る舞いを統一できます。

ここで、新しいアプリケーションが参加してきた時の状態共有を考えてみます。上記の例では、`incrementCounter`関数でcounterを+1しているため、最新時の状態に追いつくには、それまでの全ての実行を再現する必要があります。そのためMadoiは、関数の実行履歴を全て保存しており、新しくアプリケーションが参加するとその履歴を渡しています。しかし実行回数が増えてくると、このやり方は非効率です。この問題を解決する方法を次に紹介します。

### Sharing a model (Madoi.register)

まず、同期したい状態と、その状態を変更・取得・設定するメソッドを持つクラスを作成します。

```ts
class Counter{
  private element: HTMLElement
  private count = 0; // 同期したい状態
  constructor(element: HTMLElement){
    this.element = element;
  }
  // 状態を変更するメソッド
  @Share()
  increment(){
    this.count++;
    this.element.innerHTML = `count is ${this.count}`;
  }
  // 状態を取得するメソッド
  @GetState()
  getCount(){
    return this.count;
  }
  // 状態を変更するメソッド
  @SetState()
  setCount(count: number){
    this.count = count;
    this.element.innerHTML = `count is ${this.count}`;
  }
}
```

`Counter`クラスは、状態の変更を行う`increment`、状態を取得する`getCount`、状態を設定する`setCount`メソッドを持つシンプルなクラスです。状態を取得するメソッドには`@GetState()`デコレータを、状態を設定するメソッドには`@SetState()`デコレータを、状態を変更するメソッドには、`@Share()`デコレータを付けます。Madoiクライアントは、状態共有を行うために、これらのメソッドを適切に呼び出します。

次に、`Counter`クラスのインスタンスを作成し、Madoiクライアントに登録します。

```ts
import { Madoi } from 'madoi-client'

window.addEventListener("load", ()=>{
  const madoi = new Madoi("wss://host/madoi-server/rooms/room001", "MADOI_API_KEY");

  const element2 = document.querySelector<HTMLDivElement>('#counter2')!;
  let counter2 = new Counter(element2);
  madoi.register(counter2);
  element2.addEventListener('click', () => counter2.increment());  // counter2.increment() is executed at all applications joining same room.
});
```

Madoiクライアントにオブジェクトを登録すると、デコレータがつけられたメソッドを介して、状態が管理されます。この例では、`increment`メソッドが実行されると、同じMadoiサーバのルームに参加している他のアプリケーションの`increment`メソッドも実行されます。また、定期的に`getCount`メソッドが呼び出され、状態が取得され、Madoiサーバに送信されます。新しくアプリケーションが参加してくると、最新の状態と、それ以降のメソッド実行履歴が送信され、アプリケーション内で状態の設定(`setCount`)とメソッドの実行が行われ、最新の状態に追いつきます。

このように、Madoiクライアントを利用すると、コラボレーションツールなどの実装に必要な状態同期を、クライアントアプリケーション側の宣言的な記述のみで(サーバ実装やクライアントのネットワーク関連処理、状態管理処理無しで)実現できます。
