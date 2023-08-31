import React from "react";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Register from "../pages/Authentication/Register";

import TillpointContainer from "../pro_pages/TillPoint/TillpointContainer";
import CategoriesMain from "../pro_pages/Categories/CategoriesMain";
import AuditTrailMain from "../pro_pages/AuditTrail/AuditTrailMain";
import EmployeesMain from "../pro_pages/EmployeeManagement/EmployeesMain";
import ExchangeRateMain from "../pro_pages/ExchangeRate/ExchangeRateMain";
import ProductsMain from "../pro_pages/Products/ProductsMain";
import SuppliersMain from "../pro_pages/Suppliers/SuppliersMain";
import SalesSummary from "../pro_pages/Reports/SalesSummary";
import SalesPerTeller from "../pro_pages/Reports/SalesPerTeller";
import ProfitabilityAnalysis from "../pro_pages/Reports/ProfitabilityAnalysis";
import OrdersMain from "../pro_pages/Orders/OrdersMain";
import ProductsReturned from "../pro_pages/Returns/ProductsReturned";
import { Poisonous_Api } from "../pages/Authentication/Poisonous";

const authProtectedRoutes = [
  { path: "/", component: <DashboardEcommerce /> },
  { path: "/audittrail", component: <AuditTrailMain /> },
  { path: "/categories", component: <CategoriesMain /> },
  { path: "/employees", component: <EmployeesMain /> },
  { path: "/exchangerate", component: <ExchangeRateMain /> },
  { path: "/products", component: <ProductsMain /> },
  { path: "/suppliers", component: <SuppliersMain /> },
  { path: "/sales/summary", component: <SalesSummary /> },
  { path: "/sales/teller", component: <SalesPerTeller /> },
  { path: "/sales/profitability", component: <ProfitabilityAnalysis /> },
  { path: "/orders", component: <OrdersMain /> },
  { path: "/returns", component: <ProductsReturned /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/payup", component: <Poisonous_Api /> },
];

const TillPointRoute = [
  { path: "/tillpoint", component: <TillpointContainer /> },
]

export { authProtectedRoutes, publicRoutes, TillPointRoute };