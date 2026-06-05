export const adminRoles = {
  superAdmin: "super_admin",
  sekretaris: "sekretaris",
  bendahara: "bendahara",
};

export const roleLabels = {
  [adminRoles.superAdmin]: "Super Admin",
  [adminRoles.sekretaris]: "Sekretaris",
  [adminRoles.bendahara]: "Bendahara",
};

export const accessGroups = {
  all: [adminRoles.superAdmin],
  content: [adminRoles.superAdmin],
  finance: [adminRoles.superAdmin, adminRoles.bendahara],
  jemaat: [adminRoles.superAdmin, adminRoles.sekretaris],
  dashboard: [adminRoles.superAdmin, adminRoles.sekretaris, adminRoles.bendahara],
};

export function canManagePublicContent(role) {
  return accessGroups.content.includes(role);
}

export function canManageJemaat(role) {
  return accessGroups.jemaat.includes(role);
}

export function canAccessFinance(role) {
  return accessGroups.finance.includes(role);
}

export function canAccessAdminRoute(role, allowedRoles) {
  return allowedRoles.includes(role);
}

export function getRoleLabel(role) {
  return roleLabels[role] || "Admin";
}
