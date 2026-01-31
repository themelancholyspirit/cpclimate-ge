import { NextRequest, NextResponse } from 'next/server'

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN

// POST /api/upload - Upload files to Directus
export async function POST(request: NextRequest) {
  try {
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
      console.error('Missing Directus configuration')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Upload each file to Directus
    const uploadPromises = files.map(async (file) => {
      const directusFormData = new FormData()
      directusFormData.append('file', file)

      const response = await fetch(`${DIRECTUS_URL}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: directusFormData,
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Directus upload error:', error)
        throw new Error(`Failed to upload file: ${file.name}`)
      }

      const data = await response.json()
      return data.data.id // Return the file ID
    })

    const fileIds = await Promise.all(uploadPromises)

    return NextResponse.json({ fileIds }, { status: 200 })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}
