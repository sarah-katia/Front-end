"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function PublicationForm() {
  const [publicationType, setPublicationType] = useState(null)

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <form className="space-y-6">
          {/* Publication Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center">
              Titre de la publication <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="title"
              placeholder="titre de la pub"
              className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
            />
          </div>

          {/* Authors */}
          <div className="space-y-2">
            <Label htmlFor="authors" className="flex items-center">
              Auteurs <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select>
              <SelectTrigger
                id="authors"
                className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
              >
                <SelectValue placeholder="Etablissement d'origine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="institution1">ESI</SelectItem>
                <SelectItem value="institution2">Autres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Link and Date - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link" className="flex items-center">
                Lien <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="link"
                type="email"
                placeholder="exemple@email.com"
                className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center">
                Date <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="date"
                placeholder="Numéro de téléphone"
                className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
              />
            </div>
          </div>

          {/* Publication Type */}
          <div className="space-y-2">
            <Label className="flex items-center">
              Type <span className="text-red-500 ml-1">*</span>
            </Label>
            <RadioGroup
              className="grid grid-cols-2 gap-4"
              value={publicationType || ""}
              onValueChange={(value) => setPublicationType(value)}
            >
              <div className="flex items-center space-x-2 border border-[#1216B4] rounded-md p-3">
                <RadioGroupItem value="journal" id="journal" className="text-[#1216B4]" />
                <Label htmlFor="journal" className="cursor-pointer">
                  Journal
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-[#1216B4] rounded-md p-3">
                <RadioGroupItem value="conference" id="conference" className="text-[#1216B4]" />
                <Label htmlFor="conference" className="cursor-pointer">
                  Conférence
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conference Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conference-type">Conférence</Label>
              <Input
                id="conference-type"
                placeholder="ex: Doctorat, Ingénieur ..."
                disabled={publicationType === "journal"}
                className={`border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4] ${
                  publicationType === "journal" ? "bg-gray-100" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal-id">Journal</Label>
              <Input
                id="journal-id"
                placeholder="2000495"
                disabled={publicationType === "conference"}
                className={`border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4] ${
                  publicationType === "conference" ? "bg-gray-100" : ""
                }`}
              />
            </div>
          </div>

          {/* Classification and Editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classification">Classement</Label>
              <Input
                id="classification"
                placeholder="0000-1345-0138"
                disabled={publicationType === "journal"}
                className={`border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4] ${
                  publicationType === "journal" ? "bg-gray-100" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editor">Editeur</Label>
              <Input
                id="editor"
                placeholder="ex: 18, 20..."
                disabled={publicationType === "conference"}
                className={`border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4] ${
                  publicationType === "conference" ? "bg-gray-100" : ""
                }`}
              />
            </div>
          </div>

          {/* Volume and Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                placeholder="0000-1345-0138"
                disabled={publicationType === "journal"}
                className={`border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4] ${
                  publicationType === "journal" ? "bg-gray-100" : ""
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pages">Nb de pages</Label>
              <Input
                id="pages"
                placeholder="ex: 18, 20..."
                disabled={publicationType === "conference"}
                className={`border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4] ${
                  publicationType === "conference" ? "bg-gray-100" : ""
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button className="bg-[#1216B4] hover:bg-[#0e1290]">suivant</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
