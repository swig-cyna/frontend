import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const generateFormFieldInput = ({
  name,
  label,
  ...fieldInputProps
}) => ({
  name,
  render: ({ field }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input {...field} {...fieldInputProps} />
      </FormControl>
      <FormMessage />
    </FormItem>
  ),
})
