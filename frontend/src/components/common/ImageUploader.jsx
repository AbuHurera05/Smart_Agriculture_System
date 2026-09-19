import { useRef, useState } from 'react'
import { Upload, X, Loader2, ImagePlus, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { mediaAPI } from '../../services/api'
import { UPLOAD_MAX_BYTES, UPLOAD_ACCEPTED_TYPES } from '../../utils/constants'
import { getApiErrorMessage } from '../../utils/apiError'

/**
 * Pick images from the device and upload them to marketplace-service, which
 * returns a ready-to-use public URL. Sellers no longer need to host an image
 * somewhere else and paste a link.
 *
 * Props:
 *   value        string (single) | string[] (multiple) — current image URL(s)
 *   onChange     (next) => void — same shape as `value`
 *   multiple     allow a gallery (default false)
 *   max          max images when multiple (default 6)
 *   folder       'products' | 'stores' | 'payments' | 'misc'
 *   label        field label
 *   allowUrl     also let the user paste a URL manually (default true)
 */
export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  max = 6,
  folder = 'products',
  label = 'Image',
  allowUrl = true,
  disabled = false,
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')

  const urls = multiple
    ? (Array.isArray(value) ? value.filter(Boolean) : [])
    : (value ? [value] : [])

  const emit = (nextUrls) => {
    onChange(multiple ? nextUrls : (nextUrls[0] || ''))
  }

  const validate = (files) => {
    for (const file of files) {
      if (!UPLOAD_ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG, WEBP or GIF images are allowed`)
        return false
      }
      if (file.size > UPLOAD_MAX_BYTES) {
        toast.error(`${file.name} is larger than 5 MB`)
        return false
      }
    }
    return true
  }

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return

    const room = multiple ? max - urls.length : 1
    if (room <= 0) {
      toast.error(`You can upload at most ${max} images`)
      return
    }

    const selected = files.slice(0, room)
    if (!validate(selected)) return

    setUploading(true)
    setProgress(0)

    try {
      const onProgress = (e) => {
        if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
      }

      let uploaded = []

      if (selected.length === 1) {
        const res = await mediaAPI.upload(selected[0], folder, onProgress)
        const data = res.data?.data ?? res.data
        if (data?.url) uploaded = [data.url]
      } else {
        const res = await mediaAPI.uploadMultiple(selected, folder, onProgress)
        const data = res.data?.data ?? res.data ?? []
        uploaded = (Array.isArray(data) ? data : []).map((d) => d.url).filter(Boolean)
      }

      if (!uploaded.length) {
        toast.error('Upload finished but no image URL came back. Please try again.')
        return
      }

      emit(multiple ? [...urls, ...uploaded] : uploaded)
      toast.success(uploaded.length > 1 ? `${uploaded.length} images uploaded` : 'Image uploaded')
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, {
          401: 'Please login to upload images.',
          413: 'That image is too large. Maximum size is 5 MB.',
        })
      )
    } finally {
      setUploading(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (index) => emit(urls.filter((_, i) => i !== index))

  const addUrl = () => {
    const trimmed = urlDraft.trim()
    if (!trimmed) return
    if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('/')) {
      toast.error('Please enter a valid image URL')
      return
    }
    emit(multiple ? [...urls, trimmed] : [trimmed])
    setUrlDraft('')
    setShowUrlInput(false)
  }

  const canAddMore = multiple ? urls.length < max : urls.length === 0
  const busy = disabled || uploading

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {allowUrl && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowUrlInput((v) => !v)}
            className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 disabled:opacity-50"
          >
            <Link2 size={12} /> {showUrlInput ? 'Hide URL field' : 'Use a URL instead'}
          </button>
        )}
      </div>

      {/* Existing images */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group"
            >
              <img
                src={url}
                alt={`Upload ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              {i === 0 && multiple && (
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                  Cover
                </span>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => removeAt(i)}
                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-white/90 text-danger shadow hover:bg-white disabled:opacity-50"
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!busy) setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            if (!busy) handleFiles(e.dataTransfer.files)
          }}
          onClick={() => !busy && inputRef.current?.click()}
          className={`mt-2 flex flex-col items-center justify-center gap-1 px-4 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
          } ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-primary animate-spin" />
              <p className="text-xs text-gray-500">Uploading… {progress}%</p>
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              {urls.length ? (
                <ImagePlus size={20} className="text-gray-400" />
              ) : (
                <Upload size={20} className="text-gray-400" />
              )}
              <p className="text-xs text-gray-600 font-medium">
                Click to choose {multiple ? 'images' : 'an image'} or drag &amp; drop
              </p>
              <p className="text-[11px] text-gray-400">
                JPG, PNG, WEBP or GIF · up to 5 MB
                {multiple ? ` · ${urls.length}/${max} added` : ''}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPTED_TYPES.join(',')}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {showUrlInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="url"
            className="input-field flex-1"
            placeholder="https://example.com/photo.jpg"
            value={urlDraft}
            disabled={busy}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addUrl()
              }
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={addUrl}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:border-primary hover:text-primary disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}
