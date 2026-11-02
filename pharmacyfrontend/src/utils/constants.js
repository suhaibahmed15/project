// System-wide constants

export const ROLES = {
  ADMIN: "Admin",
  PHARMACIST: "Pharmacist",
  STORE_MANAGER: "StoreManager"
};

export const ALERT_TYPES = {
  LOW_STOCK: 1,
  NEAR_EXPIRY: 2,
  EXPIRED: 3,
  STOCK_OUT: 4
};

export const ALERT_TYPE_LABELS = {
  1: "Low Stock",
  2: "Near Expiry",
  3: "Expired",
  4: "Stock Out"
};

export const TRANSACTION_TYPES = {
  STOCK_IN: 1,
  STOCK_OUT: 2,
  ADJUSTMENT: 3,

};

export const TRANSACTION_TYPE_LABELS = {
  1: "Stock In",
  2: "Stock Out / Dispensed",
  3: "Adjustment",

};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];
