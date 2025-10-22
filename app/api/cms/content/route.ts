import { NextRequest, NextResponse } from 'next/server'
import { cmsClient } from '@/lib/cms/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const refresh = searchParams.get('refresh') === 'true'

    // Buscar conteúdo do CMS
    const content = await cmsClient.getAllContent(!refresh)

    if (!content) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Conteúdo não encontrado no CMS',
          code: 'CMS_CONTENT_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ok: true,
      data: content,
      timestamp: new Date().toISOString(),
      cached: !refresh
    })

  } catch (error) {
    console.error('CMS API Error:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// Método POST para limpar cache
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.action === 'clear_cache') {
      await cmsClient.clearCache()

      return NextResponse.json({
        ok: true,
        message: 'Cache do CMS limpo com sucesso',
        timestamp: new Date().toISOString()
      })
    }

    if (body.action === 'refresh_content') {
      const content = await cmsClient.refreshContent()

      return NextResponse.json({
        ok: true,
        data: content,
        message: 'Conteúdo do CMS atualizado',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Ação não suportada',
        code: 'INVALID_ACTION'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('CMS API POST Error:', error)

    return NextResponse.json(
      {
        ok: false,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}
