import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { DashboardPage } from "./components/DashboardPage";
import { ArchintHomePage } from "./components/archint/ArchintHomePage";
import { ArchintSelectionPage } from "./components/archint/ArchintSelectionPage";
import { ArchintResultsPage } from "./components/archint/ArchintResultsPage";
import { ArchintLoginPage } from "./components/archint/ArchintLoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/archint",
    Component: ArchintHomePage,
  },
  {
    path: "/archint/login",
    Component: ArchintLoginPage,
  },
  {
    path: "/archint/select/:type",
    Component: ArchintSelectionPage,
  },
  {
    path: "/archint/results",
    Component: ArchintResultsPage,
  },
]);
