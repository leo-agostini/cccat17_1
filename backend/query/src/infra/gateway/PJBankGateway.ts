import axios from "axios";
import PaymentGateway from "../../application/gateway/PaymentGateway";

export default class PJBankGateway implements PaymentGateway {
  async createTransaction(input: any): Promise<any> {
    console.log("processing pjbank");
    const [mes, ano] = input.expDate.split("/");
    const creditCard = {
      nome_cartao: input.cardHolder,
      numero_cartao: input.creditCardNumber,
      mes_vencimento: mes,
      ano_vencimento: ano,
      cpf_cartao: "64111456529",
      codigo_cvv: input.cvv,
      email_cartao: "api@pjbank.com.br",
    };
    const request1 = {
      url: `https://sandbox.pjbank.com.br/recebimentos/e0727263cc7a983f0aae5411ad86c5a144b8ed28/tokens`,
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-CHAVE": "e9db986de751de918ca19a1c377f0b7c313915f8",
      },
      data: creditCard,
    };
    const output1 = await axios(request1);

    let transaction = {
      pedido_numero: "1",
      token_cartao: output1.data.token_cartao,
      valor: 100000,
      parcelas: 1,
      descricao_pagamento: "",
    };

    const request2 = {
      url: `https://sandbox.pjbank.com.br/recebimentos/e0727263cc7a983f0aae5411ad86c5a144b8ed28/transacoes`,
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-CHAVE": "e9db986de751de918ca19a1c377f0b7c313915f8",
      },
      data: transaction,
    };

    const output2 = (await axios(request2)).data;
    console.log(output2)
    let status = "rejected";
    if (output2.autorizada === "1") {
      status = "approved";
    }

    return {
      tid: output2.tid,
      authorizationCode: output2.autorizacao,
      status,
    };
  }
}
