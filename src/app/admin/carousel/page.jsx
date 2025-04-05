"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { CarouselManager } from "@/features/carousel/components/CarouselManager"

export default function CarouselPage() {
  return (
    <Tabs defaultValue="list" className="space-y-4">
      <DashboardHeader
        heading="Carousel Management"
        text="Config main carousel settings"
      >
        <TabsList>
          <TabsTrigger value="list">Slide List</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </DashboardHeader>
      <div className="p-6">
        <CarouselManager />
      </div>
    </Tabs>
  )
}
