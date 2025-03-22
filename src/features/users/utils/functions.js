export const getRoleBadgeVariant = (role) => {
  switch (role) {
    case "superadmin":
      return "default"

    case "admin":
      return "secondary"

    case "customer":
      return "outline"

    default:
      return "secondary"
  }
}

export const translateUserRole = (role) => {
  const roleTranslations = {
    superadmin: "Super Admin",
    admin: "Admin",
    customer: "Customer",
  }

  return roleTranslations[role] || role
}
