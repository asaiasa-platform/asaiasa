import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { HomeScreen } from "@/pages/home-screen";
import { NotFound } from "@/pages/not-found";
import HomePage from "@/pages/home/home-page";
import LoginPage from "@/pages/login/login-page";
import EventsPage from "@/pages/events/events-page";
import EventDetailPage from "@/pages/events/event-detail-page";
import OrganizationsPage from "@/pages/organizations/organizations-page";
import OrganizationDetailPage from "@/pages/organizations/organization-detail-page";
import AboutPage from "@/pages/about/about-page";
import RegisterPage from "@/pages/register/register-page";
import GoogleCallbackPage from "@/pages/auth/google-callback";
import { AuthProvider } from "@/contexts/auth-context";
import { GoogleAuthProvider } from "@/providers/google-oauth-provider";
import { RouteProvider } from "@/providers/router-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { IntlProviderWrapper } from "@/providers/intl-provider";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
      <StrictMode>
          <IntlProviderWrapper>
             <GoogleAuthProvider>
                 <AuthProvider>
                     <ThemeProvider>
                         <BrowserRouter>
                             <RouteProvider>
                        <Toaster 
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                            }}
                        />
                        <Routes>
                            <Route path="/" element={<HomeScreen />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
             <Route path="/organizations/:orgId" element={<OrganizationDetailPage />} />
             <Route path="/about" element={<AboutPage />} />
             <Route path="/register" element={<RegisterPage />} />
             <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </RouteProvider>
                </BrowserRouter>
            </ThemeProvider>
                 </AuthProvider>
             </GoogleAuthProvider>
          </IntlProviderWrapper>
    </StrictMode>,
);
