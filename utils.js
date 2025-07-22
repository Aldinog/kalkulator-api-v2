const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function calculatePips(pair, op, harga) {
  const pipValues = {
    eurusd: 0.0001,
    gbpusd: 0.0001,
    audusd: 0.0001,
    usdcad: 0.0001,
    usdchf: 0.0001,
    nzdusd: 0.0001,
    eurgbp: 0.0001,
    eurcad: 0.0001,
    eurchf: 0.0001,
    gbpchf: 0.0001,
    audcad: 0.0001,
    audnzd: 0.0001,
    usdjpy: 0.01,
    eurjpy: 0.01,
    gbpjpy: 0.01,
    audjpy: 0.01,
    nzdjpy: 0.01,
    xauusd: 0.01,
  };

  const pip = pipValues[pair.toLowerCase()] || 0.0001;
  const entry = harga;
  const h = op === 'buy' ? harga - 200 * pip : harga + 200 * pip;
  const sl = op === 'buy' ? harga - 350 * pip : harga + 350 * pip;
  const tp1 = op === 'buy' ? harga + 200 * pip : harga - 200 * pip;
  const tp2 = op === 'buy' ? harga + 600 * pip : harga - 600 * pip;
  const tp3 = op === 'buy' ? harga + 1000 * pip : harga - 1000 * pip;

  const decimalPlaces = pair.toLowerCase() === "xauusd" ? 2 : 4;

  const format = harga.toFixed(decimalPlaces);
  const hFormat = h.toFixed(decimalPlaces);
  const tp1Format = tp1.toFixed(decimalPlaces);
  const tp2Format = tp2.toFixed(decimalPlaces);
  const tp3Format = tp3.toFixed(decimalPlaces);
  const slFormat = sl.toFixed(decimalPlaces);

  const message = `📈 Pair: ${pair} \n📌 ${op} NOW\n
  Zona Entry: ${format} - ${hFormat}\n❌ SL: ${slFormat}\n🎯 TP 1: ${tp1Format}\n🎯 TP 2: ${tp2Format}\n🎯 TP 3: ${tp3Format}`;

  return { formatted: message, message };
}

export async function sendTelegramMessage(msg) {
  if (!TOKEN || !CHAT_ID) {
    console.log("Token atau Chat ID belum diset.");
    return;
  }

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: "Markdown"
      })
    });
  } catch (err) {
    console.error("Telegram error:", err);
  }
}
