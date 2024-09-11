import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import isMobile from 'src/utils/isMobile';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import AuthWrapper from 'src/utils/AuthWrapper';
// import { element } from 'prop-types';
import AuthGuard from './AuthGuard';
import ChangePassword from 'src/views/apps/ChangePassword';
import AuthReset from 'src/views/authentication/authForms/AuthReset';
import NewCheckoutPage from 'src/components/NewCheckoutPage';
import PaymentSuccessPage from 'src/components/PaymentSuccessPage';
import PaymentErrorPage from 'src/components/PaymentErrorPage';
import PaymentHistory from 'src/views/PaymentHistory';
import CreateTemplate from 'src/views/template/CreateTemplate';
import Templates from 'src/views/template/templates';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const EcommerceDash = Loadable(lazy(() => import('../views/dashboard/Ecommerce')));

/* ****Apps***** */
const Broadcasts = Loadable(lazy(() => import('../views/apps/chat/Chat')));
const BroadcastsDetail = Loadable(lazy(() => import('../views/media/BroadcastsDetail')));
const TemplateInsights = Loadable(lazy(() => import('../views/template/TemplateInsights')));
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Calendar = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));
const Email = Loadable(lazy(() => import('../views/apps/email/Email')));
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogPost')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const Contacts = Loadable(lazy(() => import('../views/apps/contacts/Contacts')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/eCommerce/Ecommerce')));
const EcommerceDetail = Loadable(lazy(() => import('../views/apps/eCommerce/EcommerceDetail')));
const EcomProductList = Loadable(lazy(() => import('../views/apps/eCommerce/EcomProductList')));
const EcomProductCheckout = Loadable(
  lazy(() => import('../views/apps/eCommerce/EcommerceCheckout')),
);
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));
const Followers = Loadable(lazy(() => import('../views/apps/user-profile/Followers')));
const Friends = Loadable(lazy(() => import('../views/apps/user-profile/Friends')));
const Gallery = Loadable(lazy(() => import('../views/apps/user-profile/Gallery')));
const BusinessProfile = Loadable(
  lazy(() => import('../views/apps/business-profile/BusinessProfile')),
);
const PrivacyPolicy = Loadable(lazy(() => import('../views/apps/privacy-policy/PrivacyPolicy')));
const TermsCondition = Loadable(lazy(() => import('../views/apps/terms-condition/TermsCondition')));
// Pages
const RollbaseCASL = Loadable(lazy(() => import('../views/pages/rollbaseCASL/RollbaseCASL')));
const Treeview = Loadable(lazy(() => import('../views/pages/treeview/Treeview')));
const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);
const Faq = Loadable(lazy(() => import('../views/pages/faq/Faq')));

// widget
const WidgetCards = Loadable(lazy(() => import('../views/widgets/cards/WidgetCards')));
const WidgetBanners = Loadable(lazy(() => import('../views/widgets/banners/WidgetBanners')));
const WidgetCharts = Loadable(lazy(() => import('../views/widgets/charts/WidgetCharts')));

// form elements
const MuiAutoComplete = Loadable(
  lazy(() => import('../views/forms/form-elements/MuiAutoComplete')),
);
const MuiButton = Loadable(lazy(() => import('../views/forms/form-elements/MuiButton')));
const MuiCheckbox = Loadable(lazy(() => import('../views/forms/form-elements/MuiCheckbox')));
const MuiRadio = Loadable(lazy(() => import('../views/forms/form-elements/MuiRadio')));
const MuiSlider = Loadable(lazy(() => import('../views/forms/form-elements/MuiSlider')));
const MuiDateTime = Loadable(lazy(() => import('../views/forms/form-elements/MuiDateTime')));
const MuiSwitch = Loadable(lazy(() => import('../views/forms/form-elements/MuiSwitch')));

// form layout
const FormLayouts = Loadable(lazy(() => import('../views/forms/FormLayouts')));
const FormCustom = Loadable(lazy(() => import('../views/forms/FormCustom')));
const FormWizard = Loadable(lazy(() => import('../views/forms/FormWizard')));
const FormValidation = Loadable(lazy(() => import('../views/forms/FormValidation')));
const QuillEditor = Loadable(lazy(() => import('../views/forms/quill-editor/QuillEditor')));
const FormHorizontal = Loadable(lazy(() => import('../views/forms/FormHorizontal')));
const FormVertical = Loadable(lazy(() => import('../views/forms/FormVertical')));

// tables
const BasicTable = Loadable(lazy(() => import('../views/tables/BasicTable')));
const CollapsibleTable = Loadable(lazy(() => import('../views/tables/CollapsibleTable')));
const EnhancedTable = Loadable(lazy(() => import('../views/tables/EnhancedTable')));
const FixedHeaderTable = Loadable(lazy(() => import('../views/tables/FixedHeaderTable')));
const PaginationTable = Loadable(lazy(() => import('../views/tables/PaginationTable')));
const SearchTable = Loadable(lazy(() => import('../views/tables/SearchTable')));

// chart
const LineChart = Loadable(lazy(() => import('../views/charts/LineChart')));
const GredientChart = Loadable(lazy(() => import('../views/charts/GredientChart')));
const DoughnutChart = Loadable(lazy(() => import('../views/charts/DoughnutChart')));
const AreaChart = Loadable(lazy(() => import('../views/charts/AreaChart')));
const ColumnChart = Loadable(lazy(() => import('../views/charts/ColumnChart')));
const CandlestickChart = Loadable(lazy(() => import('../views/charts/CandlestickChart')));
const RadialbarChart = Loadable(lazy(() => import('../views/charts/RadialbarChart')));

// ui
const MuiAlert = Loadable(lazy(() => import('../views/ui-components/MuiAlert')));
const MuiAccordion = Loadable(lazy(() => import('../views/ui-components/MuiAccordion')));
const MuiAvatar = Loadable(lazy(() => import('../views/ui-components/MuiAvatar')));
const MuiChip = Loadable(lazy(() => import('../views/ui-components/MuiChip')));
const MuiDialog = Loadable(lazy(() => import('../views/ui-components/MuiDialog')));
const MuiList = Loadable(lazy(() => import('../views/ui-components/MuiList')));
const MuiPopover = Loadable(lazy(() => import('../views/ui-components/MuiPopover')));
const MuiRating = Loadable(lazy(() => import('../views/ui-components/MuiRating')));
const MuiTabs = Loadable(lazy(() => import('../views/ui-components/MuiTabs')));
const MuiTooltip = Loadable(lazy(() => import('../views/ui-components/MuiTooltip')));
const MuiTransferList = Loadable(lazy(() => import('../views/ui-components/MuiTransferList')));
const MuiTypography = Loadable(lazy(() => import('../views/ui-components/MuiTypography')));

// authentication
// const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
// const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
// const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
// const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
// const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps2')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintenance = Loadable(lazy(() => import('../views/authentication/Maintenance')));

// landingpage
// const Landingpage = Loadable(lazy(() => import('../views/pages/landingpage/Landingpage')));

//Admin Page
// const HomePage = Loadable(lazy(() => import('../views/dashboard/Home')));
const Customers = Loadable(lazy(() => import('../views/customers/Customers')));
// const Templates = Loadable(lazy(() => import('../views/template/templates')));
// const CreateTemplate = Loadable(lazy(() => import('src/views/template/CreateTemplate')));
const Media = Loadable(lazy(() => import('../views/media/Media')));

const Router = [
  // const isMobile = useIsMobile();

  {
    path: '/',
    element: (
      <AuthWrapper>
        <FullLayout />
      </AuthWrapper>
    ),

    children: [
      { path: '/', element: <Navigate to="/home" /> },
      { path: '/home', element: <EcommerceDash /> },
      { path: '/broadcasts', element: <Broadcasts /> },
      { path: '/templates', element: <Templates /> },
      { path: '/media', element: <Media /> },
      { path: '/payment-history', element: <PaymentHistory /> },
      // { path: '/privacy-policy', element: <PrivacyPolicy /> },
      // { path: '/terms-conditions', element: <TermsCondition /> },

      { path: '/templates/createtemplate', element: <CreateTemplate /> },
      { path: '/scheduled-broadcasts', element: <Templates /> },
      { path: '/contacts', element: <Customers /> },
      { path: '/business-profile', element: <BusinessProfile /> },
      { path: '/analytics', element: <Templates /> },
      { path: '/integrations', element: <Templates /> },
      { path: '/team', element: <Templates /> },
      { path: '/pending-requests', element: <Templates /> },
      { path: '/settings', element: <Maintenance /> },
      { path: '/broadcast/:id', element: <BroadcastsDetail /> },
      { path: '/templates/:id', element: <TemplateInsights /> },
      { path: '/payment', element: <NewCheckoutPage /> },
      { path: '/dashboards/modern', exact: true, element: <ModernDash /> },
      { path: '/dashboards/ecommerce', exact: true, element: <EcommerceDash /> },
      { path: '/apps/chats', element: <Broadcasts /> },
      { path: '/apps/notes', element: <Notes /> },
      { path: '/apps/calendar', element: <Calendar /> },
      { path: '/apps/email', element: <Email /> },
      { path: '/apps/tickets', element: <Tickets /> },
      { path: '/apps/contacts', element: <Contacts /> },
      { path: '/apps/ecommerce/shop', element: <Ecommerce /> },
      { path: '/apps/blog/posts', element: <Blog /> },
      { path: '/apps/blog/detail/:id', element: <BlogDetail /> },
      { path: '/apps/ecommerce/eco-product-list', element: <EcomProductList /> },
      { path: '/apps/ecommerce/eco-checkout', element: <EcomProductCheckout /> },
      { path: '/apps/ecommerce/detail/:id', element: <EcommerceDetail /> },
      { path: '/apps/followers', element: <Followers /> },
      { path: '/apps/friends', element: <Friends /> },
      { path: '/apps/gallery', element: <Gallery /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/change-password', element: <ChangePassword /> },
      { path: '/pages/casl', element: <RollbaseCASL /> },
      { path: '/pages/treeview', element: <Treeview /> },
      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
      { path: '/pages/faq', element: <Faq /> },
      { path: '/forms/form-elements/autocomplete', element: <MuiAutoComplete /> },
      { path: '/forms/form-elements/button', element: <MuiButton /> },
      { path: '/forms/form-elements/checkbox', element: <MuiCheckbox /> },
      { path: '/forms/form-elements/radio', element: <MuiRadio /> },
      { path: '/forms/form-elements/slider', element: <MuiSlider /> },
      { path: '/forms/form-elements/date-time', element: <MuiDateTime /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/form-elements/switch', element: <MuiSwitch /> },
      { path: '/forms/quill-editor', element: <QuillEditor /> },
      { path: '/forms/form-layouts', element: <FormLayouts /> },
      { path: '/forms/form-horizontal', element: <FormHorizontal /> },
      { path: '/forms/form-vertical', element: <FormVertical /> },
      { path: '/forms/form-custom', element: <FormCustom /> },
      { path: '/forms/form-wizard', element: <FormWizard /> },
      { path: '/forms/form-validation', element: <FormValidation /> },
      { path: '/tables/basic', element: <BasicTable /> },
      { path: '/tables/collapsible', element: <CollapsibleTable /> },
      { path: '/tables/enhanced', element: <EnhancedTable /> },
      { path: '/tables/fixed-header', element: <FixedHeaderTable /> },
      { path: '/tables/pagination', element: <PaginationTable /> },
      { path: '/tables/search', element: <SearchTable /> },
      { path: '/charts/line-chart', element: <LineChart /> },
      { path: '/charts/gredient-chart', element: <GredientChart /> },
      { path: '/charts/doughnut-pie-chart', element: <DoughnutChart /> },
      { path: '/charts/area-chart', element: <AreaChart /> },
      { path: '/charts/column-chart', element: <ColumnChart /> },
      { path: '/charts/candlestick-chart', element: <CandlestickChart /> },
      { path: '/charts/radialbar-chart', element: <RadialbarChart /> },
      { path: '/ui-components/alert', element: <MuiAlert /> },
      { path: '/ui-components/accordion', element: <MuiAccordion /> },
      { path: '/ui-components/avatar', element: <MuiAvatar /> },
      { path: '/ui-components/chip', element: <MuiChip /> },
      { path: '/ui-components/dialog', element: <MuiDialog /> },
      { path: '/ui-components/list', element: <MuiList /> },
      { path: '/ui-components/popover', element: <MuiPopover /> },
      { path: '/ui-components/rating', element: <MuiRating /> },
      { path: '/ui-components/tabs', element: <MuiTabs /> },
      { path: '/ui-components/tooltip', element: <MuiTooltip /> },
      { path: '/ui-components/transfer-list', element: <MuiTransferList /> },
      { path: '/ui-components/typography', element: <MuiTypography /> },
      { path: '/widgets/cards', element: <WidgetCards /> },
      { path: '/widgets/banners', element: <WidgetBanners /> },
      { path: '/widgets/charts', element: <WidgetCharts /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: isMobile() ? <BlankLayout /> : <FullLayout />, // Conditional layout for mobile
    children: [
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms-conditions', element: <TermsCondition /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <AuthGuard /> },
      { path: '/payment-success', element: <PaymentSuccessPage /> },
      { path: '/payment-error', element: <PaymentErrorPage /> },
      // { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/reset-password/:token', element: <AuthReset /> },
      { path: '/auth/register', element: <Register2 /> },
      // { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword2 /> },
      // { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      // { path: '/auth/two-steps2', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintenance /> },
      // { path: '/landingpage', element: <Landingpage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      // { path: '/privacy-policy', element: <PrivacyPolicy /> },
    ],
  },
];

export default Router;
