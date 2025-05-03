"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

export default function ConferenceJournalForm() {
  const [classements, setClassements] = useState([{ site: '', classement: '', lien: '' }])

  const ajouterClassement = () => {
    setClassements([...classements, { site: '', classement: '', lien: '' }])
  }

  const supprimerClassement = (index) => {
    const nouveauxClassements = [...classements]
    nouveauxClassements.splice(index, 1)
    setClassements(nouveauxClassements)
  }

  const updateClassement = (index, field, value) => {
    const nouveauxClassements = [...classements]
    nouveauxClassements[index][field] = value
    setClassements(nouveauxClassements)
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 mb-20">
      {/* Première carte - Informations générales */}
      <Card className="shadow-md border border-gray-200 mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#1216B4]">Info sur la conférence / le journal de l'article</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Thématique */}
            <div className="space-y-2">
              <Label htmlFor="thematique" className="text-[#1216B4]">Thématique</Label>
              <Input
                id="thematique"
                placeholder="Thématique du journal"
                className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
              />
            </div>
            
            {/* Scope */}
            <div className="space-y-2">
              <Label htmlFor="scope" className="text-[#1216B4]">Scope</Label>
              <Textarea
                id="scope"
                placeholder="Scope du journal ....."
                className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                rows={3}
              />
            </div>
            
            {/* Lieu et Périodicité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lieu" className="text-[#1216B4]">Lieu</Label>
                <Input
                  id="lieu"
                  type="email"
                  placeholder="exemple@email.com"
                  className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodicite" className="text-[#1216B4]">Periodicité</Label>
                <Input
                  id="periodicite"
                  placeholder="Numéro de téléphone"
                  className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                />
              </div>
            </div>
            
            {/* Période */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-debut" className="text-[#1216B4]">Période</Label>
                <Input
                  id="date-debut"
                  placeholder="date début"
                  className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-fin" className="opacity-0 text-[#1216B4]">Date fin</Label>
                <Input
                  id="date-fin"
                  placeholder="date fin"
                  className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deuxième carte - Classements */}
      <Card className="shadow-md border border-gray-200 mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#1216B4]">Classement du journal / Conférence</h2>
        </CardHeader>
        <CardContent>
          {classements.map((item, index) => (
            <div key={index} className="mb-8 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              {/* En-tête du classement avec numéro et bouton de suppression */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[#1216B4]">Classement {index + 1}</h3>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => supprimerClassement(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Site et Classement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`site-${index}`} className="text-[#1216B4]">Site de classement</Label>
                  <Input
                    id={`site-${index}`}
                    placeholder="ex: Scimago, DGRSDT .."
                    className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                    value={item.site}
                    onChange={(e) => updateClassement(index, 'site', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`classement-${index}`} className="text-[#1216B4]">le classement</Label>
                  <Input
                    id={`classement-${index}`}
                    placeholder="ex : A , B ..."
                    className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                    value={item.classement}
                    onChange={(e) => updateClassement(index, 'classement', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Lien */}
              <div className="space-y-2">
                <Label htmlFor={`lien-${index}`} className="text-[#1216B4]">Lien vers le classment</Label>
                <Input
                  id={`lien-${index}`}
                  placeholder="https://www.scimagojr.com/"
                  className="border-[#1216B4] focus:ring-[#1216B4] focus-visible:ring-[#1216B4]"
                  value={item.lien}
                  onChange={(e) => updateClassement(index, 'lien', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          {/* Bouton d'ajout */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-dashed border-[#1216B4] text-[#1216B4] hover:bg-blue-50 mt-4"
            onClick={ajouterClassement}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter un classement
          </Button>
        </CardContent>
      </Card>

      {/* Bouton Sauvegarder */}
      <div className="flex justify-end">
        <Button className="bg-[#1216B4] hover:bg-[#0e1290]">Sauvegarder</Button>
      </div>
    </div>
  )
}