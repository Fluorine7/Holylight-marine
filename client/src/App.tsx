import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ProductShop from "./pages/ProductShop";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsPage from "./pages/admin/Products";
import ProductFormPage from "./pages/admin/ProductForm";
import CategoriesPage from "./pages/admin/Categories";
import BrandsPage from "./pages/admin/Brands";
import NewsManagementPage from "./pages/admin/NewsManagement";
import NewsFormPage from "./pages/admin/NewsForm";
import Login from "./pages/Login";
import Support from "./pages/Support";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/shop"} component={ProductShop} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/support"} component={Support} />
      <Route path={"/news"} component={News} />
      <Route path={"/news/:slug"} component={NewsDetail} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/login"} component={Login} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/admin/products"} component={ProductsPage} />
      <Route path={"/admin/products/new"} component={ProductFormPage} />
      <Route path={"/admin/products/edit/:id"} component={ProductFormPage} />
      <Route path={"/admin/categories"} component={CategoriesPage} />
      <Route path={"/admin/brands"} component={BrandsPage} />
      <Route path={"/admin/news"} component={NewsManagementPage} />
      <Route path={"/admin/news/new"} component={NewsFormPage} />
      <Route path={"/admin/news/edit/:id"} component={NewsFormPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

