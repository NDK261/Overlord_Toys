// src/lib/vnpay.ts
// Tích hợp VNPay - Cổng thanh toán
// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html

import crypto from "crypto";

export interface VNPayOrderData {
  orderId: string;
  amount: number; // Số tiền (VNĐ) - VNPay x100 tự động
  orderInfo: string; // Mô tả đơn hàng
  returnUrl: string; // URL redirect sau khi thanh toán
  ipAddr: string; // IP của người dùng
  locale?: "vn" | "en";
  bankCode?: string;
}

/**
 * Tạo VNPay payment URL
 * Redirect người dùng đến URL này để thanh toán
 */
export function createVNPayPaymentUrl(orderData: VNPayOrderData): string {
  const tmnCode = process.env.VNPAY_TMN_CODE!;
  const hashSecret = process.env.VNPAY_HASH_SECRET!;
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Dùng sandbox cho test

  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(orderData.amount * 100),
    vnp_CreateDate: createDate,
    vnp_CurrCode: "VND",
    vnp_IpAddr: orderData.ipAddr,
    vnp_Locale: orderData.locale || "vn",
    vnp_OrderInfo: orderData.orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl: orderData.returnUrl,
    vnp_TxnRef: orderData.orderId,
    vnp_ExpireDate: expireDate,
  };

  if (orderData.bankCode) {
    params.vnp_BankCode = orderData.bankCode;
  }

  // Sắp xếp theo alphabet và tạo query string
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {} as Record<string, string>);

  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", hashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const queryString = new URLSearchParams({
    ...sortedParams,
    vnp_SecureHash: signed,
  }).toString();

  return `${vnpUrl}?${queryString}`;
}

/**
 * Xác thực chữ ký callback/IPN từ VNPay
 */
export function verifyVNPaySignature(
  params: Record<string, string>,
  hashSecret: string
): boolean {
  const secureHash = params["vnp_SecureHash"];
  const paramsWithoutHash = { ...params };
  delete paramsWithoutHash["vnp_SecureHash"];
  delete paramsWithoutHash["vnp_SecureHashType"];

  const sortedParams = Object.keys(paramsWithoutHash)
    .sort()
    .reduce((acc, key) => ({ ...acc, [key]: paramsWithoutHash[key] }), {} as Record<string, string>);

  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", hashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return signed === secureHash;
}
