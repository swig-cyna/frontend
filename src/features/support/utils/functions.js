const STATUS_VARIANTS = {
  open: "bg-green-500/50 hover:bg-green-800/50 dark:text-green-100 text-green-800",
  in_progress:
    "bg-yellow-500/50 hover:bg-yellow-800/50 dark:text-yellow-100 text-yellow-800",
  closed: "bg-red-500/50 hover:bg-red-800/50 dark:text-red-100 text-red-800",
  default:
    "bg-gray-500/50 hover:bg-gray-800/50 dark:text-gray-100 text-gray-800",
}

const SUBJECT_VARIANTS = {
  payment:
    "bg-green-500/50 hover:bg-green-800/50 text-green-100 dark:text-green-100",
  question:
    "bg-blue-500/50 hover:bg-blue-800/50 text-blue-100 dark:text-blue-100",
  bug: "bg-red-500/50 hover:bg-red-800/50 text-red-100 dark:text-red-100",
  delivery:
    "bg-yellow-500/50 hover:bg-yellow-800/50 text-yellow-100 dark:text-yellow-100",
  default:
    "bg-gray-500/50 hover:bg-gray-800/50 text-gray-100 dark:text-gray-100",
}

export const getStatusVariant = (status) =>
  STATUS_VARIANTS[status] || STATUS_VARIANTS.default
export const getSubjectVariant = (subject) =>
  SUBJECT_VARIANTS[subject] || SUBJECT_VARIANTS.default
