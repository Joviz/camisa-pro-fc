import { z } from "zod";

export const retiradaSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome precisa ter pelo menos 3 letras")
    .max(50, "Nome longo demais"),

  cpf: z
    .string()
    .min(11, "O CPF precisa ter pelo menos 11 dígitos")
    .max(14, "CPF longo demais"),

  whatsapp: z
    .string()
    .min(10, "Digite um número de telefone válido com DDD")
    .max(15, "Telefone longo demais"),
});

export type RetiradaFormData = z.infer<typeof retiradaSchema>;
