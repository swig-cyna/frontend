export const getRoleBadgeVariant = (role) => {
  switch (role) {
    case "superadmin":
      return "default"

    case "admin":
      return "secondary"

    case "support":
      return "secondary"

    case "user":
      return "outline"

    default:
      return "secondary"
  }
}

export const translateUserRole = (role) => {
  const roleTranslations = {
    superadmin: "Super Admin",
    admin: "Admin",
    user: "Customer",
    support: "Support",
  }

  return roleTranslations[role] || role
}
