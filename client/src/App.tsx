import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import MenuListingPage from "./components/MenuListingPage";
import DishDetailPage from "./components/DishDetailPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import RetryPaymentPage from "./components/RetryPaymentPage";
import OrderStatusPage from "./components/OrderStatusPage";
import OrdersPage from "./components/OrdersPage";
import ProfilePage from "./components/ProfilePage";
import AdminPanel from "./components/AdminPanel";
import NotificationsPage from "./components/NotificationsPage";
import PaymentMethodsPage from "./components/PaymentMethodsPage";
import SearchPage from "./components/SearchPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsConditionsPage from "./components/TermsConditionsPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import EditAdminAccessPage from "./components/EditAdminAccessPage";
import AddNewAdminPage from "./components/AddNewAdminPage";
import AdminOrderManagementPage from "./components/AdminOrderManagementPage";
import AdminMenuManagementPage from "./components/AdminMenuManagementPage";
import AdminAnalyticsPage from "./components/AdminAnalyticsPage";
import AdminReportsPage from "./components/AdminReportsPage";
import AdminUserManagementPage from "./components/AdminUserManagementPage";
import AdminSystemSettingsPage from "./components/AdminSystemSettingsPage";

import AdminPaymentManagementPage from "./components/AdminPaymentManagementPage";
import AdminNotificationManagementPage from "./components/AdminNotificationManagementPage";
import AdminContentManagementPage from "./components/AdminContentManagementPage";
import AdminFeedbackManagementPage from "./components/AdminFeedbackManagementPage";
import AdminReviewManagementPage from "./components/AdminReviewManagementPage";
import AdminAccessPage from "./components/AdminAccessPage";
import AdminDatabasePage from "./components/AdminDatabasePage";
import CanteenOwnerDashboard from "./components/CanteenOwnerDashboard";
import ViewAllQuickPicksPage from "./components/ViewAllQuickPicksPage";
import HelpSupportPage from "./components/HelpSupportPage";
import AboutPage from "./components/AboutPage";
import FavoritesPage from "./components/FavoritesPage";
import FeedbackPage from "./components/FeedbackPage";
import AdminHomeContentEditor from "./components/AdminHomeContentEditor";
import SendEmailPage from "./components/user-management/SendEmailPage";
import AddLoyaltyPointsPage from "./components/user-management/AddLoyaltyPointsPage";
import ApplyDiscountPage from "./components/user-management/ApplyDiscountPage";
import SendWarningPage from "./components/user-management/SendWarningPage";
import ExportUserDataPage from "./components/user-management/ExportUserDataPage";
import ImportUsersPage from "./components/user-management/ImportUsersPage";
import ReorderPage from "./components/ReorderPage";
import RateReviewPage from "./components/RateReviewPage";
import OrderDetailPage from "./components/OrderDetailPage";
import CanteenOrderDetailPage from "./components/CanteenOrderDetailPage";
import BarcodeScannerPage from "./components/BarcodeScannerPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/menu/:category" element={<MenuListingPage />} />
          <Route path="/dish/:dishId" element={<DishDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/retry-payment" element={<RetryPaymentPage />} />
          <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-detail/:orderId" element={<OrderDetailPage />} />
          <Route path="/canteen-order-detail/:orderId" element={<CanteenOrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/canteen-owner" element={<CanteenOwnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/edit-admin-access/:userId" element={<AdminLayout><EditAdminAccessPage /></AdminLayout>} />
          <Route path="/add-new-admin" element={<AdminLayout><AddNewAdminPage /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalyticsPage /></AdminLayout>} />
          <Route path="/admin/order-management" element={<AdminLayout><AdminOrderManagementPage /></AdminLayout>} />
          <Route path="/admin/menu-management" element={<AdminLayout><AdminMenuManagementPage /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
          <Route path="/admin/user-management" element={<AdminLayout><AdminUserManagementPage /></AdminLayout>} />
          <Route path="/admin/system-settings" element={<AdminLayout><AdminSystemSettingsPage /></AdminLayout>} />
          
          <Route path="/admin/payment-management" element={<AdminLayout><AdminPaymentManagementPage /></AdminLayout>} />
          <Route path="/admin/notification-management" element={<AdminLayout><AdminNotificationManagementPage /></AdminLayout>} />
          <Route path="/admin/content-management" element={<AdminLayout><AdminContentManagementPage /></AdminLayout>} />
          <Route path="/admin/feedback-management" element={<AdminLayout><AdminFeedbackManagementPage /></AdminLayout>} />
          <Route path="/admin/review-management" element={<AdminLayout><AdminReviewManagementPage /></AdminLayout>} />
          <Route path="/admin/admin-access" element={<AdminLayout><AdminAccessPage /></AdminLayout>} />
          <Route path="/admin/database" element={<AdminLayout><AdminDatabasePage /></AdminLayout>} />
          <Route path="/quick-picks" element={<ViewAllQuickPicksPage />} />
          <Route path="/help-support" element={<HelpSupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/admin/home-content" element={<AdminLayout><AdminHomeContentEditor /></AdminLayout>} />
          <Route path="/admin/user-management/send-email" element={<AdminLayout><SendEmailPage /></AdminLayout>} />
          <Route path="/admin/user-management/add-loyalty-points" element={<AdminLayout><AddLoyaltyPointsPage /></AdminLayout>} />
          <Route path="/admin/user-management/apply-discount" element={<AdminLayout><ApplyDiscountPage /></AdminLayout>} />
          <Route path="/admin/user-management/send-warning" element={<AdminLayout><SendWarningPage /></AdminLayout>} />
          <Route path="/admin/user-management/export-data" element={<AdminLayout><ExportUserDataPage /></AdminLayout>} />
          <Route path="/admin/user-management/import-users" element={<AdminLayout><ImportUsersPage /></AdminLayout>} />
          <Route path="/reorder" element={<ReorderPage />} />
          <Route path="/rate-review" element={<RateReviewPage />} />
          <Route path="/barcode-scanner" element={<BarcodeScannerPage />} />
          <Route path="/index" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
