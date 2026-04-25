export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "freeship" | "discount";
  rewardType: "fixed" | "percentage";
  rewardValue: number;
  minOrder: number;
  expiresAt?: string;
}

export const vouchers: Voucher[] = [
  {
    id: "v1",
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    description: "Miễn phí cho đơn đầu, đơn từ 1tr hoặc khi nhập mã này",
    type: "freeship",
    rewardType: "fixed",
    rewardValue: 30000,
    minOrder: 0,
  },
  {
    id: "v2",
    code: "OVERLORD50",
    name: "Ưu đãi Overlord",
    description: "Giảm 50.000đ cho đơn hàng từ 500.000đ",
    type: "discount",
    rewardType: "fixed",
    rewardValue: 50000,
    minOrder: 500000,
  },
  {
    id: "v3",
    code: "WELCOMENEW",
    name: "Chào mừng bạn mới",
    description: "Giảm 10% cho tất cả đơn hàng",
    type: "discount",
    rewardType: "percentage",
    rewardValue: 10, // 10%
    minOrder: 0,
  },
  {
    id: "v4",
    code: "BIGSALE200",
    name: "Siêu sale cuối tháng",
    description: "Giảm 200.000đ cho đơn hàng từ 2.000.000đ",
    type: "discount",
    rewardType: "fixed",
    rewardValue: 200000,
    minOrder: 2000000,
  }
];
