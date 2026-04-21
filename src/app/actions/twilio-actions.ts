
'use server';

import twilio from 'twilio';

/**
 * Envia uma mensagem via Twilio (SMS ou WhatsApp).
 * @param to O número de destino (em formato E.164, ex: +5511999999999).
 * @param message O conteúdo da mensagem.
 * @param useWhatsApp Se true, envia via WhatsApp (requer sandbox/perfil configurado).
 */
export async function sendTwilioMessage(to: string, message: string, useWhatsApp: boolean = false) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Twilio Error: Credentials not found in environment variables.');
    return { 
      success: false, 
      error: 'Configurações do Twilio não encontradas. Verifique as variáveis de ambiente.' 
    };
  }

  const client = twilio(accountSid, authToken);

  try {
    // Formatação básica para E.164
    let formattedTo = to.replace(/\D/g, '');
    if (!formattedTo.startsWith('+')) {
      formattedTo = '+' + formattedTo;
    }

    const from = useWhatsApp ? `whatsapp:${fromNumber}` : fromNumber;
    const toAddress = useWhatsApp ? `whatsapp:${formattedTo}` : formattedTo;

    const result = await client.messages.create({
      body: message,
      from: from,
      to: toAddress
    });

    console.log(`Twilio Message Sent: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error: any) {
    console.error('Twilio SDK Error:', error);
    return { success: false, error: error.message || 'Erro desconhecido ao enviar mensagem.' };
  }
}
