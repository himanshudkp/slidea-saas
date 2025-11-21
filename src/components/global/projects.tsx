"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants } from "@/lib/constants";
import ProjectCard from "./project-card";
import type { Project } from "@/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

type ViewMode = "grid" | "compact";
type SortOption = "recent" | "oldest" | "name-asc" | "name-desc" | "slides";
// type FilterStatus = "all" | "active" | "deleted" | "purchased" | "sellable";

type Props = {
  projects: Project[];
  defaultView?: ViewMode;
  showFilters?: boolean;
  showViewToggle?: boolean;
};

const Projects = ({
  projects,
  defaultView = "grid",
  showFilters = true,
  showViewToggle = true,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);

  const [filters, setFilters] = useState({
    showDeleted: false,
    showPurchased: false,
    showSellable: false,
    showActive: true,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({
      showDeleted: false,
      showPurchased: false,
      showSellable: false,
      showActive: true,
    });
    setSearchQuery("");
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.showDeleted) count++;
    if (filters.showPurchased) count++;
    if (filters.showSellable) count++;
    if (!filters.showActive) count++;
    if (searchQuery) count++;
    return count;
  }, [filters, searchQuery]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      // Status filters
      const isActive = !project.isDeleted;
      const isDeleted = project.isDeleted;
      // const isPurchased = project.isPurchased || false;
      const isSellable = project.isSellable || false;

      // Apply status filters
      if (isDeleted && !filters.showDeleted) return false;
      if (isActive && !filters.showActive && !isDeleted) return false;
      // if (isPurchased && !filters.showPurchased) return false;
      if (isSellable && !filters.showSellable) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.theme?.toLowerCase().includes(query)
        );
      }
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "slides":
          const aSlides = Array.isArray(a.slides) ? a.slides.length : 0;
          const bSlides = Array.isArray(b.slides) ? b.slides.length : 0;
          return bSlides - aSlides;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchQuery, sortBy, filters]);

  const projectCounts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => !p.isDeleted).length,
      deleted: projects.filter((p) => p.isDeleted).length,
      // purchased: projects.filter((p) => p.isPurchased).length,
      sellable: projects.filter((p) => p.isSellable).length,
    };
  }, [projects]);

  const gridClasses = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    compact:
      "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3",
    list: "flex flex-col gap-3",
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  } as const;

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 px-1.5 py-0 h-5 text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.showActive}
                    onCheckedChange={() => toggleFilter("showActive")}
                  >
                    Active Projects
                    <span className="ml-auto text-xs text-muted-foreground">
                      {projectCounts.active}
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showDeleted}
                    onCheckedChange={() => toggleFilter("showDeleted")}
                  >
                    Deleted Projects
                    <span className="ml-auto text-xs text-muted-foreground">
                      {projectCounts.deleted}
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs">
                    Marketplace
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.showPurchased}
                    onCheckedChange={() => toggleFilter("showPurchased")}
                  >
                    Purchased
                    <span className="ml-auto text-xs text-muted-foreground">
                      {/* {projectCounts.purchased} */}
                    </span>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.showSellable}
                    onCheckedChange={() => toggleFilter("showSellable")}
                  >
                    Sellable
                    <span className="ml-auto text-xs text-muted-foreground">
                      {projectCounts.sellable}
                    </span>
                  </DropdownMenuCheckboxItem>
                  {activeFiltersCount > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full justify-start h-8 px-2"
                      >
                        <X className="h-3 w-3 mr-2" />
                        Clear Filters
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Most Recent
                    </span>
                  </SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="slides">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Most Slides
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {showViewToggle && (
                <div className="flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                    title="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "compact" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("compact")}
                    className="h-8 w-8 p-0"
                    title="Compact view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchQuery("")}
                  />
                </Badge>
              )}
              {filters.showDeleted && (
                <Badge variant="secondary" className="gap-1">
                  Deleted
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showDeleted")}
                  />
                </Badge>
              )}
              {filters.showPurchased && (
                <Badge variant="secondary" className="gap-1">
                  Purchased
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showPurchased")}
                  />
                </Badge>
              )}
              {filters.showSellable && (
                <Badge variant="secondary" className="gap-1">
                  Sellable
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showSellable")}
                  />
                </Badge>
              )}
              {!filters.showActive && (
                <Badge variant="secondary" className="gap-1">
                  Hide Active
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter("showActive")}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs px-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
          {searchQuery && ` found`}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredProjects.length > 0 ? (
          <motion.div
            className={cn(gridClasses[viewMode])}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, index) => {
              const {
                createdAt,
                id,
                isDeleted,
                slides,
                theme,
                thumbnail,
                title,
              } = project;
              const created = formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
              });

              return (
                <motion.div
                  key={id}
                  variants={itemVariants}
                  layout
                  layoutId={id}
                  custom={index}
                  exit="exit"
                >
                  <ProjectCard
                    projectId={id}
                    title={title}
                    createdAt={created}
                    isDeleted={isDeleted}
                    slidesData={slides}
                    themeName={theme}
                    // viewMode={viewMode}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || activeFiltersCount > 0
                ? `Try adjusting your filters or search terms`
                : `Create your first project to get started`}
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
