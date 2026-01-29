"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { ArrowLeft, Plus, Upload, X, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, ImageIcon, Undo2, Redo2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProgramById } from '@/lib/api'

function CreateProgramContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const programId = searchParams.get('id')
  const isEditMode = !!programId

  const [formData, setFormData] = useState({
    programName: '',
    shortDescription: '',
    featureImage: null,
    sections: [
      {
        id: 1,
        title: '',
        description: '',
        image: null
      }
    ]
  })
  const [featureImagePreview, setFeatureImagePreview] = useState(null)
  const [sectionImagePreviews, setSectionImagePreviews] = useState({})
  const [isDraggingFeature, setIsDraggingFeature] = useState(false)
  const [draggingSectionId, setDraggingSectionId] = useState(null)

  // Fetch program data if in edit mode
  const { data: programData, isLoading: loadingProgram } = useQuery({
    queryKey: ['program', programId],
    queryFn: async () => {
      if (!programId) return null
      return await getProgramById(parseInt(programId))
    },
    enabled: isEditMode && !!programId,
  })

  // Helper function to get full image URL
  const getImageUrl = (image) => {
    if (!image) return null
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
    return image.startsWith('/') ? `${baseUrl}${image}` : `${baseUrl}/${image}`
  }

  // Populate form when program data is loaded
  useEffect(() => {
    if (programData && isEditMode) {
      const mappedSections = programData.sections && programData.sections.length > 0
        ? programData.sections.map((section, index) => ({
            id: section.id || index + 1,
            title: section.title || '',
            description: section.description || '',
            image: null // Don't set file, just preview
          }))
        : [
            {
              id: 1,
              title: '',
              description: '',
              image: null
            }
          ]

      setFormData({
        programName: programData.name || '',
        shortDescription: programData.short_description || '',
        featureImage: null, // Don't set file, just preview
        sections: mappedSections
      })

      // Set image previews
      if (programData.feature_image) {
        setFeatureImagePreview(getImageUrl(programData.feature_image))
      }

      // Set section image previews
      if (programData.sections) {
        const previews = {}
        programData.sections.forEach((section, index) => {
          const sectionId = mappedSections[index]?.id || section.id || index + 1
          if (section.image) {
            previews[sectionId] = getImageUrl(section.image)
          }
        })
        setSectionImagePreviews(previews)
      }
    }
  }, [programData, isEditMode])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const processFeatureImage = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        featureImage: file
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeatureImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeatureImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFeatureImage(file)
    }
  }

  const handleFeatureImageDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFeature(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      processFeatureImage(file)
    }
  }

  const handleFeatureImageDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFeature(true)
  }

  const handleFeatureImageDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingFeature(false)
  }

  const handleSectionChange = (sectionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    }))
  }

  const processSectionImage = (sectionId, file) => {
    if (file && file.type.startsWith('image/')) {
      handleSectionChange(sectionId, 'image', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSectionImagePreviews(prev => ({
          ...prev,
          [sectionId]: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSectionImageChange = (sectionId, e) => {
    const file = e.target.files[0]
    if (file) {
      processSectionImage(sectionId, file)
    }
  }

  const handleSectionImageDrop = (sectionId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingSectionId(null)
    const file = e.dataTransfer.files[0]
    if (file) {
      processSectionImage(sectionId, file)
    }
  }

  const handleSectionImageDragOver = (sectionId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingSectionId(sectionId)
  }

  const handleSectionImageDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingSectionId(null)
  }

  const addMoreSection = () => {
    const newId = Math.max(...formData.sections.map(s => s.id), 0) + 1
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: newId,
          title: '',
          description: '',
          image: null
        }
      ]
    }))
  }

  const removeSection = (sectionId) => {
    if (formData.sections.length > 1) {
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }))
      setSectionImagePreviews(prev => {
        const newPreviews = { ...prev }
        delete newPreviews[sectionId]
        return newPreviews
      })
    }
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save program:', formData)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="w-full bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold">{isEditMode ? 'Edit Program' : 'Add Program'}</h1>
      </div>

      {/* Loading State */}
      {loadingProgram && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA100]" />
          <span className="ml-2 text-gray-600">Loading program data...</span>
        </div>
      )}

      {/* Form */}
      {!loadingProgram && (
        <div className="space-y-6">
        {/* Program Name */}
        <div>
          <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-2">
            Program Name
          </label>
          <Input
            id="programName"
            name="programName"
            type="text"
            placeholder="Enter name"
            value={formData.programName}
            onChange={handleInputChange}
            className="w-full border-gray-300"
          />
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <Input
            id="shortDescription"
            name="shortDescription"
            type="text"
            placeholder="Enter description"
            value={formData.shortDescription}
            onChange={handleInputChange}
            className="w-full border-gray-300"
          />
        </div>

        {/* Feature Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feature Image
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFeatureImageChange}
              className="hidden"
              id="feature-image-upload"
            />
            <label
              htmlFor="feature-image-upload"
              onDrop={handleFeatureImageDrop}
              onDragOver={handleFeatureImageDragOver}
              onDragLeave={handleFeatureImageDragLeave}
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors ${isDraggingFeature ? 'border-gray-500 bg-gray-200' : ''}`}
            >
              {featureImagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={featureImagePreview}
                    alt="Feature preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setFeatureImagePreview(null)
                      setFormData(prev => ({ ...prev, featureImage: null }))
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Upload Image Here Or{' '}
                    <span className="text-gray-700 font-medium">Browse</span>
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Sections */}
        {formData.sections.map((section, index) => (
          <div key={section.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Section {index + 1}
              </h3>
              {formData.sections.length > 1 && (
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Section Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Tittle
              </label>
              <Input
                type="text"
                placeholder="Enter title"
                value={section.title}
                onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                className="w-full border-gray-300"
              />
            </div>

            {/* Section Description - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Description
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
               
                {/* Textarea */}
                <textarea
                  placeholder="Type Description"
                  value={section.description}
                  onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)}
                  className="w-full min-h-[200px] p-4 resize-none focus:outline-none   "
                  rows={8}
                />
              </div>
            </div>

            {/* Section Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSectionImageChange(section.id, e)}
                  className="hidden"
                  id={`section-image-upload-${section.id}`}
                />
                <label
                  htmlFor={`section-image-upload-${section.id}`}
                  onDrop={(e) => handleSectionImageDrop(section.id, e)}
                  onDragOver={(e) => handleSectionImageDragOver(section.id, e)}
                  onDragLeave={handleSectionImageDragLeave}
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors ${draggingSectionId === section.id ? 'border-gray-500 bg-gray-200' : ''}`}
                >
                  {sectionImagePreviews[section.id] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={sectionImagePreviews[section.id]}
                        alt="Section preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSectionImagePreviews(prev => {
                            const newPreviews = { ...prev }
                            delete newPreviews[section.id]
                            return newPreviews
                          })
                          handleSectionChange(section.id, 'image', null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Upload Image Here Or{' '}
                        <span className="text-gray-700 font-medium">Browse</span>
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Section Button */}
        <button
          onClick={addMoreSection}
          className="flex items-center gap-2 text-[#FFA100] hover:text-[#FFA100]/80 font-medium cursor-pointer transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add More Section
        </button>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-[#FFA100] text-[#FFA100] hover:bg-orange-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#FFA100] hover:bg-[#FFA100]/90 text-white cursor-pointer"
          >
            {isEditMode ? 'Update Program' : 'Save Program'}
          </Button>
        </div>
      </div>
      )}
    </div>
  )
}

export default function CreateProgram() {
  return (
    <Suspense fallback={
      <div className="w-full bg-white rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA100]" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    }>
      <CreateProgramContent />
    </Suspense>
  )
}
