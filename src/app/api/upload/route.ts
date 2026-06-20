import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = file.name.toLowerCase()

  try {
    let text = ''

    if (fileName.endsWith('.pdf')) {
      // PDF parsing - in production use pdf-parse
      text = buffer.toString('utf-8')
    } else if (fileName.endsWith('.docx')) {
      // DOCX parsing - in production use mammoth
      text = buffer.toString('utf-8')
    } else {
      text = buffer.toString('utf-8')
    }

    const { analyzeTender } = await import('@/lib/ai')
    const result = await analyzeTender(text)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
  }
}
