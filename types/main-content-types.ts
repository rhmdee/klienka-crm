export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ContentTopState {
  title: React.ReactNode | null;
  breadcrumbs: BreadcrumbItem[] | null;
  actions: React.ReactNode | null;
  extraContent: React.ReactNode | null;
  noPadding: boolean | null;
  padding: string | null;
  setContentTop: (data: {
    title?: React.ReactNode | null;
    breadcrumbs?: BreadcrumbItem[] | null;
    actions?: React.ReactNode | null;
    extraContent?: React.ReactNode | null;
    noPadding?: boolean | null;
    padding?: string | null;
  }) => void;
  resetContentTop: () => void;
}

export interface ContentTopSlotProps {
  title?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  noPadding?: boolean;
  padding?: string;
}

export interface ContentTopProps {
  className?: string;
  title?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export interface PageContentProps {
  children?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  padding?: string;
}
