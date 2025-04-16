const STATUS_VARIANTS = {
  open: "bg-green-800/50 hover:bg-green-800/50 text-green-700",
  in_progress: "bg-yellow-800/50 hover:bg-yellow-800/50 text-yellow-700",
  closed: "bg-red-800/50 hover:bg-red-800/50 text-red-700",
  default: "bg-gray-800/50 hover:bg-gray-800/50 text-gray-700",
}

const SUBJECT_VARIANTS = {
  payment: "bg-green-800/50 hover:bg-green-800/50 text-green-700",
  question: "bg-blue-800/50 hover:bg-blue-800/50 text-blue-700",
  bug: "bg-red-800/50 hover:bg-red-800/50 text-red-700",
  delivery: "bg-yellow-800/50 hover:bg-yellow-800/50 text-yellow-700",
  default: "bg-gray-800/50 hover:bg-gray-800/50 text-gray-700",
}

export const getStatusVariant = (status) =>
  STATUS_VARIANTS[status] || STATUS_VARIANTS.default
export const getSubjectVariant = (subject) =>
  SUBJECT_VARIANTS[subject] || SUBJECT_VARIANTS.default
