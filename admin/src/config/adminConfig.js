/**
 * Client-side branding only. Staff accounts must exist in the database
 * (use npm run seed:root-users in backend). Never embed credentials here.
 */
const viteEnv = import.meta.env;

export const appBrand = {
  shortName: viteEnv.VITE_APP_SHORT_NAME || "SHMS",
  adminPanelTitle:
    viteEnv.VITE_ADMIN_PANEL_TITLE || "Smart Hostel Management System",
};

export default appBrand;
