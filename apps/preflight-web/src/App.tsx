/**
 * App — BrowserRouter, shell layout, route table.
 * Why: screen 6 owns top bar, outlet, toasts, and 404.
 */

import type { ReactElement } from "react";

import {
  BrowserRouter, Navigate, Outlet, Route, Routes, useLocation,
} from "react-router-dom";

import { DesignProof } from "@/design-proof/DesignProof";
import { AssetDetailStates } from "@/design-proof/AssetDetailStates";
import { AssetsListStates } from "@/design-proof/AssetsListStates";
import { AssetDetail, AssetDetailRoute } from "@/features/assets/AssetDetail";
import { AssetsList, AssetsListRoute } from "@/features/assets/AssetsList";
import {
  RERUN_STRIP_ENGINE_MISMATCH,
} from "@/fixtures/assets-detail";
import { ASSET_A } from "@/fixtures/assets-detail/a";
import { CampaignRoute } from "@/features/campaign/CampaignRoute";
import {
  CampaignBuiltDemo,
  CampaignErrorDemo,
  CampaignHandoffDemo,
  CampaignLoadingDemo,
  CampaignStates,
  CampaignZeroRulesDemo,
} from "@/design-proof/CampaignStates";
import {
  RulebookErrorDemo,
  RulebookLoadingDemo,
  RulebookStates,
} from "@/design-proof/RulebookStates";
import { RulebookRoute } from "@/features/rulebook/Rulebook";
import {
  WorkbenchErrorFallbackDemo,
  WorkbenchHandoffSuggestedDemo,
  WorkbenchPrefetchErrorDemo,
  WorkbenchStates,
} from "@/design-proof/WorkbenchStates";
import { WorkbenchRoute } from "@/features/workbench/Workbench";
import { LoginRoute } from "@/features/login/Login";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/shell/AppSidebar";
import { ErrorBoundary } from "@/features/shell/ErrorBoundary";
import { NotFound } from "@/features/shell/NotFound";
import { PersonaHomeRedirect } from "@/features/shell/PersonaHomeRedirect";
import { PersonaProvider, usePersona } from "@/features/shell/PersonaProvider";
import { ToastHost } from "@/features/shell/ToastHost";

function RequireAuth(): ReactElement {
  const location = useLocation();
  const { actor, hydrated } = usePersona();

  if (!hydrated) {
    return <div className="flex min-h-screen flex-col bg-background" aria-hidden />;
  }
  if (actor === null) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

function ShellFrame(): ReactElement {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen overflow-hidden bg-ground">
        <AppSidebar />
        <SidebarInset className="flex h-screen min-w-0 flex-1 flex-col overflow-auto bg-ground shadow-none">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function App(): ReactElement {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <ToastHost>
          <Routes>
            <Route path="login" element={<LoginRoute />} />
            <Route element={<RequireAuth />}>
              <Route
                path="assets/:id"
                element={
                  <ErrorBoundary>
                    <AssetDetailRoute />
                  </ErrorBoundary>
                }
              />
              <Route element={<ShellFrame />}>
                <Route index element={<PersonaHomeRedirect />} />
                <Route path="assets" element={<AssetsListRoute />} />
                <Route path="campaign/:campaignId" element={<CampaignRoute />} />
                <Route path="rulebook" element={<RulebookRoute />} />
                <Route path="workbench" element={<WorkbenchRoute />} />
              <Route path="design-proof" element={<DesignProof />} />
              <Route path="design-proof/assets-list" element={<AssetsListStates />} />
              <Route
                path="design-proof/assets-list/empty"
                element={<AssetsList assets={[]} />}
              />
              <Route
                path="design-proof/assets-list/loading"
                element={<AssetsList assets={[]} view="loading" />}
              />
              <Route
                path="design-proof/assets-list/error"
                element={<AssetsList assets={[]} view="error" />}
              />
              <Route path="design-proof/assets-detail" element={<AssetDetailStates />} />
              <Route
                path="design-proof/assets-detail/loading"
                element={<AssetDetail asset={ASSET_A} view="loading" />}
              />
              <Route
                path="design-proof/assets-detail/error"
                element={<AssetDetail asset={ASSET_A} view="error" />}
              />
              <Route
                path="design-proof/assets-detail/not-found"
                element={<AssetDetailRoute />}
              />
              <Route
                path="design-proof/assets-detail/engine-mismatch"
                element={
                  <AssetDetail
                    asset={ASSET_A}
                    rerunStrip={RERUN_STRIP_ENGINE_MISMATCH}
                  />
                }
              />
              <Route path="design-proof/campaign" element={<CampaignStates />} />
              <Route
                path="design-proof/campaign/loading"
                element={<CampaignLoadingDemo />}
              />
              <Route
                path="design-proof/campaign/error"
                element={<CampaignErrorDemo />}
              />
              <Route
                path="design-proof/campaign/not-found"
                element={<CampaignRoute />}
              />
              <Route
                path="design-proof/campaign/built"
                element={<CampaignBuiltDemo />}
              />
              <Route
                path="design-proof/campaign/zero-rules"
                element={<CampaignZeroRulesDemo />}
              />
              <Route path="design-proof/rulebook" element={<RulebookStates />} />
              <Route
                path="design-proof/rulebook/loading"
                element={<RulebookLoadingDemo />}
              />
              <Route
                path="design-proof/rulebook/error"
                element={<RulebookErrorDemo />}
              />
              <Route path="design-proof/workbench" element={<WorkbenchStates />} />
              <Route
                path="design-proof/workbench/prefetch-error"
                element={<WorkbenchPrefetchErrorDemo />}
              />
              <Route
                path="design-proof/workbench/error-fallback"
                element={<WorkbenchErrorFallbackDemo />}
              />
              <Route
                path="design-proof/campaign/handoff"
                element={<CampaignHandoffDemo />}
              />
              <Route
                path="design-proof/workbench/handoff-suggested"
                element={<WorkbenchHandoffSuggestedDemo />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
        </ToastHost>
      </PersonaProvider>
    </BrowserRouter>
  );
}
