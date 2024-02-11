import * as _95 from "./wasm/v1/authz";
import * as _96 from "./wasm/v1/genesis";
import * as _97 from "./wasm/v1/ibc";
import * as _98 from "./wasm/v1/proposal";
import * as _99 from "./wasm/v1/query";
import * as _100 from "./wasm/v1/tx";
import * as _101 from "./wasm/v1/types";
import * as _286 from "./wasm/v1/tx.amino";
import * as _287 from "./wasm/v1/tx.registry";
import * as _288 from "./wasm/v1/query.lcd";
import * as _289 from "./wasm/v1/query.rpc.Query";
import * as _290 from "./wasm/v1/tx.rpc.msg";
import * as _377 from "./lcd";
import * as _378 from "./rpc.query";
import * as _379 from "./rpc.tx";
export namespace cosmwasm {
  export namespace wasm {
    export const v1 = {
      ..._95,
      ..._96,
      ..._97,
      ..._98,
      ..._99,
      ..._100,
      ..._101,
      ..._286,
      ..._287,
      ..._288,
      ..._289,
      ..._290
    };
  }
  export const ClientFactory = {
    ..._377,
    ..._378,
    ..._379
  };
}