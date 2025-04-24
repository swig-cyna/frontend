import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { useAddresses } from "@/features/userspace/hooks/useAddress"
import { Home, PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"

const SavedAddresses = ({ userId, selectedAddress, onSelect, onAddNew }) => {
  const t = useTranslations("SavedAddresses")
  const { data: addresses, isLoading, error } = useAddresses(userId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    )
  }

  if (error) {
    return <div>{t("error_loading")}</div>
  }

  return (
    <div>
      <RadioGroup
        value={selectedAddress?.id}
        onValueChange={onSelect}
        className="space-y-2"
      >
        {addresses?.map((address) => (
          <div
            key={address.id}
            className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          >
            <RadioGroupItem value={address.id} id={address.id} />
            <Label
              htmlFor={address.id}
              className="flex flex-1 cursor-pointer items-center"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <Home className="h-4 w-4 text-primary" />
                  {address.alias}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.line1}, {address.postal_code} {address.city}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={onAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("addNewCard")}
        </Button>
      </div>
    </div>
  )
}

export default SavedAddresses
