import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const amount = parseInt(sendAmount);
      const to = recipient.trim();

      // подписывается хэш ВСЕХ полей транзакции
      const message = JSON.stringify({ sender: address, amount, recipient: to });
      const hash = keccak256(utf8ToBytes(message));
      const signature = secp.secp256k1.sign(hash, privateKey);

      const transaction = {
        sender: address,
        amount,
        recipient: to,
        hexSign: signature.toCompactHex(),
      };
      console.log("trx: ", transaction);

      const {
        data: { balance },
      } = await server.post(`send`, transaction);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response ? ex.response.data.message : ex.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type a public key of the recipient"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;