// ============================================================================
// JEEVAN JYOTI FOUNDATION - DONATION PAYMENT ANALYTICS & LOGGING SERVICE
// Tracks payment method interactions, mobile app preference, and conversion telemetry
// ============================================================================

export type PaymentMethodId = 'gpay' | 'phonepe' | 'paytm' | 'card' | 'upi' | 'netbanking';
export type PaymentChannelType = 'direct_bank_account' | 'upi_intent' | 'qr_scan' | 'gateway_card';

export interface PaymentClickEvent {
  method: PaymentMethodId;
  methodName: string;
  channel: PaymentChannelType;
  amount: number;
  purpose: string;
  isDirectAccount: boolean;
  userAgent: string;
  isMobile: boolean;
  timestamp: string;
  epochMs: number;
}

export interface PaymentAnalyticsSummary {
  totalClicks: number;
  byMethod: Record<PaymentMethodId, number>;
  byChannel: Record<PaymentChannelType, number>;
  lastEvent?: PaymentClickEvent;
}

const STORAGE_KEY = 'jjf_donation_payment_clicks';

/**
 * Tracks and logs payment method selection for donor preference analytics
 */
export const trackPaymentMethodClick = (data: {
  method: PaymentMethodId;
  channel: PaymentChannelType;
  amount: number;
  purpose: string;
  isDirectAccount?: boolean;
}): PaymentClickEvent => {
  const isMobile = typeof navigator !== 'undefined' && /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';

  const methodNames: Record<PaymentMethodId, string> = {
    gpay: 'Google Pay',
    phonepe: 'PhonePe',
    paytm: 'Paytm',
    card: 'Credit / Debit Card',
    upi: 'Any UPI',
    netbanking: 'Internet Banking'
  };

  const event: PaymentClickEvent = {
    method: data.method,
    methodName: methodNames[data.method] || data.method,
    channel: data.channel,
    amount: data.amount,
    purpose: data.purpose,
    isDirectAccount: Boolean(data.isDirectAccount),
    userAgent,
    isMobile,
    timestamp: new Date().toISOString(),
    epochMs: Date.now()
  };

  // 1. Structured Console Logging with distinct styling for developer & analytics consoles
  const badgeStyle = 'background: #0024B8; color: #FFD700; font-weight: bold; padding: 2px 6px; border-radius: 4px;';
  const methodStyle = 'color: #10B981; font-weight: bold;';
  const detailStyle = 'color: #6B7280; font-size: 11px;';

  console.groupCollapsed(
    `%c[JJF Payment Analytics]%c 💳 ${event.methodName} Selected • ₹${event.amount} • ${event.isDirectAccount ? 'Direct Bank A/C' : 'UPI Intent'}`,
    badgeStyle,
    methodStyle
  );
  console.info('%cTimestamp:%c ' + event.timestamp, 'font-weight: bold;', detailStyle);
  console.info('%cPayment Channel:%c ' + event.channel, 'font-weight: bold;', detailStyle);
  console.info('%cDevice:%c ' + (isMobile ? 'Mobile' : 'Desktop') + ` (${userAgent})`, 'font-weight: bold;', detailStyle);
  console.table({
    'Method': event.methodName,
    'Code': event.method,
    'Amount (INR)': `₹${event.amount}`,
    'Channel': event.channel,
    'Direct Account': event.isDirectAccount ? 'Yes (Bank A/C Transfer)' : 'No (UPI VPA)',
    'Purpose': event.purpose,
    'Mobile Device': isMobile ? 'Yes' : 'No'
  });
  console.groupEnd();

  // 2. Persist in Local Storage for offline aggregation & analytics retrieval
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: PaymentClickEvent[] = raw ? JSON.parse(raw) : [];
    history.push(event);
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.debug('[JJF Analytics] LocalStorage write omitted:', err);
  }

  // 3. Dispatch custom browser event for real-time listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jjf:payment-method-clicked', { detail: event }));
  }

  return event;
};

/**
 * Returns aggregated statistics of donor payment method preferences
 */
export const getPaymentAnalyticsSummary = (): PaymentAnalyticsSummary => {
  const summary: PaymentAnalyticsSummary = {
    totalClicks: 0,
    byMethod: { gpay: 0, phonepe: 0, paytm: 0, card: 0, upi: 0, netbanking: 0 },
    byChannel: { direct_bank_account: 0, upi_intent: 0, qr_scan: 0, gateway_card: 0 }
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return summary;
    const history: PaymentClickEvent[] = JSON.parse(raw);
    summary.totalClicks = history.length;
    history.forEach((ev) => {
      if (summary.byMethod[ev.method] !== undefined) {
        summary.byMethod[ev.method]++;
      }
      if (summary.byChannel[ev.channel] !== undefined) {
        summary.byChannel[ev.channel]++;
      }
    });
    if (history.length > 0) {
      summary.lastEvent = history[history.length - 1];
    }
  } catch (e) {
    console.warn('[JJF Analytics] Summary read failed:', e);
  }

  return summary;
};
