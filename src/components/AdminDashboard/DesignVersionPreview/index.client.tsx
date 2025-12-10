'use client'
import * as React from 'react'
import { useField, useModal, Button, Drawer, XIcon } from '@payloadcms/ui'
import { useState, useMemo } from 'react'
import { DesignVersionPreviewOptions } from './config'
import './index.scss'

type DesignVersionPreviewProps = {
  path: string
  options: DesignVersionPreviewOptions
}

const DesignVersionPreviewClient: React.FC<DesignVersionPreviewProps> = ({
  path,
  options = [],
}) => {
  const { setValue, value } = useField<string>({ path })
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({})

  // Use the useModal hook instead of local state
  const { toggleModal } = useModal()
  const drawerSlug = `design-version-preview-drawer-${path}`

  // Ensure options is always an array using useMemo
  const safeOptions = useMemo(() => {
    return Array.isArray(options) ? options : []
  }, [options])

  // Create a mapping of design version values to their image paths derived from options
  const imagePaths = useMemo(() => {
    const paths: Record<string, string> = {}

    safeOptions.forEach((option) => {
      if (option.image) {
        // For images in the public directory
        paths[option.value] = option.image
      }
    })

    return paths
  }, [safeOptions])

  const handleSelectVersion = (version: string) => {
    setValue(version)
    toggleModal(drawerSlug)
  }

  const handleImageError = (version: string) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [version]: true,
    }))
  }

  // Find the currently selected option
  const selectedOption =
    safeOptions && safeOptions.length > 0
      ? safeOptions.find((opt) => opt.value === value) || safeOptions[0]
      : { label: 'Default', value: '', image: undefined }

  const getImageUrl = (imagePath: string | undefined): string | undefined => {
    if (!imagePath) return undefined

    // If it's already an absolute URL, return as is
    if (imagePath.startsWith('http')) return imagePath

    // For relative paths, ensure they start with a slash
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`

    // Return the full URL for the image
    return `${window.location.origin}${path}`
  }

  const handleOpenDrawer = () => {
    toggleModal(drawerSlug)
  }

  return (
    <div className="field-type design-version-preview">
      <div className="field-label-wrapper">
        <label className="field-label">Design Version</label>
      </div>

      <div className="design-version-preview__container">
        <div className="design-version-preview__header">
          {/* Selected design version name and button in one line */}
          <div className="design-version-preview__header-content">
            {value && selectedOption && (
              <div className="design-version-preview__selected">
                <div className="design-version-preview__selected-name">{selectedOption.label}</div>
              </div>
            )}

            {/* Button to open drawer */}
            <Button
              className="design-version-preview__button"
              onClick={handleOpenDrawer}
              buttonStyle="secondary"
              size="small"
            >
              <div className="design-version-preview__button-content">
                <span>Preview All</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="design-version-preview__chevron"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Button>
          </div>

          {/* Description below the header */}
          {value && selectedOption?.description && (
            <div className="design-version-preview__description">{selectedOption.description}</div>
          )}
        </div>

        {/* Preview of selected design */}
        {value &&
          selectedOption?.image &&
          !imageLoadErrors[value] &&
          safeOptions &&
          safeOptions.length > 0 && (
            <div className="design-version-preview__image-preview">
              <div className="design-version-preview__selected-image-container">
                <img
                  src={getImageUrl(imagePaths[value])}
                  alt={selectedOption.label}
                  className="design-version-preview__selected-image"
                  onError={() => handleImageError(value)}
                />
              </div>
            </div>
          )}
      </div>

      {/* Drawer for selecting design versions */}
      <Drawer className="design-version-preview-drawer" slug={drawerSlug} Header={null}>
        <div className="drawer__header">
          <h2 className="drawer__header__title">Select Design Version</h2>
          <button
            aria-label="Close"
            className="drawer__header__close"
            id={`close-drawer__${drawerSlug}`}
            onClick={() => toggleModal(drawerSlug)}
            type="button"
          >
            <XIcon />
          </button>
        </div>
        <div className="drawer__content">
          <div className="design-version-preview-drawer__grid">
            {safeOptions && safeOptions.length > 0 ? (
              safeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`design-version-preview-drawer__item ${value === option.value ? 'design-version-preview-drawer__item--selected' : ''}`}
                  onClick={() => handleSelectVersion(option.value)}
                >
                  <div className="design-version-preview-drawer__item-image-container">
                    {option.image && !imageLoadErrors[option.value] ? (
                      <img
                        src={getImageUrl(imagePaths[option.value])}
                        alt={option.label}
                        className="design-version-preview-drawer__item-image"
                        onError={() => handleImageError(option.value)}
                      />
                    ) : (
                      <div className="design-version-preview-drawer__item-placeholder">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {value === option.value && (
                      <div className="design-version-preview-drawer__item-selected-indicator">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="design-version-preview-drawer__item-name">{option.label}</div>
                </div>
              ))
            ) : (
              <div className="design-version-preview-drawer__empty">
                No design versions available
              </div>
            )}
          </div>

          <div className="design-version-preview-drawer__help-text">
            Click on a design version to select it and close this drawer
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default DesignVersionPreviewClient
