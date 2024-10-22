export interface NavLinkItem {
  text: string;
  href?: string;
  isParent?: boolean;
  children?: NavLinkItem[];
}
