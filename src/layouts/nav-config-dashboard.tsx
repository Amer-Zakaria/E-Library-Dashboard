import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Overview',
    path: '/overview',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Contents',
    path: '/',
    icon: icon('ic-blog'),
  },
  {
    title: 'Categories',
    path: '/categories',
    icon: icon('ic-category'),
  },
  {
    title: 'Uploaders',
    path: '/uploaders',
    icon: icon('ic-user'),
  },
];
