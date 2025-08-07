import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { StickyVideoWidget } from "@/components/ads/sticky-video-widget";

import Home from "@/pages/home";
import HomeNew from "@/pages/home-new";
import GalleryPage from "@/pages/gallery";
import ModelPage from "@/pages/model";
import ModelsPage from "@/pages/models";
import ArchivePage from "@/pages/archive";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeNew} />
      <Route path="/old" component={Home} />
      <Route path="/gallery/*" component={GalleryPage} />
      <Route path="/models" component={ModelsPage} />
      <Route path="/model/:slug" component={ModelPage} />
      <Route path="/archive" component={ArchivePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="shiny-dollop-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
          <StickyVideoWidget />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
